import random

from flask import (Flask,
                   render_template,
                   jsonify,
                   request,
                   url_for, session)

from pyfunctory.process import load_data

from words import (anagram_answers,
                   puzzle_answers,
                   plural_filter)

from functions import (get_word,
                       make_anagram,
                       data,
                       draw_letters,
                       high_scorer)

from constants import (WORD_FILE,
                       WORD_LENGTH,
                       NINE_LETTER_WORD_FILE,
                       DICTIONARY_FILE,
                       LETTERS,
                       SCORES,
                       RACK_HIGH)


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
    return render_template("ladder2.html")


@app.route('/grid', methods=["GET", "POST"])
def grid():
    if request.method == "POST":
        anagram = make_anagram(random.choice(NINE_LETTER_LIST))
        middle_letter = anagram[len(anagram) // 2]
        answers = puzzle_answers(anagram, DICTIONARY, letter=middle_letter)
        answers = plural_filter(answers, DICTIONARY)
        return jsonify(data(anagram, answers))
    return render_template("grid.html")


@app.route('/rack2', methods=["GET", "POST"])
def rack():
    if request.method == "POST":
        submitted = request.get_json(force=True)
        length = int(submitted["length"])
        letters = draw_letters(LETTERS, length)
        answers = puzzle_answers(letters, DICTIONARY)
        print(answers)
        high = high_scorer(answers, SCORES, RACK_HIGH)
        print(high)
        print(data(letters, answers, high))
        return jsonify(data(letters, answers))
    return render_template("rack2.html")
