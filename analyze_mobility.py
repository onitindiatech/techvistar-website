from PIL import Image

def analyze_mobility():
    img_path = 'frontend/src/assets/mobility_routing_dashboard.png'
    img = Image.open(img_path).convert('RGBA')
    width, height = img.size
    
    # Let's find pixels with green navigation lines:
    # Green lines will have high G and lower R/B (e.g. G > 180, R < 120, B < 150)
    green_pixels = []
    for x in range(0, width, 2):
        for y in range(0, height, 2):
            r, g, b, a = img.getpixel((x, y))
            if g > 150 and r < 100 and b < 130:
                green_pixels.append((x, y))
                
    if green_pixels:
        xs = [p[0] for p in green_pixels]
        ys = [p[1] for p in green_pixels]
        left, top, right, bottom = min(xs), min(ys), max(xs), max(ys)
        print(f"Green route lines detected: L={left}, T={top}, R={right}, B={bottom}")
    else:
        print("No green pixels detected")

analyze_mobility()
