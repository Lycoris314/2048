$(() => {
    const MOVE_TIME = 300; //パネルの移動時間(ms)

    //パラメーター
    const p = {
        preGame: true, //スタート画面ならtrue
        stopKeyEvent: false, //ゲームオーバー画面など表示中
        ruleShowing: false, //ルール画面表示中
        isCleared: false,
        inAnimation: false,
        score: 0,
    };

    let gameField;

    function highScore(num) {
        return Number(localStorage.getItem("highScore" + num));
    }
    function updateHighscore(num) {
        if (p.score > highScore(num)) {
            localStorage.setItem("highScore" + num, p.score);
        }
    }
    //ハイスコア表の掲載
    function UpdateHighscoreTable() {
        R.range(3, 7).forEach((i) => {
            $(".score" + i).text(highScore(i) + "点");
        });
    }

    UpdateHighscoreTable();

    //十字キー
    $("html").on("keydown", (e) => {
        if (p.preGame || p.stopKeyEvent || p.ruleShowing || p.inAnimation)
            return;

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

            updateHighscore(Common.CELL_NUM);
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

        updateHighscore(Common.CELL_NUM);
    }

    //リスタートボタン
    $("button.restart").on("click", () => {
        p.score = 0;
        $(".score.now >.num").text(0);

        gameField.reset();
        gameField = new GameField($("main"));

        $("div.gameOver").removeClass("show");
        $("div.gameClear").removeClass("show");

        $(".score.high>.num").text(highScore(Common.CELL_NUM));

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
        gameField.reset();

        $(".start.container").removeClass("hidden");
        p.preGame = true;
        p.stopKeyEvent = false;
        p.isCleared = false;
        p.inAnimation = false;
        p.score = 0;
        $(".score.now >.num").text(0);

        UpdateHighscoreTable();

        $(".cell").remove();

        $("div.gameOver").removeClass("show");
        $("div.gameClear").removeClass("show");
    });

    //スタートボタン
    $("button.start").on("click", function () {
        //スタート画面を隠す
        $(".start.container").addClass("hidden");

        //ラジオボタンで選択したサイズを取得
        const cellNum = (() => {
            let r;
            $('input[type="radio"]').each(function () {
                if ($(this).prop("checked")) {
                    r = $(this).val();
                }
            });
            return r;
        })();

        //サイズに応じたCSSの適用
        $("link.cell_num")
            .attr("rel", "stylesheet")
            .attr("href", "cell_num/cell_num" + cellNum + ".css");

        //Commonクラスに値をセット
        Common.CELL_NUM = Number(cellNum);
        Common.setCellSize();

        //フィールドのマス目を描画
        for (let i = 0; i < Common.CELL_NUM ** 2; i++) {
            $("main").prepend($("<div class='cell'>"));
        }
        //ハイスコア表示
        $(".score.high>.num").text(highScore(Common.CELL_NUM));

        p.preGame = false;

        gameField = new GameField($("main"));
    });

    //デバッグ用
    // $("html").on("keydown", (e) => {
    //     if (e.key == "p") {
    //         console.log(p);
    //         console.log(gameField.field);
    //     }
    //})
});
