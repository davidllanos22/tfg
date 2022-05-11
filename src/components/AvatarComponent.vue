<script setup>
import { Avatar, AvatarLandmarks } from "@/core/avatar";
import { Drawing } from "@/core/drawing";
import { MathUtils } from "@/core/mathUtils";
import { ref, onMounted, onUnmounted, inject } from 'vue';

//TODO: cargar todas las imágenes
const faceImage = Drawing.createImage("face.png");
const bodyImage = Drawing.createImage("body.png");
const hairImage = Drawing.createImage("hair.png");
const partsImage = Drawing.createImage("parts.png");

let settings = inject("settings");

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

  if(settings.mirrorEnabled){
    ctx.translate(cvs.width, 1);
    ctx.scale(-1, 1);
  }

  let centerX = cvs.width / 2;
  let centerY = cvs.height / 2;
  
  let rotationX = getHeadRotationX();
  let rotationY = getHeadRotationY();
  let rotationZ = getHeadRotationZ();

  let width = 64;
  let height = 64;
  
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

  ctx.save();
  ctx.translate(rotationY * 3, rotationX * 5);

  // Draw right eyebrow
  Drawing.drawSpriteSheet(ctx, partsImage, x + 12, y + 16, 1, 0, false, 0);

  // Draw right eye 
  let rightEye = getRightEye();
  Drawing.drawSpriteSheet(ctx, partsImage, x + 12, y + 23, 0, rightEye, false, 0);

  // Draw left eyebrow
  Drawing.drawSpriteSheet(ctx, partsImage, x + 52, y + 16, 1, 0, true, 0);

  // Draw left eye
  let leftEye = getLeftEye();
  Drawing.drawSpriteSheet(ctx, partsImage, x + 52, y + 23, 0, leftEye, true, 0);

  // Draw nose
  Drawing.drawSpriteSheet(ctx, partsImage, x + 24, y + 34, 2, 0, false, 0);

  // Draw mouth
  let mouth = getMouth();
  Drawing.drawSpriteSheet(ctx, partsImage, x + 24, y + 44, 3, mouth, false, 0);

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

  return Math.max(-1.5, Math.min(1.5, 1.5 - (distanceBottom / distanceTop)));

  // if(diff < threshold) return 0;
  // else if(distanceBottom > distanceTop) return -1;
  // else if(distanceTop > distanceBottom) return 1;
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
  let threshold = 0.07;

  return Math.max(-1.5, Math.min(1.5, 1.5 - (distanceLeft / distanceRight)));
  // if(diff < threshold) return 0;
  // else if(distanceRight > distanceLeft) return 1;
  // else if(distanceLeft > distanceRight) return -1;
}

function getHeadRotationZ(){
  let top = getLandmark(10);
  let bottom = getLandmark(152);

  if(top == null || bottom == null) return 0;

  return Math.atan2(bottom.y - top.y, bottom.x - top.x) - (90 * Math.PI / 180);
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

function getLeftEye(){
  let leftEyeClosed = isLeftEyeClosed();
  if(leftEyeClosed) return 0;
  else return 1;
}

function getRightEye(){
  let rightEyeClosed = isRightEyeClosed();
  if(rightEyeClosed) return 0;
  else return 1;
}

function getMouth(){
  return 0;
}

</script>

<template>
  <span>{{avatar.name}}</span>
  <br>
  <canvas :class="'cvs-' + avatar.name" width="400" height="400"></canvas>
  <br>
</template>