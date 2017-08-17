"use strict";

const gridURL = "http://127.0.0.1:5000/grid";
//const gridURL = "https://3b6d3d9c.ngrok.io/grid";

const gridAnswers = {};
const finalAnswers = {};
const gridLength = 9;

let nineLetterWords = [];


function gridData() {
    return {method: "POST",
              body: JSON.stringify({length: gridLength.toString()})
    };
}


function categoryGuides() {
    const numOfAnswers = currentAnagram.solution.length;
    const average = 0.25;
    const good = 0.4;
    const excellent = 0.5;
    document.getElementById("average").textContent = Math.ceil(numOfAnswers * average);
    document.getElementById("good").textContent = Math.ceil(numOfAnswers * good);
    document.getElementById("excellent").textContent = Math.ceil(numOfAnswers * excellent);
}


function getNineLetterWord(arr) {
    const nines = arr.filter( (x) => {
        return x.length === 9;
    });

    return nines;
}


function clearNineLetterWord() {
    const nine = document.getElementById("nine-letter-word");
    nine.textContent = "";
}


/**
 * Display answers beginning with the supplied letter.
 *
 * @param {string} letter - Initial letter of the words to display.
 * @param {object} storage - Object in which words are stored.
 * @param {boolean} gameEnd - Indicates whether game is over.
 * @return {undefined} SIDE-EFFECTS ONLY
 */
function letterAnswers(letter, storage, gameEnd = false) {
    if (gameEnd) {
        var letterRow = document.getElementById(`answer_${letter}`);
    } else {
        var letterRow = document.getElementById(letter);
    }
    letterRow.textContent = startsWith(letter, storage).sort().join("  \u00A0");
}


/**
 * Display answers beginning with every letter of the alphabet.
 *
 * Iterate through each letter in the alphabet. If there are any
 * answers in storage beginning with a letter, display those words.
 *
 * @param {array} letters - The letters of the alphabet.
 * @param {object} storage - Location where words are stored.
 * @param {boolean} gameEnd - Indicates whether game is over.
 * @return {undefined} SIDE-EFFECTS ONLY
 */
function allLetterAnswers(letters, storage, gameEnd = false) {
    letters.forEach( (letter) => {
        if (storage[letter]) {
            letterAnswers(letter, storage, gameEnd);
        }
    });
}


/**
 * Clear all rows of answers after game.
 *
 * @param {array} letters - Letters of the alphabet.
 * @return {undefined} SIDE-EFFECTS ONLY
 */
function clearAllAnswers(letters) {
    letters.forEach( (letter) => {
        const userAnswer = document.getElementById(letter);
        const restAnswer = document.getElementById(`answer_${letter}`);
        if (userAnswer) {
            userAnswer.textContent = "";
        }
        if (restAnswer) {
            restAnswer.textContent = "";
        }
    });
}


function gridCleanup() {
    //const word = document.getElementById("guess").value
    const word = getValue("guess").toLowerCase();
    const firstLetter = word.charAt(0);
    storeAnswer(word, gridAnswers);
    letterAnswers(firstLetter, gridAnswers);
    removeFoundAnswer(word, currentAnagram.solution);
    player.score++;
    updateScoreDisplay(player.score);
    clearGuessBox();
}


function gridGame(data) {
    clearScoreDisplay();
    clearNineLetterWord();
    storeAnagramSolution(data);
    nineLetterWords = getNineLetterWord(currentAnagram.solution);
    displayWord(currentAnagram.anagram.toUpperCase());
    categoryGuides();
    const guess = document.getElementById("guess");
    const gridGameFlow = gameFlowFactory(gridURL,
                                         gridData,
                                         gridCleanup,
                                         gridGame,
                                         false);
    guess.addEventListener("input", gridGameFlow);
}


function gridGiveUp() {
    sortFinalAnswers(currentAnagram.solution, finalAnswers);
    allLetterAnswers(LETTERS, finalAnswers, true);
    displayAnagram(getAnswer(nineLetterWords), "nine-letter-word");
    resetAnswers(gridAnswers);
    resetAnswers(finalAnswers);
    player.score = 0;
}


document.addEventListener("DOMContentLoaded", () => {
    document.getElementById("again").addEventListener("click", () => {
        fetchWrap(gridURL, gridData, gridGame);
        clearAllAnswers(LETTERS);
    });
});


document.addEventListener("DOMContentLoaded", () => {
    document.getElementById("stop").addEventListener("click", () => {
        gridGiveUp();
    });
});


document.addEventListener("DOMContentLoaded", () => {
    fetchWrap(gridURL, gridData, gridGame);
});
