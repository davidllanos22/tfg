<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

let props = defineProps({
  selected: String,
});

</script>

<template>
  <input :value="props.selected" type="color">
</template>