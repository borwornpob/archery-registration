import {
    Container,
    Heading,
    Text,
    VStack,
    HStack,
    Button,
    useDisclosure,
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody,
    ModalCloseButton,
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

    const { isOpen, onOpen, onClose } = useDisclosure();

    return (
        <Container>
            <VStack>
                <Heading w={width}>
                    สมัครเข้าร่วมการแข่งขันยิงธนู "บ่อทองบุรี เกมส์ 2023"
                    ได้ที่นี่
                </Heading>
                <Heading color="red">ปิดปรับปรุงระบบ</Heading>
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
                    ชั่วโมง เพื่อรักษาสิทธิ์การสมัคร
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
                <Button
                    size="lg"
                    variant="secondary"
                    width={width}
                    onClick={onOpen}
                >
                    <Text>นโยบายความเป็นส่วนตัว</Text>
                </Button>

                <Modal isOpen={isOpen} onClose={onClose}>
                    <ModalOverlay />
                    <ModalContent>
                        <ModalHeader>Privacy Policy</ModalHeader>
                        <ModalCloseButton />
                        <ModalBody>
                            <Text>
                                This Privacy Policy describes how your personal
                                information is collected, used, and shared when
                                you sign up for the Bothongburi Game 2023.
                            </Text>
                            <Container mt="1rem" p={0}>
                                <Text fontSize="2xl" as="b">
                                    PERSONAL INFORMATION WE COLLECT
                                </Text>
                            </Container>

                            <Text>
                                When you register, we collect certain
                                information from you, including your name,
                                email, national ID, and phone number.
                            </Text>
                            <Container mt="1rem" p={0}>
                                <Text fontSize="2xl" as="b">
                                    HOW DO WE USE YOUR PERSONAL INFORMATION?
                                </Text>
                            </Container>

                            <Text>
                                We use the information we collect to: Register
                                you for the Bothongburi Game 2023 Communicate
                                with you Provide you with information or
                                advertising relating to our products or services
                            </Text>
                            <Container mt="1rem" p={0}>
                                <Text fontSize="2xl" as="b">
                                    SHARING YOUR PERSONAL INFORMATION
                                </Text>
                            </Container>

                            <Text>
                                We do not share your Personal Information with
                                third parties. We only use your information to
                                ensure your successful participation in the
                                Bothongburi Game 2023.
                            </Text>
                            <Container mt="1rem" p={0}>
                                <Text fontSize="2xl" as="b">
                                    YOUR RIGHTS
                                </Text>
                            </Container>
                            <Text>
                                You have the right to access the personal
                                information we hold about you and to ask that
                                your personal information be updated, corrected,
                                or deleted. If you would like to exercise this
                                right, please contact us through the contact
                                information below.
                            </Text>
                            <Container mt="1rem" p={0}>
                                <Text fontSize="2xl" as="b">
                                    CONTACT US
                                </Text>
                            </Container>
                            <Text>
                                For more information about our privacy
                                practices, if you have questions, or if you
                                would like to make a complaint, please contact
                                us by lineID: @youngblood.archery
                            </Text>
                        </ModalBody>
                    </ModalContent>
                </Modal>
            </VStack>
        </Container>
    );
}
