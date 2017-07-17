"use strict";

const letters = ["a", "b", "c"];
const words = {"a": ["apple", "asshat"],
                     "b": ["donkey", "dada"],
                     "c": ["comedy", "clown", "chancer"]};

document.addEventListener("DOMContentLoaded", () => {
    getAllAnswerRows(letters, words);
});
