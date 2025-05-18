import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';

const InvestmentInsuranceCard = () => {
  const [showStep, setShowStep] = useState(0);
  const [formData, setFormData] = useState({
    name: '',
    mobile: '',
    pincode: '',
    district: '',
  });
  const [investmentPlans, setInvestmentPlans] = useState([]);
  const [selectedPlanId, setSelectedPlanId] = useState(null);
  const navigate = useNavigate();

  // Fetch top investment policies
  useEffect(() => {
    axios
      .get(`${process.env.REACT_APP_API_BASE_URL}/api/investmentPolicy/plans`)
      .then((res) => {
        if (res.data && Array.isArray(res.data.data)) {
          setInvestmentPlans(res.data.data);
        }
      })
      .catch((err) => {
        console.error('Error fetching investment plans:', err);
      });
  }, []);

  const handleSelectPlan = (planId) => {
    setSelectedPlanId(planId); // Store selected plan ID
    setShowStep(1); // Show user info modal
  };

  const handleNext = async () => {
    if (showStep === 2) {
      try {
        await axios.post(`${process.env.REACT_APP_API_BASE_URL}/api/investmentPolicy/create`, formData);
        navigate('/investment-quote', { state: { formData, selectedPlanId } });
      } catch (err) {
        console.error(err);
        alert('Failed to submit details.');
      }
    } else {
      setShowStep(showStep + 1);
    }
  };

  return (
    <>
      <Navbar />
      <div className="container py-5">
        {/* Intro Section */}
        <div className="row align-items-center mb-5">
          <div className="col-md-8">
            <h2>Invest Smartly With Top Investment Insurance Plans</h2>
            <p>
              Investment plans help you grow your money with added benefits of life cover. Choose from market-linked or risk-free options and get the best returns over time.
            </p>
            <ul>
              <li>💰 Returns up to 12%* annually</li>
              <li>🏢 25+ trusted insurers</li>
              <li>📈 Market-linked and fixed-return plans available</li>
              <li>🛁 Tax benefits under 80C & 10(10D)</li>
            </ul>
          </div>
          <div className="col-md-4 text-center">
            <div className="card shadow-lg p-4 border-0" style={{ backgroundColor: '#e0f7fa', borderRadius: '20px' }}>
              <Button variant="primary" size="lg" onClick={() => setShowStep(1)}>
                Get Investment Plan
              </Button>
            </div>
          </div>
        </div>

        {/* Display Investment Plans */}
        <h3 className="mb-4">Top Investment Plans</h3>
        <div className="bg-light p-3 rounded">
          {investmentPlans.length > 0 ? (
            investmentPlans.map((plan) => (
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
                        alt={`${plan.company} logo`}
                        style={{ width: '60px', height: '60px', objectFit: 'contain', marginRight: '20px' }}
                      />
                    )}
                    <div>
                      <h5 className="mb-1">{plan.planName}</h5>
                      <div className="text-muted small">
                        <div>Company: {plan.company}</div>
                        <div>Life Cover: {plan.otherBenefits.lifeCover}</div>
                        <div>Tax Saving: {plan.otherBenefits.taxSaving}</div>
                      </div>
                    </div>
                  </div>

                  {/* Premium & CTA Button */}
                  <div className="text-center" style={{ minWidth: '150px', flex: 1 }}>
                    <p className="mb-1 text-muted">Starting From</p>
                    <h4 className="text-primary">{plan.premium}</h4>
                    <Button variant="danger" size="lg" onClick={() => handleSelectPlan(plan.planId)}>
                      Select Plan
                    </Button>
                  </div>
                </div>
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
          <Modal.Title>Enter Your Details</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <input
            placeholder="Name"
            className="form-control mb-2"
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          />
          <input
            placeholder="Mobile"
            className="form-control"
            onChange={(e) => setFormData({ ...formData, mobile: e.target.value })}
          />
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={handleNext}>Next</Button>
        </Modal.Footer>
      </Modal>

      {/* Modal for Location Info */}
      <Modal show={showStep === 2} onHide={() => setShowStep(0)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Location Details</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <input
            placeholder="Pincode"
            className="form-control mb-2"
            onChange={(e) => setFormData({ ...formData, pincode: e.target.value })}
          />
          <input
            placeholder="District"
            className="form-control"
            onChange={(e) => setFormData({ ...formData, district: e.target.value })}
          />
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={handleNext}>View Plans</Button>
        </Modal.Footer>
      </Modal>

      <Footer />
    </>
  );
};

export default InvestmentInsuranceCard;
