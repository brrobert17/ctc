import json
import os
import re
import sqlite3
from typing import Any


ROOT_DIR = os.path.dirname(__file__)
MAPPING_FILE = os.path.join(ROOT_DIR, "mapping.json")
SCHEMA_FILE = os.path.join(ROOT_DIR, "schema.sql")
OUT_FILE = os.path.join(ROOT_DIR, "populate.sql")


def _sql_str(value: str | None) -> str:
    if value is None:
        return "NULL"
    return "'" + value.replace("'", "''") + "'"


def _sql_int(value: int | None) -> str:
    if value is None:
        return "NULL"
    return str(value)


def _as_str(value: Any) -> str | None:
    if value is None:
        return None
    if isinstance(value, str):
        s = value.strip()
        return s or None
    if isinstance(value, (int, float, bool)):
        return str(value)
    return json.dumps(value, ensure_ascii=False)


def _as_int(value: Any) -> int | None:
    if value is None:
        return None
    if isinstance(value, bool):
        return int(value)
    if isinstance(value, int):
        return value
    if isinstance(value, float):
        return int(value)
    if isinstance(value, str):
        s = value.strip()
        if not s:
            return None
        digits = re.sub(r"[^0-9]", "", s)
        if not digits:
            return None
        try:
            return int(digits)
        except ValueError:
            return None
    return None


def _int_dkk(value: Any) -> int | None:
    s = _as_str(value)
    if not s:
        return None
    s = s.replace("\xa0", " ")
    s = s.lower().replace("kr.", "").replace("kr", "")
    digits = re.sub(r"[^0-9]", "", s)
    if not digits:
        return None
    try:
        return int(digits)
    except ValueError:
        return None


def _load_mapping() -> dict[str, Any]:
    with open(MAPPING_FILE, "r", encoding="utf-8") as f:
        data = json.load(f)
    if not isinstance(data, dict):
        raise ValueError("mapping.json must be a JSON object")
    return data


def _read_text(path: str) -> str:
    with open(path, "r", encoding="utf-8") as f:
        return f.read()


def _read_listings(db_path: str) -> list[tuple[int, str | None, str | None, str | None]]:
    conn = sqlite3.connect(db_path)
    try:
        rows = conn.execute("SELECT id, name, price, attributes_json FROM listings").fetchall()
        return [(int(r[0]), r[1], r[2], r[3]) for r in rows]
    finally:
        conn.close()


def _load_attrs(attributes_json: str | None) -> dict[str, Any]:
    if not attributes_json:
        return {}
    try:
        obj = json.loads(attributes_json)
    except Exception:
        return {}
    if isinstance(obj, dict):
        return obj
    return {}


def _get_from(row: dict[str, Any], attrs: dict[str, Any], source_name: str, spec: str) -> Any:
    if spec == "source_name":
        return source_name

    if spec.startswith("sqlite:"):
        key = spec.split(":", 1)[1]
        return row.get(key)

    if spec.startswith("attr:"):
        key = spec.split(":", 1)[1]
        return attrs.get(key)

    return None


def _cast(value: Any, value_type: str) -> Any:
    if value_type == "int":
        return _as_int(value)
    if value_type == "int_dkk":
        return _int_dkk(value)
    return _as_str(value)


def _emit_insert(table: str, columns: list[str], values_sql: list[str], conflict_cols: list[str] | None) -> str:
    cols = ",".join(f'"{c}"' for c in columns)
    vals = ",".join(values_sql)
    stmt = f'INSERT INTO "{table}" ({cols}) VALUES ({vals})'
    if conflict_cols:
        on_cols = ",".join(f'"{c}"' for c in conflict_cols)
        stmt += f' ON CONFLICT ({on_cols}) DO NOTHING'
    return stmt + ";\n"


def _emit_dim_insert(dim: dict[str, Any], value: str | None, depends_value_id_sql: str | None) -> str | None:
    if not value:
        return None

    table = dim["table"]
    value_column = dim["value_column"]
    unique_cols = dim["unique"]

    if depends_value_id_sql is not None:
        columns = ["make_id", value_column]
        values_sql = [depends_value_id_sql, _sql_str(value)]
    else:
        columns = [value_column]
        values_sql = [_sql_str(value)]

    return _emit_insert(table, columns, values_sql, unique_cols)


def _emit_car_insert(mapping: dict[str, Any], car: dict[str, Any], fk_sql: dict[str, str]) -> str:
    car_cfg = mapping["car"]

    columns: list[str] = []
    values_sql: list[str] = []

    for dim in mapping.get("normalize", []):
        fk_col = dim.get("car_fk")
        if isinstance(fk_col, str) and fk_col in fk_sql:
            columns.append(fk_col)
            values_sql.append(fk_sql[fk_col])

    for col_spec in car_cfg["columns"]:
        column = col_spec["column"]
        columns.append(column)
        value = car.get(column)
        if isinstance(value, int) or value is None:
            values_sql.append(_sql_int(value))
        else:
            values_sql.append(_sql_str(_as_str(value)))

    conflict_cols = car_cfg["natural_key"]
    return _emit_insert(car_cfg["table"], columns, values_sql, conflict_cols)


