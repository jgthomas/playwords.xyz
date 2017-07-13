

const simpleAnagramURL = "http://127.0.0.1:5000/anagram";
const ladderURL = "http://127.0.0.1:5000/ladder";


function simpleAnagramData () {
    const wordLength = document.getElementById("word-length").value;
    return {method: "POST", body: JSON.stringify({length: wordLength})};
}

/*function ladderData () {
    return {method: "POST", body: JSON.stringify({length: ladder.length})};
}*/

function fetchWrap(fetchURL, fetchData, gameFunction) {
    fetch(fetchURL, fetchData())
        .then( (response) => {
            return response.json(); 
        })
        .then( (data) => { 
            gameFunction(data); 
        });
}
