"use strict";


const anagramURL = "http://127.0.0.1:5000/anagram";


function anagramData () {
    const wordLength = document.getElementById("word-length").value;
    return {method: "POST", body: JSON.stringify({length: wordLength})};
}


function anagramCleanup () {
    player.score++;
    document.getElementById("score").innerText = player.score;
    document.getElementById("guess").value = "";
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


document.addEventListener("DOMContentLoaded", () => {
    document.getElementById("play").addEventListener("click", () => {
        resetGame();
        clearFinalFeedback();
        fetchWrap(anagramURL, anagramData, anagramGame);
    });
});


document.addEventListener("DOMContentLoaded", () => {
    document.getElementById("stop").addEventListener("click", () => {
        giveUp();
    });
});
