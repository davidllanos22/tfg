<script setup>
import { Avatar, AvatarLandmarks, DefaultColors } from "@/core/avatar";
import { Drawing } from "@/core/drawing";
import { MathUtils } from "@/core/mathUtils";
import { ref, onMounted, onUnmounted, inject } from 'vue';

let settings = inject("settings");

let props = defineProps({
  avatar: Avatar,
  landmarks: null,
  static: Boolean,
  edit: Boolean
});

let faceCanvas; 
let clothesCanvas; 
let hairCanvas; 
let partsCanvas;

function updateColors(){
  let replaceColors = Object.keys(DefaultColors).filter((value, i)=>i >0).map((color)=>{
    return [DefaultColors[color], props.avatar.colors[color]]
  });

  Drawing.createImageCanvas("face.png", replaceColors, (cvs)=>faceCanvas = cvs);
  Drawing.createImageCanvas("clothes.png", replaceColors, (cvs)=>clothesCanvas = cvs);
  Drawing.createImageCanvas("hair.png", replaceColors, (cvs)=>hairCanvas = cvs);
  Drawing.createImageCanvas("parts.png", replaceColors, (cvs)=>partsCanvas = cvs);
}

updateColors();

onMounted(() => {
  draw();
});

onUnmounted(() => {

});

function draw(){
  let cvs = document.querySelector(".cvs-" + props.avatar.id);

  if(!cvs) return;

  if(cvs.style.width == ""){
    cvs.style.width = "200px";
    cvs.style.height = "200px";
  }

  let ctx = cvs.getContext('2d');

  ctx.save();
  ctx.imageSmoothingEnabled = false;

  Drawing.clearCanvas(ctx, cvs.width, cvs.height, props.avatar.colors.background || "#26282B");

  if(props.edit) updateColors();

  if(!faceCanvas || !clothesCanvas || !hairCanvas || !partsCanvas){
    requestAnimationFrame(draw.bind(this));
    return;
  }

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

  Drawing.drawSpriteSheet(ctx, clothesCanvas, x - 7, y + 56, props.avatar.clothes.index, 0, 80, 36, false, 0);

  ctx.restore();
  
  ctx.save()
  ctx.translate(centerX , centerY);
  ctx.rotate(rotationZ);
  ctx.scale(3, 3);

  //ctx.rotate(10)

  Drawing.drawSpriteSheet(ctx, faceCanvas, x - 8, y - 8, props.avatar.face.index, 0, 80, 80, false, 0);

  ctx.save();
  ctx.translate(rotationY * 3, rotationX * 6);

  let rightEyebrowOffset = getRightEyebrowOffset();

  // Draw right eyebrow
  Drawing.drawSpriteSheet(ctx, partsCanvas, x + 12, y + 16 - rightEyebrowOffset, props.avatar.eyebrows.index, 0, 16, 16, false, 0);

  // Draw right eye 
  let rightEye = getRightEye();
  Drawing.drawSpriteSheet(ctx, partsCanvas, x + 12, y + 23, props.avatar.eyes.index, rightEye, 16, 16, false, 0);

  let leftEyebrowOffset = getLeftEyebrowOffset();

  // Draw left eyebrow
  Drawing.drawSpriteSheet(ctx, partsCanvas, x + 52, y + 16 - leftEyebrowOffset, props.avatar.eyebrows.index, 0, 16, 16, true, 0);

  // Draw left eye
  let leftEye = getLeftEye();
  Drawing.drawSpriteSheet(ctx, partsCanvas, x + 52, y + 23, props.avatar.eyes.index, leftEye, 16, 16, true, 0);

  // Draw nose
  Drawing.drawSpriteSheet(ctx, partsCanvas, x + 24, y + 34, props.avatar.nose.index, 1, 16, 16, false, 0);

  // Draw mouth
  let mouth = getMouth();
  Drawing.drawSpriteSheet(ctx, partsCanvas, x + 24, y + 44, props.avatar.mouth.index, mouth, 16, 16, false, 0);

  ctx.restore();

  Drawing.drawSpriteSheet(ctx, hairCanvas, x - 8, y - 33, props.avatar.hair.index, 0, 80, 120, false, 0);

  //ctx.drawImage(hairCanvas, x, y - 20);

  ctx.restore();

  ctx.restore();

  if(!props.static) requestAnimationFrame(draw.bind(this));
}

function getLandmark(index){
  return props.landmarks ? props.landmarks[index] : null;
}

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

function getLeftEye(){
  let leftEyeTop = getLandmark(387);
  let leftEyeBottom = getLandmark(373);

  if(leftEyeTop == null || leftEyeBottom == null) return 4;

  let leftEyeDistance = MathUtils.distance(leftEyeTop, leftEyeBottom);

  if(leftEyeDistance < 0.01) return 2;
  else if(leftEyeDistance < 0.02) return 3;
  else return 4;
}

function getRightEye(){
  let rightEyeTop = getLandmark(160);
  let rightEyeBottom = getLandmark(144);

  if(rightEyeTop == null || rightEyeBottom == null) return 4;

  let rightEyeDistance = MathUtils.distance(rightEyeTop, rightEyeBottom);

  if(rightEyeDistance < 0.01) return 2;
  else if(rightEyeDistance < 0.02) return 3;
  else return 4;
}

function getMouth(){
  let mouthTop = getLandmark(0);
  let mouthLeft = getLandmark(291);
  let mouthRight = getLandmark(61);
  let mouthBottom = getLandmark(17);

  if(mouthTop == null || mouthLeft == null || mouthRight == null || mouthBottom == null) return 5;

  let mouthDistance = MathUtils.distance(mouthTop, mouthBottom);

  if(mouthDistance < 0.1) return 5;
  else if(mouthDistance < 0.15) return 6;
  else return 7;
}

</script>

<template>
  <canvas :class="'cvs-' + avatar.id" width="400" height="400" style="image-rendering: pixelated;"></canvas>
</template>