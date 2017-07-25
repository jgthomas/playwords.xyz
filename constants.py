

import string


WORD_FILE = "static/wordlist/50k.txt"
NINE_LETTER_WORD_FILE = "static/wordlist/nine_letter_words.txt"
DICTIONARY_FILE = "static/wordlist/sowpods.txt"

SHORT = 3

WORD_LENGTH = {"any-length": 0,
               "long": 9,
               "4": 4,
               "5": 5,
               "6": 6,
               "7": 7,
               "8": 8,
               "9": 9,
               "10": 10,
               "11": 11,
               "12": 12,
               "13": 13,
               "14": 14,
               "15": 15,
               "16": 16}

PLURAL_SPECIAL_CASES = ["news"]

LETTER_FREQUENCY = {'a': 9, 'b': 2, 'c': 2, 'd': 4, 'e': 12, 'f': 2,
                    'g': 3, 'h': 2, 'i': 9, 'j': 1, 'k': 1, 'l': 4,
                    'm': 2, 'n': 6, 'o': 8, 'p': 2, 'q': 1, 'r': 6,
                    's': 4, 't': 6, 'u': 4, 'v': 2, 'w': 2, 'x': 1,
                    'y': 2, 'z': 1}

SCORES = {'a': 1, 'c': 3, 'b': 3, 'e': 1, 'd': 2, 'g': 2,
         'f': 4, 'i': 1, 'h': 4, 'k': 5, 'j': 8, 'm': 3,
         'l': 1, 'o': 1, 'n': 1, 'q': 10, 'p': 3, 's': 1,
         'r': 1, 'u': 1, 't': 1, 'w': 4, 'v': 4, 'y': 4,
         'x': 8, 'z': 10}

LETTERS = [letter for letter in string.ascii_lowercase
           for count in LETTER_FREQUENCY[letter]]
