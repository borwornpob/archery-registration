import React from "react";
import ReactDOM from "react-dom/client";
import { ChakraProvider, ColorModeScript, extendTheme } from "@chakra-ui/react";
import { Button } from "./components/Button";
import App from "./App";

const theme = extendTheme({
    styles: {
        global: {
            body: {
                bg: "brand.200",
                color: "brand.100",
                transitionProperty: "brand.300",
            },
            "*::placeholder": {
                color: "brand.200",
            },
            "*, *::before, &::after": {
                borderColor: "brand.200",
            },
        },
    },
    components: {
        Button,
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
});

ReactDOM.createRoot(document.getElementById("root")).render(
    <React.StrictMode>
        <ChakraProvider theme={theme}>
            <App />
        </ChakraProvider>
    </React.StrictMode>
);
