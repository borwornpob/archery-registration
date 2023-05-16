import { inputAnatomy as parts } from "@chakra-ui/anatomy";
import {
    createMultiStyleConfigHelpers,
    defineStyle,
} from "@chakra-ui/styled-system";

const { definePartsStyle, defineMultiStyleConfig } =
    createMultiStyleConfigHelpers(parts.keys);

const baseStyle = definePartsStyle({
    field: {
        width: "100%",
        minWidth: 0,
        outline: 0,
        position: "relative",
        appearance: "none",
        transitionProperty: "common",
        transitionDuration: "normal",
        _disabled: {
            opacity: 0.4,
            cursor: "not-allowed",
        },
    },
});

const variantOutline = definePartsStyle((props) => {
    return {
        field: {
            border: "1px solid",
            borderColor: "brand.100",
            _hover: {
                borderColor: "brand.100",
            },
            _focus: {
                zIndex: 1,
                borderColor: "brand.100",
                boxShadow: "outline",
            },
        },
    };
});

const variants = {
    outline: variantOutline,
};

export const Input = defineMultiStyleConfig({
    baseStyle,
    variants,
    defaultProps: {
        variant: "outline",
    },
});
