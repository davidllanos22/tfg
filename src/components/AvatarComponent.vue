<script setup>
import { Avatar } from "@/core/avatar";
import { Drawing } from "@/core/drawing";
import { ref, onMounted } from 'vue'

//TODO: cargar todas las imágenes
const faceImage = Drawing.createImage("face.png");

defineProps({
  avatar: Avatar,
  landmarks: null
});

onMounted(() => {
  draw();
})

function draw(){
  let cvs = document.querySelector(".avatarCanvas");
  let ctx = cvs.getContext('2d');

  Drawing.clearCanvas(ctx, cvs.width, cvs.height, "#26282B");
  ctx.drawImage(faceImage, 0, 0);
  requestAnimationFrame(draw.bind(this));
}

</script>

<template>
  <span>{{avatar.name}}</span>
  <canvas class="avatarCanvas" width="400" height="400"></canvas>
</template>

<style scoped>

</style>
