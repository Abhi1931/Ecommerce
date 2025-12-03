import React, { useEffect, useState } from "react";
import 'bootstrap/dist/css/bootstrap.min.css';
import { getAllOrders} from "../../Services/RestAPI.js";
import {useNavigate} from "react-router-dom";

function OrdersData() {
    const [orders, setOrders] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
const navigate = useNavigate();
    useEffect(() => {
        fetchOrders();
    }, []);

    const fetchOrders = async () => {
        try {
            const response = await getAllOrders();
            setOrders(response.data);
        } catch (error) {
            console.error("Error fetching orders:", error);
        }
    };




    const filteredOrders = orders.filter(order =>
        order.id?.toString().includes(searchTerm) ||
        order.user?.fullname?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.product?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.status?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.seller?.name?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="container mt-4">
            <h2 className="mb-4 text-center">Sellers data</h2>

            <div className="d-flex justify-content-between mb-3">
            <button className= "btn btn-dark" onClick= {() => navigate("/adminpage")}>Back</button>

            {/* Search Bar */}
            <div className="d-flex align-items-center gap-2">
            <input
                type="text"
                style={{ minWidth: 260 }}
                placeholder="Search by Order ID, User, Product, or Status"
                className="form-control-center"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
            />
                {searchTerm && (
                    <button className="btn btn-outline-secondary" onClick={() => setSearchTerm("")}> clear </button>
                )}
            </div>
            </div>
            <table className="table table-striped">
                <thead>
                <tr>
                    <th>Order ID</th>
                    <th>User</th>
                    <th>Product</th>
                    <th>Quantity</th>
                    <th>Total Price</th>
                    <th>Status</th>
                    <th>Order Date</th>
                    <th>Seller</th>
                </tr>
                </thead>
                <tbody>
                {filteredOrders.length > 0 ? (
                    filteredOrders.map((order) => (
                        <tr key={order.id}>
                            <td>{order.id}</td>
                            <td>{order.user?.fullname} ({order.user?.username})</td>
                            <td>{order.product?.name}</td>
                            <td>{order.quantity}</td>
                            <td>{order.totalPrice}</td>
                            <td>{order.status}</td>
                            <td>{new Date(order.orderPlacedAt).toLocaleString()}</td>
                            <td>
                                {order.product?.sellers?.map((s, i) => (
                                    <span key={i}>{s.name} ({s.company})</span>
                                ))}
                            </td>
                        </tr>
                    ))
                ) : (
                    <tr>
                        <td colSpan="9" className="text-center">No orders found</td>
                    </tr>
                )}
                </tbody>
            </table>
        </div>

    );
}

export default OrdersData;
