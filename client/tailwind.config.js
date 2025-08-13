/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        messenger: {
          blue: "#0084FF",
          grey: "#3E4042",
        },
      },
    },
  },
  plugins: [require("tailwind-scrollbar")],
};
