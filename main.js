import * as THREE from "https://unpkg.com/three@0.160.0/build/three.module.js";

// ====================
// 基本設定
// ====================

const scene = new THREE.Scene();
scene.background = new THREE.Color(0x87ceeb);

const camera = new THREE.PerspectiveCamera(
75,
window.innerWidth/window.innerHeight,
0.1,
5000
);

const renderer = new THREE.WebGLRenderer({
antialias:true
});

renderer.setSize(
window.innerWidth,
window.innerHeight
);

document
.getElementById("game")
.appendChild(renderer.domElement);

// ====================
// ライト
// ====================

const ambient =
new THREE.AmbientLight(
0xffffff,
1.4
);

scene.add(ambient);

const sun =
new THREE.DirectionalLight(
0xffffff,
2
);

sun.position.set(
500,
800,
500
);

scene.add(sun);

// ====================
// 地面
// ====================

const ground =
new THREE.Mesh(

new THREE.PlaneGeometry(
4000,
4000
),

new THREE.MeshLambertMaterial({
color:0x79c95a
})

);

ground.rotation.x=
-Math.PI/2;

scene.add(ground);

// ====================
// 配列
// ====================

const walls=[];
const bushes=[];
const enemies=[];
const bullets=[];
const cubes=[];
const boxes=[];

// ====================
// 道路
// ====================

function road(x,z,w,h){

const r=
new THREE.Mesh(

new THREE.BoxGeometry(
w,
2,
h
),

new THREE.MeshLambertMaterial({
color:0x666666
})

);

r.position.set(
x,
1,
z
);

scene.add(r);

}

for(let i=-1500;i<=1500;i+=500){

road(
0,
i,
4000,
150
);

road(
i,
0,
150,
4000
);

}

// ====================
// 建物
// ====================

function building(
x,
z,
w,
h,
height
){

const b=
new THREE.Mesh(

new THREE.BoxGeometry(
w,
height,
h
),

new THREE.MeshLambertMaterial({
color:0xc69c6d
})

);

b.position.set(
x,
height/2,
z
);

scene.add(b);

walls.push(b);

}

for(let i=0;i<35;i++){

building(

(Math.random()-0.5)*3200,

(Math.random()-0.5)*3200,

150+Math.random()*150,

150+Math.random()*150,

100+Math.random()*250

);

}

// ====================
// 草むら
// ====================

function bush(x,z,w,h){

const b=
new THREE.Mesh(

new THREE.BoxGeometry(
w,
20,
h
),

new THREE.MeshLambertMaterial({
color:0x1f7d2e
})

);

b.position.set(
x,
10,
z
);

scene.add(b);

bushes.push(b);

}

for(let i=0;i<15;i++){

bush(

(Math.random()-0.5)*3200,

(Math.random()-0.5)*3200,

220,

220

);

}

// ====================
// 公園
// ====================

for(let i=0;i<30;i++){

const tree=
new THREE.Mesh(

new THREE.CylinderGeometry(
10,
10,
50
),

new THREE.MeshLambertMaterial({
color:0x6b4f2a
})

);

tree.position.set(

(Math.random()-0.5)*3000,

25,

(Math.random()-0.5)*3000

);

scene.add(tree);

const leaves=
new THREE.Mesh(

new THREE.SphereGeometry(
35,
12,
12
),

new THREE.MeshLambertMaterial({
color:0x2e8b57
})

);

leaves.position.set(
tree.position.x,
70,
tree.position.z
);

scene.add(leaves);

}

// ====================
// プレイヤー画像
// ====================

const loader =
new THREE.TextureLoader();

const textures={

front:loader.load(
"images/player/player_front.png"
),

back:loader.load(
"images/player/player_back.png"
),

left:loader.load(
"images/player/player_left.png"
),

right:loader.load(
"images/player/player_right.png"
),

attack1:loader.load(
"images/player/player_attack1.png"
),

attack2:loader.load(
"images/player/player_attack2.png"
),

attack3:loader.load(
"images/player/player_attack3.png"
)

};

const playerMaterial=
new THREE.SpriteMaterial({

map:textures.front,
transparent:true

});

const player=
new THREE.Sprite(
playerMaterial
);

player.scale.set(
180,
180,
1
);

player.position.set(
0,
70,
0
);

scene.add(player);

// ====================
// エイム線
// ====================

const aimMaterial=
new THREE.LineBasicMaterial({

color:0xffffff,
transparent:true,
opacity:0.5

});

const aimPoints=[
new THREE.Vector3(),
new THREE.Vector3()
];

const aimGeometry=
new THREE.BufferGeometry()
.setFromPoints(
aimPoints
);

