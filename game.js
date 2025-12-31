// ======================
// CANVAS & CONTEXT
// ======================
const canvas = document.getElementById("map");
const ctx = canvas.getContext("2d");

// ======================
// GAME STATE
// ======================
const gameState = {
  commanders: [],
  selectedCommander: null
};

// ======================
// COMMANDERS (İSİMLER KESİN)
// ======================
const commanderNames = [
  "Murat",
  "Cansu",
  "Gökdeniz",
  "Can",
  "Aylin",
  "Şerife"
];

function createCommander(name) {
  return {
    name,
    level: 1
  };
}

gameState.commanders = commanderNames.map(createCommander);

// ======================
// UI: COMMANDER PANEL
// ======================
const commanderPanel = document.getElementById("commanders");

function renderCommanders() {
  commanderPanel.innerHTML = "";
  gameState.commanders.forEach(cmd => {
    const div = document.createElement("div");
    div.className = "commander";
    div.textContent = `${cmd.name} • Lv.${cmd.level}`;
    commanderPanel.appendChild(div);
  });
}

// ======================
// CITY & BUILDINGS
// ======================
const TILE_WIDTH = 64;
const TILE_HEIGHT = 32;

const city = {
  buildings: [
    { type: "TownHall", x: 4, y: 4, level: 2 },
    { type: "Farm", x: 2, y: 5, level: 1 },
    { type: "Barracks", x: 6, y: 5, level: 1 },
    { type: "Mine", x: 5, y: 2, level: 1 }
  ]
};

// ======================
// ISOMETRIC CONVERTER
// ======================
function isoToScreen(x, y) {
  return {
    x: (x - y) * TILE_WIDTH / 2 + canvas.width / 2,
    y: (x + y) * TILE_HEIGHT / 2 + 100
  };
}

// ======================
// DRAW BUILDING (FAKE 3D)
// ======================
function drawBuilding(b) {
  const pos = isoToScreen(b.x, b.y);
  const h = 28 + b.level * 14;

  // Shadow
  ctx.fillStyle = "rgba(0,0,0,0.3)";
  ctx.beginPath();
  ctx.ellipse(pos.x, pos.y + 18, 24, 8, 0, 0, Math.PI * 2);
  ctx.fill();

  // Top
  ctx.fillStyle = "#334155";
  ctx.beginPath();
  ctx.moveTo(pos.x, pos.y - h);
  ctx.lineTo(pos.x + 24, pos.y - h + 12);
  ctx.lineTo(pos.x, pos.y - h + 24);
  ctx.lineTo(pos.x - 24, pos.y - h + 12);
  ctx.closePath();
  ctx.fill();

  // Left
  ctx.fillStyle = "#1e293b";
  ctx.beginPath();
  ctx.moveTo(pos.x - 24, pos.y - h + 12);
  ctx.lineTo(pos.x, pos.y - h + 24);
  ctx.lineTo(pos.x, pos.y + 24);
  ctx.lineTo(pos.x - 24, pos.y + 12);
  ctx.closePath();
  ctx.fill();

  // Right
  ctx.fillStyle = "#0f172a";
  ctx.beginPath();
  ctx.moveTo(pos.x + 24, pos.y - h + 12);
  ctx.lineTo(pos.x, pos.y - h + 24);
  ctx.lineTo(pos.x, pos.y + 24);
  ctx.lineTo(pos.x + 24, pos.y + 12);
  ctx.closePath();
  ctx.fill();

  // Label
  ctx.fillStyle = "#e5e7eb";
  ctx.font = "11px system-ui";
  ctx.textAlign = "center";
  ctx.fillText(
    `${b.type} Lv.${b.level}`,
    pos.x,
    pos.y - h - 6
  );
}

// ======================
// RENDER CITY
// ======================
function renderCity() {
  city.buildings
    .sort((a, b) => (a.x + a.y) - (b.x + b.y))
    .forEach(drawBuilding);
}

// ======================
// MAIN RENDER
// ======================
function renderMap() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  renderCity();
}

// ======================
// GAME LOOP
// ======================
function loop() {
  renderMap();
  requestAnimationFrame(loop);
}

// ======================
// START
// ======================
renderCommanders();
loop();
