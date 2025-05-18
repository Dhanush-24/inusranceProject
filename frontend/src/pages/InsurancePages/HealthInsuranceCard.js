import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';

const HealthInsuranceCard = () => {
  const [showStep, setShowStep] = useState(0);
  const [formData, setFormData] = useState({
    name: '',
    mobile: '',
    insureFor: '',
    pincode: '',
    district: '',
    healthIssues: [],
  });
  const [newIssue, setNewIssue] = useState('');
  const [topPlans, setTopPlans] = useState([]);
  const navigate = useNavigate();

  // Fetch Top Health Plans
  useEffect(() => {
    axios
      .get(`${process.env.REACT_APP_API_BASE_URL}/api/health/plans`)
      .then((res) => {
        if (res.data && Array.isArray(res.data.data)) {
          setTopPlans(res.data.data);
        }
      })
      .catch((err) => {
        console.error('Error fetching top health plans:', err);
      });
  }, []);

  const handleNext = async () => {
    if (showStep === 1 && (!formData.name || !formData.mobile)) {
      alert('Please enter name and mobile.');
      return;
    }
    if (showStep === 2 && (!formData.insureFor || !formData.pincode || !formData.district)) {
      alert('Please complete all location fields.');
      return;
    }
    if (showStep === 3) {
      try {
        await axios.post(`${process.env.REACT_APP_API_BASE_URL}/api/health/create`, formData);
        navigate('/health-quote', { state: { userDetails: formData } });
      } catch (err) {
        console.error(err);
        alert('Failed to submit details.');
      }
    } else {
      setShowStep(showStep + 1);
    }
  };

  const handleIssueAdd = () => {
    if (newIssue.trim()) {
      setFormData({
        ...formData,
        healthIssues: [...formData.healthIssues, newIssue.trim()],
      });
      setNewIssue('');
    }
  };

  return (
    <>
      <Navbar />
      <div className="container py-5">
        {/* Header Section */}
        <div className="row align-items-center mb-5">
          <div className="col-md-8">
            <h2>Buy Health Insurance Plans and Policies Online</h2>
            <p>
              A health insurance policy covers your medical expenses like hospitalisation, ambulance, medicine costs, etc.
              It also helps you save taxes under Section 80D of the Income Tax Act.
            </p>
            <ul className="list-unstyled">
              <li className="mb-3 d-flex align-items-start">
                <img src="https://staticimg.insurancedekho.com/strapi/Group_1000004038_797ae83ff3.svg" className="me-2" style={{ width: '30px' }} alt="" />
                <span><strong>134 Plans from 22 Companies</strong></span>
              </li>
              <li className="mb-3 d-flex align-items-start">
                <img src="https://staticimg.insurancedekho.com/strapi/Group_1000004103_ce3239a13d.svg" className="me-2" style={{ width: '30px' }} alt="" />
                <span><strong>Free expert advice:</strong> Pick the best plan</span>
              </li>
            </ul>
          </div>

          {/* CTA Card */}
          <div className="col-md-4 text-center">
            <div className="card shadow-lg p-4 border-0" style={{ backgroundColor: '#e0f7fa', borderRadius: '20px' }}>
              <p className="mb-2 fw-semibold text-success">🎉 Online Discount up to 25% off*</p>
              <p className="mb-2">🏥 Plans from ₹10/day*</p>
              <Button variant="primary" size="lg" onClick={() => setShowStep(1)}>
                Get Health Insurance
              </Button>
            </div>
          </div>
        </div>

        {/* Top Health Plans Section */}
        {topPlans.length > 0 && (
          <div className="mt-5">
            <h4 className="mb-4">Top Health Insurance Plans</h4>
            <div className="bg-light p-3 rounded">
              {topPlans.map((plan) => (
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
                        <h5 className="mb-1">{plan.company} - {plan.plan}</h5>
                        <div className="text-muted small">
                          <div>Sum Insured: ₹{plan.sumInsured}</div>
                          <div>Premium: ₹{plan.premiumAmount}</div>
                        </div>
                      </div>
                    </div>

                    {/* Premium */}
                    <div className="text-center" style={{ minWidth: '150px', flex: 1 }}>
                      <p className="mb-1 text-muted">Starting From</p>
                      <h4 className="text-primary">{plan.premiumAmount}</h4>
                    </div>

                    {/* CTA Button */}
                    <div className="text-end" style={{ minWidth: '160px' }}>
                      <button
                        className="btn btn-danger btn-lg w-100"
                        onClick={() => setShowStep(1)} // Trigger modal flow
                      >
                        Select Plan
                      </button>
                    </div>
                  </div>

                  {/* Features */}
                  {plan.features?.length > 0 && (
                    <div className="w-100 mt-3 pt-3 border-top">
                      <strong className="text-success me-2">Key Features:</strong>
                      {plan.features.map((feature, idx) => (
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
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Modal 1: Basic Info */}
      <Modal show={showStep === 1} onHide={() => setShowStep(0)} centered>
        <Modal.Header closeButton><Modal.Title>Basic Info</Modal.Title></Modal.Header>
        <Modal.Body>
          <input placeholder="Name" className="form-control mb-2" onChange={e => setFormData({ ...formData, name: e.target.value })} />
          <input placeholder="Mobile" className="form-control" onChange={e => setFormData({ ...formData, mobile: e.target.value })} />
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={handleNext}>Next</Button>
        </Modal.Footer>
      </Modal>

      {/* Modal 2: Location */}
      <Modal show={showStep === 2} onHide={() => setShowStep(0)} centered>
        <Modal.Header closeButton><Modal.Title>Location & Coverage</Modal.Title></Modal.Header>
        <Modal.Body>
          <input placeholder="Insure For (Self, Family...)" className="form-control mb-2" onChange={e => setFormData({ ...formData, insureFor: e.target.value })} />
          <input placeholder="Pincode" className="form-control mb-2" onChange={e => setFormData({ ...formData, pincode: e.target.value })} />
          <input placeholder="District" className="form-control" onChange={e => setFormData({ ...formData, district: e.target.value })} />
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={handleNext}>Next</Button>
        </Modal.Footer>
      </Modal>

      {/* Modal 3: Health Issues */}
      <Modal show={showStep === 3} onHide={() => setShowStep(0)} centered>
        <Modal.Header closeButton><Modal.Title>Health Conditions</Modal.Title></Modal.Header>
        <Modal.Body>
          <input
            placeholder="Add Health Issue"
            value={newIssue}
            onChange={e => setNewIssue(e.target.value)}
            className="form-control mb-2"
          />
          <Button size="sm" onClick={handleIssueAdd}>Add</Button>
          <ul className="mt-2">
            {formData.healthIssues.map((issue, i) => <li key={i}>{issue}</li>)}
          </ul>
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={handleNext}>View Plans</Button>
        </Modal.Footer>
      </Modal>

      <Footer />
    </>
  );
};

export default HealthInsuranceCard;
