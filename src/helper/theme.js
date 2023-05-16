import { extendTheme } from "@chakra-ui/react";

const config = {
  initialColorMode: "dark",
  useSystemColorMode: true,
  fonts: {
    heading: `'Chakra Petch', sans-serif`,
    body: `'Chakra Petch', sans-serif`,
  },
};

const theme = extendTheme({ config });

export default theme;
