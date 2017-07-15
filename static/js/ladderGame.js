"use strict";


const ladder = {
    wordLength: 4,
         words: []
};


const ladderURL = "http://127.0.0.1:5000/ladder";


function ladderData () {
    return {method: "POST",
              body: JSON.stringify({length: ladder.wordLength.toString()})
    };
}


function ladderCleanup () {
    const guess = document.getElementById("guess")
    ladder.words.push(guess.value);
    guess.value = "";
    ladder.wordLength++;
}


function ladderGame(data) {
    updateScoreDisplay(ladder.wordLength);
    setUpGame(data);
    const guess = document.getElementById("guess");
    const ladderGameFlow = gameFlowFactory(ladderURL,
                                           ladderData,
                                           ladderCleanup,
                                           ladderGame);
    guess.addEventListener("input", ladderGameFlow);
}


function ladderGameEnd() {
    ladder.wordLength = 4;
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
        ladderGameEnd();
    });
});
