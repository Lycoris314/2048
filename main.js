$(() => {

    //パラメータ
    const pa = {
        stopKeyEvent: false,
        score: 0,
        isCleared: false,
    }

    let gameField = new GameField($("main"));

    let highScore = localStorage.getItem("highScore");

    $(".score.high>.num").text(highScore === null ? 0 : highScore);


    $("html").on("keydown", (e) => {

        if (pa.stopKeyEvent) return;

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

        if (gameField.isGameClear() && !pa.isCleared) {

            pa.stopKeyEvent = true;
            $("div.gameClear").addClass("show");
            $("span.score").text(pa.score);
            pa.isCleared = true;
            console.log("clear");

            if (highScore === null || pa.score > highScore) {
                highScore = pa.score;
                localStorage.setItem("highScore", pa.score);
            }
        }

        if (gameField.isGameOver()) {

            pa.stopKeyEvent = true;
            $("div.gameOver").addClass("show");
            $("span.score").text(pa.score);

            if (highScore === null || pa.score > highScore) {
                highScore = pa.score;
                localStorage.setItem("highScore", pa.score);
            }
        }
    })


    $("button.restart").on("click", () => {
        pa.score = 0;
        $(".score.now >.num").text(0);

        gameField.reset();
        gameField = new GameField($("main"));

        $("div.gameOver").removeClass("show");
        $("div.gameClear").removeClass("show");


        $(".score.high>.num").text(highScore === null ? 0 : highScore);

        pa.isCleared = false;
        pa.stopKeyEvent = false;

    })

    $("button.continue").on("click", () => {
        $("div.gameClear").removeClass("show");
        pa.stopKeyEvent = false;
    })

    $("button.rule").on("click", () => {
        $("div.ruleBack").toggleClass("show")
    })


    //デバッグ用
    $("html").on("keydown", (e) => {
        if (e.key == "p") {
            console.log(pa);
            console.log(gameField.field);
        }
    })
})


