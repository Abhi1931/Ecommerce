import React, { useState, useId } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaHeart, FaCartPlus, FaBolt, FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import './HorizontalProductSlider.css';
import { addToWishlist, handleApiError, TokenManager } from "../Services/RestAPI.js";

function HorizontalProductSlider({ title = "Products", products = [], id }) {
    const navigate = useNavigate();
    const [wishlist, setWishlist] = useState({});
    const reactId = (useId && useId()) || Math.random().toString(36).substring(2, 9);
    const sliderId = id || `scroll-${title.replace(/\s+/g, '-').toLowerCase()}-${reactId}`;
    const [wishlistLoading, setWishlistLoading] = useState({});

    const isAuthenticated = () => TokenManager.getAccessToken() !== null;

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


            if (response?.data === false) {
                alert('Item is already wishlisted.');
            } else {

                setWishlist(prev => ({ ...prev, [pid]: !prev[pid] }));
                alert('Item wishlisted');
            }
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

    const handleBuyNow = (product) => {
        navigate('/ordersplacement', {
            state: {
                products: [{ ...product, quantity: 1 }]
            }
        });
    };

    const scrollContainer = (direction) => {
        const container = document.getElementById(sliderId);
        if (!container) return;
        const scrollAmount = Math.round(container.clientWidth * 0.8);
        container.scrollBy({
            left: direction === 'left' ? -scrollAmount : scrollAmount,
            behavior: 'smooth'
        });
    };

    return (
        <div className="mt-5 position-relative">
            <h5 className="mb-3 ps-2 fw-bold">{title}</h5>

            <div className="scroll-button left" role="button" aria-label="scroll-left" onClick={() => scrollContainer('left')}>
                <FaChevronLeft />
            </div>
            <div className="scroll-button right" role="button" aria-label="scroll-right" onClick={() => scrollContainer('right')}>
                <FaChevronRight />
            </div>

            <div
                className="horizontal-scroll-wrapper"
                id={sliderId}
                tabIndex={0}
                aria-label={`${title} slider`}
            >
                {products.map((product) => {
                    const pid = product.pid ?? product.id ?? product._id;
                    return (
                        <div className="product-card shadow-sm" key={pid}>

                            <div className="product-image-wrapper" style={{ position: 'relative' }}>
                                <Link to={`/product/${pid}`}>
                                    <img
                                        src={product.imageUrl || '/placeholder-image.jpg'}
                                        alt={product.name ?? 'Product'}
                                        className="product-image"
                                        loading="lazy"
                                        onError={(e) => { e.target.onerror = null; e.target.src = '/placeholder-image.jpg'; }}
                                    />
                                </Link>

                                <button
                                    className="btn wishlist-btn"
                                    aria-label={wishlist[pid] ? 'Remove from wishlist' : 'Add to wishlist'}
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        e.preventDefault();
                                        toggleWishlist(pid);
                                    }}
                                    disabled={!!wishlistLoading[pid]}
                                    style={{
                                        position: 'absolute',
                                        top: 8,
                                        right: 8,
                                        zIndex: 9999,
                                        backgroundColor: 'rgba(0,0,0,0.6)',
                                        borderRadius: '50%',
                                        width: 36,
                                        height: 36,
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        border: 'none',
                                        cursor: 'pointer'
                                    }}
                                >
                                    {wishlistLoading[pid] ? (
                                        <div className="spinner-border spinner-border-sm text-light" role="status" aria-hidden="true"></div>
                                    ) : (
                                        <FaHeart
                                            size={16}
                                            color={wishlist[pid] ? 'red' : 'white'}
                                            style={{ filter: 'drop-shadow(0 0 4px black)' }}
                                        />
                                    )}
                                </button>


                                <div
                                    className="product-overlay"
                                    style={{
                                        pointerEvents: 'none',
                                        zIndex: 1000,
                                    }}
                                >

                                    <button
                                        className="btn btn-sm btn-outline-light mb-2"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            e.preventDefault();
                                            navigate(`/product/${pid}`);
                                        }}
                                        style={{ pointerEvents: 'auto' }}
                                    >
                                        <FaCartPlus /> View Details
                                    </button>

                                    <button
                                        className="btn btn-sm btn-warning text-white"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            e.preventDefault();
                                            handleBuyNow(product);
                                        }}
                                        style={{ pointerEvents: 'auto' }}
                                    >
                                        <FaBolt /> Buy Now
                                    </button>
                                </div>
                            </div>

                            <div className="p-2">
                                <div className="fw-semibold text-truncate" title={product.name ?? ""}>
                                    {product.name ?? 'Untitled'}
                                </div>
                                <div className="text-muted">₹{product.price ?? '—'}</div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

export default HorizontalProductSlider;