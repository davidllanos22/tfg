<script setup>
import AvatarComponent from "@/components/AvatarComponent.vue";
import { Avatar } from "@/core/avatar";
import { Service } from "@/core/service";
import { ref, onMounted, onUnmounted  } from 'vue'
import router from "@/router";

let customAvatars = ref([]);
let randomAvatars = ref([]);

for(let i = 0; i < 20; i++){
  let avatar = Avatar.random();
  avatar.name = i + 1;
  randomAvatars.value.push(avatar);
}

Service.loadAllAvatars().then((avatars)=>{
  customAvatars.value = avatars;
});

onMounted(() => {
  
  
});

onUnmounted(() => {
});


function onAvatarClick(avatar){
  router.push({path: "edit", query: {data: avatar.toBase64()}});
}

</script>

<template>
  <div class="w-100 d-flex flex-column align-items-center">
    <div class="w-100 d-flex flex-column flex-wrap justify-content-around" style="gap: 10px; max-width: 900px;">
      
      <div v-if="customAvatars.length > 0" class="d-flex flex-column">
        <h1 class="pop p-2 mx-1 mb-3 bg-primary">My avatars</h1>
        <div class="w-100 d-flex flex-row flex-wrap justify-content-around" style="gap: 10px;">
          <div class="d-flex flex-column align-items-center cursor-pointer" v-for="avatar in customAvatars" :key="avatar.id">
            <div class="pop mx-0 mb-2" style="height: 206px;">
              <AvatarComponent @click="onAvatarClick(avatar)" :static="true" :avatar="avatar"/>
            </div>
            <span class="font-weight-bold">{{avatar.name}}</span>
          </div>
        </div>
       
      </div>
     
      <div class="d-flex flex-column">
        <h1 class="pop p-2 mx-1 mb-3 bg-danger">Generated avatars</h1>
        <div class="w-100 d-flex flex-row flex-wrap justify-content-around" style="gap: 10px;">
          <div class="d-flex flex-column align-items-center cursor-pointer" v-for="avatar in randomAvatars" :key="avatar.id">
            <div class="pop mx-0 mb-2" style="height: 206px;">
              <AvatarComponent @click="onAvatarClick(avatar)" :static="true" :avatar="avatar"/>
            </div>
            <span class="font-weight-bold text-black">{{avatar.name}}</span>
          </div>
        </div>
      </div>
     
    </div>
  </div>
</template>