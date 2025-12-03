// AdminOrderViewer.jsx
import React, { useEffect, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import api from '/src/Services/RestAPI.js';
import { useNavigate } from 'react-router-dom';
import { Offcanvas, Button, Form } from 'react-bootstrap';

function AdminOrderViewer() {
    const [orders, setOrders] = useState([]);
    const [filteredOrders, setFilteredOrders] = useState([]);
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [showCanvas, setShowCanvas] = useState(false);
    const [filter, setFilter] = useState('all');
    const navigate = useNavigate();

    useEffect(() => {
        api.get("/admin/orders")
            .then(response => {
                setOrders(response.data);
                setFilteredOrders(response.data);
            })
            .catch(error => console.error("Error loading orders:", error));
    }, []);

    useEffect(() => {
        applyFilter();
    }, [filter, orders]);

    const applyFilter = () => {
        const now = new Date();
        let filtered = orders;

        if (filter === 'week') {
            filtered = orders.filter(order => new Date(order.date) >= new Date(now.setDate(now.getDate() - 7)));
        } else if (filter === 'month') {
            filtered = orders.filter(order => new Date(order.date) >= new Date(now.setMonth(now.getMonth() - 1)));
        }

        setFilteredOrders(filtered);
    };

    const handleOrderClick = (order) => {
        setSelectedOrder(order);
        setShowCanvas(true);
    };

    const goToProduct = (productName) => {
        navigate(`/product/${productName}`);
    };

    const goToUser = (email) => {
        navigate(`/account/${email}`);
    };

    return (
        <div className="container mt-5">
            <h2 className="mb-4 text-center">All Orders (Admin)</h2>

            <div className="card border-info mb-4">
                <div className="card-body text-center">
                    <h5 className="card-title">Total Orders</h5>
                    <p className="card-text fs-3">{filteredOrders.length}</p>
                </div>
            </div>

            <Form className="mb-4">
                <Form.Label>Filter Orders</Form.Label>
                <Form.Select value={filter} onChange={(e) => setFilter(e.target.value)}>
                    <option value="all">All</option>
                    <option value="week">Last 7 Days</option>
                    <option value="month">Last 30 Days</option>
                </Form.Select>
            </Form>

            <table className="table table-bordered table-hover">
                <thead className="table-info">
                <tr>
                    <th>Order ID</th>
                    <th>Product Name</th>
                    <th>User Email</th>
                </tr>
                </thead>
                <tbody>
                {filteredOrders.map((order) => (
                    <tr key={order.id}>
                        <td>
                            <button className="btn btn-outline-primary btn-sm" onClick={() => handleOrderClick(order)}>
                                {order.id}
                            </button>
                        </td>
                        <td>{order.productName}</td>
                        <td>{order.userEmail}</td>
                    </tr>
                ))}
                </tbody>
            </table>

            <Offcanvas show={showCanvas} onHide={() => setShowCanvas(false)} placement="end">
                <Offcanvas.Header closeButton>
                    <Offcanvas.Title>Order Details</Offcanvas.Title>
                </Offcanvas.Header>
                <Offcanvas.Body>
                    {selectedOrder && (
                        <div>
                            <img
                                src={selectedOrder.productImageUrl}
                                alt={selectedOrder.productName}
                                className="img-fluid mb-3 rounded border"
                            />
                            <h5>Product: {selectedOrder.productName}</h5>
                            <p>Category: {selectedOrder.productCategory}</p>
                            <p>Price: ₹{selectedOrder.productPrice}</p>
                            <p>Quantity: {selectedOrder.quantity}</p>
                            <h6>User: {selectedOrder.userFullName}</h6>
                            <p>Email: {selectedOrder.userEmail}</p>
                            <div className="d-flex gap-3">
                                <Button variant="info" onClick={() => goToProduct(selectedOrder.productName)}>
                                    View Product
                                </Button>
                                <Button variant="secondary" onClick={() => goToUser(selectedOrder.userEmail)}>
                                    View User
                                </Button>
                            </div>
                        </div>
                    )}
                </Offcanvas.Body>
            </Offcanvas>
        </div>
    );
}

export default AdminOrderViewer;
