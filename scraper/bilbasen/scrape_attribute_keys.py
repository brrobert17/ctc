import os
import sqlite3
import time

from playwright.sync_api import sync_playwright


START_URL = "https://www.bilbasen.dk/brugt/bil?includeengroscvr=true&includeleasing=false"
TARGET_LINKS = 100
DB_FILE = os.path.join(os.path.dirname(__file__), "bilbasen_attribute_keys.db")

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
DETAILS_FACT_KEY_SELECTOR = "th"
EQUIPMENT_ITEM_SELECTOR = '[data-e2e="car-equipment-item"]'


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


def init_db() -> sqlite3.Connection:
    conn = sqlite3.connect(DB_FILE)
    conn.execute(
        "CREATE TABLE IF NOT EXISTS attribute_keys (key_name TEXT PRIMARY KEY)"
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


def extract_attribute_keys_from_detail_page(page) -> set[str]:
    keys: set[str] = set()

    rows = page.locator(DETAILS_FACT_ROW_SELECTOR)
    for i in range(rows.count()):
        th = rows.nth(i).locator(DETAILS_FACT_KEY_SELECTOR).first
        if th.count():
            txt = (th.inner_text() or "").strip()
            if txt:
                keys.add(txt)

    items = page.locator(EQUIPMENT_ITEM_SELECTOR)
    for i in range(items.count()):
        txt = (items.nth(i).inner_text() or "").strip()
        if txt:
            keys.add(txt)

    return keys


def main() -> None:
    conn = init_db()

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

        unique_keys: set[str] = set()

        for link in detail_links:
            page.goto(link)
            page.wait_for_load_state("domcontentloaded")
            handle_cookies(page)

            for key in extract_attribute_keys_from_detail_page(page):
                if key in unique_keys:
                    continue
                unique_keys.add(key)
                conn.execute(
                    "INSERT OR IGNORE INTO attribute_keys (key_name) VALUES (?)",
                    (key,),
                )
                conn.commit()

        browser.close()

    conn.close()
    print(f"Saved {len(unique_keys)} unique attribute keys to: {DB_FILE}")


if __name__ == "__main__":
    main()
