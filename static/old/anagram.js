function getNewAnagram (url, methodType, callback) {
    xhr = new XMLHttpRequest();
    xhr.open(methodType, url);
    xhr.send();
    xhr.onreadystatechange = function () {
        if (xhr.readystate === 4) {
            if (xhr.status === 200) {
                const resp = xhr.responsetext;
                const respJson = JSON.parse(resp);
                let [anagram, solution] = respJson;
                callback(anagram);
            } else {
                console.log("xhr failed");
            }
        } else {
            console.log("xhr being processed");
        }
    }
}


function displayAnagram (data) {
  const target = document.getElementById("word-place");
  target.innerText = data;
}


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
