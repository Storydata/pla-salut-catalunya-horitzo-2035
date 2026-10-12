/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./src/**/*.{html,js,svelte,ts}",
    "./node_modules/flowbite-svelte/**/*.{html,js,svelte,ts}",
  ],
  theme: {
    extend: {
      // El `container` de Tailwind no porta padding per defecte: sense aixo el
      // text toca la vora de la pantalla al mobil a totes les seccions.
      container: {
        padding: {
          DEFAULT: "1.25rem",
          md: "1.5rem",
          lg: "2rem",
        },
      },
      fontFamily: {
        segoe: ["'Segoe UI'", "Tahoma", "sans-serif"],
        abhaya: ["'Abhaya Libre'", "serif"],
        inter: ["'Inter'", "sans-serif"]
      },
      keyframes: {
        "pulse-slow": {
          "0%, 100%": { transform: "scale(1)" },
          "50%": { transform: "scale(1.05)" },
        },
      },
      animation: {
        "pulse-slow": "pulse-slow 3s ease-in-out infinite",
      },
      colors: {
        // flowbite-svelte colors
        primary: {
          50: "#FFF5F2",
          100: "#FFF1EE",
          200: "#FFE4DE",
          300: "#FFD5CC",
          400: "#FFBCAD",
          500: "#FE795D",
          600: "#EF562F",
          700: "#EB4F27",
          800: "#CC4522",
          900: "#A5371B",
        },
      },
    },
  },
  plugins: [require("flowbite/plugin")],
  darkMode: "class",
};
