<script setup>
import AvatarComponent from "@/components/AvatarComponent.vue";
import WebCamDebugComponent from "@/components/WebCamDebugComponent.vue";
import { Avatar } from "@/core/avatar";
import { Webcam } from "@/core/webcam";
import { ref, onMounted, onUnmounted, inject } from 'vue'
import router from "@/router";

let settings = inject("settings");

let data = router.currentRoute.value.query.data;
let avatar = Avatar.fromBase64(data);
if(avatar == null) router.push("/list");

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

function onEditPressed(){
  router.push({path: "edit", query: {data: avatar.toBase64()}});
}

</script>

<template>
  <!-- <div class="d-flex flex-column align-items-center h-100" :style="{'background-color': avatar.backgroundColor}"> -->
  <div class="d-flex flex-column align-items-center h-100" v-if="avatar">
    <h1>{{avatar.name}}</h1>
    <AvatarComponent style="width: 500px" :hideBorder="true" :avatar="avatar" :landmarks="landmarks"/>
    
    <div class="position-fixed" style="bottom: 0; right: 0;">
      <span @click="onEditPressed">Edit</span>
    </div>
  </div>
  
  <WebCamDebugComponent v-if="settings.debugEnabled" :image="webcamImage" :landmarks="landmarks"/>
</template>