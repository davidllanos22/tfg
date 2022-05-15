<script setup>
import AvatarComponent from "@/components/AvatarComponent.vue";
import WebCamDebugComponent from "@/components/WebCamDebugComponent.vue";
import { Avatar } from "@/core/avatar";
import { Webcam } from "@/core/webcam";
import { ref, onMounted, onUnmounted  } from 'vue'

let avatar = Avatar.random();
avatar.name = "David";

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
  <!-- <div class="d-flex flex-column align-items-center h-100" :style="{'background-color': avatar.backgroundColor}"> -->
  <div class="d-flex flex-column align-items-center h-100">
    <h1>{{avatar.name}}</h1>
    <AvatarComponent style="width: 500px" :hideBorder="true" :avatar="avatar" :landmarks="landmarks"/>
    
    <div class="position-fixed" style="bottom: 0; right: 0;">
      <router-link to="/edit">Edit</router-link>
    </div>
  </div>

  
  <!-- <WebCamDebugComponent :image="webcamImage" :landmarks="landmarks"/> -->
</template>