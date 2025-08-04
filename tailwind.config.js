/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#4f46e5",
          hover: "#4338ca",
        },
        secondary: "#6b7280",
      },
      spacing: {
        section: "2rem",
        container: "1rem",
      },
      borderRadius: {
        container: "0.75rem",
      },
    },
  },
  plugins: [],
};
