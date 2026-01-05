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
            # We look for the anchor tag inside the product item or wrapping it
            # Inspecting the previous structure, usually the image or title is a link.
            # Let's find all links to products.
            # Selector: .product-item a (assuming standard structure) or .woocommerce-LoopProduct-link
            # Let's try to find the links within the product grid.
            
            # First, get the list of product URLs to visit
            # We'll select the anchor tag that contains the product name usually
            product_links = page.locator('.product-name').all()
            
            # Note: The .product-name span itself might not be a link, we might need to find the parent 'a' tag
            # or look for the 'a' tag inside the product card.
            # Let's use a more generic approach to find the link associated with the product.
            # Usually: <li class="product ..."> <a href="..."> ... </a> </li>
            
            # Let's grab the hrefs from the product grid items
            # The user provided HTML shows <div class="product-item ...">
            urls_to_scrape = []
            product_items = page.locator('.product-item').all()
            
            print(f"Found {len(product_items)} product cards.")
            
            for item in product_items:
                # Find the link. The structure is <div class="product-item"> <a href="..."> ...
                link_locator = item.locator('a').first
                href = link_locator.get_attribute('href')
                if href:
                    urls_to_scrape.append(href)
            
            # Limit to 10 for testing
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
                    # Usually h1.product_title
                    name_locator = page.locator('.product_title')
                    name = name_locator.inner_text().strip() if name_locator.count() > 0 else "Unknown"
                    
                    # Extract Price
                    # Usually p.price or span.price
                    price_locator = page.locator('.price').first
                    price = price_locator.inner_text().strip() if price_locator.count() > 0 else "Unknown"
                    
                    # Extract SKU
                    # <span class="sku_wrapper">SKU: <span class="sku">MH04</span></span>
                    sku_locator = page.locator('.sku')
                    sku = sku_locator.inner_text().strip() if sku_locator.count() > 0 else "Unknown"
                    
                    # Extract Description
                    # <div class="woocommerce-product-details__short-description"> <p>...</p> </div>
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
