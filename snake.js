// Initialize canvas and context
var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d");
var borderWidth = 5;

// Set initial game state
var snake = [{x: 10, y: 10}];
var cellSize = 0;
var direction = "right";
var food = {x: 0, y: 0};
var score = 0;
var speed = 100;
var paused = false;
var hasEaten = true; // new variable to keep track of whether the snake has eaten the apple

// Set up local storage
var highScore = 0;
if (localStorage.getItem("highScore")) {
  highScore = localStorage.getItem("highScore");
}

// Create start screen elements
var startScreen = document.createElement("div");
startScreen.innerHTML = "<h1>Snake Game</h1><button id='start-button'>Start</button><button id='high-score-button'>High Score</button>";
var startButton = startScreen.querySelector("#start-button");
var highScoreButton = startScreen.querySelector("#high-score-button");

// Create game over screen elements
var gameOverScreen = document.createElement("div");
gameOverScreen.innerHTML = "<h1>Game Over!</h1><p>Your score was <span id='game-over-score'></span></p><button id='replay-button'>Replay</button>";
var gameOverScore = gameOverScreen.querySelector("#game-over-score");
var replayButton = gameOverScreen.querySelector("#replay-button");

// Add start and game over screens to the page
startScreen.style.position = "absolute";
document.body.appendChild(startScreen);
gameOverScreen.style.position = "absolute";


// Resize the canvas and add a border
function resizeCanvas() {
  window.requestAnimationFrame(resizeCanvas);
  var newWidth = Math.floor(window.innerWidth * 0.9) - (borderWidth * 2);
  var newHeight = Math.floor(window.innerHeight * 0.9) - (borderWidth * 2);
  canvas.style.width = newWidth + "px";
  canvas.style.height = newHeight + "px";
  canvas.style.left = borderWidth + "px";
  canvas.style.top = borderWidth + "px";
  canvas.width = newWidth;
  canvas.height = newHeight;

  // Update cell size based on new canvas size
  cellSize = Math.min(Math.floor(canvas.width / 20), Math.floor(canvas.height / 20));

  // Redraw canvas with new cell size
  draw();

  // Add a border to the canvas
  canvas.style.border = borderWidth + "px solid black";

  // Reposition start screen in center of canvas
  startScreen.style.left = (canvas.width - startScreen.offsetWidth) / 2 + "px";
  startScreen.style.top = (canvas.height - startScreen.offsetHeight) / 2 + "px";
}
// Draw the snake, food, and score on the canvas
function draw() {
  ctx.clearRect(0,0, canvas.width, canvas.height);
  ctx.fillStyle = "green";
  snake.forEach(function(segment) {
    ctx.fillRect((segment.x * cellSize) + borderWidth, (segment.y * cellSize) + borderWidth, cellSize - (borderWidth * 2), cellSize - (borderWidth * 2));
  });
  ctx.fillStyle = "red";
  ctx.fillRect((food.x * cellSize) + borderWidth, (food.y * cellSize) + borderWidth, cellSize - (borderWidth * 2), cellSize - (borderWidth * 2));
  ctx.fillStyle = "black";
  ctx.font = Math.floor(cellSize * 0.8) + "px Arial";
  ctx.fillText("Score: " + score, cellSize, cellSize * 1.5);
  displayHighScore();
}

// Update the game state
function update() {
  // Draw the snake, food, and score on the canvas
  draw();

  // Generate food after drawing
  generateFood();

  if (paused) {
    setTimeout(update, speed);
    return;
  }

  var head = {x: snake[0].x, y: snake[0].y};
  switch (direction) {
    case "up":
      head.y -= 1;
      break;
    case "down":
      head.y += 1;
      break;
    case "left":
      head.x -= 1;
      break;
    case "right":
      head.x += 1;
      break;
  }

  // Check for collisions with the canvas border or with the snake's body
  if (head.x < 0 || head.x >= Math.floor(canvas.width / cellSize) || head.y < 0 || head.y >= Math.floor(canvas.height / cellSize) || snake.some(segment => segment.x === head.x && segment.y === head.y)) {
    gameOver();
    return;
  }

  // Check for collision with food
  if (head.x === food.x && head.y === food.y) {
    score += 10;
    speed *= 0.95;
    generateFood();
  } else {
    snake.pop();
  }

  // Move the snake
  snake.unshift(head);

  // Draw the updated game state and set the next update
  draw();
  setTimeout(update, speed);
}
  
  // Generate a new food item at a random position on the canvas
  function generateFood() {
    if (snake.some(segment => segment.x === food.x && segment.y === food.y)) {
      // If the snake has eaten the previous apple, generate a new one
      var x = Math.floor(Math.random() * Math.floor(canvas.width / cellSize));
      var y = Math.floor(Math.random() * Math.floor(canvas.height / cellSize));
      food = {x: x, y: y};
    }
  }
  
  // End the game and show the game over screen
  function gameOver() {
    // Hide the canvas and show the game over screen
    canvas.style.display = "none";
    gameOverScore.textContent = score;
    document.body.appendChild(gameOverScreen);
  
    // Save the high score to local storage
    if (score > highScore) {
      localStorage.setItem("highScore", score);
    }
  }
  
  function startNewGame() {
    // Reset game state
    snake = [{x: 10, y: 10}];
    direction = "right";
    score = 0;
    speed = 100;
    paused = false;
  
    // Reset canvas and display
    resizeCanvas();
    canvas.style.display = "block";
  
    // Remove start screen and game over screen if they are visible
    if (startScreen.parentNode) {
      startScreen.parentNode.removeChild(startScreen);
    }
    if (gameOverScreen.parentNode) {
      gameOverScreen.parentNode.removeChild(gameOverScreen);
    }
  
    // Check for high score and save to local storage
    if (score > highScore) {
      highScore = score;
      localStorage.setItem("highScore", score);
    }
  
    // Start the game loop
    generateFood();
    update();
  }
  
  
  // Display the high score on the canvas
  function displayHighScore() {
    ctx.fillStyle = "black";
    ctx.font = Math.floor(cellSize * 0.8) + "px Arial";
    ctx.fillText("High Score: " + highScore, cellSize, cellSize * 3);
  }
  
  // Event listeners
  window.addEventListener("resize", resizeCanvas);
  
  document.addEventListener("keydown", function(event) {
    switch (event.key) {
      case "ArrowUp":
        if (direction != "down") {
          direction = "up";
        }
        break;
      case "ArrowDown":
        if (direction != "up") {
          direction = "down";
        }
        break;
      case "ArrowLeft":
        if (direction != "right") {
          direction = "left";
        }
        break;
      case "ArrowRight":
        if (direction != "left") {
          direction = "right";
        }
        break;
      case " ":
        paused = !paused;
        if (!paused) {
          update();
        }
        break;
    }
  });
  
  startButton.addEventListener("click", startNewGame);
  
  highScoreButton.addEventListener("click", function() {
    alert("High Score: " + highScore);
  });
  
  replayButton.addEventListener("click", startNewGame);
  
  // Start the game by showing the start screen
  startScreen.style.display = "block";
    
  