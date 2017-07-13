

const simpleAnagramURL = "http://127.0.0.1:5000/anagram";


function simpleAnagramData () {
    const wordLength = document.getElementById("word-length").value;
    return {method: "POST", body: JSON.stringify({length: wordLength})};
}


function fetchWrap(fetchURL, fetchData, gameFunction) {
    fetch(fetchURL, fetchData())
        .then( (response) => {
            return response.json(); 
        })
        .then( (data) => { 
            gameFunction(data); 
        });
}
