let currentPlayer = 'X';
let board = [['', '', ''], ['', '', ''], ['', '', '']];
const cells = document.querySelectorAll('.cell');
const message = document.getElementById('message');
const boardElement = document.getElementById('board');
const thinking = document.getElementById('thinking');

function checkWinner() {
    const combos = [
        [[0,0],[0,1],[0,2]], [[1,0],[1,1],[1,2]], [[2,0],[2,1],[2,2]],
        [[0,0],[1,0],[2,0]], [[0,1],[1,1],[2,1]], [[0,2],[1,2],[2,2]],
        [[0,0],[1,1],[2,2]], [[0,2],[1,1],[2,0]]
    ];
    for (const line of combos) {
        const [[a1,a2],[b1,b2],[c1,c2]] = line;
        if (
            board[a1][a2] &&
            board[a1][a2] === board[b1][b2] &&
            board[a1][a2] === board[c1][c2]
        ) {
            document.querySelector(`.cell[data-row="${a1}"][data-col="${a2}"]`).classList.add('winning');
            document.querySelector(`.cell[data-row="${b1}"][data-col="${b2}"]`).classList.add('winning');
            document.querySelector(`.cell[data-row="${c1}"][data-col="${c2}"]`).classList.add('winning');
            return board[a1][a2];
        }
    }
    return board.flat().includes('') ? null : 'Empate';
}

function disableBoard() {
    cells.forEach(c => c.classList.add('disabled'));
}

function enableBoard() {
    cells.forEach(c => {
        const r = c.dataset.row;
        const col = c.dataset.col;
        if (board[r][col] === '') c.classList.remove('disabled');
    });
}

function restartGame() {
    board = [['','',''], ['','',''], ['','','']];
    currentPlayer = 'X';
    cells.forEach(cell => {
        cell.textContent = '';
        cell.classList.remove('disabled');
        cell.classList.remove('winning');
    });
    message.textContent = '';
    message.className = 'message';
    thinking.style.display = 'none';
    enableBoard();
}

function findBestMove() {
    return findWinningMove('O') || findWinningMove('X') || randomMove();
}

function findWinningMove(player) {
    const combos = [
        [[0,0],[0,1],[0,2]], [[1,0],[1,1],[1,2]], [[2,0],[2,1],[2,2]],
        [[0,0],[1,0],[2,0]], [[0,1],[1,1],[2,1]], [[0,2],[1,2],[2,2]],
        [[0,0],[1,1],[2,2]], [[0,2],[1,1],[2,0]]
    ];
    for (const line of combos) {
        const marks = line.map(([r,c]) => board[r][c]);
        const emptyIndex = marks.indexOf('');
        if (marks.filter(m => m === player).length === 2 && emptyIndex !== -1) {
            return line[emptyIndex];
        }
    }
    return null;
}

function randomMove() {
    const empty = [];
    for (let i=0; i<3; i++) {
        for (let j=0; j<3; j++) {
            if (board[i][j] === '') empty.push([i, j]);
        }
    }
    return empty[Math.floor(Math.random() * empty.length)];
}

function computerMove() {
    thinking.style.display = 'block';
    setTimeout(() => {
        const [r, c] = findBestMove();
        board[r][c] = 'O';
        const cell = document.querySelector(`.cell[data-row="${r}"][data-col="${c}"]`);
        cell.textContent = 'O';
        cell.classList.add('disabled');

        const winner = checkWinner();
        if (winner) {
            disableBoard();
            if (winner === 'X') {
                message.textContent = 'Você venceu!';
                message.className = 'message win';
            } else if (winner === 'O') {
                message.textContent = 'Você perdeu!';
                message.className = 'message lose';
            } else {
                message.textContent = 'Empate!';
                message.className = 'message draw';
            }
        } else {
            enableBoard();
        }
        thinking.style.display = 'none';
    }, 700);
}

cells.forEach(cell => {
    cell.addEventListener('click', () => {
        const r = cell.dataset.row;
        const c = cell.dataset.col;
        if (board[r][c] === '' && currentPlayer === 'X') {
            board[r][c] = 'X';
            cell.textContent = 'X';
            cell.classList.add('disabled');

            const winner = checkWinner();
            if (winner) {
                disableBoard();
                if (winner === 'X') {
                    message.textContent = 'Você venceu!';
                    message.className = 'message win';
                } else if (winner === 'O') {
                    message.textContent = 'Você perdeu!';
                    message.className = 'message lose';
                } else {
                    message.textContent = 'Empate!';
                    message.className = 'message draw';
                }
            } else {
                disableBoard();
                computerMove();
            }
        }
    });
});
