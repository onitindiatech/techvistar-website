from PIL import Image

def process_mobility():
    img_path = 'frontend/src/assets/mobility_routing_dashboard.png'
    img = Image.open(img_path).convert('RGBA')
    
    # Bounding box of the laptop screen contents:
    # Based on green line detection at L=176, T=222, R=850, B=708
    # We expand slightly to capture the entire active screen content, but avoid the laptop outer frame/bezel.
    left, top, right, bottom = 170, 210, 856, 706
    
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
    canvas.convert('RGB').save('frontend/src/assets/mobility_routing_dashboard.png', 'PNG')
    print("Mobility image processed successfully!")

process_mobility()
