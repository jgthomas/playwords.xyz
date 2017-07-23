"use strict";

const nineLetter = ["l", "e", "s", "i", "c", "t", "o", "e", "n"];
const words = {"a": ["apple", "asshat"],
               "b": ["brazil", "brag"],
               "c": ["comedy", "clown", "chancer"]};


const gridAnswers = {};
const gridURL = "http://127.0.0.1:5000/grid";
const gridLength = 9;


function gridData() {
    return {method: "POST",
              body: JSON.stringify({length: gridLength.toString()})
    };
}


function gridCleanup() {
    const word = document.getElementById("guess").value
    const firstLetter = word.charAt(0);
    storeAnswer(word, gridAnswers);
    letterAnswers(firstLetter, gridAnswers);
    removeFoundAnswer(word, currentAnagram.solution);
    player.score++;
    updateScoreDisplay(player.score);
    clearGuessBox();
}


function gridGame(data) {
    storeAnagramSolution(data);
    displayWord(currentAnagram.anagram);
    const guess = document.getElementById("guess");
    const gridGameFlow = gameFlowFactory(gridURL,
                                         gridData,
                                         gridCleanup,
                                         gridGame,
                                         false);
    guess.addEventListener("input", gridGameFlow);
}


function gridGiveUp() {
}


document.addEventListener("DOMContentLoaded", () => {
    fetchWrap(gridURL, gridData, gridGame);
});
