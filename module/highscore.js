export function highScore(num) {
    return Number(localStorage.getItem("highScore" + num));
}

export function updateHighscore(num, score) {
    if (score > highScore(num)) {
        localStorage.setItem("highScore" + num, score);
    }
}
//ハイスコア表の掲載
export function updateHighscoreTable() {
    R.range(3, 7).forEach((i) => {
        $(".score" + i).text(highScore(i) + "点");
    });
}
