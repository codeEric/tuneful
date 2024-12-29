/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: ["./src/**/*.{html,ts}"],
  theme: {
    extend: {
      colors: {
        "light-revolver": "#e6e8eb",
        "light-gunmetal": "#d1d2d4",
        "revolver": "#161a21",
        "gunmetal": "#242529",
        "prime-green": "#34d399",
        "prime-green-hover": "#1ba472",
        "prime-green-light": "#64d9aa",
        "prime-green-light-50": "#6ee7b70d",
        "prime-green-light-100": "#6ee7b71a",
        "prime-green-light-150": "#6EE7B726",
        "prime-green-light-500": "#6ee7b780",
      },
      dropShadow: {
        card: "5px 8px 4px rgba(0,0,0,0.3)",
      },
    },
  },
  plugins: [],
};
