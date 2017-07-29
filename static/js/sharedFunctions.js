"use strict";

const LETTERS = ["a", "b", "c", "d", "e", "f",
                 "g", "h", "i", "j", "k", "l",
                 "m", "n", "o", "p", "q", "r",
                 "s", "t", "u", "v", "w", "x", "y", "z"];

const player = {score: 0};
const wordStorage = {};
const currentAnagram = {anagram: "", solution: ""};


/**
 * Display single anagram on the screen.
 *
 * @param {string} anagram - The jumbled word to display.
 * @return {undefined} SIDE-EFFECTS ONLY
 */
function displayAnagram(anagram) {
    document.getElementById("word-place").innerText = anagram;
}


/**
 * Display letters in a grid or rack structure.
 *
 * @param {string} word - The letters to display.
 * @param {string} base - Stem of the ID where letter displayed.
 * @return {undefined} SIDE-EFFECTS ONLY
 * */
function displayWord(word, base = "letter") {
    const letters = word.split("");
    const baseID = base;
    let countID = 1;
    letters.forEach( (letter) => {
        const ID = `${baseID}${countID}`
        const square = document.getElementById(ID);
        square.textContent = letter;
        countID += 1;
    });
}


/**
 * Check word is one of the answers to the anagram.
 *
 * @param {string} guess - The word entered by player.
 * @param {array} answers - Possible answers to the anagram.
 * @return {boolean} true if guess in answers, else false
 */
function checkAnswer(guess, answers) {
    if (answers.includes(guess.toLowerCase())) {
        return true;
    }

    return false;
}


/**
 * Update the displayed score.
 *
 * @param {number} score - The score to display.
 * @return {undefined} SIDE-EFFECTS ONLY
 */
function updateScoreDisplay(score) {
    document.getElementById("score").innerText = score;
}


/**
 * Reset the answer input field.
 *
 * @return {undefined} SIDE-EFFECTS ONLY
 */
function clearGuessBox() {
    document.getElementById("guess").value = "";
}


/**
 * Remove the currently displayed anagram.
 *
 * @return {undefined} SIDE-EFFECTS ONLY
 */
function clearAnagramWord() {
    document.getElementById("word-place").innerText = "\u00A0";
}


/**
 * Reset the displayed score to zero.
 *
 * @return {undefined} SIDE-EFFECTS ONLY
 */
function clearScoreDisplay() {
    document.getElementById("score").innerText = 0;
}


function clearFinalFeedback() {
    document.getElementById("solution").innerText = "";
    document.getElementById("final-score").innerText = "";
}

function clearAllAnswers(letters) {
    /*
     * Clear all letter rows of answers.
     *
     * */
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
 * Store each answer entered by player.
 *
 * @param {string} word - Supplied answer.
 * @param {object} storage - Object in which answers are stored.
 * @return {undefined} SIDE-EFFECTS ONLY
 */
function storeAnswer(word, storage) {
    const firstLetter = word.charAt(0);
    if (storage[firstLetter]) {
        storage[firstLetter].push(word);
    } else {
        storage[firstLetter] = [word];
    }
}


/**
 * Sort all the remaining unguessed words into storage object.
 *
 * @param {array} solutions - All answers.
 * @param {object} storage - Object in which answers are stored.
 */
function sortFinalAnswers(solutions, storage) {
    solutions.forEach( (solution) => {
        storeAnswer(solution, storage);
    });
}


/**
 * Get all answers beginning with supplied letter
 *
 * @param {string} letter - Initial letter of the words to retrieve.
 * @param {object} storage - Object in which words are stored.
 * @return {array} words in storage starting with letter.
 */
function startsWith(letter, storage) {
    return storage[letter];
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
 * Remove all stored answers.
 *
 * Delete all properties (key: letter, value: array) of the object.
 *
 * @param {object} storage - Object in which words are stored.
 * @return {undefined} SIDE-EFFECTS ONLY
 */
function resetAnswers(storage) {
    for (const prop of Object.keys(storage)) {
        delete storage[prop];
    }
}


/**
 * Remove each answer when entered by player.
 *
 * @param {string} answer - Correct answer supplied by player.
 * @param {object} storage - Object in which answers are stored.
 * @return {undefined} SIDE-EFFECTS ONLY
 */
function removeFoundAnswer(answer, storage) {
    const index = storage.indexOf(answer);
    storage.splice(index, 1);
}


/*
 * T.B.D.
 *
 */
function getAnswer(answerWords) {
    return answerWords.join(", ");
}

function saveWord(word, storage) {
    storage.push(word);
}


/**
 * Store anagram and its solutions.
 *
 * The currently active anagram and its solutions are placed in
 * the 'working memory' of the currentAnagram object.
 *
 * @param {array} data - Contains anagram string and array of answers.
 * @return {undefined} SIDE-EFFECTS ONLY
 */
function storeAnagramSolution(data) {
    const [anagram, solution] = data;
    currentAnagram.anagram = anagram;
    currentAnagram.solution = solution;
}


function setUpGame(data) {
    clearGuessBox();
    storeAnagramSolution(data);
    displayAnagram(currentAnagram.anagram);
}

function resetGame() {
    clearGuessBox();
    clearAnagramWord();
}


/**
 * Make AJAX request to server.
 *
 * @param {string} fetchURL - The URL to which AJAX requests should be directed.
 * @param {object} fetchData - Parameters for the fetch request.
 * @param {function} gameFunction - Callback to which response is passed.
 * @return {object} JSON passed to callback function.
 */
function fetchWrap(fetchURL, fetchData, gameFunction) {
    fetch(fetchURL, fetchData())
        .then( (response) => {
            return response.json(); 
        })
        .then( (data) => {
            gameFunction(data); 
        })
        .catch( (error) => {
            console.log(error);
        });
}


/**
 * Create main loop-function for game.
 *
 * Factory function: Takes in a number of functions and data objects and
 * combines them into a main game loop in the returned function.
 *
 * @param {string} gameURL - The URL to which AJAX requests should be directed.
 * @param {object} gameData - Parameters for the fetch request.
 * @param {function} gameCleanup - Runs after each correct answer.
 * @param {function} gameFunction - Sets up the game.
 * @param {boolean} repeat - If true, loop re-runs after each correct answer.
 * @return {function} gameFlow - Main game loop.
 */
function gameFlowFactory(gameURL, gameData, gameCleanUp, gameFunction, repeat = true) {
    function gameFlow() {
        const guess = document.getElementById("guess").value;
        if (checkAnswer(guess, currentAnagram.solution)) {
            gameCleanUp();
            if (repeat) {
                fetchWrap(gameURL, gameData, gameFunction);
            }
        }
    }

    return gameFlow;
}
