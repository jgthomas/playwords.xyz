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
from flask_wtf import FlaskForm
from wtforms import StringField, PasswordField
from wtforms.validators import InputRequired, Email, Length
from flask_bootstrap import Bootstrap

from passlib.apps import custom_app_context as pwd_context

from pyfunctory.process import load_data

from dbase.dbase import Database
from queries import (CREATE_PERSON,
                     ADD_PERSON,
                     SELECT_PERSON,
                     SELECT_PERSON_NAME,
                     SELECT_PERSON_ID,
                     PLAYER_NAME_EXISTS,
                     EMAIL_EXISTS)

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

from sign_up import login_required


app = Flask(__name__)
app.config['SECRET_KEY'] = 'mytestkey'
Bootstrap(app)

SESSION_TYPE = "filesystem"
SESSION_PERMANENT = False
SESSION_FILE_DIR = mkdtemp()
app.config.from_object(__name__)
Session(app)

db = Database('playwords.db')


class RegisterForm(FlaskForm):
    player_name = StringField('Player Name', validators=[InputRequired(), Length(min=5)])
    email = StringField('Email', validators=[InputRequired(), Email(message='Valid email required')])
    password = PasswordField('Password', validators=[InputRequired(), Length(min=8)])


FULL_WORD_LIST = load_data(WORD_FILE)
NINE_LETTER_LIST = load_data(NINE_LETTER_WORD_FILE)
DICTIONARY = load_data(DICTIONARY_FILE)


@app.route('/')
def index():
    return render_template("index.html")


@app.route('/login', methods=['GET', 'POST'])
def login():
    session.clear()
    error = None

    if request.method == 'POST':

        if not request.form.get("player_name"):
            error = "You must enter a username to login"
        elif not request.form.get("password"):
            error = "You must enter a username to login"
        else:
            player_name = request.form.get("player_name")
            password = request.form.get("password")
            user_data = db.execute(SELECT_PERSON_NAME, player_name)

        if len(user_data) != 1 or not pwd_context.verify(password, user_data[0]["password"]):
            error = "Invalid player name or password"
        else:
            session["player_id"] = user_data[0]["player_id"]
            return redirect(url_for("index"))
    return render_template("login.html", error = error)


@app.route('/logout')
def logout():
    session.clear()
    return redirect(url_for("index"))


@app.route('/register', methods=['GET', 'POST'])
def register():
    error_name = None
    error_email = None
    form = RegisterForm()

    if form.validate_on_submit():
        player_name = form.player_name.data
        email = form.email.data
        password = form.password.data
        hashed_password = pwd_context.hash(password)
        join_date = dt.datetime.now().date()

        name_taken = sum(val for val in db.execute(PLAYER_NAME_EXISTS, player_name)[0].values())
        if name_taken:
            error_name = f"Player name '{player_name}' is already in use"

        email_used = sum(val for val in db.execute(EMAIL_EXISTS, email)[0].values())
        if email_used:
            error_email = f"Email address '{email}' is already in use"

        if not name_taken and not email_used:
            session.clear()
            db.execute(CREATE_PERSON)
            db.execute(ADD_PERSON, player_name, email, hashed_password, join_date)
            user_data = db.execute(SELECT_PERSON, email)
            session["player_id"] = user_data[0]["player_id"]
            return redirect(url_for("index"))
    return render_template("register.html", form=form, error_name = error_name, error_email = error_email)


@app.route('/account')
@login_required
def account():
    player, *_ = db.execute(SELECT_PERSON_ID, session["player_id"])
    return render_template("account.html",
                           player_name=player["player_name"])


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
