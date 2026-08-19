from rembg import remove
from PIL import Image
import io
import shutil

input_path = "LGO 2026-06-20 at 9.27.36 PM.jpeg"
output_png = "public/firstrank_logo-removebg-preview.png"
favicon_svg_path = "favicon.svg"

print(f"Reading {input_path}...")
with open(input_path, "rb") as f:
    input_data = f.read()

print("Removing background (this may take a moment on first run to download the model)...")
output_data = remove(input_data)

print(f"Saving transparent PNG to {output_png}...")
img = Image.open(io.BytesIO(output_data)).convert("RGBA")

# Save full-res version as the main logo
img.save(output_png, "PNG")
print(f"Saved: {output_png}")

# Also save a small 32x32 and 192x192 copy for favicon/manifest use
favicon_32 = img.copy()
favicon_32.thumbnail((32, 32), Image.LANCZOS)
favicon_32.save("public/favicon-32.png", "PNG")

favicon_192 = img.copy()
favicon_192.thumbnail((192, 192), Image.LANCZOS)
favicon_192.save("public/favicon-192.png", "PNG")

print("Done! Outputs:")
print(f"  - {output_png}  (full logo, transparent background)")
print(f"  - public/favicon-32.png  (32x32 favicon)")
print(f"  - public/favicon-192.png  (192x192 icon)")
