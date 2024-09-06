/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./public/**/*.{html,js}"],
  theme: {
    extend: {
      colors: {
        blueBackground: "rgb(26 68 111)",
        backupBackground: "rgb(109 218 207)",
        purpleBackground:"#6d28d9",
        lighterBlue :"#768fa9"
        
      },
      container: {
        center: true,
        padding: "2rem",
      },
    },
  },
  plugins: [],
};
