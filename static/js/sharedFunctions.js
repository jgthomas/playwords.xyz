"use strict";

const player = {score: 0};
const currentAnagram = {anagram: "", solution: ""};


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


function updateScoreDisplay(score) {
    document.getElementById("score").innerText = score;
}


function checkAnswer(guess, answers) {
    if (answers.includes(guess)) {
        return true;
    }

    return false;
}

function saveWord(word, storageLocation) {
    storageLocation.push(word);
}

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
    clearScoreDisplay();
}


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
