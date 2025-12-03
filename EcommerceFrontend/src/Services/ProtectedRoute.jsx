import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import {jwtDecode } from "jwt-decode";

const isTokenValid = (token) => {
    try {
        const decoded = jwtDecode(token)
        return decoded.exp * 1000 > Date.now();
    } catch {
        return false;
    }
};

const ProtectedRoute = () => {
    const token = localStorage.getItem("accessToken");
    return token && isTokenValid(token) ? <Outlet /> : <Navigate to="/login" replace />;
};

export default ProtectedRoute;
