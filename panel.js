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
        "crimson",
        "gold",
        "greenyellow",
        "lime",
        "salmon"
    ]

    constructor(x, y, num, jqRoot) {
        this.#x = x;
        this.#y = y;
        this.#num = num;
        this.#element = $("<div>")
            .addClass("panel")
            .addClass("pos" + x + y)
            .text(Math.pow(2, num + 1))
            .css("background-color", Panel.COLORS[num])

        jqRoot.append(this.#element)
    }

    union() {
        this.#num ++;
        this.#element.text(Math.pow(2, this.#num + 1))
        this.#element.css("background-color", Panel.COLORS[this.#num]);
    }

    slide(y, x) {
        this.#element.removeClass("pos00 pos01 pos02 pos03 pos10 pos11 pos12 pos13 pos20 pos21 pos22 pos23 pos30 pos31 pos32 pos33");
        this.#x = x;
        this.#y = y;
        this.#element.addClass("pos" + y + x);

    }

    removeElement() {
        this.#element.remove();
        console.log("remove");
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
}
