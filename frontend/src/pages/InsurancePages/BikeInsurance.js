import React, { useState, useEffect } from "react";
import { Button, Form, Card, Modal, Row, Col, Spinner } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";

const BikeInsuranceCard = () => {
  const [formData, setFormData] = useState({
    bikeNumber: "",
    bikeBrand: "",
    bikeModel: "",
    registrationYear: "",
    registrationCity: "",
    fullName: "",
    mobileNumber: "",
  });

  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(false);
  const [formStep, setFormStep] = useState(0);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPlans = async () => {
      try {
        const res = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/api/bike/plans`);
        setPlans(Array.isArray(res.data.data) ? res.data.data : []);
      } catch (err) {
        console.error("Error fetching plans:", err);
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
    setFormStep(1);
  };

  const submitBikeNumber = () => {
    if (!formData.bikeNumber) return alert("Enter bike number");
    setFormStep(2);
  };

  const submitBikeDetails = async () => {
    const { bikeNumber, bikeBrand, bikeModel, registrationYear, registrationCity } = formData;
    if (!bikeBrand || !bikeModel || !registrationYear || !registrationCity) {
      return alert("Fill all bike details");
    }
    try {
      await axios.post(`${process.env.REACT_APP_API_BASE_URL}/api/bike/details`, {
        bikeNumber, bikeBrand, bikeModel, registrationYear, registrationCity,
      });
      setFormStep(3);
    } catch (err) {
      console.error("Bike detail submit error:", err);
      alert("Failed to submit bike details");
    }
  };

  const handleUserInfoSubmit = async (e) => {
    e.preventDefault();
    const { fullName, mobileNumber, bikeNumber } = formData;
    if (!fullName || !mobileNumber) return alert("Enter name and mobile");

    try {
      setLoading(true);
      await axios.post(`${process.env.REACT_APP_API_BASE_URL}/api/bike/userInfo`, {
        fullName, mobileNumber, bikeNumber,
      });
      navigate("/bike-quote", {
        state: { plans, bikeNumber, selectedPlan },
      });
    } catch (err) {
      console.error("User info submit error:", err);
      alert("Failed to submit user info");
    } finally {
      setLoading(false);
      setFormStep(0);
    }
  };

  return (
    <>
      <Navbar />
      <div className="container py-5">

        {/* 🚀 Bike Number Section - Image on Right */}
        <Card className="p-4 shadow border-0" style={{ borderRadius: "16px" }}>
          <Row className="align-items-center justify-content-center flex-md-row-reverse">
            {/* 📷 Right side image */}
            <Col md={3} className="text-center mb-3 mb-md-0">
              <img
                src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRs7JbeYYR5yLfYu3vPejDFgCo1u3uJFLq6Sw&s"
                alt="Bike"
                style={{ maxWidth: "100%", maxHeight: "130px" }}
              />
            </Col>

            {/* 📝 Left side text and input */}
            <Col md={6}>
              <h5 className="fw-bold mb-3 text-center text-md-start">
                Bike insurance starting from <span className="text-primary">₹3/day*</span>
              </h5>
              <Form>
                <Form.Group className="mb-3">
                  <Form.Control
                    name="bikeNumber"
                    placeholder="Your bike number e.g. MH-12-1234"
                    value={formData.bikeNumber}
                    onChange={handleChange}
                    style={{ borderRadius: "8px" }}
                  />
                </Form.Group>
                <Button
                  variant="danger"
                  onClick={submitBikeNumber}
                  className="w-100 mb-2"
                  style={{ borderRadius: "8px" }}
                >
                  Continue
                </Button>
              </Form>
              <p className="text-muted mt-2" style={{ fontSize: "0.8rem" }}>
                By clicking, I agree to <a href="#">terms & conditions and privacy policy</a>.
              </p>
            </Col>
          </Row>
        </Card>

        {/* 📢 Section Heading */}
        <h3 className="mt-5 mb-4 fw-bold text-center">Top Bike Insurance Plans</h3>

        {/* 📦 Plans */}
        <Row>
          {plans.length > 0 &&
            plans.map((plan, index) => (
              <Col md={12} key={index} className="mb-4">
                <Card className="p-3 shadow-sm" style={{ borderRadius: "12px" }}>
                  <Row className="align-items-center">
                    <Col md={2} className="text-center">
                      <img
                        src={plan.logoUrl}
                        alt={plan.provider}
                        style={{ maxWidth: "100px", maxHeight: "60px" }}
                      />
                    </Col>
                    <Col md={7}>
                      <h5 className="mb-2 fw-bold">{plan.planName}</h5>
                      <p className="mb-1"><strong>Coverage:</strong> {plan.coverage}</p>
                      <p className="mb-1"><strong>Plan Type:</strong> {plan.planType}</p>
                      <p className="mb-0"><strong>Claim Ratio:</strong> {plan.claimRatio || "N/A"}</p>
                    </Col>
                    <Col md={3} className="text-end">
                      <h5 className="text-primary fw-bold mb-3">Premium:₹{plan.annualPremium}</h5>
                      <Button variant="danger" className="w-100" onClick={() => startFlow(plan)}>
                        Check Prices
                      </Button>
                    </Col>
                  </Row>
                </Card>
              </Col>
            ))}
        </Row>
      </div>

      {/* 🔄 Modals for Form Flow */}
      <Modal show={formStep === 1} onHide={() => setFormStep(0)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Enter Bike Number</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Group>
            <Form.Label>Bike Number</Form.Label>
            <Form.Control
              name="bikeNumber"
              placeholder="e.g. MH-12-1234"
              value={formData.bikeNumber}
              onChange={handleChange}
            />
          </Form.Group>
          <Button className="mt-3 w-100" onClick={submitBikeNumber}>
            Continue
          </Button>
        </Modal.Body>
      </Modal>

      <Modal show={formStep === 2} onHide={() => setFormStep(0)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Enter Bike Details</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-2">
              <Form.Label>Brand</Form.Label>
              <Form.Control
                name="bikeBrand"
                value={formData.bikeBrand}
                onChange={handleChange}
              />
            </Form.Group>
            <Form.Group className="mb-2">
              <Form.Label>Model</Form.Label>
              <Form.Control
                name="bikeModel"
                value={formData.bikeModel}
                onChange={handleChange}
              />
            </Form.Group>
            <Form.Group className="mb-2">
              <Form.Label>Registration Year</Form.Label>
              <Form.Control
                name="registrationYear"
                type="number"
                value={formData.registrationYear}
                onChange={handleChange}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>City</Form.Label>
              <Form.Control
                name="registrationCity"
                value={formData.registrationCity}
                onChange={handleChange}
              />
            </Form.Group>
            <Button variant="primary" onClick={submitBikeDetails} className="w-100">
              Continue
            </Button>
          </Form>
        </Modal.Body>
      </Modal>

      <Modal show={formStep === 3} onHide={() => setFormStep(0)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Enter Your Details</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleUserInfoSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Full Name</Form.Label>
              <Form.Control
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Mobile Number</Form.Label>
              <Form.Control
                name="mobileNumber"
                value={formData.mobileNumber}
                onChange={handleChange}
              />
            </Form.Group>
            <Button variant="primary" type="submit" className="w-100" disabled={loading}>
              {loading ? <Spinner animation="border" size="sm" /> : "Submit"}
            </Button>
          </Form>
        </Modal.Body>
      </Modal>

      <Footer />
    </>
  );
};

export default BikeInsuranceCard;
