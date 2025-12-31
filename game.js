// ================= SETUP =================
const canvas = document.getElementById("map");
const ctx = canvas.getContext("2d");

function resize() { canvas.width = window.innerWidth; canvas.height = window.innerHeight; }
resize();
window.addEventListener("resize", resize);
canvas.style.touchAction = "none";

// ================= CAMERA =================
let camera = { x: 0, y: 0 };
let isDragging = false;
let lastX = 0;
let lastY = 0;

// ================= PAN =================
canvas.addEventListener("mousedown", e => { isDragging = true; lastX = e.clientX; lastY = e.clientY; });
window.addEventListener("mouseup", () => isDragging = false);
canvas.addEventListener("mousemove", e => {
  if(!isDragging) return;
  camera.x -= e.clientX - lastX; camera.y -= e.clientY - lastY;
  lastX = e.clientX; lastY = e.clientY;
});
canvas.addEventListener("touchstart", e => { const t = e.touches[0]; isDragging=true; lastX=t.clientX; lastY=t.clientY; });
canvas.addEventListener("touchmove", e => { if(!isDragging) return; const t=e.touches[0]; camera.x-=t.clientX-lastX; camera.y-=t.clientY-lastY; lastX=t.clientX; lastY=t.clientY; });
canvas.addEventListener("touchend", () => isDragging=false);

// ================= GRID =================
const TILE=90;
function drawGrid(){
  ctx.strokeStyle="rgba(255,255,255,0.04)";
  for(let x=-3000;x<=3000;x+=TILE){ctx.beginPath();ctx.moveTo(x-camera.x,-3000-camera.y);ctx.lineTo(x-camera.x,3000-camera.y);ctx.stroke();}
  for(let y=-3000;y<=3000;y+=TILE){ctx.beginPath();ctx.moveTo(-3000-camera.x,y-camera.y);ctx.lineTo(3000-camera.x,y-camera.y);ctx.stroke();}
}

// ================= BUILDINGS =================
const buildings=[];
let selectedBuilding=null;

// Town Hall
const townHall={name:"TOWN HALL",x:0,y:0,color:"#1ea7ff",level:1};
buildings.push(townHall);

// City layout
const cityRing=[
  {name:"BARRACKS",dx:-TILE,dy:0,color:"#c0392b"},
  {name:"ARCHERY",dx:TILE,dy:0,color:"#e67e22"},
  {name:"FARM",dx:0,dy:-TILE,color:"#27ae60"},
  {name:"LUMBER",dx:0,dy:TILE,color:"#16a085"},
  {name:"QUARRY",dx:-TILE,dy:-TILE,color:"#7f8c8d"},
  {name:"GOLD",dx:TILE,dy:TILE,color:"#f1c40f"}
];
cityRing.forEach(b=>{buildings.push({name:b.name,x:townHall.x+b.dx,y:townHall.y+b.dy,color:b.color,level:1});});

// ================= DRAW BUILDING =================
function drawBuilding(b){
  const size=70,h=size*0.6,x=b.x-camera.x,y=b.y-camera.y;

  if(b===selectedBuilding){ctx.shadowColor="rgba(255,255,0,0.7)";ctx.shadowBlur=20;} else {ctx.shadowBlur=0;}
  ctx.fillStyle=b.color; ctx.fillRect(x,y,size,size);

  // left shadow
  ctx.fillStyle="rgba(0,0,0,0.25)";
  ctx.beginPath();ctx.moveTo(x,y);ctx.lineTo(x-h,y-h);ctx.lineTo(x-h,y+size-h);ctx.lineTo(x,y+size);ctx.fill();
  // top
  ctx.fillStyle="rgba(255,255,255,0.25)";
  ctx.beginPath();ctx.moveTo(x,y);ctx.lineTo(x+size,y);ctx.lineTo(x+size-h,y-h);ctx.lineTo(x-h,y-h);ctx.fill();

  ctx.shadowBlur=0;
  ctx.fillStyle="#fff"; ctx.font="13px Arial"; ctx.textAlign="center";
  ctx.fillText(`${b.name} Lv.${b.level}`,x+size/2,y-10);
}

// ================= GET BUILDING AT =================
function getBuildingAt(x,y){
  return buildings.find(b=>x>=b.x-camera.x && x<=b.x-camera.x+70 && y>=b.y-camera.y && y<=b.y-camera.y+70);
}

// ================= INFO PANEL =================
const panel=document.createElement("div");
panel.style.position="fixed";
panel.style.top="60px";
panel.style.right="16px";
panel.style.width="150px";
panel.style.padding="10px";
panel.style.background="rgba(0,0,0,0.7)";
panel.style.color="#fff";
panel.style.fontFamily="Arial";
panel.style.display="none";
panel.style.borderRadius="8px";
panel.style.zIndex=100;
document.body.appendChild(panel);

function updatePanel(){
  if(selectedBuilding){
    panel.style.display="block";
    panel.innerHTML=`
      <strong>${selectedBuilding.name}</strong><br>
      Level: ${selectedBuilding.level}<br>
      <button id="upgradeBtn">Upgrade</button>
    `;
    document.getElementById("upgradeBtn").onclick=()=>{selectedBuilding.level+=1;};
  } else { panel.style.display="none"; }
}

// ================= CLICK =================
canvas.addEventListener("mousedown", e=>{
  const b=getBuildingAt(e.clientX,e.clientY);
  selectedBuilding=b||null;
  updatePanel();
});

canvas.addEventListener("touchstart", e=>{
  const t=e.touches[0];
  const b=getBuildingAt(t.clientX,t.clientY);
  selectedBuilding=b||null;
  updatePanel();
});

// ================= MAIN LOOP =================
function render(){
  ctx.clearRect(0,0,canvas.width,canvas.height);
  drawGrid();
  buildings.forEach(drawBuilding);
  requestAnimationFrame(render);
}
render();
