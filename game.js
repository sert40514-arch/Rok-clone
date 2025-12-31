// ======================
// CANVAS SETUP (ZORUNLU)
// ======================
const canvas = document.getElementById("map");
const ctx = canvas.getContext("2d");

// Canvas boyutunu ZORLA
canvas.width = window.innerWidth - 260;
canvas.height = window.innerHeight - 80;

// ======================
// DEBUG BACKGROUND
// ======================
function drawBackground() {
  ctx.fillStyle = "#020617";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Grid (görsel referans)
  ctx.strokeStyle = "rgba(255,255,255,0.05)";
  for (let x = 0; x < canvas.width; x += 50) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, canvas.height);
    ctx.stroke();
  }
  for (let y = 0; y < canvas.height; y += 50) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(canvas.width, y);
    ctx.stroke();
  }
}

// ======================
// FAKE 3D BUILDING (DEVASA)
// ======================
function drawTestBuilding() {
  const centerX = canvas.width / 2;
  const centerY = canvas.height / 2;
  const height = 140;

  // Shadow
  ctx.fillStyle = "rgba(0,0,0,0.4)";
  ctx.beginPath();
  ctx.ellipse(centerX, centerY + 80, 90, 30, 0, 0, Math.PI * 2);
  ctx.fill();

  // Top
  ctx.fillStyle = "#38bdf8";
  ctx.beginPath();
  ctx.moveTo(centerX, centerY - height);
  ctx.lineTo(centerX + 90, centerY - height + 45);
  ctx.lineTo(centerX, centerY - height + 90);
  ctx.lineTo(centerX - 90, centerY - height + 45);
  ctx.closePath();
  ctx.fill();

  // Left
  ctx.fillStyle = "#0284c7";
  ctx.beginPath();
  ctx.moveTo(centerX - 90, centerY - height + 45);
  ctx.lineTo(centerX, centerY - height + 90);
  ctx.lineTo(centerX, centerY + 90);
  ctx.lineTo(centerX - 90, centerY + 45);
  ctx.closePath();
  ctx.fill();

  // Right
  ctx.fillStyle = "#0369a1";
  ctx.beginPath();
  ctx.moveTo(centerX + 90, centerY - height + 45);
  ctx.lineTo(centerX, centerY - height + 90);
  ctx.lineTo(centerX, centerY + 90);
  ctx.lineTo(centerX + 90, centerY + 45);
  ctx.closePath();
  ctx.fill();

  // Label
  ctx.fillStyle = "#ffffff";
  ctx.font = "20px system-ui";
  ctx.textAlign = "center";
  ctx.fillText("TOWN HALL", centerX, centerY - height - 20);
}

// ======================
// RENDER LOOP
// ======================
function loop() {
  drawBackground();
  drawTestBuilding();
  requestAnimationFrame(loop);
}

loop();
