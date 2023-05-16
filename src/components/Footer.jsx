import {
  ButtonGroup,
  Container,
  IconButton,
  Stack,
  Text,
  Image,
} from "@chakra-ui/react";
import * as React from "react";
import {
  FaGithub,
  FaLinkedin,
  FaTwitter,
  FaInstagram,
  FaLine,
} from "react-icons/fa";

export default function Footer() {
  return (
    <Container
      as="footer"
      position="relative"
      bottom="0"
      role="contentinfo"
      py={{
        base: "2",
        md: "2",
      }}
    >
      <Stack>
        <Stack justify="space-between" direction="row" align="center">
          <Text>Borwornpob.</Text>
          <ButtonGroup variant="ghost">
            <IconButton
              as="a"
              onClick={() => {
                location.href = "https://instagram.com/first_bfr";
              }}
              aria-label="Instagram"
              icon={<FaInstagram fontSize="1.25rem" />}
            />
            <IconButton
              as="a"
              onClick={() => {
                location.href = "https://line.me/R/ti/p/%40cud_sapa";
              }}
              aria-label="Line"
              icon={<FaLine fontSize="1.25rem" />}
            />
            <IconButton
              as="a"
              onClick={() => {
                location.href = "https://github.com/borwornpob";
              }}
              aria-label="GitHub"
              icon={<FaGithub fontSize="1.25rem" />}
            />
          </ButtonGroup>
        </Stack>
        <Text fontSize="sm" color="subtle">
          &copy; {new Date().getFullYear()} Borwornpob Thumrongchotikhun. All
          rights reserved.
        </Text>
      </Stack>
    </Container>
  );
}
