import React, { useEffect, useState } from "react";
import { addProduct, updateProductById} from '../../Services/RestAPI.js';
import { Modal, Form, Button, Alert, Spinner } from "react-bootstrap";



export default function ProductModal({ show, product, onClose, onSaved }) {
    const isEdit = !!product;
    const empty = {

        pid: undefined,
        name: "",
        brand: "",
        category: "",
        price: "",
        quantity: "",
        availability: true,
        description: "",
        imageUrl: "",
    };

    const [formData, setFormData] = useState(empty);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState("");


    useEffect(() => {
        if (isEdit) {

            setFormData({
                pid: product?.pid ?? product?.id ?? undefined,
                name: product?.name ?? "",
                brand: product?.brand ?? "",
                category: product?.category ?? "",
                price: product?.price ?? "",
                quantity: product?.quantity ?? product?.stock ?? 0,
                availability:
                    typeof product?.availability === "boolean"
                        ? product.availability
                        : product?.availability === "Yes" || product?.availability === "true" || product?.availability === 1,
                description: product?.description ?? "",
                imageUrl: product?.imageUrl ?? product?.image ?? "",
            });
        } else {
            setFormData(empty);
        }
        setError("");
    }, [product, isEdit]);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        let v = value;
        if (type === "checkbox") v = checked;
        setFormData((s) => ({ ...s, [name]: v }));
    };

    const validate = () => {
        if (!formData.name.trim()) return "Name is required.";
        const priceNum = Number(formData.price);
        if (Number.isNaN(priceNum) || priceNum < 0) return "Price must be a non-negative number.";
        const qtyNum = Number(formData.quantity);
        if (!Number.isInteger(qtyNum) || qtyNum < 0) return "Quantity must be a non-negative integer.";
        return "";
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        const v = validate();
        if (v) {
            setError(v);
            return;
        }

        const payload = {

            name: formData.name,
            brand: formData.brand,
            category: formData.category,
            price: Number(formData.price),
            quantity: Number(formData.quantity),
            availability: !!formData.availability,
            description: formData.description,
            imageUrl: formData.imageUrl,
        };

        setSaving(true);
        try {
            if (isEdit) {
                const id = formData.pid;

                await updateProductById(id, payload);
            } else {
                await addProduct(payload);
            }
            if (typeof onSaved === "function") onSaved();
            onClose();
        } catch (err) {
            console.error("Product save failed", err);
            const msg =
                err?.response?.data?.message ||
                err?.message ||
                "Failed to save product. Check console for details.";
            setError(msg);
        } finally {
            setSaving(false);
        }
    };

    return (
        <Modal show={!!show} onHide={() => !saving && onClose()} backdrop={saving ? "static" : true} centered>
            <Modal.Header closeButton={!saving}>
                <Modal.Title>{isEdit ? "Edit Product" : "Add Product"}</Modal.Title>
            </Modal.Header>

            <Form onSubmit={handleSubmit}>
                <Modal.Body>
                    {error && <Alert variant="danger">{error}</Alert>}

                    {isEdit && (
                        <Form.Group className="mb-3">
                            <Form.Label>Product ID</Form.Label>
                            <Form.Control type="text" value={formData.pid ?? ""} readOnly />
                        </Form.Group>
                    )}

                    <Form.Group className="mb-3">
                        <Form.Label>Name *</Form.Label>
                        <Form.Control name="name" value={formData.name} onChange={handleChange} required />
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label>Brand</Form.Label>
                        <Form.Control name="brand" value={formData.brand} onChange={handleChange} />
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label>Category</Form.Label>
                        <Form.Control name="category" value={formData.category} onChange={handleChange} />
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label>Availability</Form.Label>
                        <Form.Control name="Availability" value={formData.availability} onChange={handleChange} />
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label>Price *</Form.Label>
                        <Form.Control
                            name="price"
                            type="number"
                            min="0"
                            step="0.01"
                            value={formData.price}
                            onChange={handleChange}
                            required
                        />
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label>Quantity *</Form.Label>
                        <Form.Control
                            name="quantity"
                            type="number"
                            min="0"
                            step="1"
                            value={formData.quantity}
                            onChange={handleChange}
                            required
                        />
                    </Form.Group>

                    <Form.Group className="mb-3 d-flex align-items-center gap-2">
                        <Form.Check
                            id="availabilityCheck"
                            name="availability"
                            type="checkbox"
                            checked={!!formData.availability}
                            onChange={handleChange}
                            label="Available"
                        />
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label>Description</Form.Label>
                        <Form.Control as="textarea" name="description" value={formData.description} onChange={handleChange} />
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label>Image URL</Form.Label>
                        <Form.Control name="imageUrl" value={formData.imageUrl} onChange={handleChange} />
                    </Form.Group>
                </Modal.Body>

                <Modal.Footer>
                    <Button variant="secondary" onClick={() => !saving && onClose()} disabled={saving}>
                        Cancel
                    </Button>

                    <Button variant="success" type="submit" disabled={saving}>
                        {saving ? (
                            <>
                                <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" />{" "}
                                Saving...
                            </>
                        ) : isEdit ? (
                            "Update"
                        ) : (
                            "Add Product"
                        )}
                    </Button>
                </Modal.Footer>
            </Form>
        </Modal>
    );
}
