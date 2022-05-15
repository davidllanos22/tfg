<script setup>
import AvatarComponent from "@/components/AvatarComponent.vue";
import WebCamDebugComponent from "@/components/WebCamDebugComponent.vue";
import { Avatar } from "@/core/avatar";
import { Webcam } from "@/core/webcam";
import { ref, onMounted, onUnmounted  } from 'vue'
import router from "@/router";

let avatars = [];

for(let i = 0; i < 50; i++){
  let avatar = Avatar.random();
  avatar.name = i;
  avatars.push(avatar);
}

let landmarks = ref([]);
let webcamImage = ref(null);
let webcam;



onMounted(() => {
  webcam = new Webcam();
  webcam.init(onResults);
});

onUnmounted(() => {
  webcam.destroy();
});

function onResults(results){
  webcamImage.value = results.image;
  landmarks.value = results.landmarks;
}

function onAvatarClick(avatar){
  console.log(avatar)
  router.push("/play");
}

</script>

<template>
  <div class="w-100 d-flex flex-column align-items-center">
    <div class="w-100 d-flex flex-row flex-wrap justify-content-around" style="gap: 10px; max-width: 900px;">
      <div class="d-flex flex-column align-items-center cursor-pointer" v-for="avatar in avatars" :key="avatar.name">
        <AvatarComponent @click="onAvatarClick(avatar)" :hideBorder="true" :avatar="avatar"/>
        <span class="font-weight-bold">{{avatar.name}}</span>
      </div>
    </div>
  </div>
  <!-- <WebCamDebugComponent :image="webcamImage" :landmarks="landmarks"/> -->
</template>