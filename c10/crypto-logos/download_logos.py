#!/usr/bin/env python3
import json
import requests
import os
from pathlib import Path

def download_crypto_logos():
    """Download cryptocurrency logos from CoinMarketCap"""
    
    # Load crypto IDs
    with open('crypto-ids.json', 'r') as f:
        crypto_data = json.load(f)
    
    # Create logos directory if it doesn't exist
    logos_dir = Path('logos')
    logos_dir.mkdir(exist_ok=True)
    
    # CoinMarketCap logo URL pattern
    # Using the GitHub repository that mirrors CMC logos
    base_url = "https://s2.coinmarketcap.com/static/img/coins/64x64/{}.png"
    
    for symbol, data in crypto_data.items():
        crypto_id = data['id']
        logo_url = base_url.format(crypto_id)
        
        try:
            print(f"Downloading {symbol} logo...")
            response = requests.get(logo_url, timeout=10)
            response.raise_for_status()
            
            # Save the logo
            logo_path = logos_dir / f"{symbol.lower()}.png"
            with open(logo_path, 'wb') as f:
                f.write(response.content)
            
            print(f"✓ Downloaded {symbol} logo to {logo_path}")
            
        except requests.RequestException as e:
            print(f"✗ Failed to download {symbol} logo: {e}")
            
            # Try alternative URL pattern
            try:
                alt_url = f"https://cryptologos.cc/logos/{data['name'].lower().replace(' ', '-')}-{symbol.lower()}-logo.png"
                print(f"Trying alternative URL for {symbol}...")
                response = requests.get(alt_url, timeout=10)
                response.raise_for_status()
                
                logo_path = logos_dir / f"{symbol.lower()}.png"
                with open(logo_path, 'wb') as f:
                    f.write(response.content)
                
                print(f"✓ Downloaded {symbol} logo from alternative source")
                
            except requests.RequestException as e2:
                print(f"✗ Alternative download also failed for {symbol}: {e2}")

if __name__ == "__main__":
    download_crypto_logos()
    print("\nLogo download process completed!")