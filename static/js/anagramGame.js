"use strict";


//const anagramURL = "http://127.0.0.1:5000/anagram";
const anagramURL = "https://playwords.xyz/anagram";


/**
 * Data passed in to start each game-loop AJAX request.
 */
function anagramData () {
    const wordLength = document.getElementById("word-length").value;
    return {method: "POST", body: JSON.stringify({length: wordLength})};
}


/**
 * Run after each iteration of game loop.
 */
function anagramCleanup () {
    player.score++;
    displayUpdate("score", player.score);
    clearGuessBox();
}


/**
 * Run on player ending game.
 */
function anagramGiveUp() {
    player.score = 0;
    displayUpdate("word-display", getAnswer(currentAnagram.solution));
    clearGuessBox();
}


/**
 * Main game loop.
 */
function anagramGame(data) {
    storeAnagramSolution(data);
    displayUpdate("word-display", currentAnagram.anagram);
    const guess = document.getElementById("guess");
    const anagramGameFlow = gameFlowFactory(anagramURL,
                                            anagramData,
                                            anagramCleanup,
                                            anagramGame);
    guess.addEventListener("input", anagramGameFlow);
}


document.addEventListener("DOMContentLoaded", () => {
    document.getElementById("play").addEventListener("click", () => {
        displayUpdate("score", ZERO);
        displayUpdate("word-display", NON_BREAKING_SPACE);
        fetchWrap(anagramURL, anagramData, anagramGame);
    });
});

document.addEventListener("DOMContentLoaded", () => {
    document.getElementById("stop").addEventListener("click", () => {
        anagramGiveUp();
    });
});
