/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Inter", "ui-sans-serif", "system-ui", "sans-serif"]
      },
      colors: {
        ink: "#172033",
        mist: "#eef3f8",
        ocean: "#2563eb",
        ember: "#dc2626",
        leaf: "#16a34a"
      },
      boxShadow: {
        panel: "0 18px 55px rgba(23, 32, 51, 0.10)"
      }
    }
  },
  plugins: []
};
