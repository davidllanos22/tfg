<script setup>
import AvatarComponent from "@/components/AvatarComponent.vue";
import {Avatar} from "@/core/avatar";

let avatar = new Avatar();
console.log(avatar);
avatar.name = "David";

</script>

<template>
  <h1>AvatarPlay</h1>
  <AvatarComponent v-bind:avatar="avatar"/>
</template>