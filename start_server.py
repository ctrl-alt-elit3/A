from flask import Flask
from flask import send_from_directory
app = Flask(__name__)

@app.route("/")
def hello():
    return send_from_directory('../A', path='../A')

if __name__ == "__main__":
    app.run(host='0.0.0.0', port=5000)
