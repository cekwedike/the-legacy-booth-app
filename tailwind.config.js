/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "./frontend/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Poppins', 'sans-serif'],
        serif: ['Lora', 'serif'],
      },
      colors: {
        'brand-background': '#2C2521', // Deep warm brown
        'brand-surface': '#3A322E',    // Lighter warm brown for cards
        'brand-primary': '#E57A44',    // Burnt Copper as primary action color
        'brand-secondary': '#A9A095',  // Muted, warm gray for secondary text/elements
        'brand-accent': '#E57A44',     // Burnt Copper
        'brand-text-primary': '#F5F0E8', // Creamy off-white
        'brand-text-secondary': '#A9A095', // Muted, warm gray
      }
    }
  },
  plugins: [],
} 