"use strict";

//const anagramURL = "http://127.0.0.1:5000/anagram";
const anagramURL = "https://3b6d3d9c.ngrok.io/anagram";


function anagramData () {
    const wordLength = document.getElementById("word-length").value;
    return {method: "POST", body: JSON.stringify({length: wordLength})};
}

function anagramCleanup () {
    player.score++;
    updateScoreDisplay(player.score);
    clearGuessBox();
}

function anagramGame(data) {
    setUpGame(data);
    const guess = document.getElementById("guess");
    const anagramGameFlow = gameFlowFactory(anagramURL,
                                            anagramData,
                                            anagramCleanup,
                                            anagramGame);
    guess.addEventListener("input", anagramGameFlow);
}

function anagramGiveUp() {
    player.score = 0;
    resetGame();
    displayAnagram(getAnswer(currentAnagram.solution));
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
