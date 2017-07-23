"use strict";

/*
 * Constants
 *
 */
const LETTERS = ["a", "b", "c", "d", "e", "f",
                 "g", "h", "i", "j", "k", "l",
                 "m", "n", "o", "p", "q", "r",
                 "s", "t", "u", "v", "w", "x", "y", "z"];


/*
 * Game and player objects
 *
 */
const player = {score: 0};
const wordStorage = {};
const currentAnagram = {anagram: "", solution: ""};


/*
 * Page display functions
 *
 */
function displayAnagram(anagram) {
    document.getElementById("word-place").innerText = anagram;
}

function displayAnswer(answerWords) {
    const answer = document.getElementById("solution");
    answer.innerText = answerWords.join(", ");
}

function displayFinalScore(message, score) {
    const finalScore = document.getElementById("final-score");
    finalScore.innerText = `${message}: ${score}`;
}

function displayWord(word) {
    const letters = word.split("");
    const baseID = "letter";
    let countID = 1;
    letters.forEach( (letter) => {
        const ID = `${baseID}${countID}`
        const square = document.getElementById(ID);
        square.textContent = letter;
        countID += 1;
    });
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

function startsWith(letter, storage) {
    return storage[letter];
}

function letterAnswers(letter, storage) {
    const letterRow = document.getElementById(letter);
    letterRow.textContent = startsWith(letter, storage).sort().join("  \u00A0");
}

function allLetterAnswers(letters, storage) {
    letters.forEach( (letter) => {
        if (storage[letter]) {
            letterAnswers(letter, storage);
        }
    });
}

function resetAnswers(storage) {
    for (const prop of Object.keys(storage)) {
        delete storage[prop];
    }
}

function removeFoundAnswer(answer, storage) {
    const index = storage.indexOf(answer);
    storage.splice(index, 1);
}


/*
 * Checking answers
 *
 */
function checkAnswer(guess, answers) {
    if (answers.includes(guess.toLowerCase())) {
        return true;
    }

    return false;
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
