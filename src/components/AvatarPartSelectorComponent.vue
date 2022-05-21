<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { Avatar, AvatarPartsCount } from "@/core/avatar";

let props = defineProps({
  name: String,
  avatar: Avatar,
  part: String
});

function onNextPartPressed(){
  let part = props.part;
  if(!props.avatar[part]) return;
  props.avatar[part].index++;
  if(props.avatar[part].index > AvatarPartsCount[part] - 1) props.avatar[part].index = 0;
}

function onPreviousPartPressed(){
  let part = props.part;
  if(!props.avatar[part]) return;
  props.avatar[part].index--;
  if(props.avatar[part].index < 0) props.avatar[part].index = AvatarPartsCount[part] - 1;
}

</script>

<template>
  <div class="d-flex flex-row align-items-center">
    <span>{{props.name}}</span>
    <div class="arrow-left mx-2 cursor-pointer" @click="onPreviousPartPressed(); $emit('change');"></div>
    <span>{{props.avatar[props.part].index + 1}}</span>
    <div class="arrow-right mx-2 cursor-pointer" @click="onNextPartPressed(); $emit('change');"></div>
  </div>
</template>

<style scoped>

</style>
