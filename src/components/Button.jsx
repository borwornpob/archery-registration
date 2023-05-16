import { defineStyleConfig } from "@chakra-ui/react";
import useWindowDimensions from "../helper/dimensions";

export const Button = defineStyleConfig({
    // The styles all button have in common
    baseStyle: {
        fontWeight: "bold",
        textTransform: "uppercase",
        borderRadius: "base", // <-- border radius is same for all variants and sizes
    },
    // Two sizes: sm and md
    sizes: {
        sm: {
            fontSize: "sm",
            px: 4, // <-- px is short for paddingLeft and paddingRight
            py: 3, // <-- py is short for paddingTop and paddingBottom
        },
        md: {
            fontSize: "md",
            px: 6, // <-- these values are tokens from the design system
            py: 4, // <-- these values are tokens from the design system
        },
        lg: {
            fontSize: "lg",
            px: 8, // <-- these values are tokens from the design system
            py: 5, // <-- these values are tokens from the design system
        },
    },
    // Two variants: outline and solid
    variants: {
        primary: {
            bg: "brand.300",
            color: "white",
            _hover: {
                bg: "brand.500",
                color: "white",
            },
        },
        secondary: {
            bg: "brand.400",
            color: "brand.100",
            _hover: {
                bg: "brand.500",
                color: "white",
            },
        },
    },
    // The default size and variant values
    defaultProps: {
        size: "md",
        variant: "primary",
    },
});
