<script setup>
import AvatarComponent from "@/components/AvatarComponent.vue";
import ColorSelectorComponent from "@/components/ColorSelectorComponent.vue";
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

function onColorSelectorChange(event){
  let color = event.target.value;
  avatar.backgroundColor = color;
}
</script>

<template>
  <h1>AvatarEdit</h1>
  <AvatarComponent :avatar="avatar"/>
  <ColorSelectorComponent @input="onColorSelectorChange"/>
</template>