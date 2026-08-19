from PIL import Image
import numpy as np

def make_transparent_and_crop(image_path, output_path, bg_color_threshold=240):
    img = Image.open(image_path).convert("RGBA")
    data = np.array(img)
    
    # Check near-white background
    r, g, b, a = data[:,:,0], data[:,:,1], data[:,:,2], data[:,:,3]
    mask = (r > bg_color_threshold) & (g > bg_color_threshold) & (b > bg_color_threshold)
    
    # Set transparent
    data[:,:,3] = np.where(mask, 0, 255)
    
    result = Image.fromarray(data, mode="RGBA")
    bbox = result.getbbox()
    if bbox:
        result = result.crop(bbox)
        # Add small 4px padding
        padded = Image.new("RGBA", (result.width + 8, result.height + 8), (0,0,0,0))
        padded.paste(result, (4, 4))
        result = padded
    result.save(output_path, "PNG")
    print(f"Saved {output_path} size: {result.size}")

def trim_existing_png(image_path, output_path):
    img = Image.open(image_path).convert("RGBA")
    bbox = img.getbbox()
    if bbox:
        img = img.crop(bbox)
        padded = Image.new("RGBA", (img.width + 4, img.height + 4), (0,0,0,0))
        padded.paste(img, (2, 2))
        img = padded
    img.save(output_path, "PNG")
    print(f"Trimmed {image_path} -> {output_path} size: {img.size}")

# Process original full logo
try:
    make_transparent_and_crop("ORIGINAL LOGO-20 at 10.13.05 PM.jpeg", "public/firstrank_full_logo.png")
except Exception as e:
    print("Error with original logo:", e)

# Process trimmed icon
try:
    trim_existing_png("public/firstrank_logo-removebg-preview.png", "public/firstrank_icon.png")
    # Also update firstrank_logo-removebg-preview.png so it has no massive empty padding
    trim_existing_png("public/firstrank_logo-removebg-preview.png", "public/firstrank_logo-removebg-preview.png")
except Exception as e:
    print("Error trimming icon:", e)
