import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';


const Login = () => {
    const [memb___id, setMemb___id] = useState('');
    const [memb__pwd, setMemb__pwd] = useState('');
    const [message, setMessage] = useState('');
    const navigate = useNavigate();
	
	const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await login(form);
            console.log('Login response:', response.data); // Debug
            localStorage.setItem('authToken', response.data.token);
            navigate('/dashboard');
        } catch (err) {
            setError('Đăng nhập thất bại: ' + (err.response?.data?.error || err.message));
            console.error('Lỗi đăng nhập:', err);
        }
    };
	
    const handleLogin = async () => {
        try {
            if (!memb___id.trim() || !memb__pwd.trim()) {
                throw new Error('Tên tài khoản và mật khẩu là bắt buộc');
            }

            const response = await axios.post('http://localhost:5000/api/auth/login', {
                memb___id: memb___id.trim(),
                memb__pwd: memb__pwd.trim()
            });

            setMessage('Đăng nhập thành công! Đang chuyển hướng...');
            localStorage.setItem('authToken', response.data.token);
            console.log('Token saved:', response.data.token); // Debug
            setTimeout(() => navigate('/dashboard'), 1000);
        } catch (err) {
            setMessage('Error: ' + (err.response?.data?.error || err.message));
            console.error('Lỗi đăng nhập:', err);
        }
    };

    return (
        <div style={{ maxWidth: '400px', margin: '0 auto', padding: '20px' }}>
            <h2>Login</h2>
            {message && <p style={{ color: message.includes('Error') ? 'red' : 'green' }}>{message}</p>}
            <div>
                <input
                    type="text"
                    placeholder="Tên tài khoản"
                    value={memb___id}
                    onChange={(e) => setMemb___id(e.target.value)}
                    style={{ width: '100%', padding: '8px', margin: '8px 0' }}
                />
                <input
                    type="password"
                    placeholder="Mật khẩu"
                    value={memb__pwd}
                    onChange={(e) => setMemb__pwd(e.target.value)}
                    style={{ width: '100%', padding: '8px', margin: '8px 0' }}
                />
                <button
                    onClick={handleLogin}
                    style={{ width: '100%', padding: '10px', background: '#007bff', color: 'white', border: 'none', cursor: 'pointer' }}
                >
                    Login
                </button>
                <p style={{ marginTop: '10px' }}>
                    Don't have an account? <a href="/register">Đăng ký</a>
                </p>
            </div>
        </div>
    );
};

export default Login;