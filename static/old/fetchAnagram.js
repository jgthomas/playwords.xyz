document.addEventListener("DOMContentLoaded", () => {
    document.getElementById("play").addEventListener("click", () => {
        fetch("http://127.0.0.1:5000/anagram")
            .then( (response) => {
                return response.json();
            })
            .then( (data) => {
                const [anagram, solution] = data;
                const target = document.getElementById("word-place");
                target.innerText = anagram;
            })
    });
});
