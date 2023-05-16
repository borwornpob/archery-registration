import React, { useState, useEffect, useContext } from "react";
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
import { UserContext } from "../helper/UserContext";
import Cookies from "js-cookie";

export default function Dashboard() {
    const { user, setUser } = useContext(UserContext);
    const [personalData, setPersonalData] = useState({});
    const [athletes, setAthletes] = useState([]);
    const [newAthlete, setNewAthlete] = useState({
        name_thai: "",
        name_english: "",
        surname_thai: "",
        surname_english: "",
        sex: "",
        division: "",
        class: "",
        club: "",
        team: null,
        team_name: "",
    });

    const { isOpen, onOpen, onClose } = useDisclosure();

    const fetchPersonalData = async (id) => {
        const { data, error } = await supabase
            .from("users")
            .select("*")
            .eq("id", id);
        if (error) {
            alert(error.message);
        } else {
            setPersonalData(data[0]);
        }
        fetchAthletes(data[0].club);
        setNewAthlete({ ...newAthlete, club: data[0].club });
    };

    const fetchAthletes = async (club) => {
        const { data, error } = await supabase
            .from("athletes")
            .select("*")
            .eq("club", club);
        if (error) {
            alert(error.message);
        } else {
            setAthletes(data);
            console.log(data);
        }
    };

    useEffect(() => {
        const cookie = Cookies.get("user");
        if (!cookie) {
            navigate("/login");
        } else {
            setUser(cookie);
            fetchPersonalData(cookie);
        }
    }, []);

    const navigate = useNavigate();

    let { width } = useWindowDimensions();

    const handleLogout = () => {
        Cookies.remove("user");
        setUser(null);
        navigate("/");
    };

    const checkNewAthlete = () => {
        if (
            newAthlete.name_thai === "" ||
            newAthlete.name_english === "" ||
            newAthlete.surname_thai === "" ||
            newAthlete.surname_english === "" ||
            newAthlete.sex === "" ||
            newAthlete.division === "" ||
            newAthlete.class === "" ||
            newAthlete.club === "" ||
            newAthlete.team === null
        ) {
            return false;
        } else {
            if (newAthlete.team === "true") {
                if (newAthlete.team_name === "") {
                    return false;
                } else {
                    return true;
                }
            } else {
                return true;
            }
        }
    };

    const handleAddAthlete = async () => {
        if (checkNewAthlete()) {
            const { data, error } = await supabase.from("athletes").insert([
                {
                    name_thai: newAthlete.name_thai,
                    name_english: newAthlete.name_english,
                    surname_thai: newAthlete.surname_thai,
                    surname_english: newAthlete.surname_english,
                    sex: newAthlete.sex,
                    division: newAthlete.division,
                    class: newAthlete.class,
                    club: newAthlete.club,
                    team_name: newAthlete.team_name,
                },
            ]);
            if (error) {
                alert(error.message);
            } else {
                alert("เพิ่มนักกีฬาสำเร็จ");
                onClose();
                clearNewAthlete();
                fetchAthletes(newAthlete.club);
            }
        } else {
            alert("กรุณากรอกข้อมูลให้ครบถ้วน");
        }
    };

    const clearNewAthlete = () => {
        setNewAthlete({
            name_thai: "",
            name_english: "",
            surname_thai: "",
            surname_english: "",
            sex: "",
            division: "",
            class: "",
            club: newAthlete.club,
            team: null,
            team_name: "",
        });
    };

    const handleDeleteAthlete = async (id) => {
        const { data, error } = await supabase
            .from("athletes")
            .delete()
            .eq("id", id);
        if (error) {
            alert(error.message);
        } else {
            alert("ลบนักกีฬาสำเร็จ");
            fetchAthletes(newAthlete.club);
        }
    };

    return (
        <Container maxW={width}>
            <Heading>Dashboard</Heading>
            <Text>
                ยินดีต้อนรับ {personalData.name_thai}{" "}
                {personalData.surname_thai}
            </Text>
            <Button onClick={onOpen} mt="1rem">
                เพิ่มนักกีฬา
            </Button>
            <VStack spacing="1rem" mt="1rem" maxW={width} align="start">
                <Text>รายชื่อนักกีฬา</Text>
                <TableContainer width={width}>
                    <Table variant="simple" backgroundColor="brand.400">
                        <Thead>
                            <Tr>
                                <Th color="brand.100">ชื่อ</Th>
                                <Th color="brand.100">นามสกุล</Th>
                                <Th color="brand.100">เพศ</Th>
                                <Th color="brand.100">Division</Th>
                                <Th color="brand.100">Class</Th>
                                <Th color="brand.100">Club</Th>
                                <Th color="brand.100">Team</Th>
                            </Tr>
                        </Thead>
                        <Tbody>
                            {athletes.map((athlete) => (
                                <Tr key={athlete.id}>
                                    <Td color="brand.100">
                                        {athlete.name_thai}
                                    </Td>
                                    <Td color="brand.100">
                                        {athlete.surname_thai}
                                    </Td>
                                    <Td color="brand.100">{athlete.sex}</Td>
                                    <Td color="brand.100">
                                        {athlete.division}
                                    </Td>
                                    <Td color="brand.100">{athlete.class}</Td>
                                    <Td color="brand.100">{athlete.club}</Td>
                                    <Td color="brand.100">
                                        {athlete.team_name}
                                    </Td>
                                    <Td color="brand.100">
                                        <Button
                                            variant="solid"
                                            colorScheme="red"
                                            onClick={() => {
                                                handleDeleteAthlete(athlete.id);
                                            }}
                                        >
                                            ลบ
                                        </Button>
                                    </Td>
                                </Tr>
                            ))}
                        </Tbody>
                    </Table>
                </TableContainer>
                <Button onClick={handleLogout}>ออกจากระบบ</Button>
            </VStack>
            <Modal isOpen={isOpen} onClose={onClose}>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>เพิ่มนักกีฬา</ModalHeader>
                    <ModalBody>
                        <VStack spacing="1rem">
                            <FormControl id="nameThai" isRequired>
                                <FormLabel>ชื่อ</FormLabel>
                                <Input
                                    placeholder="ชื่อ"
                                    onChange={(e) => {
                                        setNewAthlete({
                                            ...newAthlete,
                                            name_thai: e.target.value,
                                        });
                                    }}
                                />
                            </FormControl>
                            <FormControl id="surnameThai" isRequired>
                                <FormLabel>นามสกุล</FormLabel>
                                <Input
                                    placeholder="นามสกุล"
                                    onChange={(e) => {
                                        setNewAthlete({
                                            ...newAthlete,
                                            surname_thai: e.target.value,
                                        });
                                    }}
                                />
                            </FormControl>
                            <FormControl id="nameEng" isRequired>
                                <FormLabel>ชื่อ (ภาษาอังกฤษ)</FormLabel>
                                <Input
                                    placeholder="ชื่อ (ภาษาอังกฤษ)"
                                    onChange={(e) => {
                                        setNewAthlete({
                                            ...newAthlete,
                                            name_english: e.target.value,
                                        });
                                    }}
                                />
                            </FormControl>
                            <FormControl id="surnameEng" isRequired>
                                <FormLabel>นามสกุล (ภาษาอังกฤษ)</FormLabel>
                                <Input
                                    placeholder="นามสกุล (ภาษาอังกฤษ)"
                                    onChange={(e) => {
                                        setNewAthlete({
                                            ...newAthlete,
                                            surname_english: e.target.value,
                                        });
                                    }}
                                />
                            </FormControl>
                            <FormControl id="sex" isRequired>
                                <FormLabel>เพศ</FormLabel>
                                <Select
                                    placeholder="กรุณาระบุเพศของท่าน"
                                    value={newAthlete.sex}
                                    onChange={(e) => {
                                        setNewAthlete({
                                            ...newAthlete,
                                            sex: e.target.value,
                                        });
                                    }}
                                >
                                    <option value="male">ชาย</option>
                                    <option value="female">หญิง</option>
                                </Select>
                            </FormControl>
                            <FormControl id="division" isRequired>
                                <FormLabel>Division</FormLabel>
                                <Select
                                    placeholder="กรุณาระบุ Division ของท่าน"
                                    value={newAthlete.division}
                                    onChange={(e) => {
                                        setNewAthlete({
                                            ...newAthlete,
                                            division: e.target.value,
                                        });
                                    }}
                                >
                                    <option value="Recurve">Recurve</option>
                                    <option value="Compound">Compound</option>
                                    <option value="Barebow">Barebow</option>
                                </Select>
                            </FormControl>
                            <FormControl id="class" isRequired>
                                <FormLabel>Class</FormLabel>
                                <Select
                                    placeholder="กรุณาระบุ Class ของท่าน"
                                    value={newAthlete.class}
                                    onChange={(e) => {
                                        setNewAthlete({
                                            ...newAthlete,
                                            class: e.target.value,
                                        });
                                    }}
                                >
                                    <option value="Open">Open</option>
                                    <option value="U18">Under 18</option>
                                    <option value="U10">Under 10</option>
                                </Select>
                            </FormControl>
                            <FormControl id="team" isRequired>
                                <FormLabel>Team</FormLabel>
                                <Select
                                    placeholder="ต้องการเข้าร่วมการแข่งขันในรูปแบบทีมหรือไม่"
                                    value={newAthlete.team}
                                    onChange={(e) => {
                                        setNewAthlete({
                                            ...newAthlete,
                                            team: e.target.value,
                                        });
                                    }}
                                >
                                    <option value={true}>ต้องการ</option>
                                    <option value={false}>ไม่ต้องการ</option>
                                </Select>
                            </FormControl>
                            {newAthlete.team === "true" ? (
                                <FormControl id="teamName" isRequired>
                                    <FormLabel>ชื่อทีม</FormLabel>
                                    <Input
                                        placeholder="ชื่อทีม"
                                        onChange={(e) => {
                                            setNewAthlete({
                                                ...newAthlete,
                                                team_name: e.target.value,
                                            });
                                        }}
                                    />
                                </FormControl>
                            ) : null}

                            <Button onClick={handleAddAthlete} w="sm">
                                เพิ่มนักกีฬา
                            </Button>
                        </VStack>
                    </ModalBody>
                    <ModalCloseButton />
                </ModalContent>
            </Modal>
        </Container>
    );
}
