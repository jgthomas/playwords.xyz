"use strict";

const RACK_SCORES = {'a': 1, 'c': 3, 'b': 3, 'e': 1, 'd': 2, 'g': 2,
                     'f': 4, 'i': 1, 'h': 4, 'k': 5, 'j': 8, 'm': 3,
                     'l': 1, 'o': 1, 'n': 1, 'q': 10, 'p': 3, 's': 1,
                     'r': 1, 'u': 1, 't': 1, 'w': 4, 'v': 4, 'y': 4,
                     'x': 8, 'z': 10};

const RACK_BONUS = 50;
const RACK_LENGTH = 7;

const rack = {round: 1, bestScore: 0, bestAnswers: []};

const rackURL = "http://127.0.0.1:5000/rack2";


function rackData() {
    return {method: "POST",
              body: JSON.stringify({length: RACK_LENGTH.toString()})
    };
}


/**
 * Calculate word score.
 *
 * Sum the total of all the letter scores and add any bonuses.
 *
 * @param {string} word - Word to score.
 * @return {number} score - The score for word.
 */
function scoreWord(word) {
    const letters = word.split("");
    let score = letters.map( (x) => { return RACK_SCORES[x]; })
                       .reduce( (x, y) => { return x + y; });

    if (word.length == RACK_LENGTH) {
        score += RACK_BONUS;
    }

    return score;
}


function displayRoundResults(word, score, round) {
    const playerColumn = `round${round}a`;
    const bestColumn = `round${round}b`;
    const playerWord = document.getElementById(`${playerColumn}-word`);
    const playerScore = document.getElementById(`${playerColumn}-score`);
    const bestWord = document.getElementById(`${bestColumn}-word`);
    const bestScore = document.getElementById(`${bestColumn}-score`);
    playerWord.textContent = word;
    playerScore.textContent = score;

    if (score == rack.bestScore) {
        bestWord.textContent = "\u2714";
        bestScore.textContent = "\u2714";
        //bestColumn.classList.add("tick");
    } else {
        bestWord.textContent = rack.bestAnswers[0];
        bestScore.textContent = rack.bestScore;
    }
}


function rackCleanup() {
    const word = document.getElementById("guess").value
    const score = scoreWord(word);
    displayRoundResults(word, score, rack.round);
    rack.round += 1;
    rack.bestScore = 0;
    rack.bestAnswers = [];
    clearGuessBox();
}


function rackGame(data) {
    const [letters, answers, best] = data;
    const [highScore, highWords] = best;
    rack.bestScore = highScore;
    storeItem(highWords, rack.bestAnswers);
    storeAnagramSolution([letters, answers]);
    displayWord(currentAnagram.anagram.toUpperCase());
    const submit = document.getElementById("submit-word");
    const rackGameFlow = gameFlowFactory(rackURL,
                                         rackData,
                                         rackCleanup,
                                         rackGame);
    submit.addEventListener("click", rackGameFlow);
}


function rackGiveUp() {
}


/*document.addEventListener("DOMContentLoaded", () => {
    document.getElementById("again").addEventListener("click", () => {
    });
});


document.addEventListener("DOMContentLoaded", () => {
    document.getElementById("stop").addEventListener("click", () => {
    });
});*/


document.addEventListener("DOMContentLoaded", () => {
    fetchWrap(rackURL, rackData, rackGame);
});
