import sys
from rembg import remove
from PIL import Image
import io

def main():
    if len(sys.argv) != 3:
        print("Usage: python remove_bg.py input_path output_path")
        sys.exit(1)

    input_path = sys.argv[1]
    output_path = sys.argv[2]

    with open(input_path, 'rb') as i:
        input_bytes = i.read()

    output_bytes = remove(input_bytes)


    output_img = Image.open(io.BytesIO(output_bytes)).convert("RGBA")

 
    white_bg = Image.new("RGBA", output_img.size, (255, 255, 255, 255))


    white_bg.paste(output_img, (0, 0), output_img)


    final_img = white_bg.convert("RGB")

  
    final_img.save(output_path)

if __name__ == '__main__':
    main()
