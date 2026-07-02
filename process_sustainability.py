from PIL import Image

def process_sustainability():
    img_path = 'frontend/src/assets/sustainability_dashboard.png'
    img = Image.open(img_path).convert('RGBA')
    width, height = img.size
    
    # We want to crop the central dashboard card.
    # In a typical 1024x1024 mockup, the dashboard card is centered.
    # Let's inspect the bounding box of high-brightness white pixels (R > 240, G > 240, B > 240)
    # to locate the dashboard card's exact edges.
    left, top, right, bottom = width, height, 0, 0
    for x in range(width):
        for y in range(height):
            r, g, b, a = img.getpixel((x, y))
            # The dashboard card has a white background
            if r > 245 and g > 245 and b > 245:
                if x < left: left = x
                if x > right: right = x
                if y < top: top = y
                if y > bottom: bottom = y
                
    print(f"Sustainability white box detected: L={left}, T={top}, R={right}, B={bottom}")
    
    # If no white box detected or too small, fallback to a standard crop
    if right - left < 200 or bottom - top < 200:
        left, top, right, bottom = 120, 160, 900, 750
        
    # Add a bit of padding around the detected box
    padding = 10
    left = max(0, left - padding)
    top = max(0, top - padding)
    right = min(width, right + padding)
    bottom = min(height, bottom + padding)
    
    cropped = img.crop((left, top, right, bottom))
    
    # Create a new white canvas
    new_w, new_h = 1024, 768
    canvas = Image.new('RGBA', (new_w, new_h), (255, 255, 255, 255))
    
    # Scale cropped image to fit the canvas nicely with padding
    scale = min((new_w - 60) / cropped.width, (new_h - 60) / cropped.height)
    scaled_w = int(cropped.width * scale)
    scaled_h = int(cropped.height * scale)
    scaled = cropped.resize((scaled_w, scaled_h), Image.Resampling.LANCZOS)
    
    # Paste centered
    paste_x = (new_w - scaled_w) // 2
    paste_y = (new_h - scaled_h) // 2
    canvas.paste(scaled, (paste_x, paste_y), scaled)
    
    # Save back
    canvas.convert('RGB').save('frontend/src/assets/sustainability_dashboard.png', 'PNG')
    print("Sustainability image processed successfully!")

process_sustainability()
