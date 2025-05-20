import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import { Row, Col, Card, Button } from 'react-bootstrap';

const TermQuote = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { formData, plans } = location.state || {};

  const handleSelectPlan = async (plan) => {
    try {
      const payload = {
        name: formData.name,
        mobile: formData.mobile,
        planId: plan.PlanId,
      };

      await axios.post(`${process.env.REACT_APP_API_BASE_URL}/api/term/select`, payload);
      alert('Plan selected successfully!');
      // navigate(`/user-dashboard/${formData.mobile}`);
    } catch (error) {
      console.error('Error selecting plan:', error);
      alert('Failed to select plan.');
    }
  };

  if (!plans || !Array.isArray(plans) || plans.length === 0) {
    return <p className="text-center mt-5">No plans available.</p>;
  }

  return (
    <>
      <Navbar />
      <div className="container my-5">
        <h2 className="mb-4">Available Term Insurance Plans</h2>
        {plans.map((plan, index) => (
          <Card className="mb-4 p-3 shadow" key={index}>
            <Row className="align-items-center">
              {/* Left: Logo and Price */}
              <Col md={3} className="text-center">
                <img
                  src={plan.logoUrl || 'https://via.placeholder.com/150'}
                  alt={plan.planName}
                  style={{ maxHeight: '100px', objectFit: 'contain' }}
                />

              </Col>

              {/* Middle: Plan Info */}
              <Col md={6}>
                <h5 className="mb-2">{plan.insurer} - {plan.planName}</h5>
                  <div><strong>Life Cover:</strong> {plan.lifeCover}</div>
                  <div><strong>Premium:</strong> ₹{plan.premiumAmount}</div>
                  <div><strong>Term:</strong> {plan.insuranceTerm}</div>
                <div style={{ fontSize: '0.9rem', color: '#555' }}>
                  <div><strong>Claim Settlement Ratio:</strong> {plan.claimSettlementRatio}</div>
                  {Array.isArray(plan.keyFeatures) && plan.keyFeatures.length > 0 && (
                    <div className="text-success small mt-2">
                      <strong>Key Features:</strong>
                      <ul className="mb-0 list-unstyled">
                        {plan.keyFeatures.map((feature, i) => (
                          <li key={i}>✔ {feature}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </Col>

              {/* Right: Button */}
              <Col md={3} className="text-center">
                <Button
                  variant="primary"
                  size="lg"
                  className="w-100 mt-2"
                  onClick={() => handleSelectPlan(plan)}
                >
                  Select Plan
                </Button>
              </Col>
            </Row>
          </Card>
        ))}
      </div>
      <Footer />
    </>
  );
};

export default TermQuote;
