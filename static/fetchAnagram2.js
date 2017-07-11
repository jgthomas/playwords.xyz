"use strict";

const simpleAnagramURL = "http://127.0.0.1:5000/anagram";


const player = {
    score: 0
};


const currentAnagram = {
    anagram: "",
    solution: ""
};


const anagramLadder = {
    length: 4,
    words: []
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


function incrementScore() {
    player.score++;
    document.getElementById("score").innerText = player.score;
}


function displayAnagram(anagram) {
    const target = document.getElementById("word-place");
    target.innerText = anagram;
}


function clearAllFields() {
    document.getElementById("guess").value = "";
}


function checkAnswer(guess, answers) {
    if (answers.includes(guess)) {
        return true;
    }

    return false;
}


function getGuess() {
    const anagramGuess = document.getElementById("guess").value;
    return anagramGuess;
}


function giveUp() {
    const answer = document.getElementById("solution");
    const finalScore = document.getElementById("final-score");
    answer.innerText = currentAnagram.solution.join(", ");
    const score = player.score;
    finalScore.innerText = `Final Score: ${score}`;
    resetGame();
}


function fetchWrap(URL, gameFunction) {
    fetch(URL, {method: "POST",
                body: JSON.stringify({
                    length: document.getElementById("word-length").value
                })
    })
        .then( response => { return response.json(); })
        .then( data => { gameFunction(data); });
}


function simpleGameFlow() {
    const guess = document.getElementById("guess").value;

    if (checkAnswer(guess, currentAnagram.solution)) {
        incrementScore();
        clearAllFields();
        fetchWrap(simpleAnagramURL, simpleAnagramGame);
    }
}


function ladderGameFlow() {
    /*const guess = document.getElementById("guess").value;

    if (checkAnswer(guess, currentAnagram.solution)) {
        anagramLadder.words.push(guess);
        anagramLadder.length++;
        updateDisplay();
        clearAllFields();
        fetchWrap(anagramLadderURL, anagramLadderParams, anagramLadderGame);*/
    }
}


function setUpGame(data) {
    clearAllFields();
    const [anagram, solution] = data;
    currentAnagram.anagram = anagram;
    currentAnagram.solution = solution;
    displayAnagram(currentAnagram.anagram);
}


function simpleAnagramGame(data) {
    setUpGame(data);
    const guess = document.getElementById("guess");
    guess.addEventListener("input", simpleGameFlow);
}


function anagramLadderGame(data) {
}
