
import React, {useEffect, useMemo, useState} from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { deleteUserById, getAllSellers } from "/src/Services/RestAPI.js";
import { useNavigate } from 'react-router-dom';

function Sellerdata() {
    const [sellers, setSellers] = useState([]);
    const [showActions, setShowActions] = useState(false);
    const [selectedId, setSelectedId] = useState(null);
    const navigate = useNavigate();
    const [searchTerm, setSearchTerm] = useState("");

    const loadSellers = () => {
        getAllSellers()
            .then((response) => {
                const data = Array.isArray(response.data) ? response.data : response.data.sellers;
                setSellers(data || []);
            })
            .catch((error) => {
                console.error("Error fetching sellers:", error);
                setSellers([]);
            });
    };

    const filteredSellers = useMemo( () => {
        if (!searchTerm.trim()) return sellers;
        const q = searchTerm.toLowerCase();
        return sellers.filter(p =>
            (p.name && p.name.toLowerCase().includes(q)) ||
            (p.email && p.email.toLowerCase().includes(q)) ||
            (p.username && p.username.toLowerCase().includes(q))
        );
    },[sellers, searchTerm] );
    useEffect(() => {
        loadSellers();
    }, []);

    const handleDelete = () => {
        if (!selectedId) return alert('Please select a seller to delete');
        if (window.confirm("Are you sure you want to delete this seller?")) {
            deleteUserById(selectedId).then(() => loadSellers());
        }
    };

    const handleEdit = () => {
        if (selectedId==null) return alert('Please select a seller to edit');
        navigate(`/admin/sellers/edit/${selectedId}`);
    };

    const handleAdd = () => {
        navigate('/admin/sellers/add');
    };

    return (
        <div className="container mt-5">
            <h2 className="mb-4 text-center">Sellers data</h2>

            <div className="d-flex justify-content-between mb-3">
                <button className="btn btn-secondary" onClick={() => navigate('/adminpage')}>Back to Admin</button>

                <div className="d-flex align-items-center gap-2">
                    <input
                        className="form-control"
                        style={{ minWidth: 260 }}
                        type="text"
                        placeholder="Search seller name, email, or username"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    {searchTerm && (
                        <button className="btn btn-outline-secondary" onClick={() => setSearchTerm("")}> clear </button>
                    )}
                </div>

                <button className="btn btn-warning" onClick={() => setShowActions(!showActions)}>
                    {showActions ? "Hide Actions" : "Edit Sellers"}
                </button>
            </div>

            {showActions && (
                <div className="mb-3 d-flex gap-3">
                    <button className="btn btn-danger" onClick={handleDelete}>Delete</button>
                    <button className="btn btn-secondary" onClick={handleEdit}>Edit</button>
                    <button className="btn btn-success" onClick={handleAdd}>Add Seller</button>
                </div>
            )}

            <table className="table table-bordered table-hover">
                <thead className="table-warning">
                <tr>
                    {showActions && <th>Select</th>}
                    <th>ID</th>
                    <th>Full Name</th>
                    <th>Email</th>
                    <th>Username</th>
                    <th>Gender</th>
                    <th>Company</th>
                    <th>Age</th>
                    <th>Phn.No</th>
                </tr>
                </thead>
                <tbody>
                {
                  filteredSellers.length === 0 ? (
                  <tr>
                     <td colSpan={showActions ? 8 : 7} className="text-center text-muted">
                         No Sellers Match
                     </td>
                  </tr>

                   ) : (
                   filteredSellers.map((seller) => (
                    <tr key={seller.sid} className={selectedId === seller.sid ? 'table-active' : ''}>
                        {showActions && (
                            <td>
                                <input
                                    type="radio"
                                    name="selectedSeller"
                                    onChange={() => setSelectedId(seller.sid)}
                                    checked={selectedId === seller.sid}
                                />
                            </td>
                        )}
                        <td>{seller.sid}</td>
                        <td>{seller.name}</td>
                        <td>{seller.email}</td>
                        <td>{seller.username}</td>
                        <td>{seller.gender}</td>
                        <td>{seller.company}</td>
                        <td>{seller.age}</td>
                        <td>{seller.number}</td>
                    </tr>
                    )
                ))}
                </tbody>
            </table>
        </div>
    );
}

export default Sellerdata;
