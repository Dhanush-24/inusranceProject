import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';

const GuaranteedInsuranceCard = () => {
  const [showStep, setShowStep] = useState(0);
  const [formData, setFormData] = useState({ name: '', mobile: '' });
  const [plans, setPlans] = useState([]);
  const [selectedPlanId, setSelectedPlanId] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPlans = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/api/guarented-policy/plans`);
        setPlans(response.data.plans || []);
      } catch (err) {
        console.error('Error fetching plans:', err);
      }
    };
    fetchPlans();
  }, []);

  const handleSelectPlan = async (planId) => {
    setSelectedPlanId(planId); // Store selected plan ID
    setShowStep(1); // Show the user info modal
  };

  const handlePlanSubmit = async () => {
    if (!selectedPlanId || !formData.name || !formData.mobile) {
      alert('Please fill in all the details.');
      return;
    }

    try {
      // Send the user's details along with the selected plan ID
      await axios.post(`${process.env.REACT_APP_API_BASE_URL}/api/guarented-policy/create`, formData);

      // Navigate to the Guaranteed Quote page with user and plan details
      navigate('/guaranteed-quote', {
        state: {
          plans,
          user: formData,
          selectedPlanId: selectedPlanId, // Pass the selected plan ID as part of state
        },
      });
    } catch (err) {
      console.error('Error submitting details:', err);
      alert('Failed to submit details.');
    }
  };

  return (
    <>
      <Navbar />

      <div className="container py-5">
        {/* Intro */}
        <div className="row align-items-center mb-5">
          <div className="col-md-8">
            <h2>Buy Guaranteed Insurance Plans and Policies Online</h2>
            <p>
              A guaranteed insurance policy provides protection against various risks while guaranteeing a fixed return over a set period of time.
              It helps ensure financial stability for the insured individual or their family, even in the face of unexpected events.
            </p>
          </div>
          <div className="col-md-4 text-center">
            <div className="card shadow-lg p-4 border-0" style={{ backgroundColor: '#e0f7fa', borderRadius: '20px' }}>
              <Button variant="primary" size="lg" onClick={() => setShowStep(1)}>
                Get Guaranteed Insurance
              </Button>
            </div>
          </div>
        </div>

        {/* Plans Section */}
        <h3 className="mb-4">Top Guaranteed Insurance Plans</h3>
        <div className="bg-light p-3 rounded">
          {plans.length > 0 ? (
            plans.map((plan) => (
              <div
                key={plan.planId}
                className="bg-white rounded shadow-sm p-4 mb-4"
                style={{ borderLeft: '5px solid #0d6efd' }}
              >
                <div className="d-flex flex-wrap align-items-start justify-content-between gap-3">
                  {/* Logo & Details */}
                  <div className="d-flex align-items-start" style={{ minWidth: '250px', flex: 2 }}>
                    {plan.logoUrl && (
                      <img
                        src={plan.logoUrl}
                        alt={`${plan.Company} logo`}
                        style={{ width: '60px', height: '60px', objectFit: 'contain', marginRight: '20px' }}
                      />
                    )}
                    <div>
                      <h5 className="mb-1">{plan.Company} - {plan.PlanName}</h5>
                      <div className="text-muted small">
                        <div>Policy Term: {plan.PolicyTerm} yrs | Payment Term: {plan.PremiumPaymentTerm} yrs</div>
                        {plan.MonthlyIncomeAfterPremiumTerm && (
                          <div>Monthly Income: ₹{plan.MonthlyIncomeAfterPremiumTerm} for {plan.MonthlyIncomeDuration}</div>
                        )}
                        <div>Maturity Benefit: ₹{plan.MaturityBenefit} | Life Cover: ₹{plan.LifeCover}</div>
                      </div>
                    </div>
                  </div>

                  {/* Premium */}
                  <div className="text-center" style={{ minWidth: '150px', flex: 1 }}>
                    <p className="mb-1 text-muted">Starting From</p>
                    <h4 className="text-primary">₹{plan.PremiumPerYear}</h4>
                  </div>

                  {/* CTA Button */}
                  <div className="text-end" style={{ minWidth: '160px' }}>
                    <button
                      className="btn btn-danger btn-lg w-100"
                      onClick={() => handleSelectPlan(plan.planId)}
                    >
                      Check Prices
                    </button>
                  </div>
                </div>

                {/* Key Features */}
                {plan.Features?.length > 0 && (
                  <div className="w-100 mt-3 pt-3 border-top">
                    <strong className="text-success me-2">Key Features:</strong>
                    {plan.Features.map((feature, idx) => (
                      <span
                        key={idx}
                        className="badge bg-light text-success border me-2 mb-2"
                        style={{ fontSize: '0.875rem' }}
                      >
                        ✓ {feature}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            ))
          ) : (
            <p>No plans available. Please try again later.</p>
          )}
        </div>
      </div>

      {/* Modal for User Info */}
      <Modal show={showStep === 1} onHide={() => setShowStep(0)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Basic Info</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <input
            placeholder="Name"
            className="form-control mb-2"
            value={formData.name}
            onChange={e => setFormData({ ...formData, name: e.target.value })}
          />
          <input
            placeholder="Mobile"
            className="form-control"
            value={formData.mobile}
            onChange={e => setFormData({ ...formData, mobile: e.target.value })}
          />
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={handlePlanSubmit}>Next</Button>
        </Modal.Footer>
      </Modal>

      <Footer />
    </>
  );
};

export default GuaranteedInsuranceCard;
