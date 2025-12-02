import React, {useEffect, useMemo, useState} from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { deleteUserById, getAllUsers } from "/src/Services/RestAPI.js";
import { useNavigate } from 'react-router-dom';
import AddandUpdate from "../AddandUpdate.jsx";

function Userdata() {
    const [users, setUsers] = useState([]);
    const [showActions, setShowActions] = useState(false);
    const [selectedId, setSelectedId] = useState(null);
    const navigate = useNavigate();

    const[searchTerm, setSearchTerm] = useState("");

    const filteredUsers = useMemo(() => {
        if (!searchTerm.trim()) return users;
        const q = searchTerm.toLowerCase();
        return users.filter(p =>
            (p.fullname && p.fullname.toLowerCase().includes(q)) ||
            (p.email && p.email.toLowerCase().includes(q)) ||
            (p.username && p.username.toLowerCase().includes(q))
        );
    }, [users, searchTerm]);

    const loadUsers = () => {
        getAllUsers()
            .then((response) => {
                const data = Array.isArray(response.data) ? response.data : response.data.users;
                setUsers(data || []);
            })
            .catch((error) => {
                console.error("Error fetching users:", error);
                setUsers([]);
            });
    };

    useEffect(() => {
        loadUsers();
    }, []);

    const handleDelete = () => {
        if (!selectedId) return alert('Please select a user to delete');
        if (window.confirm("Are you sure you want to delete this user?")) {
            deleteUserById(selectedId).then(() => loadUsers());
        }
    };

    const handleEdit = () => {
        if (!selectedId) return alert('Please select a user to edit');
        navigate(`/admin/edit/${selectedId}`);
    };

    const handleAdd = () => {
        navigate('/admin/edit');
    };

    return (
        <div className="container mt-5">
            <h2 className="mb-4 text-center">User Table</h2>



            <div className="d-flex justify-content-between mb-3">
                <button className="btn btn-secondary" onClick={() => navigate('/adminpage')}>Back to Admin</button>

                {/* Local search (filters table) */}
                <div className="d-flex align-items-center gap-2">
                    <input
                        className="form-control"
                        style={{ minWidth: 260 }}
                        type="text"
                        placeholder="Search user name, email, or username"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    {searchTerm && (
                        <button className="btn btn-outline-secondary" onClick={() => setSearchTerm("")}>
                            Clear
                        </button>
                    )}
                </div>
                <button className="btn btn-primary" onClick={() => setShowActions(!showActions)}>
                    {showActions ? "Hide Actions" : "Edit Data"}
                </button>
            </div>

            {showActions && (
                <div className="mb-3 d-flex gap-3">
                    <button className="btn btn-danger" onClick={handleDelete}>Delete</button>
                    <button className="btn btn-secondary" onClick={handleEdit}>Edit</button>
                    <button className="btn btn-success" onClick={handleAdd}>Add User</button>
                </div>
            )}

            <table className="table table-bordered table-hover">
                <thead className="table-dark">
                <tr>
                    {showActions && <th>Select</th>}
                    <th>ID</th>
                    <th>Full Name</th>
                    <th>Email</th>
                    <th>Username</th>
                    <th>Role</th>
                </tr>
                </thead>
                <tbody>

                {
                    filteredUsers.length === 0 ? (
                        <tr>
                            <td colSpan={showActions ? 6:9} className="text-center text-muted">
                                No Users Match
                            </td>
                        </tr>
                    ) :(
                filteredUsers.map((user) => (
                    <tr key={user.id} className={selectedId === user.id ? 'table-active' : ''}>
                        {showActions && (
                            <td>
                                <input
                                    type="radio"
                                    name="selectedUser"
                                    onChange={() => setSelectedId(user.id)}
                                    checked={selectedId === user.id}
                                />
                            </td>
                        )}
                        <td>{user.id}</td>
                        <td>{user.fullname}</td>
                        <td>{user.email}</td>
                        <td>{user.username}</td>
                        <td>{user.role}</td>
                    </tr>
                    ))
                )}
                </tbody>
            </table>
        </div>
    );
}

export default Userdata;
