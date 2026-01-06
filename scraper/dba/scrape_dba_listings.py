import json
import os
import sqlite3
import time

from playwright.sync_api import sync_playwright


START_URL = "https://www.dba.dk/mobility/search/car?registration_class=1"
TARGET_LINKS = 100

OUT_DB_FILE = os.path.join(os.path.dirname(__file__), "dba_listings.db")

ATTRIBUTE_KEY_MAPPING_FILE = os.path.join(
    os.path.dirname(os.path.dirname(__file__)),
    "attribute_key_mapping_and_translation.json",
)

LISTING_CARD_SELECTOR = "article.mobility-search-ad-card"
LISTING_LINK_SELECTOR = "a.sf-search-ad-link"
NEXT_PAGE_SELECTOR = "a:has(span.sr-only:has-text('Næste side'))"

SPEC_ROW_SELECTOR = "section.key-info-section dl div"

NAME_SELECTOR = "h1.t1"
PRICE_SELECTORS = [
    "h2 span.t2",
    "span.t2",
    "span.t3.font-bold",
]

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

OMIT_KEYS = {
    "Registreringsnummer",
    "Stelnummer",
    "VIN nummer",
    "VIN-nummer",
    "VIN",
}


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
            href = "https://www.dba.dk" + href
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
        href = "https://www.dba.dk" + href

    page.goto(href)
    page.wait_for_load_state("domcontentloaded")
    page.wait_for_selector(LISTING_CARD_SELECTOR, timeout=15000)
    return True


def extract_name(page) -> str | None:
    try:
        loc = page.locator(NAME_SELECTOR).first
        if loc.count():
            return (loc.inner_text() or "").strip().replace("\n", " ")
    except Exception:
        return None
    return None


def extract_price(page) -> str | None:
    for sel in PRICE_SELECTORS:
        try:
            loc = page.locator(sel).first
            if loc.count() and loc.is_visible():
                txt = (loc.inner_text() or "").strip()
                if txt:
                    return txt
        except Exception:
            continue
    return None


def extract_specifications(page, allowed_keys: set[str]) -> dict[str, str]:
    attrs: dict[str, str] = {}

    rows = page.locator(SPEC_ROW_SELECTOR)
    for i in range(rows.count()):
        row = rows.nth(i)
        try:
            dt = row.locator("dt").first
            dd = row.locator("dd").first
            if not dt.count() or not dd.count():
                continue

            k = (dt.inner_text() or "").strip()
            v = (dd.inner_text() or "").strip()

            if not k or k in OMIT_KEYS:
                continue
            if k not in allowed_keys:
                continue
            if v:
                attrs[k] = v
        except Exception:
            continue

    return attrs


def translate_attributes(attrs: dict[str, str], da_to_en: dict[str, str]) -> dict[str, str]:
    translated: dict[str, str] = {}

    for da_key, value in attrs.items():
        en_key = da_to_en.get(da_key)
        if not en_key:
            continue
        translated[en_key] = value

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

                name = extract_name(page)
                price = extract_price(page)

                attrs_da = extract_specifications(page, allowed_keys)
                attrs_en = translate_attributes(attrs_da, da_to_en)

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
