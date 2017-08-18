"use strict";


const anagramURL = "http://127.0.0.1:5000/anagram";


/**
 * Data passed in to start each game-loop AJAX request.
 */
function anagramData () {
    const wordLength = document.getElementById("word-length").value;
    return {method: "POST", body: JSON.stringify({length: wordLength})};
}


/**
 * Run after each iteration of main game loop.
 */
function anagramCleanup () {
    player.score++;
    updateScoreDisplay(player.score);
    clearGuessBox();
}


/**
 * Run on player ending game loop.
 */
function anagramGiveUp() {
    player.score = 0;
    resetGame();
    displayAnagram(getAnswer(currentAnagram.solution));
}


/**
 * Main game loop.
 */
function anagramGame(data) {
    setUpGame(data);
    const guess = document.getElementById("guess");
    const anagramGameFlow = gameFlowFactory(anagramURL,
                                            anagramData,
                                            anagramCleanup,
                                            anagramGame);
    guess.addEventListener("input", anagramGameFlow);
}


document.addEventListener("DOMContentLoaded", () => {
    document.getElementById("play").addEventListener("click", () => {
        clearScoreDisplay();
        resetGame();
        fetchWrap(anagramURL, anagramData, anagramGame);
    });
});

document.addEventListener("DOMContentLoaded", () => {
    document.getElementById("stop").addEventListener("click", () => {
        anagramGiveUp();
    });
});
