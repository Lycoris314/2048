class Common {
    static CELL_NUM = 4; //一辺のパネルの数
    static FIELD_SIZE = 630;
    static GAP = 10;
    static CELL_SIZE = 150;
    //630=10*(4-1)+150*4

    static setCellSize() {
        Common.CELL_SIZE =
            (Common.FIELD_SIZE - Common.GAP * (Common.CELL_NUM - 1)) /
            Common.CELL_NUM;
    }
}
