def feed_filter(feed, criterion=None, *comparison):
    for element in feed:
        element = element.strip()
        if criterion:
            if not criterion(element, *comparison):
                continue
        if not element:
            continue
        yield element


def load_words(word_file, criterion=None, *comparison):
    with open(word_file) as filename:
        return [word for word
                in feed_filter(filename, criterion, *comparison)]


def data_filter(data, criterion=None, *comparison):
    return [element for element
            in feed_filter(data, criterion, *comparison)]


def is_length(item, length):
    return len(item) == length


def same_letters(word, target):
    return set(word) == set(target)


def longer_than(item, length):
    return len(item) > length


def can_be_made(string, reference):
    """
    Return True if string can be made
    from the characters in reference

    """
    reference = reference[:]
    count = len(string)
    for character in string:
        if character in reference:
            reference.remove(character)
            count -= 1
    if count == 0:
        return True
    return False


def get_all_answers(words, letters, length):
    """
    Return all possible words made from the anagram letters.

    Applies three filters to the words:

    1. Remove words of the wrong length
    2. Remove words that contain letters not found in the anagram
    3. Letter-by-letter comparison, taking duplicates into account

    """
    answers = data_filter(words, is_length, length)
    answers = data_filter(answers, same_letters, letters)
    answers = data_filter(answers, can_be_made, letters)
    return answers
