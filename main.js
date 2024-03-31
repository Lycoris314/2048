$(() => {

    //パラメータ
    const p = {
        stopKeyEvent: false,
        ruleShowing: false,
        isCleared: false,
        inAnimation: false,
        score: 0,
        highScore: Number(localStorage.getItem("highScore")),
    }

    const MOVE_TIME = 300;

    let gameField = new GameField($("main"));

    $(".score.high>.num").text(p.highScore === null ? 0 : p.highScore);


    //十字キー
    $("html").on("keydown", (e) => {

        if (p.stopKeyEvent || p.ruleShowing || p.inAnimation) return;

        let r;
        switch (e.key) {
            case "ArrowUp":
            case "w":
                r = gameField.update(-1, 0);
                break;
            case "ArrowDown":
            case "s":
                r = gameField.update(1, 0);
                break;
            case "ArrowLeft":
            case "a":
                r = gameField.update(0, -1);
                break;
            case "ArrowRight":
            case "d":
                r = gameField.update(0, 1);
                break;
            default:
                return;
        }

        p.score += r.score;
        $(".score.now >.num").text(p.score);

        //アニメーションが生じるならその間イベントの受付を停止する。
        if (r.inAnimation) {
            p.inAnimation = true;
            setTimeout(() => {
                p.inAnimation = false;
            }, MOVE_TIME)
        }

        //ゲームクリア
        if (gameField.isGameClear() && !p.isCleared) {

            p.stopKeyEvent = true;
            p.isCleared = true;

            $("div.gameClear").addClass("show");
            $("span.score").text(p.score);

            //記録塗り替え
            if (p.highScore === null || p.score > p.highScore) {
                p.highScore = p.score;
                localStorage.setItem("highScore", p.score);
            }
        }
        //ゲームオーバー
        else if (gameField.isGameOver()) {
            doWhenGameover();
        }
    })

    function doWhenGameover() {

        p.stopKeyEvent = true;

        $("div.gameOver").addClass("show");
        $("span.score").text(p.score);

        if (p.highScore === null || p.score > p.highScore) {
            p.highScore = p.score;
            localStorage.setItem("highScore", p.score);
        }
    }

    //リスタートボタン
    $("button.restart").on("click", () => {

        p.score = 0;
        $(".score.now >.num").text(0);

        gameField.reset();
        gameField = new GameField($("main"));

        $("div.gameOver").removeClass("show");
        $("div.gameClear").removeClass("show");


        $(".score.high>.num").text(p.highScore === null ? 0 : p.highScore);

        p.isCleared = false;
        p.stopKeyEvent = false;

    })

    //続けるボタン
    $("button.continue").on("click", () => {

        $("div.gameClear").removeClass("show");

        p.stopKeyEvent = false;

        //ゲームクリア→続ける→即ゲームオーバー
        if (gameField.isGameOver()) {
            doWhenGameover();
        }
    })

    //ルールボタン
    $("button.rule, div.ruleBack").on("click", _ => {

        $("div.ruleBack").toggleClass("show");
        p.ruleShowing = !p.ruleShowing
    })

    $("div.rulePage").on("click", e => {
        e.stopPropagation();
    })


    //デバッグ用
    $("html").on("keydown", (e) => {
        if (e.key == "p") {
            console.log(p);
            console.log(gameField.field);
        }
    })
})