const aimLine=
new THREE.Line(
aimGeometry,
aimMaterial
);

scene.add(
aimLine
);

// ====================
// 敵
// ====================

for(let i=0;i<9;i++){

const enemy=
new THREE.Mesh(

new THREE.CylinderGeometry(
30,
30,
60,
20
),

new THREE.MeshLambertMaterial({
color:0xf44336
})

);

enemy.position.set(

(Math.random()-0.5)*2800,

30,

(Math.random()-0.5)*2800

);

enemy.hp=300;

scene.add(enemy);

enemies.push(enemy);

}

// ====================
// ステータス
// ====================

let hp=500;
let power=0;
let alivePlayers=10;

document.getElementById(
"playersLeft"
).innerHTML=
alivePlayers;

// ====================
// 入力
// ====================

let moveX=0;
let moveY=0;

let aimX=0;
let aimY=0;

let leftTouch=null;
let rightTouch=null;
// ====================
// ボックス
// ====================

for(let i=0;i<10;i++){

const box=
new THREE.Mesh(

new THREE.BoxGeometry(
60,60,60
),

new THREE.MeshLambertMaterial({
color:0xc98b3c
})

);

box.position.set(
(Math.random()-0.5)*2500,
30,
(Math.random()-0.5)*2500
);

box.hp=200;

scene.add(box);
boxes.push(box);

}

// ====================
// パワーキューブ
// ====================

function spawnCube(x,z){

const cube=
new THREE.Mesh(

new THREE.BoxGeometry(
30,30,30
),

new THREE.MeshLambertMaterial({
color:0x00ff66
})

);

cube.position.set(
x,
20,
z
);

scene.add(cube);
cubes.push(cube);

}

// ====================
// 弾
// ====================

function shootBullet(dx,dz,enemy=false,owner=null){

if(!enemy){

player.material.map=
textures.attack1;

player.material.needsUpdate=true;

setTimeout(()=>{

player.material.map=
textures.attack2;

player.material.needsUpdate=true;

},60);

setTimeout(()=>{

player.material.map=
textures.attack3;

player.material.needsUpdate=true;

},120);

setTimeout(()=>{

player.material.map=
textures.front;

player.material.needsUpdate=true;

},180);

}

const bullet=
new THREE.Mesh(

new THREE.SphereGeometry(
8,10,10
),

new THREE.MeshLambertMaterial({
color:enemy?0xff5555:0xffff00
})

);

if(owner){

bullet.position.copy(
owner.position
);

}else{

bullet.position.copy(
player.position
);

}

const len=
Math.hypot(dx,dz);

bullet.userData={

vx:(dx/len)*12,
vz:(dz/len)*12,
enemy

};

scene.add(bullet);

bullets.push(bullet);

}

// ====================
// スーパー
// ====================

document
.getElementById("superBtn")
.addEventListener("click",()=>{

for(let i=-2;i<=2;i++){

const angle=
Math.atan2(
aimY,
aimX
)+i*0.25;

shootBullet(
Math.cos(angle)*100,
Math.sin(angle)*100
);

}

});

// ====================
// PLAY
// ====================

document
.getElementById("playBtn")
.onclick=()=>{

document
.getElementById("menu")
.style.display="none";

};

// ====================
// 左スティック
// ====================

const leftZone=
document.getElementById("leftZone");

const moveBase=
document.getElementById("moveBase");

const moveKnob=
document.getElementById("moveKnob");

leftZone.addEventListener(
"touchstart",
e=>{

if(leftTouch!==null)return;

const t=
e.changedTouches[0];

leftTouch=t.identifier;

moveBase.style.display="block";

moveBase.style.left=
(t.clientX-65)+"px";

moveBase.style.top=
(t.clientY-65)+"px";

}
);

leftZone.addEventListener(
"touchmove",
e=>{

for(const t of e.changedTouches){

if(
t.identifier!==leftTouch
) continue;

const rect=
moveBase.getBoundingClientRect();

let x=
t.clientX-
(rect.left+65);

let y=
t.clientY-
(rect.top+65);

const d=
Math.hypot(x,y);

if(d>45){

x=x/d*45;
y=y/d*45;

}

moveKnob.style.left=
(x+45)+"px";

moveKnob.style.top=
(y+45)+"px";

moveX=x/45;
moveY=y/45;

}

}
);

leftZone.addEventListener(
"touchend",
e=>{

for(const t of e.changedTouches){

if(
t.identifier!==leftTouch
) continue;

leftTouch=null;

moveX=0;
moveY=0;

moveBase.style.display=
"none";

}

}
);

