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
    return [element for element in feed_filter(data, criterion, *comparison)]


def is_length(item, length):
    return len(item) == length
