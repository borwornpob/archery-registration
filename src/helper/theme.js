import { color, extendTheme } from "@chakra-ui/react";

const config = {
    styles: {
        global: {
            "html, body": {
                color: "brand.200",
            },
        },
    },
    colors: {
        brand: {
            100: "#09100d",
            200: "#ebf4f0",
            300: "#55734e",
            400: "#ffffff",
            500: "#386653",
        },
    },
};

const theme = extendTheme({ config });

export default theme;
