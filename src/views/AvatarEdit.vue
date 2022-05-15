<script setup>
import AvatarComponent from "@/components/AvatarComponent.vue";
import ColorSelectorComponent from "@/components/ColorSelectorComponent.vue";
import { Avatar } from "@/core/avatar";
import { Webcam } from "@/core/webcam";
import { ref, onMounted, onUnmounted, inject  } from 'vue';

let settings = inject("settings");

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
  <div>
    <AvatarComponent :avatar="avatar"/>
    <div>

    </div>
    
    <div>
      <span>Background color</span>
      <ColorSelectorComponent :selected="avatar.backgroundColor" @input="onColorSelectorChange"/>
    </div>
  </div>
</template>