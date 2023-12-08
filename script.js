// define HTML elements
const board = document.getElementById('game-board');
const instructionText = document.getElementById('instruction-text');
const gameLogo = document.getElementById('logo');
const score = document.getElementById('current-score');
const highScoreText = document.getElementById('high-score');

// global variables
let gridSize = 20; // grid size of the board
let snake = [{x: 10, y: 10}]; // start by default at middle of board (400px board)
let snakeDirection = 'right'; // the direction in which snake moves by default right
let food = generateFoodPosition(); // generate the random food position coordinates
let gameSpeedDelay = 200;
let gameInterval;
let hasGameStarted = false;
let highScore = 0;

// Responsible for creating snake or food cube
function createGameElement(tag, className) {
    const element = document.createElement(tag);
    element.className = className;
    return element;
}

// Set the position of snake or the food in board
function setPosition(element, position) {
    element.style.gridRow = position.y;
    element.style.gridColumn = position.x;
}

// generates random coordinates object { x, y }
function generateFoodPosition() {
    const x = Math.floor(Math.random() * gridSize) + 1;
    const y = Math.floor(Math.random() * gridSize) + 1;
    return { x, y};
}

// draw the snake.
function drawSnake() {
    snake.forEach((coordinates) => {
        const snakeElement = createGameElement('div', 'snake');
        setPosition(snakeElement, coordinates);
        board.appendChild(snakeElement);
    });
}

// draw food
function drawFood() {
    if(hasGameStarted) {
        const foodElement = createGameElement('div', 'food');
        setPosition(foodElement, food);
        board.appendChild(foodElement); 
    }
}

function resetGame() {

}

// collusion detection
function checkCollision() {
    const head = snake[0];
    if(head.x < 1 || head.x > gridSize || head.y < 1 || head.y > gridSize) {
        resetGame();
    }

    for(i = 1; i < snake.length; i++) {
        if(head.x === snake[i].x && head.y === snake[i].y) {
            resetGame();
        }
    }
}

// increase the speed of snake
function increaseSnakeSpeed() {
    if (gameSpeedDelay > 150) {
        gameSpeedDelay -= 5;
    } else if (gameSpeedDelay > 100) {
        gameSpeedDelay -= 3;
    } else if (gameSpeedDelay > 50) {
       gameSpeedDelay -= 2; 
    } else if (gameInterval > 25) {
        gameSpeedDelay -= 1;
    }
}

// move the snake pixel
function moveSnake() {
    const head = {...snake[0]};
    switch(snakeDirection) {
        case 'right':
            head.x++;
            break;
        case 'left':
            head.x--;
            break;
        case 'up':
            head.y--;
            break;
        case 'down':
            head.y++;
            break;
    }

    snake.unshift(head);

    if(head.x === food.x && head.y === food.y) {
        food = generateFoodPosition();
        increaseSnakeSpeed();
        clearInterval(gameInterval);
        gameInterval = setInterval(() => {
            moveSnake();
            checkCollision();
            draw();
        }, gameSpeedDelay);
    } else {
        snake.pop();
    }
}

// draw game map, snake and, food
function draw() {
    board.innerHTML = '';
    drawSnake();
    drawFood();
    updateScore();
}

// initial state of the game
function initGame() {
    hasGameStarted = true;
    instructionText.style.display = 'none';
    gameLogo.style.display = 'none';
    gameInterval = setInterval(() => {
        moveSnake();
        checkCollision();
        draw();
    }, gameSpeedDelay);
}

// reset the state of the game
function resetGame() {
    updateHighScore();
    stopGame();
    snake = [{ x: 10, y: 10}];
    food = generateFoodPosition();
    snakeDirection = 'right';
    gameSpeedDelay = 200;
    updateScore();
}

// update and render the current score
function updateScore() {
    const currentScore = snake.length - 1;
    score.textContent = currentScore.toString().padStart(3, '0');
}

// end the game
function stopGame() {
    clearInterval(gameInterval);
    hasGameStarted = false;
    instructionText.style.display = 'block';
    gameLogo.style.display = 'block';
}

// update the high score once the game has been finished
function updateHighScore() {
    const currentScore = snake.length - 1;
    if(currentScore > highScore) {
        highScore = currentScore;
        highScoreText.textContent = highScore.toString().padStart(3, '0');
    }
    highScoreText.style.display = 'block';
}


// Event Handling
function handleKeyPress(event) {
    if(
        (!hasGameStarted && event.code === 'Space') || 
        (!hasGameStarted && event.key === '')
    ) {
        initGame();
    } else {
        switch(event.key) {
            case 'ArrowUp':
                snakeDirection = 'up';
                break;
            case 'ArrowDown':
                snakeDirection = 'down';
                break;
            case 'ArrowLeft':
                snakeDirection = 'left';
                break;
            case 'ArrowRight':
                snakeDirection = 'right';
                break;
        }
    }
}

document.addEventListener('keydown', handleKeyPress);