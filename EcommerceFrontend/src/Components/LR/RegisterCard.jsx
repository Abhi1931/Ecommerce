import React, { useState } from "react";
import { FaArrowLeft } from "react-icons/fa";
import registerAnimation from "../../assets/Girl Sign up in mobile.mp4";
import registerAnimations from "../../assets/Man finding Web Hosting Solution.mp4";
import "bootstrap-icons/font/bootstrap-icons.css";
import { useNavigate } from "react-router-dom";
import { Sregister, Cregister } from "../../Services/RestAPI.js";

function RegisterCard() {
    const navigate = useNavigate();
    const goBack = () => { navigate("/login"); };

    const [form, setForm] = useState({
        email: "",
        fullname: "",
        username: "",
        password: "",
        role: "CUSTOMER",
        gender: "",
        company: "",
        age: "",
        number: "",
    });

    const isSeller = (form.role || "").toUpperCase() === "SELLER";

    const handleChange = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value,
        });
    };

    const handleRegister = async (e) => {
        e.preventDefault();

        try {
            if (isSeller) {
                const res = await Sregister(form);
                if (res.status === 201) {
                    alert("Seller registered successfully!");
                    navigate("/login");
                } else {
                    alert(res.data || "Seller registration failed");
                }
            } else {
                const res = await Cregister(form);
                if (res.data === "Success") {
                    alert("Customer registered successfully!");
                    navigate("/login");
                } else if (res.data === "Username already exists") {
                    alert("Username already exists, please choose another.");
                } else {
                    alert(res.data || "Customer registration failed");
                }
            }
        } catch (err) {
            console.error("Registration error:", err);
            if (err.response?.status === 409) {
                alert(err.response.data || "Username already exists");
            } else {
                alert("Something went wrong during registration.");
            }
        }
    };

    return (
        <div className="d-flex justify-content-center align-items-md-center vh-100 bg-light text-light">
            <div
                className="card login-card shadow-lg"
                style={{
                    width: isSeller ? "1250px" : "1050px",
                    border: "3px solid skyblue",
                    borderRadius: "2rem",
                    transition: "width 0.3s ease",
                }}
            >
                <div className="row g-0">

                    <div className="col-md-6">
                        <video
                            key={isSeller ? "seller-video" : "customer-video"}
                            className="w-100 h-100 rounded-start"
                            autoPlay
                            loop
                            muted
                            playsInline
                            style={{
                                objectFit: "cover",
                                borderTopLeftRadius: "2rem",
                                borderBottomLeftRadius: "2rem",
                            }}
                        >
                            <source
                                src={isSeller ? registerAnimations : registerAnimation} // 🔹 switch video
                                type="video/mp4"
                            />
                        </video>
                    </div>

                    <div className="col-md-6 login-form p-4">
                        <div className="d-flex justify-content-end">
                            <button
                                className="btn btn-sm btn-outline-secondary mb-3"
                                style={{ border: "3px solid blue" }}
                                onClick={goBack}
                            >
                                <FaArrowLeft className="me-1" />
                                Back to Login
                            </button>
                        </div>

                        <h5 className="text-center mb-3">Register</h5>

                        <div style={{ maxHeight: "420px", overflowY: "auto", paddingRight: "4px" }}>
                            <form onSubmit={handleRegister}>

                                <div className="mb-2">
                                    <label className="form-label">Email</label>
                                    <input
                                        type="email"
                                        className="form-control"
                                        style={{ border: "1px solid blue" }}
                                        name="email"
                                        value={form.email || ""}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                               <div className="mb-2">
                                    <label className="form-label">Full Name</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        style={{ border: "1px solid blue" }}
                                        name="fullname"
                                        value={form.fullname || ""}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>

                                <div className="mb-2">
                                    <label className="form-label">Username</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        style={{ border: "1px solid orange" }}
                                        name="username"
                                        value={form.username || ""}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>

                                <div className="mb-2">
                                    <label className="form-label">Password</label>
                                    <input
                                        type="password"
                                        className="form-control"
                                        style={{ border: "1px solid orange" }}
                                        name="password"
                                        value={form.password || ""}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>

                                <div className="mb-3">
                                    <label className="form-label">Role</label>
                                    <select
                                        className="form-select"
                                        style={{ border: "1px solid blue" }}
                                        name="role"
                                        value={form.role || "CUSTOMER"}
                                        onChange={handleChange}
                                        required
                                    >
                                        <option value="CUSTOMER">CUSTOMER</option>
                                        <option value="SELLER">SELLER</option>
                                    </select>
                                </div>

                                {isSeller && (
                                    <div className="row">
                                        <div className="col-6 mb-2">
                                            <label className="form-label">Gender</label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                name="gender"
                                                value={form.gender || ""}
                                                onChange={handleChange}
                                                placeholder="Gender"
                                            />
                                        </div>

                                        <div className="col-6 mb-2">
                                            <label className="form-label">Company</label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                name="company"
                                                value={form.company || ""}
                                                onChange={handleChange}
                                                placeholder="Company"
                                            />
                                        </div>

                                        <div className="col-6 mb-2">
                                            <label className="form-label">Age</label>
                                            <input
                                                type="number"
                                                className="form-control"
                                                name="age"
                                                value={form.age || ""}
                                                onChange={handleChange}
                                                placeholder="Age"
                                                min="18"
                                            />
                                        </div>

                                        <div className="col-6 mb-3">
                                            <label className="form-label">Phone Number</label>
                                            <input
                                                type="tel"
                                                className="form-control"
                                                name="number"
                                                value={form.number || ""}
                                                onChange={handleChange}
                                                placeholder="Phone Number"
                                            />
                                        </div>
                                    </div>
                                )}

                                <div className="d-flex">
                                    <button type="submit" className="btn btn-primary w-100">
                                        Create Account
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default RegisterCard;
