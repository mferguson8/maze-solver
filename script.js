const mazeDiv = document.querySelector(".maze");
const size = 10; // Change this to modify the maze size
let maze = [];
let solution = [];

// Initialize the maze with walls
function initMaze() {
  maze = new Array(size).fill(null).map(() => new Array(size).fill(1));
}

// Generate the maze using recursive backtracking algorithm
function generateMaze() {
  initMaze();
  mazeDiv.innerHTML = "";

  function recursiveBacktracking(x, y) {
    maze[y][x] = 0;
    const directions = [
      { dx: 2, dy: 0 },
      { dx: -2, dy: 0 },
      { dx: 0, dy: 2 },
      { dx: 0, dy: -2 },
    ];

    shuffleArray(directions);

    for (const dir of directions) {
      const newX = x + dir.dx;
      const newY = y + dir.dy;

      if (
        newX > 0 &&
        newX < size &&
        newY > 0 &&
        newY < size &&
        maze[newY][newX] === 1
      ) {
        maze[newY - dir.dy / 2][newX - dir.dx / 2] = 0;
        recursiveBacktracking(newX, newY);
      }
    }
  }

  // Ensure entrance and exit are clear
  maze[0][0] = 0;
  maze[size - 1][size - 1] = 0;
  recursiveBacktracking(1, 1);

  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const cell = document.createElement("div");
      cell.className = maze[y][x] ? "wall" : "path";
      mazeDiv.appendChild(cell);
    }
  }
}
// Solve the maze using depth-first search algorithm
function solveMaze() {
  solution = new Array(size).fill(null).map(() => new Array(size).fill(0));
  const directions = [
    { dx: 1, dy: 0 },
    { dx: -1, dy: 0 },
    { dx: 0, dy: 1 },
    { dx: 0, dy: -1 },
  ];

  function dfs(x, y) {
    if (
      x < 0 ||
      x >= size ||
      y < 0 ||
      y >= size ||
      maze[y][x] === 1 ||
      solution[y][x] === 1
    ) {
      return false;
    }

    solution[y][x] = 1;

    if (x === size - 2 && y === size - 2) {
      return true;
    }

    for (const dir of directions) {
      if (dfs(x + dir.dx, y + dir.dy)) {
        return true;
      }
    }

    solution[y][x] = 0;
    return false;
  }

  // Call dfs function to solve the maze
  dfs(1, 1);

  // Mark the correct path immediately
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      if (solution[y][x] === 1) {
        const index = y * size + x;
        mazeDiv.children[index].classList.add("solution");
      }
    }
  }
}
// Call dfs function to solve the maze
dfs(1, 1);

// Highlight the correct path with a delay for visualization
const pathElements = mazeDiv.querySelectorAll(".path");
const delay = 100; // Milliseconds between highlighting each step

function highlightPathStep(step) {
  if (step >= pathElements.length) {
    return;
  }

  const cell = pathElements[step];
  const x = step % size;
  const y = Math.floor(step / size);

  if (solution[y][x] === 1) {
    cell.classList.add("solution");
  }

  setTimeout(() => {
    highlightPathStep(step + 1);
  }, delay);
}

highlightPathStep(0);

// Utility function to shuffle an array
function shuffleArray(arr) {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
}
