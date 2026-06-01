/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}"],
  theme: {
    extend: {
      colors: {
        brand: {
          ink:     "#0f0f0f",   // near-black — nav, footer, headings
          cream:   "#f0e8d8",   // warm cream — page background (from Glyphy)
          paper:   "#ffffff",   // white — cards, input fields
          green:   "#16a34a",   // primary CTA — cannabis green
          orange:  "#f97316",   // warm accent — stat bar, badges
          muted:   "#6b7280",   // secondary text, metadata
          border:  "#e2d8c8",   // warm border — matches cream bg
        },
        status: {
          open:    "#16a34a",
          closed:  "#ef4444",
          unknown: "#9ca3af",
        },
      },
      fontFamily: {
        sans: [
          "Inter", "system-ui", "-apple-system", "BlinkMacSystemFont",
          "Segoe UI", "sans-serif",
        ],
        mono: ["ui-monospace", "SFMono-Regular", "Menlo", "monospace"],
      },
      fontWeight: {
        black: "900",
      },
    },
  },
  plugins: [],
};
