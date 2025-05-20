import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useLocation, useNavigate } from 'react-router-dom';
import { Card, Button, Row, Col } from 'react-bootstrap';

const HealthQuote = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const [plans, setPlans] = useState([]);
  const [message, setMessage] = useState(null);

  useEffect(() => {
    axios
      .get(`${process.env.REACT_APP_API_BASE_URL}/api/health/plans`)
      .then(res => setPlans(res.data.data))
      .catch(err => {
        console.error('Error fetching health plans:', err);
        setMessage('Failed to load health plans.');
      });
  }, []);

  const handleSelect = async (planId) => {
    try {
      await axios.post(`${process.env.REACT_APP_API_BASE_URL}/api/health/select`, {
        ...state.userDetails,
        planId,
      });
      alert('Plan selected successfully!');
      navigate('/user-dashboard');
    } catch (err) {
      console.error('Error selecting health plan:', err);
      alert('Failed to select plan.');
    }
  };

  return (
    <div className="container mt-4">
      <h3 className="mb-4">Available Health Insurance Plans</h3>
      {message && <p className="text-danger">{message}</p>}

      {plans.map((plan) => (
        <Card className="mb-4 p-3 shadow" key={plan.planId}>
          <Row className="align-items-center">
            {/* Left: Logo and Pricing */}
            <Col md={3} className="text-center">
              {plan.logoUrl && (
                <img
                  src={plan.logoUrl}
                  alt="Logo"
                  style={{ maxHeight: "100px", objectFit: "contain" }}
                />
              )}

            </Col>

            {/* Middle: Plan Details */}
            <Col md={6}>
              <h5 className="mb-2">{plan.company} - {plan.plan}</h5>
              <div><strong>Sum Insured:</strong> ₹{plan.sumInsured}</div>
                <div><strong>Premium:</strong> {plan.premiumAmount}</div>
              <div style={{ fontSize: "0.9rem", color: "#555" }}>
                {Array.isArray(plan.features) && plan.features.length > 0 && (
                  <div className="text-success small mt-2">
                    <strong>Key Features:</strong>
                    <ul className="mb-0 list-unstyled">
                      {plan.features.map((feature, idx) => (
                        <li key={idx}>✔ {feature}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </Col>

            {/* Right: Select Button */}
            <Col md={3} className="text-center">
              <Button
                variant="primary"
                size="lg"
                className="w-100 mt-2"
                onClick={() => handleSelect(plan.planId)}
              >
                Select Plan
              </Button>
            </Col>
          </Row>
        </Card>
      ))}
    </div>
  );
};

export default HealthQuote;