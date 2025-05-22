import React, { useState } from 'react';
import axios from 'axios';
import LoginModal from './LoginModal';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

const UserLoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [showRegisterModal, setShowRegisterModal] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const res = await axios.post(`${process.env.REACT_APP_API_BASE_URL}/api/user/login`, {
        email,
        password,
      });

      const { token, user } = res.data;

      localStorage.setItem('token', token);
      login(user);
      navigate(`/dashboard/${user.mobile}`);
    } catch (err) {
      setError('Login failed. If you are a new user, please register.');
    }
  };

  return (
    <div className="container mt-5" style={{ maxWidth: 400 }}>
      <h4>User Login</h4>
      {error && <div className="alert alert-danger">{error}</div>}
      <input
        className="form-control my-2"
        placeholder="Email"
        value={email}
        onChange={e => setEmail(e.target.value)}
      />
      <input
        type="password"
        className="form-control my-2"
        placeholder="Password"
        value={password}
        onChange={e => setPassword(e.target.value)}
      />
      <button className="btn btn-primary w-100 my-2" onClick={handleLogin}>
        Login
      </button>
      <button className="btn btn-link w-100" onClick={() => setShowRegisterModal(true)}>
        New user? Register here
      </button>

      <LoginModal show={showRegisterModal} handleClose={() => setShowRegisterModal(false)} onLogin={login} />
    </div>
  );
};

export default UserLoginPage;
