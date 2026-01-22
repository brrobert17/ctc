import requests
from bs4 import BeautifulSoup

def scrape_quotes():
    url = 'https://quotes.toscrape.com/'
    
    try:
        # Fetch the HTML content
        response = requests.get(url)
        response.raise_for_status()  
        
        # Parse the HTML
        soup = BeautifulSoup(response.text, 'html.parser')
        
        # Find quote elements
        quote_elements = soup.find_all('span', class_='text', limit=5)
        
        print(f"--- Scraping Quotes from {url} ---")
        for i, quote in enumerate(quote_elements, 1):
            print(f"{i}. {quote.get_text()}")
            
    except requests.RequestException as e:
        print(f"Error fetching the URL: {e}")
    except Exception as e:
        print(f"An error occurred: {e}")

if __name__ == "__main__":
    scrape_quotes()
