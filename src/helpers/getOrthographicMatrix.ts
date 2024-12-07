import * as glMatrix from "gl-matrix";

/**
 * 获取正交投影矩阵
 * @param width
 * @param height
 */
export default function getOrthographicMatrix(width, height) {
  const projectionMatrix = glMatrix.mat4.create();

  glMatrix.mat4.ortho(
    projectionMatrix,
    -(width / 2),
    (width / 2),
    -(height / 2),
    (height / 2),
    -10000,
    10000,
  );

  return projectionMatrix;
}
