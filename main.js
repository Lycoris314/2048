$(() => {

    //パラメータ
    const pa = {
        stopKeyEvent: false,
        ruleShowing: false,
        isCleared: false,
        inAnimation: false,
        score: 0,
        highScore: localStorage.getItem("highScore"),
    }

    const ANIME_TIME = 400;

    let gameField = new GameField($("main"));

    $(".score.high>.num").text(pa.highScore === null ? 0 : pa.highScore);


    $("html").on("keydown", (e) => {

        if (pa.stopKeyEvent || pa.ruleShowing || pa.inAnimation) return;



        if (e.key == "ArrowUp" || e.key == "w") {

            const re = gameField.update(-1, 0);
            pa.score += re.score;
            $(".score.now >.num").text(pa.score);

            if (re.inAnimation) {
                pa.inAnimation = true;
                setTimeout(() => {
                    pa.inAnimation = false;
                }, ANIME_TIME)
            }
        }

        else if (e.key == "ArrowDown" || e.key == "s") {

            const re = gameField.update(1, 0);
            pa.score += re.score;
            $(".score.now >.num").text(pa.score);

            if (re.inAnimation) {
                pa.inAnimation = true;
                setTimeout(() => {
                    pa.inAnimation = false;
                }, ANIME_TIME)
            }
        }

        else if (e.key == "ArrowLeft" || e.key == "a") {

            const re = gameField.update(0, -1);
            pa.score += re.score;
            $(".score.now >.num").text(pa.score);

            if (re.inAnimation) {
                pa.inAnimation = true;
                setTimeout(() => {
                    pa.inAnimation = false;
                }, ANIME_TIME)
            }
        }

        else if (e.key == "ArrowRight" || e.key == "d") {

            const re = gameField.update(0, 1);
            pa.score += re.score;
            $(".score.now >.num").text(pa.score);

            if (re.inAnimation) {
                pa.inAnimation = true;
                setTimeout(() => {
                    pa.inAnimation = false;
                }, ANIME_TIME)
            }
        }


        if (gameField.isGameClear() && !pa.isCleared) {

            pa.stopKeyEvent = true;

            $("div.gameClear").addClass("show");
            $("span.score").text(pa.score);

            pa.isCleared = true;

            //記録塗り替え
            if (pa.highScore === null || pa.score > pa.highScore) {
                pa.highScore = pa.score;
                localStorage.setItem("highScore", pa.score);
            }
        }

        else if (gameField.isGameOver()) {
            doWhenGameover();
        }
    })

    function doWhenGameover() {

        pa.stopKeyEvent = true;

        $("div.gameOver").addClass("show");
        $("span.score").text(pa.score);

        if (pa.highScore === null || pa.score > pa.highScore) {
            pa.highScore = pa.score;
            localStorage.setItem("highScore", pa.score);
        }
    }

    //リスタートボタン
    $("button.restart").on("click", () => {
        pa.score = 0;
        $(".score.now >.num").text(0);

        gameField.reset();
        gameField = new GameField($("main"));

        $("div.gameOver").removeClass("show");
        $("div.gameClear").removeClass("show");


        $(".score.high>.num").text(pa.highScore === null ? 0 : pa.highScore);

        pa.isCleared = false;
        pa.stopKeyEvent = false;

    })

    //続けるボタン
    $("button.continue").on("click", () => {

        $("div.gameClear").removeClass("show");

        pa.stopKeyEvent = false;

        if (gameField.isGameOver()) {
            doWhenGameover();
        }
    })

    //ルールボタン
    $("button.rule, div.ruleBack").on("click", _ => {

        $("div.ruleBack").toggleClass("show");
    })

    $("div.rulePage").on("click", e => {
        e.stopPropagation();
    })


    //デバッグ用
    $("html").on("keydown", (e) => {
        if (e.key == "p") {
            console.log(pa);
            console.log(gameField.field);
        }
    })
})


