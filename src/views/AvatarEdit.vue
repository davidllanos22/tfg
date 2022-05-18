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

function onBackgroundColorChange(event){
  let color = event.target.value;
  avatar.colors.background = color;
  updateURL();
}

function onSkinColorChange(event){
  let color = event.target.value;
  avatar.colors.skin = color;
  //TODO: actualizar color oscuro
  updateURL();
}

function onHairColorChange(event){
  let color = event.target.value;
  avatar.colors.hair = color;
  //TODO: actualizar color oscuro
  updateURL();
}

function onClothesColorChange(event){
  let color = event.target.value;
  avatar.colors.clothes = color;
  //TODO: actualizar color oscuro
  updateURL();
}

function onEyesColorChange(event){
  let color = event.target.value;
  avatar.colors.eyes = color;
  updateURL();
}

</script>

<template>
  <div v-if="avatar">
    <AvatarComponent :avatar="avatar"/>
    <div>

    </div>
    
    <div clas="d-flex flex-column">
      <div>
        <span>Background color</span>
        <ColorSelectorComponent :selected="avatar.colors.background" @input="onBackgroundColorChange"/>
      </div>
      <div>
        <span>Skin color</span>
        <ColorSelectorComponent :selected="avatar.colors.skin" @input="onSkinColorChange"/>
      </div>
      <div>
        <span>Hair color</span>
        <ColorSelectorComponent :selected="avatar.colors.hair" @input="onHairColorChange"/>
      </div>
      <div>
        <span>Clothes color</span>
        <ColorSelectorComponent :selected="avatar.colors.clothes" @input="onClothesColorChange"/>
      </div>
      <div>
        <span>Eyes color</span>
        <ColorSelectorComponent :selected="avatar.colors.eyes" @input="onEyesColorChange"/>
      </div>
      
    </div>
  </div>
</template>