<script setup lang="ts">
import CanvasKitRenderer from "@/utils/CanvasKitRenderer";
import { createPerspectiveMatrixFromPoints } from "@/utils/createPerspectiveMatrixFromPoints.ts";
import { onMounted } from "vue";

const beginColor = "#cb682e";
const endColor = "#f19a62";

const width = 300;
const height = 300;

const lineNum = 30;
const yLineNum = 30;
const rectSize = width / lineNum;

function getPerspectiveMatrix(width, height) {
  return createPerspectiveMatrixFromPoints({ x: 0, y: 0 }, { x: width, y: 0 }, { x: width, y: height }, {
    x: 0,
    y: height,
  }, width, height);
}

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

    const canvas = surface.getCanvas();
    const { Path, Paint, PaintStyle, parseColorString, Shader, TileMode, XYWHRect } = CanvasKit;
    const paint = new Paint();
    paint.setStyle(PaintStyle.Stroke);
    paint.setColor(parseColorString("#000000"));

    /**
     * 背景层
     * 给整个图形画一个方框，加上渐变着色器即完成背景绘制。
     */
    const backgroundPaint = new Paint();
    backgroundPaint.setStyle(PaintStyle.Fill);

    const points = {
      begin: [0, height],
      end: [0, 0],
    };

    const colors = [parseColorString(beginColor), parseColorString(endColor)];
    const shader = Shader.MakeLinearGradient(points.begin, points.end, colors, [0, 1], TileMode.Clamp); // 渐变

    backgroundPaint.setShader(shader);

    // 绘制矩形
    canvas.drawRect(XYWHRect(0, 0, width, height), backgroundPaint);

    /**
     * 方格层
     * 根据画布宽高和间距计算出 x 方向和 y 方向上绘制的方格个数 + 1，然后根据奇偶数排列绘制矩形，并使用平移矩阵将整体居中。
     * 针对方格层图形进行渐变颜色填充或线条颜色填充绘制。
     */
    const rectsPath = new Path();
    for (let i = 0; i < lineNum + 1; i++) { // 循环遍历绘制方格
      for (let j = 0; j < yLineNum + 1; j++) {
        if (i % 2 === 0 && j % 2 === 0) {
          const rect = XYWHRect(rectSize * i, rectSize * j, rectSize, rectSize);
          rectsPath.addRect(rect);
        }

        if (i % 2 === 1 && j % 2 === 1) {
          const rect = XYWHRect(rectSize * i, rectSize * j, rectSize, rectSize);
          rectsPath.addRect(rect);
        }
      }
    }

    const overlayColors = [
      parseColorString("#ffffff"),
      parseColorString("#ffffff"),
    ];
    const overlayShader = Shader.MakeLinearGradient( // 方格层渐变
      points.begin,
      points.end,
      overlayColors,
      [0, 1],
      TileMode.Clamp,
    );

    const rectsPaint = new Paint();
    rectsPaint.setAntiAlias(true);
    rectsPaint.setStyle(PaintStyle.Stroke);
    rectsPaint.setShader(overlayShader);

    // 棋盘方格只需要将方格层绘制样式设置为填充即可
    rectsPaint.setStyle(PaintStyle.Fill);

    // 透视矩阵
    const m = getPerspectiveMatrix(width, height);
    // 矩阵变换
    rectsPath.transform(m);
    canvas.drawPath(rectsPath, rectsPaint);
  }

  renderer.animate(drawFrame);
}

onMounted(startRendering);
</script>

<template>
  <div>
    <h1>Hello Skia CanvasKit on Vite Demo4!</h1>
    <canvas id="stage" width="300" height="300" />
  </div>
</template>

<style scoped>

</style>
