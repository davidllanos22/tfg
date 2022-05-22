<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

let props = defineProps({
  name: String,
  selected: String,
});

</script>

<template>
  <div class="d-flex flex-row align-items-center" style="gap: 10px;">
    <input :value="props.selected" type="color">
    <span class="font-weight-bold text-black">{{props.name}}</span>
  </div>
</template>