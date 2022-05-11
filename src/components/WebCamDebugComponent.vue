<script setup>
import { AvatarLandmarks } from "@/core/avatar";
import { Drawing } from "@/core/drawing";
import { onMounted, onUnmounted, inject } from 'vue'

let settings = inject("settings");

let props = defineProps({
  image: null,
  landmarks: null
});

onMounted(() => {
  draw();
});

onUnmounted(() => {

});

function draw(){
  let cvs = document.querySelector(".videocvs");

  if(!cvs) return;
  
  let ctx = cvs.getContext('2d');

  ctx.save();

  if(settings.mirrorEnabled){
    ctx.translate(cvs.width, 1);
    ctx.scale(-1, 1);
  }

  if(props.image) ctx.drawImage(props.image, 0, 0, cvs.width, cvs.height);

  AvatarLandmarks.forEach((i)=>{
    let landmark = props.landmarks[i];
    if(landmark){
      let x = landmark.x * cvs.width;
      let y = landmark.y * cvs.height;
      let color = "#FF0000";
      Drawing.fillCircle(ctx, x, y, 2, color);
      Drawing.drawText(ctx, i, x, y, 12, "blue");
    }
  });

  ctx.restore();

  requestAnimationFrame(draw.bind(this));
}

</script>

<template>
  <br>
  <canvas class="videocvs" width="400" height="400"></canvas>
  <br>
</template>