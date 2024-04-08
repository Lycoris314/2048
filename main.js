$(() => {
    //背景マス描画
    for (let i = 0; i < Common.CELL_NUM * Common.CELL_NUM; i++) {
        $("main").prepend($("<div class='cell'>"));
    }

    const MOVE_TIME = 300; //パネルの移動時間(ms)

    //パラメーター
    const p = {
        stopKeyEvent: false, //ゲームオーバー画面など表示中
        ruleShowing: false, //ルール画面表示中
        isCleared: false,
        inAnimation: false,
        score: 0,
        highScore: Number(localStorage.getItem("highScore" + Common.CELL_NUM)),
    };

    let gameField = new GameField($("main"));

    $(".score.high>.num").text(p.highScore === null ? 0 : p.highScore);

    //十字キー
    $("html").on("keydown", (e) => {
        if (p.stopKeyEvent || p.ruleShowing || p.inAnimation) return;

        function dir(key) {
            switch (key) {
                case "ArrowUp":
                case "w":
                    return yx(-1, 0);
                case "ArrowDown":
                case "s":
                    return yx(1, 0);
                case "ArrowLeft":
                case "a":
                    return yx(0, -1);
                case "ArrowRight":
                case "d":
                    return yx(0, 1);
                default:
                    return null;
            }
        }
        const dir_ = dir(e.key);
        if (dir_ === null) return;

        const r = gameField.update(dir_);

        p.score += r.score;
        $(".score.now >.num").text(p.score);

        //アニメーションが生じるならその間イベントの受付を停止する。
        if (r.inAnimation) {
            p.inAnimation = true;
            setTimeout(() => {
                p.inAnimation = false;
            }, MOVE_TIME);
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
                localStorage.setItem("highScore" + Common.CELL_NUM, p.score);
            }
        }
        //ゲームオーバー
        else if (gameField.isGameOver()) {
            doWhenGameover();
        }
    });

    function doWhenGameover() {
        p.stopKeyEvent = true;

        $("div.gameOver").addClass("show");
        $("span.score").text(p.score);

        if (p.highScore === null || p.score > p.highScore) {
            p.highScore = p.score;
            localStorage.setItem("highScore" + Common.CELL_NUM, p.score);
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
    });

    //続けるボタン
    $("button.continue").on("click", () => {
        $("div.gameClear").removeClass("show");

        p.stopKeyEvent = false;

        //ゲームクリア→続ける→即ゲームオーバー
        if (gameField.isGameOver()) {
            doWhenGameover();
        }
    });

    //ルールボタン
    $("button.rule, div.ruleBack").on("click", (_) => {
        $("div.ruleBack").toggleClass("show");
        p.ruleShowing = !p.ruleShowing;
    });

    $("div.rulePage").on("click", (e) => {
        e.stopPropagation();
    });

    //戻るボタン
    $("button.back").on("click", () => {
        location.assign("start.html");
    });

    //デバッグ用
    // $("html").on("keydown", (e) => {
    //     if (e.key == "p") {
    //         console.log(p);
    //         console.log(gameField.field);
    //     }
    //})
});
