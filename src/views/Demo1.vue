<script setup lang="ts">
import type { Canvas, CanvasKit } from "canvaskit-wasm";
// @ts-ignore
import CanvasKitInit from "canvaskit-wasm/bin/canvaskit.js";
import CanvasKitWasm from "canvaskit-wasm/bin/canvaskit.wasm?url";
import { onMounted, onUnmounted, ref } from "vue";

const paintRef = ref();

function init() {
  CanvasKitInit({ locateFile: () => CanvasKitWasm }).then(
    (CanvasKit: CanvasKit) => {
      console.log("canvasKit loaded");
      const surface = CanvasKit.MakeWebGLCanvasSurface("stage");

      // 创建画笔对象 Paint
      const paint = new CanvasKit.Paint();
      paintRef.value = paint;
      paint.setColor(CanvasKit.Color4f(0.9, 0, 0, 1.0));

      // 填充还是描边，这里选择描边
      paint.setStyle(CanvasKit.PaintStyle.Stroke);
      paint.setStrokeWidth(2); // 线宽
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

      async function drawFrame(canvas: Canvas) {
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

        // paint.setColor(CanvasKit.Color4f(0, 0.9, 0, 1.0));
        // 绘制椭圆
        canvas.drawOval(CanvasKit.LTRBRect(x, y, x + w, y + h), paint);

        // 绘制圆
        canvas.drawCircle(
          100, // cx
          100, // cy
          80, // radius
          paint,
        );

        // 绘制线
        canvas.drawLine(20, 20, 140, 100, paint);

        // 绘制弧线
        canvas.drawArc(
          CanvasKit.XYWHRect(50, 50, 200, 100), // oval，包围椭圆的矩形
          0, // startAngle，起始角度。极轴坐标中正右方向为 0 度，角度方向为顺时针
          90, // endAngle，结束角度
          true, // useCenter，是否使用中心，即是否额外加多两条连接到圆心的线
          paint,
        );

        // 绘制点 提供点数组来批量绘制点
        canvas.drawPoints(
          CanvasKit.PointMode.Points, // 模式为点模式
          [20, 20, 50, 60, 90, 30, 150, 60], // 点的集合
          paint,
        );

        // 绘制线 改为绘制线模式，会按顺序将两个点为一组，绘制一条线
        canvas.drawPoints(
          CanvasKit.PointMode.Lines, // 模式为线模式
          [20, 20, 50, 60, 90, 30, 150, 60], // 点的集合
          paint,
        );

        // 多段线模式，多个点依次相连
        canvas.drawPoints(
          CanvasKit.PointMode.Polygon, // 模式为多段线模式
          [20, 20, 50, 60, 90, 30, 150, 60], // 点的集合
          paint,
        );

        // 绘制路径
        const path = new CanvasKit.Path();
        path
          .moveTo(20, 150)
          .lineTo(50, 60)
          .arc(80, 80, 20, 0, Math.PI) // 圆弧
          .cubicTo(90, 30, 150, 60, 190, 90); // 三阶贝塞尔曲线
        canvas.drawPath(path, paint);

        const imgData = await fetch("/liuyifei.jpg").then(res =>
          res.arrayBuffer(),
        );
        const decodeImage = CanvasKit.MakeImageFromEncoded(imgData);

        canvas.drawImage(decodeImage, 10, 10);
        surface?.requestAnimationFrame(drawFrame);
      }

      surface?.requestAnimationFrame(drawFrame);
    },
  );
}

console.log("on script hello");
const containerRef = ref();
console.log("on script", containerRef);

onMounted(() => {
  console.log("onMounted");

  // 在挂载后获取ref 对象，然后赋值
  console.log(containerRef);
  containerRef.value.innerHTML = `
  <h1>Hello Skia CanvasKit on Vite!</h1>
  <canvas id='stage' width=300 height=300></canvas>
`;
  init();
});

onUnmounted(() => {
  if (paintRef.value) {
    paintRef.value.delete();
  }
});
</script>

<template>
  <div ref="containerRef" class="wrapper">
    Demo1
  </div>
</template>

<style scoped>

</style>
