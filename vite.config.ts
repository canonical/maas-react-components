import path from "path";

import react from "@vitejs/plugin-react";
import dts from "vite-plugin-dts";
import { defineConfig } from "vitest/config";

import pkg from "./package.json";

// Extra packages to externalize that aren't in peerDependencies directly
// (transitive deps imported by src/lib/testing/utils.tsx).
const testingExternals = ["@remix-run/router", "redux"];

// Derived from peerDependencies so the external list stays automatically in
// sync as peers are added/removed.
const externalPackages = [
  ...Object.keys(pkg.peerDependencies ?? {}),
  ...testingExternals,
];

// Use a function so sub-path imports (e.g. "msw/node", "react/jsx-runtime")
// are correctly caught — a static array only matches exact strings.
const isExternal = (id: string) =>
  externalPackages.some((pkg) => id === pkg || id.startsWith(`${pkg}/`));

export default defineConfig({
  plugins: [
    react(),
    dts({
      // Resolve types relative to src/lib so entry paths mirror the output:
      //   src/lib/index.ts          -> dist/index.d.ts
      //   src/lib/testing/index.ts  -> dist/testing/index.d.ts
      entryRoot: "src/lib",
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
      entry: {
        index: path.resolve(__dirname, "src/lib/index.ts"),
        "testing/index": path.resolve(__dirname, "src/lib/testing/index.ts"),
      },
      name: pkg.name,
      formats: ["es"],
      fileName: (_format, entryName) =>
        entryName === "index"
          ? `${pkg.name}.es.js`
          : `${entryName}.es.js`,
    },
    rollupOptions: {
      external: isExternal,
      output: {
        globals: {
          react: "React",
          "@canonical/react-components": "@canonical/react-components",
          "react/jsx-runtime": "react/jsx-runtime",
          "react-dom": "ReactDOM",
          "react-router": "react-router",
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
