<script setup lang="ts">
import CanvasKitRenderer from "@/utils/CanvasKitRenderer";
import { onMounted, onUnmounted } from "vue";

async function startRendering() {
  const renderer = new CanvasKitRenderer("stage");
  await renderer.init();
  const drawFrame = () => renderer.drawImageFromUrl("/liuyifei.jpg");
  renderer.animate(drawFrame);
}

onMounted(() => {
  console.log("onMounted");
  startRendering();
});

onUnmounted(
  () => {
    console.log("onUnmounted");
  },
);
</script>

<template>
  <div class="container">
    <h1>Hello Skia CanvasKit on Vite Demo2!</h1>
    <canvas id="stage" width="300" height="300" />
  </div>
</template>

<style scoped>
.container{
  width: 100%;
  height: 100%;
}
</style>
