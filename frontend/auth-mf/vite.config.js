import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import federation from "@originjs/vite-plugin-federation";

export default defineConfig({
  plugins: [
    react(),
    federation({
      name: "auth_mf",
      filename: "remoteEntry.js",
      exposes: {
        "./AuthApp": "./src/bootstrap.jsx",
      },
      shared: {
        react: { singleton: true, eager: true },
        "react-dom": { singleton: true, eager: true },
      },
    }),
  ],
  server: {
    port: 5174,
    strictPort: true,
  },
  build: {
    target: "esnext",
  },
});