import { Image, Flex, chakra, Link, HStack, Text } from "@chakra-ui/react";
//import your logo here!
//import Logo from "../assets/logo.png";
import { Link as routerLink } from "react-router-dom";
import React from "react";
import MobileDrawer from "./MobileDrawer";
import pages from "../helper/routes";

export default function Header() {
  return (
    <chakra.header id="header">
      <Flex w="100%" px="6" py="5" align="center" justify="space-between">
        <Text>Borwornpob.</Text>
        <HStack as="nav" spacing="4" display={{ base: "none", md: "flex" }}>
          {pages.map((page, i) => (
            <Link key={i} as={routerLink} to={page.path}>
              {page.name}
            </Link>
          ))}
        </HStack>
        <MobileDrawer
          pages={() => {
            return pages;
          }}
        />
      </Flex>
    </chakra.header>
  );
}
