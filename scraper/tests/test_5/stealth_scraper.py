import time
import random
import sqlite3
import os
from playwright.sync_api import sync_playwright

def random_sleep(min_seconds=1.0, max_seconds=3.0):
    """Sleeps for a random amount of time to mimic human behavior."""
    sleep_time = random.uniform(min_seconds, max_seconds)
    print(f"  (Sleeping for {sleep_time:.2f}s...)")
    time.sleep(sleep_time)

def human_mouse_move(page, selector):
    """
    Moves the mouse to the element with a bit of 'human' inaccuracy
    before performing the action.
    """
    element = page.locator(selector).first
    box = element.bounding_box()
    
    if box:
        # Calculate the center
        x = box['x'] + box['width'] / 2
        y = box['y'] + box['height'] / 2
        
        # Add some random noise/offset (simulating imperfect aiming)
        offset_x = random.uniform(-10, 10)
        offset_y = random.uniform(-10, 10)
        
        # Move the mouse
        page.mouse.move(x + offset_x, y + offset_y, steps=10)
        random_sleep(0.1, 0.3) # Small pause before clicking

def scrape_stealth():
    url = 'https://www.scrapingcourse.com/javascript-rendering'
    db_file = os.path.join(os.path.dirname(__file__), 'products_stealth.db')
    
    # Common User-Agents to rotate (Simulating different browsers)
    user_agents = [
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
        "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.1.1 Safari/605.1.15",
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:89.0) Gecko/20100101 Firefox/89.0"
    ]
    
    selected_ua = random.choice(user_agents)
    print(f"Using User-Agent: {selected_ua}")
    
    try:
        conn = sqlite3.connect(db_file)
        cursor = conn.cursor()
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS products (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                name TEXT,
                price TEXT,
                sku TEXT,
                description TEXT,
                url TEXT
            )
        ''')
        
        with sync_playwright() as p:
            # Launch with specific args to look more like a real browser
            browser = p.chromium.launch(
                headless=False, # Visible for debugging
                args=["--disable-blink-features=AutomationControlled"] # Helps hide Playwright
            )
            
            context = browser.new_context(
                user_agent=selected_ua,
                viewport={'width': 1280, 'height': 720} # Set a standard window size
            )
            
            page = context.new_page()
            
            print("Navigating to main page...")
            page.goto(url)
            random_sleep(2, 4) # Wait for initial load
            
            urls_to_scrape = []
            product_items = page.locator('.product-item').all()
            
            print(f"Found {len(product_items)} product cards.")
            
            for item in product_items:
                link_locator = item.locator('a').first
                href = link_locator.get_attribute('href')
                if href:
                    urls_to_scrape.append(href)
            
            # Limit to 3 to demonstrate the behavior without waiting too long
            urls_to_scrape = urls_to_scrape[:3]
            
            count = 0
            for product_url in urls_to_scrape:
                try:
                    print(f"Scraping {product_url}...")
                    page.goto(product_url)
                    
                    # Random delay after page load
                    random_sleep(1, 2.5)
                    
                    # Simulate reading (scrolling down)
                    page.mouse.wheel(0, 300)
                    random_sleep(0.5, 1.5)
                    
                    # Move mouse towards the title (just to show "activity")
                    human_mouse_move(page, '.product_title')
                    
                    # Extract Data
                    name_locator = page.locator('.product_title')
                    name = name_locator.inner_text().strip() if name_locator.count() > 0 else "Unknown"
                    
                    price_locator = page.locator('.price').first
                    price = price_locator.inner_text().strip() if price_locator.count() > 0 else "Unknown"
                    
                    sku_locator = page.locator('.sku')
                    sku = sku_locator.inner_text().strip() if sku_locator.count() > 0 else "Unknown"
                    
                    desc_locator = page.locator('.woocommerce-product-details__short-description')
                    description = desc_locator.inner_text().strip() if desc_locator.count() > 0 else "No description"
                    
                    cursor.execute('''
                        INSERT INTO products (name, price, sku, description, url) 
                        VALUES (?, ?, ?, ?, ?)
                    ''', (name, price, sku, description, product_url))
                    
                    count += 1
                    print(f"Saved: {name}")
                    
                except Exception as e:
                    print(f"Failed to scrape {product_url}: {e}")
            
            browser.close()
            
        conn.commit()
        conn.close()
        print(f"\nSuccess! {count} products saved to {db_file}")
            
    except Exception as e:
        print(f"Global error: {e}")

if __name__ == "__main__":
    scrape_stealth()
