/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        gray: {
          light: "#9CA3AF", 
          deep: "#111827",
          dark: "#1e1e1e",
          medium: "#374151",
        },
        orange: { 
          light: "#FF844B",
          deep: "#772600",
          dark: "#241300",
          medium: "#63391C",
        },
        blue: {
          light: "#30c0f9",  
          medium: "#15a2f1",  
          DEFAULT: "#33c3fa",  
        },
        green: {
          light: "#5CB946",
          deep: "#135E2F",
          dark: "#003619",
          medium: "#12311E",
        },
      },
      
    },
  },
  plugins: [],
};