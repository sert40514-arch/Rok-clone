// ================= SETUP =================
const canvas = document.getElementById("map");
const ctx = canvas.getContext("2d");

function resize(){ canvas.width=window.innerWidth; canvas.height=window.innerHeight; }
resize();
window.addEventListener("resize", resize);
canvas.style.touchAction="none";

// ================= CAMERA =================
let camera={x:0,y:0};
let isDragging=false,lastX=0,lastY=0;

canvas.addEventListener("mousedown", e=>{ isDragging=true; lastX=e.clientX; lastY=e.clientY; });
window.addEventListener("mouseup", ()=>isDragging=false);
canvas.addEventListener("mousemove", e=>{ if(!isDragging)return; camera.x-=(e.clientX-lastX); camera.y-=(e.clientY-lastY); lastX=e.clientX; lastY=e.clientY; });
canvas.addEventListener("touchstart", e=>{ const t=e.touches[0]; isDragging=true; lastX=t.clientX; lastY=t.clientY; });
canvas.addEventListener("touchmove", e=>{ if(!isDragging)return; const t=e.touches[0]; camera.x-=(t.clientX-lastX); camera.y-=(t.clientY-lastY); lastX=t.clientX; lastY=t.clientY; });
canvas.addEventListener("touchend", ()=>isDragging=false);

// ================= GRID =================
const TILE=90;
function drawGrid(){
  ctx.strokeStyle="rgba(255,255,255,0.04)";
  for(let x=-3000;x<=3000;x+=TILE){ ctx.beginPath(); ctx.moveTo(x-camera.x,-3000-camera.y); ctx.lineTo(x-camera.x,3000-camera.y); ctx.stroke(); }
  for(let y=-3000;y<=3000;y+=TILE){ ctx.beginPath(); ctx.moveTo(-3000-camera.x,y-camera.y); ctx.lineTo(3000-camera.x,y-camera.y); ctx.stroke(); }
}

// ================= BUILDING CLASS =================
class Building3D{
  constructor(name,x,y,color,level=1){
    this.name=name; this.x=x; this.y=y; this.color=color; this.level=level;
    this.width=70; this.height=70;
  }
  draw(ctx,camera,selected=false){
    const x=this.x-camera.x;
    const y=this.y-camera.y;
    const w=this.width; const h=this.height;
    // Glow
    if(selected){ ctx.shadowColor="rgba(255,255,0,0.8)"; ctx.shadowBlur=20; } else { ctx.shadowBlur=0; }
    // Base
    ctx.fillStyle=this.color; ctx.fillRect(x,y,w,h);
    // Shadow walls
    ctx.fillStyle="rgba(0,0,0,0.25)";
    ctx.beginPath(); ctx.moveTo(x,y); ctx.lineTo(x-w*0.6,y-h*0.6); ctx.lineTo(x-w*0.6,y+h-h*0.6); ctx.lineTo(x,y+h); ctx.fill();
    ctx.fillStyle="rgba(255,255,255,0.25)";
    ctx.beginPath(); ctx.moveTo(x,y); ctx.lineTo(x+w,y); ctx.lineTo(x+w-w*0.6,y-h*0.6); ctx.lineTo(x-w*0.6,y-h*0.6); ctx.fill();
    ctx.shadowBlur=0;
    ctx.fillStyle="#fff"; ctx.font="13px Arial"; ctx.textAlign="center";
    ctx.fillText(`${this.name} Lv.${this.level}`,x+w/2,y-10);
  }
}

