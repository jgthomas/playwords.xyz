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
               "long": 10}


@app.route('/')
def index():
    return render_template("index.html")


@app.route('/anagram', methods=['GET', 'POST'])
def anagram():
    if request.method == 'POST':
        data = request.get_json(force=True)
        length = data["length"]

        if WORD_LENGTH[length] == 0 or WORD_LENGTH[length] == 10:
            words = data_filter(FULL_WORD_LIST, longer_than, WORD_LENGTH[length])
            word = random.choice(words)
        else:
            words = data_filter(FULL_WORD_LIST, is_length, WORD_LENGTH[length])
            word = random.choice(words)

        anagram = list(word)
        random.shuffle(anagram)
        data = [''.join(anagram), word]
        return jsonify(data)
    else:
        return render_template("index.html")
