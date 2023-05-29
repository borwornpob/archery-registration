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
                <Text w={width}>
                    1. ลงทะเบียนเพื่อรับ username/password
                    เพื่อใช้สำหรับการสมัครเข้าร่วมการแข่งขัน
                </Text>
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
                <Text w={width}>
                    2. สมัครเข้าร่วมการแข่งขัน โดยใช้เลขบัตรประจำตัวบัตรประชาชน
                    และ password ที่ได้ทำการลงทะเบียนไว้แล้ว
                </Text>
                <Button
                    size="lg"
                    variant="secondary"
                    width={width}
                    onClick={() => {
                        navigate("/login");
                    }}
                >
                    <Text>สมัครเข้าร่วมการแข่งขัน</Text>
                </Button>
                <Text w={width}>
                    หลังจากยืนยันการสมัคร ให้ทำการชำระเงินค่าสมัครภายใน 24
                    ชั่วโมง
                </Text>
                <Text w={width}>
                    สามารถส่งหลักฐานการชำระเงินค่าสมัครได้ที่ lineID: @562rlwol
                </Text>
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
