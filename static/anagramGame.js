"use strict";


const simpleAnagramURL = "http://127.0.0.1:5000/anagram";


function simpleAnagramData () {
    const wordLength = document.getElementById("word-length").value;
    return {method: "POST", body: JSON.stringify({length: wordLength})};
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


document.addEventListener("DOMContentLoaded", () => {
    document.getElementById("play").addEventListener("click", () => {
        resetGame();
        clearFinalFeedback();
        fetchWrap(simpleAnagramURL, simpleAnagramData, simpleAnagramGame);
    });
});
