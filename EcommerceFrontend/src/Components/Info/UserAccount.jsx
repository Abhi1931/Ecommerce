import React, { useEffect, useState } from 'react';
import { getUserById, getUserOrders } from '../../Services/RestAPI.js';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import 'bootstrap-icons/font/bootstrap-icons.min.css';
import 'bootstrap/dist/css/bootstrap.min.css';

function UserAccount() {
    const [user, setUser] = useState({});
    const [orders, setOrders] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem('accessToken');
        if (!token) {
            navigate('/login');
            return;
        }

        let decoded;
        try {

            decoded = jwtDecode(token);
        } catch (err) {
            console.error("Invalid token or decoding error:", err);
            navigate('/login');
            return;
        }

        const userId = decoded?.id;
        if (!userId) {
            console.error("User ID not found in token.");
            navigate('/login');
            return;
        }

        async function fetchUserAndOrders() {
            try {

                const resUser = await getUserById(userId);

                setUser(resUser?.data || {});
            } catch (err) {
                console.error("Failed to load user:", err);
            }

            try {
                const resOrders = await getUserOrders(token);

                setOrders(resOrders?.data || []);
            } catch (err) {
                console.error("Failed to load orders:", err);
            }
        }

        fetchUserAndOrders();
    }, [navigate]);

    return (
        <div className="container mt-4">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h3><i className="bi bi-person-circle me-2"></i>My Account</h3>
                <button className="btn btn-secondary" onClick={() => navigate('/')}> <i className="bi bi-arrow-left"></i> Back to Home </button>
            </div>

            {user && user.email ? (
                <>
                    <div className="card mb-4">
                        <div className="card-body">
                            <p><i className="bi bi-person-fill"></i> <strong>Name:</strong> {user.fullname}</p>
                            <p><i className="bi bi-envelope-fill"></i> <strong>Email:</strong> {user.email}</p>

                            <p><i className="bi bi-person-badge-fill"></i> <strong>Username:</strong> {user.username}</p>
                            <button className="btn btn-primary mt-3" onClick={() => navigate('/update')}>
                                <i className="bi bi-pencil-square"></i> Update Details
                            </button>
                        </div>
                    </div>

                    <div>
                        <h4><i className="bi bi-box-seam"></i> Recent Orders</h4>
                        {orders.length > 0 ? (
                            <ul className="list-group">
                                {orders.map((order, idx) => {
                                    const product = order.product || {};

                                    return (
                                        <li className="list-group-item d-flex align-items-center" key={idx}>
                                            {product.imageUrl && (
                                                <img
                                                    src={product.imageUrl}
                                                    alt={product.name}
                                                    style={{ width: '60px', height: '60px', objectFit: 'cover', marginRight: '15px' }}
                                                />
                                            )}
                                            <div>
                                                <strong> Name :{product.name}</strong><br />
                                                Category: {product.category} <br />
                                                ₹{order.totalPrice} ({order.quantity} pcs)
                                            </div>
                                        </li>
                                    );
                                })}
                            </ul>

                        ) : (
                            <p className="text-muted">No recent orders found.</p>
                        )}
                    </div>
                </>
            ) : (
                <p className="text-muted">Loading user details...</p>
            )}
        </div>
    );
}

export default UserAccount;
