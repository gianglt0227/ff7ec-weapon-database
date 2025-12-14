/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        "./index.html",
        "./scripts.js"
    ],
    darkMode: "class",
    theme: {
        extend: {
            colors: {
                primary: "#10B981",
                "primary-dark": "#059669",
                "background-light": "#FFF7ED",
                "background-dark": "#18181B",
                "card-light": "#FFFFFF",
                "card-dark": "#27272A",
                "text-main-light": "#3F3F46",
                "text-main-dark": "#E4E4E7",
                "text-muted-light": "#71717A",
                "text-muted-dark": "#A1A1AA",
            },
            fontFamily: {
                display: ["Cinzel", "serif"],
                sans: ["Inter", "sans-serif"],
            },
        },
    },
    plugins: [
        require('@tailwindcss/forms'),
        require('@tailwindcss/typography'),
    ],
}
