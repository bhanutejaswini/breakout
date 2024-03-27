const grid = document.querySelector(".grid");
const heading = document.querySelector(".heading");
const start = document.querySelector(".start");

const brickHeight = 20,
  brickWidth = 100,
  playerWidth = 100,
  playerHeight = 20,
  boardWidth = 800,
  boardHeight = 560,
  ballDiameter = 20;

const startPlayer = [20, 40],
  startBall = [55, 70];

let player,
  ball,
  bricks = [];

let currentPlayer = [...startPlayer],
  currentBall = [...startBall];

let x = 20,
  y = 380,
  xDirection = 2,
  yDirection = 2,
  score = 0;

let timerId;

class Brick {
  constructor(x, y) {
    this.bottomLeft = [x, y];
    this.bottomRight = [x + brickWidth, y];
    this.topLeft = [x, y + brickHeight];
    this.topRight = [x + brickWidth, y + brickHeight];
  }
}

function addBricks() {
  for (let i = 0; i < 28; i++) {
    if (i % 7 == 0) {
      x = 20;
      y += 30;
    }

    const currentBrick = new Brick(x, y);
    bricks.push(currentBrick);

    const brick = document.createElement("div");

    brick.style.bottom = currentBrick.bottomLeft[1] + "px";
    brick.style.left = currentBrick.bottomLeft[0] + "px";
    brick.classList.add("brick");
    grid.appendChild(brick);

    x += 110;
  }
}

function displayPlayer() {
  if (player) {
    player.style.bottom = currentPlayer[1] + "px";
    player.style.left = currentPlayer[0] + "px";
  }
}

function addPlayer() {
  player = document.createElement("div");
  player.classList.add("player");
  grid.appendChild(player);
  displayPlayer();
}

function movePlayer(e) {
  switch (e.key) {
    case "ArrowLeft":
      if (currentPlayer[0] - 20 > 0) {
        currentPlayer[0] -= 20;
        displayPlayer();
      }
      break;
    case "ArrowRight":
      if (currentPlayer[0] + playerWidth + 20 < boardWidth) {
        currentPlayer[0] += 20;
        displayPlayer();
      }
      break;
  }
}

function displayBall() {
  if (ball) {
    ball.style.bottom = currentBall[1] + "px";
    ball.style.left = currentBall[0] + "px";
  }
}

function addBall() {
  ball = document.createElement("div");
  ball.classList.add("ball");
  grid.appendChild(ball);
  displayBall();
}

function resetGame() {
  score = 0;
  x = 20;
  y = 380;
  xDirection = 2;
  yDirection = 2;
  bricks = [];
  currentPlayer = [...startPlayer];
  currentBall = [...startBall];
}

function clearGame() {
  clearInterval(timerId);
  document.removeEventListener("keydown", movePlayer);
  removeFromGrid();
  resetGame();
  start.innerHTML = "Play Again!!";
  start.classList.remove("hidden");
}

function checkForCollisions() {
  // check for player collisions
  if (
    currentBall[0] >= currentPlayer[0] &&
    currentBall[0] <= currentPlayer[0] + playerWidth &&
    currentBall[1] >= currentPlayer[1] &&
    currentBall[1] <= currentPlayer[1] + playerHeight
  ) {
    changeDirection();
  }

  // check for bricks collisions
  for (let i = 0; i < bricks.length; i++) {
    if (
      currentBall[0] + ballDiameter >= bricks[i].bottomLeft[0] &&
      currentBall[0] <= bricks[i].bottomRight[0] &&
      currentBall[1] + ballDiameter >= bricks[i].bottomLeft[1] &&
      currentBall[1] <= bricks[i].topLeft[1]
    ) {
      const allBricks = Array.from(document.getElementsByClassName("brick"));
      allBricks[i].classList.remove("brick");

      bricks.splice(i, 1);
      changeDirection();
      score++;
      if (bricks.length === 0) {
        heading.textContent = "You win";
        clearGame();
      }
    }
  }

  // check for wall collisions
  if (
    currentBall[0] <= 0 ||
    currentBall[0] + ballDiameter >= boardWidth ||
    currentBall[1] + ballDiameter >= boardHeight
  ) {
    changeDirection();
  }

  if (currentBall[1] <= 0) {
    heading.textContent = `You lose! Your score is ${score}`;
    clearGame();
  }
}

function changeDirection() {
  if (xDirection == 2 && yDirection == 2) {
    yDirection = -2;
  } else if (xDirection == -2 && yDirection == 2) {
    xDirection = 2;
  } else if (xDirection == 2 && yDirection == -2) {
    xDirection = -2;
  } else {
    yDirection = 2;
  }
}

function moveBall() {
  currentBall[0] += xDirection;
  currentBall[1] += yDirection;
  displayBall();
  checkForCollisions();
}

function removeFromGrid() {
  const allBricks = Array.from(document.getElementsByClassName("brick"));
  allBricks.forEach((brick) => {
    if (brick && brick.parentNode) brick.parentNode.removeChild(brick);
  });
  if (player) player.remove();
  if (ball) ball.remove();
}

function startGame() {
  start.classList.add("hidden");
  heading.innerHTML = "Breakout";
  addBricks();
  addPlayer();
  addBall();
  document.addEventListener("keydown", movePlayer);

  timerId = setInterval(moveBall, 20);
}

start.addEventListener("click", () => {
  startGame();
});
