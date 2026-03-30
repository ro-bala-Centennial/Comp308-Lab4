import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import federation from "@originjs/vite-plugin-federation";

export default defineConfig({
  plugins: [
    react(),
    federation({
      name: "community_mf",
      filename: "remoteEntry.js",
      exposes: {
        "./CommunityApp": "./src/bootstrap.jsx",
      },
      shared: {
        react: { singleton: true, eager: true },
        "react-dom": { singleton: true, eager: true },
      },
    }),
  ],
  server: {
    port: 5175,
    strictPort: true,
  },
  build: {
    target: "esnext",
  },
});