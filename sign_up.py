import functools
from flask import session, redirect, url_for

def valid_username(username):
    username = username.strip()
    if not username:
        return False
    return True


def username_error(username):
    username = username.strip()
    if not username:
        return "Pick a username"


def login_required(function):
    @functools.wraps(function)
    def decorated_function(*args, **kwargs):
        if session.get("player_id") is None:
            return redirect(url_for("index"))
        return function(*args, **kwargs)
    return decorated_function

