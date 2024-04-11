class Common {
    static #CELL_NUM = 4; //一辺のパネルの数
    static #FIELD_SIZE = 630;
    static #GAP = 10;
    static #CELL_SIZE = 150;
    //630=10*(4-1)+150*4

    static get CELL_NUM() {
        return Common.#CELL_NUM;
    }

    static setCellNum(num) {
        Common.#CELL_NUM = Number(num);
        Common.#calcCellSize();
    }

    static #calcCellSize() {
        Common.#CELL_SIZE =
            (Common.#FIELD_SIZE - Common.#GAP * (Common.#CELL_NUM - 1)) /
            Common.CELL_NUM;
    }
    static get CELL_SIZE() {
        return this.#CELL_SIZE;
    }
}
