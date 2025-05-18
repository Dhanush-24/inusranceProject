import React, { useState } from 'react';
import { Modal, Button, Form, Spinner, Alert } from 'react-bootstrap';
import axios from 'axios';

const AddDetailsModal = ({ show, handleClose, mobile, onLogin }) => {
  const [name, setName] = useState('');
  const [gender, setGender] = useState('');
  const [dob, setDob] = useState('');
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async () => {
    if (!name || !gender || !dob || !email) {
      setError('All fields are required');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await axios.post(`${process.env.REACT_APP_API_BASE_URL}/api/auth/add-details`, {
        name,
        gender,
        dob,
        email,
        mobile,
      });

      if (response.status === 200) {
        const userData = { name, mobile }; // ✅ Include mobile with name
        console.log('Storing user in context:', userData);
        onLogin(userData); // ✅ Pass the full object
        handleClose();
      }
    } catch (err) {
      console.error('Error saving user details:', err);
      setError('Failed to save user details');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal show={show} onHide={handleClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>Add Details</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form.Group>
          <Form.Label>Name</Form.Label>
          <Form.Control
            type="text"
            placeholder="Your full name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </Form.Group>

        <Form.Group className="mt-3">
          <Form.Label>Gender</Form.Label>
          <Form.Control as="select" value={gender} onChange={(e) => setGender(e.target.value)}>
            <option value="">Select Gender</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="other">Other</option>
          </Form.Control>
        </Form.Group>

        <Form.Group className="mt-3">
          <Form.Label>Date of Birth</Form.Label>
          <Form.Control
            type="date"
            value={dob}
            onChange={(e) => setDob(e.target.value)}
          />
        </Form.Group>

        <Form.Group className="mt-3">
          <Form.Label>Email</Form.Label>
          <Form.Control
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </Form.Group>

        {error && <Alert variant="danger" className="mt-2">{error}</Alert>}

        <Button variant="primary" className="w-100 mt-3" onClick={handleSubmit} disabled={loading}>
          {loading ? <Spinner animation="border" size="sm" /> : 'Submit'}
        </Button>
      </Modal.Body>
    </Modal>
  );
};

export default AddDetailsModal;
