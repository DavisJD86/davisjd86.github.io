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

// Resize the canvas and add a border
function resizeCanvas() {
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
}

// Start the game
function startGame() {
  resizeCanvas();
  generateFood();
  draw();
  update();
}

// Draw the snake, food, and score on the canvas
function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
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

  if (head.x < 0 || head.x >= Math.floor(canvas.width / cellSize) || head.y < 0 || head.y >= Math.floor(canvas.height / cellSize)) {
    gameOver();
    return;
  }
  for (var i = 1; i < snake.length; i++) {
    if (head.x == snake[i].x && head.y == snake[i].y) {
      gameOver();
      return;
    }
  }
  if (head.x == food.x && head.y == food.y) {
    score += 10;
    speed -= 2;
    if (speed < 50) speed = 50;
    generateFood();
    snake.unshift(head);
  } else {
    snake.unshift(head);
    snake.pop();
  }

  draw();
  setTimeout(update, speed);
}

// Generate a new food item at a random position on the canvas
function generateFood() {
var x = Math.floor(Math.random() * Math.floor(canvas.width / cellSize));
var y = Math.floor(Math.random() * Math.floor(canvas.height / cellSize));
food = {x: x, y: y};
}

// End the game and show the start screen with a replay button
function gameOver() {
// Hide the canvas
canvas.style.display = "none";

// Display the start screen
var startScreen = document.createElement("div");
startScreen.innerHTML = "<h1>Game Over!</h1><p>Your score was " + score + "</p><button id='replay-button'>Replay</button>";
document.body.appendChild(startScreen);

// Reset the game state when the replay button is clicked
var replayButton = document.getElementById("replay-button");
replayButton.addEventListener("click", function() {
canvas.style.display = "block";
startScreen.remove();
snake = [{x: 10, y: 10}];
score = 0;
speed = 100;
direction = "right";
generateFood();
draw();
update();
});

// Save the high score to local storage
var highScore = localStorage.getItem("highScore");
if (highScore === null || score > highScore) {
localStorage.setItem("highScore", score);
}

// Display the high score on the canvas
displayHighScore();
}

// Display the high score on the canvas
function displayHighScore() {
var highScore = localStorage.getItem("highScore");
if (highScore !== null) {
ctx.fillStyle = "black";
ctx.font = Math.floor(cellSize * 0.8) + "px Arial";
ctx.fillText("High Score: " + highScore, cellSize, cellSize * 3);
}
}

// Add event listeners
window.addEventListener("resize", resizeCanvas);
document.addEventListener("keydown", function(event) {
  switch (event.key) {
    case "ArrowUp":
      if (direction != "down") direction = "up";
      break;
    case "ArrowDown":
      if (direction != "up") direction = "down";
      break;
    case "ArrowLeft":
      if (direction != "right") direction = "left";
      break;
    case "ArrowRight":
      if (direction != "left") direction = "right";
      break;
    case " ":
      paused = !paused;
      if (!paused) {
        update();
      }
      break;
  }
});


// Start the game
startGame();
