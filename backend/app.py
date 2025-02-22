from flask import Flask, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

@app.route("/")
def home():
    return jsonify({"message": "Hello, World!"})

@app.route("/api/data")
def get_data():
    return jsonify({"data": ["Item 1", "Item 2", "Item 3"]})

if __name__ == "__main__":
    app.run(debug=True, port=8000)