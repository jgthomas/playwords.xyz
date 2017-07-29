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
 * Output letters into a grid or rack structure.
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


/*
 * Page clearing functions
 *
 */
function clearGuessBox() {
    document.getElementById("guess").value = "";
}

function clearAnagramWord() {
    document.getElementById("word-place").innerText = "\u00A0";
}

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



/*
 * Page updating functions
 *
 */
function updateScoreDisplay(score) {
    document.getElementById("score").innerText = score;
}


/*
 * Storing and retrieving answers
 *
 */
function storeAnswer(word, storage) {
    const firstLetter = word.charAt(0);
    if (storage[firstLetter]) {
        storage[firstLetter].push(word);
    } else {
        storage[firstLetter] = [word];
    }
}

function sortFinalAnswers(solutions, storage) {
    /*
     * Sort all the remaining unguessed words into
     * an object, for output at end of game.
     *
     * */
    solutions.forEach( (solution) => {
        storeAnswer(solution, storage);
    });
}

function startsWith(letter, storage) {
    return storage[letter];
}

function letterAnswers(letter, storage, gameEnd = false) {
    /*
     * Update the row of answers for words beginning with letter.
     *
     * */
    if (gameEnd) {
        var letterRow = document.getElementById(`answer_${letter}`);
    } else {
        var letterRow = document.getElementById(letter);
    }
    letterRow.textContent = startsWith(letter, storage).sort().join("  \u00A0");
}

function allLetterAnswers(letters, storage, gameEnd = false) {
    /*
     * Update all rows of answers for words beginning with every letter.
     *
     * */
    letters.forEach( (letter) => {
        if (storage[letter]) {
            letterAnswers(letter, storage, gameEnd);
        }
    });
}

function resetAnswers(storage) {
    for (const prop of Object.keys(storage)) {
        delete storage[prop];
    }
}

function removeFoundAnswer(answer, storage) {
    /*
     * Remove each answer as found to prevent duplicates
     * and keep storage full of unguessed words for final output.
     *
     * */
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


/*
 * Shared gameflow
 *
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


/*
 * Factory and wrapper functions
 *
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
 * Create main loop-function for an anagram game.
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
