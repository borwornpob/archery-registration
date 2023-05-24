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
        team: "",
        team_name: "",
    });
    const [updateAthlete, setUpdateAthlete] = useState({
        id: "",
        name_thai: "",
        name_english: "",
        surname_thai: "",
        surname_english: "",
        sex: "",
        division: "",
        class: "",
        club: "",
        team: "",
        team_name: "",
    });

    const [typeModal, setTypeModal] = useState("add");

    const [searchTerm, setSearchTerm] = useState("");
    const [searchResults, setSearchResults] = useState([]);

    const type = {
        Recurve: ["U10", "U12", "U15", "U18", "Open"],
        Compound: ["U12", "U18", "Open"],
        Barebow: ["U12", "U18", "Open"],
    };

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
        setUpdateAthlete({ ...updateAthlete, club: data[0].club });
    };

    const updateAthleteData = async () => {
        if (checkUpdateAthlete()) {
            console.log(updateAthlete);
            const { data, error } = await supabase
                .from("athletes")
                .update({
                    name_thai: updateAthlete.name_thai,
                    name_english: updateAthlete.name_english,
                    surname_thai: updateAthlete.surname_thai,
                    surname_english: updateAthlete.surname_english,
                    sex: updateAthlete.sex,
                    division: updateAthlete.division,
                    class: updateAthlete.class,
                    club: updateAthlete.club,
                    team: updateAthlete.team,
                    team_name: updateAthlete.team_name,
                })
                .eq("id", updateAthlete.id);
            if (error) {
                alert(error.message);
            } else {
                alert("อัพเดทข้อมูลนักกีฬาสำเร็จ");
                onClose();
                fetchAthletes(updateAthlete.club);
            }
        } else {
            alert("กรุณากรอกข้อมูลให้ครบถ้วน");
        }
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
            setSearchResults(data);
        }
    };

    const searchByName = (athletes, searchTerm) => {
        return athletes.filter((athlete) => {
            return (
                athlete.name_thai.includes(searchTerm) ||
                athlete.name_english
                    .toLowerCase()
                    .includes(searchTerm.toLowerCase()) ||
                athlete.team_name
                    .toLowerCase()
                    .includes(searchTerm.toLowerCase())
            );
        });
    };

    useEffect(() => {
        //when the search bar is chagned
        setSearchResults(searchByName(athletes, searchTerm));
    }, [searchTerm]);

    useEffect(() => {
        const cookie = Cookies.get("user");
        if (!cookie) {
            navigate("/login");
        } else {
            setUser(cookie);
            fetchPersonalData(cookie);
        }
    }, []);

    useEffect(() => {
        if (updateAthlete.team === "false" || updateAthlete.team == "false") {
            setUpdateAthlete({
                ...updateAthlete,
                team_name: "",
            });
        }
    }, [updateAthlete.team]);

    const navigate = useNavigate();

    let { width } = useWindowDimensions();

    const handleLogout = () => {
        Cookies.remove("user");
        setUser(null);
        navigate("/");
    };

    const checkUpdateAthlete = () => {
        if (
            updateAthlete.name_thai === "" ||
            updateAthlete.name_english === "" ||
            updateAthlete.surname_thai === "" ||
            updateAthlete.surname_english === "" ||
            updateAthlete.sex === "" ||
            updateAthlete.division === "" ||
            updateAthlete.class === "" ||
            updateAthlete.club === "" ||
            updateAthlete.team === ""
        ) {
            return false;
        } else {
            if (updateAthlete.team === "true" || updateAthlete.team == true) {
                if (updateAthlete.team_name === "") {
                    return false;
                } else if (
                    updateAthlete.team === "false" ||
                    updateAthlete.team == false
                ) {
                    setUpdateAthlete({
                        ...updateAthlete,
                        team_name: "",
                    });
                    return true;
                } else {
                    return true;
                }
            } else {
                return true;
            }
        }
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
            newAthlete.team === ""
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
                    team: newAthlete.team,
                    team_name: newAthlete.team_name,
                    payment_status: "unconfirmed",
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
            team: "",
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

    const handleUpdateAthlete = async (id) => {
        const { data, error } = await supabase
            .from("athletes")
            .select("*")
            .eq("id", id);
        if (error) {
            alert(error.message);
        } else {
            console.log(data);
            setUpdateAthlete(data[0]);
            setTypeModal("update");
            onOpen();
        }
    };

    return (
        <Container maxW={width}>
            <Heading>Dashboard</Heading>
            <Text>
                ยินดีต้อนรับ {personalData.name_thai}{" "}
                {personalData.surname_thai}
            </Text>
            <Text>
                มีนักกีฬาอยู่ในสังกัด {newAthlete.club} จำนวน {athletes.length}{" "}
                คน
            </Text>
            <Button
                onClick={() => {
                    setTypeModal("add");
                    onOpen();
                }}
                mt="1rem"
            >
                สมัครเข้าร่วมการแข่งขัน
            </Button>
            <FormControl id="search" mt="1rem">
                <FormLabel>ค้นหานักกีฬา</FormLabel>
                <Input
                    placeholder="ชื่อนักกีฬาที่ต้องการค้นหา"
                    onChange={(e) => {
                        setSearchTerm(e.target.value);
                    }}
                />
            </FormControl>
            <VStack spacing="1rem" mt="1rem" maxW={width} align="start">
                <Text>รายชื่อนักกีฬา</Text>

                <TableContainer width={width}>
                    <Table variant="simple" backgroundColor="brand.400">
                        <Thead>
                            <Tr>
                                <Th color="brand.100">ชื่อ</Th>
                                <Th color="brand.100">นามสกุล</Th>
                                <Th color="brand.100">ชื่อ (ภาษาอังกฤษ)</Th>
                                <Th color="brand.100">นามสกุล (ภาษาอังกฤษ)</Th>
                                <Th color="brand.100">เพศ</Th>
                                <Th color="brand.100">Division</Th>
                                <Th color="brand.100">Class</Th>
                                <Th color="brand.100">Club</Th>
                                <Th color="brand.100">Team</Th>
                                <Th color="brand.100">Payment status</Th>
                            </Tr>
                        </Thead>
                        <Tbody>
                            {searchResults.map((athlete) => (
                                <Tr key={athlete.id}>
                                    <Td color="brand.100">
                                        {athlete.name_thai}
                                    </Td>
                                    <Td color="brand.100">
                                        {athlete.surname_thai}
                                    </Td>
                                    <Td color="brand.100">
                                        {athlete.name_english}
                                    </Td>
                                    <Td color="brand.100">
                                        {athlete.surname_english}
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
                                        {athlete.payment_status}
                                    </Td>
                                    {athlete.payment_status ===
                                    "unconfirmed" ? (
                                        <Td color="brand.100">
                                            <Button
                                                variant="solid"
                                                colorScheme="green"
                                                size="sm"
                                                onClick={() => {
                                                    handleUpdateAthlete(
                                                        athlete.id
                                                    );
                                                }}
                                            >
                                                แก้ไข
                                            </Button>
                                            <Button
                                                variant="solid"
                                                colorScheme="red"
                                                ml="1rem"
                                                size="sm"
                                                onClick={() => {
                                                    handleDeleteAthlete(
                                                        athlete.id
                                                    );
                                                }}
                                            >
                                                ลบ
                                            </Button>
                                        </Td>
                                    ) : null}
                                </Tr>
                            ))}
                        </Tbody>
                    </Table>
                </TableContainer>
                <Button
                    onClick={() => {
                        navigate("/payment");
                    }}
                >
                    ชำระเงิน
                </Button>
                <Button onClick={handleLogout} variant="secondary">
                    ออกจากระบบ
                </Button>
            </VStack>
            <Modal isOpen={isOpen} onClose={onClose}>
                <ModalOverlay />

                {typeModal === "add" ? (
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
                                        {Object.keys(type).map((key) => {
                                            return (
                                                <option value={key}>
                                                    {key}
                                                </option>
                                            );
                                        })}
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
                                        {type[newAthlete.division]?.map(
                                            (item) => {
                                                return (
                                                    <option value={item}>
                                                        {item}
                                                    </option>
                                                );
                                            }
                                        )}
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
                                        <option value={false}>
                                            ไม่ต้องการ
                                        </option>
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
                    </ModalContent>
                ) : (
                    <ModalContent>
                        <ModalHeader>แก้ไขนักกีฬา</ModalHeader>
                        <ModalBody>
                            <VStack spacing="1rem">
                                <FormControl id="nameThai" isRequired>
                                    <FormLabel>ชื่อ</FormLabel>
                                    <Input
                                        placeholder="ชื่อ"
                                        value={updateAthlete.name_thai}
                                        onChange={(e) => {
                                            setUpdateAthlete({
                                                ...updateAthlete,
                                                name_thai: e.target.value,
                                            });
                                        }}
                                    />
                                </FormControl>
                                <FormControl id="surnameThai" isRequired>
                                    <FormLabel>นามสกุล</FormLabel>
                                    <Input
                                        placeholder="นามสกุล"
                                        value={updateAthlete.surname_thai}
                                        onChange={(e) => {
                                            setUpdateAthlete({
                                                ...updateAthlete,
                                                surname_thai: e.target.value,
                                            });
                                        }}
                                    />
                                </FormControl>
                                <FormControl id="nameEng" isRequired>
                                    <FormLabel>ชื่อ (ภาษาอังกฤษ)</FormLabel>
                                    <Input
                                        placeholder="ชื่อ (ภาษาอังกฤษ)"
                                        value={updateAthlete.name_english}
                                        onChange={(e) => {
                                            setUpdateAthlete({
                                                ...updateAthlete,
                                                name_english: e.target.value,
                                            });
                                        }}
                                    />
                                </FormControl>
                                <FormControl id="surnameEng" isRequired>
                                    <FormLabel>นามสกุล (ภาษาอังกฤษ)</FormLabel>
                                    <Input
                                        placeholder="นามสกุล (ภาษาอังกฤษ)"
                                        value={updateAthlete.surname_english}
                                        onChange={(e) => {
                                            setUpdateAthlete({
                                                ...updateAthlete,
                                                surname_english: e.target.value,
                                            });
                                        }}
                                    />
                                </FormControl>
                                <FormControl id="sex" isRequired>
                                    <FormLabel>เพศ</FormLabel>
                                    <Select
                                        placeholder="กรุณาระบุเพศของท่าน"
                                        value={updateAthlete.sex}
                                        onChange={(e) => {
                                            setUpdateAthlete({
                                                ...updateAthlete,
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
                                        value={updateAthlete.division}
                                        onChange={(e) => {
                                            setUpdateAthlete({
                                                ...updateAthlete,
                                                division: e.target.value,
                                            });
                                        }}
                                    >
                                        {Object.keys(type).map((key) => {
                                            return (
                                                <option value={key}>
                                                    {key}
                                                </option>
                                            );
                                        })}
                                    </Select>
                                </FormControl>
                                <FormControl id="class" isRequired>
                                    <FormLabel>Class</FormLabel>
                                    <Select
                                        placeholder="กรุณาระบุ Class ของท่าน"
                                        value={updateAthlete.class}
                                        onChange={(e) => {
                                            setUpdateAthlete({
                                                ...updateAthlete,
                                                class: e.target.value,
                                            });
                                        }}
                                    >
                                        {type[updateAthlete.division]?.map(
                                            (item) => {
                                                return (
                                                    <option value={item}>
                                                        {item}
                                                    </option>
                                                );
                                            }
                                        )}
                                    </Select>
                                </FormControl>
                                <FormControl id="team" isRequired>
                                    <FormLabel>Team</FormLabel>
                                    <Select
                                        placeholder="ต้องการเข้าร่วมการแข่งขันในรูปแบบทีมหรือไม่"
                                        value={updateAthlete.team}
                                        onChange={(e) => {
                                            setUpdateAthlete({
                                                ...updateAthlete,
                                                team: e.target.value,
                                            });
                                        }}
                                    >
                                        <option value={true}>ต้องการ</option>
                                        <option value={false}>
                                            ไม่ต้องการ
                                        </option>
                                    </Select>
                                </FormControl>
                                {updateAthlete.team === "true" ||
                                updateAthlete.team == true ? (
                                    <FormControl id="teamName" isRequired>
                                        <FormLabel>ชื่อทีม</FormLabel>
                                        <Input
                                            placeholder="ชื่อทีม"
                                            value={updateAthlete.team_name}
                                            onChange={(e) => {
                                                setUpdateAthlete({
                                                    ...updateAthlete,
                                                    team_name: e.target.value,
                                                });
                                            }}
                                        />
                                    </FormControl>
                                ) : null}
                            </VStack>
                        </ModalBody>
                        <ModalFooter>
                            <Button
                                variant="secondary"
                                mr={3}
                                onClick={onClose}
                            >
                                ยกเลิก
                            </Button>
                            <Button onClick={updateAthleteData}>ยืนยัน</Button>
                        </ModalFooter>
                    </ModalContent>
                )}
            </Modal>
        </Container>
    );
}
