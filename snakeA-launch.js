// Initialize canvas and context
var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d");

// Set initial game state
var snake = [{x: 10, y: 10}];
var cellSize = Math.min(Math.floor(canvas.width / 20), Math.floor(canvas.height / 20));
var direction = "right";
var food = {x: 0, y: 0};
var score = 0;
var speed = 100;

function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  // Update cell size based on new canvas size
  cellSize = Math.min(Math.floor(canvas.width / 20), Math.floor(canvas.height / 20));

  // Redraw canvas with new cell size
  draw();
}

window.addEventListener("resize", resizeCanvas);
resizeCanvas();

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  ctx.fillStyle = "green";
  snake.forEach(function(segment) {
    ctx.fillRect(segment.x * cellSize, segment.y * cellSize, cellSize, cellSize);
  });

  ctx.fillStyle = "red";
  ctx.fillRect(food.x * cellSize, food.y *cellSize, cellSize, cellSize);

  ctx.fillStyle = "black";
  ctx.font = Math.floor(cellSize * 0.8) + "px Arial";
  ctx.fillText("Score: " + score, cellSize, cellSize * 1.5);
  }
  
  function update() {
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
  if (head.x == snake[i].x&& head.y == snake[i].y) {
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
  
  function generateFood() {
  var x = Math.floor(Math.random() * Math.floor(canvas.width / cellSize));
  var y = Math.floor(Math.random() * Math.floor(canvas.height / cellSize));
  food = {x: x, y: y};
  }
  
  function gameOver() {
  alert("Game over! Your score was " + score);
  snake = [{x: 10, y: 10}];
  score = 0;
  speed = 100;
  direction = "right";
  generateFood();
  draw();
  }
  
  generateFood();
  draw();
  update();
  
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
}
});
