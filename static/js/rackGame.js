"use strict";


const rackURL = "http://127.0.0.1:5000/rack";
//const rackURL = "https://playwords.xyz/rack";


const RACK_SCORES = {'a': 1, 'c': 3, 'b': 3, 'e': 1, 'd': 2, 'g': 2,
                     'f': 4, 'i': 1, 'h': 4, 'k': 5, 'j': 8, 'm': 3,
                     'l': 1, 'o': 1, 'n': 1, 'q': 10, 'p': 3, 's': 1,
                     'r': 1, 'u': 1, 't': 1, 'w': 4, 'v': 4, 'y': 4,
                     'x': 8, 'z': 10};

const RACK_BONUS = 50;
const RACK_LENGTH = 7;
const MAX_ROUNDS = 10;
const TICK_MARK = "\u2714";
const PASS_SYMBOL = "-";

const rack = {round: 1, bestScore: 0, bestAnswers: []};
const rackScores = {player: 0, best: 0};


/**
 * Data passed in to start each game-loop AJAX request.
 */
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


/**
 * Format and output the results of each round.
 */
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
        bestWord.textContent = TICK_MARK;
        bestScore.textContent = TICK_MARK;
        playerWord.classList.add("correct");
        playerScore.classList.add("correct");
        bestWord.classList.add("correct");
        bestScore.classList.add("correct");
    } else {
        bestWord.textContent = getAnswer(rack.bestAnswers[0]);
        bestScore.textContent = rack.bestScore;
        bestWord.classList.add("correction");
        bestScore.classList.add("correction");
        playerWord.classList.add("incorrect");
        playerScore.classList.add("incorrect");
    }
}


/**
 * Update scores and score display after each round.
 */
function updateRackScores(score) {
    rackScores.player += score;
    rackScores.best += rack.bestScore
    displayUpdate("final-player-score", rackScores.player);
    displayUpdate("final-best-score", rackScores.best);
}


/**
 * Reset rack for new game.
 */
function resetRack() {
    rack.bestScore = 0;
    rack.bestAnswers = [];
}


/**
 * Run after each iteration of game loop.
 */
function rackCleanup() {
    const word = document.getElementById("guess").value.toLowerCase();
    const wordScore = scoreWord(word);
    displayRoundResults(word, wordScore, rack.round);
    rack.round += 1;
    updateRackScores(wordScore);
    resetRack();
    clearGuessBox();
}


/**
 * Get the score of each letter in the rack.
 *
 * @param {string} letters - The letters to score.
 * @return {array} letterScores - Score for each letter in rack.
 * */
function getEachLetterScore(letters) {
    const letterScores = letters.split("").map( (letter) => {
        return RACK_SCORES[letter];
    });

    return letterScores;
}


/**
 * Clear words, scores and feedback.
 */
function clearAnswers(className) {
    const targetClass = document.getElementsByClassName(className);
    Array.from(targetClass).forEach( (target) => {
        target.textContent = "";
        target.classList.remove("correct");
        target.classList.remove("incorrect");
        target.classList.remove("correction");
    });
}


/**
 * Run on player ending game loop.
 */
function rackGiveUp() {
    rack.round = 1;
    rackScores.player = 0;
    rackScores.best = 0;
    resetRack();
    clearGuessBox();
}


/**
 * Run on new game being started by player.
 */
function gameEndCleanUp() {
    clearAnswers("player-answers");
    clearAnswers("best-answers");
    updateRackScores(0);
    displayUpdate("final-percentage", EMPTY_STRING);
}


/**
 * Run when player passes on a rack of letters.
 */
function pass() {
    displayRoundResults(PASS_SYMBOL, 0, rack.round);
    rack.round += 1;
    updateRackScores(0);
    resetRack();
    clearGuessBox();

    if (rack.round >= MAX_ROUNDS) {
        rackGiveUp();
        gameEndCleanUp();
    }
}


/**
 * Main game loop.
 */
function rackGame(data) {
    if (rack.round <= MAX_ROUNDS) {
        const [letters, answers, best] = data;
        const [highScore, highWords] = best;
        rack.bestScore = highScore;
        storeItem(highWords, rack.bestAnswers);
        storeAnagramSolution([letters, answers]);
        displayWord(currentAnagram.anagram.toUpperCase());
        displayWord(getEachLetterScore(letters), "score");
        const submit = document.getElementById("ok");
        const rackGameFlow = gameFlowFactory(rackURL,
                                             rackData,
                                             rackCleanup,
                                             rackGame);
        submit.addEventListener("click", rackGameFlow);
    } else {
        const percentage = finalPercentage(rackScores.player, rackScores.best);
        displayUpdate("final-percentage", `${Math.round(percentage)}%`);
        rackGiveUp();
    }
}


document.addEventListener("DOMContentLoaded", () => {
    document.getElementById("pass").addEventListener("click", () => {
        pass();
        fetchWrap(rackURL, rackData, rackGame);
    });
});

document.addEventListener("DOMContentLoaded", () => {
    document.getElementById("new").addEventListener("click", () => {
        rackGiveUp();
        gameEndCleanUp();
        fetchWrap(rackURL, rackData, rackGame);
    });
});

document.addEventListener("DOMContentLoaded", () => {
    fetchWrap(rackURL, rackData, rackGame);
});
