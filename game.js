// === CANVAS SETUP ===
const canvas = document.getElementById("map");
const ctx = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight - 80;

// === CAMERA ===
const camera = {
  x: 0,
  y: 0
};

// === TOUCH PAN SYSTEM ===
let isDragging = false;
let lastTouch = { x: 0, y: 0 };

canvas.addEventListener("touchstart", (e) => {
  isDragging = true;
  lastTouch.x = e.touches[0].clientX;
  lastTouch.y = e.touches[0].clientY;
});

canvas.addEventListener("touchmove", (e) => {
  if (!isDragging) return;

  const x = e.touches[0].clientX;
  const y = e.touches[0].clientY;

  const dx = x - lastTouch.x;
  const dy = y - lastTouch.y;

  camera.x -= dx;
  camera.y -= dy;

  lastTouch.x = x;
  lastTouch.y = y;
});

canvas.addEventListener("touchend", () => {
  isDragging = false;
});

// === WORLD TO SCREEN ===
function worldToScreen(x, y) {
  return {
    x: x - camera.x + canvas.width / 2,
    y: y - camera.y + canvas.height / 2
  };
}

// === GRID ===
function drawGrid() {
  const size = 80;
  ctx.strokeStyle = "rgba(255,255,255,0.05)";

  for (let x = -2000; x < 2000; x += size) {
    const p1 = worldToScreen(x, -2000);
    const p2 = worldToScreen(x, 2000);
    ctx.beginPath();
    ctx.moveTo(p1.x, p1.y);
    ctx.lineTo(p2.x, p2.y);
    ctx.stroke();
  }

  for (let y = -2000; y < 2000; y += size) {
    const p1 = worldToScreen(-2000, y);
    const p2 = worldToScreen(2000, y);
    ctx.beginPath();
    ctx.moveTo(p1.x, p1.y);
    ctx.lineTo(p2.x, p2.y);
    ctx.stroke();
  }
}

// === 3D TOWN HALL ===
const townHall = {
  x: 0,
  y: 0,
  size: 60
};

function drawTownHall() {
  const pos = worldToScreen(townHall.x, townHall.y);
  const s = townHall.size;

  // Shadow
  ctx.fillStyle = "rgba(0,0,0,0.4)";
  ctx.beginPath();
  ctx.ellipse(pos.x, pos.y + s / 2, s * 0.7, s * 0.3, 0, 0, Math.PI * 2);
  ctx.fill();

  // Front
  ctx.fillStyle = "#0a7db8";
  ctx.fillRect(pos.x - s / 2, pos.y - s / 2, s, s);

  // Side
  ctx.fillStyle = "#085f8f";
  ctx.beginPath();
  ctx.moveTo(pos.x + s / 2, pos.y - s / 2);
  ctx.lineTo(pos.x + s, pos.y - s / 4);
  ctx.lineTo(pos.x + s, pos.y + s / 2);
  ctx.lineTo(pos.x + s / 2, pos.y + s / 2);
  ctx.closePath();
  ctx.fill();

  // Top
  ctx.fillStyle = "#3bbcff";
  ctx.beginPath();
  ctx.moveTo(pos.x - s / 2, pos.y - s / 2);
  ctx.lineTo(pos.x, pos.y - s);
  ctx.lineTo(pos.x + s / 2, pos.y - s / 2);
  ctx.lineTo(pos.x, pos.y - s / 4);
  ctx.closePath();
  ctx.fill();

  // Text
  ctx.fillStyle = "#ffffff";
  ctx.font = "14px Arial";
  ctx.textAlign = "center";
  ctx.fillText("TOWN HALL", pos.x, pos.y - s);
}

// === MAIN LOOP ===
function loop() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  drawGrid();
  drawTownHall();

  requestAnimationFrame(loop);
}

loop();
