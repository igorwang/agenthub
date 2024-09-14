import { nextui } from "@nextui-org/theme";

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        card: "hsl(0, 0%, 96.1%)",
      },
    },
  },
  darkMode: "class",
  plugins: [
    nextui(),
    require("@tailwindcss/typography"),
    require("tailwind-scrollbar"),
    function ({ addComponents }) {
      addComponents({
        ".custom-scrollbar": {
          "@apply overflow-auto scrollbar-thin scrollbar-none scrollbar-track-transparent scrollbar-thumb-gray-300 hover:scrollbar-default":
            {},
        },
      });
    },
  ],
};
