
import React, { useCallback, useEffect, useMemo, useState } from "react";
import 'bootstrap/dist/css/bootstrap.min.css';
import { useLocation, useNavigate } from 'react-router-dom';
import {  getAllProducts, getAdminProducts, getAllSellerProducts , deleteProductById} from "../../Services/RestAPI.js";
import ProductModal from '../ProductDetails/EditProductModal.jsx';

function ProductsData() {
    const [products, setProducts] = useState([]);
    const [showActions, setShowActions] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState(null);


    const [modalShow, setModalShow] = useState(false);
    const [modalProduct, setModalProduct] = useState(null);

    const navigate = useNavigate();
    const location = useLocation();
    const type = location.state?.type || "ALL";


    const [searchTerm, setSearchTerm] = useState(location.state?.searchQuery || "");


    useEffect(() => {
        setSearchTerm(location.state?.searchQuery || "");
    }, [location.state?.searchQuery]);

    const loadProducts = useCallback(async () => {
        try {
            const apiCall =
                type === "ADMIN" ? getAdminProducts :
                    type === "Seller" ? getAllSellerProducts :
                        getAllProducts;

            const response = await apiCall();
            const data = Array.isArray(response.data) ? response.data : response.data?.products;
            setProducts(data || []);
        } catch (error) {
            console.error("error fetching products:", error);
            setProducts([]);
        }
    }, [type]);

    useEffect(() => {
        loadProducts();
    }, [loadProducts]);


    const filteredProducts = useMemo(() => {
        if (!searchTerm.trim()) return products;
        const q = searchTerm.toLowerCase();
        return products.filter(p =>
            (p.name && p.name.toLowerCase().includes(q)) ||
            (p.brand && p.brand.toLowerCase().includes(q)) ||
            (p.category && p.category.toLowerCase().includes(q))
        );
    }, [products, searchTerm]);

    const handleDelete = async () => {
        if (!selectedProduct) return alert('Please select a product to delete');
        if (window.confirm("Are you sure you want to delete this product?")) {
            try {
                await deleteProductById(selectedProduct);
                await loadProducts();
                setSelectedProduct(null);
            } catch (err) {
                console.error("error deleting product:", err);
                alert("Failed to delete product. Check console for details.");
            }
        }
    };


    const handleEdit = () => {
        if (!selectedProduct) return alert('Please select a product to edit');
        const prod = products.find(p => p.pid === selectedProduct);
        if (!prod) {
            alert("Selected product not found in current list.");
            return;
        }
        setModalProduct(prod);
        setModalShow(true);
    };


    const handleAdd = () => {
        setModalProduct(null);
        setModalShow(true);
    };

    const closeModal = () => {
        setModalShow(false);
        setModalProduct(null);
    };

    const onSaved = async () => {

        await loadProducts();
        setSelectedProduct(null);
    };

    return (
        <div className="container mt-5">
            <h2 className="mb-4 text-center">
                {type === "ADMIN" ? "Admin Products" :
                    type === "Seller" ? "Seller Products" : "All Products"}
            </h2>

            <div className="d-flex justify-content-between align-items-center mb-3 gap-2">
                <button className="btn btn-secondary" onClick={() => navigate('/adminpage')}>
                    Back to the page
                </button>


                <div className="d-flex align-items-center gap-2">
                    <input
                        className="form-control"
                        style={{ minWidth: 260 }}
                        type="text"
                        placeholder="Search name, brand, or category"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    {searchTerm && (
                        <button className="btn btn-outline-secondary" onClick={() => setSearchTerm("")}>
                            Clear
                        </button>
                    )}
                </div>

                <button className="btn btn-secondary" onClick={() => setShowActions(!showActions)}>
                    {showActions ? 'Hide Actions' : 'Edit data'}
                </button>
            </div>

            {showActions && (
                <div className="mb-3 d-flex gap-3">
                    <button className="btn btn-danger" onClick={handleDelete}>Delete</button>
                    <button className="btn btn-secondary" onClick={handleEdit}>Edit</button>
                    <button className="btn btn-success" onClick={handleAdd}>Add Product</button>
                </div>
            )}

            <table className="table table-bordered table-hover">
                <thead className="table-light">
                <tr>
                    {showActions && <th>Select</th>}
                    <th>ID</th>
                    <th>Name</th>
                    <th>Brand</th>
                    <th>Category</th>
                    <th>Price</th>
                    <th>Stock</th>
                    <th>Availability</th>
                </tr>
                </thead>
                <tbody>
                {filteredProducts.length === 0 ? (
                    <tr>
                        <td colSpan={showActions ? 8 : 7} className="text-center text-muted">
                            No products match “{searchTerm}”.
                        </td>
                    </tr>
                ) : (
                    filteredProducts.map(product => (
                        <tr
                            key={product.pid}
                            className={selectedProduct === product.pid ? 'table-active' : ''}
                        >
                            {showActions && (
                                <td>
                                    <input
                                        type="radio"
                                        name="selectedProduct"
                                        onChange={() => setSelectedProduct(product.pid)}
                                        checked={selectedProduct === product.pid}
                                    />
                                </td>
                            )}
                            <td>{product.pid}</td>
                            <td>{product.name}</td>
                            <td>{product.brand}</td>
                            <td>{product.category}</td>
                            <td>{product.price}</td>
                            <td>{product.quantity}</td>
                            <td>{product.availability ? "Yes" : "No"}</td>
                        </tr>
                    ))
                )}
                </tbody>
            </table>


            <ProductModal
                show={modalShow}
                product={modalProduct}
                onClose={closeModal}
                onSaved={onSaved}
            />
        </div>
    );
}

export default ProductsData;
