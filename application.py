import random

from flask import (Flask,
                   render_template,
                   jsonify,
                   request,
                   url_for, session)

from pyfunctory.process import load_data
from words import get_word, make_anagram, data, anagram_answers, puzzle_answers

from constants import (WORD_FILE,
                       WORD_LENGTH,
                       NINE_LETTER_WORD_FILE,
                       DICTIONARY_FILE)


app = Flask(__name__)


FULL_WORD_LIST = load_data(WORD_FILE)
NINE_LETTER_LIST = load_data(NINE_LETTER_WORD_FILE)
DICTIONARY = load_data(DICTIONARY_FILE)


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
        submitted = request.get_json(force=True)
        length = submitted["length"]
        anagram = make_anagram(get_word(length, FULL_WORD_LIST))
        answers = anagram_answers(len(anagram), anagram, FULL_WORD_LIST)
        return jsonify(data(anagram, answers))
    return render_template("anagram.html")


@app.route('/ladder', methods=["GET", "POST"])
def ladder():
    if request.method == "POST":
        submitted = request.get_json(force=True)
        length = submitted["length"]
        anagram = make_anagram(get_word(length, FULL_WORD_LIST))
        answers = anagram_answers(len(anagram), anagram, FULL_WORD_LIST)
        return jsonify(data(anagram, answers))
    return render_template("ladder.html")


@app.route('/grid', methods=["GET", "POST"])
def grid():
    if request.method == "POST":
        anagram = make_anagram(random.choice(NINE_LETTER_LIST))
        middle_letter = anagram[len(anagram) // 2]
        answers = puzzle_answers(anagram, DICTIONARY, letter=middle_letter)
        return jsonify(data(anagram, answers))
    return render_template("grid.html")


@app.route('/rack')
def rack():
    return render_template("rack.html")
