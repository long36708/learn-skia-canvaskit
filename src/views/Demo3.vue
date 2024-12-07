<script setup lang="ts">
import CanvasKitRenderer from "@/utils/CanvasKitRenderer";

import { onMounted } from "vue";

async function startRendering() {
  const renderer = new CanvasKitRenderer("stage");
  await renderer.init();

  const { CanvasKit, surface } = renderer;

  function drawFrame() {
    // 绘制三角形
    const path = new CanvasKit.Path();
    path.moveTo(10, 10);
    path.lineTo(100, 10);
    path.lineTo(10, 100);
    path.close();

    // 绘制贝塞尔曲线
    const arcPath = new CanvasKit.Path();
    arcPath.moveTo(55, 55);
    arcPath.cubicTo(120, 150, 130, 180, 200, 200);

    // 添加曲线路径
    path.addPath(arcPath);

    const canvas = surface.getCanvas();
    const { Paint, PaintStyle, parseColorString, Shader, TileMode } = CanvasKit;
    const paint = new Paint();
    paint.setStyle(PaintStyle.Stroke);
    paint.setColor(parseColorString("#000000"));

    const shader = Shader.MakeLinearGradient(
      [0, 0], // 渐变开始点
      [50, 50], // 渐变结束点
      [
        parseColorString("#ff0000"),
        parseColorString("#ffff00"),
        parseColorString("#0000ff"),
      ], // 渐变颜色
      [0, 0.5, 1], // 颜色范围比例
      TileMode.Clamp, // 范围外颜色样式模式
    );

    paint.setShader(shader);

    canvas.drawPath(path, paint); // paint 画笔
  }

  renderer.animate(drawFrame);
}

onMounted(startRendering);
</script>

<template>
  <div>
    <h1>Hello Skia CanvasKit on Vite Demo3!</h1>
    <canvas id="stage" width="300" height="300" />
  </div>
</template>

<style scoped>

</style>
