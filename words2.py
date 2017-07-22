

from pyfunctory.factories import make_partial, filter_by, compose
from pyfunctory.atoms import (contains,
                              is_length,
                              longer_than,
                              is_subset,
                              can_be_made)


def length_is(length):
    """ Return a generator filtering by specific length. """
    return filter_by(make_partial(is_length, length))

def letter_in(letter):
    """ Return a generator filtering by presence of letter. """
    return filter_by(make_partial(contains, letter))

def letter_types(letters):
    """ Return a generator filtering by sets of letters. """
    return filter_by(make_partial(is_subset, letters))

def all_letters_in(letters):
    """ Return a generator filtering by letters, duplicates included. """
    return filter_by(make_partial(can_be_made, letters))


def answer_words(word):
    """ Return combined generators to get all answer words. """
    return compose(letter_types(word), all_letters_in(word))


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
        answer_filter = compose(letter_in(letter), answer_words(word))
    else:
        answer_filter = answer_words(word)
    return list(answer_filter(source))
