import React, { useEffect, useState } from 'react';

import 'bootstrap-icons/font/bootstrap-icons.min.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import {getAllOrders, getAllProducts, getAllSellers,getAdminProducts,getAllSellerProducts} from "../../Services/RestAPI.js";
import { useNavigate } from 'react-router-dom';
import {getAllUsers} from "../../Services/RestAPI.js";


function AdminPage() {
    const [totalUsers, setTotalUsers] = useState(0);
    const [totalSellers, setTotalSellers] = useState(0);
    const [totalProducts, setTotalProducts] = useState(0);
    const [totalOrders, setTotalOrders] = useState(0);
    const[totalAdminProducts, setTotalAdminProducts] = useState(0);
    const[totalSellerProducts, setTotalSellerProducts] = useState(0);
    const navigate = useNavigate();

    const loadUsers = () => {
        getAllUsers()
            .then(response => setTotalUsers(response.data.length))
            .catch(error => console.log(error));
    };

    const loadSellersproducts = () => {
        getAllSellerProducts()
            .then(response => setTotalSellerProducts(response.data.length))
            .catch(error => console.log(error));
    }

    const loadAdminProducts = () => {
        getAdminProducts()
            .then(response => setTotalAdminProducts(response.data.length))
            .catch(error => console.log(error));
    }

    const loadOrders = () => {
        getAllOrders()
            .then(response => setTotalOrders(response.data.length))
            .catch(error => console.log(error));
    }
    const loadSellers = () => {
        getAllSellers()
            .then(response => setTotalSellers(response.data.length))
            .catch(error => console.log(error));
    };

    const loadProducts = () => {
        getAllProducts()
            .then(response => setTotalProducts(response.data.length))
            .catch(error => console.log(error));
    }

    useEffect(() => {
        loadUsers();
        loadSellers();
        loadProducts();
        loadOrders();
        loadSellersproducts();
        loadAdminProducts()
    }, []);

    return (
        <>

            <div className="container mt-5">
                <div className="card text-center shadow-lg">
                    <div className="card-header fs-4 fw-bold bg-primary text-white">
                        Admin Dashboard
                    </div>

                    <div className="card-body">
                        <div className="row">
                            <div className="col-md-4 mb-3">
                                <div className="card border-success">
                                    <div className="card-body">
                                        <h5 className="card-title text-success">Total Users</h5>
                                        <p className="card-text fs-3">{totalUsers}</p>
                                        <button
                                            className="btn btn-outline-success"
                                            onClick={() => navigate('/admin/Userdata')}
                                        >
                                            View Users
                                        </button>
                                    </div>
                                </div>
                            </div>

                            <div className="col-md-4 mb-3">
                                <div className="card border-warning">
                                    <div className="card-body">
                                        <h5 className="card-title text-warning">Total Sellers</h5>
                                        <p className="card-text fs-3">{totalSellers}</p>
                                        <button
                                            className="btn btn-outline-warning"
                                            onClick={() => navigate('/admin/sellerdata')}
                                        >
                                            View Sellers
                                        </button>
                                    </div>
                                </div>
                            </div>

                            <div className="col-md-4 mb-3">
                                <div className="card border-danger">
                                    <div className="card-body">
                                        <h5 className="card-title text-warning">Total Orders</h5>
                                        <p className="card-text fs-3">{totalOrders}</p>
                                        <button className="btn btn-outline-warning" onClick={() => navigate('/admin/orders')} >View Orders</button>
                                    </div>
                                </div>
                            </div>

                            <div className="col-md-4 mb-3">
                                <div className="card border-danger">
                                    <div className="card-body">
                                        <h5 className="card-title text-warning">Total Products</h5>
                                        <p className="card-text fs-3">{totalProducts}</p>
                                        <button className="btn btn-outline-warning" onClick={() => navigate('/admin/products', {state :{type : "ALL"}})} >view products</button>
                                    </div>
                                </div>
                            </div>

                            <div className="col-md-4 mb-3">
                                <div className="card border-info">
                                    <div className="card-body">
                                        <h5 className="card-title text-info">Admin Products</h5>
                                        <p className="card-text fs-3">{totalAdminProducts}</p>
                                        <button className="btn btn-outline-info" onClick={() => navigate('/admin/products', { state : { type :"ADMIN"}})} >View Admin Products</button>

                                    </div>
                                </div>
                            </div>

                            <div className="col-md-4 mb-3">
                                <div className="card border-info-subtle">
                                    <div className="card-body">
                                        <h5 className="card-title text-info">total seller products</h5>
                                        <p className="card-text fs-3">{totalSellerProducts}</p>
                                        <button className="btn btn-outline-info" onClick={() => navigate('/admin/products', { state : { type : "Seller" }})}>view sellerproducts </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default AdminPage;
