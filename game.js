// --- GAME STATE ---
const gameState = {
  commanders: [],
  selectedCommander: null
};

// --- COMMANDER FACTORY ---
function createCommander(name) {
  return {
    name,
    level: 1,
    power: 100,
    position: {
      x: Math.random() * 780 + 10,
      y: Math.random() * 480 + 10
    }
  };
}

// --- INIT COMMANDERS (KESİNLİKLE OYUNDA GEÇECEK İSİMLER) ---
const commanderNames = [
  "Murat",
  "Cansu",
  "Gökdeniz",
  "Can",
  "Aylin",
  "Şerife"
];

gameState.commanders = commanderNames.map(createCommander);

// --- UI RENDER ---
const commanderPanel = document.getElementById("commanders");

function renderCommanders() {
  commanderPanel.innerHTML = "";
  gameState.commanders.forEach(cmd => {
    const div = document.createElement("div");
    div.className = "commander";
    div.textContent = `${cmd.name} • Lv.${cmd.level}`;
    div.onclick = () => gameState.selectedCommander = cmd;
    commanderPanel.appendChild(div);
  });
}

// --- MAP RENDER ---
function renderMap() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  renderCity();
}
  });
}

// --- GAME LOOP ---
function loop() {
  renderMap();
  requestAnimationFrame(loop);
}

// --- START ---
renderCommanders();
loop();
// --- CITY CONFIG ---
const TILE_WIDTH = 64;
const TILE_HEIGHT = 32;

const city = {
  buildings: [
    { type: "TownHall", x: 4, y: 4, level: 1 },
    { type: "Farm", x: 2, y: 5, level: 1 },
    { type: "Barracks", x: 6, y: 5, level: 1 },
    { type: "Mine", x: 5, y: 2, level: 1 }
  ]
};

// --- ISOMETRIC CONVERTER ---
function isoToScreen(x, y) {
  return {
    x: (x - y) * TILE_WIDTH / 2 + canvas.width / 2,
    y: (x + y) * TILE_HEIGHT / 2 + 120
  };
}

// --- BUILDING RENDER ---
function drawBuilding(building) {
  const pos = isoToScreen(building.x, building.y);
  const height = 30 + building.level * 12;

  // Shadow
  ctx.fillStyle = "rgba(0,0,0,0.25)";
  ctx.beginPath();
  ctx.ellipse(pos.x, pos.y + TILE_HEIGHT / 2, 22, 8, 0, 0, Math.PI * 2);
  ctx.fill();

  // Base
  ctx.fillStyle = "#1e293b";
  ctx.beginPath();
  ctx.moveTo(pos.x, pos.y - height);
  ctx.lineTo(pos.x + 22, pos.y - height + 12);
  ctx.lineTo(pos.x, pos.y - height + 24);
  ctx.lineTo(pos.x - 22, pos.y - height + 12);
  ctx.closePath();
  ctx.fill();

  // Front face
  ctx.fillStyle = "#334155";
  ctx.beginPath();
  ctx.moveTo(pos.x - 22, pos.y - height + 12);
  ctx.lineTo(pos.x, pos.y - height + 24);
  ctx.lineTo(pos.x, pos.y + 24);
  ctx.lineTo(pos.x - 22, pos.y + 12);
  ctx.closePath();
  ctx.fill();

  // Side face
  ctx.fillStyle = "#0f172a";
  ctx.beginPath();
  ctx.moveTo(pos.x + 22, pos.y - height + 12);
  ctx.lineTo(pos.x, pos.y - height + 24);
  ctx.lineTo(pos.x, pos.y + 24);
  ctx.lineTo(pos.x + 22, pos.y + 12);
  ctx.closePath();
  ctx.fill();

  // Label
  ctx.fillStyle = "#e5e7eb";
  ctx.font = "11px system-ui";
  ctx.textAlign = "center";
  ctx.fillText(
    `${building.type} Lv.${building.level}`,
    pos.x,
    pos.y - height - 6
  );
}

// --- CITY RENDER ---
function renderCity() {
  city.buildings
    .sort((a, b) => (a.x + a.y) - (b.x + b.y))
    .forEach(drawBuilding);
}
