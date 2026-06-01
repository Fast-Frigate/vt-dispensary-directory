/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}"],
  theme: {
    extend: {
      colors: {
        brand: {
          primary:  "#1d4ed8", // placeholder — replace when design is decided
          dark:     "#1e3a5f",
          light:    "#3b82f6",
          muted:    "#93c5fd",
          cream:    "#f8fafc",
          accent:   "#f59e0b",
        },
        status: {
          open:    "#16a34a",
          closed:  "#dc2626",
          unknown: "#6b7280",
        },
      },
      fontFamily: {
        sans: [
          "system-ui", "-apple-system", "BlinkMacSystemFont",
          "Segoe UI", "Roboto", "sans-serif",
        ],
        serif: ["Georgia", "Cambria", "Times New Roman", "serif"],
        mono:  ["ui-monospace", "SFMono-Regular", "Menlo", "monospace"],
      },
    },
  },
  plugins: [],
};
