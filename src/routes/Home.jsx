import {
    Container,
    Heading,
    Text,
    VStack,
    HStack,
    Button,
} from "@chakra-ui/react";
import React, { useState, useContext } from "react";
import { UserContext } from "../helper/UserContext";
import { useNavigate } from "react-router-dom";
import useWindowDimensions from "../helper/dimensions";

export default function Home() {
    const { user, setUser } = useContext(UserContext);
    const navigate = useNavigate();

    let { width } = useWindowDimensions();
    width = width * 0.88;

    return (
        <Container>
            <VStack>
                <Heading w={width}>
                    สมัครเข้าร่วมการแข่งขัน "ศาลายา เกมส์ 2023" ได้ที่นี่
                </Heading>
                <Button
                    size="lg"
                    variant="primary"
                    width={width}
                    onClick={() => {
                        navigate("/register");
                    }}
                >
                    <Text>ลงทะเบียน</Text>
                </Button>
                <Button
                    size="lg"
                    variant="secondary"
                    width={width}
                    onClick={() => {
                        navigate("/login");
                    }}
                >
                    <Text>เข้าสู่ระบบ</Text>
                </Button>
                <Button
                    size="lg"
                    variant="secondary"
                    width={width}
                    onClick={() => {
                        navigate("/athletecheck");
                    }}
                >
                    <Text>ตรวจสอบรายชื่อนักกีฬา</Text>
                </Button>
            </VStack>
        </Container>
    );
}
