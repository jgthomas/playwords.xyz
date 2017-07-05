import random
from flask import Flask, render_template, jsonify


app = Flask(__name__)


words = ["boxer", "dickhead", "foolish"]


@app.route('/')
def index():
    word = random.choice(words)
    anagram = list(word)
    random.shuffle(anagram)
    data = [''.join(anagram), word]
    return render_template("index.html", data=data)


@app.route('/anagram', methods=['GET'])
def anagram():
    word = random.choice(words)
    anagram = list(word)
    random.shuffle(anagram)
    data = [''.join(anagram), word]
    return jsonify(data)
