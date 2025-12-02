import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.min.css';
import {jwtDecode} from 'jwt-decode';

function Layout({ children }) {
    const navigate = useNavigate();
    const token = localStorage.getItem('accessToken');
    const [searchText, setSearchText] = useState("");


    let username = null;
    let isAdmin = false;
    let isCustomer = false;
    let isSeller = false;

    if (token) {
        try {
            const decoded = jwtDecode(token);
            username = decoded.username || decoded.sub || "User";

            if (decoded.role?.includes("ROLE_ADMIN")) isAdmin = true;
            if (decoded.role?.includes("ROLE_CUSTOMER")) isCustomer = true;
            if (decoded.role?.includes("ROLE_SELLER")) isSeller = true;
        } catch (err) {
            console.error("Invalid token", err);
        }
    }


    const handleLogout = () => {
        localStorage.removeItem('accessToken');
        navigate('/login', {
            replace: true,
            state: { redirectAfterLogin: window.location.pathname },
        });
    };


    const handleSearch = (e) => {
        e.preventDefault();
        if (!searchText.trim()) return;

        navigate(`/search?kword=${encodeURIComponent(searchText.trim())}`);
        setSearchText("");
    };

    return (
        <>

            <nav className="navbar navbar-dark bg-dark px-3" style={{ fontFamily: 'Poppins, sans-serif' }}>

                {/* Logo */}
                <span className="navbar-brand" style={{ cursor: 'pointer' }} onClick={() => navigate('/')}>
          The Essentials
        </span>


                <form className="d-flex mx-auto" style={{ width: "40%" }} onSubmit={handleSearch}>
                    <input
                        className="form-control me-2"
                        type="search"
                        placeholder="Search products..."
                        value={searchText}
                        onChange={(e) => setSearchText(e.target.value)}
                        style={{ height: "40px", fontSize: "15px" }}
                    />
                    <button className="btn btn-outline-light" type="submit" style={{ height: "40px" }}>
                        <i className="bi bi-search"></i>
                    </button>
                </form>


                <div className="d-flex align-items-center gap-2">
                    <button className="btn btn-outline-light me-2" data-bs-toggle="offcanvas" data-bs-target="#offcanvasWithBothOptions">
                        <i className="bi bi-person-circle"></i>
                    </button>

                    <button className="btn btn-outline-light me-2" onClick={() => navigate('/wishlist')}>
                        <i className="bi bi-heart"></i>
                    </button>

                    <button className="btn btn-outline-light" onClick={() => navigate('/cart')}>
                        <i className="bi bi-cart"></i>
                    </button>
                </div>
            </nav>


            <div className="offcanvas offcanvas-start" style={{ width: '280px' }} data-bs-scroll="true" tabIndex="-1" id="offcanvasWithBothOptions">
                <div className="offcanvas-header">
                    <h5 className="offcanvas-title" style={{ fontFamily: 'Poppins, sans-serif' }}>
                        {token ? (
                            <>
                                <i className="bi bi-person-circle me-2"></i> {username}
                            </>
                        ) : (
                            <span>Welcome!</span>
                        )}
                    </h5>

                    <button type="button" className="btn-close" data-bs-dismiss="offcanvas"></button>
                </div>

                <div className="offcanvas-body" style={{ fontFamily: 'Poppins, sans-serif' }}>
                    {token ? (
                        <>
                            <p className="mb-3 text-muted">Signed in as <strong>{username}</strong></p>

                            <button className="btn btn-outline-dark w-100 mb-2" onClick={() => navigate('/account')}>Your Account</button>
                            <button className="btn btn-outline-dark w-100 mb-2" onClick={() => navigate('/orders')}>Your Orders</button>
                            <button className="btn btn-outline-dark w-100 mb-2" onClick={() => navigate('/wishlist')}>Your Wishlist</button>
                            <button className="btn btn-outline-dark w-100 mb-2" onClick={() => navigate('/cart')}>Your Cart</button>

                            {isCustomer && (
                                <button className="btn btn-outline-dark w-100 mb-2" onClick={() => navigate('/becomeAseller')}>Become a Seller</button>
                            )}

                            {isSeller && (
                                <button className="btn btn-outline-dark w-100 mb-2" onClick={() => navigate('/sellerDash')}>Dashboard</button>
                            )}

                            {isAdmin && (
                                <button className="btn btn-outline-dark w-100 mb-2" onClick={() => navigate('/adminpage')}>Admin Panel</button>
                            )}

                            <button className="btn btn-danger w-100 mt-3" onClick={handleLogout}>
                                <i className="bi bi-box-arrow-right me-2"></i>Sign Out
                            </button>
                        </>
                    ) : (
                        <button className="btn btn-primary w-100" onClick={() => navigate('/login')}>
                            <i className="bi bi-box-arrow-in-right me-2"></i>Login
                        </button>
                    )}
                </div>
            </div>

            <div className="container-fluid" style={{ fontFamily: 'Poppins, sans-serif' }}>
                <div className="row">
                    <div className="col p-4">{children}</div>
                </div>
            </div>
        </>
    );
}

export default Layout;