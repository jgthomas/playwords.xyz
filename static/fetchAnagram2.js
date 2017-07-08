

const simpleAnagramURL = "http://127.0.0.1:5000/anagram";


function displayAnagram (anagram) {
    const target = document.getElementById("word-place");
    target.innerText = anagram;
}


function clearAllFields () {
    document.getElementById("result").innerText = "";
    document.getElementById("guess").value = "";
}


function checkAnswer (guess, answer) {
    if (guess === answer) {
        return true;
    }
    return false;
}


function fetchWrap (URL, gameFunction) {
    fetch(URL)
        .then( response => { return response.json(); })
        .then( data => { gameFunction(data); })
}


function getGuess () {
    const anagramGuess = document.getElementById("guess").value;
    return anagramGuess;
}


function giveFeedback (anagramGuess, solution) {
    const feedbackText = document.getElementById("result");
    if (checkAnswer(anagramGuess, solution)) {
        feedbackText.innerText = "Correct";
    } else {
        feedbackText.innerText = "Try again";
    }
}


function simpleAnagramGame (data) {
    clearAllFields();
    let [anagram, solution] = data;
    displayAnagram(anagram);

    const guessButton = document.getElementById("guess-button");
    guessButton.addEventListener("click", () => {
        const guess = getGuess();
        giveFeedback(guess, solution);
    });
}
    

document.addEventListener("DOMContentLoaded", () => {
    document.getElementById("play").addEventListener("click", () => {
        fetchWrap(simpleAnagramURL, simpleAnagramGame);
    });
});
