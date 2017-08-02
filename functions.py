

import random
import operator

from pyfunctory.process import filter_data
from pyfunctory.factories import make_partial
from pyfunctory.atoms import is_length, longer_than

from constants import WORD_LENGTH, BONUS


def get_word(length, source):
    def exact_length(length):
        return make_partial(is_length, length)
    def over_length(length):
        return make_partial(longer_than, length)

    word_length = WORD_LENGTH[length]

    if length == "any-length" or length == "long":
        words = filter_data(source, over_length(word_length))
    else:
        words = filter_data(source, exact_length(word_length))
    return random.choice(words)


def draw_letters(pouch, rack_length=7):
    """ 
    Return a random selection of letters. 

    pouch        :  source of letters
    rack_length  :  number of letters to return
    
    """
    def random_draw(x):
        return x.pop(random.randrange(len(x)))
    letters = pouch.copy()
    draw = "".join(random_draw(letters) for letter in range(rack_length))
    return draw


def make_anagram(word):
    """ Return new string with the letters shuffled. """
    return random.sample(list(word), len(word))


#def data(anagram, answers):
#    return ["".join(anagram), answers]


def data(anagram, *answers):
    """ Combine all data into single list for conversion to JSON. """
    return ["".join(anagram), *[a for a in answers]]


def get_score(word, letter_scores, bonus_level):
    """ Return score for each word in the solution. """
    score = sum(letter_scores[letter] for letter in word)
    if len(word) >= bonus_level:
        score += BONUS
    return score


def high_scorer(words, letter_scores, bonus_level):
    """ Return highest score and all words with that score. """
    scored = [(word, get_score(word, letter_scores, bonus_level)) for word in words]
    try:
        high_score = max(operator.itemgetter(1)(list(zip(*scored))))
    except IndexError:
        high_score = 0
    top_words = [word for word, score in scored if score == high_score]
    if not top_words:
        top_words = ["\u2013"]
    return [high_score, top_words]
