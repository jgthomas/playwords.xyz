"use strict";


const player = {
    score: 0
};


const currentAnagram = {
    anagram: "",
    solution: ""
};


const ladder = {
    length: 3,
    words: []
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


function simpleAnagramCleanup () {
    player.score++;
    document.getElementById("score").innerText = player.score;
    document.getElementById("guess").value = "";
}

function ladderCleanup () {
}

function setUpGame(data) {
    clearAllFields();
    const [anagram, solution] = data;
    currentAnagram.anagram = anagram;
    currentAnagram.solution = solution;
    displayAnagram(currentAnagram.anagram);
}

function ladderGame () {
    setUpGame(data);
    const guess = document.getElementById("guess");
}

function simpleAnagramGame(data) {
    setUpGame(data);
    const guess = document.getElementById("guess");
    const simpleGameFlow = gameFlowFactory(simpleAnagramURL,
                                           simpleAnagramData,
                                           simpleAnagramCleanup,
                                           simpleAnagramGame);
    guess.addEventListener("input", simpleGameFlow);
}
