import { Panel } from "./panel.js";
import { randomNum, emptyCells, randomSelect } from "./module/forPutPanel.js";

export class GameField {
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

    update(dir) {
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
                    eachUpdate(dir, yx(y, x), panel, this.field);
                }
            });
        });

        //どのパネルも移動しなかった場合はセルを追加しない。
        if (R.equals(this.field, outcome))
            return { score: 0, inAnimation: false };

        //衝突する側のアニメーション(衝突後消える)
        del.forEach((elm) => {
            elm.panel.beforeUnion(dir, elm.moveLength);
        });
        //衝突される側のアニメーション
        grow.forEach((elm) => elm.union());

        this.#field = outcome;
        outcome.forEach((arr, y) => {
            arr.forEach((elm, x) => {
                if (elm !== null) {
                    elm.slide(yx(y, x));
                }
            });
        });

        this.putPanel();

        //スコアを増やす
        const score = R.sum(grow.map((elm) => Math.pow(2, elm.num + 1)));
        return { score: score, inAnimation: true };

        function eachUpdate(dir, vec, panel, field) {
            //移動方向に向かってフィールド境界までの距離
            const dist =
                dir.y === 1
                    ? Common.CELL_NUM - vec.y - 1
                    : dir.y === -1
                    ? vec.y
                    : dir.x === 1
                    ? Common.CELL_NUM - vec.x - 1
                    : dir.x === -1
                    ? vec.x
                    : null;

            //移動方向にあるパネルたち(空=nullを含む)
            const path = R.range(1, dist + 1).map((i) => {
                const v = YX.add(vec, YX.scalar(i, dir));
                return field[v.y][v.x];
            });

            //pathからnullを抜いたもの
            const nullRemovedPath = path.filter((elm) => elm !== null);

            const nRPtoNum = nullRemovedPath.map((e) => e.num);

            //移動先で当パネルが合体して消滅するかどうかと、path上で合体するパネルの組の数(自身の合体も含む)を返す。
            const disapCondAndCount = (arr, n) => {
                let count = 0;
                const disapCond = (arr, n) => {
                    //基底部
                    if (arr.length === 0) return false;

                    if (arr.length === 1) {
                        if (arr[0] === n) {
                            count++;
                            return true;
                        } else {
                            return false;
                        }
                    }
                    //再帰部
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
                const v = YX.add(vec, YX.scalar(r, dir));
                outcome[v.y][v.x] = field[vec.y][vec.x];
            }
        }
    }

    reset() {
        this.field.flat().forEach((elm) => {
            if (elm !== null) {
                elm.disappear();
            }
        });
    }

    isGameOver() {
        return (
            this.field.flat().every((elm) => elm !== null) && noMove(this.field)
        );
    }

    isGameClear() {
        const table = { 3: 7, 4: 10, 5: 12, 6: 13 };
        const c = table[Common.CELL_NUM];

        return this.field
            .flat()
            .map((elm) => (elm === null ? null : elm.num))
            .includes(c);
    }

    get field() {
        return this.#field;
    }

    //空きマスにパネルをランダム追加する。
    putPanel() {
        R.pipe(emptyCells, randomSelect, this.#setPanelTo)(this.#field);
    }

    #setPanelTo = (vec) => {
        const panel = new Panel(vec, randomNum(Common.CELL_NUM), this.#jqRoot);
        this.#field[vec.y][vec.x] = panel;
    };
}

//隣接ペアがすべて異なるかどうか。
const noMove = (matrix) => {
    const f = (mat) =>
        mat.every((arr) => {
            const row = arr.map((elm) => elm.num);
            return R.range(0, arr.length - 1).every(
                (n) => row[n] !== row[n + 1]
            );
        });

    return f(matrix) && f(R.transpose(matrix));
};
