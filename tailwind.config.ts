import type { Config } from "tailwindcss";
const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"], darkMode: "class",
  theme: { extend: { colors: { brand: { 400: "#facc15", 500: "#eab308", 600: "#ca8a04", 700: "#a16207" } } } },
  plugins: [],
};
export default config;
