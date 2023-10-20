import React, { useState, useContext, useEffect } from "react";
import {
    Container,
    Heading,
    Text,
    Button,
    Table,
    Thead,
    Tbody,
    Tfoot,
    Tr,
    Th,
    Td,
    TableCaption,
    TableContainer,
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody,
    ModalCloseButton,
    useDisclosure,
    VStack,
    FormControl,
    FormLabel,
    FormErrorMessage,
    FormHelperText,
    Input,
    Select,
    HStack,
    Wrap,
} from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../helper/supabase";
import useWindowDimensions from "../helper/dimensions";

export default function AthleteCheck() {
    const [athletes, setAthletes] = useState([]);
    const [search, setSearch] = useState("");
    const [searchResult, setSearchResult] = useState([]);

    const fetchAthletes = async () => {
        const { data, error } = await supabase
            .from("athletes")
            .select("*")
            .order("created_at", { ascending: false });
        if (error) {
            alert(error.message);
        } else {
            setAthletes(data);
            setSearchResult(data);
        }
    };

    const searchAthlete = (search) => {
        const result = athletes.filter((athlete) => {
            return (
                athlete.name_thai.includes(search) ||
                athlete.name_english
                    .toLowerCase()
                    .includes(search.toLowerCase()) ||
                athlete.team_name.toLowerCase().includes(search.toLowerCase())
            );
        });
        setSearchResult(result);
    };

    useEffect(() => {
        fetchAthletes();
    }, []);

    useEffect(() => {
        searchAthlete(search);
    }, [search]);

    let { width } = useWindowDimensions();

    return (
        <Wrap spacing="1rem" p="1rem">
            <Heading>ตรวจสอบรายชื่อนักกีฬา</Heading>
            <Input
                placeholder="ค้นหา"
                value={search}
                onChange={(e) => {
                    setSearch(e.target.value);
                }}
            />
            <TableContainer width={width}>
                <Table variant="simple" backgroundColor="brand.400">
                    <Thead>
                        <Tr>
                            <Th color="brand.100">ID</Th>
                            <Th color="brand.100">ชื่อ</Th>
                            <Th color="brand.100">นามสกุล</Th>
                            <Th color="brand.100">Division</Th>
                            <Th color="brand.100">Class</Th>
                            <Th color="brand.100">Club</Th>
                        </Tr>
                    </Thead>
                    <Tbody>
                        {searchResult.map((athlete) => (
                            <Tr key={athlete.id}>
                                <Td color="brand.100">{athlete.id}</Td>
                                <Td color="brand.100">{athlete.name_thai}</Td>
                                <Td color="brand.100">
                                    {athlete.surname_thai}
                                </Td>
                                <Td color="brand.100">{athlete.division}</Td>
                                <Td color="brand.100">{athlete.class}</Td>
                                <Td color="brand.100">{athlete.club}</Td>
                            </Tr>
                        ))}
                    </Tbody>
                </Table>
            </TableContainer>
        </Wrap>
    );
}
