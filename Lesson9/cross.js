function CrossGame(user) {
    // this = {}

    const svgNS = 'http://www.w3.org/2000/svg';
    const X = CrossGame.X;
    const O = CrossGame.O;
    const EMPTY = 'EMPTY';

    const NOT_STARTED = 'NOT_STARTED';
    const STARTED = 'STARTED';
    const WIN = 'WIN';
    const STANDOFF = 'STANDOFF';

    this.user = user;
    this.steps = 0;
    this.status = NOT_STARTED;
    this.boardEl = document.querySelector('.cross__board');
    this.boardRows = document.querySelectorAll('.cross__board--row');
    this.board = [
        [EMPTY, EMPTY, EMPTY],
        [EMPTY, EMPTY, EMPTY],
        [EMPTY, EMPTY, EMPTY]
    ];
    this.stepHistory = [];
    this.winLine = null;

    this.init = function init() {
        // this = game
        for (let row=0; row < 3; row++) {
            for (let column=0; column<3; column++) {
                const cell = this.boardRows[row].children[column];

                cell.dataset.row = row;
                cell.dataset.column = column;

                // cell.onclick(e); // this = cell
                cell.onclick = this.step.bind(this, row, column);
            }
        }

        this.clearBoard(); //* this = game
    };

    this.renderX = function renderX() {
        const svg = document.createElementNS(svgNS, 'svg');

        svg.setAttribute('class', 'x cross__board-item-el');
        svg.setAttribute('viewBox', '0 0 80 80');

        svg.innerHTML = `
            <line class="x__line1" x1="20" y1="10" x2="60" y2="70"/>
            <line class="x__line2" x1="60" y1="10" x2="20" y2="70"/>
        `;

        return svg;
    };

    this.render0 = function render0() {
        const svg = document.createElementNS(svgNS, 'svg');
        const ellipse = document.createElementNS(svgNS, 'ellipse');

        svg.setAttribute('class', 'o cross__board-item-el');
        svg.setAttribute('viewBox', '0 0 80 80');

        svg.append(ellipse);

        ellipse.setAttribute('cx', '40');
        ellipse.setAttribute('cy', '40');
        ellipse.setAttribute('rx', '20');
        ellipse.setAttribute('ry', '30');

        return svg;
    };

    this.clearBoard = function clearBoard() {

        for (let row=0; row < 3; row++) {
            for (let column=0; column<3; column++) {
                const cell = this.boardRows[row].children[column];

                cell.innerText = '';
            }
        }
    };

    this.render = function render() {
        for (let row=0; row < 3; row++) {
            for (let column=0; column<3; column++) {
                const cell = this.boardRows[row].children[column];

                if (cell.children.length > 0) {
                    continue;
                }

                if (this.board[row][column] === X) {
                    cell.append( this.renderX() );
                } else if (this.board[row][column] === O) {
                    cell.append( this.render0() );
                }
            }
        }


        if (this.status === WIN && this.winLine) {
            this.addCrossLine(this.winLine);
        }
    };

    this.addCrossLine = function (winLine) {
        const { type, index } = winLine;
        const svg = document.createElementNS(svgNS, 'svg');

        svg.setAttribute('class', [
            'cross__finish-line',
            `cross__finish-line--${type}`,
            `cross__finish-line--${index}`
        ].join(' '));

        svg.innerHTML = `
            <line x1="3%" y1="50%" x2="97%" y2="50%"/>
        `;

        this.boardEl.append(svg);
    };

    this.step = function step(row, column) {
        //* this = game
        if (this.status !== STARTED) {
            return ;
        }

        if (this.board[row][column] === EMPTY) {
            const el = this.steps % 2 === 0 ? X : O;

            this.board[row][column] = el;
            this.stepHistory.push({ el, column, row });

            const win = this.isWin();

            if (!win) {
                this.steps++;

                if (this.steps === 9) {
                    this.status = STANDOFF;
                }
            } else {
                this.status = WIN;
                this.winLine = win;
            }

            this.render();

            if (this.status === STARTED && el === this.user) {
                setTimeout(this.autoMove.bind(this), 1000);
                // this.autoMove();
            }
        }
    };

    this.isWin = function isWin() {
        const currentSymbol = this.steps % 2 === 0 ? X : O;
        const lines = this.getLines();
        const winLine = lines.find(isLineWin);

        function isLineWin(line) {
            return line.data.every(function(symbol) {
                return symbol === currentSymbol;
            });
        }

        if (winLine) {
            return winLine;
        }

        return null;
    };

    this.startGame = function startGame() {
        this.status = STARTED;
        this.steps = 0;
        this.stepHistory = [];
        this.winLine = null;

        if (this.user !== X) {
            this.autoMove();
        }
    };

    this.getLines = function () {
        const result = [];

        for (let i=0; i < 3; i++) {
            const columnArr = [
                this.board[0][i],
                this.board[1][i],
                this.board[2][i]
            ];


            result.push({
                index: i,
                type: 'column',
                data: columnArr
            });

            const rowArr = this.board[i];

            result.push({
                index: i,
                type: 'row',
                data: rowArr
            });
        }

        result.push({
            index: 0,
            type: 'diagonal',
            data: [
                this.board[0][0],
                this.board[1][1],
                this.board[2][2]
            ]
        },
        {
            index: 1,
            type: 'diagonal',
            data: [
                this.board[0][2],
                this.board[1][1],
                this.board[2][0]
            ]
        });

        return result;
    };

    this.countSymbolsInLine = function(sm, lineArr) {
        return lineArr.includes(sm === X ? O : X)
            ? -1
            : lineArr.filter(function (el) {
                return sm === el;
            }).length;

        // return lineArr.reduce(
        //     function (sum, el) {
        //         if (el === sm) {
        //             return sum + 1;
        //         }

        //         return sum;
        //     },
        //     0
        // );
    };

    this.getDistanceBetweenCells = function ( cell1, cell2 ) {
        return Math.pow(Math.abs(cell1.column - cell2.column), 2)
            + Math.pow(Math.abs(cell1.row - cell2.row), 2);
    };

    this.getEmtyCorners = function() {
        //* this = game
        const checkHandler = function (cell) {
            //* this = game
            return this.board[cell.row][cell.column] === EMPTY;
        };

        //* this = game
        return [
            { column: 0, row: 0},
            { column: 2, row: 0},
            { column: 0, row: 2},
            { column: 2, row: 2},
        ].filter(checkHandler, this);
        // .filter(checkHandler.bind(this));
    };

    this.autoMove = function() {
        const mySm = this.steps % 2 === 0 ? X : O;
        const enemySm = this.steps % 2 === 1 ? X : O;

        if (mySm === X && this.steps === 0) {
            return this.step(1, 1);
        }

        const lines = this.getLines();
        const myWinLine = lines.find(function (line) {
            return this.countSymbolsInLine(mySm, line.data) === 2;
        }, this);
        const enemyWinLine = lines.find(function (line) {
            return this.countSymbolsInLine(enemySm, line.data) === 2;
        }, this);
        const closedLine = myWinLine || enemyWinLine;

        if (closedLine) {
            switch (closedLine.type) {
            case 'row': {
                const row = closedLine.index;
                const column = closedLine.data.findIndex(
                    function(el) {
                        return el === EMPTY;
                    }
                );

                return this.step(row, column);
            }
            case 'column': {
                const column = closedLine.index;
                const row = closedLine.data.findIndex(
                    function(el) {
                        return el === EMPTY;
                    }
                );

                return this.step(row, column);
            }

            default: {
                const dIndex = closedLine.index;
                const emptyIndex = closedLine.data.findIndex(
                    function(el) {
                        return el === EMPTY;
                    }
                );

                if (dIndex === 0) {
                    return this.step(emptyIndex, emptyIndex);
                } else {
                    return this.step(emptyIndex, 2 - emptyIndex);
                }
            }
            }
        }

        //* this = game
        if (mySm === X) {
            const lastMove = this.stepHistory[this.stepHistory.length - 1];
            const getDistanceToCell = this.getDistanceBetweenCells.bind(this, lastMove);
            const compareFunction = function (cell1, cell2) {
                //* this = undefined
                const distanceToCell1 = getDistanceToCell(cell1);
                const distanceToCell2 = getDistanceToCell(cell2);

                // cell1.distance = distanceToCell1;
                // cell2.distance = distanceToCell2;

                // if (distanceToCell1 > distanceToCell2) {
                //     return -1;
                // }

                // if (distanceToCell2 > distanceToCell1) {
                //     return 1;
                // }

                return distanceToCell2 - distanceToCell1;
            };
            const emptyCorners = this.getEmtyCorners()
                .sort(compareFunction)
                .filter(function (corner, idx, corners) {
                    return getDistanceToCell(corner) === getDistanceToCell(corners[0]);
                });
                // .sort(compareFunction.bind(this));
            const randomCorner = emptyCorners[Math.floor( Math.random() * emptyCorners.length )];

            if (randomCorner) {
                return this.step(randomCorner.row, randomCorner.column);
            }

            return this.randomMove();
        } else {
            // за нолики дома
        }

        return this.randomMove();
    };

    this.randomMove = function() {
        const rowsWithEmptyCells = this.board.filter(function(row) {
            return row.includes(EMPTY);
        });

        const randomEmptyRow = rowsWithEmptyCells[Math.floor( Math.random() * rowsWithEmptyCells.length )];
        const row = this.board.findIndex(function (rowArr) {
            return rowArr === randomEmptyRow;
        });

        let column;

        while (typeof column === 'undefined') {
            const randomCellIndex = Math.floor( Math.random() * randomEmptyRow.length);

            if (randomEmptyRow[randomCellIndex] === EMPTY) {
                column = randomCellIndex;
            }
        }

        this.step(row, column);
    };

    // return this;
}

CrossGame.X = 'X';
CrossGame.O = 'O';


const game = new CrossGame( CrossGame.O );

console.log( game );
game.init(); // this = game
game.startGame(); // this = game
