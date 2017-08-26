"use strict";


//const gridURL = "http://127.0.0.1:5000/grid";
const gridURL = "https://playwords.xyz/grid";


const AVERAGE = 0.25;
const GOOD = 0.4;
const EXCELLENT = 0.5;

const gridAnswers = {};
const finalAnswers = {};
const gridLength = 9;
let nineLetterWords = [];


/**
 * Data passed in to start each game-loop AJAX request.
 */
function gridData() {
    return {method: "POST",
              body: JSON.stringify({length: gridLength.toString()})
    };
}


/**
 * Display average, good and excellent numbers of words found.
 */
function displayCategoryGuides() {
    const numOfAnswers = currentAnagram.solution.length;
    document.getElementById("average")
        .textContent = Math.ceil(numOfAnswers * AVERAGE);
    document.getElementById("good")
        .textContent = Math.ceil(numOfAnswers * GOOD);
    document.getElementById("excellent")
        .textContent = Math.ceil(numOfAnswers * EXCELLENT);
}


/**
 * Extract all nine letter words from answers.
 * @param {array} arr - The answers to word grid puzzle.
 * @return {array} nines - All nine letter words.
 */
function getNineLetterWord(arr) {
    const nines = arr.filter( (x) => {
        return x.length === 9;
    });

    return nines;
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
    //letterRow.textContent = startsWith(letter, storage).sort().join("  \u00A0");
    letterRow.textContent = startsWith(letter, storage)
        .sort().join(`  ${NON_BREAKING_SPACE}`);
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


/**
 * Run after each iteration of main game loop.
 */
function gridCleanup() {
    const word = getValue("guess").toLowerCase();
    const firstLetter = word.charAt(0);
    storeAnswer(word, gridAnswers);
    letterAnswers(firstLetter, gridAnswers);
    removeFoundAnswer(word, currentAnagram.solution);
    player.score++;
    displayUpdate("score", player.score);
    clearGuessBox();
}


/**
 * Run on player ending game loop.
 */
function gridGiveUp() {
    sortFinalAnswers(currentAnagram.solution, finalAnswers);
    allLetterAnswers(LETTERS, finalAnswers, true);
    displayUpdate("nine-letter-word", getAnswer(nineLetterWords));
    clearGuessBox();
    resetAnswers(gridAnswers);
    resetAnswers(finalAnswers);
    player.score = 0;
}


/**
 * Main game loop.
 */
function gridGame(data) {
    storeAnagramSolution(data);
    nineLetterWords = getNineLetterWord(currentAnagram.solution);
    displayWord(currentAnagram.anagram.toUpperCase());
    displayCategoryGuides();
    const guess = document.getElementById("guess");
    const gridGameFlow = gameFlowFactory(gridURL,
                                         gridData,
                                         gridCleanup,
                                         gridGame,
                                         false);
    guess.addEventListener("input", gridGameFlow);
}


document.addEventListener("DOMContentLoaded", () => {
    document.getElementById("again").addEventListener("click", () => {
        displayUpdate("score", ZERO);
        displayUpdate("nine-letter-word", EMPTY_STRING);
        clearAllAnswers(LETTERS);
        fetchWrap(gridURL, gridData, gridGame);
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
