"use strict";

const nineLetter = ["l", "e", "s", "i", "c", "t", "o", "e", "n"];
const letters = ["a", "b", "c"];
const words = {"a": ["apple", "asshat"],
               "b": ["donkey", "dada"],
               "c": ["comedy", "clown", "chancer"]};


function displayGrid (word) {
    const baseID = "letter";
    let countID = 1;
    word.forEach( (letter) => {
        const ID = `${baseID}${countID}`
        const square = document.getElementById(ID);
        square.textContent = letter;
        countID += 1;
    });
}


document.addEventListener("DOMContentLoaded", () => {
    //allLetterAnswers(letters, words);
    displayGrid(nineLetter);
});
