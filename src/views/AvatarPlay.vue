<script setup>
import AvatarComponent from "@/components/AvatarComponent.vue";
import WebCamDebugComponent from "@/components/WebCamDebugComponent.vue";
import { Avatar } from "@/core/avatar";
import { Webcam } from "@/core/webcam";
import { ref, onMounted } from 'vue'

let avatar = new Avatar();
avatar.name = "David";

let landmarks = ref([]);
let webcamImage = ref(null);

function onResults(results){
  webcamImage.value = results.image;
  landmarks.value = results.landmarks;
}

onMounted(() => {
  let webcam = new Webcam();
  webcam.init(onResults);
})

</script>

<template>
  <h1>AvatarPlay</h1>
  <AvatarComponent :avatar="avatar" :landmarks="landmarks"/>
  <WebCamDebugComponent :image="webcamImage" :landmarks="landmarks"/>
</template>