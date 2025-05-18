import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import Button from 'react-bootstrap/Button';

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
            <div key={plan._id} className="border p-3 mb-4 rounded shadow-sm">
              <div className="row align-items-center">
                {plan.logoUrl && (
                  <div className="col-md-3 text-center">
                    <img
                      src={plan.logoUrl}
                      alt="Logo"
                      style={{ width: '120px', height: '120px', objectFit: 'contain' }}
                      className="mb-3 mb-md-0"
                    />
                  </div>
                )}
                <div className="col-md-9">
                  <h5>{plan.company} - {plan.planName}</h5>
                  <p><strong>Premium:</strong> ₹{plan.premium}</p>
                  <p><strong>Returns:</strong> ₹{plan.returnAmount} ({plan.returnPercentage}%)</p>
                  <ul>
                    {plan.otherBenefits?.lifeCover && <li>Life Cover Included</li>}
                    {plan.otherBenefits?.taxSaving && <li>Tax Saving Under 80C</li>}
                  </ul>
                  <Button variant="success" className="mt-2" onClick={() => handleSelectPlan(plan._id)}>
                    Select This Plan
                  </Button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
      <Footer />
    </>
  );
};

export default InvestmentQuote;
