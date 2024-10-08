// Game state
let currentPlayer = 'X';
let gameBoard = ['', '', '', '', '', '', '', '', ''];
let gameActive = false;
let gameMode = '';
let player1Name = 'Player 1';
let player2Name = 'Player 2';
let aiDifficulty = '';
let isComputerTurn = false;

// DOM elements
const cells = document.querySelectorAll('.cell');
const currentPlayerDisplay = document.getElementById('currentPlayer');
const modal = document.getElementById('modal');
const modalMessage = document.getElementById('modalMessage');
const restartButton = document.getElementById('restartButton');
const goHomeButton = document.getElementById('goHomeButton');
const homePage = document.getElementById('homePage');
const playerNamePage = document.getElementById('playerNamePage');
const difficultyPage = document.getElementById('difficultyPage');
const gamePage = document.getElementById('gamePage');
const normalModeButton = document.getElementById('normalMode');
const customModeButton = document.getElementById('customMode');
const vsComputerModeButton = document.getElementById('vsComputerMode');
const player1Input = document.getElementById('player1Name');
const player2Input = document.getElementById('player2Name');
const startGameButton = document.getElementById('startGame');
const goBackHomeButton = document.getElementById('goBackHome');
const goBackToNamesFromGameButton = document.getElementById('goBackToNamesFromGame');
const goBackToNamesFromDifficultyButton = document.getElementById('goBackToNamesFromDifficulty');
const themeToggle = document.getElementById('themeToggle');
const riddleModal = document.getElementById('riddleModal');
const riddleQuestion = document.getElementById('riddleQuestion');
const riddleAnswer = document.getElementById('riddleAnswer');
const submitRiddle = document.getElementById('submitRiddle');

// Event listeners
normalModeButton.addEventListener('click', () => showPlayerNamePage('normal'));
customModeButton.addEventListener('click', () => showPlayerNamePage('custom'));
vsComputerModeButton.addEventListener('click', () => showPlayerNamePage('vsComputer'));
startGameButton.addEventListener('click', startGame);
goBackHomeButton.addEventListener('click', goToHome);
goBackToNamesFromGameButton.addEventListener('click', goToPlayerNamePage);
goBackToNamesFromDifficultyButton.addEventListener('click', goToPlayerNamePage);
restartButton.addEventListener('click', restartGame);
goHomeButton.addEventListener('click', goToHome);
cells.forEach(cell => cell.addEventListener('click', () => cellClick(cell)));
themeToggle.addEventListener('change', toggleTheme);
submitRiddle.addEventListener('click', checkRiddleAnswer);

// Difficulty buttons in vsComputer mode
const difficultyButtons = document.querySelectorAll('#difficultyPage .btn[data-difficulty]');
difficultyButtons.forEach(button => {
    button.addEventListener('click', () => {
        aiDifficulty = button.getAttribute('data-difficulty');
        difficultyPage.style.display = 'none';
        gamePage.style.display = 'block';
        gameActive = true;
        resetBoard();
        updateDisplay();
        if (currentPlayer === 'O') {
            isComputerTurn = true;
            computerMove();
        }
    });
});

// Accessibility: Allow keyboard navigation for cells
cells.forEach(cell => {
    cell.addEventListener('keypress', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
            cellClick(cell);
        }
    });
});

// Initialize theme
if (localStorage.getItem('theme') === 'dark') {
    document.body.classList.add('dark-mode');
    themeToggle.checked = true;
}

