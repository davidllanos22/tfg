<script setup>
import { Avatar, AvatarLandmarks } from "@/core/avatar";
import { Drawing } from "@/core/drawing";
import { MathUtils } from "@/core/mathUtils";
import { ref, onMounted, onUnmounted } from 'vue';

//TODO: cargar todas las imágenes
const faceImage = Drawing.createImage("face.png");
const bodyImage = Drawing.createImage("body.png");
const hairImage = Drawing.createImage("hair.png");
const partsImage = Drawing.createImage("parts.png");

let mirrorEnabled = false;

let props = defineProps({
  avatar: Avatar,
  landmarks: null
});

onMounted(() => {
  draw();
});

onUnmounted(() => {

});

function draw(){
  let cvs = document.querySelector(".cvs-" + props.avatar.name);
  cvs.style.width = "200px";
  cvs.style.height = "200px";

  if(!cvs) return;
  
  let ctx = cvs.getContext('2d');

  ctx.save();
  ctx.imageSmoothingEnabled = false;

  Drawing.clearCanvas(ctx, cvs.width, cvs.height, props.avatar.backgroundColor || "#26282B");

  if(mirrorEnabled){
    ctx.translate(cvs.width, 1);
    ctx.scale(-1, 1);
  }

  let centerX = cvs.width / 2;
  let centerY = cvs.height / 2;
  
  // let top = getLandmark(10);
  // let bottom = getLandmark(152); 
  // let left = getLandmark(454);
  // let right = getLandmark(234);

  let rotationX = getHeadRotationX();
  let rotationY = getHeadRotationY();
  let rotationZ = getHeadRotationZ();

  let width = 64;//distance(left, right); // TODO: distancia entre el punto izquierdo(454) y derecho(234) para saber el ancho
  let height = 64;//distance(top, bottom); // TODO: distancia entre el punto superior(10) e inferior(152) para saber el alto
  
  let x = - width / 2;
  let y = - height / 2 - 20;

  
  ctx.save();
  ctx.translate(centerX , centerY);
  ctx.scale(3, 3);

  ctx.drawImage(bodyImage, x - 7, y + 56);

  ctx.restore();
  
  ctx.save()
  ctx.translate(centerX , centerY);
  ctx.rotate(rotationZ);
  ctx.scale(3, 3);

  //ctx.rotate(10)

  ctx.drawImage(faceImage, x, y);


  //let faceHeight = MathUtils.distance(top, bottom);
  
  // Distancia entre punto superior e inferior para tomar como referencia de tamaño
  // Distancia entre parpado superior e inferior, si es más pequeño que threshold está cerrado
  
  let leftEyeClosed = isLeftEyeClosed();
  let rightEyeClosed = isRightEyeClosed();

  ctx.save();
  ctx.translate(rotationY * -3, rotationX * 3);

  // right eyebrow
  Drawing.drawSpriteSheet(ctx, partsImage, x + 12, y + 16, 0, 0, false, 0);
  // right eye opened
  if(!rightEyeClosed) Drawing.drawSpriteSheet(ctx, partsImage, x + 12, y + 23, 1, 0, false, 0);
  // right eye closed
  if(rightEyeClosed) Drawing.drawSpriteSheet(ctx, partsImage, x + 12, y + 23, 0, 1, false, 0);

  // left eyebrow
  Drawing.drawSpriteSheet(ctx, partsImage, x + 52, y + 16, 0, 0, true, 0);
  // left eye opened
  if(!leftEyeClosed) Drawing.drawSpriteSheet(ctx, partsImage, x + 52, y + 23, 1, 0, true, 0);
  // left eye closed
  if(leftEyeClosed) Drawing.drawSpriteSheet(ctx, partsImage, x + 52, y + 23, 0, 1, true, 0);

  // nose
  Drawing.drawSpriteSheet(ctx, partsImage, x + 24, y + 34, 2, 0, false, 0);
  // mouth
  Drawing.drawSpriteSheet(ctx, partsImage, x + 24, y + 44, 3, 0, false, 0);

  ctx.restore();

  ctx.drawImage(hairImage, x, y - 20);

  ctx.restore();

  ctx.restore();


  requestAnimationFrame(draw.bind(this));
}

function getLandmark(index){
  return props.landmarks ? props.landmarks[index] : null;
}

// La rotación en Y es un offset entre el punto de la nariz y los puntos superior e inferior
function getHeadRotationX(){
  let nose = getLandmark(1);
  let top = getLandmark(10);
  let bottom = getLandmark(152);

  if(nose == null || top == null || bottom == null) return 0;

  let distanceTop = MathUtils.distance(nose, top);
  let distanceBottom = MathUtils.distance(nose, bottom);

  let diff = Math.abs(distanceTop - distanceBottom);
  let threshold = 0.07;

  if(diff < threshold) return 0;
  else if(distanceBottom > distanceTop) return -1;
  else if(distanceTop > distanceBottom) return 1;
}

function getHeadRotationZ(){
  let top = getLandmark(10);
  let bottom = getLandmark(152);

  if(top == null || bottom == null) return 0;

  return Math.atan2(bottom.y - top.y, bottom.x - top.x) - (90 * Math.PI / 180);
}

// La rotación en Y es un offset entre el punto de la nariz y los puntos laterales
function getHeadRotationY(){
  let nose = getLandmark(1);
  let left = getLandmark(454);
  let right = getLandmark(234);

  if(nose == null || left == null || right == null) return 0;

  let distanceLeft = MathUtils.distance(nose, left);
  let distanceRight = MathUtils.distance(nose, right);

  let diff = Math.abs(distanceLeft - distanceRight);
  console.log(diff)
  let threshold = 0.07;

  if(diff < threshold) return 0;
  else if(distanceRight > distanceLeft) return -1;
  else if(distanceLeft > distanceRight) return 1;
}

function isLeftEyeClosed(){
  let rightEyeTop = getLandmark(387);
  let rightEyeBottom = getLandmark(373);

  if(rightEyeTop == null || rightEyeBottom == null) return false;

  let rightEyeDistance = MathUtils.distance(rightEyeTop, rightEyeBottom);
  return rightEyeDistance < 0.01;
}

function isRightEyeClosed(){
  let leftEyeTop = getLandmark(160);
  let leftEyeBottom = getLandmark(144);

  if(leftEyeTop == null || leftEyeBottom == null) return false;

  let leftEyeDistance = MathUtils.distance(leftEyeTop, leftEyeBottom);
  return leftEyeDistance < 0.01;
}

</script>

<template>
  <span>{{avatar.name}}</span>
  <br>
  <canvas :class="'cvs-' + avatar.name" width="400" height="400"></canvas>
  <br>
</template>