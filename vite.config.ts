import { fileURLToPath, URL } from "node:url";
import vue from "@vitejs/plugin-vue";
import { codeInspectorPlugin } from "code-inspector-plugin";
import TurboConsole from "unplugin-turbo-console/vite";

import { defineConfig } from "vite";

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    TurboConsole({
      extendedPathFileNames: ["index"],
    }),
    codeInspectorPlugin({
      bundler: "vite",
    }),
  ],
  resolve: {
    // https://vitejs.dev/config/shared-options.html#resolve-alias
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
      "~": fileURLToPath(new URL("./node_modules", import.meta.url)),
    },
    extensions: [".mjs", ".js", ".ts", ".jsx", ".tsx", ".json", ".vue"],
  },
  server: {
    port: 3000,
    host: true,
    headers: {
      "Access-Control-Allow-Origin": "*",
    },
    proxy: {
      "/api/raw/7288345574398918675": {
        target: "https://code.juejin.cn/api/raw/7288345574398918675?id=7288345574398967827",
        changeOrigin: true,
      },
    },
  },
});
