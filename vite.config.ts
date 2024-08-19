import { defineConfig } from "vite";
import fs from "fs";
import react from "@vitejs/plugin-react-swc";
import tsconfigPaths from "vite-tsconfig-paths";
import checker from "vite-plugin-checker";
import { chunkSplitPlugin } from "vite-plugin-chunk-split";
const filterWarningsPlugin = () => {
  return {
    name: "filter-warnings",
    handleHotUpdate({ file, server }: { file: string; server: any }) {
      server.ws.send({
        type: "custom",
        event: "custom-error",
        data: server.config.logger.info,
      });
    },
    configureServer(server: any) {
      const { ws } = server;
      ws.on("vite:afterUpdate", (data: any) => {
        data.updates.forEach((update: any) => {
          if (update.type === "js-update") {
            // Filter out warnings here if necessary
          }
        });
      });
    },
  };
};

export default defineConfig({
  plugins: [
    react(),
    tsconfigPaths(),
    checker({
      typescript: true,
      eslint: {
        lintCommand: 'eslint "./src/**/*.{ts,tsx}"',
      },
      overlay: {
        initialIsOpen: "error",
        position: "br",
        badgeStyle: "",
        panelStyle: "",
      },
    }),
    filterWarningsPlugin(),
    chunkSplitPlugin({
      strategy: "single-vendor",
      customChunk: (args) => {
        // files into pages directory is export in single files
        let { file } = args;
        if (file.startsWith("src/pages/")) {
          file = file.substring(4);
          file = file.replace(/\.[^.$]+$/, "");
          return file;
        }
        return null;
      },
      // customSplitting: {
      //   // `react` and `react-dom` will be bundled together in the `react-vendor` chunk (with their dependencies, such as object-assign)
      //   // Any file that includes `utils` in src dir will be bundled in the `utils` chunk

      //   components: [/src\/components/],
      //   features: [/src\/features/],
      //   assets: [/src\/assets/],

      //   router: [/src\/router/],
      //   _constants: [/src\/_constants/],
      //   hooks: [/src\/hooks/],
      //   pages: [/src\/pages/],
      //   layout: [/src\/layout/],
      //   context: [/src\/context/],
      //   'critical-dependencies': [/src\/store/, /src\/utils/, /src\/api/],
      // },
    }),
  ],

  server: {
    https: {
      key: fs.readFileSync("./cert/panda.key"),
      cert: fs.readFileSync("./cert/panda.crt"),
    },
    host: "react.pandatech.it",
  },
  build: {
    sourcemap: true,
    chunkSizeWarningLimit: 600,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes("node_modules")) {
            // Split vendor modules into a separate chunk
            return "vendor";
          }
        },
      },
    },
  },
});
