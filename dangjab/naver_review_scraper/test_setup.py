# Test script to verify your setup works
from selenium import webdriver
from selenium.webdriver.chrome.service import Service
from webdriver_manager.chrome import ChromeDriverManager
from selenium.webdriver.chrome.options import Options
import pandas as pd
from bs4 import BeautifulSoup
import time

def test_setup():
    print("Testing Python libraries...")
    
    # Test Chrome setup
    try:
        print("Setting up Chrome driver...")
        chrome_options = Options()
        chrome_options.add_argument("--headless")  # Run in background
        chrome_options.add_argument("--no-sandbox")
        chrome_options.add_argument("--disable-dev-shm-usage")
        
        # This automatically downloads the correct ChromeDriver
        service = Service(ChromeDriverManager().install())
        driver = webdriver.Chrome(service=service, options=chrome_options)
        
        print("✅ Chrome driver setup successful!")
        
        # Test basic navigation
        driver.get("https://www.google.com")
        print(f"✅ Successfully navigated to Google. Page title: {driver.title}")
        
        driver.quit()
        print("✅ Browser closed successfully!")
        
    except Exception as e:
        print(f"❌ Setup error: {e}")
        return False
    
    # Test other libraries
    try:
        df = pd.DataFrame({"test": [1, 2, 3]})
        print("✅ Pandas working!")
        
        soup = BeautifulSoup("<html><body>Test</body></html>", 'html.parser')
        print("✅ BeautifulSoup working!")
        
    except Exception as e:
        print(f"❌ Library error: {e}")
        return False
    
    print("\n🎉 All setup tests passed! You're ready to start scraping.")
    return True

if __name__ == "__main__":
    test_setup()