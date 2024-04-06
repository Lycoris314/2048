class Common {
    static CELL_NUM = SIZE;
    static FIELD_SIZE = 630;
    static GAP = 10;
    static CELL_SIZE =
        (Common.FIELD_SIZE - (Common.CELL_NUM - 1) * Common.GAP) /
        Common.CELL_NUM;
}
