import requests
import sqlite3
from bs4 import BeautifulSoup
import os

def scrape_quotes():
    url = 'https://quotes.toscrape.com/'
    # Database file in the same directory as the script
    db_file = os.path.join(os.path.dirname(__file__), 'quotes.db')
    
    try:
        # Connect to SQLite database
        conn = sqlite3.connect(db_file)
        cursor = conn.cursor()
        
        # Create table if it doesn't exist
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS quotes (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                text TEXT,
                author TEXT
            )
        ''')
        
        # We limit to 50 as requested
        total_limit = 50
        quotes_collected = 0
        page_num = 1
        
        print(f"--- Scraping Quotes and Authors from {url} ---")
        
        while quotes_collected < total_limit:
            page_url = f'{url}page/{page_num}/'
            try:
                response = requests.get(page_url)
                if response.status_code == 404: # Stop if page not found
                     break
                response.raise_for_status()
            except requests.RequestException:
                 break # Stop on request error or if no more pages
            
            # Parse the HTML
            soup = BeautifulSoup(response.text, 'html.parser')
            
            # Find quote containers
            quote_divs = soup.find_all('div', class_='quote')
            
            if not quote_divs: # Stop if no quotes on the page
                 break
                 
            for div in quote_divs:
                if quotes_collected >= total_limit:
                    break
                    
                # Extract text
                text_elem = div.find('span', class_='text')
                quote_text = text_elem.get_text(strip=True) if text_elem else "No text found"
                
                # Extract author
                author_elem = div.find('small', class_='author')
                author_name = author_elem.get_text(strip=True) if author_elem else "Unknown"
                
                # Insert into database
                cursor.execute('INSERT INTO quotes (text, author) VALUES (?, ?)', (quote_text, author_name))
                
                quotes_collected += 1
                print(f"{quotes_collected}. \"{quote_text}\" - {author_name}")
            
            page_num += 1
            
        # Commit changes and close connection
        conn.commit()
        conn.close()
        print(f"\nData saved to SQLite database: {db_file}")
            
    except requests.RequestException as e:
        print(f"Error fetching the URL: {e}")
    except Exception as e:
        print(f"An error occurred: {e}")

if __name__ == "__main__":
    scrape_quotes()
