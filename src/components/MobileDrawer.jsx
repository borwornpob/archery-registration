import {
    useDisclosure,
    Flex,
    Button,
    VStack,
    Icon,
    Link as ChakraLink,
} from "@chakra-ui/react";
import CustomDrawer from "./CustomDrawer";
import { IoMdMenu } from "react-icons/io";
import React from "react";
import pages from "../helper/routes";

export default function MobileDrawer() {
    const { isOpen, onOpen, onClose } = useDisclosure();
    const btnRef = React.useRef();

    //your path to pages

    return (
        <Flex display={{ base: "flex", md: "none" }}>
            <Button ref={btnRef} onClick={onOpen}>
                <IoMdMenu size="26px" />
            </Button>
            <CustomDrawer
                isOpen={isOpen}
                onClose={onClose}
                finalFocusRef={btnRef}
            >
                <VStack alignItems="left">
                    {pages.map((page, i) => (
                        <ChakraLink key={i} href={page.path}>
                            <Button variant="text">{page.name}</Button>
                        </ChakraLink>
                    ))}
                </VStack>
            </CustomDrawer>
        </Flex>
    );
}
