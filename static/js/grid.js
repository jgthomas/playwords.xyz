"use strict";

const gridAnswers = {};
const finalAnswers = {};
const gridURL = "http://127.0.0.1:5000/grid";
const gridLength = 9;


function gridData() {
    return {method: "POST",
              body: JSON.stringify({length: gridLength.toString()})
    };
}


function categoryGuides() {
    const numOfAnswers = currentAnagram.solution.length;
    const average = 0.25;
    const good = 0.4;
    const excellent = 0.5;
    document.getElementById("average").textContent = Math.ceil(numOfAnswers * average);
    document.getElementById("good").textContent = Math.ceil(numOfAnswers * good);
    document.getElementById("excellent").textContent = Math.ceil(numOfAnswers * excellent);
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
    clearScoreDisplay();
    storeAnagramSolution(data);
    displayWord(currentAnagram.anagram);
    categoryGuides();
    const guess = document.getElementById("guess");
    const gridGameFlow = gameFlowFactory(gridURL,
                                         gridData,
                                         gridCleanup,
                                         gridGame,
                                         false);
    guess.addEventListener("input", gridGameFlow);
}


function gridGiveUp() {
    sortFinalAnswers(currentAnagram.solution, finalAnswers);
    allLetterAnswers(LETTERS, finalAnswers, true);
    resetAnswers(gridAnswers);
    resetAnswers(finalAnswers);
    player.score = 0;
}


document.addEventListener("DOMContentLoaded", () => {
    document.getElementById("again").addEventListener("click", () => {
        fetchWrap(gridURL, gridData, gridGame);
        clearAllAnswers(LETTERS);
    });
});


document.addEventListener("DOMContentLoaded", () => {
    document.getElementById("stop").addEventListener("click", () => {
        gridGiveUp();
    });
});


document.addEventListener("DOMContentLoaded", () => {
    fetchWrap(gridURL, gridData, gridGame);
});
