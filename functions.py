

import random

from pyfunctory.process import filter_data
from pyfunctory.factories import make_partial
from pyfunctory.atoms import is_length, longer_than

from constants import WORD_LENGTH


def exact_length(length):
    return make_partial(is_length, length)


def over_length(length):
    return make_partial(longer_than, length)


def get_word(length, source):
    word_length = WORD_LENGTH[length]
    if length == "any-length" or length == "long":
        words = filter_data(source, over_length(word_length))
    else:
        words = filter_data(source, exact_length(word_length))
    return random.choice(words)


def draw_letters(pouch, rack_length=7):
    def random_draw(x):
        return x.pop(random.randrange(len(x)))
    letters = pouch.copy()
    return [random_draw(letters) for letter in range(rack_length)]


def make_anagram(word):
    return random.sample(list(word), len(word))


def data(anagram, answers):
    return ["".join(anagram), answers]


def get_score(word, letter_scores):
    score = sum(letter_scores[letter] for letter in word)
    if len(word) >= 7:
        score += 50
    return score


def high_scorer(words, letter_scores):
    scored = [(word, get_score(word, letter_scores)) for word in words]
    word, score = max(scored, key=lambda x: x[1])
    return word
