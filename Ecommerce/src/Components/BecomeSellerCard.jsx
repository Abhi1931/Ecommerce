import React, { useEffect, useState } from "react";
import { FaArrowLeft } from "react-icons/fa";
import registerAnimations from "../assets/Man finding Web Hosting Solution.mp4";
import "bootstrap-icons/font/bootstrap-icons.css";
import { useNavigate } from "react-router-dom";
import { getUserById, Sregister } from "../Services/RestAPI.js";

import { jwtDecode } from "jwt-decode";

function BecomeSellerCard() {
    const navigate = useNavigate();

    const [loading, setLoading] = useState(true);
    const [form, setForm] = useState({
        email: "",
        fullname: "",
        username: "",
        gender: "",
        company: "",
        age: "",
        number: "",
    });

    useEffect(() => {
        const token = localStorage.getItem("accessToken");
        if (!token) {
            sessionStorage.setItem("redirectAfterLogin", window.location.pathname);
            alert("Please login to continue");
            navigate("/login");
            return;
        }

        let decoded;
        try {
            decoded = jwtDecode(token);
        } catch (err) {
            console.error("Invalid token or decoding error:", err);
            navigate("/login");
            return;
        }

        const userId = decoded?.id;
        if (!userId) {
            console.error("User ID not found in token.");
            navigate("/login");
            return;
        }

        getUserById(userId)
            .then((res) => {
                const user = res.data;
                setForm((prev) => ({
                    ...prev,
                    email: user.email || "",
                    fullname: user.fullname || "",
                    username: user.username || "",
                }));
            })
            .catch((err) => {
                console.error("Error loading user:", err);
                alert("Could not load your details");
                navigate("/account");
            })
            .finally(() => setLoading(false));
    }, [navigate]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleBack = () => {
        navigate("/account");
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            if (!form.company || !form.gender || !form.age || !form.number) {
                alert("Please fill all seller details");
                return;
            }

            const res = await Sregister(form);

            if (res.status === 201 || res.data === "UPGRADED") {
                alert("You are now registered as a seller!");
                navigate("/account"); // or navigate("/seller/dashboard");
            } else {
                alert(res.data || "Upgrade to seller failed");
            }
        } catch (err) {
            console.error("Upgrade error:", err);
            if (err.response?.status === 409) {
                alert(err.response.data || "Seller profile already exists.");
            } else {
                alert("Something went wrong while upgrading to seller.");
            }
        }
    };

    if (loading) {
        return (
            <div className="d-flex justify-content-center align-items-center vh-100 bg-light">
                <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Loading...</span>
                </div>
            </div>
        );
    }

    return (
        <div className="d-flex justify-content-center align-items-md-center vh-100 bg-light text-light">
            <div
                className="card login-card shadow-lg"
                style={{
                    width: "1250px",
                    border: "3px solid skyblue",
                    borderRadius: "2rem",
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
                            style={{
                                objectFit: "cover",
                                borderTopLeftRadius: "2rem",
                                borderBottomLeftRadius: "2rem",
                            }}
                        >
                            <source src={registerAnimations} type="video/mp4" />
                        </video>
                    </div>

                    <div className="col-md-6 login-form p-4">
                        <div className="d-flex justify-content-end">
                            <button
                                className="btn btn-sm btn-outline-secondary mb-3"
                                style={{ border: "3px solid blue" }}
                                onClick={handleBack}
                            >
                                <FaArrowLeft className="me-1" />
                                Back to Account
                            </button>
                        </div>

                        <h5 className="text-center mb-3">Become a Seller</h5>

                        <div style={{ maxHeight: "420px", overflowY: "auto", paddingRight: "4px" }}>
                            <form onSubmit={handleSubmit}>
                                <div className="mb-2">
                                    <label className="form-label">Email</label>
                                    <input
                                        type="email"
                                        className="form-control"
                                        style={{ border: "1px solid blue" }}
                                        name="email"
                                        value={form.email}
                                        readOnly
                                    />
                                </div>

                                <div className="mb-2">
                                    <label className="form-label">Full Name</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        style={{ border: "1px solid blue" }}
                                        name="fullname"
                                        value={form.fullname}
                                        readOnly
                                    />
                                </div>

                                <div className="mb-2">
                                    <label className="form-label">Username</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        style={{ border: "1px solid orange" }}
                                        name="username"
                                        value={form.username}
                                        readOnly
                                    />
                                </div>

                                <hr />

                                <div className="row">
                                    <div className="col-6 mb-2">
                                        <label className="form-label">Gender</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            name="gender"
                                            value={form.gender}
                                            onChange={handleChange}
                                            placeholder="Gender"
                                            required
                                        />
                                    </div>

                                    <div className="col-6 mb-2">
                                        <label className="form-label">Company</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            name="company"
                                            value={form.company}
                                            onChange={handleChange}
                                            placeholder="Company"
                                            required
                                        />
                                    </div>

                                    <div className="col-6 mb-2">
                                        <label className="form-label">Age</label>
                                        <input
                                            type="number"
                                            className="form-control"
                                            name="age"
                                            value={form.age}
                                            onChange={handleChange}
                                            placeholder="Age"
                                            min="18"
                                            required
                                        />
                                    </div>

                                    <div className="col-6 mb-3">
                                        <label className="form-label">Phone Number</label>
                                        <input
                                            type="tel"
                                            className="form-control"
                                            name="number"
                                            value={form.number}
                                            onChange={handleChange}
                                            placeholder="Phone Number"
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="d-flex">
                                    <button type="submit" className="btn btn-primary w-100">
                                        Upgrade to Seller
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

export default BecomeSellerCard;