// ================= COMMANDER CLASS =================
class Commander3D{
  constructor(name,x,y,color="#fff"){
    this.name=name; this.x=x; this.y=y; this.color=color;
    this.target=null; this.speed=1+Math.random();
  }
  draw(ctx,camera){
    const size=20; const x=this.x-camera.x; const y=this.y-camera.y;
    ctx.fillStyle=this.color;
    ctx.beginPath();
    ctx.arc(x+size/2,y+size/2,size/2,0,Math.PI*2);
    ctx.fill();
    // Placeholder weapon: sword/arrow/shield
    ctx.strokeStyle="#fff"; ctx.beginPath(); ctx.moveTo(x+size/2,y+size/2); ctx.lineTo(x+size/2+5,y+size/2-10); ctx.stroke();
    ctx.fillStyle="#fff"; ctx.font="12px Arial"; ctx.textAlign="center";
    ctx.fillText(this.name,x+size/2,y-5);
  }
  move(buildings){
    if(!this.target){
      const b=buildings[Math.floor(Math.random()*buildings.length)];
      this.target={x:b.x+35,y:b.y+35};
    }
    const dx=this.target.x-this.x;
    const dy=this.target.y-this.y;
    const dist=Math.sqrt(dx*dx+dy*dy);
    if(dist<1){ this.target=null; return; }
    this.x+=dx/dist*this.speed;
    this.y+=dy/dist*this.speed;
  }
}

// ================= INIT BUILDINGS =================
const buildings=[];
let selectedBuilding=null;
const townHall=new Building3D("TOWN HALL",0,0,"#1ea7ff");
buildings.push(townHall);

const cityRing=[
  {name:"BARRACKS",dx:-TILE,dy:0,color:"#c0392b"},
  {name:"ARCHERY",dx:TILE,dy:0,color:"#e67e22"},
  {name:"FARM",dx:0,dy:-TILE,color:"#27ae60"},
  {name:"LUMBER",dx:0,dy:TILE,color:"#16a085"},
  {name:"QUARRY",dx:-TILE,dy:-TILE,color:"#7f8c8d"},
  {name:"GOLD",dx:TILE,dy:TILE,color:"#f1c40f"}
];
cityRing.forEach(b=>buildings.push(new Building3D(b.name,townHall.x+b.dx,townHall.y+b.dy,b.color)));

// ================= INIT COMMANDERS =================
const commanderNames=["Murat","Cansu","Gökdeniz","Can","Aylin","Şerife"];
const commanders=commanderNames.map((name,i)=>new Commander3D(name,townHall.x+Math.random()*200-100,townHall.y+Math.random()*200-100));

// ================= INFO PANEL =================
const panel=document.createElement("div");
panel.style.position="fixed"; panel.style.top="60px"; panel.style.right="16px";
panel.style.width="150px"; panel.style.padding="10px"; panel.style.background="rgba(0,0,0,0.7)";
panel.style.color="#fff"; panel.style.fontFamily="Arial"; panel.style.display="none";
panel.style.borderRadius="8px"; panel.style.zIndex=100;
document.body.appendChild(panel);

function updatePanel(){
  if(selectedBuilding){
    panel.style.display="block";
    panel.innerHTML=`
      <strong>${selectedBuilding.name}</strong><br>
      Level: ${selectedBuilding.level}<br>
      <button id="upgradeBtn">Upgrade</button>
    `;
    document.getElementById("upgradeBtn").onclick=()=>{ selectedBuilding.level+=1; };
  } else { panel.style.display="none"; }
}

// ================= CLICK =================
canvas.addEventListener("mousedown", e=>{
  selectedBuilding=buildings.find(b=>e.clientX>=b.x-camera.x && e.clientX<=b.x-camera.x+b.width && e.clientY>=b.y-camera.y && e.clientY<=b.y-camera.y+b.height)||null;
  updatePanel();
});

canvas.addEventListener("touchstart", e=>{
  const t=e.touches[0];
  selectedBuilding=buildings.find(b=>t.clientX>=b.x-camera.x && t.clientX<=b.x-camera.x+b.width && t.clientY>=b.y-camera.y && t.clientY<=b.y-camera.y+b.height)||null;
  updatePanel();
});

// ================= MAIN LOOP =================
function render(){
  ctx.clearRect(0,0,canvas.width,canvas.height);
  drawGrid();
  buildings.forEach(b=>b.draw(ctx,camera,b===selectedBuilding));
  commanders.forEach(c=>{ c.move(buildings); c.draw(ctx,camera); });
  requestAnimationFrame(render);
}
render();
