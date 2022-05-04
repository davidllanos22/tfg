<script setup>
import AvatarComponent from "@/components/AvatarComponent.vue";
import WebCamDebugComponent from "@/components/WebCamDebugComponent.vue";
import { Avatar } from "@/core/avatar";
import { Webcam } from "@/core/webcam";
import { ref, onMounted, onUnmounted  } from 'vue'

let avatars = [];

for(let i = 0; i < 10; i++){
  let avatar = new Avatar();
  avatar.name = i;
  avatars.push(avatar);
}

let landmarks = ref([]);
let webcamImage = ref(null);
let webcam;

function onResults(results){
  webcamImage.value = results.image;
  landmarks.value = results.landmarks;
}

onMounted(() => {
  webcam = new Webcam();
  webcam.init(onResults);
});

onUnmounted(() => {
  webcam.destroy();
});

</script>

<template>
  <h1>AvatarList</h1>

  <div class="w-100 d-flex flex-row flex-wrap justify-content-around">
    <div v-for="avatar in avatars" :key="avatar.name">
      <AvatarComponent :avatar="avatar" :landmarks="landmarks"/>
    </div>
  </div>

  <!-- <WebCamDebugComponent :image="webcamImage" :landmarks="landmarks"/> -->
</template>