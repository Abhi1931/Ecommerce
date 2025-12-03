import React, { useState } from "react";
import { FaSignInAlt, FaUserPlus } from "react-icons/fa";
import "bootstrap/dist/css/bootstrap.min.css";
import loginAnimation from "../../assets/Login.mp4";
import "bootstrap-icons/font/bootstrap-icons.min.css";
import { useNavigate } from "react-router-dom";
import { login } from "../../Services/RestAPI.js";
import { jwtDecode } from "jwt-decode"; // npm install jwt-decode

function LoginCard() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");
    const [darkMode, setDarkMode] = useState(false);
    const toggleTheme = () => setDarkMode((prev) => !prev);
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        setMessage("");

        if (!username || !password) {
            setMessage("Please fill in both username and password.");
            return;
        }

        setLoading(true);

        const loginData = { username, password };

        try {
            const response = await login(loginData);
            const authtoken = response.data.accessToken;

            if (authtoken) {
                localStorage.setItem("accessToken", authtoken);

                const decoded = jwtDecode(authtoken);
                const roles = decoded.role || [];

                setMessage("✅ Login successful! Redirecting...");

                if (roles.includes("ROLE_ADMIN")) {
                    navigate("/AdminPage");
                } else {
                    navigate("/");
                }
            } else {
                setMessage("❌ Token not received from server.");
            }
        } catch (error) {
            console.error(error);
            setMessage("❌ Invalid credentials or server error.");
        } finally {
            setLoading(false);
        }
    };

    const handleRegister = () => {
        navigate("/RegisterCard");
    };

    return (
        <div
            className={`d-flex justify-content-center align-items-center vh-100 ${
                darkMode ? "bg-dark text-light" : "bg-light text-dark"
            }`}
        >
            <div
                className="card login-card shadow-lg"
                style={{
                    width: "850px",
                    border: "2px solid #ced4da",
                    borderRadius: "1rem",
                }}
            >
                <div className="row g-0">
                    <div className="col-md-6">
                        <video
                            className="w-100 h-100 rounded-start"
                            autoPlay
                            loop
                            muted
                            playsInline
                            style={{ objectFit: "cover" }}
                        >
                            <source src={loginAnimation} type="video/mp4" />
                            Your browser does not support the video tag.
                        </video>
                    </div>

                    <div className="col-md-6 login-form p-4">
                        <div className="d-flex justify-content-end">
                            <button
                                className="btn btn-sm btn-outline-secondary mb-3"
                                onClick={toggleTheme}
                            >
                                {darkMode ? "☀️ Light Mode" : "🌙 Dark Mode"}
                            </button>
                        </div>

                        <h5 className="text-center mb-4">Login</h5>

                        {message && (
                            <div className="alert alert-info text-center py-2" role="alert">
                                {message}
                            </div>
                        )}

                        <form onSubmit={handleLogin}>
                            <div className="mb-3">
                                <label htmlFor="username" className="form-label">
                                    Username
                                </label>
                                <input
                                    type="text"
                                    className="form-control"
                                    id="username"
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    placeholder="Enter username"
                                />
                            </div>
                            <div className="mb-3">
                                <label htmlFor="password" className="form-label">
                                    Password
                                </label>
                                <input
                                    type="password"
                                    className="form-control"
                                    id="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="Password"
                                />
                            </div>

                            <div className="d-grid gap-2">
                                <button
                                    type="submit"
                                    className="btn btn-primary"
                                    disabled={loading}
                                >
                                    <FaSignInAlt className="me-2" />
                                    {loading ? "Logging in..." : "Login"}
                                </button>
                                <button
                                    type="button"
                                    className="btn btn-outline-secondary"
                                    onClick={handleRegister}
                                    disabled={loading}
                                >
                                    <FaUserPlus className="me-2" />
                                    Register
                                </button>
                                <p
                                    className="text-center mt-2 mb-0"
                                    style={{ fontSize: "0.9rem" }}
                                >
                                    Don't have an account?{" "}
                                    <strong>Create your account</strong>
                                </p>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default LoginCard;
