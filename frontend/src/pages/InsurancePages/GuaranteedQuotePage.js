import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Card, Row, Col, Button, Spinner } from 'react-bootstrap';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import axios from 'axios';

const GuaranteedQuotePage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { plans = [], user = {} } = location.state || {};
  const [loadingPlanId, setLoadingPlanId] = useState(null);

  const handleSelectPlan = async (planId) => {
    setLoadingPlanId(planId);
    try {
      await axios.post(`${process.env.REACT_APP_API_BASE_URL}/api/guarented-policy/select`, {
        ...user,
        planId,
      });
      alert('Plan selected successfully!');
      navigate('/user-dashboard');
    } catch (err) {
      console.error('Error selecting plan:', err);
      alert('Failed to select plan.');
    } finally {
      setLoadingPlanId(null);
    }
  };

  return (
    <>
      <Navbar />
      <div className="container py-5">
        <h2 className="mb-4">Choose a Guaranteed Insurance Plan</h2>

        {plans.length > 0 ? (
          plans.map((plan) => (
            <Card className="mb-4 p-3 shadow" key={plan.planId || plan._id}>
              <Row className="align-items-center">
                {/* Logo */}
                <Col md={3} className="text-center">
                  {plan.logoUrl ? (
                    <img
                      src={plan.logoUrl}
                      alt={`${plan.Company} logo`}
                      style={{ maxHeight: '100px', objectFit: 'contain' }}
                      onError={(e) => {
                        e.target.style.display = 'none';
                        console.log('Error loading image for', plan.Company);
                      }}
                    />
                  ) : (
                    <div
                      style={{
                        maxHeight: '100px',
                        lineHeight: '100px',
                        backgroundColor: '#f0f0f0',
                        color: '#888',
                        fontSize: '0.85rem',
                      }}
                    >
                      No Logo Available
                    </div>
                  )}
                </Col>

                {/* Details */}
                <Col md={6}>
                  <h5 className="mb-2">{plan.Company} - {plan.PlanName}</h5>
                  <div
                    className="d-flex flex-column gap-1"
                    style={{ fontSize: '0.9rem', color: '#555' }}
                  >
                    <div><strong>Premium:</strong> ₹{plan.PremiumPerYear}</div>
                    <div><strong>Policy Term:</strong> {plan.PolicyTerm}</div>
                    <div><strong>Premium Payment Term:</strong> {plan.PremiumPaymentTerm}</div>
                    {plan.MonthlyIncomeAfterPremiumTerm && (
                      <div><strong>Monthly Income:</strong> ₹{plan.MonthlyIncomeAfterPremiumTerm} for {plan.MonthlyIncomeDuration}</div>
                    )}
                    <div><strong>Maturity Benefit:</strong> ₹{plan.MaturityBenefit}</div>
                    <div><strong>Life Cover:</strong> ₹{plan.LifeCover}</div>
                  </div>

                  {plan.Features?.length > 0 && (
                    <div className="text-success small mt-2">
                      <strong>Key Features:</strong>
                      <ul className="mb-0 list-unstyled">
                        {plan.Features.map((feature, idx) => (
                          <li key={idx}>✔ {feature}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </Col>

                {/* Button */}
                <Col md={3} className="text-center">
                  <p className="mb-2"><strong>Starting From ₹{plan.PremiumPerYear}</strong></p>
                  <Button
                    variant="primary"
                    size="lg"
                    className="w-100 mt-2"
                    onClick={() => handleSelectPlan(plan.planId)}
                    disabled={loadingPlanId === plan.planId}
                  >
                    {loadingPlanId === plan.planId ? (
                      <>
                        <Spinner animation="border" size="sm" className="me-2" />
                        Selecting...
                      </>
                    ) : (
                      "Select Plan"
                    )}
                  </Button>
                </Col>
              </Row>
            </Card>
          ))
        ) : (
          <p className="text-center">No plans available. Please try again later.</p>
        )}
      </div>
      <Footer />
    </>
  );
};

export default GuaranteedQuotePage;
