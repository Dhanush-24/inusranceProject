import React, { useState } from 'react';
import { Modal, Button, Form, Spinner, Alert } from 'react-bootstrap';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext'; // Make sure AuthContext is implemented

const LoginModal = ({ show, handleClose, onLogin }) => {
  const { login } = useAuth(); // Context login function

  const [isRegister, setIsRegister] = useState(false);
  const [form, setForm] = useState({
    name: '',
    gender: '',
    dob: '',
    email: '',
    mobile: '',
    password: ''
  });

  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    setIsLoading(true);
    setErrorMessage('');

    try {
      const endpoint = isRegister
        ? 'http://localhost:5001/api/auth/register'
        : 'http://localhost:5001/api/auth/login';

      const payload = isRegister
        ? form
        : { email: form.email, password: form.password };

      const response = await axios.post(endpoint, payload);

      if (response.status === 200 || response.status === 201) {
        const { token, user } = response.data;

        login(user, token);      // Save to context + localStorage
        onLogin?.(user);         // Optional callback
        handleClose();
      }
    } catch (error) {
      const err =
        error.response?.data?.error || 'Something went wrong. Please try again.';
      setErrorMessage(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal show={show} onHide={handleClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>{isRegister ? 'Register' : 'Login'}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          {isRegister && (
            <>
              <Form.Group className="mb-2">
                <Form.Label>Name</Form.Label>
                <Form.Control
                  type="text"
                  name="name"
                  placeholder="Your full name"
                  value={form.name}
                  onChange={handleChange}
                />
              </Form.Group>
              <Form.Group className="mb-2">
                <Form.Label>Gender</Form.Label>
                <Form.Select name="gender" value={form.gender} onChange={handleChange}>
                  <option value="">Select</option>
                  <option>Male</option>
                  <option>Female</option>
                  <option>Other</option>
                </Form.Select>
              </Form.Group>
              <Form.Group className="mb-2">
                <Form.Label>Date of Birth</Form.Label>
                <Form.Control
                  type="date"
                  name="dob"
                  value={form.dob}
                  onChange={handleChange}
                />
              </Form.Group>
              <Form.Group className="mb-2">
                <Form.Label>Mobile</Form.Label>
                <Form.Control
                  type="tel"
                  name="mobile"
                  placeholder="10-digit mobile number"
                  value={form.mobile}
                  onChange={handleChange}
                />
              </Form.Group>
            </>
          )}

          <Form.Group className="mb-2">
            <Form.Label>Email</Form.Label>
            <Form.Control
              type="email"
              name="email"
              placeholder="Enter email"
              value={form.email}
              onChange={handleChange}
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Password</Form.Label>
            <Form.Control
              type="password"
              name="password"
              placeholder="Password"
              value={form.password}
              onChange={handleChange}
            />
          </Form.Group>

          {errorMessage && <Alert variant="danger">{errorMessage}</Alert>}

          <Button
            variant="primary"
            className="w-100"
            onClick={handleSubmit}
            disabled={isLoading}
          >
            {isLoading ? (
              <Spinner animation="border" size="sm" />
            ) : isRegister ? 'Register' : 'Login'}
          </Button>
        </Form>

        <div className="mt-3 text-center">
          {isRegister ? (
            <>
              Already have an account?{' '}
              <Button variant="link" size="sm" onClick={() => setIsRegister(false)}>
                Login
              </Button>
            </>
          ) : (
            <>
              New user?{' '}
              <Button variant="link" size="sm" onClick={() => setIsRegister(true)}>
                Register
              </Button>
            </>
          )}
        </div>
      </Modal.Body>
    </Modal>
  );
};

export default LoginModal;
