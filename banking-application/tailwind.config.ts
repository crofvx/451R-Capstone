import flowbite from "flowbite-react/tailwind";
import type { Config } from "tailwindcss";

const config: Config = {
  mode: 'jit',
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    flowbite.content(),
  ],
  theme: {
    extend: {
      colors: {
        "dark-green": "#016747",
        "light-green": "#78BE21",
        "yellow": "#FFD007",
        "light-blue": "#02B5E2",
        "blue-gray": "#A6CADB",
        "white": "#F7F9FA"
      },
    },
  },
  plugins: [flowbite.plugin()],
};
export default config;
