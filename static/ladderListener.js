"use strict";


const ladder = {
    length: 4,
    words: []
};


const ladderURL = "http://127.0.0.1:5000/ladder";


function ladderData () {
    return {method: "POST", body: JSON.stringify({length: ladder.length.toString()})};
}


function ladderCleanup () {
    const guess = document.getElementById("guess").value;
    ladder.word.push(guess);
    guess.value = "";
    document.getElementById("score").innerText = ladder.length;
    ladder.length++;
}


function ladderGame(data) {
    setUpGame(data);
    const guess = document.getElementById("guess");
    const ladderGameFlow = gameFlowFactory(ladderURL,
                                           ladderData,
                                           ladderCleanup,
                                           ladderGame);
    guess.addEventListener("input", ladderGameFlow);
}


document.addEventListener("DOMContentLoaded", () => {
    document.getElementById("play").addEventListener("click", () => {
        resetGame();
        clearFinalFeedback();
        fetchWrap(ladderURL, ladderData, ladderGame);
    });
});


document.addEventListener("DOMContentLoaded", () => {
    document.getElementById("stop").addEventListener("click", () => {
        giveUp();
    });
});
