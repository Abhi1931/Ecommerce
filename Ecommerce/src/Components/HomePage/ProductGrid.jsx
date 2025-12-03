import React, { useEffect, useState } from 'react';
import {getAllProducts, addToWishlist, addToCart, handleApiError, TokenManager, getCartItems} from '../../Services/RestAPI.js';
import { Link, useNavigate } from 'react-router-dom';
import { FaHeart, FaCartPlus, FaBolt } from 'react-icons/fa';
import './ProductGrid.css';
import 'animate.css';

function ProductGrid() {
    const [products, setProducts] = useState([]);
    const [wishlist, setWishlist] = useState({});
    const [addedProduct, setAddedProduct] = useState(null);
    const [showOffcanvas, setShowOffcanvas] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [cartLoading, setCartLoading] = useState({});
    const [wishlistLoading, setWishlistLoading] = useState({});
    const navigate = useNavigate();

    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        try {
            setLoading(true);
            setError(null);
            const response = await getAllProducts();
            setProducts(response.data);
        } catch (err) {
            setError(handleApiError(err));
            console.error('Error fetching products:', err);
        } finally {
            setLoading(false);
        }
    };

    const isAuthenticated = () => {
        return TokenManager.getAccessToken() !== null;
    };

    const requireLogin = () => {
        if (!isAuthenticated()) {
            sessionStorage.setItem('redirectAfterLogin', window.location.pathname);
            alert('Please login to continue');
            navigate('/login');
            return false;
        }
        return true;
    };

    const toggleWishlist = async (pid) => {
        if (!requireLogin()) return;

        try {
            setWishlistLoading(prev => ({ ...prev, [pid]: true }));

            const response = await addToWishlist(pid);

            if (response.data===false) {
                alert('Item is already wishlisted.');
                return;
            }
            else{
                alert('Item wishlisted');
            }

            setWishlist(prev => ({
                ...prev,
                [pid]: !prev[pid]
            }));
        } catch (err) {
            console.error('Wishlist Error:', err);
            if (err.response?.status === 409) {
                alert('Item is already wishlisted.');
            } else {
                alert(handleApiError(err));
            }
        } finally {
            setWishlistLoading(prev => ({ ...prev, [pid]: false }));
        }
    };

    const handleAddToCart = async (pid) => {
        if (!requireLogin()) return;
        if (!Array.isArray(products)) {
            console.error("Products list is not available");
            return;
        }

        const product = products.find(p => p.pid === pid);
        if (!product) {
            console.error("Product not found for pid:", pid);
            return;
        }

        try {
            setCartLoading(prev => ({ ...prev, [pid]: true }));
            const token = TokenManager.getAccessToken();
            const cartResponse = await getCartItems(token);
            const cartItems = cartResponse.data || [];
            const alreadyInCart = cartItems.some(item => item.product?.pid === pid);


            if (alreadyInCart) {
                const confirmIncrease = window.confirm(
                    "Product is already in the cart. Do you want to increase the quantity?"
                );
                if (!confirmIncrease) {
                    setCartLoading(prev => ({ ...prev, [pid]: false }));
                    return;
                }
            }

            await addToCart(pid,1);
            setAddedProduct(product);
            setShowOffcanvas(true);
            setTimeout(() => {
                setShowOffcanvas(false);
            }, 2000);
        } catch (err) {
            console.error('Cart Error:', err);
            alert(handleApiError(err));
        } finally {
            setCartLoading(prev => ({ ...prev, [pid]: false }));
        }
    };

    const handleBuyNow = (product) => {
        if (!requireLogin()) return;

        navigate('/ordersplacement', {
            state: {
                products: [{ ...product, quantity: 1 }]
            }
        });
    };

    const handleRetry = () => {
        fetchProducts();
    };

    if (loading) {
        return (
            <div className="container-fluid mt-4">
                <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '400px' }}>
                    <div className="spinner-border text-primary" role="status">
                        <span className="visually-hidden">Loading...</span>
                    </div>
                </div>
            </div>
        );
    }


    if (error) {
        return (
            <div className="container-fluid mt-4">
                <div className="alert alert-danger text-center" role="alert">
                    <h4 className="alert-heading">Error Loading Products</h4>
                    <p>{error}</p>
                    <button className="btn btn-primary" onClick={handleRetry}>
                        Try Again
                    </button>
                </div>
            </div>
        );
    }


    if (products.length === 0) {
        return (
            <div className="container-fluid mt-4">
                <div className="text-center" style={{ minHeight: '400px', paddingTop: '100px' }}>
                    <h4 className="text-muted">No products available</h4>
                    <p className="text-muted">Check back later for new products!</p>
                </div>
            </div>
        );
    }

    return (
        <div className="container-fluid mt-4">

            <div className="row g-4">
                {products.map((product) => (
                    <div className="col-12 col-sm-6 col-md-4 col-lg-3" key={product.pid}>
                        <div className="card h-100 shadow-sm position-relative">

                            <button
                                className="btn position-absolute top-0 end-0 m-2 p-1"
                                style={{
                                    backgroundColor: 'rgba(0,0,0,0.6)',
                                    borderRadius: '50%',
                                    width: '34px',
                                    height: '34px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center'
                                }}
                                onClick={() => toggleWishlist(product.pid)}
                                disabled={wishlistLoading[product.pid]}
                            >
                                {wishlistLoading[product.pid] ? (
                                    <div className="spinner-border spinner-border-sm text-light"></div>
                                ) : (
                                    <FaHeart
                                        size={18}
                                        color={wishlist[product.pid] ? 'red' : 'white'}
                                        style={{
                                            filter: 'drop-shadow(0 0 4px black)',
                                        }}
                                    />
                                )}
                            </button>


                            <Link to={`/product/${product.pid}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                                <img
                                    src={product.imageUrl}
                                    alt={product.name}
                                    className="card-img-top"
                                    style={{ height: '200px', objectFit: 'cover' }}
                                    onError={(e) => {
                                        e.target.src = '/placeholder-image.jpg'; // Fallback image
                                    }}
                                />
                            </Link>

                            <div className="card-body">
                                <h6 className="card-title text-truncate" title={product.name}>
                                    {product.name}
                                </h6>
                                <p className="text-muted mb-1">₹ {product.price.toFixed(2)}</p>
                                <small className={product.availability ? 'text-success' : 'text-danger'}>
                                    {product.availability ? 'In Stock' : 'Out of Stock'}
                                </small>
                            </div>

                            <div className="card-footer d-flex justify-content-between">
                                <button
                                    className="btn btn-outline-primary btn-sm"
                                    onClick={() => handleAddToCart(product.pid)}
                                    disabled={cartLoading[product.pid] || !product.availability}
                                >
                                    {cartLoading[product.pid] ? (
                                        <>
                                            <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                                            Adding...
                                        </>
                                    ) : (
                                        <>
                                            <FaCartPlus /> Add to Cart
                                        </>
                                    )}
                                </button>
                                <button
                                    className="btn btn-warning btn-sm text-white"
                                    onClick={() => handleBuyNow(product)}
                                    disabled={!product.availability}
                                >
                                    <FaBolt /> Buy Now
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <div
                className={`offcanvas offcanvas-bottom ${showOffcanvas ? 'show animate__animated animate__slideInUp' : ''}`}
                tabIndex="-1"
                style={{
                    visibility: showOffcanvas ? 'visible' : 'hidden',
                    height: '400px',
                    transition: 'all 0.5s ease-in-out',
                    zIndex: 1055
                }}
            >
                <div className="offcanvas-header">
                    <h5 className="offcanvas-title text-success">
                        ✓ Added to Cart Successfully!
                    </h5>
                    <button
                        type="button"
                        className="btn-close"
                        onClick={() => setShowOffcanvas(false)}
                    ></button>
                </div>
                <div className="offcanvas-body d-flex align-items-center justify-content-between px-4 fs-5 fw-semibold">
                    {addedProduct && (
                        <>
                            <div className="d-flex align-items-center">
                                <img
                                    src={addedProduct.imageUrl}
                                    alt="product"
                                    style={{ width: '300px', height: '300px', objectFit: 'cover' }}
                                    className="me-3"
                                    onError={(e) => {
                                        e.target.src = '/placeholder-image.jpg'; // Fallback image
                                    }}
                                />
                                <div>
                                    <div className="fw-bold fs-10">{addedProduct.name}</div>
                                    <div className="text-muted fw-semibold fs-7">{addedProduct.category}</div>
                                </div>
                            </div>
                            <div className="text-center fw-bold fs-10">
                                <div>Qty: 1</div>
                            </div>
                            <div className="fw-bold fs-17">
                                ₹ {addedProduct.price.toFixed(2)}
                            </div>
                        </>
                    )}
                </div>
                <div className="offcanvas-footer p-3">
                    <div className="d-flex gap-2">
                        <button
                            className="btn btn-outline-primary flex-fill"
                            onClick={() => navigate('/cart')}
                        >
                            View Cart
                        </button>
                        <button
                            className="btn btn-primary flex-fill"
                            onClick={() => setShowOffcanvas(false)}
                        >
                            Continue Shopping
                        </button>
                    </div>
                </div>
            </div>

            {showOffcanvas && (
                <div
                    className="offcanvas-backdrop fade show"
                    onClick={() => setShowOffcanvas(false)}
                ></div>
            )}
        </div>
    );
}

export default ProductGrid;
