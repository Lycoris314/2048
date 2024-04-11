export const randomNum = (num) => {
    const r = Math.random();
    switch (num) {
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
