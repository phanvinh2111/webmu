import React, { useState } from 'react';
import { login, setAuthToken } from '../services/api';

const Login = () => {
    const [memb___id, setMemb___id] = useState('');
    const [memb__pwd, setMemb__pwd] = useState('');

    const handleLogin = async () => {
        try {
            const data = { memb___id, memb__pwd };
            const response = await login(data);
            const { token } = response.data;
            setAuthToken(token); // Lưu token và cài đặt header
            alert('Login successful');
            // Chuyển hướng hoặc cập nhật state nếu cần
        } catch (err) {
            alert('Error: ' + (err.response?.data?.error || err.message));
        }
    };

    return (
        <div>
            <input
                type="text"
                placeholder="Username"
                value={memb___id}
                onChange={(e) => setMemb___id(e.target.value)}
            />
            <input
                type="password"
                placeholder="Password"
                value={memb__pwd}
                onChange={(e) => setMemb__pwd(e.target.value)}
            />
            <button onClick={handleLogin}>Login</button>
        </div>
    );
};

export default Login;