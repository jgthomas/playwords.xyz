



function displayAnagram (data) {
    const [anagram, solution] = data;
    const target = document.getElementById("word-place");
    target.innerText = anagram;
}


fetch(URL)
.then( response => {
    console.log(response);
    return response.json();
})
.then( data => {
    displayAnagram(data);
})
    

document.addEventListener("DOMContentLoaded", () => {
    document.getElementById("play").addEventListener("click", () => {
        const URL = "http://127.0.0.1:5000/anagram";
        fetch(URL).then( response => {
            console.log(response);
            return response.json();
        }).then( data => {
            displayAnagram(data);
        })
    });
});
