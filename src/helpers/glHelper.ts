const degree = Math.PI / 180;

/**
 * Convert degree to radian
 * @param a
 */
export function radian(a: number) {
  return a * degree;
}

/**
 * 创建一个 vec2 类型向量
 * @param x
 * @param y
 */
export function vec2(x: number, y: number) {
  const vector = new Float32Array(2);
  vector[0] = x;
  vector[1] = y;
  return vector;
}

/**
 * 创建一个 vec3 类型向量
 * @param x
 * @param y
 * @param z
 */
export function vec3(x, y, z) {
  const vector = new Float32Array(3);
  vector[0] = x;
  vector[1] = y;
  vector[2] = z;
  return vector;
}

/**
 * 创建一个 vec4 类型向量
 * @param x
 * @param y
 * @param z
 * @param w
 */
export function vec4(x, y, z, w) {
  const vector = new Float32Array(3);
  vector[0] = x;
  vector[1] = y;
  vector[2] = z;
  vector[3] = w;
  return vector;
}
