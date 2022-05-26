<script setup>
import AvatarComponent from "@/components/AvatarComponent.vue";
import WebCamDebugComponent from "@/components/WebCamDebugComponent.vue";
import ColorSelectorComponent from "@/components/ColorSelectorComponent.vue";
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

function onDownloadPressed(){
  let canvas = document.querySelector(".cvs-" + avatar.id);
  let link = document.createElement('a');
  link.download = 'download.png';
  link.href = canvas.toDataURL();
  link.click();
  link.remove();
}

function onBackgroundColorChange(event){
  let color = event.target.value;
  avatar.colors.background = color;
}

</script>

<template>
  <!-- <div class="d-flex flex-column align-items-center h-100" :style="{'background-color': avatar.backgroundColor}"> -->
  <div class="d-flex flex-column align-items-center h-100" v-if="avatar">
    <div class="pop" style="width: fit-content; height: 506px;">
      <AvatarComponent style="width: 500px" :avatar="avatar" :landmarks="landmarks"/>
    </div>
    
    <div class="d-flex flex-column align-items-center">
      <h1>{{avatar.name}}</h1>
      <ColorSelectorComponent :name="'Background'" :selected="avatar.colors.background" @input="onBackgroundColorChange"/>
      <div class="d-flex flex-row mt-3">
        <button class="pop button bg-primary" @click="onEditPressed">Edit</button>
        <button class="pop button bg-warning" @click="onDownloadPressed">Download</button>
      </div>
    </div>
    
    
  </div>
  
  <WebCamDebugComponent v-if="settings.debugEnabled" :image="webcamImage" :landmarks="landmarks"/>
</template>