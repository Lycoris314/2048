<?php
    if(isset($_GET["size"])&&in_array($_GET["size"],[3,4,5,6])){

        $size = $_GET["size"];
    }else{
        exit();
    }
?>
<!DOCTYPE html>
<html lang="ja">
    <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>2048</title>
        <link rel="stylesheet" href="index.css" />
        <!-- $sizeに対応してcssを決める。 -->
        <link rel="stylesheet" href="cell_num/cell_num<?=$size ?>.css">
        <script src="jquery.js"></script>
        <script src="ramda.min.js"></script>
        <script> const SIZE= <?=$size ?> </script>
        <!-- common.jsに$sizeを格納 -->
        <script src="common.js"></script>
        <script src="panel.js"></script>
        <script src="2048.js"></script>
        <script src="main.js"></script>
    </head>

    <body>
        <div class="container">
            <header>
                <h1>2048</h1>
                <div class="scores">
                    <div class="score high">
                        <p>ハイスコア</p>
                        <p class="num">0</p>
                    </div>
                    <div class="score now">
                        <p>スコア</p>
                        <p class="num">0</p>
                    </div>
                </div>
            </header>

            <main>
                <div class="gameOver">
                    <p>ゲームオーバー!</p>
                    <p>スコア：<span class="score"></span></p>
                    <button class="restart">リスタート</button>
                </div>
                <div class="gameClear">
                    <p>ゲームクリアー！</p>
                    <p>スコア：<span class="score"></span></p>
                    <div class="btns">
                        <button class="continue">つづける</button>
                        <button class="restart">リスタート</button>
                    </div>
                </div>
            </main>
            <button class="restart">リスタート</button>

            <button class="back">スタート<br>画面に戻る</button>
            <button class="rule">ルール</button>
        </div>
        <div class="ruleBack">
            <div class="rulePage">
                <h2>ルール</h2>
                <p>同じ数字のパネルを合体させて数字を大きくしよう</p>
                <p>目指せ <span class="bold">2048!</span> (サイズ4×4の場合)</p>
                <hr />
                <h2>操作方法</h2>
                <p>※キーボード操作のみ受け付けます。</p>
                <p class="under">上下左右キー(またはWSADキー)</p>
                <p>
                    同じパネルが重なると合体して数値が２倍となり、合体した値がスコアに加算されます。クリア後もパネルを動かせなくなるまで続けることができます。
                </p>
                <hr />
                <h2>クリア条件</h2>
                <p>サイズ3×3：256のパネルをつくる</p>
                <p>サイズ4×4：2048のパネルをつくる</p>
                <p>サイズ5×5：8192のパネルをつくる</p>
                <p>サイズ6×6：32768のパネルをつくる</p>
                <hr />
                <h2>パネルの出現率</h2>
                <p>サイズ3×3：2 (90%) 4 (10%)</p>
                <p>サイズ4×4：2 (90%) 4 (10%)</p>
                <p>サイズ5×5：2 (40%) 4 (30%) 8 (20%) 16 (10%)</p>
                <p>
                    サイズ6×6：2 (30%) 4 (20%) 8 (20%) 16 (10%) 32 (10%) 64
                    (10%)
                </p>
            </div>
        </div>
    </body>
</html>
