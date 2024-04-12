export const randomNum = (size) => {
    const r = Math.random();

    //const num = (r, arr) => R.findIndex(R.gt(0), R.map(R.subtract(r), arr));
    //case 5: return num(r,[0.4,0.7,0.9,1])

    switch (size) {
        case 3:
        case 4:
            return r < 0.9 ? 0 : 1;
        case 5:
            return r < 0.4 ? 0 : r < 0.7 ? 1 : r < 0.9 ? 2 : 3;
        case 6:
            return r < 0.3
                ? 0
                : r < 0.5
                ? 1
                : r < 0.7
                ? 2
                : r < 0.8
                ? 3
                : r < 0.9
                ? 4
                : 5;
    }
};

export const emptyCells = (matrix) =>
    matrix
        .map((arr, y) =>
            arr.map((cell, x) => (cell === null ? yx(y, x) : null))
        )
        .flat(1)
        .filter((elm) => elm !== null);

export const randomSelect = (arr) => {
    const index = Math.floor(Math.random() * arr.length);
    return arr[index];
};
