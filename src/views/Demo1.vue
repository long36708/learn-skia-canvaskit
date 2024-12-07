<script setup lang="ts">

// @ts-ignore
import CanvasKitInit from "canvaskit-wasm/bin/canvaskit.js";
import CanvasKitWasm from "canvaskit-wasm/bin/canvaskit.wasm?url";
import {Canvas, CanvasKit} from "canvaskit-wasm";
import {onMounted, ref} from 'vue';

const init = () => {
  CanvasKitInit({locateFile: () => CanvasKitWasm}).then(
      (CanvasKit: CanvasKit) => {
        console.log('canvasKit loaded')
        const surface = CanvasKit.MakeWebGLCanvasSurface('foo');
        const paint = new CanvasKit.Paint();
        paint.setColor(CanvasKit.Color4f(0.9, 0, 0, 1.0));
        paint.setStyle(CanvasKit.PaintStyle.Stroke);
        // 设置画笔抗锯齿
        paint.setAntiAlias(true);
        const w = 100; // size of rect
        const h = 60;
        // initial position of top left corner.
        // 左上角的初始位置。
        let x = 10;
        let y = 60;
        // 长方体始终沿四个对角线方向之一以恒定速度移动
        // box is always moving at a constant speed in one of the four diagonal directions
        let dirX = 1;
        let dirY = 1;

        function drawFrame(canvas: Canvas) {
          // boundary check
          if (x < 0 || x + w > 300) {
            // 撞击侧壁时反转 x 方向
            dirX *= -1; // reverse x direction when hitting side walls
          }
          if (y < 0 || y + h > 300) {
            // 撞击顶或底边时反转 y 方向
            dirY *= -1; // reverse y direction when hitting top and bottom walls
          }
          // move
          x += dirX;
          y += dirY;

          canvas.clear(CanvasKit.WHITE);
          // 绘制长方形
          const rr = CanvasKit.RRectXY(CanvasKit.LTRBRect(x, y, x + w, y + h), 25, 15);
          canvas.drawRRect(rr, paint);
          surface?.requestAnimationFrame(drawFrame);
        }

        surface?.requestAnimationFrame(drawFrame);
      });
}

console.log('on script hello')
const containerRef = ref();
console.log('on script', containerRef)

onMounted(() => {
  console.log('onMounted');

  // 在挂载后获取ref 对象，然后赋值
  console.log(containerRef)
  containerRef.value.innerHTML = `
  <h1>Hello Skia CanvasKit on Vite!</h1>
  <canvas id='foo' width=300 height=300></canvas>
`
  init();
})


</script>

<template>
  <div class="wrapper" ref="containerRef">
    Demo1
  </div>
</template>

<style scoped>

</style>
