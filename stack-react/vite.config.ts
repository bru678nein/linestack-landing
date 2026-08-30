import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

// Tailwind v4 runs through the official Vite plugin, not the postcss plugin.
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: { port: 5178, strictPort: true },
});
