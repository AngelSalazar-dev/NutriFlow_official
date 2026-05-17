/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        primary: "#10b981",       // Verde suave de acento
        emerald: {
          50: "#eefdf5",
          100: "#d1fae5",
          500: "#10b981",
          600: "#059669",
          700: "#047857",
          900: "#064e3b",
        },
        background: "#0F0F0F",    // Fondo ultra oscuro minimalista
        card: "#171717",          // Fondo de tarjetas
        border: "#262626",        // Bordes finos
        muted: {
          DEFAULT: "#737373",     // Texto secundario grisáceo
          foreground: "#A3A3A3",
        },
      },
    },
  },
  plugins: [],
};
