import * as glMatrix from "gl-matrix";
import * as glHelper from "./glHelper";

/**
 * 获取透视矩阵
 * @param width
 * @param height
 */
export default function getPerspectiveMatrix(width, height) {
  const projectionMatrix = glMatrix.mat4.create();

  // 透视投影
  const fieldOfView = glHelper.radian(45);
  // 宽高比
  const aspect = width / height;
  // 截距
  const zNear = 0.1;
  // 远截面
  const zFar = 100.0;

  glMatrix.mat4.perspective(
    projectionMatrix,
    fieldOfView,
    aspect,
    zNear,
    zFar,
  );

  return projectionMatrix;
}

export const getPerspectiveMatrix2 = function (width, height) {
  // 默认的垂直视场角（以弧度为单位）
  const fov = Math.PI * 0.25; // 45 degrees in radians
  // 计算宽高比
  const aspect = width / height;
  // 设置近平面和远平面
  const near = 0.1;
  const far = 100.0;

  // 创建并初始化一个 4x4 矩阵
  const matrix = new Float32Array(16).fill(0);

  const f = 1.0 / Math.tan(fov / 2);
  const rangeInv = 1 / (near - far);

  // 填充透视投影矩阵
  matrix[0] = f / aspect;
  matrix[5] = f;
  matrix[10] = (near + far) * rangeInv;
  matrix[11] = -1;
  matrix[14] = (2 * near * far) * rangeInv;
  matrix[15] = 0;

  return matrix;
};
