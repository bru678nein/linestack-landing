import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

// Tailwind v4 runs through the official Vite plugin, not the postcss plugin.
// The port comes from the environment so the harness can assign a free one.
// No strictPort and no hardcoded number: nothing here needs a fixed port.
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    port: process.env.PORT ? Number(process.env.PORT) : undefined,
  },
});
