import json
import os
import sqlite3
import time

from playwright.sync_api import sync_playwright


START_URL = "https://www.bilbasen.dk/brugt/bil?includeengroscvr=true&includeleasing=false"
TARGET_LINKS = 100

ATTRIBUTE_KEYS_DB_FILE = os.path.join(os.path.dirname(__file__), "bilbasen_attribute_keys.db")
OUT_DB_FILE = os.path.join(os.path.dirname(__file__), "bilbasen_listings.db")

ATTRIBUTE_KEY_MAPPING_FILE = os.path.join(
    os.path.dirname(os.path.dirname(__file__)),
    "attribute_key_mapping_and_translation.json",
)

LISTING_CARD_SELECTOR = "article.Listing_listing__XwaYe"
LISTING_LINK_SELECTOR = "a.Listing_link__6Z504"
NEXT_PAGE_SELECTOR = 'a[data-e2e="pagination-next"]'

COOKIE_REJECT_SELECTORS = [
    "button.sp_choice_type_REJECT_ALL",
    "button:has-text('Afvis alle')",
    "button:has-text('Kun nødvendige')",
    "button:has-text('Nødvendige')",
    "button:has-text('Afvis')",
    "button:has-text('Reject all')",
    "button:has-text('Reject')",
    "button:has-text('Decline')",
]

DETAILS_FACT_ROW_SELECTOR = "tr.bas-MuiTableRow-root"
EQUIPMENT_ITEM_SELECTOR = '[data-e2e="car-equipment-item"]'

NAME_SELECTOR = '[data-e2e="car-make-model-variant"]'
PRICE_SELECTOR = '[data-e2e="car-retail-price"]'


def load_attribute_key_mapping() -> tuple[dict[str, str], set[str]]:
    with open(ATTRIBUTE_KEY_MAPPING_FILE, "r", encoding="utf-8") as f:
        data = json.load(f)

    da_to_en: dict[str, str] = {}
    for en_key, da_variants in data.items():
        if not isinstance(en_key, str) or not isinstance(da_variants, list):
            continue
        for da_key in da_variants:
            if isinstance(da_key, str) and da_key:
                da_to_en[da_key] = en_key

    return da_to_en, set(da_to_en.keys())


def sleep(seconds: float) -> None:
    time.sleep(max(0.0, seconds))


def handle_cookies(page) -> None:
    modal = page.locator("div.message.type-modal").first
    try:
        if not modal.count() or not modal.is_visible():
            return
    except Exception:
        return

    deadline = time.time() + 8
    while time.time() < deadline:
        for sel in COOKIE_REJECT_SELECTORS:
            btn = page.locator(sel).first
            if btn.count() and btn.is_visible():
                btn.click(timeout=2000)
                sleep(1)
                return
        sleep(0.5)


def read_attribute_keys() -> list[str]:
    if not os.path.exists(ATTRIBUTE_KEYS_DB_FILE):
        raise FileNotFoundError(
            f"Attribute keys DB not found: {ATTRIBUTE_KEYS_DB_FILE}. Run scrape_attribute_keys.py first."
        )

    conn = sqlite3.connect(ATTRIBUTE_KEYS_DB_FILE)
    try:
        rows = conn.execute(
            "SELECT key_name FROM attribute_keys ORDER BY key_name ASC"
        ).fetchall()
        return [r[0] for r in rows if r and r[0]]
    finally:
        conn.close()


def init_out_db() -> sqlite3.Connection:
    conn = sqlite3.connect(OUT_DB_FILE)
    conn.execute(
        """
        CREATE TABLE IF NOT EXISTS listings (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT,
            price TEXT,
            attributes_json TEXT
        )
        """
    )
    conn.commit()
    return conn


def collect_detail_links(page) -> list[str]:
    links: list[str] = []
    cards = page.locator(LISTING_CARD_SELECTOR)

    for i in range(cards.count()):
        card = cards.nth(i)
        a = card.locator(LISTING_LINK_SELECTOR).first
        href = a.get_attribute("href")
        if not href:
            continue
        if href.startswith("/"):
            href = "https://www.bilbasen.dk" + href
        links.append(href)

    return links


