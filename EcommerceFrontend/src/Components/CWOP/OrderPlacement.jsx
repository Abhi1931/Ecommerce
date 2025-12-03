import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { buyNow } from '../../Services/RestAPI.js';
import 'bootstrap/dist/css/bootstrap.min.css';
import { FaCheckCircle } from 'react-icons/fa';
import QuantitySelector from '../QuantitySelector.jsx';

function OrderPlacement() {
    const location = useLocation();
    const navigate = useNavigate();
    const token = localStorage.getItem('accessToken');

        const initialProducts = (location.state?.products || []).map(p => ({ ...p, quantity: Number(p.quantity || 1 ),pid: p.pid ?? p.id}));
    const [products, setProducts] = useState(initialProducts);

    const [showPopup, setShowPopup] = useState(false);
    const [address, setAddress] = useState({
        city: '',
        pincode: '',
        landmark: '',
        state: '',
        phone: ''
    });

    const addressToString = (addr) => {

        return `${addr.landmark || ""}, ${addr.city || ""}, ${addr.state || ""} - ${addr.pincode || ""} (Phone: ${addr.phone || ""})`.replace(/\s*,\s*,/g, ",").replace(/^\s*,\s*/, "").trim();
    };

    const total = products.reduce((sum, item) => sum + item.price * item.quantity, 0);

    const handleInputChange = (e) => {
        setAddress({ ...address, [e.target.name]: e.target.value });
    };

    const isAddressValid = () =>
        address.city && address.pincode && address.landmark && address.state && address.phone;

    const handlePlaceOrder = async () => {
        if (!isAddressValid()) {
            alert('Please fill all address fields');
            return;
        }

        if (!products.length) {
            alert('No products to order');
            return;
        }

        try {

            const addressString = addressToString(address);


            for (const item of products) {

                const qty = Number(item.quantity) || 1;
                await buyNow(item.pid, qty, addressString);
            }

            setShowPopup(true);
            setTimeout(() => {
                setShowPopup(false);
                navigate('/');
            }, 1600);
        } catch (err) {
            console.error('Order failed:', err);
            alert('Something went wrong while placing the order');
        }
    };

    const updateQuantity = (pid, newQty) => {
        setProducts(prev => prev.map(p => {
            const isSame = (p.pid == pid) || (String(p.pid) === String(pid));
            if (!isSame) return p;
            const maxQty = Math.min(Number(p.stock || 10, 10)); // stock-aware limit
            let clampedQty = Number(newQty) || 1;
            if (clampedQty < 1) clampedQty=1;
            if (clampedQty > maxQty) return clampedQty=maxQty;
            return { ...p, quantity: clampedQty };
        }));
    };

    return (
        <div className="container mt-4">
            <h3 className="mb-4">Confirm Your Order</h3>

            <div className="row">
                {products.map((product) => (
                    <div className="col-md-6 mb-3" key={product.pid}>
                        <div className="card">
                            <div className="row g-0">
                                <div className="col-md-4">
                                    <img
                                        src={product.imageUrl}
                                        alt={product.name}
                                        className="img-fluid rounded-start"
                                    />
                                </div>
                                <div className="col-md-8">
                                    <div className="card-body">
                                        <h5 className="card-title">{product.name}</h5>
                                        <p className="card-text">Brand: {product.brand}</p>
                                        <div className="table-hover">
                                            <QuantitySelector
                                                quantity={product.quantity}
                                                setQuantity={(qty) => updateQuantity(product.pid, qty)}
                                                max={Math.min(product.stock || 10, 10)}
                                            />
                                            <small className="text-muted">(Max: {Math.min(product.stock || 10, 10)})</small>
                                        </div>
                                        <p className="card-text">Price: ₹{product.price}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <h5 className="mt-3">Total Amount: ₹{total.toFixed(2)}</h5>

            <div className="mt-4">
                <h5>Delivery Address</h5>
                <div className="row">
                    {['city', 'pincode', 'landmark', 'state', 'phone'].map((field) => (
                        <div className="col-md-6 mb-3" key={field}>
                            <input
                                type="text"
                                name={field}
                                className="form-control"
                                placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
                                value={address[field]}
                                onChange={handleInputChange}
                                required
                            />
                        </div>
                    ))}
                </div>
            </div>

            <div className="text-md-end mt-4">
                <button className="btn btn-success px-4" onClick={handlePlaceOrder}>
                    Place Order
                </button>

            </div>

            <div className="text-md-start mt-4">
                <button className="btn btn-danger " onClick={() => navigate('/')}> <i className="bi bi-arrow-left"></i> Back to Home </button>
            </div>
            {showPopup && (
                <div
                    className="position-fixed top-50 start-50 translate-middle bg-light shadow p-4 text-center rounded"
                    style={{ zIndex: 1050, width: '300px' }}
                >
                    <FaCheckCircle size={40} className="text-success mb-3" />
                    <h5 className="mb-0">Order Placed Successfully!</h5>
                </div>
            )}
        </div>
    );
}

export default OrderPlacement;
