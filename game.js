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
const canvas = document.getElementById("map");
const ctx = canvas.getContext("2d");

function renderMap() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  gameState.commanders.forEach(cmd => {
    ctx.beginPath();
    ctx.arc(cmd.position.x, cmd.position.y, 8, 0, Math.PI * 2);
    ctx.fillStyle =
      gameState.selectedCommander === cmd ? "#38bdf8" : "#94a3b8";
    ctx.fill();
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
