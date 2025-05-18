import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useLocation, useNavigate } from 'react-router-dom';

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

      {plans.map(plan => (
        <div key={plan.planId} className="card p-3 mb-4 shadow-sm">
          <div className="d-flex align-items-center">
            {plan.logoUrl && (
              <img 
                src={plan.logoUrl} 
                alt="Logo" 
                style={{ maxWidth: '100px', marginRight: '40px' }} 
              />
            )}
            <div>
              <h5>{plan.company} - {plan.plan}</h5>
              <p><strong>Sum Insured:</strong> ₹{plan.sumInsured}</p>
              <p><strong>Premium:</strong> ₹{plan.premiumAmount}</p>
              <p><strong>Features:</strong></p>
              <ul>
                {plan.features.map((feature, index) => (
                  <li key={index}>{feature}</li>
                ))}
              </ul>
              <button 
                className="btn btn-primary mt-3" 
                onClick={() => handleSelect(plan.planId)}
              >
                Select Plan
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default HealthQuote;
