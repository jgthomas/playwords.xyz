document.addEventListener("DOMContentLoaded", function () {
  const [anagram, solution] = wordData;
  const target = document.getElementById("word-place");
  target.innerText = anagram;
  const guessForm = document.getElementById("guess-form");
  guessForm.addEventListener("submit", function (e) {
    const anagramGuess = document.getElementById("guess").value;
    const answer = document.getElementById("result");
    if (anagramGuess === solution) {
      answer.innerText = "CORRECT!";
    } else {
      answer.innerText = "Try Again...";
    } 
    e.preventDefault();
    guessForm.reset();
  });
});
