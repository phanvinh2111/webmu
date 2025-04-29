import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { getUserInfo } from '../services/api';

const Navbar = () => {
    const [isAdmin, setIsAdmin] = useState(false);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const location = useLocation();

    useEffect(() => {
        console.log('Navbar useEffect chạy, URL:', location.pathname);
        const token = localStorage.getItem('authToken');
        console.log('Token trong Navbar:', token);

        if (token) {
            getUserInfo(token)
                .then((response) => {
                    console.log('getUserInfo response in Navbar:', response.data);
                    console.log('isAdmin value in Navbar:', response.data.isAdmin, typeof response.data.isAdmin);
                    const adminStatus = Number(response.data.isAdmin) === 1 || response.data.isAdmin === true;
                    setIsAdmin(adminStatus);
                    console.log('isAdmin state sau set:', adminStatus);
                    if (adminStatus) {
                        console.log('Rendering Quản lý tin tức và Quản lý tài khoản, isAdmin:', adminStatus);
                    }
                })
                .catch((err) => {
                    console.error('Lỗi kiểm tra admin:', err.message, err.response?.data, err.response?.status);
                    console.log('Giữ isAdmin là false do lỗi');
                    setIsAdmin(false);
                });
        } else {
            console.log('Không có token, đặt isAdmin là false');
            setIsAdmin(false);
        }
    }, [location.pathname]);

    return (
        <nav className="navbar navbar-expand-md shadow-sm" style={{ backgroundColor: '#0a192f' }}>
            <div className="container-fluid">
                <Link className="navbar-brand text-white" to="/">
                    MU Online
                </Link>
                <button
                    className="navbar-toggler"
                    type="button"
                    onClick={() => setIsMenuOpen(!isMenuOpen)}
                    aria-controls="navbarNav"
                    aria-expanded={isMenuOpen}
                    aria-label="Toggle navigation"
                >
                    <span className="navbar-toggler-icon"></span>
                </button>
                <div className={`collapse navbar-collapse ${isMenuOpen ? 'show' : ''}`} id="navbarNav">
                    <ul className="navbar-nav ms-auto">
                        <li className="nav-item">
                            <Link
                                className={`nav-link text-white ${location.pathname === '/' ? 'active' : ''}`}
                                to="/"
                                onClick={() => setIsMenuOpen(false)}
                            >
                                Trang chủ
                            </Link>
                        </li>
                        <li className="nav-item">
                            <Link
                                className={`nav-link text-white ${location.pathname === '/dashboard' ? 'active' : ''}`}
                                to="/dashboard"
                                onClick={() => setIsMenuOpen(false)}
                            >
                                Dashboard
                            </Link>
                        </li>
                        {isAdmin && (
                            <>
                                <li className="nav-item">
                                    <Link
                                        className={`nav-link bg-primary text-white fw-bold ${
                                            location.pathname === '/admin/news' ? 'active' : ''
                                        }`}
                                        to="/admin/news"
                                        onClick={() => setIsMenuOpen(false)}
                                    >
                                        Quản lý tin tức
                                    </Link>
                                </li>
                                <li className="nav-item">
                                    <Link
                                        className={`nav-link bg-primary text-white fw-bold ${
                                            location.pathname === '/admin/users' ? 'active' : ''
                                        }`}
                                        to="/admin/users"
                                        onClick={() => setIsMenuOpen(false)}
                                    >
                                        Quản lý tài khoản
                                    </Link>
                                </li>
                            </>
                        )}
                        {localStorage.getItem('authToken') ? (
                            <li className="nav-item">
                                <Link
                                    className={`nav-link text-white ${location.pathname === '/logout' ? 'active' : ''}`}
                                    to="/logout"
                                    onClick={() => {
                                        localStorage.removeItem('authToken');
                                        window.location.href = '/login';
                                        setIsMenuOpen(false);
                                    }}
                                >
                                    Đăng xuất
                                </Link>
                            </li>
                        ) : (
                            <li className="nav-item">
                                <Link
                                    className={`nav-link text-white ${location.pathname === '/login' ? 'active' : ''}`}
                                    to="/login"
                                    onClick={() => setIsMenuOpen(false)}
                                >
                                    Đăng nhập
                                </Link>
                            </li>
                        )}
                    </ul>
                </div>
            </div>
            <style jsx>{`
                .nav-link:hover {
                    background-color: #ffc107 !important;
                    color: #0a192f !important;
                    border-radius: 0.25rem;
                }
                .nav-link.active {
                    background-color: rgba(255, 255, 255, 0.2);
                    border-bottom: 2px solid #ffffff;
                    border-radius: 0;
                }
                .nav-link.bg-primary.active {
                    background-color: #2b6cb0 !important;
                    border-bottom: 2px solid #ffffff;
                }
                .navbar-collapse {
                    transition: all 0.3s ease-in-out;
                }
                @media (max-width: 767.98px) {
                    .navbar-collapse.show {
                        max-height: 400px;
                        opacity: 1;
                    }
                    .navbar-collapse {
                        max-height: 0;
                        opacity: 0;
                        overflow: hidden;
                    }
                }
            `}</style>
        </nav>
    );
};

export default Navbar;