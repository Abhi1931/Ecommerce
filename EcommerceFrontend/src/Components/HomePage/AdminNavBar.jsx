import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { Link, useNavigate } from "react-router-dom";
import { getSingleSeller } from "../../Services/RestAPI.js";
import { jwtDecode } from "jwt-decode";

function AdminNavBar() {
    const [searchQuery, setSearchQuery] = useState("");
    const [sellerInfo, setSellerInfo] = useState({ name: "", company: "" });
    const [role, setRole] = useState(null);
    const [sellerId, setSellerId] = useState(null);

    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem("accessToken");
        if (!token) return;

        try {
            const payload = jwtDecode(token);

            let extractedRole = payload?.role || payload?.roles || payload?.authorities || null;
            if (Array.isArray(extractedRole)) extractedRole = extractedRole[0];

            if (typeof extractedRole === "string") {
                if (extractedRole.startsWith("ROLE_")) extractedRole = extractedRole.substring(5);
                const normRole = extractedRole.toUpperCase();
                setRole(normRole);
                localStorage.setItem("role", normRole);
            }

            const sid = payload?.sid ?? payload?.id ?? payload?.userId;
            if (sid) setSellerId(sid);
        } catch (err) {
            console.warn("Token decode failed:", err);
        }
    }, []);

    const isSeller = role === "SELLER";
    const isAdmin = role === "ADMIN";

    useEffect(() => {
        if (!isSeller || !sellerId) return;
        const fetchSeller = async () => {
            try {
                const res = await getSingleSeller(sellerId);
                setSellerInfo({
                    name: res.data?.name || "",
                    company: res.data?.company || ""
                });
            } catch (e) {
                console.error("Error loading seller info:", e);
            }
        };
        fetchSeller();
    }, [isSeller, sellerId]);

    const handleSearch = (e) => {
        e.preventDefault();
        const q = (searchQuery || "").trim();
        if (!q) return alert("Enter something to search");
        navigate(`/search?kword=${encodeURIComponent(q)}`);
    };

    const handleLogout = () => {
        localStorage.removeItem("accessToken");
        localStorage.removeItem("role");
        navigate("/login", { replace: true });
    };

    return (
        <nav className="navbar navbar-expand-lg bg-dark navbar-dark">
            <div className="container-fluid">

                <div className="d-flex align-items-center">

                    {isAdmin ? (
                        <>
              <span className="navbar-brand mb-0" style={{ cursor: "default" }}>
                Admin Dashboard
              </span>
                            <Link to="/" className="nav-link text-light ms-3">
                                Home Page
                            </Link>
                        </>
                    ) : isSeller ? (
                        <span className="navbar-brand mb-0" style={{ cursor: "default" }}>
              Seller Dashboard
            </span>
                    ) : (

                        <Link className="navbar-brand" to="/">
                            Home Page
                        </Link>
                    )}
                </div>

                <button
                    className="navbar-toggler"
                    type="button"
                    data-bs-toggle="collapse"
                    data-bs-target="#topbarCollapse"
                >
                    <span className="navbar-toggler-icon" />
                </button>

                <div className="collapse navbar-collapse" id="topbarCollapse">
                    <div className="d-flex align-items-center me-auto">
                        {isSeller && (sellerInfo.company || sellerInfo.name) && (
                            <span className="navbar-text text-light me-3">
                {sellerInfo.company}
                                {sellerInfo.company && sellerInfo.name && " • "}
                                {sellerInfo.name}
              </span>
                        )}

                        {!isAdmin && (
                            <form className="d-flex" onSubmit={handleSearch}>
                                <input
                                    className="form-control me-2"
                                    type="text"
                                    placeholder={isSeller ? "Search my products" : "Search products"}
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                />
                                <button className="btn btn-outline-success" type="submit">
                                    Search
                                </button>
                            </form>
                        )}
                    </div>

                    <div className="d-flex">
                        <button className="btn btn-danger" onClick={handleLogout}>
                            <i className="bi bi-box-arrow-left me-2" />
                            Sign Out
                        </button>
                    </div>
                </div>
            </div>
        </nav>
    );
}

export default AdminNavBar;