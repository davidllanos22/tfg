<script setup>
import AvatarComponent from "@/components/AvatarComponent.vue";
import { Avatar } from "@/core/avatar";
import { ref, onMounted, onUnmounted  } from 'vue'
import router from "@/router";

let avatars = [];

for(let i = 0; i < 50; i++){
  let avatar = Avatar.random();
  avatar.name = i;
  avatars.push(avatar);
}

onMounted(() => {
});

onUnmounted(() => {
});


function onAvatarClick(avatar){
  router.push({path: "play", query: {data: avatar.toURLQueryParam()}});
}

</script>

<template>
  <div class="w-100 d-flex flex-column align-items-center">
    <div class="w-100 d-flex flex-row flex-wrap justify-content-around" style="gap: 10px; max-width: 900px;">
      <div class="d-flex flex-column align-items-center cursor-pointer" v-for="avatar in avatars" :key="avatar.name">
        <AvatarComponent @click="onAvatarClick(avatar)" :hideBorder="true" :avatar="avatar"/>
        <span class="font-weight-bold">{{avatar.name}}</span>
      </div>
    </div>
  </div>
</template>