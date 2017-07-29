"use strict";

const RACK_SCORES = {'a': 1, 'c': 3, 'b': 3, 'e': 1, 'd': 2, 'g': 2,
                     'f': 4, 'i': 1, 'h': 4, 'k': 5, 'j': 8, 'm': 3,
                     'l': 1, 'o': 1, 'n': 1, 'q': 10, 'p': 3, 's': 1,
                     'r': 1, 'u': 1, 't': 1, 'w': 4, 'v': 4, 'y': 4,
                     'x': 8, 'z': 10};

const RACK_BONUS = 50;
const RACK_LENGTH = 7;

const rackURL = "http://127.0.0.1:5000/rack2";


function rackData() {
    return {method: "POST",
              body: JSON.stringify({length: RACK_LENGTH.toString()})
    };
}


/**
 * Calculate word score.
 *
 * Sum the total of all the letter scores and add any bonuses.
 *
 * @param {string} word - Word to score.
 * @return {number} score - The score for word.
 */
function scoreWord(word) {
    const letters = word.split("");
    let score = letters.map( (x) => { return RACK_SCORES[x]; })
                       .reduce( (x, y) => { return x + y; });

    if (word.length == RACK_LENGTH) {
        score += RACK_BONUS;
    }

    return score;
}


function rackCleanup() {
    const word = document.getElementById("guess").value
    const score = word.split('').map(getLetterScore).reduce( (x, y) => { return x + y; })
}


function rackGame(data) {
    const [letters, answers, high_score, high_words] = data;
    storeAnagramSolution([letters, answers]);
    displayWord(currentAnagram.anagram);
    // get submit button element
    /*const rackGameFlow = gameFlowFactory(rackURL,
                                         rackData,
                                         rackCleanup,
                                         rackGame);*/
    // add event listener to submit with rackGameFlow callback
}


function rackGiveUp() {
}


/*document.addEventListener("DOMContentLoaded", () => {
    document.getElementById("again").addEventListener("click", () => {
    });
});


document.addEventListener("DOMContentLoaded", () => {
    document.getElementById("stop").addEventListener("click", () => {
    });
});*/


document.addEventListener("DOMContentLoaded", () => {
    fetchWrap(rackURL, rackData, rackGame);
});
