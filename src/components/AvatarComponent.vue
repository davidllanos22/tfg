<script setup>
import { Avatar, AvatarLandmarks } from "@/core/avatar";
import { Drawing } from "@/core/drawing";
import { MathUtils } from "@/core/mathUtils";
import { ref, onMounted, onUnmounted } from 'vue'

//TODO: cargar todas las imágenes
const faceImage = Drawing.createImage("face.png");
const bodyImage = Drawing.createImage("body.png");
const hairImage = Drawing.createImage("hair.png");
const partsImage = Drawing.createImage("parts.png");

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
  let cvs = document.querySelector(".cvs");

  if(!cvs) return;
  
  let ctx = cvs.getContext('2d');

  ctx.save();
  ctx.imageSmoothingEnabled = false;

  Drawing.clearCanvas(ctx, cvs.width, cvs.height, "#26282B");

  ctx.translate(cvs.width, 1);

  ctx.scale(-1, 1);
  //ctx.drawImage(results.image, 0, 0, cvs.width, cvs.height);

  if(props.landmarks.length == 0){
    ctx.restore();
    requestAnimationFrame(draw.bind(this));
    return;
  }

  let centerX = cvs.width / 2;
  let centerY = cvs.height / 2;

  // drawVideoCanvas(videoCanvas, results.image, landmarks);

  
  let top = getLandmark(10);
  let bottom = getLandmark(152); 
  let left = getLandmark(454);
  let right = getLandmark(234);

  let angle = Math.atan2(bottom.y - top.y, bottom.x - top.x) - (90 * Math.PI / 180); // TODO: ángulo entre el punto superior(10) e inferior(152) para saber la rotación
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
  ctx.rotate(angle);
  ctx.scale(3, 3);

  //ctx.rotate(10)
  

  ctx.drawImage(faceImage, x, y);

  let leftEyeTop = getLandmark(387);
  let leftEyeBottom = getLandmark(373);

  let rightEyeTop = getLandmark(160);
  let rightEyeBottom = getLandmark(144);

  let faceHeight = MathUtils.distance(top, bottom);
  let leftEyeDistance = MathUtils.distance(leftEyeTop, leftEyeBottom);
  let rightEyeDistance = MathUtils.distance(rightEyeTop, rightEyeBottom);

  //console.log("faceHeight", faceHeight);
  // console.log("leftEyeDistance", leftEyeDistance);
  // console.log("leftEyeDistance", leftEyeDistance);

  // Distancia entre punto superior e inferior para tomar como referencia de tamaño
  // Distancia entre parpado superior e inferior, si es más pequeño que threshold está cerrado
  
  let leftEyeClosed = leftEyeDistance < 0.01;
  let rightEyeClosed = rightEyeDistance < 0.01;

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

  ctx.drawImage(hairImage, x, y - 20);

  ctx.restore();

  ctx.restore();


  requestAnimationFrame(draw.bind(this));
}

function getLandmark(index){
  // return props.landmarks[AvatarLandmarks.indexOf(index)]
  return props.landmarks[index];
}

</script>

<template>
  <span>{{avatar.name}}</span>
  <br>
  <canvas class="cvs" width="400" height="400"></canvas>
  <br>
  <!-- <span>{{landmarks}}</span> -->
</template>