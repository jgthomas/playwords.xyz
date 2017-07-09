import random
from flask import Flask, render_template, jsonify, request
from words import feed_filter, load_words, data_filter, is_length, longer_than


app = Flask(__name__)


WORD_FILE = "50k.txt"
FULL_WORD_LIST = load_words(WORD_FILE)
WORD_LENGTH = {"any-length": 0,
               "6": 6,
               "7": 7,
               "8": 8,
               "9": 9,
               "long": 9}


@app.route('/')
def index():
    return render_template("index.html")


@app.route('/anagram', methods=['GET', 'POST'])
def anagram():
    if request.method == 'POST':
        data = request.get_json(force=True)
        length = data["length"]

        if length == "any-length" or length == "long":
            words = data_filter(FULL_WORD_LIST, longer_than, WORD_LENGTH[length])
        else:
            words = data_filter(FULL_WORD_LIST, is_length, WORD_LENGTH[length])

        word = random.choice(words)
        answers = [w for w in words if set(w) == set(word)]
        anagram = list(word)
        random.shuffle(anagram)
        data = [''.join(anagram), answers]
        return jsonify(data)
    else:
        return render_template("index.html")
