import json
import os
import sys
import time
import random
import re

# Automatically install missing dependencies
try:
    from selenium import webdriver
    from selenium.webdriver.common.by import By
    from selenium.webdriver.chrome.service import Service
    from selenium.webdriver.chrome.options import Options
    from selenium.webdriver.support.ui import WebDriverWait
    from selenium.webdriver.support import expected_conditions as EC
    from webdriver_manager.chrome import ChromeDriverManager
    from bs4 import BeautifulSoup
except ImportError:
    print("Installing required dependencies: selenium, webdriver-manager, beautifulsoup4...")
    import subprocess
    subprocess.check_call([sys.executable, "-m", "pip", "install", "selenium", "webdriver-manager", "beautifulsoup4"])
    from selenium import webdriver
    from selenium.webdriver.common.by import By
    from selenium.webdriver.chrome.service import Service
    from selenium.webdriver.chrome.options import Options
    from selenium.webdriver.support.ui import WebDriverWait
    from selenium.webdriver.support import expected_conditions as EC
    from webdriver_manager.chrome import ChromeDriverManager
    from bs4 import BeautifulSoup

# Paths
DATA_DIR = os.path.dirname(os.path.abspath(__file__))
JSON_PATH = os.path.join(DATA_DIR, "src", "data", "csvjson.json")

def clean_text(text):
    if not text:
        return ""
    return re.sub(r'\s+', ' ', text).strip()

def extract_raw_dom_classes(html_source):
    soup = BeautifulSoup(html_source, 'html.parser')
    raw_data = {}
    key_counters = {}

    # Traverse all elements in the DOM in order of appearance
    for element in soup.find_all(True):
        classes = element.get("class", [])
        if not classes:
            continue

        # Find 5-character hashed classes (e.g. biGQs, NhWcC, BUupS, XfVdV)
        ta_classes = [c for c in classes if re.match(r'^[a-zA-Z]{5}$', str(c))]
        if not ta_classes:
            continue

        # Use the first matching class name as the base identifier
        class_name = ta_classes[0]
        val = None
        suffix = ""

        if element.name == "img":
            val = element.get("src")
            suffix = " src"
        elif element.name == "a":
            val = element.get("href")
            suffix = " href"
            # If it's a relative TripAdvisor link, make it absolute
            if val and val.startswith("/"):
                val = "https://www.tripadvisor.com" + val
        else:
            # Capture non-empty text content for other elements
            txt = element.get_text(strip=True)
            # Limit length to capture meaningful snippets and avoid massive container text duplication
            if txt and len(txt) < 800:
                val = clean_text(element.get_text())
                suffix = ""

        if val:
            base_key = f"{class_name}{suffix}"

            # Format key as: base_key (first occurrence), base_key 2, base_key 3, etc.
            if base_key not in key_counters:
                key_counters[base_key] = 1
                final_key = base_key
            else:
                key_counters[base_key] += 1
                final_key = f"{base_key} {key_counters[base_key]}"

            raw_data[final_key] = val

    return raw_data

def init_driver(use_existing_chrome=False):
    chrome_options = Options()
    if use_existing_chrome:
        # Connects to an existing Chrome window started with: 
        # chrome.exe --remote-debugging-port=9222 --user-data-dir="C:\chrome_profile"
        chrome_options.add_experimental_option("debuggerAddress", "127.0.0.1:9222")
        print("Connecting to existing Chrome instance on port 9222...")
        driver = webdriver.Chrome(options=chrome_options)
    else:
        # Standard clean automated Chrome window
        chrome_options.add_argument("--disable-gpu")
        chrome_options.add_argument("--no-sandbox")
        chrome_options.add_argument("--disable-dev-shm-usage")
        chrome_options.add_argument("--window-size=1280,800")
        chrome_options.add_argument("--disable-blink-features=AutomationControlled")
        chrome_options.add_experimental_option("excludeSwitches", ["enable-automation"])
        chrome_options.add_experimental_option('useAutomationExtension', False)
        
        # User agent matching popular Chrome installations to avoid bot blocks
        chrome_options.add_argument("user-agent=Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36")
        
        print("Launching automated Chrome instance...")
        service = Service(ChromeDriverManager().install())
        driver = webdriver.Chrome(service=service, options=chrome_options)
        
        # Evade Selenium webdriver flag checks
        driver.execute_cdp_cmd("Page.addScriptToEvaluateOnNewDocument", {
            "source": "Object.defineProperty(navigator, 'webdriver', {get: () => undefined})"
        })
        
    return driver

