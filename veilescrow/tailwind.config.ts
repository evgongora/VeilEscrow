import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#1E3A8A', // Dark Blue
        secondary: '#1F2937', // Dark Gray
        accent: '#3B82F6', // Light Blue
        background: '#0F172A', // Very Dark Gray
        surface: '#1E293B', // Darker Gray for cards
        text: '#FFFFFF', // White for text
        muted: '#D1D5DB', // Light Gray for descriptions
      },
    },
  },
  plugins: [],
};

export default config;
