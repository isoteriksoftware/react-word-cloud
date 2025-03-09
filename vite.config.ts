import { resolve } from "node:path";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import dts from "vite-plugin-dts";
import tsConfigPaths from "vite-tsconfig-paths";

export default defineConfig(() => ({
  base: "./",
  plugins: [
    react(),
    tsConfigPaths(),
    dts({
      include: ["src/components", "src/core", "src/index.ts"],
      tsconfigPath: "./tsconfig.app.json",
    }),
  ],
  test: {
    globals: true,
    environment: "jsdom",
    setupFiles: "./src/setupTests.ts",
    coverage: {
      reporters: ["text", "html"],
    },
  },
  build: {
    minify: false,
    lib: {
      entry: resolve("src", "index.ts"),
      name: "react-word-cloud",
      formats: ["es", "umd"],
      fileName: (format) => `react-word-cloud.${format}.js`,
    },
    rollupOptions: {
      external: ["react", "react-dom", "react/jsx-runtime"],
      output: {
        globals: {
          react: "React",
          "react-dom": "ReactDOM",
          "react/jsx-runtime": "ReactJsxRuntime",
        },
      },
    },
  },
  optimizeDeps: {
    exclude: ["react", "react-dom", "react/jsx-runtime"],
  },
}));
