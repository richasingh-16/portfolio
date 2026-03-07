from PIL import Image
import os

img_path = r"C:\Users\cbec\.gemini\antigravity\brain\3677f40e-f44e-4c6a-a260-dc0a12a19fb6\walking_sprite_1772479534283.png"
if not os.path.exists(img_path):
    print('image not found')
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
img.save(r"C:\Users\cbec\Desktop\portfolio\portfolio\public\walk-cycle.png", "PNG")
print('Saved transparent sprite to public/walk-cycle.png')
print('Image width:', img.width, 'Image height:', img.height)
