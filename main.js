// FULL 3D RISE OF KINGDOMS DEV PROTOTYPE

// Scene & Camera
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x0b1d2a);
const camera = new THREE.PerspectiveCamera(60, window.innerWidth/window.innerHeight, 0.1, 5000);
camera.position.set(300, 400, 400);

// Renderer
const renderer = new THREE.WebGLRenderer({antialias:true});
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.shadowMap.enabled = true;
document.body.appendChild(renderer.domElement);

// Controls
const controls = new THREE.OrbitControls(camera, renderer.domElement);
controls.target.set(0,0,0);
controls.update();

// Lights
scene.add(new THREE.AmbientLight(0xffffff, 0.6));
const directional = new THREE.DirectionalLight(0xffffff, 1);
directional.position.set(300,500,300);
directional.castShadow = true;
scene.add(directional);

// Floor
const floorGeo = new THREE.PlaneGeometry(2000,2000);
const floorMat = new THREE.MeshStandardMaterial({color:0x1e3b50});
const floor = new THREE.Mesh(floorGeo,floorMat);
floor.rotation.x = -Math.PI/2;
floor.receiveShadow = true;
scene.add(floor);

// Loader
const loader = new THREE.GLTFLoader();

// Buildings
const buildingsData=[
  {name:"TownHall", x:0, z:0, color:0x1ea7ff},
  {name:"Barracks", x:-120, z:0, color:0xc0392b},
  {name:"Archery", x:120, z:0, color:0xe67e22},
  {name:"Farm", x:0, z:-120, color:0x27ae60},
  {name:"Lumber", x:0, z:120, color:0x16a085},
  {name:"Quarry", x:-120, z:-120, color:0x7f8c8d},
  {name:"Gold", x:120, z:120, color:0xf1c40f},
];

const buildings = [];
buildingsData.forEach(b=>{
  const geo = new THREE.BoxGeometry(60,60,60);
  const mat = new THREE.MeshStandardMaterial({color:b.color});
  const mesh = new THREE.Mesh(geo,mat);
  mesh.position.set(b.x,30,b.z);
  mesh.name = b.name;
  mesh.castShadow = true;
  mesh.userData = {level:1};
  scene.add(mesh);
  buildings.push(mesh);
});

// Commanders
const commanderNames=["Murat","Cansu","Gökdeniz","Can","Aylin","Şerife"];
const commanders = [];
commanderNames.forEach(name=>{
  const geo = new THREE.CylinderGeometry(10,10,30,16);
  const mat = new THREE.MeshStandardMaterial({color:0xffffff});
  const mesh = new THREE.Mesh(geo, mat);
  mesh.position.set(Math.random()*200-100,15,Math.random()*200-100);
  mesh.castShadow = true;
  mesh.userData = {name:name, target:null, speed:1+Math.random()};
  scene.add(mesh);
  commanders.push(mesh);
});

// Info Panel
const panel = document.getElementById("infoPanel");

// Raycaster for selection
const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();
let selectedBuilding = null;

function onClick(event){
  mouse.x = (event.clientX / window.innerWidth)*2-1;
  mouse.y = -(event.clientY / window.innerHeight)*2+1;
  raycaster.setFromCamera(mouse, camera);
  const intersects = raycaster.intersectObjects(buildings);
  if(intersects.length>0){
    selectedBuilding = intersects[0].object;
    panel.style.display="block";
    panel.innerHTML=`<strong>${selectedBuilding.name}</strong><br>Level: ${selectedBuilding.userData.level}<br><button id="upgradeBtn">Upgrade</button>`;
    document.getElementById("upgradeBtn").onclick=()=>{ selectedBuilding.userData.level+=1; };
  } else {
    selectedBuilding = null;
    panel.style.display="none";
  }
}
window.addEventListener("click", onClick);

// Animate
function animate(){
  requestAnimationFrame(animate);
  // Move commanders
  commanders.forEach(c=>{
    if(!c.userData.target){
      const b = buildings[Math.floor(Math.random()*buildings.length)];
      c.userData.target = new THREE.Vector3(b.position.x,b.position.y,b.position.z);
    }
    const dir = new THREE.Vector3().subVectors(c.userData.target, c.position);
    if(dir.length()<1){ c.userData.target=null; return; }
    dir.normalize();
    c.position.add(dir.multiplyScalar(c.userData.speed));
  });
  renderer.render(scene,camera);
}
animate();

// Responsive
window.addEventListener("resize",()=>{ camera.aspect=window.innerWidth/window.innerHeight; camera.updateProjectionMatrix(); renderer.setSize(window.innerWidth, window.innerHeight); });

// TEST KÜP (kontrol)
const testGeo = new THREE.BoxGeometry(50,50,50);
const testMat = new THREE.MeshStandardMaterial({color:0xff0000});
const testCube = new THREE.Mesh(testGeo,testMat);
testCube.position.set(0,25,0);
scene.add(testCube);
