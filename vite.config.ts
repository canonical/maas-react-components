import path from "path";

import react from "@vitejs/plugin-react";
import dts from "vite-plugin-dts";
import { defineConfig } from "vitest/config";

import { name } from "./package.json";

export default defineConfig({
  plugins: [
    react(),
    dts({
      insertTypesEntry: true,
    }),
  ],
  css: {
    preprocessorOptions: {
      scss: {
        api: "modern",
        quietDeps: true,
        silenceDeprecations: ["import", "global-builtin"],
      },
    },
  },
  resolve: {
    alias: { "@": path.resolve(__dirname, "src") },
  },
  build: {
    lib: {
      entry: path.resolve(__dirname, "src/lib/index.ts"),
      name,
      formats: ["es", "umd"],
      fileName: (format) => `${name}.${format}.js`,
    },
    rollupOptions: {
      external: [
        "@canonical/react-components",
        "react",
        "react/jsx-runtime",
        "react-dom",
        "vanilla-framework",
        "react-router-dom",
      ],
      output: {
        globals: {
          react: "React",
          "@canonical/react-components": "@canonical/react-components",
          "react/jsx-runtime": "react/jsx-runtime",
          "react-dom": "ReactDOM",
          "react-router-dom": "react-router-dom",
        },
      },
    },
  },
  test: {
    globals: true,
    environment: "jsdom",
    setupFiles: ["./vitest-setup.ts"],
  },
});
