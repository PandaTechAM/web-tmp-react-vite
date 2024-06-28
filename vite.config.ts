import { defineConfig } from "vite";
import fs from "fs";
import react from "@vitejs/plugin-react-swc";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig({
  plugins: [react(), tsconfigPaths()],
  server: {
    https: {
      key: fs.readFileSync("./cert/panda.key"),
      cert: fs.readFileSync("./cert/panda.crt"),
    },
    host: "react.pandatech.it",
  },
});
