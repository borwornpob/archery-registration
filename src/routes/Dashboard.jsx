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
import { Form, useNavigate } from "react-router-dom";
import { supabase } from "../helper/supabase";
import useWindowDimensions from "../helper/dimensions";
import { UserContext } from "../helper/UserContext";
import Cookies from "js-cookie";
import ChakraReactCreatableSelect from "../components/Select";

export default function Dashboard() {
    const { user, setUser } = useContext(UserContext);
    const [id, setId] = useState("");
    const [personalData, setPersonalData] = useState({});
    const [athletes, setAthletes] = useState([]);
    const [availiableTeamNames, setAvailiableTeamNames] = useState([]);
    const [availiableTeamCodes, setAvailiableTeamCodes] = useState([]);
    const [availiableTeamData, setAvailiableTeamData] = useState([{}]);
    const [newAthlete, setNewAthlete] = useState({
        name_thai: "",
        name_english: "",
        surname_thai: "",
        surname_english: "",
        sex: "",
        division: "",
        class: "",
        club: "",
        club_code: "",
        team: false,
        team_name: "",
        team_code: "",
        created_by: "",
        telnumber: "",
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
        club_code: "",
        team: false,
        team_name: "",
        team_code: "",
        created_by: "",
        telnumber: "",
    });

    const [typeModal, setTypeModal] = useState("add");

    const [searchTerm, setSearchTerm] = useState("");
    const [searchResults, setSearchResults] = useState([]);

    const type = {
        Recurve: [
            "U10 12m (แข่งวันที่ 24/02/67)",
            "U12 18m (แข่งวันที่ 24/02/67)",
            "U15 18m (แข่งวันที่ 24/02/67)",
            "U18 18m (แข่งวันที่ 24/02/67)",
            "Open 30m (แข่งวันที่ 25/02/67)",
            "Open 50m (แข่งวันที่ 26/02/67)",
            "Open 70m (แข่งวันที่ 26/02/67)",
        ],
        Compound: [
            "U12 18m (แข่งวันที่ 24/02/67)",
            "U18 18m (แข่งวันที่ 24/02/67)",
            "Open 30m (แข่งวันที่ 25/02/67)",
            "Open 50m (แข่งวันที่ 26/02/67)",
        ],
        Barebow: [
            "U12 18m (แข่งวันที่ 24/02/67)",
            "U18 18m (แข่งวันที่ 24/02/67)",
            "Open 30m (แข่งวันที่ 25/02/67)",
            "Open 50m (แข่งวันที่ 26/02/67)",
        ],
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
        setNewAthlete({
            ...newAthlete,
            club: data[0].club,
            club_code: data[0].club_code,
            created_by: data[0].id,
        });
        setUpdateAthlete({
            ...updateAthlete,
            club: data[0].club,
            club_code: data[0].club_code,
            created_by: data[0].id,
        });
        setId(data[0].id);
    };

    const updateAthleteData = async () => {
        if (checkUpdateAthlete()) {
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
                    club_code: updateAthlete.club_code,
                    team: updateAthlete.team,
                    team_name: updateAthlete.team_name,
                    team_code: updateAthlete.team_code,
                    created_by: updateAthlete.created_by,
                    telnumber: updateAthlete.telnumber,
                })
                .eq("id", updateAthlete.id);
            addTeamIfNotExistForUpdateAthlete();
            if (error) {
                alert(error.message);
            } else {
                alert("อัพเดทข้อมูลนักกีฬาสำเร็จ");
                onClose();
                fetchAthletes(updateAthlete.club);
                fetchAvailiableTeams();
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
                    .includes(searchTerm.toLowerCase()) ||
                athlete.team_code
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
            fetchAvailiableTeams();
        }
    }, []);

    useEffect(() => {
        if (
            updateAthlete.team === "false" ||
            updateAthlete.team == "false" ||
            updateAthlete.team == false
        ) {
            setUpdateAthlete({
                ...updateAthlete,
                team_name: "",
                team_code: "",
            });
        } else {
            setUpdateAthlete({
                ...updateAthlete,
                team_name: "",
                team_code: "",
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
            updateAthlete.team === "" ||
            updateAthlete.team_name === "" ||
            updateAthlete.telnumber === ""
        ) {
            return false;
        } else {
            return true;
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
            return true;
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
                    club_code: newAthlete.club_code,
                    team: newAthlete.team,
                    team_name: newAthlete.team_name,
                    team_code: newAthlete.team_code,
                    payment_status: "unconfirmed",
                    created_by: newAthlete.created_by,
                    telnumber: newAthlete.telnumber,
                },
            ]);
            addTeamIfNotExist();
            if (error) {
                alert(error.message);
            } else {
                alert("เพิ่มนักกีฬาสำเร็จ");
                onClose();
                clearNewAthlete();
                clearUpdateAthlete();
                fetchAthletes(newAthlete.club);
                fetchAvailiableTeams();
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
            team: false,
            team_name: "",
            team_code: "",
            club_code: newAthlete.club_code,
            created_by: newAthlete.created_by,
            telnumber: "",
        });
    };

    const clearUpdateAthlete = () => {
        setUpdateAthlete({
            id: "",
            name_thai: "",
            name_english: "",
            surname_thai: "",
            surname_english: "",
            sex: "",
            division: "",
            class: "",
            club: updateAthlete.club,
            team: false,
            team_name: "",
            team_code: "",
            club_code: updateAthlete.club_code,
            created_by: updateAthlete.created_by,
            telnumber: "",
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
            setUpdateAthlete(data[0]);
            setTypeModal("update");
            onOpen();
        }
    };

    const addTeamIfNotExist = async () => {
        const { data, error } = await supabase
            .from("teams")
            .select("*")
            .eq("team_name", newAthlete.team_name);
        if (error) {
            alert(error.message);
        } else {
            if (data.length === 0) {
                const { data, error } = await supabase.from("teams").insert([
                    {
                        team_name: newAthlete.team_name,
                        team_code: newAthlete.team_code,
                        first_creator: newAthlete.name_english,
                    },
                ]);
                if (error) {
                    alert(error.message);
                } else {
                    alert("เพิ่มทีมสำเร็จ");
                }
            }
        }
    };

    const addTeamIfNotExistForUpdateAthlete = async () => {
        const { data, error } = await supabase
            .from("teams")
            .select("*")
            .eq("team_name", updateAthlete.team_name);
        if (error) {
            alert(error.message);
        } else {
            if (data.length === 0) {
                const { data, error } = await supabase.from("teams").insert([
                    {
                        team_name: updateAthlete.team_name,
                        team_code: updateAthlete.team_code,

                        first_creator: updateAthlete.name_english,
                    },
                ]);
                if (error) {
                    alert(error.message);
                } else {
                    alert("เพิ่มทีมสำเร็จ");
                }
            }
        }
    };

    const fetchAvailiableTeams = async () => {
        const { data, error } = await supabase.from("teams").select("*");
        if (error) {
            alert(error.message);
        } else {
            const optionsTeamName = data.map((item) => {
                return { value: item.team_name, label: item.team_name };
            });
            const optionsTeamCode = data.map((item) => {
                return { value: item.team_code, label: item.team_code };
            });
            setAvailiableTeamNames(optionsTeamName);
            setAvailiableTeamCodes(optionsTeamCode);
            setAvailiableTeamData(data);
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
                มีนักกีฬาอยู่ในสังกัด {newAthlete.club} ({newAthlete.club_code})
                จำนวน {athletes.length} คน
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
            <Text mt="1rem" color="red.500">
                หากต้องการสมัครมากกว่าหนึ่งระยะขึ้นไป กรุณาเพิ่มนักกีฬาอีกครั้ง
                ในระบบสามารถมีรายชื่อเดียวกันได้หลายระยะ
            </Text>
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
                                <Th color="brand.100">Team Code</Th>
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
                                        {athlete.team_code}
                                    </Td>
                                    <Td color="brand.100">
                                        {athlete.payment_status}
                                    </Td>
                                    {(athlete.payment_status ===
                                        "unconfirmed" ||
                                        athlete.payment_status ===
                                            "waiting to confirm") &&
                                    athlete.created_by == id ? (
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
                                <FormControl id="team" isRequired isDisabled>
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
                                <FormControl id="telnumber" isRequired>
                                    <FormLabel>
                                        เบอร์โทรศัพท์ที่สามารถติดต่อได้
                                    </FormLabel>
                                    <Input
                                        placeholder="เบอร์โทรศัพท์"
                                        onChange={(e) => {
                                            setNewAthlete({
                                                ...newAthlete,
                                                telnumber: e.target.value,
                                            });
                                        }}
                                    />
                                </FormControl>
                                {/* <Text>
                                    หากต้องการสมัครเข้าร่วมแข่งขันประเภททีม
                                    กรุณาส่งรายชื่อนักกีฬาที่เข้าร่วมแข่งขันในทีมเดียวกัน
                                    มาที่ไลน์ @youngblood.archery
                                </Text> */}
                                {newAthlete.team === "true" ? (
                                    <>
                                        <FormControl id="teamName">
                                            <FormLabel>
                                                ชื่อทีม
                                                (สำหรับการแข่งขันประเภททีม 3 คน
                                                เท่านั้น ไม่ใช่สังกัด เช่น
                                                ArrowHitz Recurve 01)
                                                <Text color="red.500">
                                                    ภาษาอังกฤษเท่านั้น
                                                </Text>
                                            </FormLabel>

                                            <ChakraReactCreatableSelect
                                                options={availiableTeamNames}
                                                onChange={(e) => {
                                                    setNewAthlete({
                                                        ...newAthlete,
                                                        team_name: e.value,
                                                    });
                                                    let teamCode =
                                                        availiableTeamData[
                                                            availiableTeamNames.findIndex(
                                                                (item) =>
                                                                    item.value ===
                                                                    e.value
                                                            )
                                                        ]?.team_code;
                                                    if (
                                                        teamCode === undefined
                                                    ) {
                                                        setNewAthlete({
                                                            ...newAthlete,
                                                            team_code: "",
                                                            team_name: e.value,
                                                        });
                                                    } else {
                                                        setNewAthlete({
                                                            ...newAthlete,
                                                            team_code: teamCode,
                                                            team_name: e.value,
                                                        });
                                                    }
                                                }}
                                                placeholder="กรุณาสร้างทีมใหม่หรือเลือกทีมที่มีอยู่แล้ว"
                                            />
                                        </FormControl>
                                        <FormControl id="teamCode">
                                            <FormLabel>
                                                รหัสทีม (เป็นตัวย่อของชื่อทีม
                                                จำนวนไม่เกิน 6 ตัวอักษร เช่น
                                                AHZ_01)
                                                <Text color="red.500">
                                                    ภาษาอังกฤษเท่านั้น
                                                </Text>
                                            </FormLabel>
                                            {newAthlete.team_code == "" ? (
                                                <ChakraReactCreatableSelect
                                                    onChange={(e) => {
                                                        setNewAthlete({
                                                            ...newAthlete,
                                                            team_code: e.value,
                                                        });
                                                    }}
                                                    placeholder="กรุณาสร้างรหัสทีมใหม่"
                                                />
                                            ) : (
                                                <Input
                                                    placeholder="รหัสทีม"
                                                    value={newAthlete.team_code}
                                                    onChange={(e) => {
                                                        setNewAthlete({
                                                            ...newAthlete,
                                                            team_code:
                                                                e.target.value,
                                                        });
                                                    }}
                                                />
                                            )}
                                        </FormControl>
                                    </>
                                ) : null}
                                <Text>
                                    ข้อมูลการสมัครสามารถแก้ไขได้ในภายหลัง
                                    การสมัครจะยังไม่ยืนยันจนกว่าจะทำการชำระเงินเสร็จสิ้น
                                </Text>
                                <Button onClick={handleAddAthlete} w="sm">
                                    ยืนยันการสมัคร
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
                                <FormControl id="team" isRequired isDisabled>
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
                                <FormControl id="telnumber" isRequired>
                                    <FormLabel>
                                        เบอร์โทรศัพท์ที่สามารถติดต่อได้
                                    </FormLabel>
                                    <Input
                                        placeholder="เบอร์โทรศัพท์"
                                        value={updateAthlete.telnumber}
                                        onChange={(e) => {
                                            setUpdateAthlete({
                                                ...updateAthlete,
                                                telnumber: e.target.value,
                                            });
                                        }}
                                    />
                                </FormControl>
                                {/* <Text>
                                    หากต้องการสมัครเข้าร่วมแข่งขันประเภททีม
                                    กรุณาส่งรายชื่อนักกีฬาที่เข้าร่วมแข่งขันในทีมเดียวกัน
                                    มาที่ไลน์ @youngblood.archery
                                </Text> */}
                                {updateAthlete.team === "true" ||
                                updateAthlete.team == true ? (
                                    <>
                                        <FormControl id="teamName">
                                            <FormLabel>
                                                ชื่อทีม
                                                (สำหรับการแข่งขันประเภททีม 3 คน
                                                เท่านั้น ไม่ใช่สังกัด เช่น
                                                ArrowHitz Recurve 01)
                                                <Text color="red.500">
                                                    ภาษาอังกฤษเท่านั้น
                                                </Text>
                                            </FormLabel>
                                            <ChakraReactCreatableSelect
                                                options={availiableTeamNames}
                                                onChange={(e) => {
                                                    setUpdateAthlete({
                                                        ...updateAthlete,
                                                        team_name: e.value,
                                                    });
                                                    let teamCode =
                                                        availiableTeamData[
                                                            availiableTeamNames.findIndex(
                                                                (item) =>
                                                                    item.value ===
                                                                    e.value
                                                            )
                                                        ]?.team_code;
                                                    if (
                                                        teamCode === undefined
                                                    ) {
                                                        setUpdateAthlete({
                                                            ...updateAthlete,
                                                            team_code: "",
                                                            team_name: e.value,
                                                        });
                                                    } else {
                                                        setUpdateAthlete({
                                                            ...updateAthlete,
                                                            team_code: teamCode,
                                                            team_name: e.value,
                                                        });
                                                    }
                                                }}
                                                defaultValue={{
                                                    value: updateAthlete.team_name,
                                                    label: updateAthlete.team_name,
                                                }}
                                            />
                                        </FormControl>
                                        <FormControl id="teamCode">
                                            <FormLabel>
                                                รหัสทีม (เป็นตัวย่อของชื่อทีม
                                                จำนวนไม่เกิน 6 ตัวอักษร เช่น
                                                AHZ_01)
                                                <Text color="red.500">
                                                    ภาษาอังกฤษเท่านั้น
                                                </Text>
                                            </FormLabel>
                                            {updateAthlete.team_code == "" ? (
                                                <ChakraReactCreatableSelect
                                                    onChange={(e) => {
                                                        setUpdateAthlete({
                                                            ...updateAthlete,
                                                            team_code: e.value,
                                                        });
                                                    }}
                                                    placeholder="กรุณาสร้างรหัสทีมใหม่"
                                                    defaultValue={{
                                                        value: updateAthlete.team_code,
                                                        label: updateAthlete.team_code,
                                                    }}
                                                />
                                            ) : (
                                                <Input
                                                    placeholder="รหัสทีม"
                                                    value={
                                                        updateAthlete.team_code
                                                    }
                                                    onChange={(e) => {
                                                        setUpdateAthlete({
                                                            ...updateAthlete,
                                                            team_code:
                                                                e.target.value,
                                                        });
                                                    }}
                                                />
                                            )}
                                        </FormControl>
                                    </>
                                ) : null}
                                <Text>
                                    ข้อมูลการสมัครสามารถแก้ไขได้ในภายหลัง
                                    การสมัครจะยังไม่ยืนยันจนกว่าจะทำการชำระเงินเสร็จสิ้น
                                </Text>
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