def _emit_feature_inserts(mapping: dict[str, Any], features: list[str], car_id_sql: str) -> list[str]:
    cfg = mapping.get("features")
    if not isinstance(cfg, dict):
        return []

    feat_table = cfg["feature_table"]
    feat_value_col = cfg["feature_value_column"]
    feat_unique = cfg["feature_unique"]

    link_table = cfg["link_table"]
    link_car_fk = cfg["link_car_fk"]
    link_feat_fk = cfg["link_feature_fk"]

    out: list[str] = []

    for feat in sorted(set(features)):
        if not feat:
            continue
        out.append(_emit_insert(feat_table, [feat_value_col], [_sql_str(feat)], feat_unique))
        feat_id_sql = f'(SELECT "id" FROM "{feat_table}" WHERE "{feat_value_col}" = {_sql_str(feat)})'
        out.append(
            _emit_insert(
                link_table,
                [link_car_fk, link_feat_fk],
                [car_id_sql, feat_id_sql],
                [link_car_fk, link_feat_fk],
            )
        )

    return out


def export() -> None:
    if not os.path.exists(MAPPING_FILE):
        raise FileNotFoundError(f"Missing mapping file: {MAPPING_FILE}")
    if not os.path.exists(SCHEMA_FILE):
        raise FileNotFoundError(f"Missing schema file: {SCHEMA_FILE}")

    mapping = _load_mapping()
    schema_sql = _read_text(SCHEMA_FILE)

    dim_specs = mapping.get("normalize", [])
    if not isinstance(dim_specs, list):
        raise ValueError("mapping.normalize must be a list")

    feature_from = None
    features_cfg = mapping.get("features")
    if isinstance(features_cfg, dict) and isinstance(features_cfg.get("from"), str):
        feature_from = features_cfg["from"]

    lines: list[str] = []
    lines.append(schema_sql.rstrip() + "\n\n")

    cars_exported = 0

    for src in mapping.get("sources", []):
        if not isinstance(src, dict):
            continue
        source_name = src.get("name")
        rel_db = src.get("db")
        if not isinstance(source_name, str) or not isinstance(rel_db, str):
            continue

        db_path = os.path.join(ROOT_DIR, rel_db)
        if not os.path.exists(db_path):
            raise FileNotFoundError(f"Missing source database: {db_path}")

        for listing_id, name, price_text, attributes_json in _read_listings(db_path):
            row = {"id": listing_id, "name": name, "price": price_text, "attributes_json": attributes_json}
            attrs = _load_attrs(attributes_json)

            dim_values: dict[str, str | None] = {}
            for dim in dim_specs:
                if not isinstance(dim, dict):
                    continue
                from_spec = dim.get("from")
                if not isinstance(from_spec, str):
                    continue
                dim_val = _as_str(_get_from(row, attrs, source_name, from_spec))
                dim_values[dim.get("car_fk", "")] = dim_val

            fk_sql: dict[str, str] = {}
            for dim in dim_specs:
                if not isinstance(dim, dict):
                    continue
                car_fk = dim.get("car_fk")
                table = dim.get("table")
                value_column = dim.get("value_column")
                unique_cols = dim.get("unique")
                if not isinstance(car_fk, str) or not isinstance(table, str) or not isinstance(value_column, str):
                    continue
                if not isinstance(unique_cols, list):
                    continue

                val = dim_values.get(car_fk)

                depends = dim.get("depends_on")
                depends_value_id_sql = None
                if isinstance(depends, dict):
                    depends_fk = depends.get("car_fk")
                    depends_table = depends.get("table")
                    depends_value_column = depends.get("value_column")
                    if (
                        isinstance(depends_fk, str)
                        and isinstance(depends_table, str)
                        and isinstance(depends_value_column, str)
                    ):
                        depends_val = dim_values.get(depends_fk)
                        if depends_val:
                            depends_value_id_sql = (
                                f'(SELECT "id" FROM "{depends_table}" WHERE "{depends_value_column}" = {_sql_str(depends_val)})'
                            )

                ins = _emit_dim_insert(dim, val, depends_value_id_sql)
                if ins:
                    lines.append(ins)

                if depends_value_id_sql is not None:
                    fk_sql[car_fk] = (
                        f'(SELECT "id" FROM "{table}" WHERE "{value_column}" = {_sql_str(val)} '
                        f'AND "make_id" = {depends_value_id_sql})'
                    )
                else:
                    fk_sql[car_fk] = f'(SELECT "id" FROM "{table}" WHERE "{value_column}" = {_sql_str(val)})'

            car_cfg = mapping["car"]
            car: dict[str, Any] = {}
            for col_spec in car_cfg["columns"]:
                from_spec = col_spec["from"]
                column = col_spec["column"]
                value_type = col_spec["type"]
                raw = _get_from(row, attrs, source_name, from_spec)
                car[column] = _cast(raw, value_type)

            lines.append(_emit_car_insert(mapping, car, fk_sql))
            cars_exported += 1

            if feature_from:
                raw_features = _get_from(row, attrs, source_name, feature_from)
                features: list[str] = []
                if isinstance(raw_features, list):
                    for item in raw_features:
                        s = _as_str(item)
                        if s:
                            features.append(s)

                car_id_sql = (
                    f'(SELECT "id" FROM "{car_cfg["table"]}" '
                    f'WHERE "source" = {_sql_str(source_name)} AND "source_listing_id" = {_sql_int(listing_id)})'
                )
                lines.extend(_emit_feature_inserts(mapping, features, car_id_sql))

    lines.append("\nCOMMIT;\n")

    with open(OUT_FILE, "w", encoding="utf-8") as f:
        f.writelines(lines)

    print(f"Wrote populate SQL to: {OUT_FILE}")
    print(f"Cars exported: {cars_exported}")


def main() -> None:
    export()


if __name__ == "__main__":
    main()
