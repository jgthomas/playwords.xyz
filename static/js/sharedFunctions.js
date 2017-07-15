"use strict";


const player = {
    score: 0
};


const currentAnagram = {
    anagram: "",
    solution: ""
};


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

function displayAnagram(anagram) {
    document.getElementById("word-place").innerText = anagram;
}

function displayAnswer() {
    const answer = document.getElementById("solution");
    answer.innerText = currentAnagram.solution.join(", ");
}

function displayFinalScore() {
    const finalScore = document.getElementById("final-score");
    finalScore.innerText = `Final Score: ${player.score}`;
}

function updateScoreDisplay(score) {
    document.getElementById("score").innerText = score;
}


function resetGame() {
    clearGuessBox();
    clearAnagramWord();
    clearScoreDisplay();
    player.score = 0;
}

function checkAnswer(guess, answers) {
    if (answers.includes(guess)) {
        return true;
    }

    return false;
}

function giveUp() {
    displayAnswer();
    displayFinalScore();
    resetGame();
}

function setUpGame(data) {
    clearGuessBox();
    const [anagram, solution] = data;
    currentAnagram.anagram = anagram;
    currentAnagram.solution = solution;
    displayAnagram(currentAnagram.anagram);
}


function fetchWrap(fetchURL, fetchData, gameFunction) {
    fetch(fetchURL, fetchData())
        .then( (response) => {
            return response.json(); 
        })
        .then( (data) => { 
            gameFunction(data); 
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
