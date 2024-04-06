$(() => {
    //ハイスコア掲載
    R.range(3, 7).forEach((i) => {
        const score = localStorage.getItem("highScore" + i);
        const str = (score === null ? 0 : score) + "点";
        $(".score" + i).text(str);
    });

    //ルール表示
    $("button.rule, div.ruleBack").on("click", (_) => {
        $("div.ruleBack").toggleClass("show");
        p.ruleShowing = !p.ruleShowing;
    });

    $("div.rulePage").on("click", (e) => {
        e.stopPropagation();
    });
});
