#!/usr/bin/env python3
"""
Naver SmartStore Review Scraper
Author: Your Name
Date: 2025
"""

import requests
from bs4 import BeautifulSoup
import pandas as pd
from datetime import datetime, timedelta
import time
import re
import os
import random
from urllib.parse import urlparse

# Selenium imports
from selenium import webdriver
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.common.keys import Keys
from selenium.webdriver.common.by import By
from selenium.webdriver.chrome.service import Service
from webdriver_manager.chrome import ChromeDriverManager
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.common.exceptions import TimeoutException, NoSuchElementException

class NaverSmartStoreReviewScraper:
    def __init__(self, headless=False, conservative_mode=True):
        """Initialize the scraper with Chrome browser settings"""
        self.conservative_mode = conservative_mode
        self.setup_browser(headless)
        self.reviews_data = {
            'write_date': [],
            'product_name': [],
            'review_content': [],
            'rating': []  # We'll add this if available
        }
        self.request_count = 0
        self.start_time = time.time()
        
    def setup_browser(self, headless=False):
        """Set up Chrome browser with optimal settings"""
        print("🔧 Setting up Chrome browser...")
        
        chrome_options = Options()
        if headless:
            chrome_options.add_argument('--headless')
        
        # Anti-detection measures
        chrome_options.add_argument("--window-size=1366,768")  # Common resolution
        chrome_options.add_argument("--disable-gpu")
        chrome_options.add_argument("--disable-infobars")
        chrome_options.add_argument("--disable-extensions")
        chrome_options.add_argument('--no-sandbox')
        chrome_options.add_argument('--disable-dev-shm-usage')
        chrome_options.add_argument("--disable-blink-features=AutomationControlled")
        chrome_options.add_experimental_option("excludeSwitches", ["enable-automation"])
        chrome_options.add_experimental_option('useAutomationExtension', False)
        
        # Random user agent (looks more human)
        user_agents = [
            'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
            'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0.0.0 Safari/537.36',
            'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
        ]
        chrome_options.add_argument(f'--user-agent={random.choice(user_agents)}')
        
        # Set up driver
        service = Service(ChromeDriverManager().install())
        self.driver = webdriver.Chrome(service=service, options=chrome_options)
        
        # Remove automation indicators
        self.driver.execute_script("Object.defineProperty(navigator, 'webdriver', {get: () => undefined})")
        
        self.driver.implicitly_wait(10)
        print("✅ Browser setup complete!")
        
    def human_delay(self, min_seconds=1, max_seconds=3):
        """Add human-like random delays"""
        if self.conservative_mode:
            min_seconds = max(min_seconds, 2)  # Minimum 2 seconds in conservative mode
            max_seconds = max(max_seconds, 5)  # Minimum 5 seconds max in conservative mode
        
        delay = random.uniform(min_seconds, max_seconds)
        print(f"⏳ Waiting {delay:.1f} seconds...")
        time.sleep(delay)
    
    def human_scroll(self):
        """Simulate human-like scrolling behavior"""
        print("📜 Scrolling like a human...")
        scroll_height = self.driver.execute_script("return document.body.scrollHeight")
        current_position = 0
        
        while current_position < scroll_height:
            # Random scroll amount
            scroll_amount = random.randint(200, 600)
            current_position += scroll_amount
            
            self.driver.execute_script(f"window.scrollTo(0, {current_position});")
            time.sleep(random.uniform(0.5, 1.5))
    
    def check_if_blocked(self):
        """Check if we might be blocked or detected"""
        page_source = self.driver.page_source.lower()
        
        # Common signs of being blocked
        blocked_indicators = [
            'captcha',
            '차단',
            'blocked',
            'robot',
            'bot detection',
            '비정상적인 접근'
        ]
        
        for indicator in blocked_indicators:
            if indicator in page_source:
                print(f"⚠️ Possible blocking detected: {indicator}")
                return True
        return False
    
    def rate_limit_check(self):
        """Enforce conservative rate limiting"""
        self.request_count += 1
        elapsed_time = time.time() - self.start_time
        
        if self.conservative_mode:
            # In conservative mode: max 1 request per 10 seconds
            min_time_per_request = 10
            if elapsed_time < (self.request_count * min_time_per_request):
                sleep_time = (self.request_count * min_time_per_request) - elapsed_time
                print(f"🐌 Conservative mode: waiting {sleep_time:.1f} seconds for rate limiting...")
                time.sleep(sleep_time)
        
        # Take a longer break every 10 requests
        if self.request_count % 10 == 0:
            break_time = random.uniform(30, 60)
            print(f"☕ Taking a {break_time:.1f} second break after {self.request_count} requests...")
            time.sleep(break_time)
        
    def navigate_to_product(self, product_url):
        """Navigate to Naver SmartStore product page"""
        print(f"🌐 Navigating to: {product_url}")
        
        # Check if URL is valid
        parsed_url = urlparse(product_url)
        if 'naver.com' not in parsed_url.netloc:
            print("❌ URL doesn't appear to be a Naver SmartStore URL")
            return False
            
        try:
            self.rate_limit_check()
            self.driver.get(product_url)
            self.human_delay(3, 6)
            
            # Check if blocked
            if self.check_if_blocked():
                print("❌ Possible blocking detected!")
                return False
                
            print("✅ Successfully loaded product page")
            return True
        except Exception as e:
            print(f"❌ Error loading page: {e}")
            return False
            
    def click_reviews_tab(self):
        """Click on the reviews tab to view reviews"""
        print("📝 Clicking on reviews tab...")
        try:
            self.rate_limit_check()
            
            # Try different possible selectors for the reviews tab
            review_selectors = [
                '#content > div > div.z7cS6-TO7X > div._27jmWaPaKy > ul > li:nth-child(2) > a',
                'a[href*="REVIEW"]',
                'a:contains("리뷰")',
                'li:nth-child(2) > a'
            ]
            
            for selector in review_selectors:
                try:
                    if 'contains' in selector:
                        # Handle text-based selection differently
                        review_tab = self.driver.find_element(By.XPATH, "//a[contains(text(), '리뷰')]")
                    else:
                        review_tab = self.driver.find_element(By.CSS_SELECTOR, selector)
                    
                    # Scroll to element before clicking (more human-like)
                    self.driver.execute_script("arguments[0].scrollIntoView(true);", review_tab)
                    self.human_delay(1, 2)
                    
                    review_tab.click()
                    self.human_delay(3, 5)
                    print("✅ Successfully clicked reviews tab")
                    return True
                except:
                    continue
                    
            print("❌ Could not find reviews tab")
            return False
            
        except Exception as e:
            print(f"❌ Error clicking reviews tab: {e}")
            return False
            
    def set_reviews_to_latest(self):
        """Set reviews to show latest first"""
        print("⏰ Setting reviews to latest order...")
        try:
            self.rate_limit_check()
            
            # Selector for "최신순" (latest) button
            latest_button_selector = '#REVIEW > div > div._2LvIMaBiIO > div._2LAwVxx1Sd > div._1txuie7UTH > ul > li:nth-child(2) > a'
            
            latest_button = self.driver.find_element(By.CSS_SELECTOR, latest_button_selector)
            
            # Scroll to button and add human delay
            self.driver.execute_script("arguments[0].scrollIntoView(true);", latest_button)
            self.human_delay(1, 2)
            
            latest_button.click()
            self.human_delay(3, 5)
            print("✅ Set reviews to latest order")
            return True
            
        except Exception as e:
            print(f"⚠️ Could not set to latest order (might already be set): {e}")
            return True  # Continue anyway
            
    def extract_reviews_from_page(self):
        """Extract review data from current page"""
        print("📊 Extracting reviews from current page...")
        
        try:
            # Get page source and parse with BeautifulSoup
            html_source = self.driver.page_source
            soup = BeautifulSoup(html_source, 'html.parser')
            
            # Find all review containers
            reviews = soup.findAll('li', {'class': 'BnwL_cs1av'})
            
            if not reviews:
                print("❌ No reviews found on this page")
                return 0
                
            page_review_count = 0
            
            for review in reviews:
                try:
                    # Extract review date
                    date_element = review.find('span', {'class': '_2L3vDiadT9'})
                    if date_element:
                        write_dt_raw = date_element.get_text().strip()
                        write_dt = datetime.strptime(write_dt_raw, '%y.%m.%d.').strftime('%Y-%m-%d')
                    else:
                        write_dt = "Unknown"
                    
                    # Extract product name (simplified version)
                    product_element = review.find('div', {'class': '_2FXNMst_ak'})
                    if product_element:
                        product_text = product_element.get_text()
                        # Look for product selection info
                        if '제품 선택:' in product_text:
                            start_idx = product_text.find('제품 선택:') + 6
                            product_name = product_text[start_idx:].split('\n')[0].strip()
                        else:
                            product_name = "Product info not found"
                    else:
                        product_name = "Unknown"
                    
                    # Extract review content
                    content_element = review.find('div', {'class': '_1kMfD5ErZ6'})
                    if content_element:
                        content_span = content_element.find('span', {'class': '_2L3vDiadT9'})
                        if content_span:
                            review_content = content_span.get_text().strip()
                            # Clean up the content
                            review_content = re.sub(' +', ' ', re.sub('\n', ' ', review_content))
                        else:
                            review_content = "Content not found"
                    else:
                        review_content = "Unknown"
                    
                    # Store the data
                    self.reviews_data['write_date'].append(write_dt)
                    self.reviews_data['product_name'].append(product_name)
                    self.reviews_data['review_content'].append(review_content)
                    self.reviews_data['rating'].append("N/A")  # Will add rating extraction later
                    
                    page_review_count += 1
                    
                except Exception as e:
                    print(f"⚠️ Error extracting individual review: {e}")
                    continue
            
            print(f"✅ Extracted {page_review_count} reviews from this page")
            return page_review_count
            
        except Exception as e:
            print(f"❌ Error extracting reviews: {e}")
            return 0
    
    def scrape_reviews(self, product_url, max_pages=2, days_back=365):
        """Main method to scrape reviews from a product"""
        print(f"🚀 Starting CONSERVATIVE review scraping for {max_pages} pages...")
        print("🛡️ Anti-detection measures enabled!")
        
        if self.conservative_mode:
            print("🐌 CONSERVATIVE MODE: Extra slow and careful scraping")
        
        # Navigate to product
        if not self.navigate_to_product(product_url):
            return False
            
        # Click reviews tab
        if not self.click_reviews_tab():
            return False
            
        # Set to latest order
        self.set_reviews_to_latest()
        
        # Do some human-like scrolling
        self.human_scroll()
        
        # Calculate cutoff date
        cutoff_date = (datetime.now() - timedelta(days=days_back)).strftime('%Y-%m-%d')
        print(f"📅 Collecting reviews from {cutoff_date} onwards...")
        
        total_reviews = 0
        page_num = 1
        
        # Extract reviews from first page
        self.human_delay(2, 4)  # Wait before extracting
        reviews_on_page = self.extract_reviews_from_page()
        total_reviews += reviews_on_page
        
        if reviews_on_page == 0:
            print("❌ No reviews found on first page")
            return False
        
        print(f"📈 Total reviews collected: {total_reviews}")
        
        # Check if we should continue (for now, just first page to be safe)
        if max_pages > 1:
            print("⚠️ Multi-page scraping disabled for safety in this version")
            print("   We'll add pagination once single-page scraping is confirmed working")
        
        return True
    
    def save_to_csv(self, filename=None):
        """Save collected reviews to CSV file"""
        if not filename:
            timestamp = datetime.now().strftime('%Y%m%d_%H%M%S')
            filename = f"data/naver_reviews_{timestamp}.csv"
        
        # Create data directory if it doesn't exist
        os.makedirs('data', exist_ok=True)
        
        # Create DataFrame
        df = pd.DataFrame(self.reviews_data)
        
        # Save to CSV
        df.to_csv(filename, index=False, encoding='utf-8-sig')
        print(f"💾 Saved {len(df)} reviews to {filename}")
        
        return filename
    
    def close(self):
        """Close the browser"""
        if hasattr(self, 'driver'):
            self.driver.quit()
            print("🔒 Browser closed")

