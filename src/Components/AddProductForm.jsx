import React, { useState } from "react";
import { Form, Button, Spinner } from "react-bootstrap";
import { addProduct } from "/src/Services/RestAPI.js";

function AddProductForm({ onClose }) {
    const [formData, setFormData] = useState({
        name: "",
        description: "",
        price: "",
        imageUrl: "",
        category: "",
        availability: "",
        brand: "",
        quantity: ""
    });

    const [submitting, setSubmitting] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;


        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);

        try {

            const payload = {
                name: formData.name,
                description: formData.description,
                price: formData.price === "" ? null : Number(formData.price),
                imageUrl: formData.imageUrl || null,
                category: formData.category || null,
                brand: formData.brand || null,
                availability:
                    formData.availability === "true" ? true :
                        formData.availability === "false" ? false : null,

                quantity: formData.quantity === "" ? null : parseInt(formData.quantity, 10)
            };
            const response = await addProduct(payload);
            if (onClose) onClose();
        } catch (error) {
            console.error("Error adding product", error);
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
                <Form.Label>Name</Form.Label>
                <Form.Control
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                />
            </Form.Group>

            <Form.Group className="mb-3">
                <Form.Label>Description</Form.Label>
                <Form.Control
                    as="textarea"
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    required
                />
            </Form.Group>

            <Form.Group className="mb-3">
                <Form.Label>Price</Form.Label>
                <Form.Control
                    type="number"
                    name="price"
                    value={formData.price}
                    onChange={handleChange}
                    required
                    min="0"
                    step="0.01"
                />
            </Form.Group>

            <Form.Group className="mb-3">
                <Form.Label>Quantity</Form.Label>
                <Form.Control
                    type="number"
                    name="quantity"
                    value={formData.quantity}
                    onChange={handleChange}
                    min="0"
                />
            </Form.Group>

            <Form.Group className="mb-3">
                <Form.Label>Image URL</Form.Label>
                <Form.Control
                    type="text"
                    name="imageUrl"
                    value={formData.imageUrl}
                    onChange={handleChange}
                />
            </Form.Group>

            <Form.Group className="mb-3">
                <Form.Label>Category</Form.Label>
                <Form.Control
                    type="text"
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                />
            </Form.Group>

            <Form.Group className="mb-3">
                <Form.Label>Availability</Form.Label>
                <div>
                    <Form.Check
                        type="radio"
                        label="Available"
                        name="availability"
                        value="true"
                        checked={formData.availability === "true"}
                        onChange={handleChange}
                    />
                    <Form.Check
                        type="radio"
                        label="Not available"
                        name="availability"
                        value="false"
                        checked={formData.availability === "false"}
                        onChange={handleChange}
                    />
                </div>
            </Form.Group>

            <Form.Group className="mb-3">
                <Form.Label>Brand</Form.Label>
                <Form.Control
                    type="text"
                    name="brand"
                    value={formData.brand}
                    onChange={handleChange}
                />
            </Form.Group>

            <Button variant="primary" type="submit" disabled={submitting}>
                {submitting ? (
                    <>
                        <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" />{" "}
                        Submitting...
                    </>
                ) : (
                    "Submit"
                )}
            </Button>
        </Form>
    );
}

export default AddProductForm;