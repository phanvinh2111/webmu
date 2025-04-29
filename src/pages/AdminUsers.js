import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const AdminUsers = () => {
    const [users, setUsers] = useState([]);
    const [error, setError] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [editUser, setEditUser] = useState(null);
    const [deleteConfirm, setDeleteConfirm] = useState(null);
    const itemsPerPage = 4;
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem('authToken');
        if (!token) {
            navigate('/login');
            return;
        }

        const fetchUsers = async () => {
            try {
                const response = await axios.get('http://localhost:5000/api/admin/users', {
                    headers: { Authorization: `Bearer ${token}` },
                });
                console.log('Users data:', response.data);
                setUsers(response.data);
            } catch (err) {
                setError('Không tải được danh sách tài khoản: ' + (err.response?.data?.error || err.message));
                console.error('Fetch users error:', err);
                if (err.response?.status === 403) {
                    navigate('/dashboard');
                }
            }
        };

        fetchUsers();
    }, [navigate]);

    const handleEdit = (user) => {
        setEditUser({ ...user });
    };

    const handleUpdate = async () => {
        const token = localStorage.getItem('authToken');
        try {
            await axios.put(
                `http://localhost:5000/api/admin/users/${editUser.memb___id}`,
                editUser,
                { headers: { Authorization: `Bearer ${token}` } }
            );
            setUsers(users.map((u) => (u.memb___id === editUser.memb___id ? editUser : u)));
            setEditUser(null);
        } catch (err) {
            setError('Cập nhật thất bại: ' + (err.response?.data?.error || err.message));
            console.error('Update error:', err);
        }
    };

    const handleDelete = async (memb___id) => {
        const token = localStorage.getItem('authToken');
        try {
            await axios.delete(`http://localhost:5000/api/admin/users/${memb___id}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setUsers(users.filter((u) => u.memb___id !== memb___id));
            setDeleteConfirm(null);
        } catch (err) {
            setError('Xóa thất bại: ' + (err.response?.data?.error || err.message));
            console.error('Delete error:', err);
        }
    };

    const filteredUsers = users.filter((user) =>
        user.memb___id.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);
    const paginatedUsers = filteredUsers.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    const handlePageChange = (page) => {
        if (page >= 1 && page <= totalPages) {
            setCurrentPage(page);
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    };

    return (
        <div className="min-vh-100 py-5" style={{ backgroundColor: '#0a192f' }}>
            <div className="container" style={{ maxWidth: '900px' }}>
                <h2 className="text-white text-center mb-4">Quản lý tài khoản</h2>
                {error && <div className="alert alert-danger text-center">{error}</div>}
                <div className="mb-4">
                    <input
                        type="text"
                        className="form-control bg-dark text-white border-0"
                        placeholder="Tìm kiếm tài khoản (memb___id)..."
                        value={searchTerm}
                        onChange={(e) => {
                            setSearchTerm(e.target.value);
                            setCurrentPage(1);
                        }}
                    />
                </div>
                {filteredUsers.length > 0 ? (
                    <>
                        <div className="card shadow-sm mb-4" style={{ backgroundColor: '#2d3748' }}>
                            <div className="card-body">
                                <table className="table table-dark table-hover">
                                    <thead>
                                        <tr>
                                            <th>Tài khoản</th>
                                            <th>Admin</th>
                                            <th>WCoin</th>
                                            <th>BlessBank</th>
                                            <th>Thao tác</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {paginatedUsers.map((user) => (
                                            <tr key={user.memb___id}>
                                                <td>{user.memb___id}</td>
                                                <td>{user.isAdmin ? 'Có' : 'Không'}</td>
                                                <td>{user.WCoin}</td>
                                                <td>{user.BlessBank}</td>
                                                <td>
                                                    <button
                                                        className="btn btn-primary btn-sm me-2"
                                                        onClick={() => handleEdit(user)}
                                                    >
                                                        Chỉnh sửa
                                                    </button>
                                                    <button
                                                        className="btn btn-danger btn-sm"
                                                        onClick={() => setDeleteConfirm(user.memb___id)}
                                                    >
                                                        Xóa
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                        <nav aria-label="Users pagination">
                            <ul className="pagination justify-content-center">
                                <li className="page-item">
                                    <button
                                        className="page-link bg-dark text-white border-0"
                                        onClick={() => handlePageChange(currentPage - 1)}
                                        disabled={currentPage === 1}
                                    >
                                        Previous
                                    </button>
                                </li>
                                {[...Array(totalPages).keys()].map((page) => (
                                    <li
                                        key={page + 1}
                                        className={`page-item ${currentPage === page + 1 ? 'active' : ''}`}
                                    >
                                        <button
                                            className="page-link bg-dark text-white border-0"
                                            onClick={() => handlePageChange(page + 1)}
                                        >
                                            {page + 1}
                                        </button>
                                    </li>
                                ))}
                                <li className="page-item">
                                    <button
                                        className="page-link bg-dark text-white border-0"
                                        onClick={() => handlePageChange(currentPage + 1)}
                                        disabled={currentPage === totalPages}
                                    >
                                        Next
                                    </button>
                                </li>
                            </ul>
                        </nav>
                    </>
                ) : (
                    <p className="text-light text-center">
                        {searchTerm ? 'Không tìm thấy tài khoản phù hợp' : 'Không có tài khoản'}
                    </p>
                )}

                {/* Modal chỉnh sửa */}
                {editUser && (
                    <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
                        <div className="modal-dialog">
                            <div className="modal-content bg-dark text-white">
                                <div className="modal-header">
                                    <h5 className="modal-title">Chỉnh sửa tài khoản: {editUser.memb___id}</h5>
                                    <button
                                        type="button"
                                        className="btn-close btn-close-white"
                                        onClick={() => setEditUser(null)}
                                    ></button>
                                </div>
                                <div className="modal-body">
                                    <div className="mb-3">
                                        <label className="form-label">Admin</label>
                                        <select
                                            className="form-select bg-dark text-white"
                                            value={editUser.isAdmin}
                                            onChange={(e) =>
                                                setEditUser({ ...editUser, isAdmin: Number(e.target.value) })
                                            }
                                        >
                                            <option value={0}>Không</option>
                                            <option value={1}>Có</option>
                                        </select>
                                    </div>
                                    <div className="mb-3">
                                        <label className="form-label">WCoin</label>
                                        <input
                                            type="number"
                                            className="form-control bg-dark text-white"
                                            value={editUser.WCoin}
                                            onChange={(e) =>
                                                setEditUser({ ...editUser, WCoin: Number(e.target.value) })
                                            }
                                        />
                                    </div>
                                    <div className="mb-3">
                                        <label className="form-label">BlessBank</label>
                                        <input
                                            type="number"
                                            className="form-control bg-dark text-white"
                                            value={editUser.BlessBank}
                                            onChange={(e) =>
                                                setEditUser({ ...editUser, BlessBank: Number(e.target.value) })
                                            }
                                        />
                                    </div>
                                </div>
                                <div className="modal-footer">
                                    <button
                                        type="button"
                                        className="btn btn-secondary"
                                        onClick={() => setEditUser(null)}
                                    >
                                        Hủy
                                    </button>
                                    <button
                                        type="button"
                                        className="btn btn-primary"
                                        onClick={handleUpdate}
                                    >
                                        Lưu
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Modal xác nhận xóa */}
                {deleteConfirm && (
                    <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
                        <div className="modal-dialog">
                            <div className="modal-content bg-dark text-white">
                                <div className="modal-header">
                                    <h5 className="modal-title">Xác nhận xóa</h5>
                                    <button
                                        type="button"
                                        className="btn-close btn-close-white"
                                        onClick={() => setDeleteConfirm(null)}
                                    ></button>
                                </div>
                                <div className="modal-body">
                                    Bạn có chắc muốn xóa tài khoản {deleteConfirm}?
                                </div>
                                <div className="modal-footer">
                                    <button
                                        type="button"
                                        className="btn btn-secondary"
                                        onClick={() => setDeleteConfirm(null)}
                                    >
                                        Hủy
                                    </button>
                                    <button
                                        type="button"
                                        className="btn btn-danger"
                                        onClick={() => handleDelete(deleteConfirm)}
                                    >
                                        Xóa
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
            <style jsx>{`
                .table-dark {
                    --bs-table-bg: #2d3748;
                    --bs-table-hover-bg: #4a5568;
                }
                .btn-primary, .btn-danger, .btn-secondary {
                    transition: background-color 0.2s ease, box-shadow 0.2s ease;
                }
                .btn-primary:hover, .btn-danger:hover {
                    background-color: #ffc107 !important;
                    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
                }
                .form-control, .form-select {
                    transition: background-color 0.2s ease;
                }
                .form-control:focus, .form-select:focus {
                    background-color: #2d3748 !important;
                    color: #ffffff;
                    box-shadow: 0 0 0 0.2rem rgba(255, 193, 7, 0.25);
                }
                .page-link:hover {
                    background-color: #ffc107 !important;
                    color: #0a192f !important;
                }
                .page-item.active .page-link {
                    background-color: #1e3a8a !important;
                    border-color: #1e3a8a !important;
                }
            `}</style>
        </div>
    );
};

export default AdminUsers;