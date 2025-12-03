import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
    getProductById,
    getProductByCategories,
    getAllProducts,
    addToWishlist,
    addToCart
} from '../../Services/RestAPI.js';
import 'bootstrap/dist/css/bootstrap.min.css';
import HorizontalProductSlider from '../HorizontalProductSlider.jsx'; // adjust path if needed

function ProductDetails() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);

    const [related, setRelated] = useState([]); // same-category products
    const [relatedLoading, setRelatedLoading] = useState(false);

    const token = localStorage.getItem('accessToken');

    useEffect(() => {
        let mounted = true;
        setLoading(true);

        getProductById(id)
            .then(response => {
                if (!mounted) return;
                setProduct(response.data);
                setLoading(false);
            })
            .catch(error => {
                console.error('Error fetching product:', error);
                if (mounted) {
                    setProduct(null);
                    setLoading(false);
                }
            });

        return () => { mounted = false; };
    }, [id]);


    useEffect(() => {
        let mounted = true;

        const normalize = (s) => (s || '').toString().trim().toLowerCase();

        const loadRelated = async () => {
            if (!product || !product.category) {
                if (mounted) setRelated([]);
                return;
            }

            setRelatedLoading(true);


            try {

                const encodedCat = encodeURIComponent(product.category);

                const res = await getProductByCategories(encodedCat);

                const items = Array.isArray(res?.data) ? res.data : [];

                if (items.length > 0) {
                    const currentPid = product.pid;
                    const filtered = items.filter(p => (p.pid ?? null) !== currentPid);
                    if (mounted) setRelated(filtered);
                    setRelatedLoading(false);
                    return;
                } else {
                    console.warn('Category endpoint returned empty array; falling back to client filter.');
                }
            } catch (err) {
                console.warn('getProductByCategories failed; falling back to client filter:', err?.message || err);
            }


            try {
                const rAll = await getAllProducts();
                const all = Array.isArray(rAll?.data) ? rAll.data : [];
                const target = normalize(product.category);

                let items = all.filter(p => normalize(p.category) === target);


                const currentPid = product.pid;
                items = items.filter(p => (p.pid ?? p.id ?? p._id ?? null) !== currentPid);

                if (mounted) setRelated(items);
            } catch (err2) {
                console.error('Fallback getAllProducts failed:', err2);
                if (mounted) setRelated([]);
            } finally {
                if (mounted) setRelatedLoading(false);
            }
        };

        loadRelated();

        return () => { mounted = false; };
    }, [product]);

    const requireLogin = () => {
        if (!token) {
            sessionStorage.setItem('redirectAfterLogin', window.location.pathname);
            alert('Please login to continue');
            navigate('/login');
            return false;
        }
        return true;
    };

    const handleWishlist = () => {
        if (!requireLogin()) return;
        addToWishlist(product.pid)
            .then(() => alert('Added to wishlist'))
            .catch(err => {
                console.error('Error adding to wishlist:', err);
                alert('Failed to add to wishlist');
            });
    };

    const handleCart = () => {
        if (!requireLogin()) return;
        addToCart(product.pid, 1)
            .then(() => alert('Added to cart'))
            .catch(err => {
                console.error('Error adding to cart:', err);
                alert('Failed to add to cart');
            });
    };

    const handleBuyNow = () => {
        if (!requireLogin()) return;
        navigate('/orders', { state: { products: [{ ...product, quantity: 1 }] } });
    };

    if (loading) return <div className="text-center mt-5">Loading...</div>;
    if (!product) return <div className="text-center mt-5 text-danger">Product not found</div>;


    const displayName = product.name ?? 'Untitled';
    const displayPrice = product.price ?? 0;
    const displayImage = product.imageUrl ?? '/placeholder.jpg';
    const displayDesc = product.description ?? '';

    return (
        <div className="container mt-4">
            <div className="row">
                <div className="col-md-6">
                    <img
                        src={displayImage}
                        alt={displayName}
                        className="img-fluid"
                        style={{ maxHeight: '400px', objectFit: 'cover' }}
                        onError={(e) => { e.target.onerror = null; e.target.src = '/placeholder.jpg'; }}
                    />
                </div>

                <div className="col-md-6">
                    <h2>{displayName}</h2>
                    <p><strong>Price:</strong> ₹{displayPrice}</p>
                    <p><strong>Brand:</strong> {product.brand}</p>
                    <p><strong>Category:</strong> {product.category}</p>
                    <p><strong>Description:</strong> {displayDesc}</p>
                    <p>
                        <strong>Availability:</strong>{' '}
                        <span className={product.availability ? 'text-success' : 'text-danger'}>
              {product.availability ? 'In Stock' : 'Out of Stock'}
            </span>
                    </p>

                    <div className="d-flex gap-3 mt-4">
                        <button className="btn btn-outline-danger" onClick={handleWishlist}>
                            <i className="bi bi-heart"></i> Wishlist
                        </button>
                        <button className="btn btn-outline-primary" onClick={handleCart}>
                            <i className="bi bi-cart"></i> Add to Cart
                        </button>
                        <button className="btn btn-warning text-white" onClick={handleBuyNow}>
                            <i className="bi bi-lightning-fill"></i> Buy Now
                        </button>
                    </div>

                    <div className="mt-4">
                        <button className="btn btn-secondary" onClick={() => navigate('/')}>← Back to Home</button>
                    </div>
                </div>
            </div>

            <div className="mt-5">
                <h5 className="mb-3">More in {product.category}</h5>

                {relatedLoading ? (
                    <div className="text-muted">Loading related products…</div>
                ) : related.length === 0 ? (
                    <div className="text-muted">No other products in this category.</div>
                ) : (
                    <HorizontalProductSlider
                        id={`related-${product.category}`}
                        title={`More in ${product.category}`}
                        products={related}
                    />
                )}
            </div>
        </div>
    );
}

export default ProductDetails;