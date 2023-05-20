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
    Wrap,
    VStack,
    Image,
} from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../helper/supabase";
import useWindowDimensions from "../helper/dimensions";
import { UserContext } from "../helper/UserContext";
import payQr from "../assets/payqr.jpg";

export default function Payment() {
    const [club, setClub] = useState("");
    const [amount, setAmount] = useState("");
    const [athletes, setAthletes] = useState([]);

    let { width } = useWindowDimensions();

    const { user, setUser } = useContext(UserContext);

    const navigate = useNavigate();

    const calculateAmount = async (club) => {
        const fee = 800;
        let allAmount = 0;
        //fetch how many athletes in the club
        //multiply by 1000
        //setAmount
        const { data, error } = await supabase
            .from("athletes")
            .select("*")
            .eq("club", club)
            .eq("payment_status", "unconfirmed");
        if (error) {
            alert(error.message);
        } else {
            setAthletes(data);
        }
        for (let i = 0; i < data.length; i++) {
            if (data[i].team) {
                allAmount += fee * 2;
            } else {
                allAmount += fee;
            }
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
        calculateAmount(data[0].club);
    };

    const handlePayment = async () => {
        //update payment_status to waiting to confirm
        //alert success
        //navigate to dashboard
        const { data, error } = await supabase
            .from("athletes")
            .update({ payment_status: "waiting to confirm" })
            .eq("club", club)
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
            <Text>จำนวนเงินที่ต้องชำระ: {amount} บาท</Text>
            <Image src={payQr} fit="scale-down" />
            <Text>
                เมื่อทำการชำระเงินผ่าน qrcode เรียบร้อยแล้ว ให้ส่งสลิปไปที่
                lineID: firstzawork พร้อมแจ้งชื่อสังกัด
                เพื่อยืนยันการชำระเงินครับ
            </Text>
            {athletes.length > 0 ? (
                <Button variant="primary" onClick={handlePayment}>
                    ชำระเงิน
                </Button>
            ) : null}
        </VStack>
    );
}
