class GameField {
    #field;
    #jqRoot;

    constructor(jqRoot) {
        this.#jqRoot = jqRoot;

        this.#field = new Array(4)
            .fill(null)
            .map((_) => new Array(4).fill(null));

        this.putPanel();
        this.putPanel();
    }

    update(dy, dx) {
        //移動の結果をこれに入れていく
        let outcome = new Array(4)
            .fill(null)
            .map((_) => new Array(4).fill(null));

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
                    ? 3 - y
                    : dy === -1
                    ? y
                    : dx === 1
                    ? 3 - x
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
            const disapCond = ((arr, n) => {
                if (arr.length === 0) return false;
                if (arr[0] !== n) return false;
                if (arr.length === 2 && arr[0] === arr[1]) return false;
                if (arr.length === 3 && arr[0] === arr[1] && arr[1] !== arr[2])
                    return false;
                return true;
            })(nRPtoNum, panel.num);

            //pathの途中で他のパネルが合体する場合に1
            const midDisp2 = (arr) => {
                if (arr.length === 3 && arr[1] === arr[2]) return 1;
                return 0;
            };

            //rは移動距離
            if (disapCond) {
                const r = dist + 1 - nRPtoNum.length + midDisp2(nRPtoNum);
                del.push({ panel: panel, moveLength: r });
                grow.push(nullRemovedPath[0]);
                return;
            }

            //以下当パネルは合体しない場合。

            //pathの途中で他のパネルが合体する場合に1、それ以外は0。
            const midDisp = (arr) => {
                if (arr.length >= 2 && arr[0] === arr[1]) return 1;
                if (arr.length === 3 && arr[1] === arr[2]) return 1;
                return 0;
            };

            const r = dist - nRPtoNum.length + midDisp(nRPtoNum);
            outcome[y + r * dy][x + r * dx] = field[y][x];
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

            if (row[0] === row[1] || row[1] === row[2] || row[2] === row[3])
                return false;
        }
        return true;
    }
    return f(matrix) && f(R.transpose(matrix));
};