def go_next_page(page) -> bool:
    next_btn = page.locator(NEXT_PAGE_SELECTOR).first
    if not next_btn.count() or not next_btn.is_visible():
        return False

    href = next_btn.get_attribute("href")
    if not href:
        return False
    if href.startswith("/"):
        href = "https://www.bilbasen.dk" + href

    page.goto(href)
    page.wait_for_load_state("domcontentloaded")
    page.wait_for_selector(LISTING_CARD_SELECTOR, timeout=15000)
    return True


def extract_listing(page, allowed_keys: set[str]) -> tuple[str | None, str | None, dict[str, object]]:
    name = None
    price = None

    try:
        if page.locator(NAME_SELECTOR).count():
            name = page.locator(NAME_SELECTOR).first.inner_text().strip().replace("\n", " ")
    except Exception:
        name = None

    try:
        if page.locator(PRICE_SELECTOR).count():
            price = page.locator(PRICE_SELECTOR).first.inner_text().strip()
    except Exception:
        price = None

    attributes: dict[str, object] = {}

    rows = page.locator(DETAILS_FACT_ROW_SELECTOR)
    for i in range(rows.count()):
        row = rows.nth(i)
        try:
            th = row.locator("th").first
            td = row.locator("td").first
            if not th.count() or not td.count():
                continue
            k = (th.inner_text() or "").strip()
            v = (td.inner_text() or "").strip()
            if not k or k not in allowed_keys:
                continue
            attributes[k] = v
        except Exception:
            continue

    equipment: list[str] = []
    items = page.locator(EQUIPMENT_ITEM_SELECTOR)
    for i in range(items.count()):
        try:
            txt = (items.nth(i).inner_text() or "").strip()
            if txt and txt in allowed_keys:
                equipment.append(txt)
        except Exception:
            continue

    if equipment:
        attributes["Udstyr"] = sorted(set(equipment))

    return name, price, attributes


def translate_attributes(attrs: dict[str, object], da_to_en: dict[str, str]) -> dict[str, object]:
    translated: dict[str, object] = {}

    for da_key, value in attrs.items():
        if da_key == "Udstyr" and isinstance(value, list):
            translated_equipment: list[str] = []
            for item in value:
                if isinstance(item, str) and item in da_to_en:
                    translated_equipment.append(da_to_en[item])
                elif isinstance(item, str):
                    translated_equipment.append(item)
            translated["Equipment"] = sorted(set(translated_equipment))
            continue

        en_key = da_to_en.get(da_key)
        if en_key:
            translated[en_key] = value
        else:
            translated[da_key] = value

    return translated


def main() -> None:
    da_to_en, allowed_keys = load_attribute_key_mapping()

    print(f"Loaded {len(allowed_keys)} attribute keys from: {ATTRIBUTE_KEY_MAPPING_FILE}")

    out_conn = init_out_db()

    with sync_playwright() as p:
        browser = p.chromium.launch(headless=False)
        page = browser.new_page()

        page.goto(START_URL)
        page.wait_for_load_state("domcontentloaded")
        handle_cookies(page)

        detail_links: list[str] = []
        seen_links: set[str] = set()

        while len(detail_links) < TARGET_LINKS:
            for link in collect_detail_links(page):
                if link in seen_links:
                    continue
                seen_links.add(link)
                detail_links.append(link)
                if len(detail_links) >= TARGET_LINKS:
                    break

            if len(detail_links) >= TARGET_LINKS:
                break
            if not go_next_page(page):
                break
            handle_cookies(page)

        print(f"Collected {len(detail_links)} detail links. Starting detail scraping...")

        for idx, link in enumerate(detail_links, 1):
            print(f"[{idx}/{len(detail_links)}] {link}")

            try:
                page.goto(link)
                page.wait_for_load_state("domcontentloaded")
                handle_cookies(page)

                name, price, attrs = extract_listing(page, allowed_keys)
                attrs_en = translate_attributes(attrs, da_to_en)

                out_conn.execute(
                    "INSERT INTO listings (name, price, attributes_json) VALUES (?, ?, ?)",
                    (name, price, json.dumps(attrs_en, ensure_ascii=False)),
                )
                out_conn.commit()

            except Exception as e:
                print(f"  ERROR: Failed to scrape {link}: {e}")
                continue

        browser.close()

    out_conn.close()
    print(f"Saved listings to: {OUT_DB_FILE}")


if __name__ == "__main__":
    main()