// Initialize Particles.js
particlesJS("particles-js", {
    "particles": {
        "number": {
            "value": 80,
            "density": {
                "enable": true,
                "value_area": 800
            }
        },
        "color": {
            "value": ["#4ECDC4", "#45B7AA", "#FFD93D"]
        },
        "shape": {
            "type": "circle",
            "stroke": {
                "width": 0,
                "color": "#000000"
            }
        },
        "opacity": {
            "value": 0.5,
            "random": false
        },
        "size": {
            "value": 3,
            "random": true
        },
        "line_linked": {
            "enable": true,
            "distance": 150,
            "color": "#4ECDC4",
            "opacity": 0.4,
            "width": 1
        },
        "move": {
            "enable": true,
            "speed": 6,
            "direction": "none",
            "random": false,
            "straight": false,
            "out_mode": "out",
            "bounce": false
        }
    },
    "interactivity": {
        "detect_on": "canvas",
        "events": {
            "onhover": {
                "enable": true,
                "mode": "repulse"
            },
            "onclick": {
                "enable": true,
                "mode": "push"
            },
            "resize": true
        },
        "modes": {
            "repulse": {
                "distance": 100,
                "duration": 0.4
            },
            "push": {
                "particles_nb": 4
            }
        }
    },
    "retina_detect": true
});

function showPlayerNamePage(mode) {
    gameMode = mode;
    homePage.style.display = 'none';
    playerNamePage.style.display = 'block';
    difficultyPage.style.display = 'none';
    gamePage.style.display = 'none';
    modal.style.display = 'none';
    riddleModal.style.display = 'none';
    resetGame();

    if (mode === 'vsComputer') {
        player2Input.value = 'Computer';
        player2Input.disabled = true;
    } else {
        player2Input.value = '';
        player2Input.disabled = false;
        if (mode === 'custom') {
            alert('Answer a riddle to customize your game!');
        }
    }
}

function startGame() {
    player1Name = player1Input.value.trim() || 'Player 1';
    player2Name = player2Input.value.trim() || (gameMode === 'vsComputer' ? 'Computer' : 'Player 2');

    playerNamePage.style.display = 'none';

    if (gameMode === 'vsComputer') {
        difficultyPage.style.display = 'block';
    } else {
        gamePage.style.display = 'block';
        if (gameMode === 'custom') {
            showRiddle();
        } else {
            gameActive = true;
            resetBoard();
            updateDisplay();
        }
    }
}

function goToHome() {
    homePage.style.display = 'block';
    playerNamePage.style.display = 'none';
    difficultyPage.style.display = 'none';
    gamePage.style.display = 'none';
    modal.style.display = 'none';
    riddleModal.style.display = 'none';
    resetGame();
}

function goToPlayerNamePage() {
    homePage.style.display = 'none';
    playerNamePage.style.display = 'block';
    gamePage.style.display = 'none';
    difficultyPage.style.display = 'none';
    modal.style.display = 'none';
    riddleModal.style.display = 'none';
    resetGame();

    if (gameMode === 'vsComputer') {
        player2Input.value = 'Computer';
        player2Input.disabled = true;
    } else {
        player2Input.value = '';
        player2Input.disabled = false;
    }
}

function showRiddle() {
    const riddles = [
        { question: "I speak without a mouth and hear without ears. I have no body, but I come alive with wind. What am I?", answer: "echo" },
        { question: "What has keys, but no locks; space, but no room; you can enter, but not go in?", answer: "keyboard" },
        { question: "What gets wet while drying?", answer: "towel" }
    ];
    const randomRiddle = riddles[Math.floor(Math.random() * riddles.length)];
    riddleQuestion.textContent = randomRiddle.question;
    riddleModal.style.display = 'block';
}

function checkRiddleAnswer() {
    const userAnswer = riddleAnswer.value.toLowerCase().trim();
    const currentQuestion = riddleQuestion.textContent.toLowerCase();
    let correctAnswer = '';

    if (currentQuestion.includes("echo")) {
        correctAnswer = "echo";
    } else if (currentQuestion.includes("keyboard")) {
        correctAnswer = "keyboard";
    } else {
        correctAnswer = "towel";
    }

    if (userAnswer === correctAnswer) {
        alert("Correct! You can choose your symbol.");
        currentPlayer = prompt("Player 1, choose your symbol (X or O):").toUpperCase();
        if (currentPlayer !== 'X' && currentPlayer !== 'O') {
            currentPlayer = 'X';
            alert("Invalid choice. Defaulting to 'X'.");
        }

        let otherPlayer = currentPlayer === 'X' ? 'O' : 'X';
        alert(`Player 2 will play with: ${otherPlayer}`);
    } else {
        alert("Incorrect. Random symbols will be assigned.");
        currentPlayer = Math.random() < 0.5 ? 'X' : 'O';
    }

    riddleAnswer.value = '';
    riddleModal.style.display = 'none';
    gameActive = true;
    resetBoard();
    updateDisplay();
}

