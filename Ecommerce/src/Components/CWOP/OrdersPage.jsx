import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getUserOrders, handleApiError } from "../../Services/RestAPI.js";

function UserOrdersPage() {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        getUserOrders()
            .then((res) => {
                console.log("Orders from backend:", res.data); // just to inspect once
                setOrders(Array.isArray(res.data) ? res.data : []);
            })
            .catch((err) => {
                console.error("Failed to load orders:", err);
                const msg = handleApiError(err);
                setError(msg);

                if (err.response?.status === 401) {
                    localStorage.removeItem("accessToken");
                    navigate("/login");
                }
            })
            .finally(() => setLoading(false));
    }, [navigate]);

    const formatDateTime = (value) => {
        if (!value) return "—";
        try {
            return new Date(value).toLocaleString();
        } catch {
            return String(value);
        }
    };

    if (loading) {
        return (
            <div className="container mt-4">
                <p>Loading your orders...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="container mt-4">
                <p className="text-danger">{error}</p>
            </div>
        );
    }

    return (
        <div className="container mt-4">
            <h2 className="mb-4">My Orders</h2>

            {orders.length === 0 ? (
                <p className="text-muted">You haven’t placed any orders yet.</p>
            ) : (
                <div className="row g-3">
                    {orders.map((order) => {

                        const productName =
                            order.product?.name || order.product?.productName || "Product";
                        const productImage = order.product?.imageUrl || "";
                        const singlePrice = order.product?.price;
                        const qty = order.quantity;
                        const total = order.totalPrice;
                        const status = order.status;

                        return (
                            <div className="col-md-6" key={order.id}>
                                <div className="card shadow-sm h-100">
                                    <div className="card-body d-flex">
                                        {productImage && (
                                            <img
                                                src={productImage}
                                                alt={productName}
                                                style={{
                                                    width: "80px",
                                                    height: "80px",
                                                    objectFit: "cover",
                                                    borderRadius: "8px",
                                                    marginRight: "16px",
                                                }}
                                            />
                                        )}

                                        <div className="flex-grow-1">
                                            <h5 className="card-title mb-1">
                                                Order #{order.id}
                                            </h5>
                                            <p className="mb-1 text-muted">
                                                Placed on: {formatDateTime(order.orderPlacedAt)}
                                            </p>

                                            <p className="mb-1">
                                                <strong>Product:</strong> {productName}
                                            </p>
                                            <p className="mb-1">
                                                <strong>Qty:</strong> {qty}
                                                {singlePrice != null && (
                                                    <>
                                                        {" "}
                                                        × ₹{Number(singlePrice).toFixed(2)}
                                                    </>
                                                )}
                                            </p>

                                            <p className="mb-1">
                                                <strong>Total:</strong>{" "}
                                                <span className="text-success">
                          ₹ {Number(total).toFixed(2)}
                        </span>
                                            </p>

                                            <span
                                                className={`badge mt-2 ${
                                                    status === "DELIVERED"
                                                        ? "bg-success"
                                                        : status === "CANCELLED"
                                                            ? "bg-danger"
                                                            : "bg-warning text-dark"
                                                }`}
                                            >
                        {status}
                      </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}

export default UserOrdersPage;
