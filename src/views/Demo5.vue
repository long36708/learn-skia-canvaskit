<script setup lang="ts">
import CanvasKitInit from "canvaskit-wasm/bin/canvaskit.js";
import CanvasKitWasm from "canvaskit-wasm/bin/canvaskit.wasm?url";
import { onMounted } from "vue";

// This example shows how CanvasKit can automatically switch between multiple canvases
// with different WebGL contexts.
function MultiCanvasExample(CanvasKit, imgBytes) {
  const paint = new CanvasKit.Paint();

  const surfOne = CanvasKit.MakeWebGLCanvasSurface("api1");
  const canvasOne = surfOne.getCanvas();
  const surfTwo = CanvasKit.MakeWebGLCanvasSurface("api2");
  const canvasTwo = surfTwo.getCanvas();
  const surfThree = CanvasKit.MakeWebGLCanvasSurface("api3");
  const canvasThree = surfThree.getCanvas();

  function firstFrame() {
    paint.setColor(CanvasKit.Color4f(1, 0, 0, 1)); // red
    canvasOne.drawRect(CanvasKit.LTRBRect(0, 0, 300, 300), paint);
    surfOne.flush();

    paint.setColor(CanvasKit.Color4f(0, 1, 0, 1)); // green
    canvasTwo.drawRect(CanvasKit.LTRBRect(0, 0, 300, 300), paint);
    surfTwo.flush();

    paint.setColor(CanvasKit.Color4f(0, 0, 1, 1)); // blue
    canvasThree.drawRect(CanvasKit.LTRBRect(0, 0, 300, 300), paint);
    surfThree.flush();

    window.requestAnimationFrame(secondFrame);
  }

  let img;

  function secondFrame() {
    img = CanvasKit.MakeImageFromEncoded(imgBytes);

    canvasOne.drawImageCubic(img, 10, 10, 0.3, 0.3, null);
    surfOne.flush();

    canvasTwo.drawImageCubic(img, 10, 10, 0.3, 0.3, null);
    surfTwo.flush();

    canvasThree.drawImageCubic(img, 10, 10, 0.3, 0.3, null);
    surfThree.flush();

    window.requestAnimationFrame(thirdFrame);
  }

  function thirdFrame() {
    canvasOne.drawImageCubic(img, 100, 100, 0.3, 0.3, null);
    surfOne.flush();

    canvasTwo.drawImageCubic(img, 100, 100, 0.3, 0.3, null);
    surfTwo.flush();

    canvasThree.drawImageCubic(img, 100, 100, 0.3, 0.3, null);
    surfThree.flush();
    img.delete();
  }

  window.requestAnimationFrame(firstFrame);
}

function ContextSharingExample(CanvasKit, imageEle) {
  const img = CanvasKit.MakeLazyImageFromTextureSource(imageEle);

  const surfOne = CanvasKit.MakeWebGLCanvasSurface("api4");
  const surfTwo = CanvasKit.MakeWebGLCanvasSurface("api5");
  const surfThree = CanvasKit.MakeWebGLCanvasSurface("api6");

  let i = 0;

  function drawFrame(canvas) {
    canvas.drawImageCubic(img, 5 + i, 5 + i, 0.3, 0.3, null);
    i += 1;
    if (i >= 3) {
      if (i > 60) {
        img.delete();
        return;
      }
      if (i % 2) {
        surfOne.requestAnimationFrame(drawFrame);
      }
      else {
        surfTwo.requestAnimationFrame(drawFrame);
      }
    }
  }

  surfOne.requestAnimationFrame(drawFrame);
  surfTwo.requestAnimationFrame(drawFrame);
  surfThree.requestAnimationFrame(drawFrame);
}

async function startRendering() {
  const cdn = "https://storage.googleapis.com/skia-cdn/misc/";

  const ckLoaded = CanvasKitInit({ locateFile: () => CanvasKitWasm });
  const loadTestImage = fetch(`${cdn}test.png`).then(response => response.arrayBuffer());
  const imageEle = document.getElementById("src");

  Promise.all([ckLoaded, loadTestImage, imageEle!.decode()]).then((results: any) => {
    ContextSharingExample(results[0], imageEle);
    MultiCanvasExample(...results);
  });
}

onMounted(startRendering);
</script>

<template>
  <div>
    <h1>Hello Skia CanvasKit on Vite Demo5 multiCanvas!</h1>
    <canvas id="api1" width="300" height="300" />
    <canvas id="api2" width="300" height="300" />
    <canvas id="api3" width="300" height="300" />

    <br>

    <img
      id="src" src="https://storage.googleapis.com/skia-cdn/misc/test.png"
      width="40" height="40" crossorigin="anonymous"
    >

    <canvas id="api4" width="300" height="300" />
    <canvas id="api5" width="300" height="300" />
    <canvas id="api6" width="300" height="300" />
  </div>
</template>

<style scoped>

</style>
