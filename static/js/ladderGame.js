"use strict";

const ladder = {wordLength: 4, words: []};
const ladderURL = "http://127.0.0.1:5000/ladder";
//const ladderURL = "https://1ff4ef42.ngrok.io/ladder";


function ladderData () {
    return {method: "POST",
              body: JSON.stringify({length: ladder.wordLength.toString()})
    };
}

function ladderCleanup () {
    const guess = document.getElementById("guess").value
    saveWord(guess, ladder.words);
    clearGuessBox();
    ladder.wordLength++;
}

function ladderGame(data) {
    //updateScoreDisplay(ladder.wordLength);
    setUpGame(data);
    const guess = document.getElementById("guess");
    const ladderGameFlow = gameFlowFactory(ladderURL,
                                           ladderData,
                                           ladderCleanup,
                                           ladderGame);
    guess.addEventListener("input", ladderGameFlow);
}

function ladderGiveUp() {
    const score = ladder.wordLength - 1;
    ladder.wordLength = 4;
    ladder.words = [];
    resetGame();
    displayAnagram(getAnswer(currentAnagram.solution));
}


document.addEventListener("DOMContentLoaded", () => {
    document.getElementById("play").addEventListener("click", () => {
        //clearScoreDisplay();
        resetGame();
        //clearFinalFeedback();
        fetchWrap(ladderURL, ladderData, ladderGame);
    });
});


document.addEventListener("DOMContentLoaded", () => {
    document.getElementById("stop").addEventListener("click", () => {
        ladderGiveUp();
    });
});
