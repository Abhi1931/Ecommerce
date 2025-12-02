import 'bootstrap/dist/css/bootstrap.min.css';
import { getUserById, updateUserById } from '../Services/RestAPI.js';
import { useEffect, useState } from 'react';
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';

function AddandUpdate() {
    const [formData, setFormData] = useState({
        fullname: '',
        email: '',
        username: '',
        password: '',
        role: '',
    });

    const [isAdmin, setIsAdmin] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem('accessToken');

        if (!token) {
            sessionStorage.setItem('redirectAfterLogin', window.location.pathname);
            alert('Please login to continue');
            navigate('/login');
            return;
        }


        let decoded = null;
        try {
            decoded = jwtDecode(token);
        } catch (err) {
            console.error('Invalid token or decoding error:', err);
            navigate('/login');
            return;
        }

        if (decoded.role && decoded.role.includes("ROLE_ADMIN")) {
            setIsAdmin(true);
        }


        const userId = decoded?.id;
        if (!userId) {
            console.error('User ID not found in token.');
            navigate('/login');
            return;
        }

        getUserById(userId)
            .then((res) => {
                const userData = res.data;

                setFormData({
                    fullname: userData.fullname || '',
                    email: userData.email || '',
                    username: userData.username || '',
                    password: '', // Do not preload password
                    role: userData.role || 'user',
                });
            })
            .catch((err) => {
                console.error('Error loading user:', err);
            });
    }, [navigate]);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const token = localStorage.getItem('accessToken'); // ✅ fixed to be consistent
        if (!token) {
            alert('Session expired. Please log in again.');
            navigate('/login');
            return;
        }

        let decoded;

        try {
            decoded = jwtDecode(token);
        } catch (err) {
            console.error('Token decoding failed:', err);
            navigate('/login');
            return;
        }

        const userId = decoded?.id;
        if (!userId) {
            alert('Invalid user session. Please login again.');
            navigate('/login');
            return;
        }

        try {
            const updatedData = { ...formData, id: userId };
            if (!formData.password || formData.password.trim() === '') {
                delete updatedData.password;
            }
            const res = await updateUserById(userId, updatedData);
            alert(res.data);           // <- will show "Updated Successfully"
            if (res.data === "Updated Successfully") {
                navigate('/account');
            }
        } catch (err) {
            console.error('Failed to update user:', err);
            alert('Failed to update user!');
        }
    };


    return (
        <div className="card text-center mt-5 container">
            <div className="card-header">Update Your Details</div>
            <div className="card-body">
                <form onSubmit={handleSubmit}>
                    <div className="mb-3">
                        <label htmlFor="fullname" className="form-label">Full Name</label>
                        <input type="text" className="form-control" id="fullname" name="fullname" value={formData.fullname || ''} onChange={handleChange} placeholder="Full Name" />
                    </div>

                    <div className="mb-3">
                        <label htmlFor="email" className="form-label">Email</label>
                        <input type="email" className="form-control" id="email" name="email" value={formData.email || ''} onChange={handleChange} placeholder="Email" />
                    </div>

                    <div className="mb-3">
                        <label htmlFor="username" className="form-label">Username</label>
                        <input type="text" className="form-control" id="username" name="username" value={formData.username || ''} onChange={handleChange} placeholder="Username" />
                    </div>

                    <div className="mb-3">
                        <label htmlFor="password" className="form-label">Password</label>
                        <input type="password" className="form-control" id="password" name="password" value={formData.password || ''} onChange={handleChange} placeholder="Password" />
                    </div>

                    {isAdmin && (
                    <div className="mb-3">
                        <label htmlFor="role" className="form-label">Role</label>
                        <select className="form-select" value={formData.role || 'user'} onChange={handleChange} id="role" name="role" required>
                            <option value="CUSTOMER">CUSTOMER</option>
                            <option value="ADMIN">ADMIN</option>
                            <option value="SELLER">SELLER</option>
                        </select>
                    </div> )}

                    <button type="submit" className="btn btn-primary">Update</button>
                    <button type="button" className="btn btn-secondary ms-2" onClick={() => navigate('/account')}>Back to Account</button>
                </form>
            </div>
            <div className="card-footer text-body-secondary">Updated recently</div>
        </div>
    );
}

export default AddandUpdate;
