import React, { useState, useContext, useEffect } from "react";
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
    Link,
    Wrap,
    VStack,
    Image,
} from "@chakra-ui/react";
import {
    FaGithub,
    FaLinkedin,
    FaTwitter,
    FaInstagram,
    FaLine,
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { supabase } from "../helper/supabase";
import useWindowDimensions from "../helper/dimensions";
import { UserContext } from "../helper/UserContext";
import payQr from "../assets/payqr.png";

export default function Payment() {
    const [club, setClub] = useState("");
    const [amount, setAmount] = useState("");
    const [athletes, setAthletes] = useState([]);
    const [id, setId] = useState("");

    let { width } = useWindowDimensions();

    const { user, setUser } = useContext(UserContext);

    const navigate = useNavigate();

    const calculateAmount = async (club, id) => {
        const fee = 800;
        let allAmount = 0;
        //fetch how many athletes in the club
        //multiply by 1000
        //setAmount
        const { data, error } = await supabase
            .from("athletes")
            .select("*")
            .eq("club", club)
            .eq("created_by", id)
            .eq("payment_status", "unconfirmed");
        if (error) {
            alert(error.message);
        } else {
            setAthletes(data);
        }
        for (let i = 0; i < data.length; i++) {
            allAmount += fee;
        }

        setAmount(allAmount);
    };

    const fetchClub = async () => {
        const { data, error } = await supabase
            .from("users")
            .select("*")
            .eq("id", user);
        if (error) {
            alert(error.message);
        }
        setClub(data[0].club);
        setId(data[0].id);
        calculateAmount(data[0].club, data[0].id);
    };

    const handlePayment = async () => {
        //update payment_status to waiting to confirm
        //alert success
        //navigate to dashboard
        const { data, error } = await supabase
            .from("athletes")
            .update({ payment_status: "waiting to confirm" })
            .eq("club", club)
            .eq("created_by", id)
            .eq("payment_status", "unconfirmed");

        if (error) {
            alert(error.message);
        } else {
            alert(
                "ขอบคุณที่สมัครเข้าร่วมการแข่งขัน โปรดกรุณารอการยืนยันการชำระเงินจากเจ้าหน้าที่ ขอบคุณครับ"
            );
            navigate("/dashboard");
        }
    };

    useEffect(() => {
        //fetch club name from user id
        //setClub
        if (user) {
            fetchClub();
        } else {
            navigate("/dashboard");
        }
    }, []);

    return (
        <VStack maxW={width} align="start" p="1rem" spacing="1rem">
            <Heading>ชำระเงิน</Heading>
            <Text>ชื่อชมรม: {club}</Text>
            <Text>จำนวนนักกีฬาที่ยังไม่ได้ชำระเงิน: {athletes.length} คน</Text>
            {athletes.length > 0 ? (
                <VStack alignItems="start">
                    {athletes.map((athlete) => (
                        <Text key={athlete.id}>
                            นักกีฬา: {athlete.name_thai} {athlete.surname_thai}
                        </Text>
                    ))}
                </VStack>
            ) : null}
            <Text>จำนวนเงินที่ต้องชำระ: {amount} บาท</Text>
            <Image src={payQr} fit="scale-down" boxSize="300px" />
            <Text>
                ธ.กสิกรไทย ชื่อบัญชี เบญจ์ บวรรนนทกมล เลขที่บัญชี 743-2-50524-8
                โทร 0982893299
            </Text>
            <Text>
                เมื่อทำการชำระเงินผ่าน qrcode เรียบร้อยแล้ว
                ให้ส่งหลักฐานการโอนเงินไปที่ไลน์ Official
                คลิ้กปุ่มด้านล่างเพื่อแอดไลน์ Official
            </Text>
            <Button
                onClick={() => {
                    location.href = "https://lin.ee/ueepXOh";
                }}
            >
                <Link>ส่งหลักฐานการโอนเงิน</Link>
            </Button>

            {athletes.length > 0 ? (
                <Button variant="primary" onClick={handlePayment}>
                    ชำระเงิน
                </Button>
            ) : null}
        </VStack>
    );
}
