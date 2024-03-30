$(() => {

    //変化するパラメータをまとめたもの
    const pa = {
        inAnimation: false,
        score: 0,
        isGameOver: false
    }

    const gameField = new GameField($("main"));


    $("html").on("keydown", (e) => {

        if (pa.isGameOver) return;

        if (e.key == "ArrowUp" || e.key == "w") {

            const score = gameField.update(-1, 0);
            pa.score += score;
            $(".score.now >.num").text(pa.score);
        }

        else if (e.key == "ArrowDown" || e.key == "s") {

            const score = gameField.update(1, 0);
            pa.score += score;
            $(".score.now >.num").text(pa.score);
        }

        else if (e.key == "ArrowLeft" || e.key == "a") {

            const score = gameField.update(0, -1);
            pa.score += score;
            $(".score.now >.num").text(pa.score);
        }

        else if (e.key == "ArrowRight" || e.key == "d") {

            const score = gameField.update(0, 1);
            pa.score += score;
            $(".score.now >.num").text(pa.score);
        }

        if (gameField.isGameOver()) {
            pa.isGameOver = true;
            console.log("ゲームオーバー")
        }
    })
})


// function randomNum() {
//     const r = Math.random()
//     return r < 0.9 ? 0 : 1
// }

// function randomCood() {
//     const r = Math.floor(Math.random() * 4);
//     const s = Math.floor(Math.random() * 4);

//     return [r, s];
// }

// const emptyCells = (matrix) => {
//     let emptyCells = [];
//     matrix.forEach((arr, y) => {
//         arr.forEach((cell, x) => {
//             if (cell === null) {
//                 emptyCells.push([y, x])
//             }
//         })
//     })
//     return emptyCells;
// }

// const randomSelect = (arr) => {
//     const index = Math.floor(Math.random() * arr.length);
//     return arr[index]
// }

// const setPanelTo = (gameField) => (yx) => {
//     const panel = new Panel(...yx, randomNum(), $("main"))
//     gameField.setField(panel, ...yx)
// }

// const countEmptyCell = (dir) => (matrix) => (y, x) => {

//     const len = matrix.length;
//     let re = 0;
//     for (let i = 0; i < len; i++) {
//         let yi = y + dir[0] * i;
//         let xi = x + dir[1] * i;
//         if (0 <= yi && yi < len && 0 <= xi && xi < len && matrix[yi][xi] == null) {
//             re++;
//         }
//     }
//     return re;
// }

// const countEmptyCellUp = countEmptyCell([-1, 0]);