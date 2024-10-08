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
        { question: "What gets wet while drying?", answer: "towel" },
        { question: "I am not alive, but I grow; I don’t have lungs, but I need air; I don’t have a mouth, but water kills me. What am I?", answer: "fire" },
    { question: "The more of this there is, the less you see. What is it?", answer: "darkness" },
    { question: "I’m tall when I’m young, and I’m short when I’m old. What am I?", answer: "candle" },
    { question: "What comes once in a minute, twice in a moment, but never in a thousand years?", answer: "letter M" },
    { question: "What has to be broken before you can use it?", answer: "egg" },
    { question: "What can travel around the world while staying in the same spot?", answer: "stamp" },
    { question: "What has an eye but cannot see?", answer: "needle" },
    { question: "What gets bigger the more you take away?", answer: "hole" },
    { question: "What has many needles, but doesn’t sew?", answer: "pine tree" },
    { question: "What is full of holes but still holds water?", answer: "sponge" },
    { question: "What can you keep after giving to someone?", answer: "your word" },
    { question: "I am light as a feather, yet the strongest person can’t hold me for five minutes. What am I?", answer: "breath" },
    { question: "What can fill a room but takes up no space?", answer: "light" },
    { question: "What can be touched but can’t be seen?", answer: "someone’s heart" },
    { question: "The more you take, the more you leave behind. What are they?", answer: "footsteps" },
    { question: "What can run, but never walks; has a mouth, but never talks; has a head, but never weeps; has a bed, but never sleeps?", answer: "river" },
    { question: "What is always in front of you but can’t be seen?", answer: "future" },
    { question: "What goes up but never comes down?", answer: "age" },
    { question: "What has hands but can’t clap?", answer: "clock" },
    { question: "What has a head, a tail, but no body?", answer: "coin" },
    { question: "What has many teeth, but can’t bite?", answer: "comb" },
    { question: "What has one eye but can’t see?", answer: "needle" },
    { question: "What can’t talk but will reply when spoken to?", answer: "echo" },
    { question: "What goes through cities and fields, but never moves?", answer: "road" },
    { question: "I have branches, but no fruit, trunk, or leaves. What am I?", answer: "bank" },
    { question: "What is so fragile that saying its name breaks it?", answer: "silence" },
    { question: "The more you have of me, the less you see. What am I?", answer: "darkness" },
    { question: "What can’t be used until it’s broken?", answer: "egg" },
    { question: "I have keys but open no locks. I have space but no room. You can enter but go nowhere. What am I?", answer: "keyboard" },
    { question: "What is black when it’s clean and white when it’s dirty?", answer: "chalkboard" },
    { question: "What has a ring but no finger?", answer: "phone" },
    { question: "What goes up and down without moving?", answer: "stairs" },
    { question: "The more you cut me, the bigger I grow. What am I?", answer: "hole" },
    { question: "What gets sharper the more you use it?", answer: "brain" },
    { question: "What is easy to get into, but hard to get out of?", answer: "trouble" },
    { question: "What flies without wings?", answer: "time" },
    { question: "What runs but never walks?", answer: "river" },
    { question: "I am taken from a mine, and shut up in a wooden case, from which I am never released, and yet I am used by almost every person. What am I?", answer: "pencil lead" },
    { question: "What can be seen once in a minute, twice in a moment, but never in a thousand years?", answer: "letter M" },
    { question: "I’m where yesterday follows today and tomorrow is in the middle. What am I?", answer: "dictionary" },
    { question: "What is always in front of you but can’t be seen?", answer: "future" },
    { question: "I have no life, but I can die. What am I?", answer: "battery" },
    { question: "What comes down but never goes up?", answer: "rain" },
    { question: "I’m often running yet have no legs. You need me but I don’t need you. What am I?", answer: "water" },
    { question: "I have keys but can’t open doors. What am I?", answer: "piano" },
    { question: "I start with the letter E, end with the letter E, and have only one letter inside. What am I?", answer: "envelope" },
    { question: "The more you take away from me, the bigger I become. What am I?", answer: "hole" },
    { question: "I shave every day, but my beard stays the same. What am I?", answer: "barber" },
    { question: "What has four legs in the morning, two in the afternoon, and three in the evening?", answer: "human" },
    { question: "What can you catch but not throw?", answer: "cold" },
    { question: "What is lighter than a feather but even the world’s strongest person can’t hold for long?", answer: "breath" },
    { question: "The more you take, the more you leave behind. What am I?", answer: "footsteps" },
    { question: "What building has the most stories?", answer: "library" },
    { question: "What is always running but never gets tired?", answer: "clock" },
    { question: "What has a neck but no head?", answer: "bottle" },
    { question: "What can you hold in your right hand, but not in your left?", answer: "left hand" },
    { question: "What is so delicate that even mentioning it breaks it?", answer: "silence" },
    { question: "I’m not alive, but I can die. What am I?", answer: "battery" },
    { question: "What invention lets you look right through a wall?", answer: "window" },
    { question: "I have many faces, expressions, and emotions, and I am usually right at your fingertips. What am I?", answer: "emoji" },
    { question: "What do you throw out when you want to use it but take in when you don’t want to use it?", answer: "anchor" },
    { question: "What has a bottom at the top?", answer: "leg" },
    { question: "The more you take, the more you leave behind. What are they?", answer: "footsteps" },
    { question: "What has one head, one foot, and four legs?", answer: "bed" },
    { question: "What is so light that the strongest person cannot hold it for more than a few seconds?", answer: "breath" },
    { question: "What has many keys but cannot open a single lock?", answer: "piano" },
    { question: "What gets wetter as it dries?", answer: "towel" }
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
