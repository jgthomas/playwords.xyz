function get(url) {
    return new Promise( (resolve, reject) => {
        const req = new XMLHttpRequest();
        req.open('GET', url);
        req.onload = () => {
            if (req.status === 200) {
                resolve(req.response);
            } else {
                reject(Error(req.statusText));
            }
        };
        req.onerror = () => {
            reject(Error("Network Error"));
        };
        req.send();
    });
}


get('127.0.0.1:5000/anagram').then( (result) => {
    const data = JSON.parse(result);
    return data;
}).catch( (error) => {
    return ["Error: ", error];
})


document.addEventListener("DOMContentLoaded", function () {
    const playButton = document.getElementById("play");
    playButton.addEventListener("click", function () {
        const [anagram, solution] = getAnagram2();
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
});
