

const simpleAnagramURL = "http://127.0.0.1:5000/anagram";


const player =  {
    score: 0
}


const currentAnagram = {
    anagram: "",
    solution: ""
}


function resetGame() {
    clearAllFields();
    document.getElementById("word-place").innerText = "";
    player.score = 0;
    document.getElementById("score").innerText = 0;
}


function clearFinalFeedback() {
    document.getElementById("solution").innerText = "";
    document.getElementById("final-score").innerText = "";
}


function incrementScore() {
    player.score++;
    document.getElementById("score").innerText = player.score;
}


function displayAnagram(anagram) {
    const target = document.getElementById("word-place");
    target.innerText = anagram;
}


function clearAllFields() {
    document.getElementById("guess").value = "";
}


function checkAnswer(guess, answer) {
    if (guess === answer) {
        return true;
    }

    /*if (guess.length === answer.length) {
        const guessSorted = guess.split("").sort().join("");
        const answerSorted = answer.split("").sort().join("");

        if (guessSorted === answerSorted) {
            return true;
        }
    }*/

    return false;
}


function getGuess() {
    const anagramGuess = document.getElementById("guess").value;
    return anagramGuess;
}


function giveUp() {
    answer = document.getElementById("solution");
    finalScore = document.getElementById("final-score");
    answer.innerText = currentAnagram.solution;
    const score = player.score;
    finalScore.innerText = `Final Score: ${score}`;
    resetGame();
}


function fetchWrap(URL, gameFunction) {
    fetch(URL, {method: 'POST',
                body: JSON.stringify({
                    length: document.getElementById("word-length").value
                })
    })
        .then( response => { return response.json(); })
        .then( data => { gameFunction(data); })
}


function monitorAnswer() {
    const guess = document.getElementById("guess").value;
    
    if (checkAnswer(guess, currentAnagram.solution)) {
        incrementScore();
        clearAllFields();
        fetchWrap(simpleAnagramURL, simpleAnagramGame);
    }
}


function simpleAnagramGame(data) {
    clearAllFields();
    let [anagram, solution] = data;
    currentAnagram.anagram = anagram;
    currentAnagram.solution = solution;
    displayAnagram(currentAnagram.anagram);
    const guess = document.getElementById("guess");
    guess.addEventListener("input", monitorAnswer);
}
    

document.addEventListener("DOMContentLoaded", () => {
    document.getElementById("play").addEventListener("click", () => {
        resetGame();
        clearFinalFeedback();
        fetchWrap(simpleAnagramURL, simpleAnagramGame);
    });
});


document.addEventListener("DOMContentLoaded", () => {
    document.getElementById("stop").addEventListener("click", () => {
        giveUp();
    });
});
