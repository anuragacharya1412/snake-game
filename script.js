const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
const scoreElement = document.getElementById("score-board");
const highScoreElement = document.getElementById("high-score");
const startBtn = document.getElementById("start-btn");

// Game Constants
const gridSize = 20;
const tileCount = canvas.width / gridSize;

// Game Variables
let score = 0;
let highScore = localStorage.getItem("snakeHighScore") || 0;
let dx = 0; // horizontal velocity
let dy = 0; // vertical velocity
let snake = [{x: 10, y: 10}];
let food = {x: 5, y: 5};
let gameInterval = null;

highScoreElement.innerText = highScore;

// Start Game
function startGame() {
    resetGame();
    if (gameInterval) clearInterval(gameInterval);
    gameInterval = setInterval(draw, 100);
}

function resetGame() {
    score = 0;
    dx = 1; // Start moving right
    dy = 0;
    snake = [{x: 10, y: 10}];
    updateScore();
    createFood();
}

function draw() {
    moveSnake();
    if (checkGameOver()) {
        alert("Game Over! Score: " + score);
        clearInterval(gameInterval);
        return;
    }
    
    checkFoodCollision();
    
    // Clear Canvas
    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw Food
    ctx.fillStyle = "#ff2e63";
    ctx.fillRect(food.x * gridSize, food.y * gridSize, gridSize - 2, gridSize - 2);

    // Draw Snake
    ctx.fillStyle = "#00d2ff";
    snake.forEach(part => {
        ctx.fillRect(part.x * gridSize, part.y * gridSize, gridSize - 2, gridSize - 2);
    });
}

function moveSnake() {
    const head = {x: snake[0].x + dx, y: snake[0].y + dy};
    snake.unshift(head);
    snake.pop();
}

function checkGameOver() {
    const head = snake[0];
    // Hit walls
    if (head.x < 0 || head.x >= tileCount || head.y < 0 || head.y >= tileCount) return true;
    // Hit self
    for (let i = 1; i < snake.length; i++) {
        if (head.x === snake[i].x && head.y === snake[i].y) return true;
    }
    return false;
}

function checkFoodCollision() {
    if (snake[0].x === food.x && snake[0].y === food.y) {
        score += 10;
        updateScore();
        createFood();
        // Add part to snake tail
        snake.push({});
    }
}

function createFood() {
    food.x = Math.floor(Math.random() * tileCount);
    food.y = Math.floor(Math.random() * tileCount);
}

function updateScore() {
    scoreElement.innerHTML = `Score: ${score} | High Score: ${highScore}`;
    if (score > highScore) {
        highScore = score;
        localStorage.setItem("snakeHighScore", highScore);
        highScoreElement.innerText = highScore;
    }
}

// Controls
window.addEventListener("keydown", e => {
    switch (e.key) {
        case "ArrowUp": if (dy !== 1) { dx = 0; dy = -1; } break;
        case "ArrowDown": if (dy !== -1) { dx = 0; dy = 1; } break;
        case "ArrowLeft": if (dx !== 1) { dx = -1; dy = 0; } break;
        case "ArrowRight": if (dx !== -1) { dx = 1; dy = 0; } break;
    }
});

startBtn.addEventListener("click", startGame);
