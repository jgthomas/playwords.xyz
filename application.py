import random
from flask import Flask, render_template, jsonify
from words import feed_filter, load_words, data_filter, is_length

app = Flask(__name__)


WORD_FILE = "50k.txt"
FULL_WORD_LIST = load_words(WORD_FILE)


@app.route('/')
def index():
    return render_template("index.html")


@app.route('/anagram', methods=['GET'])
def anagram():
    #words = data_filter(word_file)
    word = random.choice(FULL_WORD_LIST)
    anagram = list(word)
    random.shuffle(anagram)
    data = [''.join(anagram), word]
    return jsonify(data)
