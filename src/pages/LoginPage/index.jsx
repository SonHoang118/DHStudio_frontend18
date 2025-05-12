import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './index.scss'

const LoginPage = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            await axios.post(`${process.env.REACT_APP_BASE_URL_BACKEND}/login`, {
                username,
                password,
            })
                .then(res => {
                    if (res?.data?.status === 200) {
                        localStorage.setItem('token', res.data.token);
                        navigate('/system/authorization/admin/management');
                    }
                    else {
                        setPassword("")
                        setUsername("")
                        alert('Đăng nhập không đúng');
                    }
                })

        } catch (error) {
            alert('Đăng nhập thất bại');
        }
    };

    return (
        <div className="container_form">
            <form onSubmit={handleLogin}>
                <h2>Đăng nhập admin dhstudio.com.vn</h2>
                <label>Email:</label>
                <input value={username} onChange={(e) => setUsername(e.target.value)} required />
                <label>Mật khẩu:</label>
                <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
                <button type="submit">Đăng nhập</button>
            </form>
        </div>
    );
};

export default LoginPage