// tailwind.config.ts
import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class", // Crucial step
  content: [
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  // ... rest of your config
};
export default config;