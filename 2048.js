class GameField {
    #field;
    #gameCleared;
    #jqRoot;

    constructor(jqRoot) {

        this.#jqRoot = jqRoot;

        this.#field = new Array(4).fill(null)
            .map(_ => new Array(4).fill(null))

        this.putPanel();
        this.putPanel();
    }



    update(dy, dx) {

        let outcome = new Array(4).fill(null)
            .map(_ => new Array(4).fill(null))

        let del = [];
        let grow = [];

        this.field.forEach((arr, y) => {
            arr.forEach((panel, x) => {
                if (panel !== null) {
                    eachUpdate(dy, dx, y, x, panel, this.field);
                }
            })
        })

        //結果変化しなかった場合はセルを追加しない。
        if (R.equals(this.field, outcome)) return 0;

        del.forEach(elm => elm.removeElement());
        grow.forEach(elm => elm.union());


        this.#field = outcome;
        outcome.forEach((arr, y) => {
            arr.forEach((elm, x) => {
                if (elm !== null) {
                    elm.slide(y, x);
                }
            })
        })

        this.putPanel();

        const score = R.sum(grow.map(elm => Math.pow(2, elm.num + 1)));
        return score;


        function eachUpdate(dy, dx, y, x, panel, field) {

            const dist =
                dy === 1 ? 3 - y :
                    dy === -1 ? y :
                        dx === 1 ? 3 - x :
                            dx === -1 ? x : null;

            const path = (() => {
                let panels = [];

                for (let i = 1; i <= dist; i++) {
                    panels.push(field[y + i * dy][x + i * dx])
                }
                return panels;
            })()

            const nullRemovedPath = path.filter(elm => elm !== null);

            const nRPtoNum = nullRemovedPath.map(e => e.num);

            //移動先で合体して消滅する条件
            const disapCond = ((arr, n) => {
                if (arr.length === 0) return false;
                if (arr[0] !== n) return false;
                if (arr.length === 2 && arr[0] === arr[1]) return false;
                if (arr.length === 3 && arr[0] === arr[1] && arr[1] !== arr[2]) return false;
                return true;
            })(nRPtoNum, panel.num)

            if (disapCond) {
                del.push(panel);
                grow.push(nullRemovedPath[0])
                return;
            }

            const midDisp = ((arr) => {
                if (arr.length >= 2 && arr[0] === arr[1]) return 1;
                if (arr.length === 3 && arr[1] === arr[2]) return 1;
                return 0;
            })(nRPtoNum);

            const r = dist - nRPtoNum.length + midDisp
            outcome[y + r * dy][x + r * dx] = field[y][x];
        }


    }


    reset() {
        this.field.flat().forEach(elm => {
            if (elm !== null) {
                elm.removeElement();
            }
        })
    }

    isGameOver() {

        if (this.field.flat().some(elm => elm === null)) return false;

        return noMove(this.field) && noMove(R.transpose(this.field));
    }

    isGameClear() {

        return this.field.flat().map(elm => elm === null ? null : elm.num).includes(4);//本来10
    }

    get field() {
        return this.#field;
    }

    setField(panel, y, x) {
        this.#field[y][x] = panel;
    }

    putPanel() {
        R.pipe(
            emptyCells,
            randomSelect,
            this.setPanelTo
        )(this.#field)
    }

    setPanelTo = (yx) => {
        const panel = new Panel(...yx, randomNum(), this.#jqRoot)
        this.setField(panel, ...yx)
    }
}


const randomNum = () => {
    const r = Math.random()
    return r < 0.9 ? 0 : 1
}

const emptyCells = (matrix) => {
    let emptyCells = [];
    matrix.forEach((arr, y) => {
        arr.forEach((cell, x) => {
            if (cell === null) {
                emptyCells.push([y, x])
            }
        })
    })
    return emptyCells;
}

const randomSelect = (arr) => {
    const index = Math.floor(Math.random() * arr.length);
    return arr[index]
}


const noMove = (matrix) => {

    for (let arr of matrix) {
        const row = arr.map(elm => elm.num);

        if (row[0] === row[1] || row[1] === row[2] || row[2] === row[3]) return false;
    }
    return true;
}

