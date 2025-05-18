import React, { useState, useEffect } from "react";
import { Button, Form, Card, Modal, Row, Col } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";

const CarInsuranceCard = () => {
  const [formData, setFormData] = useState({
    carNumber: "",
    carBrand: "",
    carModel: "",
    fuelType: "",
    variant: "",
    registrationYear: "",
    registrationCity: "",
    fullName: "",
    mobileNumber: "",
  });

  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(false);
  const [formStep, setFormStep] = useState(0); // 0 = none, 1 = car number, 2 = car details, 3 = user info
  const [selectedPlan, setSelectedPlan] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPlans = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/api/car/plans`);
        setPlans(Array.isArray(response.data.data) ? response.data.data : []);
      } catch (error) {
        console.error("Failed to fetch car insurance plans:", error);
      }
    };
    fetchPlans();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const startFlow = (plan) => {
    setSelectedPlan(plan);
    setFormStep(1); // Start with car number
  };

  const submitCarNumber = () => {
    if (!formData.carNumber) {
      alert("Please enter your car number.");
      return;
    }
    setFormStep(2); // Proceed to car details
  };

  const submitCarDetails = async () => {
    const {
      carNumber,
      carBrand,
      carModel,
      fuelType,
      variant,
      registrationYear,
      registrationCity,
    } = formData;

    if (!carBrand || !carModel || !fuelType || !variant || !registrationYear || !registrationCity) {
      alert("Please fill in all car details.");
      return;
    }

    try {
      await axios.post(`${process.env.REACT_APP_API_BASE_URL}/api/car/details`, {
        carNumber,
        carBrand,
        carModel,
        fuelType,
        variant,
        registrationYear,
        registrationCity,
      });

      setFormStep(3); // Proceed to user info
    } catch (err) {
      console.error("Error submitting car details:", err);
      alert("Failed to submit car details.");
    }
  };

  const handleUserInfoSubmit = async (e) => {
    e.preventDefault();

    const { fullName, mobileNumber, carNumber } = formData;

    if (!fullName || !mobileNumber) {
      alert("Please fill in your name and mobile number.");
      return;
    }

    try {
      setLoading(true);
      await axios.post(`${process.env.REACT_APP_API_BASE_URL}/api/car/user-info`, {
        fullName,
        mobileNumber,
        carNumber,
      });

      navigate("/car-quote", {
        state: {
          plans,
          carNumber,
          selectedPlan,
        },
      });
    } catch (err) {
      console.error("Error submitting user info:", err);
      alert("Failed to submit user info.");
    } finally {
      setLoading(false);
      setFormStep(0);
    }
  };

  return (
    <>
      <Navbar />

      <div className="container py-5">
        <Card className="p-4 shadow-lg border-0">
          <Row className="align-items-center">
            <Col md={8}>
              <h4 className="mb-3">
                Car insurance starting from <span className="text-primary">₹6/day*</span>
              </h4>
              <p className="mt-2 text-muted" style={{ fontSize: "0.9rem" }}>
                Enter your car number and select a plan to get started.
              </p>
              {/* Car Number Field and Next Button */}
              <Row className="mt-3">
                <Col md={8}>
                  <Form.Group>
                    <Form.Control
                      name="carNumber"
                      placeholder="Your car number (e.g., DL-12-AB-2345)"
                      value={formData.carNumber}
                      onChange={handleChange}
                      style={{ width: "100%" }}
                    />
                  </Form.Group>
                </Col>
              </Row>

              {/* "Next" button below the input field */}
              <Row className="mt-3">
                <Col md={8}>
                  <Button variant="primary" className="w-100" onClick={submitCarNumber}>
                    Next
                  </Button>
                </Col>
              </Row>
            </Col>

            <Col md={4} className="text-center">
              <img
                src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSbTZzLPn6ibsm6hRexFJbbXw5YKdPhQWLPpA&s"
                alt="Car"
                className="img-fluid"
                style={{ maxHeight: "180px", objectFit: "contain" }}
              />
            </Col>
          </Row>
        </Card>
      </div>

      <div className="container mt-4">
        <h3>Top Car Insurance Plans</h3>
        <div className="row">
          {plans.length > 0 ? (
            plans.map((plan, index) => (
              <div className="col-md-12 mb-4" key={plan.planId || plan._id || index}>
                <Card className="shadow-sm p-3 border-0" style={{ backgroundColor: "#f5faff" }}>
                  <Row className="align-items-center">
                    <Col md={2} className="text-center">
                      <img
                        src={plan.logoUrl}
                        alt={plan.insurerName}
                        style={{ width: "80px", height: "50px", objectFit: "contain" }}
                      />
                    </Col>
                    <Col md={7}>
                      <h5 className="mb-1">{plan.insurerName}</h5>
                      <p className="mb-1"><strong>Cashless Garages:</strong> {plan.cashlessGarages}</p>
                      <p className="mb-1"><strong>Claims Settled:</strong> {plan.claimSettlementRatio}</p>
                      <p className="mb-1"><strong>Coverage:</strong> Unlimited</p>
                      {Array.isArray(plan.specialBenefits) && plan.specialBenefits.length > 0 && (
                        <div className="text-success small mt-2">
                          <strong>Key Features:</strong>
                          <ul className="mb-0 list-unstyled">
                            {plan.specialBenefits.map((benefit, idx) => (
                              <li key={idx}>✔ {benefit}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </Col>
                    <Col md={3} className="text-center">
                      <p className="mb-2"><strong>Starting From ₹{plan.premiumAmount}</strong></p>
                      <Button variant="danger" className="w-100" onClick={() => startFlow(plan)}>
                        Select Policy
                      </Button>
                    </Col>
                  </Row>
                </Card>
              </div>
            ))
          ) : (
            <p className="text-muted">Fetching plans, please wait...</p>
          )}
        </div>
      </div>

      {/* Step 1 - Car Number */}
      <Modal show={formStep === 1} onHide={() => setFormStep(0)} centered>
        <Modal.Header closeButton><Modal.Title>Enter Car Number</Modal.Title></Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group>
              <Form.Control
                name="carNumber"
                placeholder="Your car number (e.g., DL-12-AB-2345)"
                value={formData.carNumber}
                onChange={handleChange}
              />
            </Form.Group>
            <Button variant="primary" className="mt-3" onClick={submitCarNumber}>Next</Button>
          </Form>
        </Modal.Body>
      </Modal>

      {/* Step 2 - Car Details */}
      <Modal show={formStep === 2} onHide={() => setFormStep(0)} centered>
        <Modal.Header closeButton><Modal.Title>Enter Car Details</Modal.Title></Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group><Form.Label>Car Brand</Form.Label><Form.Control name="carBrand" value={formData.carBrand} onChange={handleChange} /></Form.Group>
            <Form.Group><Form.Label>Car Model</Form.Label><Form.Control name="carModel" value={formData.carModel} onChange={handleChange} /></Form.Group>
            <Form.Group><Form.Label>Fuel Type</Form.Label><Form.Control name="fuelType" value={formData.fuelType} onChange={handleChange} /></Form.Group>
            <Form.Group><Form.Label>Variant</Form.Label><Form.Control name="variant" value={formData.variant} onChange={handleChange} /></Form.Group>
            <Form.Group><Form.Label>Registration Year</Form.Label><Form.Control name="registrationYear" value={formData.registrationYear} onChange={handleChange} /></Form.Group>
            <Form.Group><Form.Label>Registration City</Form.Label><Form.Control name="registrationCity" value={formData.registrationCity} onChange={handleChange} /></Form.Group>
            <Button variant="primary" className="mt-3" onClick={submitCarDetails}>Next</Button>
          </Form>
        </Modal.Body>
      </Modal>

      {/* Step 3 - User Info */}
      <Modal show={formStep === 3} onHide={() => setFormStep(0)} centered>
        <Modal.Header closeButton><Modal.Title>Enter Your Info</Modal.Title></Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleUserInfoSubmit}>
            <Form.Group><Form.Label>Full Name</Form.Label><Form.Control name="fullName" value={formData.fullName} onChange={handleChange} required /></Form.Group>
            <Form.Group><Form.Label>Mobile Number</Form.Label><Form.Control name="mobileNumber" value={formData.mobileNumber} onChange={handleChange} required /></Form.Group>
            <Button variant="success" type="submit" className="mt-3" disabled={loading}>
              {loading ? "Submitting..." : "Submit & View Plans"}
            </Button>
          </Form>
        </Modal.Body>
      </Modal>

      <Footer />
    </>
  );
};

export default CarInsuranceCard;
