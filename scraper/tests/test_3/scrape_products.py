import sqlite3
import os
from playwright.sync_api import sync_playwright

def scrape_products():
    url = 'https://www.scrapingcourse.com/javascript-rendering'
    # Database file in the same directory as the script
    db_file = os.path.join(os.path.dirname(__file__), 'products.db')
    
    try:
        # Connect to SQLite database
        conn = sqlite3.connect(db_file)
        cursor = conn.cursor()
        
        # Create table if it doesn't exist
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS products (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                name TEXT,
                price TEXT
            )
        ''')
        
        print(f"--- Scraping Products from {url} ---")
        
        with sync_playwright() as p:
            # Launch browser
            browser = p.chromium.launch(headless=True)
            page = browser.new_page()
            
            # Go to URL
            print("Navigating to page...")
            page.goto(url)
            
            # Wait for the products to load (since it's JS rendered)
            # We wait for the product-info selector to appear
            page.wait_for_selector('.product-info')
            
            # Find all product info elements
            # Selector based on user request: div.product-info
            products = page.locator('.product-info').all()
            
            print(f"Found {len(products)} products total.")
            
            # Limit to 10 as requested
            count = 0
            limit = 10
            
            for product in products:
                if count >= limit:
                    break
                
                # Extract name
                name_locator = product.locator('.product-name')
                product_name = name_locator.inner_text().strip() if name_locator.count() > 0 else "Unknown"
                
                # Extract price
                price_locator = product.locator('.product-price')
                product_price = price_locator.inner_text().strip() if price_locator.count() > 0 else "Unknown"
                
                # Insert into database
                cursor.execute('INSERT INTO products (name, price) VALUES (?, ?)', (product_name, product_price))
                
                count += 1
                print(f"{count}. {product_name} - {product_price}")
            
            browser.close()
            
        # Commit changes and close connection
        conn.commit()
        conn.close()
        print(f"\nData saved to SQLite database: {db_file}")
            
    except Exception as e:
        print(f"An error occurred: {e}")

if __name__ == "__main__":
    scrape_products()
