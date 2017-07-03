from flask import Flask, render_template, json


app = Flask(__name__)


@app.route('/')
def index():
    anagram = ["oxber", "boxer"]
    return render_template("index.html", anagram=anagram)