// ====================
// 右スティック
// ====================

const rightZone=
document.getElementById("rightZone");

const aimBase=
document.getElementById("aimBase");

const aimKnob=
document.getElementById("aimKnob");

rightZone.addEventListener(
"touchstart",
e=>{

if(rightTouch!==null)return;

const t=
e.changedTouches[0];

rightTouch=t.identifier;

aimBase.style.display="block";

aimBase.style.left=
(t.clientX-65)+"px";

aimBase.style.top=
(t.clientY-65)+"px";

}
);

rightZone.addEventListener(
"touchmove",
e=>{

for(const t of e.changedTouches){

if(
t.identifier!==rightTouch
) continue;

const rect=
aimBase.getBoundingClientRect();

let x=
t.clientX-
(rect.left+65);

let y=
t.clientY-
(rect.top+65);

const d=
Math.hypot(x,y);

if(d>45){

x=x/d*45;
y=y/d*45;

}

aimKnob.style.left=
(x+45)+"px";

aimKnob.style.top=
(y+45)+"px";

aimX=x;
aimY=y;

}

}
);

rightZone.addEventListener(
"touchend",
e=>{

for(const t of e.changedTouches){

if(
t.identifier!==rightTouch
) continue;

if(
Math.hypot(
aimX,
aimY
)>5
){

shootBullet(
aimX,
aimY
);

}

rightTouch=null;

aimX=0;
aimY=0;

aimBase.style.display=
"none";

}

}
);

// ====================
// 毒ガス
// ====================

let gasRadius=1800;

// ====================
// ゲームループ
// ====================

function animate(){

requestAnimationFrame(
animate
);

// プレイヤー移動

player.position.x+=
moveX*3;

player.position.z+=
moveY*3;
if(Math.abs(moveX)>Math.abs(moveY)){

if(moveX>0){

player.material.map=
textures.right;

}else if(moveX<0){

player.material.map=
textures.left;

}

}else{

if(moveY>0){

player.material.map=
textures.front;

}else if(moveY<0){

player.material.map=
textures.back;

}

}

player.material.needsUpdate=true;
// カメラ

camera.position.set(
player.position.x,
320,
player.position.z+240
);

camera.lookAt(
player.position.x,
0,
player.position.z
);

// 草むら

let hidden=false;

bushes.forEach(b=>{

if(
Math.abs(
player.position.x-b.position.x
)<120 &&
Math.abs(
player.position.z-b.position.z
)<120
){

hidden=true;

}

});

player.material.opacity=
hidden?0.45:1;

// エイム線

if(
Math.hypot(
aimX,
aimY
)>1
){

const len=
Math.hypot(
aimX,
aimY
);

aimPoints[0].set(
player.position.x,
60,
player.position.z
);

aimPoints[1].set(
player.position.x+
(aimX/len)*300,
60,
player.position.z+
(aimY/len)*300
);

aimGeometry.setFromPoints(
aimPoints
);

aimLine.visible=true;

}else{

aimLine.visible=false;

}

// 敵AI

enemies.forEach(enemy=>{

if(enemy.hp<=0)return;

const dx=
player.position.x-
enemy.position.x;

const dz=
player.position.z-
enemy.position.z;

const dist=
Math.hypot(dx,dz);

if(dist>350){

enemy.position.x+=
(dx/dist)*1.2;

enemy.position.z+=
(dz/dist)*1.2;

}

if(dist<180){

enemy.position.x-=
(dx/dist)*1.4;

enemy.position.z-=
(dz/dist)*1.4;

}

if(Math.random()<0.003){

shootBullet(
dx,
dz,
true,
enemy
);

}

});

// 弾

for(let i=bullets.length-1;i>=0;i--){

const b=bullets[i];

b.position.x+=
b.userData.vx;

b.position.z+=
b.userData.vz;

if(

Math.abs(b.position.x)>2200 ||
Math.abs(b.position.z)>2200

){

scene.remove(b);
bullets.splice(i,1);
continue;

}

}

gasRadius-=0.05;

if(hp<=0){

document
.getElementById("defeat")
.style.display="flex";

}

if(alivePlayers<=1){

document
.getElementById("victory")
.style.display="flex";

}

document
.getElementById("hp")
.innerHTML=
Math.floor(hp);

renderer.render(
scene,
camera
);

}

animate();

// ====================
// リサイズ
// ====================

window.addEventListener(
"resize",
()=>{

camera.aspect=
window.innerWidth/
window.innerHeight;

camera.updateProjectionMatrix();

renderer.setSize(
window.innerWidth,
window.innerHeight
);

}
);
