import React, { useState } from 'react';
import { Modal, Button, Form, Spinner, Alert } from 'react-bootstrap';
import axios from 'axios';
import AddDetailsModal from './AddDetailsModal';

const OtpModal = ({ show, handleClose, mobile, onLogin }) => {
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showAddDetails, setShowAddDetails] = useState(false);

  const verifyOtp = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await axios.post(`${process.env.REACT_APP_API_BASE_URL}/api/auth/verify-otp`, { mobile, otp });
      if (res.status === 200) {
        setShowAddDetails(true);
        handleClose();
      }
    } catch (err) {
      setError('Invalid OTP');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Modal show={show} onHide={handleClose} centered>
        <Modal.Header closeButton><Modal.Title>Verify OTP</Modal.Title></Modal.Header>
        <Modal.Body>
          <Form.Group>
            <Form.Control
              type="text"
              placeholder="Enter OTP"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
            />
          </Form.Group>
          {error && <Alert variant="danger" className="mt-2">{error}</Alert>}
          <Button variant="success" className="w-100 mt-3" onClick={verifyOtp} disabled={loading}>
            {loading ? <Spinner animation="border" size="sm" /> : 'Verify'}
          </Button>
        </Modal.Body>
      </Modal>

      {showAddDetails && (
        <AddDetailsModal
          show={showAddDetails}
          handleClose={() => setShowAddDetails(false)}
          mobile={mobile}
          onLogin={onLogin}
        />
      )}
    </>
  );
};

export default OtpModal;
