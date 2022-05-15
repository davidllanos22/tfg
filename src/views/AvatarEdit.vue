<script setup>
import AvatarComponent from "@/components/AvatarComponent.vue";
import ColorSelectorComponent from "@/components/ColorSelectorComponent.vue";
import { Avatar } from "@/core/avatar";
import { Webcam } from "@/core/webcam";
import { ref, onMounted, onUnmounted, inject  } from 'vue';
import router from "@/router";

let settings = inject("settings");

let data = router.currentRoute.value.query.data;
let avatar = Avatar.fromURLQueryParam(data);
if(avatar == null) router.push("/list");

let landmarks = ref([]);
let webcamImage = ref(null);
let webcam;

function onResults(results){
  webcamImage.value = results.image;
  landmarks.value = results.landmarks;
}

function updateURL(){
  router.replace({query: {data: avatar.toURLQueryParam()}});
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
  updateURL();
}

</script>

<template>
  <div v-if="avatar">
    <AvatarComponent :avatar="avatar"/>
    <div>

    </div>
    
    <div>
      <span>Background color</span>
      <ColorSelectorComponent :selected="avatar.backgroundColor" @input="onColorSelectorChange"/>
    </div>
  </div>
</template>