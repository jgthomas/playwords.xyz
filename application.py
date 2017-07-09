import random
from flask import Flask, render_template, jsonify


app = Flask(__name__)


word_file = "50k.txt"


def feed_filter(feed, criterion=None, *comparison):
    for element in feed:
        element = element.strip()
        if criterion:
            if not criterion(element, *comparison):
                continue
        if not element:
            continue
        yield element


def load_words(word_file, criterion=None, *comparison):
    with open(word_file) as filename:
        return [word for word
                in feed_filter(filename, criterion, *comparison)]


def is_length(item, length):
    return len(item) == length


@app.route('/')
def index():
    return render_template("index.html")


@app.route('/anagram', methods=['GET'])
def anagram():
    words = load_words(word_file)
    word = random.choice(words)
    anagram = list(word)
    random.shuffle(anagram)
    data = [''.join(anagram), word]
    return jsonify(data)
