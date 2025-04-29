import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Register = () => {
    const [memb___id, setMemb___id] = useState('');
    const [memb__pwd, setMemb__pwd] = useState('');
    const [sno__numb, setSno__numb] = useState('');
    const [message, setMessage] = useState('');
    const navigate = useNavigate();

    const handleRegister = async () => {
        try {
            if (!memb___id.trim() || !memb__pwd.trim() || !sno__numb.trim()) {
                throw new Error('Đăng ký<');
            }

            const response = await axios.post('http://localhost:5000/api/auth/register', {
                memb___id: memb___id.trim(),
                memb__pwd: memb__pwd.trim(),
                sno__numb: sno__numb.trim()
            });

            setMessage('Đăng ký thành công! Chuyển hướng đến đăng nhập...');
            setTimeout(() => navigate('/login'), 1000);
        } catch (err) {
            setMessage('Lỗi: ' + (err.response?.data?.error || err.message));
            console.error('Lỗi đăng ký:', err);
        }
    };

    return (
        <div style={{ maxWidth: '400px', margin: '0 auto', padding: '20px' }}>
            <h2>Register</h2>
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
                <input
                    type="text"
                    placeholder="Mã Số Bí Mật"
                    value={sno__numb}
                    onChange={(e) => setSno__numb(e.target.value)}
                    style={{ width: '100%', padding: '8px', margin: '8px 0' }}
                />
                <button
                    onClick={handleRegister}
                    style={{ width: '100%', padding: '10px', background: '#28a745', color: 'white', border: 'none', cursor: 'pointer' }}
                >
                    Register
                </button>
                <p style={{ marginTop: '10px' }}>
                    Đã có tài khoản? <a href="/login">Đăng nhập</a>
                </p>
            </div>
        </div>
    );
};

export default Register;