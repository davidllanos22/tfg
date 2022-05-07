<script setup>
import AvatarComponent from "@/components/AvatarComponent.vue";
import ColorWheelComponent from "@/components/ColorWheelComponent.vue";
import { Avatar } from "@/core/avatar";
import { Webcam } from "@/core/webcam";
import { ref, onMounted, onUnmounted  } from 'vue';

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
  //webcam.init(onResults);
});

onUnmounted(() => {
  webcam.destroy();
});

</script>

<template>
  <h1>AvatarEdit</h1>
  <AvatarComponent :avatar="avatar"/>
  <ColorWheelComponent/>
</template>