// Variables
var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d");
var width = canvas.width;
var height = canvas.height;
var blockSize = 10;
var snake;
var apple;
var score;
var bestScore = 0;
var gameInterval;

// Initialize the game
function startGame() {
    score = 0;
    snake = new Snake();
    apple = new Apple();
    apple.pickLocation();
    if (gameInterval) {
        clearInterval(gameInterval);
    }
    
    gameInterval = setInterval(function() {
        ctx.clearRect(0, 0, width, height);
        drawCurrentScore();
        drawBestScore();
        snake.draw();
        snake.move();
        apple.draw();
        if (snake.checkCollision()) {
            gameOver();
            clearInterval(gameInterval);
        }
    }, 100);
}

// Draw the current score on the canvas
function drawCurrentScore() {
    var currentScoreElement = document.getElementById("current-score");
    currentScoreElement.textContent = "Score: " + score;
}



// Draw the best score on the canvas
function drawBestScore() {
    var bestScoreElement = document.getElementById("best-score");
    bestScoreElement.textContent = "Best Score: " + bestScore;
}



// Game over
function gameOver() {
    if (score > bestScore) {
        bestScore = score;
        localStorage.setItem('bestScore', bestScore);
    }
    ctx.fillStyle = "black";
    ctx.font = "60px Arial";
    var text = "Game Over";
    var textWidth = ctx.measureText(text).width;
    var x = (width - textWidth) / 2; // Centrar horizontalmente
    var y = height / 2; // Centrar verticalmente
    ctx.fillText(text, x, y);
    clearInterval(gameInterval);
    setTimeout(function () {
        startGame();
    }, 2000);
}


// Snake constructor
function Snake() {
    this.segments = [
        { x: 80, y: 50 },
        { x: 70, y: 50 },
        { x: 60, y: 50 },
        { x: 50, y: 50 },
        { x: 40, y: 50 }
    ];
    this.direction = "right";
    this.nextDirection = "right";
}

// Draw the snake on the canvas
Snake.prototype.draw = function () {
    ctx.fillStyle = "green";
    for (var i = 0; i < this.segments.length; i++) {
        var segment = this.segments[i];
        ctx.fillRect(segment.x, segment.y, blockSize, blockSize);
    }
}

// Move the snake
Snake.prototype.move = function () {
    var head = this.segments[0];
    var newHead = { x: head.x, y: head.y };

    this.direction = this.nextDirection;

    if (this.direction === "right") {
        newHead.x += blockSize;
    } else if (this.direction === "down") {
        newHead.y += blockSize;
    } else if (this.direction === "left") {
        newHead.x -= blockSize;
    } else if (this.direction === "up") {
        newHead.y -= blockSize;
    }

    this.segments.unshift(newHead);

    if (this.checkCollisionWithWall()) {
        this.segments.shift();
    } else {
        if (!this.checkCollisionWithApple()) {
            this.segments.pop();
        } else {
            score++;
            apple.pickLocation();
        }
    }
}

// Check collision with the wall
Snake.prototype.checkCollisionWithWall = function () {
    var head = this.segments[0];
    if (head.x < 0 || head.x >= width || head.y < 0 || head.y >= height) {
        gameOver()
        return true;
    }
    for (var i = 1; i < this.segments.length; i++) {
        if (head.x === this.segments[i].x && head.y === this.segments[i].y) {
            gameOver()
            return true;
        }
    }
    return false;
}

// Check collision with the apple
Snake.prototype.checkCollisionWithApple = function () {
    var head = this.segments[0];
    if (head.x === apple.x && head.y === apple.y) {
        return true;
    }
    return false;
}

// Apple constructor
function Apple() {
    this.x = 0;
    this.y = 0;
}

// Pick a random location for the apple
Apple.prototype.pickLocation = function () {
    var columns = width / blockSize;
    var rows = height / blockSize;
    this.x = Math.floor(Math.random() * columns) * blockSize;
    this.y = Math.floor(Math.random() * rows) * blockSize;
}

// Draw the apple on the canvas
Apple.prototype.draw = function () {
    ctx.fillStyle = "red";
    ctx.fillRect(this.x, this.y, blockSize, blockSize);
}

// Handle keyboard input
document.addEventListener("keydown", function (event) {
    var keyCode = event.keyCode;
    if (keyCode === 37 && snake.direction !== "right") {
        snake.nextDirection = "left";
    } else if (keyCode === 38 && snake.direction !== "down") {
        snake.nextDirection = "up";
    } else if (keyCode === 39 && snake.direction !== "left") {
        snake.nextDirection = "right";
    } else if (keyCode === 40 && snake.direction !== "up") {
        snake.nextDirection = "down";
    }
});

// Obtener el mejor puntaje almacenado
bestScore = localStorage.getItem('bestScore') || 0;

// Mostrar el mejor puntaje en el lienzo
drawBestScore();

startGame();
