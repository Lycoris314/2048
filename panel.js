class Panel {
    #element;
    #x;
    #y;
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
    ];

    static POS = R.join(
        " ",
        R.map(
            R.o(R.concat("pos"), R.join("")),
            R.xprod(R.range(0, Common.CELL_NUM), R.range(0, Common.CELL_NUM))
        )
    );

    constructor(x, y, num, jqRoot) {
        this.#x = x;
        this.#y = y;
        this.#num = num;

        this.#element = $("<div>")
            .addClass("panel show")
            .addClass("pos" + x + y)
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
                Panel.COLORS[this.#num > 10 ? 10 : this.#num]
            );
        }, Panel.MOVE_TIME);

        this.#element.addClass("unionAnimation");

        setTimeout(() => {
            this.#element.removeClass("unionAnimation");
        }, Panel.MOVE_TIME + Panel.EXPAND_TIME);
    }

    //合体して消滅する前の最後の移動アニメーション
    beforeUnion(dy, dx, length) {
        //これだと何故かうまくいかない
        // let y = this.y + length * dy;
        // let x = this.x + length * dx;
        // this.#element.removeClass("pos00 pos01 pos02 pos03 pos10 pos11 pos12 pos13 pos20 pos21 pos22 pos23 pos30 pos31 pos32 pos33");
        // this.#element.addClass("pos" + y + x);

        let top = Number(this.#element.css("top").slice(0, -2));
        let left = Number(this.#element.css("left").slice(0, -2));

        const d = Common.CELL_SIZE + Common.GAP;
        top += d * length * dy;
        left += d * length * dx;

        this.#element.css("top", top + "px");
        this.#element.css("left", left + "px");

        setTimeout((_) => {
            this.#element.remove();
            // this.removeElement();
        }, Panel.MOVE_TIME);
    }

    slide(y, x) {
        this.#element.removeClass(Panel.POS);
        this.#x = x;
        this.#y = y;
        this.#element.addClass("pos" + y + x);
    }

    // removeElement() {
    //     this.#element.remove();
    // }

    get x() {
        return this.#x;
    }

    get y() {
        return this.#y;
    }

    get num() {
        return this.#num;
    }

    get element() {
        return this.#element;
    }
}
