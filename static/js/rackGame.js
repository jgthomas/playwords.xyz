

rackURL = "127.0.0.1:5000/rack";
const rackLength = 7;


function rackData() {
    return {method: "POST",
              body: JSON.stringify({length: rackLength.toString()})
    };
}


function rackCleanup() {
}


function rackGame(data) {
}


function rackGiveUp() {
}


/*document.addEventListener("DOMContentLoaded", () => {
    document.getElementById("again").addEventListener("click", () => {
    });
});


document.addEventListener("DOMContentLoaded", () => {
    document.getElementById("stop").addEventListener("click", () => {
    });
});


document.addEventListener("DOMContentLoaded", () => {
});*/