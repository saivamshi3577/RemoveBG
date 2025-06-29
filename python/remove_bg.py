import sys
from rembg import remove, new_session
from PIL import Image
import io

def main():
    if len(sys.argv) != 3:
        print("Usage: python remove_bg.py input_path output_path")
        sys.exit(1)

    input_path = sys.argv[1]
    output_path = sys.argv[2]

    # Read image bytes
    with open(input_path, 'rb') as f:
        input_bytes = f.read()

    # Resize image if too large
    img = Image.open(io.BytesIO(input_bytes))
    max_dim = 1024
    if max(img.size) > max_dim:
        img.thumbnail((max_dim, max_dim))
        buffer = io.BytesIO()
        img.save(buffer, format="PNG")
        input_bytes = buffer.getvalue()

    # Run rembg with lightweight model
    session = new_session(model_name='u2netp')
    output_bytes = remove(input_bytes, session=session)

    # Convert output bytes to RGBA image
    output_img = Image.open(io.BytesIO(output_bytes)).convert("RGBA")

    # Create white background and paste
    white_bg = Image.new("RGBA", output_img.size, (255, 255, 255, 255))
    white_bg.paste(output_img, (0, 0), output_img)

    # Convert to RGB (remove alpha)
    final_img = white_bg.convert("RGB")

    # Save as JPEG or PNG (use RGB format)
    final_img.save(output_path)

if __name__ == '__main__':
    main()
