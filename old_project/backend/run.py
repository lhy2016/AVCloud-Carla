from app import create_app

app = create_app('dev')

@app.route("/")
def hello_world():
    return "<p>Hello, World!</p>"
    
if __name__ == "__main__":
    app.run(debug=True, host='0.0.0.0')