import { resolve } from "node:path";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import dts from "vite-plugin-dts";
import tsConfigPaths from "vite-tsconfig-paths";
import { EsLinter, linterPlugin } from "vite-plugin-linter";
import * as packageJson from "./package.json";

export default defineConfig((configEnv) => ({
  base: "./",
  plugins: [
    react(),
    tsConfigPaths(),
    linterPlugin({
      include: ["./src}/**/*.{ts,tsx}"],
      linters: [new EsLinter({ configEnv })],
    }),
    dts({
      include: ["src/components", "src/common", "src/index.ts"],
      tsconfigPath: "./tsconfig.app.json",
    }),
  ],
  build: {
    minify: false,
    lib: {
      entry: resolve("src", "index.ts"),
      name: "react-word-cloud",
      formats: ["es", "umd"],
      fileName: (format) => `react-word-cloud.${format}.js`,
    },
    rollupOptions: {
      external: [...Object.keys(packageJson.peerDependencies)],
      output: {
        globals: {
          react: "React",
          "react-dom": "ReactDOM",
        },
      },
    },
  },
  optimizeDeps: {
    exclude: [...Object.keys(packageJson.peerDependencies)],
  },
}));
