import * as glMatrix from "gl-matrix";
import * as glHelper from "./glHelper";

/**
 * 获取3D到2D的投影矩阵
 * @param x
 * @param y
 */
export default function getIsometricMatrix(x, y) {
  const isometricMatrix4 = glMatrix.mat4.create();

  glMatrix.mat4.rotateX(
    isometricMatrix4,
    isometricMatrix4,
    Math.asin(glHelper.radian(y)),
  );

  glMatrix.mat4.rotateY(
    isometricMatrix4,
    isometricMatrix4,
    glHelper.radian(x),
  );

  return isometricMatrix4;
}
