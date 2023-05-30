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
import CreatableSelect from "react-select/creatable";
import ChakraReactCreatableSelect from "../components/Select";

export default function Register() {
    const [nameThai, setNameThai] = useState("");
    const [nameEng, setNameEng] = useState("");
    const [surnameThai, setSurnameThai] = useState("");
    const [surnameEng, setSurnameEng] = useState("");
    const [club, setClub] = useState("");
    const [clubCode, setClubCode] = useState("");
    const [phoneNumber, setPhoneNumber] = useState("");
    const [nationalID, setNationalID] = useState("");
    const [password, setPassword] = useState("");
    const [clubs, setClubs] = useState([]);
    const [clubsCode, setClubsCode] = useState([]);
    const [clubData, setClubData] = useState({});

    let { width } = useWindowDimensions();

    const navigate = useNavigate();

    const handleRegister = async () => {
        if (checkRegisterData()) {
            if (checkIfUserExists()) {
                addClubIfNotExist();
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
                        club_code: clubCode,
                    },
                ]);
                if (error) {
                    alert(error.message);
                } else {
                    asyncFetchClubs();
                    alert("ลงทะเบียนสำเร็จ");
                    navigate("/");
                }
            } else {
                alert("มีผู้ใช้งานนี้แล้ว");
            }
        } else {
            alert("กรุณากรอกข้อมูลให้ครบ");
        }
    };

    const asyncFetchClubs = async () => {
        const { data, error } = await supabase.from("clubs").select("*");
        if (error) {
            alert(error.message);
        } else {
            const optionClubName = data.map((club) => {
                return { value: club.club_name, label: club.club_name };
            });
            const optionClubCode = data.map((club) => {
                return { value: club.club_code, label: club.club_code };
            });
            setClubs(optionClubName);
            setClubsCode(optionClubCode);
            setClubData(data);
        }
    };

    useEffect(() => {
        asyncFetchClubs();
    }, []);

    const checkIfUserExists = async () => {
        const { data, error } = await supabase
            .from("users")
            .select("*")
            .eq("id", nationalID);
        if (error) {
            alert(error.message);
        } else {
            if (data.length === 0) {
                return false;
            } else {
                return true;
            }
        }
    };

    const addClubIfNotExist = async () => {
        const { data, error } = await supabase
            .from("clubs")
            .select("*")
            .eq("club_name", club);
        if (error) {
            alert(error.message);
        } else {
            if (data.length === 0) {
                const { data, error } = await supabase.from("clubs").insert([
                    {
                        club_name: club,
                        club_code: clubCode,
                    },
                ]);
                if (error) {
                    alert(error.message);
                } else {
                    alert("เพิ่มชมรมสำเร็จ");
                }
            }
        }
    };

    const checkThaiNationalID = (nationalID) => {
        const regexID =
            /(\d{13})|(\d{1}\s\d{4}\s\d{5}\s\d{2}\s\d{1})|(\d{5}\s\d{5}\s\d{3})|(\d{5}\s\d{5}\s\d{2}\s\d{1})|(\d{1}\-?\d{4}\-?\d{5}\-?\d{2}\-?\d{1})/g;
        if (regexID.test(nationalID)) {
            return true;
        }
        return false;
    };

    const checkRegisterData = () => {
        if (
            nameThai === "" ||
            nameEng === "" ||
            surnameThai === "" ||
            surnameEng === "" ||
            club === "" ||
            phoneNumber === "" ||
            nationalID === "" ||
            password === "" ||
            (clubCode === "" && clubCode.length > 7)
        ) {
            return false;
        } else {
            return true;
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
                    <ChakraReactCreatableSelect
                        options={clubs}
                        onChange={(e) => {
                            setClub(e.value);
                            if (
                                clubData.find((c) => c.club_name === e.value)
                                    ?.club_code
                            ) {
                                setClubCode(
                                    clubData.find(
                                        (c) => c.club_name === e.value
                                    )?.club_code
                                );
                            } else {
                                setClubCode("");
                            }
                        }}
                    />
                </FormControl>
                {clubCode != "" &&
                clubData.find((c) => c.club_name === club)?.club_code ? (
                    <FormControl id="clubCode" isRequired>
                        <FormLabel>รหัสชมรม</FormLabel>
                        <Input
                            placeholder="รหัสชมรม"
                            value={clubCode}
                            readOnly
                        />
                    </FormControl>
                ) : (
                    <FormControl id="clubCode" isRequired>
                        <FormLabel>รหัสชมรม</FormLabel>
                        <Input
                            placeholder="รหัสชมรม"
                            value={clubCode}
                            onChange={(e) => setClubCode(e.target.value)}
                        />
                    </FormControl>
                )}
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