function cellClick(cell) {
    if (!gameActive || isComputerTurn) return;
    const index = cell.getAttribute('data-index');
    if (gameBoard[index] !== '') return;

    gameBoard[index] = currentPlayer;
    cell.textContent = currentPlayer;
    cell.classList.add(currentPlayer.toLowerCase());
    cell.classList.add('pop');

    if (checkWin()) {
        endGame(false);
    } else if (gameBoard.every(cell => cell !== '')) {
        endGame(true);
    } else {
        switchPlayer();
        if (gameMode === 'vsComputer' && currentPlayer === 'O') {
            isComputerTurn = true;
            computerMove();
        }
    }
}

function switchPlayer() {
    currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
    updateDisplay();
}

function checkWin() {
    const winPatterns = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
        [0, 3, 6], [1, 4, 7], [2, 5, 8], // Columns
        [0, 4, 8], [2, 4, 6] // Diagonals
    ];

    return winPatterns.some(pattern => {
        const [a, b, c] = pattern;
        return gameBoard[a] && gameBoard[a] === gameBoard[b] && gameBoard[a] === gameBoard[c];
    });
}

function endGame(isDraw) {
    gameActive = false;
    if (isDraw) {
        modalMessage.textContent = "It's a draw!";
    } else {
        const winner = currentPlayer === 'X' ? player1Name : player2Name;
        modalMessage.textContent = `${winner} wins!`;

        // Confetti effect
        confetti({
            particleCount: 150,
            spread: 70,
            origin: { y: 0.6 },
            colors: ['#4ECDC4', '#45B7AA', '#FFD93D']
        });
    }
    modal.style.display = 'block';
}

function restartGame() {
    resetGame();
    modal.style.display = 'none';
    gameActive = true;
    isComputerTurn = false;
    updateDisplay();

    if (gameMode === 'vsComputer' && currentPlayer === 'O') {
        isComputerTurn = true;
        setTimeout(computerMove, 500);
    }
}

function resetGame() {
    gameBoard = ['', '', '', '', '', '', '', '', ''];
    gameActive = true;
    currentPlayer = 'X';
    isComputerTurn = false;
    resetBoard();
}

function resetBoard() {
    cells.forEach(cell => {
        cell.textContent = '';
        cell.classList.remove('x', 'o', 'pop');
    });
    updateDisplay();
}

function updateDisplay() {
    const currentPlayerName = currentPlayer === 'X' ? player1Name : player2Name;
    currentPlayerDisplay.textContent = `${currentPlayerName}'s turn (${currentPlayer})`;
}

function toggleTheme() {
    document.body.classList.toggle('dark-mode');
    localStorage.setItem('theme', document.body.classList.contains('dark-mode') ? 'dark' : 'light');

    // Update particles color based on theme
    const particlesColor = document.body.classList.contains('dark-mode') ? 
        ["#6C63FF", "#FF6584", "#4CD137"] : 
        ["#4ECDC4", "#45B7AA", "#FFD93D"];

    pJSDom[0].pJS.particles.color.value = particlesColor;
    pJSDom[0].pJS.particles.line_linked.color = document.body.classList.contains('dark-mode') ? "#ffffff" : "#4ECDC4";
    pJSDom[0].pJS.fn.particlesRefresh();
}

