<script setup lang="ts">
import CanvasKitInit from "canvaskit-wasm/bin/canvaskit.js";
import CanvasKitWasm from "canvaskit-wasm/bin/canvaskit.wasm?url";
import { onMounted } from "vue";

async function startRendering() {
  const CanvasKit = await CanvasKitInit({
    // 注意： 使用注释的写法在打包后不生效
    // locateFile: file => `/node_modules/canvaskit-wasm/bin/${file}`,
    locateFile: () => CanvasKitWasm,
  });
  // 创建画布
  const surface = CanvasKit.MakeWebGLCanvasSurface("stage")!;

  // 创建 paint 对象
  const paint = new CanvasKit.Paint();
  paint.setColor(CanvasKit.Color4f(0.9, 0, 0, 1.0));
  paint.setStyle(CanvasKit.PaintStyle.Fill);
  paint.setAntiAlias(true);

  // 绘制圆角矩形
  const rr = CanvasKit.RRectXY(CanvasKit.LTRBRect(10, 60, 210, 260), 25, 15);
  surface?.drawOnce((cvs) => {
    cvs.clear(CanvasKit.WHITE);
    cvs.drawRRect(rr, paint);
  });
}

onMounted(startRendering);
</script>

<template>
  <div>
    <h1>
      canvasKit Demo13!
    </h1>
    <canvas id="stage" type="webgl2" width="500" height="500" />
  </div>
</template>

<style scoped>
canvas {
  border: 1px solid #000;
}
</style>
