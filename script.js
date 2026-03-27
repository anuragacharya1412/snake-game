// 1. DEFINITIONS (Variables) - These MUST come first
const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
const scoreElement = document.getElementById("score-board");
const highScoreElement = document.getElementById("high-score");
const startBtn = document.getElementById("start-btn");

const gridSize = 20;
const tileCount = 20; // 400 / 20 = 20 tiles

let score = 0;
let highScore = parseInt(localStorage.getItem("snakeHighScore")) || 0; 
let dx = 0; // Horizontal velocity
let dy = 0; // Vertical velocity
let snake = [{x: 10, y: 10}];
let food = {x: 5, y: 5};
let gameInterval = null;

// 2. INITIAL SETUP
if(highScoreElement) highScoreElement.innerText = highScore;

// 3. THE GAME ENGINE
function draw() {
    moveSnake();
    if (checkGameOver()) {
        alert("Game Over! Score: " + score);
        clearInterval(gameInterval);
        return;
    }
    
    checkFoodCollision();
    
    // Clear background
    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw Food
    ctx.fillStyle = "#ff2e63";
    ctx.fillRect(food.x * gridSize, food.y * gridSize, gridSize - 2, gridSize - 2);

    // Draw Snake
    ctx.fillStyle = "#00d2ff";
    snake.forEach(part => {
        if (part.x !== undefined) {
            ctx.fillRect(part.x * gridSize, part.y * gridSize, gridSize - 2, gridSize - 2);
        }
    });
}

function moveSnake() {
    const head = {x: snake[0].x + dx, y: snake[0].y + dy};
    snake.unshift(head);
    snake.pop();
}

function checkGameOver() {
    const head = snake[0];
    if (head.x < 0 || head.x >= tileCount || head.y < 0 || head.y >= tileCount) return true;
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
        snake.push({ ...snake[snake.length - 1] });
    }
}

function createFood() {
    food.x = Math.floor(Math.random() * tileCount);
    food.y = Math.floor(Math.random() * tileCount);
}

function updateScore() {
    if(scoreElement) scoreElement.innerHTML = `Score: ${score} | High Score: ${highScore}`;
    if (score > highScore) {
        highScore = score;
        localStorage.setItem("snakeHighScore", highScore);
        if(highScoreElement) highScoreElement.innerText = highScore;
    }
}

// 4. CONTROLS (Input Handling)
function changeDirection(newDx, newDy) {
    // Prevent 180-degree turns
    if (newDx !== 0 && dx === -newDx) return;
    if (newDy !== 0 && dy === -newDy) return;
    dx = newDx;
    dy = newDy;
}

// Keyboard controls
window.addEventListener("keydown", e => {
    if (e.key === "ArrowUp") changeDirection(0, -1);
    if (e.key === "ArrowDown") changeDirection(0, 1);
    if (e.key === "ArrowLeft") changeDirection(-1, 0);
    if (e.key === "ArrowRight") changeDirection(1, 0);
});

// Mobile button controls
const setupButton = (id, x, y) => {
    const btn = document.getElementById(id);
    if (btn) btn.addEventListener('click', () => changeDirection(x, y));
};

setupButton('up', 0, -1);
setupButton('down', 0, 1);
setupButton('left', -1, 0);
setupButton('right', 1, 0);

// Start Button
if(startBtn) {
    startBtn.addEventListener("click", () => {
        score = 0;
        dx = 1; // Start moving right
        dy = 0;
        snake = [{x: 10, y: 10}];
        updateScore();
        createFood();
        if (gameInterval) clearInterval(gameInterval);
        gameInterval = setInterval(draw, 100);
    });
}
