import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./routes/Home";
import Dashboard from "./routes/Dashboard";
import AthleteCheck from "./routes/AthleteCheck";
import Login from "./routes/Login";
import Register from "./routes/Register";
import Header from "./components/Header";
import Footer from "./components/Footer";
import { UserProvider } from "./helper/UserContext";

export default function App() {
    return (
        <UserProvider>
            <Router>
                <Header />
                <Routes>
                    <Route path="/dashboard" element={<Dashboard />} />
                    <Route path="/athletecheck" element={<AthleteCheck />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                    <Route path="/" element={<Home />} />
                </Routes>
                <Footer />
            </Router>
        </UserProvider>
    );
}
