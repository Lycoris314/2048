class Panel {
    #element;
    #x;
    #y;
    #num;

    static COLORS = [
        "silver",
        "orange",
        "skyblue",
        "pink",
        "aqua",
        "coral",
        "gold",
        "greenyellow",
        "lime",
        "salmon",
        "crimson"
    ]

    constructor(x, y, num, jqRoot) {

        this.#x = x;
        this.#y = y;
        this.#num = num;

        this.#element = $("<div>")
            .addClass("panel show")
            .addClass("pos" + x + y)
            .text(Math.pow(2, num + 1))
            .css("background-color", Panel.COLORS[num])

        setTimeout(() => {
            this.#element.removeClass("show")
        }, 400)

        jqRoot.append(this.#element)
    }

    union() {
        this.#num++;

        setTimeout(() => {
            this.#element.text(Math.pow(2, this.#num + 1))
            this.#element.css("background-color", Panel.COLORS[this.#num > 10 ? 10 : this.#num]);
        }, 400)

        this.#element.addClass("unionAnimation");

        setTimeout(() => {
            this.#element.removeClass("unionAnimation");

        }, 800)
    }

    //合体して消滅する前の最後の移動アニメーション
    beforeUnion(dy, dx, length) {

        let top = Number(this.#element.css("top").slice(0, -2));
        let left = Number(this.#element.css("left").slice(0, -2));

        if (dy === 1) { top += 160 * length }
        else if (dy === -1) { top -= 160 * length }
        else if (dx === 1) { left += 160 * length }
        else if (dx === -1) { left -= 160 * length }

        this.#element.css("top", top + "px");
        this.#element.css("left", left + "px");
    }

    slide(y, x) {
        this.#element.removeClass("pos00 pos01 pos02 pos03 pos10 pos11 pos12 pos13 pos20 pos21 pos22 pos23 pos30 pos31 pos32 pos33");
        this.#x = x;
        this.#y = y;
        this.#element.addClass("pos" + y + x);

    }

    removeElement() {
        this.#element.remove();
    }

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
        return this.#element
    }
}

