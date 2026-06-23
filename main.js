import * as THREE from "https://unpkg.com/three@0.160.0/build/three.module.js";

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

// ===== ライト =====

const ambient =
new THREE.AmbientLight(
  0xffffff,
  1
);

scene.add(ambient);

const sun =
new THREE.DirectionalLight(
  0xffffff,
  2
);

sun.position.set(
  100,
  200,
  100
);

scene.add(sun);

// ===== 地面 =====

const ground =
new THREE.Mesh(

new THREE.PlaneGeometry(
  3000,
  3000
),

new THREE.MeshLambertMaterial({
  color:0x71c75a
})

);

ground.rotation.x =
-Math.PI/2;

scene.add(ground);

// ===== 道路 =====

function road(x,z,w,h){

const r =
new THREE.Mesh(

new THREE.BoxGeometry(
w,
1,
h
),

new THREE.MeshLambertMaterial({
color:0x777777
})

);

r.position.set(
x,
0.5,
z
);

scene.add(r);

}

road(0,0,3000,200);
road(0,800,3000,200);
road(0,-800,3000,200);

road(800,0,200,3000);
road(-800,0,200,3000);

// ===== 建物 =====

function building(x,z,w,h,height){

const b =
new THREE.Mesh(

new THREE.BoxGeometry(
w,
height,
h
),

new THREE.MeshLambertMaterial({
color:0xc9a06d
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

const walls=[];

building(
500,
300,
250,
250,
120
);

building(
-600,
-200,
300,
300,
150
);

building(
800,
900,
300,
200,
180
);

building(
-1000,
800,
350,
250,
160
);

// ===== 草むら =====

const bushes=[];

function bush(x,z,w,h){

const b =
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

bush(
300,
1000,
300,
250
);

bush(
-800,
-700,
250,
250
);

// ===== プレイヤー =====

const player =
new THREE.Mesh(

new THREE.CylinderGeometry(
25,
25,
60,
24
),

new THREE.MeshLambertMaterial({
color:0x2196f3
})

);

player.position.set(
0,
30,
0
);

scene.add(player);

// ===== 敵 =====

const enemies=[];

for(let i=0;i<5;i++){

const enemy =
new THREE.Mesh(

new THREE.CylinderGeometry(
25,
25,
60,
24
),

new THREE.MeshLambertMaterial({
color:0xf44336
})

);

enemy.position.set(
(Math.random()-0.5)*2000,
30,
(Math.random()-0.5)*2000
);

scene.add(enemy);

enemies.push(enemy);

}

// ===== HP =====

let hp=500;

const hpUI =
document.getElementById("hp");

// ===== 移動 =====

let moveX=0;
let moveY=0;

let aimX=0;
let aimY=0;

let leftTouch=null;
let rightTouch=null;
// ===== 弾 =====

const bullets=[];

function shootBullet(dx,dz,enemy=false,startObj=null){

const geo=
new THREE.SphereGeometry(8,12,12);

const mat=
new THREE.MeshLambertMaterial({
color:enemy?0xff4444:0xffff00
});

const bullet=
new THREE.Mesh(geo,mat);

if(enemy){

bullet.position.copy(
startObj.position
);

}else{

bullet.position.copy(
player.position
);

}

const len=Math.hypot(dx,dz);

bullet.userData={
vx:(dx/len)*12,
vz:(dz/len)*12,
enemy
};

scene.add(bullet);
bullets.push(bullet);

}

// ===== スーパー =====

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

// ===== 左スティック =====

const leftZone=
document.getElementById("leftZone");

const moveBase=
document.getElementById("moveBase");

const moveKnob=
document.getElementById("moveKnob");

leftZone.addEventListener("touchstart",(e)=>{

if(leftTouch!==null)return;

leftTouch=
e.changedTouches[0].identifier;

moveBase.style.display="block";

moveBase.style.left=
(e.changedTouches[0].clientX-60)
+"px";

moveBase.style.top=
(e.changedTouches[0].clientY-60)
+"px";

});

leftZone.addEventListener("touchmove",(e)=>{

for(const t of e.changedTouches){

if(t.identifier!==leftTouch)
continue;

const rect=
moveBase.getBoundingClientRect();

let x=
t.clientX-(rect.left+60);

let y=
t.clientY-(rect.top+60);

const d=
Math.hypot(x,y);

if(d>40){

x=x/d*40;
y=y/d*40;

}

moveKnob.style.left=
(x+40)+"px";

moveKnob.style.top=
(y+40)+"px";

moveX=x/40;
moveY=y/40;

}

});

leftZone.addEventListener("touchend",(e)=>{

for(const t of e.changedTouches){

if(t.identifier!==leftTouch)
continue;

leftTouch=null;

moveX=0;
moveY=0;

moveBase.style.display="none";

}

});

// ===== 右スティック =====

const rightZone=
document.getElementById("rightZone");

const aimBase=
document.getElementById("aimBase");

const aimKnob=
document.getElementById("aimKnob");

rightZone.addEventListener("touchstart",(e)=>{

if(rightTouch!==null)return;

rightTouch=
e.changedTouches[0].identifier;

aimBase.style.display="block";

aimBase.style.left=
(e.changedTouches[0].clientX-60)
+"px";

aimBase.style.top=
(e.changedTouches[0].clientY-60)
+"px";

});

rightZone.addEventListener("touchmove",(e)=>{

for(const t of e.changedTouches){

if(t.identifier!==rightTouch)
continue;

const rect=
aimBase.getBoundingClientRect();

let x=
t.clientX-(rect.left+60);

let y=
t.clientY-(rect.top+60);

const d=
Math.hypot(x,y);

if(d>40){

x=x/d*40;
y=y/d*40;

}

aimKnob.style.left=
(x+40)+"px";

aimKnob.style.top=
(y+40)+"px";

aimX=x;
aimY=y;

}

});

rightZone.addEventListener("touchend",(e)=>{

for(const t of e.changedTouches){

if(t.identifier!==rightTouch)
continue;

if(
Math.hypot(aimX,aimY)>5
){

shootBullet(
aimX,
aimY
);

}

rightTouch=null;

aimX=0;
aimY=0;

aimBase.style.display="none";

}

});

// ===== ゲームループ =====

function animate(){

requestAnimationFrame(
animate
);

// プレイヤー移動

player.position.x+=
moveX*5;

player.position.z+=
moveY*5;

// カメラ追従

camera.position.x=
player.position.x;

camera.position.y=
350;

camera.position.z=
player.position.z+250;

camera.lookAt(
player.position.x,
0,
player.position.z
);

// 草むら

let hidden=false;

bushes.forEach(b=>{

const dx=
player.position.x-
b.position.x;

const dz=
player.position.z-
b.position.z;

if(
Math.abs(dx)<150 &&
Math.abs(dz)<120
){

hidden=true;

}

});

player.material.opacity=
hidden?0.4:1;

player.material.transparent=true;

// 敵AI

enemies.forEach(enemy=>{

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

if(dist<220){

enemy.position.x-=
(dx/dist)*1.5;

enemy.position.z-=
(dz/dist)*1.5;

}

if(
Math.random()<0.003
){

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

const b=
bullets[i];

b.position.x+=
b.userData.vx;

b.position.z+=
b.userData.vz;

// 壁判定

let hitWall=false;

walls.forEach(w=>{

const dx=
Math.abs(
b.position.x-
w.position.x
);

const dz=
Math.abs(
b.position.z-
w.position.z
);

if(
dx<w.scale.x*50+20 &&
dz<w.scale.z*50+20
){

hitWall=true;

}

});

if(hitWall){

scene.remove(b);
bullets.splice(i,1);
continue;

}

// プレイヤー被弾

if(b.userData.enemy){

const dist=
player.position.distanceTo(
b.position
);

if(dist<35){

hp-=20;

hpUI.textContent=hp;

scene.remove(b);
bullets.splice(i,1);

}

}else{

// 敵被弾

enemies.forEach(enemy=>{

const dist=
enemy.position.distanceTo(
b.position
);

if(dist<35){

enemy.position.x+=
(Math.random()-0.5)*100;

enemy.position.z+=
(Math.random()-0.5)*100;

scene.remove(b);

}

});

}

}

renderer.render(
scene,
camera
);

}

animate();

// リサイズ

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

});
