const svgNS = 'http://www.w3.org/2000/svg';
const X = 1;
const O = 0;
const EMPTY = -1;

function renderX() {
    const svg = document.createElementNS(svgNS, 'svg');

    svg.setAttribute('class', 'x cross__board-item-el');
    svg.setAttribute('viewBox', '0 0 80 80');

    svg.innerHTML = `
        <line class="x__line1" x1="20" y1="10" x2="60" y2="70"/>
        <line class="x__line2" x1="60" y1="10" x2="20" y2="70"/>
    `;

    return svg;
}

function render0() {
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
}

function clearBoard(boardRows) {
    for (let row=0; row < 3; row++) {
        for (let column=0; column<3; column++) {
            const cell = boardRows[row].children[column];

            cell.innerText = '';
        }
    }
}

function render(board, boardRows) {
    for (let row=0; row < 3; row++) {
        for (let column=0; column<3; column++) {
            const cell = boardRows[row].children[column];

            if (cell.children.length > 0) {
                continue;
            }

            if (board[row][column] === X) {
                cell.append( renderX() );
            } else if (board[row][column] === O) {
                cell.append( render0() );
            }
        }
    }
}

function step(row, column) {
    if (status !== STARTED) {
        return ;
    }

    if (board[row][column] === EMPTY) {
        const el = steps % 2 === 0 ? X : O;

        board[row][column] = el;

        const win = isWin(board);

        if (!win) {
            steps++;

            if (steps === 9) {
                status = STANDOFF;
            }

        } else {
            status = WIN;
        }

        render(board, boardRows);
    }
}

function isWin(board) {
    const currentSymbol = steps % 2 === 0 ? X : O;

    function isRowWin(symbol) {
        return symbol === currentSymbol;
    }

    for (let i=0; i < 3; i++) {
        const columnArr = [
            board[0][i],
            board[1][i],
            board[2][i]
        ];

        const winColumn = columnArr.every(isRowWin);

        if (winColumn) {
            return {
                index: i,
                type: 'column'
            };
        }

        const rowArr = board[i];

        const winRow = rowArr.every(isRowWin);

        if (winRow) {
            return {
                index: i,
                type: 'row'
            };
        }
    }

    const diagonals = [
        [
            board[0][0],
            board[1][1],
            board[2][2]
        ],
        [
            board[0][2],
            board[1][1],
            board[2][0]
        ]
    ];

    const winDiagIdx = diagonals.findIndex(isRowWin);

    if (winDiagIdx !== -1) {
        return {
            index: winDiagIdx,
            type: 'diagonal'
        };
    }

    return null;
}

function startGame() {
    status = STARTED;
}

const NOT_STARTED = 0;
const STARTED = 1;
const WIN = 3;
const STANDOFF = 4;

let steps = 0;
let status = NOT_STARTED;
// const boardEl = document.querySelector('.cross__board');
const boardRows = document.querySelectorAll('.cross__board--row');
const board = [
    [EMPTY, EMPTY, EMPTY],
    [EMPTY, EMPTY, EMPTY],
    [EMPTY, EMPTY, EMPTY]
];

for (let row=0; row < 3; row++) {
    for (let column=0; column<3; column++) {
        const cell = boardRows[row].children[column];

        cell.dataset.row = row;
        cell.dataset.column = column;

        cell.onclick = function() {
            step(row, column);
        };
    }
}

clearBoard(boardRows);
startGame();
render(board, boardRows);
