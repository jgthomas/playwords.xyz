"use strict";


const player = {
    score: 0
};


const currentAnagram = {
    anagram: "",
    solution: ""
};


function clearAllFields() {
    document.getElementById("guess").value = "";
}

function resetGame() {
    clearAllFields();
    document.getElementById("word-place").innerText = "\u00A0";
    player.score = 0;
    document.getElementById("score").innerText = 0;
}

function clearFinalFeedback() {
    document.getElementById("solution").innerText = "";
    document.getElementById("final-score").innerText = "";
}

function displayAnagram(anagram) {
    const target = document.getElementById("word-place");
    target.innerText = anagram;
}

function checkAnswer(guess, answers) {
    if (answers.includes(guess)) {
        return true;
    }

    return false;
}

function giveUp() {
    const answer = document.getElementById("solution");
    const finalScore = document.getElementById("final-score");
    answer.innerText = currentAnagram.solution.join(", ");
    const score = player.score;
    finalScore.innerText = `Final Score: ${score}`;
    resetGame();
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


function setUpGame(data) {
    clearAllFields();
    const [anagram, solution] = data;
    currentAnagram.anagram = anagram;
    currentAnagram.solution = solution;
    displayAnagram(currentAnagram.anagram);
}
