import React from "react";
import CreatableSelect from "react-select/creatable";
import { useTheme, Box } from "@chakra-ui/react";

const ChakraReactCreatableSelect = ({ options, ...props }) => {
    const theme = {
        100: "#09100d",
        200: "#ebf4f0",
        300: "#55734e",
        400: "#ffffff",
        500: "#386653",
    };

    return (
        <Box width="100%">
            <CreatableSelect
                {...props}
                options={options}
                styles={{
                    control: (provided) => ({
                        ...provided,
                        backgroundColor: theme[400],
                        borderColor: theme[100],
                        ":hover": {
                            borderColor: theme[100],
                        },
                    }),
                    option: (provided, state) => ({
                        ...provided,
                        backgroundColor: state.isSelected
                            ? theme[300]
                            : state.isFocused
                            ? theme[300]
                            : "transparent",
                        color: state.isSelected
                            ? theme[400]
                            : state.isFocused
                            ? theme[400]
                            : theme[100],
                        ":active": {
                            backgroundColor: theme[500],
                        },
                    }),
                }}
            />
        </Box>
    );
};

export default ChakraReactCreatableSelect;
