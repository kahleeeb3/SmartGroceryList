from flask import Flask, render_template, request, jsonify
import base64
import sys # for arguments
# from handwrittenOCR import save_image, convert_image_to_text

app = Flask(__name__)

@app.route('/')
def index():
    return render_template('draw.html')

@app.route('/process_canvas', methods=['POST'])
def process_canvas():
    data = request.get_json()
    image_data = data['image'].split(',')[1]  # Remove the 'data:image/png;base64,' prefix
    img_bytes = base64.b64decode(image_data)

    # Save the Image
    with open("drawing.png", "wb") as f:
        f.write(img_bytes)
    return jsonify({"message": "Image Saved"})
    
    # convert to text
    # recognized_text = convert_image_to_text(img_bytes) # detect whats written in the image
    # return jsonify({"message": "Image received", "recognized_text": recognized_text})

if __name__ == '__main__':
    if len(sys.argv) != 3:
        print("python main.py <ip> <port>")
    else:
        app.run(host=sys.argv[1], port=sys.argv[2], debug=True)