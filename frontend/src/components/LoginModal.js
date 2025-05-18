import React, { useState } from 'react';
import { Modal, Button, Form, Spinner, Alert } from 'react-bootstrap';
import axios from 'axios';
import OtpModal from './OtpModal';

const LoginModal = ({ show, handleClose, onLogin }) => {
  const [name, setName] = useState('');
  const [mobile, setMobile] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [showOtpModal, setShowOtpModal] = useState(false);

  const handleContinue = async () => {
    if (!/^\d{10}$/.test(mobile)) {
      setErrorMessage('Please enter a valid 10-digit mobile number');
      return;
    }

    if (!name.trim()) {
      setErrorMessage('Please enter your name');
      return;
    }

    setIsLoading(true);
    setErrorMessage('');

    try {
      const response = await axios.post(`${process.env.REACT_APP_API_BASE_URL}/api/auth/send-otp`, { mobile });

      if (response.status === 200) {
        console.log("OTP Sent Successfully");
        setShowOtpModal(true);
        handleClose();
      }
    } catch (error) {
      setErrorMessage('Failed to send OTP');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Modal show={show} onHide={handleClose} centered>
        <Modal.Header closeButton><Modal.Title>Sign in</Modal.Title></Modal.Header>
        <Modal.Body>
          <p>Login using your mobile number</p>
          <Form>
            <Form.Group controlId="formName">
              <Form.Label>Name</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter your name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </Form.Group>
            <Form.Group controlId="formMobile" className="mt-2">
              <Form.Label>Mobile Number</Form.Label>
              <Form.Control
                type="tel"
                placeholder="Mobile Number"
                value={mobile}
                onChange={(e) => setMobile(e.target.value)}
              />
            </Form.Group>
            {errorMessage && <Alert variant="danger" className="mt-2">{errorMessage}</Alert>}
            <Button variant="danger" className="w-100 mt-3" onClick={handleContinue} disabled={isLoading}>
              {isLoading ? <Spinner animation="border" size="sm" /> : 'Continue'}
            </Button>
          </Form>
        </Modal.Body>
      </Modal>

      <OtpModal
        show={showOtpModal}
        handleClose={() => setShowOtpModal(false)}
        name={name}
        mobile={mobile}
        onLogin={onLogin}
      />
    </>
  );
};

export default LoginModal;
