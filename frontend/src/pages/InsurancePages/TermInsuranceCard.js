import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';

const TermInsuranceCard = () => {
  const [showStep, setShowStep] = useState(0);
  const [formData, setFormData] = useState({
    name: '',
    mobile: '',
    pincode: '',
    district: '',
  });
  const [plans, setPlans] = useState([]);
  const navigate = useNavigate();

  // Fetch top term insurance plans
  useEffect(() => {
    const fetchPlans = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/api/term/plans`);
        setPlans(response.data.data); // Store the fetched plans in the state
      } catch (err) {
        console.error('Error fetching term plans:', err);
      }
    };
    fetchPlans();
  }, []);

  const handleNext = async () => {
    if (showStep === 2) {
      try {
        // Step 1: Create the term policy
        await axios.post(`${process.env.REACT_APP_API_BASE_URL}/api/term/create`, formData);

        // Step 2: Navigate with data
        navigate('/term-quote', { state: { formData, plans } });
      } catch (err) {
        console.error(err);
        alert('Failed to submit details or fetch plans.');
      }
    } else {
      setShowStep(showStep + 1);
    }
  };

  return (
    <>
      <Navbar />
      <div className="container py-5">
        {/* Intro */}
        <div className="row align-items-center mb-5">
          <div className="col-md-8">
            <h2>Buy Term Insurance Plans and Policies</h2>
            <p>
              Term insurance provides a safety net for your loved ones in case of an unfortunate event. Get a plan that suits your financial needs.
            </p>
          </div>
          <div className="col-md-4 text-center">
            <div className="card shadow-lg p-4 border-0" style={{ backgroundColor: '#e0f7fa', borderRadius: '20px' }}>
              <Button variant="primary" size="lg" onClick={() => setShowStep(1)}>
                Get Term Plan
              </Button>
            </div>
          </div>
        </div>

        {/* Display Top Term Insurance Plans */}
        <h3 className="mb-4">Top Term Insurance Plans</h3>
        <div className="bg-light p-3 rounded">
          {plans.length > 0 ? (
            plans.map((plan) => (
              <div
                key={plan.planId}
                className="bg-white rounded shadow-sm p-4 mb-4"
                style={{ borderLeft: '5px solid #0d6efd' }}
              >
                <div className="d-flex flex-wrap align-items-start justify-content-between gap-3">
                  {/* Plan Logo & Details */}
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
                        <div>Life Cover: {plan.lifeCover || 'N/A'}</div>
                        <div>Insurance Term: {plan.insuranceTerm || 'N/A'}</div>
                      </div>
                    </div>
                  </div>

                  {/* Premium & CTA */}
                  <div className="text-center" style={{ minWidth: '150px', flex: 1 }}>
                    <p className="mb-1 text-muted">Starting From</p>
                    <h4 className="text-primary">₹{plan.premiumAmount}</h4>
                  </div>
                  <div className="text-end" style={{ minWidth: '160px' }}>
                    <button className="btn btn-danger btn-lg w-100" onClick={() => setShowStep(1)}>
                      Select Plan
                    </button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <p>No plans available. Please try again later.</p>
          )}
        </div>
      </div>

      {/* Step 1: User details modal */}
      <Modal show={showStep === 1} onHide={() => setShowStep(0)} centered>
        <Modal.Header closeButton><Modal.Title>Enter Your Details</Modal.Title></Modal.Header>
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
          <Button onClick={handleNext}>Next</Button>
        </Modal.Footer>
      </Modal>

      {/* Step 2: Location details modal */}
      <Modal show={showStep === 2} onHide={() => setShowStep(0)} centered>
        <Modal.Header closeButton><Modal.Title>Location Details</Modal.Title></Modal.Header>
        <Modal.Body>
          <input
            placeholder="Pincode"
            className="form-control mb-2"
            value={formData.pincode}
            onChange={e => setFormData({ ...formData, pincode: e.target.value })}
          />
          <input
            placeholder="District"
            className="form-control"
            value={formData.district}
            onChange={e => setFormData({ ...formData, district: e.target.value })}
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

export default TermInsuranceCard;
