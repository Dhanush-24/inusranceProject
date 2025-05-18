import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';

const AdminLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();

  const handleLoginSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(`${process.env.REACT_APP_API_BASE_URL}/api/admin/login`, { email, password });
      const { token } = response.data;

      localStorage.setItem('adminToken', token);
      navigate('/admin/dashboard');
    } catch (error) {
      setErrorMessage('Invalid email or password');
    }
  };

  return (
    <div className="admin-login-container">
      <style>{`
        .admin-login-container {
          max-width: 400px;
          margin: 80px auto;
          padding: 30px;
          background-color: #fff;
          border-radius: 12px;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
        }
        .admin-login-container h2 {
          text-align: center;
          margin-bottom: 25px;
        }
        .form-group {
          margin-bottom: 15px;
        }
        .btn {
          width: 100%;
        }
        a {
          text-decoration: none;
        }
        a:hover {
          text-decoration: underline;
        }
        .text-danger {
          text-align: center;
        }
      `}</style>

      <h2>Admin Login</h2>
      <form onSubmit={handleLoginSubmit}>
        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="form-control"
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="form-control"
            required
          />
        </div>
        <button type="submit" className="btn btn-primary mt-3">
          Login
        </button>
      </form>

      {errorMessage && <p className="text-danger mt-3">{errorMessage}</p>}

      <p className="mt-3 text-center">
        Don't have an account? <Link to="/admin/register">Register here</Link>
      </p>
      <p className="text-center">
        <Link to="/">← Back to Home</Link>
      </p>
    </div>
  );
};

export default AdminLogin;
