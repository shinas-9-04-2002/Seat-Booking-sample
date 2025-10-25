import React from "react";
import { Routes, Route, Link } from "react-router-dom";
import Register from "./pages/Register";
import Login from "./pages/Login";
import SeatBooking from "./pages/SeatBooking";

export default function App() {
    return (
        <div className="min-h-screen bg-gray-500 p-4 sm:p-6">
            <nav className="flex justify-around gap-4 mb-6 text-lg font-medium bg-zinc-300 py-3  rounded-2xl">
                <Link className="bg-black text-blue-50 rounded-2xl px-3 py-1 active:scale-95" to="/">Home</Link>
                <div className="flex justify-end gap-10">
                    <Link className="bg-blue-600 text-blue-50 rounded-2xl px-3 py-1 active:scale-95" to="/login">Login</Link >
                    <Link className="bg-green-600 text-blue-50 rounded-2xl px-3 py-1 active:scale-95" to="/register">Register</Link>
                </div>
            </nav>
            <Routes>
                <Route path="/" element={<SeatBooking />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
            </Routes>
        </div>
    );
}
