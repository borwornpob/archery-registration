import React, { useState, useEffect, useContext } from "react";
import {
    Container,
    Heading,
    Text,
    FormControl,
    FormLabel,
    FormErrorMessage,
    FormHelperText,
    Input,
    Button,
    Wrap,
} from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../helper/supabase";
import useWindowDimensions from "../helper/dimensions";

export default function Register() {
    const [nameThai, setNameThai] = useState("");
    const [nameEng, setNameEng] = useState("");
    const [surnameThai, setSurnameThai] = useState("");
    const [surnameEng, setSurnameEng] = useState("");
    const [club, setClub] = useState("");
    const [phoneNumber, setPhoneNumber] = useState("");
    const [nationalID, setNationalID] = useState("");
    const [password, setPassword] = useState("");

    const { user, setUser } = useContext(UserContext);

    let { width } = useWindowDimensions();

    const navigate = useNavigate();

    const handleRegister = async () => {
        const { data, error } = await supabase.from("users").insert([
            {
                name_thai: nameThai,
                name_english: nameEng,
                surname_thai: surnameThai,
                surname_english: surnameEng,
                club: club,
                phonenumber: phoneNumber,
                id: nationalID,
                password: password,
            },
        ]);
        if (error) {
            alert(error.message);
        } else {
            alert("ลงทะเบียนสำเร็จ");
            navigate("/");
        }
    };

    return (
        <Container>
            <Heading>ลงทะเบียน</Heading>
            <Wrap spacing="1rem">
                <FormControl id="nameThai" isRequired>
                    <FormLabel>ชื่อ</FormLabel>
                    <Input
                        placeholder="ชื่อ"
                        value={nameThai}
                        onChange={(e) => setNameThai(e.target.value)}
                    />
                </FormControl>
                <FormControl id="surnameThai" isRequired>
                    <FormLabel>นามสกุล</FormLabel>
                    <Input
                        placeholder="นามสกุล"
                        value={surnameThai}
                        onChange={(e) => setSurnameThai(e.target.value)}
                    />
                </FormControl>
                <FormControl id="nameEng" isRequired>
                    <FormLabel>ชื่อ (ภาษาอังกฤษ)</FormLabel>
                    <Input
                        placeholder="ชื่อ (ภาษาอังกฤษ)"
                        value={nameEng}
                        onChange={(e) => setNameEng(e.target.value)}
                    />
                </FormControl>
                <FormControl id="surnameEng" isRequired>
                    <FormLabel>นามสกุล (ภาษาอังกฤษ)</FormLabel>
                    <Input
                        placeholder="นามสกุล (ภาษาอังกฤษ)"
                        value={surnameEng}
                        onChange={(e) => setSurnameEng(e.target.value)}
                    />
                </FormControl>
                <FormControl id="club" isRequired>
                    <FormLabel>ชมรม</FormLabel>
                    <Input
                        placeholder="ชมรม"
                        value={club}
                        onChange={(e) => setClub(e.target.value)}
                    />
                </FormControl>
                <FormControl id="phoneNumber" isRequired>
                    <FormLabel>เบอร์โทรศัพท์</FormLabel>
                    <Input
                        placeholder="เบอร์โทรศัพท์"
                        value={phoneNumber}
                        onChange={(e) => setPhoneNumber(e.target.value)}
                    />
                </FormControl>
                <FormControl id="nationalID" isRequired>
                    <FormLabel>เลขประจำตัวประชาชน</FormLabel>
                    <Input
                        placeholder="เลขประจำตัวประชาชน"
                        value={nationalID}
                        onChange={(e) => setNationalID(e.target.value)}
                    />
                </FormControl>
                <FormControl id="password" isRequired>
                    <FormLabel>รหัสผ่าน</FormLabel>
                    <Input
                        placeholder="รหัสผ่าน"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                </FormControl>
                <Button
                    onClick={() => {
                        handleRegister();
                    }}
                    width={width}
                >
                    <Text>ลงทะเบียน</Text>
                </Button>
            </Wrap>
        </Container>
    );
}
