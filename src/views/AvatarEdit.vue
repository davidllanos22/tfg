<script setup>
import AvatarComponent from "@/components/AvatarComponent.vue";
import ColorSelectorComponent from "@/components/ColorSelectorComponent.vue";
import { Avatar } from "@/core/avatar";
import { Service } from "@/core/service";
import { Webcam } from "@/core/webcam";
import { ref, onMounted, onUnmounted, inject  } from 'vue';
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

function updateURL(){
  router.replace({query: {data: avatar.toBase64()}});
}

onMounted(() => {
  webcam = new Webcam();
  //webcam.init(onResults);
});

onUnmounted(() => {
  webcam.destroy();
});

function onNameChange(event){
  let name = event.target.value;
  avatar.name = name;
  updateURL();
}

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


function onPlayPressed(event){
  router.push({path: "play", query: {data: avatar.toBase64()}});
}

function onSavePressed(event){
  Service.saveAvatar(avatar);
}

function onDeletePressed(event){
  Service.deleteAvatar(avatar.id);
  router.push({path: "list"});
}

</script>

<template>
  <div v-if="avatar" class="pop m-3">

    <div class="d-flex flex-row m-3">
      <div class="pop" style="width: fit-content; height: 206px;">
        <AvatarComponent :avatar="avatar"/>
      </div>

      <div class="pop w-100 mx-0">
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
  
    
    <div clas="d-flex flex-column">
      <div>
        <span>Name</span>
        <input type="text" :value="avatar.name" @input="onNameChange">
      </div>
     

      <div class="w-100 d-flex flex-row justify-content-end">
        <button class="pop button bg-primary" @click="onPlayPressed">Play</button>
        <button class="pop button bg-warning" @click="onSavePressed">Save</button>
        <button class="pop button bg-danger" @click="onDeletePressed">Delete</button>
      </div>
      
    </div>
  </div>
</template>