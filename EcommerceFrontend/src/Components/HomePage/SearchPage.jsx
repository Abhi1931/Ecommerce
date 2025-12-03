import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { searchProducts, addToCart, handleApiError } from '/src/Services/RestAPI.js';
import './SearchPage.css';
import 'bootstrap/dist/css/bootstrap.min.css';

function useQuery() {
    return new URLSearchParams(useLocation().search);
}

export default function SearchPage() {
    const query = useQuery();
    const navigate = useNavigate();
    const qParam = query.get('kword') ?? '';
    const [kword, setKword] = useState(qParam);
    const [loading, setLoading] = useState(false);
    const [products, setProducts] = useState([]);
    const [error, setError] = useState('');

    useEffect(() => {
        if (!qParam || qParam.trim() === '') {
            setProducts([]);
            return;
        }
        setKword(qParam);
        fetchResults(qParam);

    }, [qParam]);

    const fetchResults = async (kw) => {
        setLoading(true);
        setError('');
        try {
            const res = await searchProducts(kw);
            setProducts(Array.isArray(res.data) ? res.data : []);
        } catch (err) {
            console.error('Search failed', err);
            setError(handleApiError(err) || 'Search failed');
        } finally {
            setLoading(false);
        }
    };

    const onSubmit = (e) => {
        e.preventDefault();
        if (!kword.trim()) return;
        navigate(`/search?kword=${encodeURIComponent(kword.trim())}`);
    };

    const onView = (pid) => navigate(`/product/${pid}`);

    const onAddToCart = async (pid) => {
        try {
            await addToCart(pid, 1);
            alert('Added to cart');
        } catch (err) {
            console.error(err);
            alert(handleApiError(err));
        }
    };

    const onBuyNow = (product) => {
        navigate('/ordersplacement', { state: { products: [{ ...product, quantity: 1 }] }});
    };

    return (
        <div className="container mt-4">


            {loading && <div className="text-center my-5">Loading results…</div>}
            {error && <div className="alert alert-danger">{error}</div>}
            {!loading && !error && (
                <>
                    <h5 className="mb-3">Results for “{qParam}” — {products.length} found</h5>


                    <div className="row g-3">
                        {products.map((p) => {
                            const pid = p.pid ?? p.id ?? p._id;
                            const title = p.name ?? p.productName ?? 'Untitled';
                            const price = typeof p.price === 'number' ? p.price : Number(p.price || 0);

                            const imageSrc = p.imageUrl || '/placeholder-image.jpg';

                            return (
                                <div className="col-12" key={pid}>
                                    <div className="card big-search-card h-100 shadow-sm">
                                        <div className="row g-0 align-items-stretch">
                                            {/* LEFT: Image (bigger) */}
                                            <div className="col-12 col-md-4 d-flex align-items-center justify-content-center p-3">
                                                <img
                                                    src={imageSrc}
                                                    alt={title}
                                                    className="img-fluid product-detail-image"
                                                    onError={(e) => { e.target.onerror = null; e.target.src = '/placeholder-image.jpg'; }}
                                                />
                                            </div>

                                            <div className="col-12 col-md-8">
                                                <div className="card-body d-flex flex-column h-100">
                                                    <div>
                                                        <h4 className="card-title mb-1">{title}</h4>
                                                        <p className="card-text text-muted mb-1">{p.brand} • {p.category}</p>
                                                        <p className="mb-2"><strong>₹{Number(price).toLocaleString('en-IN')}</strong></p>
                                                        <p className="text-muted">{p.description}</p>
                                                    </div>

                                                    <div className="mt-auto d-flex flex-wrap gap-2">
                                                        <button type="button" className="btn btn-outline-primary" onClick={() => onView(pid)}>View Details</button>

                                                        <button type="button" className="btn btn-success" onClick={() => onAddToCart(pid)}>Add to Cart</button>

                                                        <button type="button" className="btn btn-warning text-white" onClick={() => onBuyNow(p)}>Buy Now</button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </>
            )}
        </div>
    );
}