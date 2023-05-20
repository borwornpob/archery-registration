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
import { UserContext } from "../helper/UserContext";
import Cookies from "js-cookie";

export default function Login() {
    const [nationalID, setNationalID] = useState("");
    const [password, setPassword] = useState("");

    let { width } = useWindowDimensions();

    const { user, setUser } = useContext(UserContext);

    const navigate = useNavigate();

    const handleLogin = async () => {
        const { data, error } = await supabase
            .from("users")
            .select("*")
            .eq("id", nationalID);

        if (error) {
            alert(error.message);
        } else {
            if (data.length === 0) {
                alert("ไม่พบผู้ใช้งาน");
            } else {
                if (data[0].password === password) {
                    Cookies.set("user", data[0].id, { expires: 1 });
                    setUser(nationalID);
                    navigate("/dashboard");
                } else {
                    alert("รหัสผ่านไม่ถูกต้อง");
                }
            }
        }
    };

    useEffect(() => {
        const cookie = Cookies.get("user");
        if (cookie) {
            navigate("/dashboard");
        }
    }, []);

    return (
        <Container>
            <Heading>เข้าสู่ระบบ</Heading>
            <Wrap spacing="1rem">
                <FormControl id="nationalID" isRequired>
                    <FormLabel>รหัสประจำตัวประชาชน</FormLabel>
                    <Input
                        placeholder="รหัสประจำตัวประชาชน"
                        value={nationalID}
                        onChange={(e) => {
                            setNationalID(e.target.value);
                        }}
                    />
                </FormControl>
                <FormControl id="password" isRequired>
                    <FormLabel>รหัสผ่าน</FormLabel>
                    <Input
                        type="password"
                        placeholder="รหัสผ่าน"
                        value={password}
                        onChange={(e) => {
                            setPassword(e.target.value);
                        }}
                    />
                </FormControl>
                <Button
                    size="lg"
                    variant="primary"
                    onClick={() => {
                        handleLogin();
                    }}
                >
                    <Text>เข้าสู่ระบบ</Text>
                </Button>
            </Wrap>
        </Container>
    );
}
