import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./routes/Home";
import Dashboard from "./routes/Dashboard";
import AthleteCheck from "./routes/AthleteCheck";
import AthleteCheckAdmin from "./routes/AthleteCheckAdmin";
import Login from "./routes/Login";
import Register from "./routes/Register";
import Payment from "./routes/Payment";
import AdminDashboard from "./routes/Admin";
import Header from "./components/Header";
import Footer from "./components/Footer";
import { UserProvider } from "./helper/UserContext";
import { Box, Flex, VStack } from "@chakra-ui/react";

export default function App() {
    return (
        <UserProvider>
            <Flex direction="column" minH="100vh">
                <Box flex="1">
                    <Router>
                        <Header />
                        <Routes>
                            <Route path="/dashboard" element={<Dashboard />} />
                            <Route
                                path="/athletecheck"
                                element={<AthleteCheck />}
                            />
                            <Route
                                path="/admindashboard"
                                element={<AdminDashboard />}
                            />
                            <Route
                                path="/athletecheckadmin"
                                element={<AthleteCheckAdmin />}
                            />
                            <Route path="/login" element={<Login />} />
                            <Route path="/register" element={<Register />} />
                            <Route path="/" element={<Home />} />
                            <Route path="/payment" element={<Payment />} />
                        </Routes>
                    </Router>
                </Box>
                <Box>
                    <Footer />
                </Box>
            </Flex>
        </UserProvider>
    );
}
