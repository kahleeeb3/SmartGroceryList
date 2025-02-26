from flask import Flask, render_template, request, jsonify
import base64
import sys # for arguments

app = Flask(__name__)


def save_image(img_bytes, filename="drawing.png"):
    """Save image byte data to a file."""
    with open(filename, "wb") as f:
        f.write(img_bytes)


@app.route('/')
def index():
    return render_template('draw.html')

@app.route('/process_canvas', methods=['POST'])
def process_canvas():
    data = request.get_json()
    image_data = data['image'].split(',')[1]  # Remove the 'data:image/png;base64,' prefix
    img_bytes = base64.b64decode(image_data)

    # do something with the image data
    save_image(img_bytes) # save the image

    return jsonify({"message": "Image saved successfully!"})

if __name__ == '__main__':
    if len(sys.argv) != 3:
        print("python main.py <ip> <port>")
    else:
        app.run(host=sys.argv[1], port=sys.argv[2], debug=True)