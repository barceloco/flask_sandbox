from flask import Flask

app = Flask(__name__)

@app.route('/')
def hello_world():
  return "<html><body>Hello World!<br/>This file is for debugging purposes, only.</body></html>"
