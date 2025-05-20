import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import { Row, Col, Card, Button } from 'react-bootstrap';

const InvestmentQuote = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const formData = location.state?.formData;
  const [plans, setPlans] = useState([]);

  useEffect(() => {
    const fetchPlans = async () => {
      try {
        const res = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/api/investmentPolicy/plans`);
        setPlans(res.data.data);
      } catch (err) {
        console.error('Error fetching plans:', err);
      }
    };

    if (!formData) {
      navigate('/');
    } else {
      fetchPlans();
    }
  }, [formData, navigate]);

  const handleSelectPlan = async (planId) => {
    try {
      await axios.post(`${process.env.REACT_APP_API_BASE_URL}/api/investmentPolicy/selectPlan`, {
        ...formData,
        planId,
      });
      alert('Plan selected successfully!');
      navigate('/user-dashboard');
    } catch (err) {
      console.error(err);
      alert('Failed to select plan.');
    }
  };

  return (
    <>
      <Navbar />
      <div className="container py-5">
        <h3 className="mb-4">Choose the Best Investment Plan</h3>
        {plans.length === 0 ? (
          <p>No plans available at the moment.</p>
        ) : (
          plans.map((plan) => (
            <Card className="mb-4 p-3 shadow" key={plan._id}>
              <Row className="align-items-center">
                {/* Logo and Summary */}
                <Col md={3} className="text-center">
                  {plan.logoUrl && (
                    <img
                      src={plan.logoUrl}
                      alt="Logo"
                      style={{ maxHeight: '100px', objectFit: 'contain' }}
                    />
                  )}

                </Col>

                {/* Plan Details */}
                <Col md={6}>
                  <h5 className="mb-2">{plan.company} - {plan.planName}</h5>
                    <div><strong>Premium:</strong> {plan.premium}</div>
                    <div><strong>Returns:</strong> {plan.returnAmount} ({plan.returnPercentage}%)</div>
                  {plan.description && <p style={{ fontSize: '0.9rem', color: '#666' }}>{plan.description}</p>}
                  <div style={{ fontSize: '0.9rem', color: '#555' }}>
                    {plan.otherBenefits && (
                      <div className="text-success small mt-2">
                        <strong>Benefits:</strong>
                        <ul className="mb-0 list-unstyled">
                          {plan.otherBenefits.lifeCover && <li>✔ Life Cover Included</li>}
                          {plan.otherBenefits.taxSaving && <li>✔ Tax Saving Under 80C</li>}
                        </ul>
                      </div>
                    )}
                  </div>
                </Col>

                {/* CTA Button */}
                <Col md={3} className="text-center">
                  <Button
                    variant="success"
                    size="lg"
                    className="w-100 mt-2"
                    onClick={() => handleSelectPlan(plan._id)}
                  >
                    Select Plan
                  </Button>
                </Col>
              </Row>
            </Card>
          ))
        )}
      </div>
      <Footer />
    </>
  );
};

export default InvestmentQuote;
