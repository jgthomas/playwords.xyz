"use strict";

const LETTERS = ["a", "b", "c", "d", "e", "f",
                 "g", "h", "i", "j", "k", "l",
                 "m", "n", "o", "p", "q", "r",
                 "s", "t", "u", "v", "w", "x", "y", "z"];

const NON_BREAKING_SPACE = "\u00A0";
const ZERO = 0;
const EMPTY_STRING = "";

const VICTORY_MESSAGE = "You Win!";

const player = {score: 0};
const wordStorage = {};
const currentAnagram = {anagram: "", solution: ""};


/*******************
 * MODIFYING DISPLAY
 *
 *******************/

/**
 * Update a single element on the screen.
 *
 * @param {string} target - ID of element to update.
 * @param {string|number} update - New value to display in element.
 * @return {undefined} SIDE-EFFECTS ONLY
 */
function displayUpdate(target, newValue) {
    document.getElementById(target).textContent = newValue;
}


/**
 * Reset the answer input field.
 *
 * @return {undefined} SIDE-EFFECTS ONLY
 */
function clearGuessBox() {
    document.getElementById("guess").value = EMPTY_STRING;
}


/**
 * Display letters in a grid or rack structure.
 *
 * @param {string|array} word - The characters to display.
 * @param {string} base - Stem of the ID where letter displayed.
 * @return {undefined} SIDE-EFFECTS ONLY
 * */
function displayWord(word, base = "letter") {
    if (typeof(word) === "string") {
        var letters = word.split("");
    } else {
        var letters = word;
    }

    const baseID = base;
    let countID = 1;
    letters.forEach( (letter) => {
        const ID = `${baseID}${countID}`
        const square = document.getElementById(ID);
        square.textContent = letter;
        countID += 1;
    });
}



/*****************************
 * GETTING AND CHECKING VALUES
 *
 *****************************/

/**
 * Get value of the specified element.
 *
 * @param {string} elementID - ID of the element to query.
 * @return {string} value - Value currently held by element.
 */
function getValue(elementID) {
    const value = document.getElementById(elementID).value;

    return value;
}


/**
 * Check guess is one of the answers to the anagram.
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
 * Calculate player's final percentage.
 *
 * @param {number} scoreA - Player score.
 * @param {number} scoreB - Computer score.
 * @return {number} percentage of computer score achieved by player.
 */
function finalPercentage(scoreA, scoreB) {
    if (scoreA === 0 || scoreB === 0) {
        return 0;
    } else {
        return (scoreA * 100) / scoreB;
    }
}


/********************************
 * STORING AND RETRIEVING ANSWERS
 *
 ********************************/

/**
 * Store an individual item in an array.
 *
 * @param {string|number} item - A word or its length.
 * @param {array} storage - Storage location
 * @return {undefined} SIDE-EFFECTS ONLY
 */
function storeItem(item, storage) {
    storage.push(item);
}


/**
 * Make comma-separated string of all possible answers.
 *
 * @param {array} answerWords - All possible answers.
 * @return {string} answers presented as a comma-separated string.
 */
function getAnswer(answerWords) {
    return answerWords.join(", ");
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



/*******************
 * FACTORY FUNCTIONS
 *
 *******************/

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
 * combines them into a main game-loop in the returned function.
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
