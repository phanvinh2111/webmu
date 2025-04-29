import React, { useState } from 'react';

const Register = () => {
    const [memb___id, setMemb___id] = useState('');
    const [memb__pwd, setMemb__pwd] = useState('');
    const [memb_name, setMemb_name] = useState('');
    const [sno__numb, setSno__numb] = useState('');
    const [message, setMessage] = useState('');

    const handleRegister = () => {
        try {
            // Kiểm tra các trường bắt buộc
            if (!memb___id.trim()) {
                throw new Error('Username is required');
            }
            if (!memb__pwd.trim()) {
                throw new Error('Password is required');
            }
            if (!memb_name.trim()) {
                throw new Error('Name is required');
            }
            if (!sno__numb.trim()) {
                throw new Error('Serial number is required');
            }

            // Giả lập đăng ký thành công
            setMessage('Registration successful!');
        } catch (err) {
            setMessage('Error: ' + err.message);
        }
    };

    return (
        <div style={{ maxWidth: '400px', margin: '0 auto', padding: '20px' }}>
            <h2>Register</h2>
            {message && <p style={{ color: message.includes('Error') ? 'red' : 'green' }}>{message}</p>}
            <div>
                <input
                    type="text"
                    placeholder="Username"
                    value={memb___id}
                    onChange={(e) => setMemb___id(e.target.value)}
                    required
                    style={{ width: '100%', padding: '8px', margin: '8px 0' }}
                />
                <input
                    type="password"
                    placeholder="Password"
                    value={memb__pwd}
                    onChange={(e) => setMemb__pwd(e.target.value)}
                    required
                    style={{ width: '100%', padding: '8px', margin: '8px 0' }}
                />
                <input
                    type="text"
                    placeholder="Name"
                    value={memb_name}
                    onChange={(e) => setMemb_name(e.target.value)}
                    required
                    style={{ width: '100%', padding: '8px', margin: '8px 0' }}
                />
                <input
                    type="text"
                    placeholder="Serial Number"
                    value={sno__numb}
                    onChange={(e) => setSno__numb(e.target.value)}
                    required
                    style={{ width: '100%', padding: '8px', margin: '8px 0' }}
                />
                <button
                    onClick={handleRegister}
                    style={{ width: '100%', padding: '10px', background: '#007bff', color: 'white', border: 'none', cursor: 'pointer' }}
                >
                    Register
                </button>
            </div>
        </div>
    );
};

export default Register;