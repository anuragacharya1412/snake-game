// 1. All Variables Defined at the Top
const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
const scoreElement = document.getElementById("score-board");
const highScoreElement = document.getElementById("high-score");
const startBtn = document.getElementById("start-btn");

const gridSize = 20;
const tileCount = 20; 

let score = 0;
let highScore = parseInt(localStorage.getItem("snakeHighScore")) || 0; 
let dx = 0; 
let dy = 0; 
let snake = [{x: 10, y: 10}];
let food = {x: 5, y: 5};
let gameInterval = null;

// Initial High Score Display
if(highScoreElement) highScoreElement.innerText = highScore;

// 2. The Game Loop
function draw() {
    moveSnake();
    
    if (checkGameOver()) {
        alert("Game Over! Score: " + score);
        clearInterval(gameInterval);
        gameInterval = null;
        return;
    }
    
    checkFoodCollision();
    
    // Draw Background
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

// 3. Logic Functions
function moveSnake() {
    const head = {x: snake[0].x + dx, y: snake[0].y + dy};
    snake.unshift(head);
    snake.pop();
}

function checkGameOver() {
    const head = snake[0];
    // Border collision
    if (head.x < 0 || head.x >= tileCount || head.y < 0 || head.y >= tileCount) return true;
    // Self collision
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
        // Grow snake
        snake.push({ ...snake[snake.length - 1] });
    }
}

function createFood() {
    food.x = Math.floor(Math.random() * tileCount);
    food.y = Math.floor(Math.random() * tileCount);
    // Make sure food doesn't spawn on snake
    snake.forEach(part => {
        if (food.x === part.x && food.y === part.y) createFood();
    });
}

function updateScore() {
    scoreElement.innerHTML = `Score: ${score} | High Score: <span id="high-score">${highScore}</span>`;
    if (score > highScore) {
        highScore = score;
        localStorage.setItem("snakeHighScore", highScore);
    }
}

// 4. Direction Control (Prevents 180-degree suicide turns)
function changeDirection(newDx, newDy) {
    if (newDx !== 0 && dx === -newDx) return;
    if (newDy !== 0 && dy === -newDy) return;
    dx = newDx;
    dy = newDy;
}

// 5. Input Listeners
window.addEventListener("keydown", e => {
    if (e.key === "ArrowUp") changeDirection(0, -1);
    if (e.key === "ArrowDown") changeDirection(0, 1);
    if (e.key === "ArrowLeft") changeDirection(-1, 0);
    if (e.key === "ArrowRight") changeDirection(1, 0);
    
    // Prevent scrolling with arrows
    if(["ArrowUp","ArrowDown","ArrowLeft","ArrowRight"].includes(e.key)) {
        e.preventDefault();
    }
});

// Mobile Button Listeners
document.getElementById('up').addEventListener('click', () => changeDirection(0, -1));
document.getElementById('down').addEventListener('click', () => changeDirection(0, 1));
document.getElementById('left').addEventListener('click', () => changeDirection(-1, 0));
document.getElementById('right').addEventListener('click', () => changeDirection(1, 0));

// Start Button Listener
startBtn.addEventListener("click", () => {
    // Reset Variables
    score = 0;
    dx = 1; 
    dy = 0;
    snake = [{x: 10, y: 10}];
    updateScore();
    createFood();
    
    if (gameInterval) clearInterval(gameInterval);
    gameInterval = setInterval(draw, 100);
});