function computerMove() {
    if (!gameActive || currentPlayer === 'X') return;

    let index;
    switch (aiDifficulty) {
        case 'easy':
            index = getRandomEmptyCell();
            break;
        case 'medium':
            index = Math.random() < 0.5 ? getBestMove() : getRandomEmptyCell();
            break;
        case 'hard':
            index = getBestMove();
            break;
        default:
            index = getRandomEmptyCell();
    }

    setTimeout(() => {
        if (gameActive && gameBoard[index] === '') {
            gameBoard[index] = currentPlayer;
            cells[index].textContent = currentPlayer;
            cells[index].classList.add(currentPlayer.toLowerCase());
            cells[index].classList.add('pop');

            if (checkWin()) {
                endGame(false);
            } else if (gameBoard.every(cell => cell !== '')) {
                endGame(true);
            } else {
                switchPlayer();
            }
            isComputerTurn = false;
        }
    }, 500);
}

function getRandomEmptyCell() {
    const emptyCells = gameBoard.reduce((acc, cell, index) => {
        if (cell === '') acc.push(index);
        return acc;
    }, []);
    return emptyCells[Math.floor(Math.random() * 

 emptyCells.length)];
}

function getBestMove() {
    let bestScore = -Infinity;
    let bestMove;
    for (let i = 0; i < 9; i++) {
        if (gameBoard[i] === '') {
            gameBoard[i] = 'O';
            let score = minimax(gameBoard, 0, false);
            gameBoard[i] = '';
            if (score > bestScore) {
                bestScore = score;
                bestMove = i;
            }
        }
    }
    return bestMove;
}

function minimax(board, depth, isMaximizing) {
    if (checkWinForMinimax(board, 'O')) return 1;
    if (checkWinForMinimax(board, 'X')) return -1;
    if (board.every(cell => cell !== '')) return 0;

    if (isMaximizing) {
        let bestScore = -Infinity;
        for (let i = 0; i < 9; i++) {
            if (board[i] === '') {
                board[i] = 'O';
                let score = minimax(board, depth + 1, false);
                board[i] = '';
                bestScore = Math.max(score, bestScore);
            }
        }
        return bestScore;
    } else {
        let bestScore = Infinity;
        for (let i = 0; i < 9; i++) {
            if (board[i] === '') {
                board[i] = 'X';
                let score = minimax(board, depth + 1, true);
                board[i] = '';
                bestScore = Math.min(score, bestScore);
            }
        }
        return bestScore;
    }
}

function checkWinForMinimax(board, player) {
    const winPatterns = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
        [0, 3, 6], [1, 4, 7], [2, 5, 8], // Columns
        [0, 4, 8], [2, 4, 6] // Diagonals
    ];

    return winPatterns.some(pattern => {
        const [a, b, c] = pattern;
        return board[a] === player && board[a] === board[b] && board[a] === board[c];
    });
}














function animateVictoryLine(combination) {
    const line = document.getElementById('victoryLine');
    const [a, b, c] = combination;
    const cellSize = document.querySelector('.cell').offsetWidth;
    const boardRect = document.getElementById('gameBoard').getBoundingClientRect();

    if (a % 3 === 0 && c % 3 === 0) {
        // Vertical line
        line.style.width = '6px';
        line.style.height = `${cellSize * 3 + 20}px`;
        line.style.left = `${boardRect.left + cellSize * (a / 3) + cellSize / 2 - 3}px`;
        line.style.top = `${boardRect.top - 10}px`;
    } else if (Math.floor(a / 3) === Math.floor(c / 3)) {
        // Horizontal line
        line.style.width = `${cellSize * 3 + 20}px`;
        line.style.height = '6px';
        line.style.left = `${boardRect.left - 10}px`;
        line.style.top = `${boardRect.top + cellSize * Math.floor(a / 3) + cellSize / 2 - 3}px`;
    } else {
        // Diagonal line
        line.style.width = `${Math.sqrt(2) * cellSize * 3}px`;
        line.style.height = '6px';
        line.style.left = `${boardRect.left - 10}px`;
        line.style.top = `${boardRect.top + cellSize * 1.5 - 3}px`;
        line.style.transformOrigin = 'left center';
        line.style.transform = a === 0 ? 'rotate(45deg)' : 'rotate(-45deg)';
    }

    line.style.transform += ' scaleX(0)';
    setTimeout(() => {
        line.style.transform = line.style.transform.replace('scaleX(0)', 'scaleX(1)');
    }, 50);
}