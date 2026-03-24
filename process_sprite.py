from PIL import Image
import os

img_path = "input_sprite.png" # Place your raw sprite here
if not os.path.exists(img_path):
    print(f"Error: {img_path} not found. Please place your raw sprite file in the same directory.")
    exit()

img = Image.open(img_path).convert("RGBA")
datas = img.getdata()

newData = []
# Make anything close to white transparent
for item in datas:
    if item[0] > 200 and item[1] > 200 and item[2] > 200:
        newData.append((255, 255, 255, 0))
    else:
        newData.append(item)

img.putdata(newData)
output_path = os.path.join("public", "walk-cycle.png")
img.save(output_path, "PNG")
print('Saved transparent sprite to public/walk-cycle.png')
print('Image width:', img.width, 'Image height:', img.height)
