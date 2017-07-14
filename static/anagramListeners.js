function simpleAnagramGame(data) {
    setUpGame(data);
    const guess = document.getElementById("guess");
    const simpleGameFlow = gameFlowFactory(simpleAnagramURL,
                                           simpleAnagramData,
                                           simpleAnagramCleanup,
                                           simpleAnagramGame);
    guess.addEventListener("input", simpleGameFlow);
}


document.addEventListener("DOMContentLoaded", () => {
    document.getElementById("play").addEventListener("click", () => {
        resetGame();
        clearFinalFeedback();
        fetchWrap(simpleAnagramURL, simpleAnagramData, simpleAnagramGame);
    });
});


document.addEventListener("DOMContentLoaded", () => {
    document.getElementById("stop").addEventListener("click", () => {
        giveUp();
    });
});
