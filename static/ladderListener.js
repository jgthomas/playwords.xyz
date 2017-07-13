document.addEventListener("DOMContentLoaded", () => {
    document.getElementById("play").addEventListener("click", () => {
        resetGame();
        clearFinalFeedback();
        fetchWrap(ladderURL, ladderData, ladderGame);
    });
});


document.addEventListener("DOMContentLoaded", () => {
    document.getElementById("stop").addEventListener("click", () => {
        giveUp();
    });
});
