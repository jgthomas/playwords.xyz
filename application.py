import random
from flask import Flask, render_template, json


app = Flask(__name__)

words = ["boxer", "dickhead", "foolish"]

@app.route('/')
def index():
    word = random.choice(words)
    anagram = list(word)
    random.shuffle(anagram)
    data = [''.join(anagram), word]
    return render_template("index.html", data=data)
