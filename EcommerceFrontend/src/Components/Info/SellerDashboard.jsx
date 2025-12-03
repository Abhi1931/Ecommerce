import React, { useEffect, useState, useMemo } from "react";
import {deleteSellerByID, getSellerProducts, getSingleSeller, getSellerProductStats,} from "/src/Services/RestAPI.js";
import AddProductForm from "../AddProductForm.jsx";
import EditProductModal from "../ProductDetails/EditProductModal.jsx";
import { Button, Modal, Card , Alert} from "react-bootstrap";
import {jwtDecode }from 'jwt-decode';

function SellerDashboard() {
    const [products, setProducts] = useState([]);
    const [showAddForm, setShowAddForm] = useState(false);
    const [editProduct, setEditProduct] = useState(null);

    const [sellerInfo, setSellerInfo] = useState({ name: "", company: "" });

    const [stats, setStats] = useState({
        orderedCount: 0,
        shippedCount: 0,
        deliveredCount: 0,
        totalRevenue: 0,
    });

    const [alert, setAlert] = useState({
        show: false,
        variant: "danger",
        message: ""
    });


    const [searchTerm, setSearchTerm] = useState("");

    const token = localStorage.getItem("accessToken");
    const [sellerId, setSellerId] = useState(null);
    const [productId, setProductId] = useState(null);
    let productid;


    useEffect(() => {
        if (!token) {
            console.warn("No accessToken found in localStorage.");
            return;
        }
        try {

            const decoded = jwtDecode(token);
            // adapt key name if your JWT uses a different claim (e.g. sub, sid, sellerId)
            const sid = decoded?.id ??  null;
            if (!sid) {
                console.warn("seller id not found inside token decoded payload:", decoded);
            }
            setSellerId(sid);
        } catch (err) {
            console.error("Failed to decode token:", err);
        }
    }, [token]);



    const fetchProducts = async (sid) => {
        if (!sid) {
            console.warn("fetchProducts called without seller id.");
            return [];
        }
        try {

            const response = await getSellerProducts(sid);
            const list = response.data || [];
            setProducts(list);
            return list;
        } catch (error) {
            console.error("Error fetching seller products", error);
            return [];
        }
    };

    const fetchSellerInfo = async (sid) => {
        if (!sid) return;
        try {
            const res = await getSingleSeller(sid);
            setSellerInfo({
                name: res.data?.name || res.data?.username || "",
                company: res.data?.company || "",
            });
        } catch (e) {
            console.error("Error fetching seller info", e);
        }
    };

    const fetchStats = async () => {

        try {
            const res = await getSellerProductStats();
            const orders = res.data || [];


            let orderedCount = 0;
            let shippedCount = 0;
            let deliveredCount = 0;
            let totalRevenue = 0;

            orders.forEach((order) => {

                const status = (order.status || "").toString().toUpperCase();
                const quantity = Number(order.quantity ?? 1);
                const price = Number(order.totalPrice ?? order.product?.price ?? 0) || 0;
                productid= order.product.id ?? order.product.pid;

                if (status === "PLACED") orderedCount += quantity;
                if (status === "SHIPPED") shippedCount += quantity;
                if (status === "DELIVERED") {
                    deliveredCount += quantity;

                    const lineRevenue = order.totalPrice != null ? Number(order.totalPrice) : price * quantity;
                    totalRevenue += lineRevenue;
                }
            });
            console.log(productid);
            setStats({
                orderedCount,
                shippedCount,
                deliveredCount,
                totalRevenue,
            });
        } catch (e) {
            console.error("Error fetching seller stats", e);
        }
    };


    useEffect(() => {
        if (!sellerId) return;
        fetchSellerInfo(sellerId);
        fetchProducts(sellerId);
        fetchStats();

    }, [sellerId]);


    const handleDelete = async (productid) => {
        if (!sellerId) {
            console.error("Cannot delete product: sellerId missing");
            return;
        }
        if (productid === undefined || productid === null) {
            console.error("Cannot delete product: product id missing", productid);
            return;
        }


        const prevProducts = [...products];

        try {
            const res = await deleteSellerByID(sellerId, productid);

            const latest = await fetchProducts(sellerId);
            await fetchStats();

            let successMessage = "Product deleted successfully.";
            if (res?.data) {
                if (typeof res.data === "string") successMessage = res.data;
                else if (res.data.message) successMessage = res.data.message;
                else if (res.data.detail) successMessage = res.data.detail;
            }

            setAlert({ show: true, variant: "success", message: successMessage });
            setTimeout(() => setAlert(a => ({ ...a, show: false })), 3500);
            return;
        } catch (error) {

            let latest = [];
            try {
                latest = await fetchProducts(sellerId);
                await fetchStats();
            } catch (refreshErr) {
                console.warn("Failed to refresh after delete error:", refreshErr);
            }

            console.error("Error deleting product", error);
            if (error?.response) {
                console.log("Full server response (for debugging):", error.response);

                const { status, data } = error.response;

                let serverMessage = null;
                if (data) {
                    if (typeof data === "string") serverMessage = data;
                    else if (data.message) serverMessage = data.message;
                    else if (data.detail) serverMessage = data.detail;
                    else if (data.error) serverMessage = data.error;
                    else if (data.reason) serverMessage = (data.message ? data.message + " " : "") + "(" + data.reason + ")";
                    else serverMessage = JSON.stringify(data);
                }

                const stillExists = latest.some(p => (p.pid ?? p.id) === productid);

                if (!stillExists) {

                    setAlert({
                        show: true,
                        variant: "warning",
                        message: serverMessage || `Product removed but server returned status ${status}`
                    });
                } else {

                    setAlert({
                        show: true,
                        variant: status === 409 ? "warning" : "danger",
                        message: serverMessage || `Failed to delete product (status ${status})`
                    });

                }

                setTimeout(() => setAlert(a => ({ ...a, show: false })), 5000);
                return;
            } else {

                setAlert({
                    show: true,
                    variant: "danger",
                    message: error.message || "Network error while deleting the product"
                });
                setTimeout(() => setAlert(a => ({ ...a, show: false })), 5000);
            }
        }
    };




    const filteredProducts = useMemo(() => {
        if (!searchTerm.trim()) return products;
        const term = searchTerm.toLowerCase();
        return products.filter((p) => {
            const name = (p.name || "").toLowerCase();
            const brand = (p.brand || "").toLowerCase();
            const category = (p.category || "").toLowerCase();
            return name.includes(term) || brand.includes(term) || category.includes(term);
        });
    }, [products, searchTerm]);

    return (
        <div className="container mt-4">
            {alert.show && (
                <Alert variant={alert.variant} onClose={() => setAlert(a => ({ ...a, show: false }))} dismissible>
                    {alert.message}
                </Alert>
            )}


            <div className="row g-3 mb-4">
                <div className="col-12 col-md-3">
                    <Card className="h-100">
                        <Card.Body>
                            <Card.Title className="h6 mb-2">Items Ordered</Card.Title>
                            <div className="display-6">{stats.orderedCount}</div>
                        </Card.Body>
                    </Card>
                </div>

                <div className="col-12 col-md-3">
                    <Card className="h-100">
                        <Card.Body>
                            <Card.Title className="h6 mb-2">Items Shipped</Card.Title>
                            <div className="display-6">{stats.shippedCount}</div>
                        </Card.Body>
                    </Card>
                </div>

                <div className="col-12 col-md-3">
                    <Card className="h-100">
                        <Card.Body>
                            <Card.Title className="h6 mb-2">Items Delivered</Card.Title>
                            <div className="display-6">{stats.deliveredCount}</div>
                        </Card.Body>
                    </Card>
                </div>

                <div className="col-12 col-md-3">
                    <Card className="h-100">
                        <Card.Body>
                            <Card.Title className="h6 mb-2">Total Revenue</Card.Title>
                            <div className="display-6">
                                ₹{stats.totalRevenue?.toLocaleString?.("en-IN") ?? stats.totalRevenue}
                            </div>
                            <div className="text-muted small">(Delivered orders only)</div>
                        </Card.Body>
                    </Card>
                </div>
            </div>


            <div className="d-flex justify-content-between align-items-center mb-2">
                <h4 className="mb-0">My Products</h4>
                <Button variant="primary" onClick={() => setShowAddForm(true)}>Add New Product</Button>
            </div>

            <div className="mb-3">
                <input
                    type="text"
                    className="form-control"
                    placeholder="Filter products by name, brand or category..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>

            <div className="table-responsive mt-3">
                <table className="table align-middle table-striped">
                    <thead className="table-light">
                    <tr>
                        <th>Product</th>
                        <th>Brand</th>
                        <th>Category</th>
                        <th className="text-center">Quantity</th>
                        <th className="text-end">Price (₹)</th>
                        <th className="text-center">Actions</th>
                    </tr>
                    </thead>
                    <tbody>
                    {filteredProducts.length === 0 && (
                        <tr>
                            <td colSpan={6} className="text-center py-4 text-muted">No products found.</td>
                        </tr>
                    )}

                    {filteredProducts.map((product) => {
                        const pid = product.pid ?? product.id;
                        return (
                            <tr key={pid}>
                                <td>
                                    <div className="d-flex align-items-center">
                                        {product.imageUrl && (
                                            <img
                                                src={product.imageUrl}
                                                alt={product.name}
                                                style={{ width: 48, height: 48, objectFit: "cover", borderRadius: 6, marginRight: 12 }}
                                            />
                                        )}
                                        <div>
                                            <div className="fw-semibold">{product.name}</div>
                                            {product.description && (
                                                <div className="text-muted small text-truncate" style={{ maxWidth: 220 }}>
                                                    {product.description}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </td>
                                <td>{product.brand}</td>
                                <td>{product.category}</td>
                                <td className="text-center">{product.quantity}</td>
                                <td className="text-end">{Number(product.price).toLocaleString("en-IN")}</td>
                                <td className="text-center">
                                    <Button variant="warning" size="sm" className="me-2" onClick={() => setEditProduct(product)}>Edit</Button>
                                    <Button variant="danger" size="sm" onClick={() => (window.confirm("Delete this product?") && handleDelete(pid))}>Delete</Button>
                                </td>
                            </tr>
                        );
                    })}
                    </tbody>
                </table>
            </div>


            <Modal show={showAddForm} onHide={() => setShowAddForm(false)} centered size="lg">
                <Modal.Header closeButton><Modal.Title>Add Product</Modal.Title></Modal.Header>
                <Modal.Body>
                    <AddProductForm
                        onClose={async () => {
                            setShowAddForm(false);
                            await fetchProducts(sellerId);
                            await fetchStats();
                        }}
                    />
                </Modal.Body>
            </Modal>


            <EditProductModal
                show={!!editProduct}
                product={editProduct}
                onClose={async () => {
                    setEditProduct(null);
                    await fetchProducts(sellerId);
                    await fetchStats();
                }}
            />
        </div>
    );
}

export default SellerDashboard;