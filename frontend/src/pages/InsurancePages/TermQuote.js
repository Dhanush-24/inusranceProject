import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';

const TermQuote = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { formData, plans } = location.state || {};

  const handleSelectPlan = async (plan) => {
    try {
      const payload = {
        name: formData.name,
        mobile: formData.mobile,
        planId: plan.PlanId, // Ensure PlanId matches backend schema
      };

      const response = await axios.post(`${process.env.REACT_APP_API_BASE_URL}/api/term/select`, payload);
      alert('Plan selected successfully!');
    //   navigate(`/user-dashboard/${formData.mobile}`);
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
          <div key={index} className="card mb-4 p-4 shadow-lg">
            <div className="d-flex align-items-center">
              {/* Left Image Section */}
              <div style={{ flex: '0 0 150px', marginRight: '30px' }}>
                <img
                  src={plan.logoUrl || 'https://via.placeholder.com/150'}
                  alt={plan.planName}
                  style={{
                    width: '100%',
                    height: 'auto',
                    maxHeight: '120px',
                    objectFit: 'contain',
                  }}
                />
              </div>

              {/* Right Content Section */}
              <div style={{ flex: '1' }}>
                <h4 className="text-primary">{plan.planName}</h4>
                <p><strong>Insurer:</strong> {plan.insurer}</p>
                <p><strong>Life Cover:</strong> {plan.lifeCover}</p>
                <p><strong>Term:</strong> {plan.insuranceTerm}</p>
                <p><strong>Premium:</strong> {plan.premiumAmount}</p>
                <p><strong>Claim Settlement Ratio:</strong> {plan.claimSettlementRatio}</p>

                <ul>
                  {Array.isArray(plan.keyFeatures) &&
                    plan.keyFeatures.map((feature, i) => (
                      <li key={i}>{feature}</li>
                    ))}
                </ul>

                <button
                  className="btn btn-primary mt-3"
                  onClick={() => handleSelectPlan(plan)}
                >
                  Select Plan
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
      <Footer />
    </>
  );
};

export default TermQuote;
