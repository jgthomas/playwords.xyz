import random
from flask import Flask, render_template, jsonify, request, url_for, session
from words import feed_filter, load_words, data_filter, is_length, longer_than, get_all_answers


app = Flask(__name__)


WORD_FILE = "static/wordlist/50k.txt"
FULL_WORD_LIST = load_words(WORD_FILE)
WORD_LENGTH = {"any-length": 0,
               "4": 4,
               "5": 5,
               "6": 6,
               "7": 7,
               "8": 8,
               "9": 9,
               "long": 9}


def get_word(length):
    if length == "any-length" or length == "long":
        words = data_filter(FULL_WORD_LIST, longer_than, WORD_LENGTH[length])
    else:
        words = data_filter(FULL_WORD_LIST, is_length, WORD_LENGTH[length])
    word = random.choice(words)
    letters = [letter for letter in word]
    answers = get_all_answers(words, letters, len(word))
    anagram = list(word)
    random.shuffle(anagram)
    data = [''.join(anagram), answers]
    return jsonify(data)


@app.route('/')
def index():
    return render_template("index.html")


@app.route('/login')
def login():
    return render_template("login.html")


@app.route('/logout')
def logout():
    return render_template("logout.html")


@app.route('/register')
def register():
    return render_template("register.html")


@app.route('/account')
def account():
    return render_template("account.html")


@app.route('/anagram', methods=['GET', 'POST'])
def anagram():
    if request.method == 'POST':
        data = request.get_json(force=True)
        length = data["length"]
        return get_word(length)
    return render_template("anagram.html")


@app.route('/ladder', methods=["GET", "POST"])
def ladder():
    if request.method == "POST":
        data = request.get_json(force=True)
        length = data["length"]
        return get_word(length)
    return render_template("ladder.html")
