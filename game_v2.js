// === ENGINE SIGNATURE ===
console.log("GAME ENGINE v2 — BUILD SYSTEM ACTIVE");

// === CANVAS SETUP ===
const canvas = document.getElementById("map");
const ctx = canvas.getContext("2d");
canvas.style.touchAction = "none";

// === RESIZE ===
function resize() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight - 80;
}
resize();
window.addEventListener("resize", resize);

// === CAMERA ===
const camera = { x: 0, y: 0 };

// === PAN STATE ===
let isDragging = false;
let lastX = 0;
let lastY = 0;

// === TOUCH PAN ===
canvas.addEventListener(
  "touchstart",
  (e) => {
    e.preventDefault();
    isDragging = true;
    lastX = e.touches[0].clientX;
    lastY = e.touches[0].clientY;
  },
  { passive: false }
);

canvas.addEventListener(
  "touchmove",
  (e) => {
    e.preventDefault();
    if (!isDragging) return;

    const x = e.touches[0].clientX;
    const y = e.touches[0].clientY;

    camera.x += lastX - x;
    camera.y += lastY - y;

    lastX = x;
    lastY = y;
  },
  { passive: false }
);

canvas.addEventListener("touchend", () => {
  isDragging = false;
});

// === WORLD / SCREEN TRANSFORM ===
function worldToScreen(x, y) {
  return {
    x: x - camera.x + canvas.width / 2,
    y: y - camera.y + canvas.height / 2,
  };
}

function screenToWorld(x, y) {
  return {
    x: x + camera.x - canvas.width / 2,
    y: y + camera.y - canvas.height / 2,
  };
}

// === GRID ===
const GRID = 80;
function snap(v) {
  return Math.round(v / GRID) * GRID;
}

// === HOVER CELL ===
let hoverCell = null;

canvas.addEventListener(
  "touchmove",
  (e) => {
    const t = e.touches[0];
    const w = screenToWorld(t.clientX, t.clientY);
    hoverCell = {
      x: snap(w.x),
      y: snap(w.y),
    };
  },
  { passive: true }
);

// === BUILDINGS DATA ===
const buildings = [
  { type: "TOWN_HALL", x: 0, y: 0 },
];

// === PLACE BUILDING ===
function placeBuilding(type) {
  if (!hoverCell) return;
  buildings.push({
    type,
    x: hoverCell.x,
    y: hoverCell.y,
  });
}

// === LONG PRESS ===
let pressTimer = null;

canvas.addEventListener("touchstart", () => {
  pressTimer = setTimeout(() => {
    placeBuilding("FARM");
  }, 450);
});

canvas.addEventListener("touchend", () => {
  clearTimeout(pressTimer);
});

// === DRAW GRID ===
function drawGrid() {
  ctx.strokeStyle = "rgba(255,255,255,0.05)";

  for (let x = -3000; x <= 3000; x += GRID) {
    const a = worldToScreen(x, -3000);
    const b = worldToScreen(x, 3000);
    ctx.beginPath();
    ctx.moveTo(a.x, a.y);
    ctx.lineTo(b.x, b.y);
    ctx.stroke();
  }

  for (let y = -3000; y <= 3000; y += GRID) {
    const a = worldToScreen(-3000, y);
    const b = worldToScreen(3000, y);
    ctx.beginPath();
    ctx.moveTo(a.x, a.y);
    ctx.lineTo(b.x, b.y);
    ctx.stroke();
  }
}

// === DRAW HOVER CELL ===
function drawHover() {
  if (!hoverCell) return;
  const p = worldToScreen(hoverCell.x, hoverCell.y);
  ctx.fillStyle = "rgba(0,255,200,0.18)";
  ctx.fillRect(p.x - GRID / 2, p.y - GRID / 2, GRID, GRID);
}

// === DRAW 3D BUILDING ===
function drawBuilding(b) {
  const p = worldToScreen(b.x, b.y);
  const s = 60;

  // Shadow
  ctx.fillStyle = "rgba(0,0,0,0.35)";
  ctx.beginPath();
  ctx.ellipse(p.x, p.y + s * 0.6, s * 0.7, s * 0.25, 0, 0, Math.PI * 2);
  ctx.fill();

  // Body
  ctx.fillStyle = b.type === "TOWN_HALL" ? "#0b82c4" : "#2e8b57";
  ctx.fillRect(p.x - s / 2, p.y - s / 2, s, s);

  // Side
  ctx.fillStyle = "rgba(0,0,0,0.25)";
  ctx.beginPath();
  ctx.moveTo(p.x + s / 2, p.y - s / 2);
  ctx.lineTo(p.x + s, p.y - s / 4);
  ctx.lineTo(p.x + s, p.y + s / 2);
  ctx.lineTo(p.x + s / 2, p.y + s / 2);
  ctx.closePath();
  ctx.fill();

  // Top
  ctx.fillStyle = "rgba(255,255,255,0.25)";
  ctx.beginPath();
  ctx.moveTo(p.x - s / 2, p.y - s / 2);
  ctx.lineTo(p.x, p.y - s);
  ctx.lineTo(p.x + s / 2, p.y - s / 2);
  ctx.lineTo(p.x, p.y - s / 4);
  ctx.closePath();
  ctx.fill();

  // Label
  ctx.fillStyle = "#ffffff";
  ctx.font = "12px Arial";
  ctx.textAlign = "center";
  ctx.fillText(b.type, p.x, p.y - s - 6);
}

// === MAIN LOOP ===
function loop() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawGrid();
  drawHover();
  buildings.forEach(drawBuilding);
  requestAnimationFrame(loop);
}

loop();
