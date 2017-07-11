document.addEventListener("DOMContentLoaded", () => {
    document.getElementById("play").addEventListener("click", () => {
        resetGame();
        clearFinalFeedback();
        fetchWrap(simpleAnagramURL, simpleAnagramGame);
    });
});

document.addEventListener("DOMContentLoaded", () => {
    document.getElementById("stop").addEventListener("click", () => {
        giveUp();
    });
});
