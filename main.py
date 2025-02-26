from flask import Flask, render_template, request, jsonify
import base64
import sys # for arguments

app = Flask(__name__)

@app.route('/')
def index():
    return render_template('draw.html')

@app.route('/save_canvas', methods=['POST'])
def save_canvas():
    data = request.get_json()
    image_data = data['image'].split(',')[1]  # Remove the 'data:image/png;base64,' prefix
    img_bytes = base64.b64decode(image_data)

    # Save image to a file
    image_path = "drawing.png"
    with open(image_path, "wb") as f:
        f.write(img_bytes)

    return jsonify({"message": "Image saved successfully!", "image_path": image_path})

if __name__ == '__main__':
    if len(sys.argv) != 3:
        print("python main.py <ip> <port>")
    else:
        app.run(host=sys.argv[1], port=sys.argv[2], debug=True)