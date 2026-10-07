/** @type {import('tailwindcss').Config} */
export default {
    content: ["./index.html", "./src/**/*.{js,jsx}"],
    theme: {
        extend: {
            colors: {
                //Approximated from CLSU's public brand page (clsu.edu.ph/brand-visual),
                //which describes "CLSU Green" and "CLSU Yellow" but only shows exact
                //swatches as images, not hex codes - swap these for the real values
                //from the university's brand kit if you have them
                ink: {
                    50: "#F1F8F2",
                    100: "#DCEEDF",
                    300: "#8FCB9B",
                    500: "#2E7D32",
                    700: "#1B5E20",
                    900: "#0F2317",
                },
                paper: {
                    DEFAULT: "#FAFAF8",
                    card: "#FFFFFF",
                    line: "#E4E1D8",
                },
                gold: {
                    DEFAULT: "#F2B705",
                    dark: "#C79000",
                    light: "#FDE9A8",
                },
                legend: "#8B7355",
                error: "#A13D2B",
            },
            fontFamily: {
                //Fraunces and Source Sans 3 stand in for CLSU's official Buttershine
                //Serif and Acumin Pro, which are commercial fonts not available on
                //free font services
                serif: ["Fraunces", "Georgia", "serif"],
                sans: ["'Source Sans 3'", "system-ui", "sans-serif"],
                mono: ["'IBM Plex Mono'", "ui-monospace", "monospace"],
            },
        },
    },
    plugins: [],
};
