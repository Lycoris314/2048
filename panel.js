class Panel {
    #element;
    #vec;
    #num;

    static MOVE_TIME = 300;
    static EXPAND_TIME = 200;

    static COLORS = [
        "silver", //num=0
        "orange",
        "skyblue",
        "pink",
        "aqua",
        "coral",
        "gold",
        "greenyellow",
        "lime",
        "salmon",
        "crimson", //num=10
        "royalblue",
        "purple",
        "indigo",
        "snow",
    ];

    constructor(vec, num, jqRoot) {
        this.#vec = vec;
        this.#num = num;

        this.#element = $("<div>")
            .addClass("panel show")
            .addClass("pos" + vec.y + vec.x)
            .text(Math.pow(2, num + 1))
            .css("background-color", Panel.COLORS[num]);

        setTimeout(() => {
            this.#element.removeClass("show");
        }, Panel.MOVE_TIME);

        jqRoot.append(this.#element);
    }

    union() {
        this.#num++;

        setTimeout(() => {
            this.#element.text(Math.pow(2, this.#num + 1));
            this.#element.css(
                "background-color",
                Panel.COLORS[this.#num > 14 ? 14 : this.#num]
            );
        }, Panel.MOVE_TIME);

        this.#element.addClass("unionAnimation");

        setTimeout(() => {
            this.#element.removeClass("unionAnimation");
        }, Panel.MOVE_TIME + Panel.EXPAND_TIME);
    }

    //合体して消滅する前の最後の移動アニメーション
    beforeUnion(dy, dx, length) {
        this.slide(yx(this.#vec.y + length * dy, this.#vec.x + length * dx));

        setTimeout((_) => {
            this.disappear();
        }, Panel.MOVE_TIME);
    }

    slide(vec) {
        this.#element
            .removeClass("pos" + this.#vec.y + this.#vec.x)
            .addClass("pos" + vec.y + vec.x);
        this.#vec = vec;
    }

    disappear() {
        this.#element.remove();
    }

    get vec() {
        return this.#vec;
    }

    get num() {
        return this.#num;
    }

    get element() {
        return this.#element;
    }
}
