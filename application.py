import random
import datetime as dt
from tempfile import mkdtemp

from flask import (Flask,
                   render_template,
                   jsonify,
                   request,
                   redirect,
                   url_for,
                   session)

from flask_session import Session

from passlib.apps import custom_app_context as pwd_context

from pyfunctory.process import load_data
from dbase.dbase import Database

from queries import (CREATE_PERSON,
                     ADD_PERSON,
                     SELECT_PERSON,
                     SELECT_PERSON_NAME)

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

SESSION_TYPE = "filesystem"
SESSION_PERMANENT = False
SESSION_FILE_DIR = mkdtemp()
app.config.from_object(__name__)
Session(app)

db = Database('playwords.db')


FULL_WORD_LIST = load_data(WORD_FILE)
NINE_LETTER_LIST = load_data(NINE_LETTER_WORD_FILE)
DICTIONARY = load_data(DICTIONARY_FILE)


@app.route('/')
def index():
    return render_template("index.html")


@app.route('/login', methods=['GET', 'POST'])
def login():
    session.clear()

    if request.method == 'POST':

        if not request.form.get("login_id"):
            pass

        if not request.form.get("password"):
            pass

        login_id = request.form.get("login_id")
        password = request.form.get("password")

        # Assume login with player name...
        user_data = db.execute(SELECT_PERSON_NAME, login_id)

        # ...then try email
        if not user_data:
            user_data = db.execute(SELECT_PERSON, login_id)

        if len(user_data) != 1 or not pwd_context.verify(password, user_data[0]["password"]):
            pass

        session["player_id"] = user_data[0]["player_id"]
        return redirect(url_for("index"))
    return render_template("login.html")


@app.route('/logout')
def logout():
    session.clear()
    return redirect(url_for("index"))


@app.route('/register', methods=['GET', 'POST'])
def register():
    session.clear()

    if request.method == 'POST':
        player_name = request.form.get("player_name")
        email = request.form.get("email")
        password = request.form.get("password")
        hashed_password = pwd_context.hash(password)
        join_date = dt.datetime.now().date()

        db.execute(CREATE_PERSON)
        db.execute(ADD_PERSON, player_name, email, hashed_password, join_date)

        user_data = db.execute(SELECT_PERSON, email)
        session["player_id"] = user_data[0]["player_id"]
        return redirect(url_for("index"))
    return render_template("register.html")


@app.route('/account')
def account():
    player_id = session["player_id"]
    return render_template("account.html", player_id=player_id)


@app.route('/anagram', methods=['GET', 'POST'])
def anagram():
    if request.method == 'POST':
        submitted = request.get_json(force=True)
        length = submitted["length"]
        anagram = make_anagram(get_word(length, FULL_WORD_LIST))
        answers = anagram_answers(len(anagram), anagram, DICTIONARY)
        return jsonify(data(anagram, answers))
    return render_template("anagram.html")


@app.route('/ladder', methods=["GET", "POST"])
def ladder():
    if request.method == "POST":
        submitted = request.get_json(force=True)
        length = submitted["length"]
        anagram = make_anagram(get_word(length, FULL_WORD_LIST))
        answers = anagram_answers(len(anagram), anagram, DICTIONARY)
        print(data(anagram, answers))
        return jsonify(data(anagram, answers))
    return render_template("ladder.html")


@app.route('/grid', methods=["GET", "POST"])
def grid():
    if request.method == "POST":
        anagram = make_anagram(random.choice(NINE_LETTER_LIST))
        middle_letter = anagram[len(anagram) // 2]
        answers = puzzle_answers(anagram, DICTIONARY, letter=middle_letter)
        answers = plural_filter(answers, DICTIONARY)
        print(data(anagram, answers))
        return jsonify(data(anagram, answers))
    return render_template("grid.html")


@app.route('/rack', methods=["GET", "POST"])
def rack():
    if request.method == "POST":
        submitted = request.get_json(force=True)
        length = int(submitted["length"])
        letters = draw_letters(LETTERS, length)
        answers = puzzle_answers(letters, DICTIONARY)
        high = high_scorer(answers, SCORES, RACK_HIGH)
        print(data(letters, answers, high))
        return jsonify(data(letters, answers, high))
    return render_template("rack.html")
