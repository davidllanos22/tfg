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
  landmarks: null,
  hideBorder: Boolean
});

onMounted(() => {
  draw();
});

onUnmounted(() => {

});

function draw(){
  let cvs = document.querySelector(".cvs-" + props.avatar.name);

  if(!cvs) return;

  if(cvs.style.width == ""){
    cvs.style.width = "200px";
    cvs.style.height = "200px";
  }

  if(!props.hideBorder){
    let w = parseInt(cvs.style.width.replace("px", ""))
    cvs.style.borderRadius = (w / 2) + "px";
  }
  
  let ctx = cvs.getContext('2d');

  ctx.save();
  ctx.imageSmoothingEnabled = false;

  Drawing.clearCanvas(ctx, cvs.width, cvs.height, props.avatar.backgroundColor || "#26282B");

  if(settings.mirrorEnabled){
    ctx.translate(cvs.width, 1);
    ctx.scale(-1, 1);
  }

  let centerX = cvs.width / 2;
  let centerY = cvs.height - 121;
  
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
  ctx.translate(rotationY * 3, rotationX * 6);

  let rightEyebrowOffset = getRightEyebrowOffset();

  // Draw right eyebrow
  Drawing.drawSpriteSheet(ctx, partsImage, x + 12, y + 16 - rightEyebrowOffset, 1, 0, false, 0);

  // Draw right eye 
  let rightEye = getRightEye();
  Drawing.drawSpriteSheet(ctx, partsImage, x + 12, y + 23, 0, rightEye, false, 0);

  let leftEyebrowOffset = getLeftEyebrowOffset();

  // Draw left eyebrow
  Drawing.drawSpriteSheet(ctx, partsImage, x + 52, y + 16 - leftEyebrowOffset, 1, 0, true, 0);

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

  let value = 1.0 - (distanceBottom / distanceTop);

  return Math.max(-1.5, Math.min(1.5, value));
}

// La rotación en Y es un offset entre el punto de la nariz y los puntos laterales
function getHeadRotationY(){
  let nose = getLandmark(1);
  let left = getLandmark(454);
  let right = getLandmark(234);

  if(nose == null || left == null || right == null) return 0;

  let distanceLeft = MathUtils.distance(nose, left);
  let distanceRight = MathUtils.distance(nose, right);

  let value = 1.5 - (distanceLeft / distanceRight);

  return Math.max(-1.5, Math.min(1.5, value));
}

function getHeadRotationZ(){
  let top = getLandmark(10);
  let bottom = getLandmark(152);

  if(top == null || bottom == null) return 0;

  return Math.atan2(bottom.y - top.y, bottom.x - top.x) - (90 * Math.PI / 180);
}

function getRightEyebrowOffset(){
  let rightEyebrowMiddle = getLandmark(52);
  let rightEyeTop = getLandmark(160);

  if(rightEyebrowMiddle == null || rightEyeTop == null) return 0;

  let distance = MathUtils.distance(rightEyebrowMiddle, rightEyeTop);

  return Math.max(0, distance * 100 - 5);
}

function getLeftEyebrowOffset(){
  let leftEyebrowMiddle = getLandmark(282);
  let leftEyeTop = getLandmark(387);

  if(leftEyebrowMiddle == null || leftEyeTop == null) return 0;

  let distance = MathUtils.distance(leftEyebrowMiddle, leftEyeTop);

  return Math.max(0, distance * 100 - 5);
}

function isRightEyeClosed(){
  
}

function getLeftEye(){
  let leftEyeTop = getLandmark(387);
  let leftEyeBottom = getLandmark(373);

  if(leftEyeTop == null || leftEyeBottom == null) return 2;

  let leftEyeDistance = MathUtils.distance(leftEyeTop, leftEyeBottom);

  if(leftEyeDistance < 0.01) return 0;
  else if(leftEyeDistance < 0.02) return 1;
  else return 2;
}

function getRightEye(){
  let rightEyeTop = getLandmark(160);
  let rightEyeBottom = getLandmark(144);

  if(rightEyeTop == null || rightEyeBottom == null) return 2;

  let rightEyeDistance = MathUtils.distance(rightEyeTop, rightEyeBottom);

  if(rightEyeDistance < 0.01) return 0;
  else if(rightEyeDistance < 0.02) return 1;
  else return 2;
}

function getMouth(){
  let mouthTop = getLandmark(0);
  let mouthLeft = getLandmark(291);
  let mouthRight = getLandmark(61);
  let mouthBottom = getLandmark(17);

  if(mouthTop == null || mouthLeft == null || mouthRight == null || mouthBottom == null) return 0;

  let mouthDistance = MathUtils.distance(mouthTop, mouthBottom);

  // TODO: mirar apertura horizontal
  // TODO: mirar apertura vertical
  if(mouthDistance < 0.1) return 0;
  else if(mouthDistance < 0.15) return 1;
  else return 2;
}

</script>

<template>
  <canvas :class="'cvs-' + avatar.name" width="400" height="400" style="image-rendering: pixelated;"></canvas>
</template>