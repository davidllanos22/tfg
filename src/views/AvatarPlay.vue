<script setup>
import AvatarComponent from "@/components/AvatarComponent.vue";
import WebCamDebugComponent from "@/components/WebCamDebugComponent.vue";
import { Avatar, AvatarLandmarks} from "@/core/avatar";
import { ref, onMounted } from 'vue'

let avatar = new Avatar();
avatar.name = "David";

let landmarks = ref([]);
let webcamImage = ref(null);
let lastLandmarks = [];

function onResults(results){
  webcamImage.value = results.image;
  landmarks.value = results.multiFaceLandmarks.length > 0 ? results.multiFaceLandmarks[0] : [];
  
  if(landmarks.value.length == 0 && lastLandmarks.length > 0){
    landmarks.value = lastLandmarks;
  }else if(landmarks.length == 0 && lastLandmarks.length == 0){
    return;
  }

  lastLandmarks = landmarks.value;

  // landmarks.value = landmarks.value.filter((landmark, index)=>{
  //   return AvatarLandmarks.includes(index);
  // });
}

onMounted(() => {
  const videoElement = document.querySelector("#video");

  const faceMesh = new FaceMesh({locateFile: (file) => {
    return `https://cdn.jsdelivr.net/npm/@mediapipe/face_mesh/${file}`;
  }});

  faceMesh.setOptions({
    maxNumFaces: 1,
    refineLandmarks: true,
    minDetectionConfidence: 0.5,
    minTrackingConfidence: 0.5
  });

  faceMesh.onResults(onResults);

  const camera = new Camera(videoElement, {
    onFrame: async () => {
      await faceMesh.send({image: videoElement});
    },
    width: 640,
    height: 480
  });
  camera.start();
})

</script>

<template>
  <h1>AvatarPlay</h1>
  <video id="video" style="display:none; width: 250px; transform: scale(-1, 1);"></video>
  <AvatarComponent :avatar="avatar" :landmarks="landmarks"/>
  <WebCamDebugComponent :image="webcamImage" :landmarks="landmarks"/>
</template>