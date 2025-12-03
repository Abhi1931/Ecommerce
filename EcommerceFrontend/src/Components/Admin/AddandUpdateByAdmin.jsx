import 'bootstrap/dist/css/bootstrap.min.css';
import {
    updateUserbyID,
    getUserById,
    addUser,
    getSingleSeller,
    updateSellerById,
    createSeler
} from "../../Services/RestAPI.js";
import { useEffect, useState } from "react";
import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

function AddandUpdateByAdmin({ type = "CUSTOMER" }) {
    const [formData, setFormData] = useState({
        fullname: '',
        email: '',
        username: '',
        password: '',
        role: '',
        gender: '',
        company: '',
        age: '',
        number: ''
    });

    const { id } = useParams();
    const navigate = useNavigate();


    const isSellerMode = type === "SELLER";
    const isSellerRole = (formData.role || '').toUpperCase() === 'SELLER';
    const showSellerFields = isSellerMode || isSellerRole;

    useEffect(() => {
        const token = localStorage.getItem('accessToken');
        if (!token) {
            navigate('/login');
            return;
        }

        try {
            jwtDecode(token);
        } catch (err) {
            console.error('Invalid token or decoding error:', err);
            navigate('/login');
            return;
        }

        if (id && Number(id)) {

            const loader =
                type === "CUSTOMER"
                    ? getUserById(Number(id))
                    : getSingleSeller(Number(id));

            loader
                .then((res) => {
                    const data = res.data;

                    if (type === "CUSTOMER") {
                        setFormData({
                            id: data.id,
                            fullname: data.fullname || '',
                            email: data.email || '',
                            username: data.username || '',
                            password: '',
                            role: (data.role || 'CUSTOMER').toUpperCase(),
                            gender: data.gender || '',
                            company: data.company || '',
                            age: data.age || '',
                            number: data.number || ''
                        });
                    } else {

                        setFormData({
                            sid: data.sid,
                            fullname: data.name || '',
                            email: data.email || '',
                            username: data.username || '',
                            password: '',

                            role: 'SELLER',
                            gender: data.gender || '',
                            company: data.company || '',
                            age: data.age || '',
                            number: data.number || ''
                        });
                    }
                })
                .catch((err) => {
                    console.error('Error loading data:', err);
                });
        }
    }, [id, type, navigate]);

    const handleChange = (e) => {
        setFormData((prev) => ({
            ...prev,
            [e.target.name]: e.target.value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (id && Number(id)) {

                const updatedData = { ...formData };

                if (!formData.password || formData.password.trim() === '') {
                    delete updatedData.password;  // don't send empty password
                }

                if (type === "CUSTOMER") {

                    await updateUserbyID(Number(id), updatedData);
                    alert('User updated successfully!');
                } else {

                    await updateSellerById(Number(id), updatedData);
                    alert('Seller updated successfully!');
                }
            } else {

                if (type === "CUSTOMER") {
                    await addUser(formData);
                    alert('User saved successfully!');
                } else {
                    const sellerData = { ...formData, role: 'SELLER' };
                    await createSeler(sellerData);
                    alert('Seller saved successfully!');
                }
            }


            if (type === "CUSTOMER") {
                navigate('/admin/userdata');
            } else {
                navigate('/admin/sellerdata');
            }
        } catch (err) {
            console.error('Failed to save:', err);
            alert('Failed to save!');
        }
    };

    return (
        <div className="card text-center mt-5 container">
            <div className="card-header">
                {type === "CUSTOMER" ? "Add / Update User" : "Add / Update Seller"}
            </div>
            <div className="card-body">
                <form onSubmit={handleSubmit}>
                    <div className="mb-3">
                        <label htmlFor="fullname" className="form-label">Full Name</label>
                        <input
                            type="text"
                            className="form-control"
                            id="fullname"
                            name="fullname"
                            value={formData.fullname || ''}
                            onChange={handleChange}
                            placeholder="full name"
                        />
                    </div>

                    <div className="mb-3">
                        <label htmlFor="email" className="form-label">Email</label>
                        <input
                            type="email"
                            className="form-control"
                            id="email"
                            name="email"
                            value={formData.email || ''}
                            onChange={handleChange}
                            placeholder="email"
                        />
                    </div>

                    <div className="mb-3">
                        <label htmlFor="username" className="form-label">Username</label>
                        <input
                            type="text"
                            className="form-control"
                            id="username"
                            name="username"
                            value={formData.username || ''}
                            onChange={handleChange}
                            placeholder="username"
                        />
                    </div>

                    {showSellerFields && (
                        <>
                            <div className="mb-3">
                                <label htmlFor="gender" className="form-label">Gender</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    id="gender"
                                    name="gender"
                                    value={formData.gender || ''}
                                    onChange={handleChange}
                                    placeholder="gender"
                                />
                            </div>

                            <div className="mb-3">
                                <label htmlFor="company" className="form-label">Company</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    id="company"
                                    name="company"
                                    value={formData.company || ''}
                                    onChange={handleChange}
                                    placeholder="company"
                                />
                            </div>

                            <div className="mb-3">
                                <label htmlFor="age" className="form-label">Age</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    id="age"
                                    name="age"
                                    value={formData.age || ''}
                                    onChange={handleChange}
                                    placeholder="age"
                                />
                            </div>

                            <div className="mb-3">
                                <label htmlFor="number" className="form-label">Number</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    id="number"
                                    name="number"
                                    value={formData.number || ''}
                                    onChange={handleChange}
                                    placeholder="number"
                                />
                            </div>
                        </>
                    )}

                    <div className="mb-3">
                        <label htmlFor="password" className="form-label">Password</label>
                        <input
                            type="password"
                            className="form-control"
                            id="password"
                            name="password"
                            value={formData.password || ''}
                            onChange={handleChange}
                            placeholder="password"
                        />
                    </div>


                    {type === "CUSTOMER" && (
                        <div className="mb-3">
                            <label htmlFor="role" className="form-label">Role</label>
                            <select
                                className="form-select"
                                id="role"
                                name="role"
                                value={formData.role || 'CUSTOMER'}
                                onChange={handleChange}
                                required
                            >
                                <option value="CUSTOMER">CUSTOMER</option>
                                <option value="ADMIN">ADMIN</option>
                                <option value="SELLER">SELLER</option>
                            </select>
                        </div>
                    )}

                    <button type="submit" className="btn btn-primary">
                        {id ? 'Update' : 'Submit'}
                    </button>

                    <button
                        type="button"
                        className="btn btn-secondary ms-2"
                        onClick={() =>
                            navigate(type === "CUSTOMER" ? '/admin/Userdata' : '/admin/Sellerdata')
                        }
                    >
                        Back
                    </button>
                </form>
            </div>
            <div className="card-footer text-body-secondary">
                2 days ago
            </div>
        </div>
    );
}

export default AddandUpdateByAdmin;
