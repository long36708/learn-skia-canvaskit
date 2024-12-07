<script setup lang="ts">
import CanvasKitInit from "canvaskit-wasm/bin/canvaskit.js";
import CanvasKitWasm from "canvaskit-wasm/bin/canvaskit.wasm?url";
import { onMounted } from "vue";

async function init() {
  const canvaskit = await CanvasKitInit({
    locateFile() {
      return CanvasKitWasm;
    },
  });
  console.log(canvaskit);
  console.log("canvasKit loaded");
  const surface = canvaskit.MakeWebGLCanvasSurface("stage");

  async function drawFrame() {
    const imgData = await fetch("/liuyifei.jpg").then(res =>
      res.arrayBuffer(),
    );

    const decodeImage = canvaskit.MakeImageFromEncoded(imgData);
    if (!decodeImage) {
      console.error("decodeImage is null");
      return;
    }
    console.log("decodeImage", decodeImage);
    const canvas = surface?.getCanvas();
    canvas!.drawImage(decodeImage, 0, 0);
    surface?.requestAnimationFrame(drawFrame);
  }

  surface?.requestAnimationFrame(drawFrame);
}

onMounted(() => {
  console.log("onMounted");
  init();
});
</script>

<template>
  <div>
    Demo2
    <h1>Hello Skia CanvasKit on Vite!</h1>
    <canvas id="stage" width="300" height="300" />
  </div>
</template>

<style scoped>

</style>
