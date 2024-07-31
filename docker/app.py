from flask import Flask

app = Flask(__name__)

@app.route('/')
def hello_world():
  return "Hello World!<br/>Check Makefile to see how to bind local app directory."