# Example usage
def main():
    """Example of how to use the scraper - CONSERVATIVE MODE"""
    
    # REPLACE THIS URL WITH YOUR CLIENT'S ACTUAL PRODUCT URL
    product_url = "https://smartstore.naver.com/dangcatch6022/products/10824343164"
    
    print("🛡️ STARTING IN ULTRA-CONSERVATIVE MODE")
    print("   - Minimum 2-5 second delays between actions")
    print("   - Maximum 1 request per 10 seconds")
    print("   - Only 1 page for initial test")
    print("   - Anti-detection measures enabled")
    print("   - Human-like scrolling and timing")
    
    scraper = NaverSmartStoreReviewScraper(
        headless=False,  # Keep visible so you can monitor
        conservative_mode=True  # Maximum safety
    )
    
    try:
        # ULTRA-CONSERVATIVE: Only scrape 1 page first
        success = scraper.scrape_reviews(
            product_url=product_url,
            max_pages=1,  # Only 1 page for safety test
            days_back=30  # Only last 30 days for initial test
        )
        
        if success:
            # Save to CSV
            filename = scraper.save_to_csv()
            print(f"🎉 SAFE TEST COMPLETE! Check {filename}")
            print("   If this worked without issues, we can gradually increase scope")
        else:
            print("❌ Scraping failed")
            
    except KeyboardInterrupt:
        print("\n⏹️ Scraping interrupted by user")
    except Exception as e:
        print(f"❌ Unexpected error: {e}")
    finally:
        scraper.close()

if __name__ == "__main__":
    main()