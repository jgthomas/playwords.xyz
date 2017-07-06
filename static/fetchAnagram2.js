

const anagram = "http://127.0.0.1:5000/anagram";


function displayAnagram (data) {
    const [anagram, solution] = data;
    const target = document.getElementById("word-place");
    target.innerText = anagram;
}


function fetchWrap (URL, func) {
    fetch(URL)
        .then( response => {
            return response.json();
        })
        .then( data => {
            func(data);
        })
}
    

document.addEventListener("DOMContentLoaded", () => {
    document.getElementById("play").addEventListener("click", () => {
        fetchWrap(anagram, displayAnagram);
    });
});
