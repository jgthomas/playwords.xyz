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


/*get('127.0.0.1:5000/anagram').then( (result) => {
    const data = JSON.parse(result);
    return data;
}).catch( (error) => {
    return ["Error: ", error];
})*/


document.addEventListener("DOMContentLoaded", function () {
    const playButton = document.getElementById("play");
    playButton.addEventListener("click", get('http://127.0.0.1:5000/anagram').then( (result) => {
        console.log("executing");
        const [anagram, solution] = JSON.parse(result);
        console.log(anagram, solution);
        const target = document.getElementById("word-place");
        target.innerText = anagram;
        const guessForm = document.getElementById("guess-form");
        guessForm.addEventListener("submit", (e) => {
            console.log("executing 2");
            const anagramGuess = document.getElementById("guess").value;
            console.log(anagramGuess);
            const result = document.getElementById("result");
            if (anagramGuess === solution) {
                result.innerText = "CORRECT!";
            } else {
                result.innerText = "Try Again...";
            } 
            e.preventDefault();
            /*e.stopPropagation;*/
            guessForm.reset();
        });
        })
        .catch( (error) => {
            target.innerText = error;
        }));
});
