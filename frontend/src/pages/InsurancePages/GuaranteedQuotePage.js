import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Button from 'react-bootstrap/Button';
import Navbar from '../../components/Navbar';  // Fixed typo in 'componenets'
import Footer from '../../components/Footer';  // Fixed typo in 'componenets'
import axios from 'axios';

const GuaranteedQuotePage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { plans = [], user = {} } = location.state || {};

  const handleSelectPlan = async (planId) => {
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
    }
  };

  return (
    <>
      <Navbar />
      <div className="container py-5">
        <h2>Choose a Guaranteed Insurance Plan</h2>
        {plans.length > 0 ? (
          plans.map((plan) => (
            <div key={plan.planId} className="border p-3 mb-4 rounded shadow-sm">
              <div className="d-flex align-items-center">
                {/* Image Section with more margin and padding */}
                <div className="me-5">
                  {plan.logoUrl ? (
                    <img
                      src={plan.logoUrl}
                      alt={`${plan.Company} logo`}
                      style={{ width: '150px', height: 'auto', objectFit: 'contain' }}
                      onError={(e) => {
                        e.target.style.display = 'none';  // Hide image if error
                        console.log('Error loading image for', plan.Company);  // Debugging
                      }}
                    />
                  ) : (
                    <p>No logo available</p>
                  )}
                </div>
                {/* Details Section */}
                <div>
                  <h5>{plan.Company} - {plan.PlanName}</h5>
                  <p><strong>Premium:</strong> ₹{plan.PremiumPerYear}</p>
                  <p><strong>Policy Term:</strong> {plan.PolicyTerm}</p>
                  <p><strong>Premium Payment Term:</strong> {plan.PremiumPaymentTerm}</p>
                  {plan.MonthlyIncomeAfterPremiumTerm && (
                    <p><strong>Monthly Income:</strong> ₹{plan.MonthlyIncomeAfterPremiumTerm} for {plan.MonthlyIncomeDuration}</p>
                  )}
                  <p><strong>Maturity Benefit:</strong> ₹{plan.MaturityBenefit}</p>
                  <p><strong>Life Cover:</strong> ₹{plan.LifeCover}</p>
                  <ul>
                    {plan.Features?.map((feature, idx) => (
                      <li key={idx}>{feature}</li>
                    ))}
                  </ul>
                  <Button variant="success" className="mt-3" onClick={() => handleSelectPlan(plan.planId)}>
                    Select This Plan
                  </Button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <p>No plans available. Please try again later.</p>
        )}
      </div>
      <Footer />
    </>
  );
};

export default GuaranteedQuotePage;
