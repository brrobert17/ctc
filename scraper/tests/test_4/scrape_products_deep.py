import sqlite3
import os
from playwright.sync_api import sync_playwright

def scrape_products_deep():
    url = 'https://www.scrapingcourse.com/javascript-rendering'
    db_file = os.path.join(os.path.dirname(__file__), 'products_detailed.db')
    
    try:
        # Connect to SQLite database
        conn = sqlite3.connect(db_file)
        cursor = conn.cursor()
        
        # Create table
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
        
        print(f"--- Scraping Detailed Products from {url} ---")
        
        with sync_playwright() as p:
            browser = p.chromium.launch(headless=True)
            context = browser.new_context()
            page = context.new_page()
            
            print("Navigating to main page...")
            page.goto(url)
            page.wait_for_selector('.product-info')
            
            # Get all product links
            product_links = page.locator('.product-name').all()
            
            urls_to_scrape = []
            product_items = page.locator('.product-item').all()
            
            print(f"Found {len(product_items)} product cards.")
            
            for item in product_items:
                link_locator = item.locator('a').first
                href = link_locator.get_attribute('href')
                if href:
                    urls_to_scrape.append(href)
            
            urls_to_scrape = urls_to_scrape[:10]
            print(f"Will scrape {len(urls_to_scrape)} product pages.")
            
            count = 0
            for product_url in urls_to_scrape:
                try:
                    print(f"Scraping {product_url}...")
                    # Navigate to the product page
                    page.goto(product_url)
                    
                    # Wait for key elements
                    page.wait_for_selector('.product_title', timeout=10000)
                    
                    # Extract Name
                    name_locator = page.locator('.product_title')
                    name = name_locator.inner_text().strip() if name_locator.count() > 0 else "Unknown"
                    
                    # Extract Price
                    price_locator = page.locator('.price').first
                    price = price_locator.inner_text().strip() if price_locator.count() > 0 else "Unknown"
                    
                    # Extract SKU
                    sku_locator = page.locator('.sku')
                    sku = sku_locator.inner_text().strip() if sku_locator.count() > 0 else "Unknown"
                    
                    # Extract Description
                    desc_locator = page.locator('.woocommerce-product-details__short-description')
                    description = desc_locator.inner_text().strip() if desc_locator.count() > 0 else "No description"
                    
                    # Insert
                    cursor.execute('''
                        INSERT INTO products (name, price, sku, description, url) 
                        VALUES (?, ?, ?, ?, ?)
                    ''', (name, price, sku, description, product_url))
                    
                    count += 1
                    print(f"Saved: {name} | SKU: {sku}")
                    
                except Exception as e:
                    print(f"Failed to scrape {product_url}: {e}")
            
            browser.close()
            
        conn.commit()
        conn.close()
        print(f"\nSuccess! {count} products saved to {db_file}")
            
    except Exception as e:
        print(f"Global error: {e}")

if __name__ == "__main__":
    scrape_products_deep()
