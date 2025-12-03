
import React, { useEffect, useState } from "react";
import {
    getWishlistProducts,
    addToCart,
    clearWishlist,
    removeWishlist,
    buyNow,
} from "../../Services/RestAPI.js";
import { useNavigate } from "react-router-dom";

function WishlistPage() {
    const [wishlist, setWishlist] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();


    useEffect(() => {
        const loadWishlist = async () => {
            try {
                const res = await getWishlistProducts();
                // backend probably returns an array of wishlist items with "product"
                setWishlist(Array.isArray(res.data) ? res.data : []);
            } catch (err) {
                console.error("Failed to load wishlist:", err);
                const status = err.response?.status;
                if (status === 401 || status === 403) {
                    alert("Please login to view your wishlist.");
                    navigate("/login");
                } else {
                    alert("Could not load wishlist. Please try again.");
                }
            } finally {
                setLoading(false);
            }
        };

        loadWishlist();
    }, [navigate]);


    const getProductFromItem = (item) => {

        return item.product || item;
    };


    const handleAddToCart = async (item) => {
        const product = getProductFromItem(item);
        const pid = product?.pid;

        if (!pid) {
            console.error("Missing product pid in wishlist item:", item);
            alert("Cannot add to cart: product id is missing.");
            return;
        }

        try {
            await addToCart(pid, 1);
            alert("Item added to cart!");
        } catch (err) {
            console.error("Add to cart error:", err);
            alert("Failed to add item to cart.");
        }
    };

    const handleBuyNow = async (item) => {
        const product = getProductFromItem(item);
        const pid = product?.pid;

        if (!pid) {
            console.error("Missing product pid in wishlist item:", item);
            alert("Cannot proceed to checkout: product id is missing.");
            return;
        }

        try {
            navigate("/ordersplacement",{state: {
                    products: [{ ...product, quantity: 1 }]
                }});
        } catch (err) {
            console.error("Buy now error:", err);
            alert("Failed to place order.");
        }
    };

    const handleRemoveFromWishlist = async (item) => {
        const product = getProductFromItem(item);
        const pid = product?.pid;

        if (!pid) {
            console.error("Missing product pid in wishlist item:", item);
            alert("Cannot remove: product id is missing.");
            return;
        }

        try {
            await removeWishlist(pid);
            setWishlist((prev) =>
                prev.filter((wItem) => getProductFromItem(wItem)?.pid !== pid)
            );
        } catch (err) {
            console.error("Remove from wishlist error:", err);
            alert("Failed to remove item from wishlist.");
        }
    };


    const handleClearWishlist = async () => {
        if (!window.confirm("Clear your entire wishlist?")) return;

        try {
            await clearWishlist();
            setWishlist([]);
        } catch (err) {
            console.error("Clear wishlist error:", err);
            alert("Failed to clear wishlist.");
        }
    };

    const handleBuyAll = async () => {
        if (wishlist.length === 0) {
            alert("Your wishlist is empty.");
            return;
        }

        if (
            !window.confirm(
                "Buy all items from your wishlist? They will be ordered with quantity 1 each."
            )
        ) {
            return;
        }

        try {
            for (const item of wishlist) {
                const product = getProductFromItem(item);
                const pid = product?.pid;
                if (!pid) continue;
                await buyNow(pid, 1);
            }
            alert("Orders placed for all wishlist items!");
            navigate("/orders");
        } catch (err) {
            console.error("Buy all error:", err);
            alert("Failed to place orders for all items.");
        }
    };

    if (loading) {
        return (
            <div className="container mt-4">
                <p>Loading wishlist...</p>
            </div>
        );
    }

    return (
        <div className="container mt-4">
            <h3 className="mb-4">Your Wishlist</h3>

            {wishlist.length === 0 ? (
                <p className="text-muted">Your wishlist is empty.</p>
            ) : (
                <>
                    <div className="row">
                        {wishlist.map((item) => {
                            const product = getProductFromItem(item);
                            const key = item.id || product.pid;

                            return (
                                <div className="col-md-4 mb-4" key={key}>
                                    <div className="card h-100 shadow-sm">
                                        <img
                                            src={product?.imageUrl}
                                            className="card-img-top"
                                            alt={product?.name || "Product"}
                                            style={{ objectFit: "cover", height: "200px" }}
                                        />
                                        <div className="card-body d-flex flex-column">
                                            <h5 className="card-title">
                                                {product?.name || "Unnamed Product"}
                                            </h5>
                                            <p className="card-text mb-1">
                                                Brand: {product?.brand || "N/A"}
                                            </p>
                                            <p className="card-text mb-3">
                                                ₹{" "}
                                                {typeof product?.price === "number"
                                                    ? product.price.toFixed(2)
                                                    : product?.price || "N/A"}
                                            </p>

                                            <div className="mt-auto">
                                                <div className="d-flex gap-2 mb-2">
                                                    <button
                                                        className="btn btn-outline-primary btn-sm flex-fill"
                                                        onClick={() => handleAddToCart(item)}
                                                    >
                                                        Add to Cart
                                                    </button>
                                                    <button
                                                        className="btn btn-success btn-sm flex-fill"
                                                        onClick={() => handleBuyNow(item)}
                                                    >
                                                        Buy Now
                                                    </button>
                                                </div>
                                                <button
                                                    className="btn btn-outline-danger btn-sm w-100"
                                                    onClick={() => handleRemoveFromWishlist(item)}
                                                >
                                                    Remove from Wishlist
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>


                    <div className="mt-3 d-flex justify-content-between flex-wrap gap-2">
                        <button
                            className="btn btn-secondary"
                            onClick={() => navigate("/")}
                        >
                            ← Back to Home
                        </button>

                        <div className="d-flex gap-2">
                            <button
                                className="btn btn-outline-danger"
                                onClick={handleClearWishlist}
                            >
                                Clear Wishlist
                            </button>
                            <button className="btn btn-primary" onClick={handleBuyAll}>
                                Buy All
                            </button>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}

export default WishlistPage;
