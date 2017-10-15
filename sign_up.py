

def valid_username(username):
    username = username.strip()
    if not username:
        return False
    return True


def username_error(username):
    username = username.strip()
    if not username:
        return "Pick a username"
