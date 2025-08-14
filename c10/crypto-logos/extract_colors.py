#!/usr/bin/env python3
import os
import json
from PIL import Image
import numpy as np
from collections import Counter

def get_dominant_color(image_path):
    """Extract the dominant color from an image"""
    try:
        # Open image and convert to RGB
        img = Image.open(image_path).convert('RGB')
        
        # Resize image to speed up processing
        img = img.resize((150, 150))
        
        # Convert to numpy array
        img_array = np.array(img)
        
        # Reshape to get all pixels
        pixels = img_array.reshape(-1, 3)
        
        # Remove white and very light colors (background)
        filtered_pixels = []
        for pixel in pixels:
            r, g, b = pixel
            # Skip if too close to white or too dark
            if not (r > 240 and g > 240 and b > 240) and not (r < 20 and g < 20 and b < 20):
                filtered_pixels.append(tuple(pixel))
        
        if not filtered_pixels:
            # Fallback to all pixels if filtering removes everything
            filtered_pixels = [tuple(p) for p in pixels]
        
        # Count color frequencies
        color_counts = Counter(filtered_pixels)
        
        # Get the most common color
        dominant_color = color_counts.most_common(1)[0][0]
        
        return dominant_color
    except Exception as e:
        print(f"Error processing {image_path}: {e}")
        return None

def rgb_to_hex(rgb):
    """Convert RGB tuple to hex color"""
    return f"#{rgb[0]:02x}{rgb[1]:02x}{rgb[2]:02x}"

def main():
    # Load crypto data
    with open('crypto-ids.json', 'r') as f:
        crypto_data = json.load(f)
    
    colors = {}
    
    for symbol, crypto_info in crypto_data.items():
        symbol_lower = symbol.lower()
        logo_path = f"logos/{symbol_lower}.png"
        
        if os.path.exists(logo_path):
            dominant_color = get_dominant_color(logo_path)
            if dominant_color:
                hex_color = rgb_to_hex(dominant_color)
                colors[symbol] = {
                    'hex': hex_color,
                    'rgb': [int(dominant_color[0]), int(dominant_color[1]), int(dominant_color[2])],
                    'name': crypto_info['name']
                }
                print(f"{symbol}: {hex_color} (RGB: {dominant_color})")
            else:
                print(f"Failed to extract color for {symbol}")
        else:
            print(f"Logo not found for {symbol}")
    
    # Save colors to JSON file
    with open('crypto-colors.json', 'w') as f:
        json.dump(colors, f, indent=2)
    
    print(f"\nColors saved to crypto-colors.json")
    print(f"Extracted colors for {len(colors)} cryptocurrencies")

if __name__ == "__main__":
    main()