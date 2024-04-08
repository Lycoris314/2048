class YX {
    constructor(y, x) {
        this.y = y;
        this.x = x;
    }

    toPos() {
        return "pos" + this.y + this.x;
    }

    static add(v, w) {
        return yx(v.y + w.y, v.x + w.x);
    }
    static scalar(a, v) {
        return yx(a * v.y, a * v.x);
    }
}
function yx(y, x) {
    return new YX(y, x);
}
