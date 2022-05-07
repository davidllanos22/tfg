<script setup>
import { ref, onMounted, onUnmounted  } from 'vue'

onMounted(() => {
  let cvs = document.querySelector("#cvs-color-wheel");
  cvs.onmousemove = colorWheelMouse;

  draw();
});

onUnmounted(() => {

});


function draw(){
  let cvs = document.querySelector("#cvs-color-wheel");
  cvs.style.width = "200px";
  cvs.style.height = "200px";

  if(!cvs) return;
  
  let ctx = cvs.getContext('2d');

  const size = 200;

  const centerColor = 'white';

  // Initiate variables
  let angle = 0;
  const hexCode = [0, 0, 255];
  let pivotPointer = 0;
  const colorOffsetByDegree = 4.322;
  const radius = size / 2;

  // For each degree in circle, perform operation
  while (angle < 360) {
    // find index immediately before and after our pivot
    const pivotPointerbefore = (pivotPointer + 3 - 1) % 3;

    // Modify colors
    if (hexCode[pivotPointer] < 255) {
      // If main points isn't full, add to main pointer
      hexCode[pivotPointer] =
        hexCode[pivotPointer] + colorOffsetByDegree > 255 ?
        255 :
        hexCode[pivotPointer] + colorOffsetByDegree;
    } else if (hexCode[pivotPointerbefore] > 0) {
      // If color before main isn't zero, subtract
      hexCode[pivotPointerbefore] =
        hexCode[pivotPointerbefore] > colorOffsetByDegree ?
        hexCode[pivotPointerbefore] - colorOffsetByDegree :
        0;
    } else if (hexCode[pivotPointer] >= 255) {
      // If main color is full, move pivot
      hexCode[pivotPointer] = 255;
      pivotPointer = (pivotPointer + 1) % 3;
    }

    const rgb = `rgb(${hexCode.map(h => Math.floor(h)).join(',')})`;
    const grad = ctx.createRadialGradient(
      radius,
      radius,
      0,
      radius,
      radius,
      radius
    );
    grad.addColorStop(0, centerColor);
    grad.addColorStop(1, rgb);
    ctx.fillStyle = grad;

    // draw circle portion
    ctx.globalCompositeOperation = 'source-over';
    ctx.beginPath();
    ctx.moveTo(radius, radius);
    ctx.arc(
      radius,
      radius,
      radius,
      degreesToRadians(angle),
      degreesToRadians(360)
    );
    ctx.closePath();
    ctx.fill();
    angle++;
  }


}

function degreesToRadians(degrees) {
  return degrees * (Math.PI / 180);
}

function colorWheelMouse(evt) {
  let cvs = document.querySelector("#cvs-color-wheel");
  let ctx = cvs.getContext('2d');
  var data = ctx.getImageData(evt.offsetX, evt.offsetY, 1, 1);
  let color = rgbToHex(data.data.slice(0, 3));
  console.log(color);
}

function componentToHex(c) {
  var hex = c.toString(16);
  return hex.length == 1 ? "0" + hex : hex;
}

function rgbToHex(rgb) {
  return "#" + componentToHex(rgb[0]) + componentToHex(rgb[1]) + componentToHex(rgb[2]);
}

</script>

<template>
  <h1>ColorWheelComponent</h1>
  <canvas id="cvs-color-wheel" width="200" height="200"></canvas>
</template>

<style scoped>

</style>
