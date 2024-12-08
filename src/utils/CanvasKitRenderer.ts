import type { CanvasKit, Surface } from "canvaskit-wasm";
import { isBrowser } from "@/utils/index.ts";
import CanvasKitInit from "canvaskit-wasm/bin/canvaskit.js";
import CanvasKitWasm from "canvaskit-wasm/bin/canvaskit.wasm?url";

export interface ICanvasKitOptions {
  width: number;
  height: number;
  canvas?: HTMLCanvasElement;
  devicePixelRatio?: number;
}

class CanvasKitRenderer {
  #canvasId!: string;

  #CanvasKit!: CanvasKit;
  get CanvasKit() {
    return this.#CanvasKit;
  }

  #surface!: Surface | null;
  get surface() {
    return this.#surface;
  }

  #canvas!: HTMLCanvasElement;
  get canvas() {
    return this.#canvas;
  }

  #context!: CanvasRenderingContext2D;
  get context() {
    return this.#context;
  }

  #dpr!: number;
  get dpr() {
    return this.#dpr;
  }

  constructor(canvasId: string) {
    this.#canvasId = canvasId;
    // this.#CanvasKit = null as unknown as CanvasKit;
    // this.#surface = null as unknown as Surface;
  }

  async init({ options = {} }: { options?: ICanvasKitOptions } = {}): Promise<this> {
    // 初始化 CanvasKit
    this.#CanvasKit = await CanvasKitInit({
      locateFile: () => CanvasKitWasm,
    });
    console.log("CanvasKit loaded");

    // 创建 WebGL Surface
    this.#surface = this.#CanvasKit.MakeWebGLCanvasSurface(this.#canvasId);
    if (!this.#surface) {
      throw new Error("Failed to create WebGL surface");
    }
    const dpr = options.devicePixelRatio || (isBrowser ? window.devicePixelRatio : 1);
    this.#dpr = Math.max(Math.ceil(dpr), 1);
    this.resize(options?.width, options?.height);
    return this;
  }

  async drawImageFromUrl(url: string) {
    try {
      const imgData = await fetch(url).then((res) => {
        if (!res.ok)
          throw new Error(`Failed to fetch image: ${url}`);
        return res.arrayBuffer();
      });

      const decodeImage = this.#CanvasKit.MakeImageFromEncoded(imgData);
      if (!decodeImage) {
        throw new Error("Failed to decode image");
      }

      this.drawImage(decodeImage);
    }
    catch (error) {
      console.error(error);
    }
  }

  drawImage(image: any, left = 0, top = 0) {
    const canvas = this.#surface?.getCanvas();
    if (canvas) {
      canvas.clear(this.#CanvasKit.WHITE); // 清除画布
      canvas.drawImage(image, left, top);
    }
    return this;
  }

  animate(drawFunction: () => void) {
    const animationFrame = () => {
      drawFunction?.();
      this.#surface?.requestAnimationFrame(animationFrame);
    };
    this.#surface?.requestAnimationFrame(animationFrame);
  }

  destroy() {
    this.#surface?.dispose();
    this.#surface = null;
    this.#CanvasKit = null!;
    this.#canvas = null!;
  }

  private resize(width: number, height: number) {
    if (this.#canvas) {
      this.#canvas.width = this.dpr * width;
      this.#canvas.height = this.dpr * height;
    }
  }
}

export default CanvasKitRenderer;
