<script setup>
import AvatarComponent from "@/components/AvatarComponent.vue";
import ColorSelectorComponent from "@/components/ColorSelectorComponent.vue";
import { Avatar, AvatarPartsCount } from "@/core/avatar";
import { Utils } from "@/core/utils";
import { Service } from "@/core/service";
import { Webcam } from "@/core/webcam";
import { ref, onMounted, onUnmounted, inject  } from 'vue';
import router from "@/router";

let settings = inject("settings");

let data = router.currentRoute.value.query.data;
let avatarData = Avatar.fromBase64(data);
if(avatarData == null) router.push("/list");

console.log(avatarData)

let avatar = ref(avatarData)
let landmarks = ref([]);
let webcamImage = ref(null);
let webcam;

function onResults(results){
  webcamImage.value = results.image;
  landmarks.value = results.landmarks;
}

function updateURL(){
  router.replace({query: {data: avatar.value.toBase64()}});
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
  avatar.value.name = name;
  updateURL();
}

function onBackgroundColorChange(event){
  let color = event.target.value;
  avatar.value.colors.background = color;
  updateURL();
}

function onSkinColorChange(event){
  let color = event.target.value;
  avatar.value.colors.skin = color;
  avatar.value.colors.skinDark = Utils.RGBtoHex(Utils.hexToRGB(color).map(c=>Math.max(0, c-20)));
  updateURL();
}

function onHairColorChange(event){
  let color = event.target.value;
  console.log(Utils);
  avatar.value.colors.hair = color;
  avatar.value.colors.hairDark = color;
  avatar.value.colors.hairDark = Utils.RGBtoHex(Utils.hexToRGB(color).map(c=>Math.max(0, c-20)));
  updateURL();
}

function onClothesColorChange(event){
  let color = event.target.value;
  avatar.value.colors.clothes = color;
  avatar.value.colors.clothesDark = color;
  avatar.value.colors.clothesDark = Utils.RGBtoHex(Utils.hexToRGB(color).map(c=>Math.max(0, c-20)));
  updateURL();
}

function onEyesColorChange(event){
  let color = event.target.value;
  avatar.value.colors.eyes = color;
  
  updateURL();
}


function onPlayPressed(event){
  router.push({path: "play", query: {data: avatar.value.toBase64()}});
}

function onSavePressed(event){
  Service.saveAvatar(avatar.value);
}

function onDeletePressed(event){
  Service.deleteAvatar(avatar.value.id);
  router.push({path: "list"});
}

function onNextPartPressed(part){
  if(!avatar.value[part]) return;
  avatar.value[part].index++;
  if(avatar.value[part].index > AvatarPartsCount[part] - 1) avatar.value[part].index = 0;
}

function onPreviousPartPressed(part){
  if(!avatar.value[part]) return;
  avatar.value[part].index--;
  if(avatar.value[part].index < 0) avatar.value[part].index = AvatarPartsCount[part] - 1;
}

</script>

<template>
  <div v-if="avatar" class="d-flex flex-row justify-content-center m-3" >
    <div class="pop w-100" style="max-width: 900px;">
      <div class="d-flex flex-row m-3">
        <div class="pop" style="width: fit-content; height: 206px;">
          <AvatarComponent :avatar="avatar"/>
        </div>

        <div class="pop w-100 mx-0 p-2 d-flex flex-row">
          <div class="w-50 d-flex flex-column" style="gap: 10px">
            <div class="d-flex flex-row align-items-center">
              <span>Background color</span>
              <ColorSelectorComponent :selected="avatar.colors.background" @input="onBackgroundColorChange"/>
            </div>
            <div class="d-flex flex-row align-items-center">
              <span>Skin color</span>
              <ColorSelectorComponent :selected="avatar.colors.skin" @input="onSkinColorChange"/>
            </div>
            <div class="d-flex flex-row align-items-center">
              <span>Hair color</span>
              <ColorSelectorComponent :selected="avatar.colors.hair" @input="onHairColorChange"/>
            </div>
            <div class="d-flex flex-row align-items-center">
              <span>Clothes color</span>
              <ColorSelectorComponent :selected="avatar.colors.clothes" @input="onClothesColorChange"/>
            </div>
            <div class="d-flex flex-row align-items-center">
              <span>Eyes color</span>
              <ColorSelectorComponent :selected="avatar.colors.eyes" @input="onEyesColorChange"/>
            </div>
          </div>

          <div class="w-50 d-flex flex-column" style="gap: 10px">

            <div class="d-flex flex-row align-items-center">
              <span>Face</span>
              <div class="arrow-left mx-2 cursor-pointer" @click="onPreviousPartPressed('face')"></div>
              <span>{{avatar.face.index + 1}}</span>
              <div class="arrow-right mx-2 cursor-pointer" @click="onNextPartPressed('face')"></div>
            </div>

            <div class="d-flex flex-row align-items-center">
              <span>Hair</span>
              <div class="arrow-left mx-2 cursor-pointer" @click="onPreviousPartPressed('hair')"></div>
              <span>{{avatar.hair.index + 1}}</span>
              <div class="arrow-right mx-2 cursor-pointer" @click="onNextPartPressed('hair')"></div>
            </div>

            <div class="d-flex flex-row align-items-center">
              <span>Eyebrows</span>
              <div class="arrow-left mx-2 cursor-pointer" @click="onPreviousPartPressed('eyebrows')"></div>
              <span>{{avatar.eyebrows.index + 1}}</span>
              <div class="arrow-right mx-2 cursor-pointer" @click="onNextPartPressed('eyebrows')"></div>
            </div>

            <div class="d-flex flex-row align-items-center">
              <span>Nose</span>
              <div class="arrow-left mx-2 cursor-pointer" @click="onPreviousPartPressed('nose')"></div>
              <span>{{avatar.nose.index + 1}}</span>
              <div class="arrow-right mx-2 cursor-pointer" @click="onNextPartPressed('nose')"></div>
            </div>

            <div class="d-flex flex-row align-items-center">
              <span>Eyes</span>
              <div class="arrow-left mx-2 cursor-pointer" @click="onPreviousPartPressed('eyes')"></div>
              <span>{{avatar.eyes.index + 1}}</span>
              <div class="arrow-right mx-2 cursor-pointer" @click="onNextPartPressed('eyes')"></div>
            </div>

            <div class="d-flex flex-row align-items-center">
              <span>Clothes</span>
              <div class="arrow-left mx-2 cursor-pointer" @click="onPreviousPartPressed('clothes')"></div>
              <span>{{avatar.clothes.index + 1}}</span>
              <div class="arrow-right mx-2 cursor-pointer" @click="onNextPartPressed('clothes')"></div>
            </div>

            
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
          <button v-if="avatar.updateDate" class="pop button bg-danger" @click="onDeletePressed">Delete</button>
        </div>
        
      </div>
    </div>
    
  </div>
</template>