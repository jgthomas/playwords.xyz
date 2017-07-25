

import random
from constants import WORD_LENGTH, SHORT, PLURAL_SPECIAL_CASES
from pyfunctory.nuggets import match_factory, ends_ss
from pyfunctory.process import filter_data
from pyfunctory.factories import make_partial, filter_by, compose
from pyfunctory.atoms import (contains,
                              is_length,
                              longer_than,
                              is_subset,
                              can_be_made)


def length_is(length):
    """ Generator filtering by length of word. """
    return filter_by(make_partial(is_length, length))

def length_over(length):
    """ Generator filtering word of length or greater. """
    return filter_by(make_partial(longer_than, length))

def letter_in(letter):
    """ Generator filtering by presence of letter. """
    return filter_by(make_partial(contains, letter))

def letter_types(letters):
    """ Generator filtering by letter sets. """
    return filter_by(make_partial(is_subset, letters))

def all_letters_in(letters):
    """ Generator filtering by individual letters, duplicates included. """
    return filter_by(make_partial(can_be_made, letters))


def answer_words(word):
    """ Combined generators to get all answer words. """
    return compose(letter_types(word), all_letters_in(word))


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


def make_anagram(word):
    return random.sample(list(word), len(word))


def data(anagram, answers):
    return ["".join(anagram), answers]


def plural_filter(answers, source):
    """ Return list of all plurals to filter. """
    all_words = set(source)
    plurals = [word for word in answers
               if word.endswith("s") 
               and word[:-1] in all_words
               and len(word) in range(4, 9)]
    plurals = [word for word in plurals
               if word not in PLURAL_SPECIAL_CASES]
    not_match = match_factory(ends_ss, match=False)
    plurals = filter_data(plurals, not_match)
    return plurals


def anagram_answers(length, word, source):
    """
    Return all words that can be made using ALL the letters in word.

    Example:
    >>> anagram_answers(4, "stop", a_word_list)
    >>> ["opts", "pots", "tops", "stop"]

    """
    answer_filter = compose(length_is(length), answer_words(word))
    return list(answer_filter(source))


def puzzle_answers(word, source, letter=None):
    """
    Return all words, of any length, that can be made using the letters in word.

    If letter is specified, all answers must also include that letter.

    Examples:
    >>> puzzle_answers("master", a_word_list)
    >>> ["mast", "steam", "stem", "stream", ...]

    >>> puzzle_answers("master", a_word_list, "r")
    >>> ["ream", "mare", "rest", "stream", ...]

    """
    if letter:
        answer_filter = compose(length_over(SHORT),
                                letter_in(letter),
                                answer_words(word))
    else:
        answer_filter = answer_words(word)
    answers = list(answer_filter(source))
    plurals = plural_filter(answers, source)
    answers = [word for word in answers if word not in plurals]
    return answers
