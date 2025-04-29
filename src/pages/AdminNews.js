import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getNews, createNews, updateNews, deleteNews, getUserInfo } from '../services/api';

const AdminNews = () => {
    const [news, setNews] = useState([]);
    const [error, setError] = useState('');
    const [message, setMessage] = useState('');
    const [form, setForm] = useState({ id: null, title: '', content: '', author: 'Admin' });
    const [isAdmin, setIsAdmin] = useState(false);
    const navigate = useNavigate();
    const token = localStorage.getItem('authToken');

    useEffect(() => {
        if (!token) {
            navigate('/login');
            return;
        }

        const fetchData = async () => {
            try {
                const userResponse = await getUserInfo(token);
                if (Number(userResponse.data.isAdmin) !== 1) {
                    navigate('/dashboard');
                    return;
                }
                setIsAdmin(true);

                const newsResponse = await getNews();
                setNews(newsResponse.data);
            } catch (err) {
                setError('Không tải được dữ liệu: ' + (err.response?.data?.error || err.message));
            }
        };
        fetchData();
    }, [navigate, token]);

    const handleSubmit = async () => {
        if (!form.title.trim() || !form.content.trim()) {
            setError('Tiêu đề và nội dung là bắt buộc');
            return;
        }

        try {
            setError('');
            setMessage('');
            if (form.id) {
                await updateNews(form.id, { title: form.title, content: form.content, author: form.author }, token);
                setMessage('Cập nhật tin tức thành công');
                setNews(news.map((item) =>
                    item.Id === form.id ? { ...item, Title: form.title, Content: form.content, Author: form.author } : item
                ));
            } else {
                await createNews({ title: form.title, content: form.content, author: form.author }, token);
                setMessage('Tạo tin tức thành công');
                const newsResponse = await getNews();
                setNews(newsResponse.data);
            }
            setForm({ id: null, title: '', content: '', author: 'Admin' });
        } catch (err) {
            setError('Lỗi: ' + (err.response?.data?.error || err.message));
        }
    };

    const handleEdit = (item) => {
        setForm({ id: item.Id, title: item.Title, content: item.Content, author: item.Author });
        setError('');
        setMessage('');
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Bạn có chắc muốn xóa tin tức này?')) return;

        try {
            await deleteNews(id, token);
            setMessage('Xóa tin tức thành công');
            setNews(news.filter((item) => item.Id !== id));
        } catch (err) {
            setError('Lỗi: ' + (err.response?.data?.error || err.message));
        }
    };

    if (!isAdmin) {
        return <div className="text-center py-5 text-muted">Đang tải...</div>;
    }

    return (
        <div className="container my-5">
            <h2 className="text-center mb-4">Quản lý tin tức</h2>
            <div className="card shadow-sm mb-5">
                <div className="card-body">
                    <h3 className="card-title mb-4">{form.id ? 'Sửa tin tức' : 'Thêm tin tức'}</h3>
                    {error && <div className="alert alert-danger">{error}</div>}
                    {message && <div className="alert alert-success">{message}</div>}
                    <div className="mb-3">
                        <input
                            type="text"
                            className="form-control"
                            placeholder="Tiêu đề"
                            value={form.title}
                            onChange={(e) => setForm({ ...form, title: e.target.value })}
                        />
                    </div>
                    <div className="mb-3">
                        <textarea
                            className="form-control"
                            placeholder="Nội dung"
                            value={form.content}
                            onChange={(e) => setForm({ ...form, content: e.target.value })}
                            rows="5"
                        ></textarea>
                    </div>
                    <div className="mb-3">
                        <input
                            type="text"
                            className="form-control"
                            placeholder="Tác giả"
                            value={form.author}
                            onChange={(e) => setForm({ ...form, author: e.target.value })}
                        />
                    </div>
                    <div className="d-flex gap-2">
                        <button
                            onClick={handleSubmit}
                            className="btn btn-primary"
                        >
                            {form.id ? 'Cập nhật' : 'Thêm'}
                        </button>
                        {form.id && (
                            <button
                                onClick={() => setForm({ id: null, title: '', content: '', author: 'Admin' })}
                                className="btn btn-danger"
                            >
                                Hủy
                            </button>
                        )}
                    </div>
                </div>
            </div>
            <h3 className="text-center mb-4">Danh sách tin tức</h3>
            {news.length > 0 ? (
                <div className="row">
                    {news.map((item) => (
                        <div key={item.Id} className="col-12 mb-3">
                            <div className="card shadow-sm">
                                <div className="card-body">
                                    <h4 className="card-title">{item.Title}</h4>
                                    <p className="card-text">{item.Content}</p>
                                    <p className="text-muted small">
                                        Đăng bởi: {item.Author} | {new Date(item.CreatedAt).toLocaleDateString('vi-VN')}
                                    </p>
                                    <div className="d-flex gap-2">
                                        <button
                                            onClick={() => handleEdit(item)}
                                            className="btn btn-success btn-sm"
                                        >
                                            Sửa
                                        </button>
                                        <button
                                            onClick={() => handleDelete(item.Id)}
                                            className="btn btn-danger btn-sm"
                                        >
                                            Xóa
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <p className="text-center text-muted">Không có tin tức</p>
            )}
        </div>
    );
};

export default AdminNews;