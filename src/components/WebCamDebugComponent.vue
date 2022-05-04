<script setup>
import { Avatar, AvatarLandmarks } from "@/core/avatar";
import { Drawing } from "@/core/drawing";
import { MathUtils } from "@/core/mathUtils";
import { ref, onMounted, onUnmounted } from 'vue'

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

  if(props.image) ctx.drawImage(props.image, 0, 0, cvs.width, cvs.height);

  AvatarLandmarks.forEach((i)=>{
    let landmark = props.landmarks[i];
    if(landmark){
      Drawing.fillCircle(ctx, landmark.x * cvs.width, landmark.y * cvs.height, 2, "#FF0000");
    }
  });

  requestAnimationFrame(draw.bind(this));
}

</script>

<template>
  <br>
  <canvas class="videocvs" width="400" height="400" style="transform: scale(-1, 1);"></canvas>
  <br>
</template>