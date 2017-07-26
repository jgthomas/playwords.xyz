"use strict";

const ladder = {wordLength: 4, words: [], lengths: []};
const ladderURL = "http://127.0.0.1:5000/ladder";
//const ladderURL = "https://1ff4ef42.ngrok.io/ladder";


function ladderData () {
    return {method: "POST",
              body: JSON.stringify({length: ladder.wordLength.toString()})
    };
}

function storeLength(number, storage) {
    ladder.lengths.push(number);
}

function displayLadderRung(number, word) {
    const wordLength = document.getElementById(`length${number}`);
    const wordRung = document.getElementById(`word${number}`);
    wordLength.classList.toggle("hidden-rung");
    wordRung.textContent = word;
    wordRung.classList.toggle("hidden-rung");
}

function clearAllLadderRungs(numbers) {
    numbers.forEach( (number) => {
        const wordLength = document.getElementById(`length${number}`);
        const wordRung = document.getElementById(`word${number}`);
        wordLength.classList.toggle("hidden-rung");
        wordRung.classList.toggle("hidden-rung");
    });
}

function ladderCleanup () {
    const guess = document.getElementById("guess").value
    saveWord(guess, ladder.words);
    displayLadderRung(ladder.wordLength, guess);
    clearGuessBox();
    storeLength(ladder.wordLength, ladder.lengths);
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
    clearAllLadderRungs(ladder.lengths);
    ladder.lengths = [];
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
