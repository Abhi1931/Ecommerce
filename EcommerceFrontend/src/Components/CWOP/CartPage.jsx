import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    getCartItems,
    deleteSingleCartItem,
    clearCart
} from '../../Services/RestAPI.js';
import { FaCartPlus, FaTrashAlt, FaBolt } from 'react-icons/fa';

function CartPage() {
    const [cartItems, setCartItems] = useState([]);
    const navigate = useNavigate();

    const token = localStorage.getItem('accessToken');

    useEffect(() => {
        if (!token) {
            sessionStorage.setItem("redirectAfterLogin", window.location.pathname);
            alert('Please login to view your cart');
            navigate('/login');
            return;
        }

        loadCart();
    }, []);

    const loadCart = () => {
        getCartItems(token)
            .then(res => {
                const items = res.data || [];


                const merged = Object.values(
                    items.reduce((acc, item) => {
                        const pid = item.product?.pid;
                        if (!pid) return acc;

                        if (!acc[pid]) {
                            acc[pid] = { ...item };
                        } else {
                            acc[pid] = {
                                ...acc[pid],
                                quantity: (acc[pid].quantity || 1) + (item.quantity || 1),
                            };
                        }
                        return acc;
                    }, {})
                );

                setCartItems(merged);
            })
            .catch(err => console.error('Error loading cart:', err));
    };


    const handleBuySingle = (item) => {
        navigate('/ordersplacement', { state: { products: [{ ...item.product, quantity: item.quantity || 1 }] } });
    };

    const handleBuyAll = () => {
        const orderItems = cartItems.map((item) => ({
            ...item.product,
            quantity: item.quantity || 1,
        }));
        navigate('/orders', { state: { products: orderItems } });
    };

    const handleDeleteSingle = (productId) => {
        deleteSingleCartItem(productId, token)
            .then(() => {
                alert('Item removed from cart!');
                loadCart();
            })
            .catch(err => console.error('Error deleting item:', err));
    };

    const handleClearCart = () => {
        clearCart(token)
            .then(() => {
                alert('Cart cleared!');
                loadCart();
            })
            .catch(err => console.error('Error clearing cart:', err));
    };

    return (
        <div className="container mt-4">
            <h3 className="mb-4">
                <FaCartPlus className="me-2" />
                Your Cart
            </h3>

            {cartItems.length === 0 ? (
                <p className="text-muted">Your cart is empty.</p>
            ) : (
                <div className="row">
                    {cartItems.map((item) => (
                        <div className="col-md-4 mb-4" key={item.id}>
                            <div className="card h-100">
                                <img
                                    src={item.product?.imageUrl}
                                    className="card-img-top"
                                    alt={item.product?.productName}
                                    style={{ objectFit: 'cover', height: '200px' }}
                                />
                                <div className="card-body">
                                    <h5 className="card-title">{item.product?.productName}</h5>
                                    <p className="card-text">Brand: {item.product?.brand}</p>
                                    <p className="card-text">₹ {item.product?.price?.toFixed(2)}</p>
                                    <p className="card-text">Quantity: {item.quantity || 1}</p>
                                    <div className="d-flex justify-content-between mt-3">
                                        <button
                                            className="btn btn-warning text-white"
                                            onClick={() => handleBuySingle(item)}
                                        >
                                            <FaBolt /> Buy Now
                                        </button>
                                        <button
                                            className="btn btn-outline-danger"
                                            onClick={() => handleDeleteSingle(item.product?.pid)}
                                        >
                                            <FaTrashAlt /> Delete
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            <div className="mt-4 d-flex gap-3">
                <button className="btn btn-success" onClick={handleBuyAll}>
                    Buy All
                </button>
                <button className="btn btn-danger" onClick={handleClearCart}>
                    Clear Cart
                </button>
                <button className="btn btn-secondary ms-auto" onClick={() => navigate('/')}>← Back to Home</button>
            </div>
        </div>
    );
}

export default CartPage;