def main():
    print("=" * 60)
    print("    TRIPADVISOR UNLIMITED RAW DOM CLASS SCRAPER")
    print("=" * 60)

    if not os.path.exists(JSON_PATH):
        print(f"Error: dataset file not found at {JSON_PATH}")
        sys.exit(1)

    with open(JSON_PATH, 'r', encoding='utf-8') as f:
        entries = json.load(f)

    print(f"Loaded {len(entries)} entries from {JSON_PATH}")

    # To detect scraped entries, we check if they have keys other than the original 8 core keys.
    core_keys = {"place_url", "primary_image_url", "place_name", "ranking_position", "rating", "review_count", "category", "description"}
    
    scraped_count = 0
    for e in entries:
        extra_keys = set(e.keys()) - core_keys
        if len(extra_keys) > 0:
            scraped_count += 1
            
    remaining_count = len(entries) - scraped_count
    print(f"Already scraped: {scraped_count} entries. Remaining to scrape: {remaining_count}")

    if remaining_count == 0:
        print("All entries have already been scraped!")
        sys.exit(0)

    # Mode Choice
    print("\nSelect Chrome Mode:")
    print("  [1] Automated Chrome (Launches a new, clean Chrome window)")
    print("  [2] Connected Chrome (Connects to your active Chrome window started on port 9222)")
    print("      *Highly recommended for bypassing TripAdvisor blocks!*")
    
    choice = input("\nEnter choice [1 or 2] (default is 1): ").strip()
    use_existing = (choice == "2")

    # Initialize Selenium
    try:
        driver = init_driver(use_existing_chrome=use_existing)
    except Exception as e:
        print(f"\nFailed to connect/initialize Chrome: {e}")
        if use_existing:
            print("\nTip: To use Connected Chrome, close all Chrome instances, then run this in CMD/PowerShell:")
            print('  start chrome.exe --remote-debugging-port=9222 --user-data-dir="C:\\chrome_profile"')
        sys.exit(1)

    try:
        scraped_in_session = 0
        for idx, entry in enumerate(entries):
            # Check if this entry already has raw crawled data
            extra_keys = set(entry.keys()) - core_keys
            if len(extra_keys) > 0:
                continue

            place_name = entry.get("place_name", "Unknown Place")
            url = entry.get("place_url", "")

            if not url:
                print(f"[{idx+1}/{len(entries)}] Skipping {place_name} (No URL)")
                continue

            print(f"\n[{idx+1}/{len(entries)}] Scraping Raw DOM for: {place_name}")
            print(f"URL: {url}")

            try:
                driver.get(url)
                
                # Mimic human engagement with a random pause
                sleep_time = random.uniform(3.0, 6.0)
                print(f"Waiting {sleep_time:.2f} seconds...")
                time.sleep(sleep_time)

                # Ensure page body is loaded
                try:
                    WebDriverWait(driver, 8).until(
                        EC.presence_of_element_located((By.CSS_SELECTOR, "body"))
                    )
                except Exception:
                    pass

                # Extract all raw elements matching TA class modules
                html = driver.page_source
                raw_dom_data = extract_raw_dom_classes(html)

                # Save raw DOM data directly into entry
                entry.update(raw_dom_data)
                
                print(f"Successfully extracted {len(raw_dom_data)} raw class columns!")
                # Show first 5 extracted key-values as a sample
                sample_keys = list(raw_dom_data.keys())[:5]
                for sk in sample_keys:
                    val = raw_dom_data[sk]
                    print(f"  - {sk}: {val[:80]}..." if len(val) > 80 else f"  - {sk}: {val}")

                scraped_in_session += 1

                # Incremental progress backup
                if scraped_in_session % 5 == 0:
                    with open(JSON_PATH, 'w', encoding='utf-8') as f:
                        json.dump(entries, f, indent=2, ensure_ascii=False)
                    print("Progress saved incrementally to csvjson.json!")

            except Exception as page_ex:
                print(f"Error scraping {place_name}: {page_ex}")
                print("Skipping to next...")
                time.sleep(2)

    except KeyboardInterrupt:
        print("\nScraping interrupted by user. Saving progress...")
    finally:
        # Final save
        with open(JSON_PATH, 'w', encoding='utf-8') as f:
            json.dump(entries, f, indent=2, ensure_ascii=False)
        print("\nAll progress successfully saved to csvjson.json!")
        try:
            driver.quit()
            print("Chrome session closed.")
        except Exception:
            pass

if __name__ == "__main__":
    main()
