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
 * Storing and retrieving all answers
 *
 */
function storeAnswer(word, storageLocation) {
    const firstLetter = word.charAt(0);
    if (storageLocation[firstLetter]) {
        storageLocation[firstLetter].push(word);
    } else {
        storageLocation[firstLetter] = [word];
    }
}

function wordsWithFirst(letter, storageLocation) {
    return storageLocation[letter];
}

function getAnswerRow(letter, storageLocation) {
    const letterRow = document.getElementById(letter);
    letterRow.textContent = wordsWithFirst(letter, storageLocation).sort().join("   ");
}

function getAllAnswerRows(letters, storageLocation) {
    letters.forEach( (letter) => {
        if (storageLocation[letter]) {
            getAnswerRow(letter, storageLocation);
        }
    });
}

function resetAnswers(storageLocation) {
    for (const prop of Object.keys(storageLocation)) {
        delete storageLocation[prop];
    }
}


/*
 * Checking, storing and retrieving answers
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

function saveWord(word, storageLocation) {
    storageLocation.push(word);
}


/*
 * Shared gameflow
 *
 */
function setUpGame(data) {
    clearGuessBox();
    const [anagram, solution] = data;
    currentAnagram.anagram = anagram;
    currentAnagram.solution = solution;
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

function gameFlowFactory(gameURL, gameData, gameCleanUp, gameFunction) {
    function gameFlow() {
        const guess = document.getElementById("guess").value;
        if (checkAnswer(guess, currentAnagram.solution)) {
            gameCleanUp();
            fetchWrap(gameURL, gameData, gameFunction);
        }
    }

    return gameFlow;
}
