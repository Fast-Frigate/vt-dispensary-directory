/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}"],
  theme: {
    extend: {
      colors: {
        brand: {
          ink:     "#0f0f0f",   // near-black — nav, dark sections, card backgrounds
          paper:   "#ffffff",   // white — content backgrounds
          green:   "#16a34a",   // primary accent — cannabis green, CTAs
          orange:  "#f97316",   // warm accent — highlights, badges
          muted:   "#6b7280",   // secondary text, metadata
          surface: "#f5f5f5",   // light gray — page background, filter bars
          border:  "#e5e5e5",   // subtle borders, dividers
        },
        status: {
          open:    "#16a34a",
          closed:  "#ef4444",
          unknown: "#6b7280",
        },
      },
      fontFamily: {
        // Clean, modern system stack — no Google Fonts, no display fonts
        sans: [
          "Inter", "system-ui", "-apple-system", "BlinkMacSystemFont",
          "Segoe UI", "sans-serif",
        ],
        mono: ["ui-monospace", "SFMono-Regular", "Menlo", "monospace"],
      },
    },
  },
  plugins: [],
};
