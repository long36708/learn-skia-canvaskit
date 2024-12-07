export interface Point { x: number; y: number }
export function createPerspectiveMatrixFromPoints(
  topLeft: Point,
  topRight: Point,
  botRight: Point,
  botLeft: Point,
  w: number,
  h: number,
) {
  const { x: x1, y: y1 } = topLeft;
  const { x: x2, y: y2 } = topRight;
  const { x: x3, y: y3 } = botRight;
  const { x: x4, y: y4 } = botLeft;

  const scaleX
        = (y1 * x2 * x4
          - x1 * y2 * x4
          + x1 * y3 * x4
          - x2 * y3 * x4
          - y1 * x2 * x3
          + x1 * y2 * x3
          - x1 * y4 * x3
          + x2 * y4 * x3)
        / (x2 * y3 * w + y2 * x4 * w - y3 * x4 * w - x2 * y4 * w - y2 * w * x3 + y4 * w * x3);
  const skewX
        = (-x1 * x2 * y3
          - y1 * x2 * x4
          + x2 * y3 * x4
          + x1 * x2 * y4
          + x1 * y2 * x3
          + y1 * x4 * x3
          - y2 * x4 * x3
          - x1 * y4 * x3)
        / (x2 * y3 * h + y2 * x4 * h - y3 * x4 * h - x2 * y4 * h - y2 * h * x3 + y4 * h * x3);
  const transX = x1;
  const skewY
        = (-y1 * x2 * y3
          + x1 * y2 * y3
          + y1 * y3 * x4
          - y2 * y3 * x4
          + y1 * x2 * y4
          - x1 * y2 * y4
          - y1 * y4 * x3
          + y2 * y4 * x3)
        / (x2 * y3 * w + y2 * x4 * w - y3 * x4 * w - x2 * y4 * w - y2 * w * x3 + y4 * w * x3);
  const scaleY
        = (-y1 * x2 * y3
          - y1 * y2 * x4
          + y1 * y3 * x4
          + x1 * y2 * y4
          - x1 * y3 * y4
          + x2 * y3 * y4
          + y1 * y2 * x3
          - y2 * y4 * x3)
        / (x2 * y3 * h + y2 * x4 * h - y3 * x4 * h - x2 * y4 * h - y2 * h * x3 + y4 * h * x3);
  const transY = y1;
  const persp0
        = (x1 * y3 - x2 * y3 + y1 * x4 - y2 * x4 - x1 * y4 + x2 * y4 - y1 * x3 + y2 * x3)
        / (x2 * y3 * w + y2 * x4 * w - y3 * x4 * w - x2 * y4 * w - y2 * w * x3 + y4 * w * x3);
  const persp1
        = (-y1 * x2 + x1 * y2 - x1 * y3 - y2 * x4 + y3 * x4 + x2 * y4 + y1 * x3 - y4 * x3)
        / (x2 * y3 * h + y2 * x4 * h - y3 * x4 * h - x2 * y4 * h - y2 * h * x3 + y4 * h * x3);
  const persp2 = 1;

  return [scaleX, skewX, transX, skewY, scaleY, transY, persp0, persp1, persp2];
}
