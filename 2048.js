class GameField {
    #field;
    #jqRoot;

    constructor(jqRoot) {
        this.#jqRoot = jqRoot;

        this.#field = new Array(Common.CELL_NUM)
            .fill(null)
            .map((_) => new Array(Common.CELL_NUM).fill(null));

        this.putPanel();
        this.putPanel();
    }

    update(dy, dx) {
        //移動の結果をこれに入れていく
        let outcome = new Array(Common.CELL_NUM)
            .fill(null)
            .map((_) => new Array(Common.CELL_NUM).fill(null));

        //衝突して消滅するパネルと最後の移動距離を入れていく
        let del = [];
        //衝突されてnumが増えるパネルを入れていく
        let grow = [];

        this.field.forEach((arr, y) => {
            arr.forEach((panel, x) => {
                if (panel !== null) {
                    eachUpdate(dy, dx, y, x, panel, this.field);
                }
            });
        });

        //どのパネルも移動しなかった場合はセルを追加しない。
        if (R.equals(this.field, outcome))
            return { score: 0, inAnimation: false };

        del.forEach((elm) => {
            elm.panel.beforeUnion(dy, dx, elm.moveLength);
        });

        grow.forEach((elm) => elm.union());

        this.#field = outcome;
        outcome.forEach((arr, y) => {
            arr.forEach((elm, x) => {
                if (elm !== null) {
                    elm.slide(y, x);
                }
            });
        });

        this.putPanel();

        const score = R.sum(grow.map((elm) => Math.pow(2, elm.num + 1)));
        return { score: score, inAnimation: true };

        function eachUpdate(dy, dx, y, x, panel, field) {
            //移動方向に向かってフィールド境界までの距離
            const dist =
                dy === 1
                    ? Common.CELL_NUM - y - 1
                    : dy === -1
                    ? y
                    : dx === 1
                    ? Common.CELL_NUM - x - 1
                    : dx === -1
                    ? x
                    : null;

            //移動方向にあるパネルたち(空=nullを含む)
            const path = (() => {
                let panels = [];

                for (let i = 1; i <= dist; i++) {
                    panels.push(field[y + i * dy][x + i * dx]);
                }
                return panels;
            })();

            //pathからnullを抜いたもの
            const nullRemovedPath = path.filter((elm) => elm !== null);

            const nRPtoNum = nullRemovedPath.map((e) => e.num);

            //移動先で合体して消滅する条件
            const disapCondAndCount = (arr, n) => {
                let count = 0;
                const disapCond = (arr, n) => {
                    if (arr.length === 0) return false;

                    if (arr.length === 1) {
                        if (arr[0] === n) {
                            count++;
                            return true;
                        } else {
                            return false;
                        }
                    }
                    if (arr.at(-1) === arr.at(-2)) {
                        count++;
                        return disapCond(arr.slice(0, -2), n);
                    } else {
                        return disapCond(arr.slice(0, -1), n);
                    }
                };
                return [disapCond(arr, n), count];
            };

            const dCAC = disapCondAndCount(nRPtoNum, panel.num);

            //当パネルの移動距離
            const r = dist - nRPtoNum.length + dCAC[1];

            if (dCAC[0]) {
                //当パネルが合体する場合
                del.push({ panel: panel, moveLength: r });
                grow.push(nullRemovedPath[0]);
            } else {
                //当パネルは合体しない場合。
                outcome[y + r * dy][x + r * dx] = field[y][x];
            }
        }
    }

    reset() {
        this.field.flat().forEach((elm) => {
            if (elm !== null) {
                elm.removeElement();
            }
        });
    }

    isGameOver() {
        if (this.field.flat().some((elm) => elm === null)) return false;

        return noMove(this.field);
    }

    isGameClear() {
        return this.field
            .flat()
            .map((elm) => (elm === null ? null : elm.num))
            .includes(10);
    }

    get field() {
        return this.#field;
    }

    //空きマスにパネルをランダム追加する。
    putPanel() {
        R.pipe(emptyCells, randomSelect, this.setPanelTo)(this.#field);
    }

    setPanelTo = (yx) => {
        const panel = new Panel(...yx, randomNum(), this.#jqRoot);
        this.setField(panel, ...yx);
    };

    setField(panel, y, x) {
        this.#field[y][x] = panel;
    }
}

const randomNum = () => {
    const r = Math.random();
    return r < 0.9 ? 0 : 1;
};

const emptyCells = (matrix) => {
    let emptyCells = [];
    matrix.forEach((arr, y) => {
        arr.forEach((cell, x) => {
            if (cell === null) {
                emptyCells.push([y, x]);
            }
        });
    });
    return emptyCells;
};

const randomSelect = (arr) => {
    const index = Math.floor(Math.random() * arr.length);
    return arr[index];
};

//隣接ペアがすべて異なるかどうか。
const noMove = (matrix) => {
    function f(mat) {
        for (let arr of mat) {
            const row = arr.map((elm) => elm.num);
            if (
                R.range(0, matrix.length - 1).some((n) => row[n] === row[n + 1])
            )
                return false;
        }
        return true;
    }
    return f(matrix) && f(R.transpose(matrix));
};
