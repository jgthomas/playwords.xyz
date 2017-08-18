"use strict";


const ladderURL = "http://127.0.0.1:5000/ladder";

const ladder = {wordLength: 4, words: [], lengths: []};
const LONGEST_WORD = 15;


/**
 * Data passed in to start each game-loop AJAX request.
 */
function ladderData () {
    return {method: "POST",
              body: JSON.stringify({length: ladder.wordLength.toString()})
    };
}


/**
 * Display ladder rung and word as player gets right answer.
 */
function displayLadderRung(number, word) {
    const wordLength = document.getElementById(`length${number}`);
    const wordRung = document.getElementById(`word${number}`);
    wordLength.classList.toggle("hidden-rung");
    wordRung.textContent = word;
    wordRung.classList.toggle("hidden-rung");
}


/**
 * Clear all words and ladder rungs for new game.
 */
function clearAllLadderRungs(numbers) {
    numbers.forEach( (number) => {
        const wordLength = document.getElementById(`length${number}`);
        const wordRung = document.getElementById(`word${number}`);
        wordLength.classList.toggle("hidden-rung");
        wordRung.textContent = "";
        wordRung.classList.toggle("hidden-rung");
    });
}


/**
 * Run after each iteration of main game loop.
 */
function ladderCleanup () {
    const guess = document.getElementById("guess").value
    storeItem(guess, ladder.words);
    displayLadderRung(ladder.wordLength, guess.toLowerCase());
    clearGuessBox();
    storeItem(ladder.wordLength, ladder.lengths);
    ladder.wordLength++;
}


/**
 * Run on player ending game loop.
 */
function ladderGiveUp() {
    const score = ladder.wordLength - 1;
    ladder.wordLength = 4;
    ladder.words = [];
    resetGame();
    displayAnagram(getAnswer(currentAnagram.solution));
}


/**
 * Run on new game being started by player.
 */
function clearOldGame() {
    resetGame();
    clearAllLadderRungs(ladder.lengths);
    ladder.lengths = [];
}


/**
 * Main game loop.
 */
function ladderGame(data) {
    if (ladder.wordLength <= LONGEST_WORD) {
        setUpGame(data);
        const guess = document.getElementById("guess");
        const ladderGameFlow = gameFlowFactory(ladderURL,
                                               ladderData,
                                               ladderCleanup,
                                               ladderGame);
        guess.addEventListener("input", ladderGameFlow);
    } else {
        ladderGiveUp();
        displayAnagram("You Win!");
    }
}


document.addEventListener("DOMContentLoaded", () => {
    document.getElementById("play").addEventListener("click", () => {
        clearOldGame();
        fetchWrap(ladderURL, ladderData, ladderGame);
    });
});

document.addEventListener("DOMContentLoaded", () => {
    document.getElementById("stop").addEventListener("click", () => {
        ladderGiveUp();
    });
});

document.addEventListener("DOMContentLoaded", () => {
        fetchWrap(ladderURL, ladderData, ladderGame);
});
