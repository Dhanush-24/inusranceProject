import React, { useState, useEffect } from "react";
import { Button, Form, Card, Modal, Row, Col, Spinner } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";

// 🚲 Bike Brand & Model with Estimated Prices
const bikeData = {
  Hero: { Splendor: 70000, Passion: 75000, Glamour: 80000, HFDeluxe: 65000 },
  Honda: { Activa: 80000, Shine: 85000, Unicorn: 95000, Dio: 75000 },
  Bajaj: { Pulsar: 100000, Platina: 60000, Avenger: 110000, CT100: 55000 },
  TVS: { Apache: 105000, Jupiter: 85000, Radeon: 70000, Sport: 60000 },
  Yamaha: { FZ: 110000, R15: 150000, Fascino: 90000, RayZR: 88000 },
  Suzuki: { Access: 85000, Gixxer: 115000, Burgman: 95000, Hayate: 70000 },
  RoyalEnfield: { Classic350: 180000, Bullet350: 170000, Meteor350: 190000 },
  KTM: { Duke200: 210000, Duke250: 230000, RC390: 310000 },
};

const BikeInsuranceCard = () => {
  const [formData, setFormData] = useState({
    bikeNumber: "",
    bikeBrand: "",
    bikeModel: "",
    fuelType: "",
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
  if (!formData.bikeNumber.trim()) {
    alert("Enter bike number");
    return;
  }

  // Save bike number to localStorage
  localStorage.setItem("bikeNumber", formData.bikeNumber.trim());

  setFormStep(2);
};


  const submitBikeDetails = async () => {
    const { bikeNumber, bikeBrand, bikeModel, registrationYear, registrationCity, fuelType } = formData;
    if (!bikeBrand || !bikeModel || !registrationYear || !registrationCity || !fuelType) {
      alert("Fill all bike details");
      return;
    }

    const price = bikeData[bikeBrand]?.[bikeModel] || null;

    try {
      await axios.post(`${process.env.REACT_APP_API_BASE_URL}/api/bike/details`, {
        bikeNumber,
        bikeBrand,
        bikeModel,
        fuelType,
        registrationYear,
        registrationCity,
        price,
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
    if (!fullName.trim() || !mobileNumber.trim()) {
      alert("Enter name and mobile");
      return;
    }

    try {
      setLoading(true);
      await axios.post(`${process.env.REACT_APP_API_BASE_URL}/api/bike/userInfo`, {
        fullName,
        mobileNumber,
        bikeNumber,
      });
      navigate(
        `/bike-quote?bikeBrand=${formData.bikeBrand}&bikeModel=${formData.bikeModel}&registrationYear=${formData.registrationYear}`,
        {
          state: {
            bikeNumber,
            selectedPlan,
            plans,
            bikeBrand: formData.bikeBrand,
            bikeModel: formData.bikeModel,
            registrationYear: formData.registrationYear,
          },
        }
      );
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
        <Card className="p-4 shadow border-0" style={{ borderRadius: "16px" }}>
          <Row className="align-items-center justify-content-center flex-md-row-reverse">
            <Col md={3} className="text-center mb-3 mb-md-0">
              <img
                src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRs7JbeYYR5yLfYu3vPejDFgCo1u3uJFLq6Sw&s"
                alt="Bike"
                style={{ maxWidth: "100%", maxHeight: "130px" }}
              />
            </Col>
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

        <h3 className="mt-5 mb-4 fw-bold text-center">Top Bike Insurance Plans</h3>

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
                      <div className="d-flex flex-column gap-1 text-muted small">
                        <div>
                          <strong>Coverage:</strong> {plan.coverage}
                        </div>
                        <div>
                          <strong>Plan Type:</strong> {plan.planType}
                        </div>
                        <div>
                          <strong>Claim Ratio:</strong> {plan.claimRatio || "N/A"}
                        </div>
                      </div>
                    </Col>
                    <Col md={3} className="text-md-end text-center">
                      <h5 className="text-danger fw-bold mb-2">Premium: ₹{plan.annualPremium}</h5>
                      <Button variant="danger" className="w-100 mt-2" onClick={() => startFlow(plan)}>
                        Check Prices
                      </Button>
                    </Col>
                  </Row>
                </Card>
              </Col>
            ))}
        </Row>
      </div>

      {/* 🔄 Modals */}
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
              <Form.Select
                name="bikeBrand"
                value={formData.bikeBrand}
                onChange={(e) => {
                  handleChange(e);
                  setFormData((prev) => ({ ...prev, bikeModel: "" }));
                }}
              >
                <option value="">Select Brand</option>
                {Object.keys(bikeData).map((brand) => (
                  <option key={brand} value={brand}>
                    {brand}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>

            <Form.Group className="mb-2">
              <Form.Label>Model</Form.Label>
              <Form.Select
                name="bikeModel"
                value={formData.bikeModel}
                onChange={handleChange}
                disabled={!formData.bikeBrand}
              >
                <option value="">Select Model</option>
                {formData.bikeBrand &&
                  Object.keys(bikeData[formData.bikeBrand]).map((model) => (
                    <option key={model} value={model}>
                      {model}
                    </option>
                  ))}
              </Form.Select>
            </Form.Group>

            <Form.Group className="mb-2">
              <Form.Label>Fuel Type</Form.Label>
              <Form.Select name="fuelType" value={formData.fuelType} onChange={handleChange}>
                <option value="">Select Fuel Type</option>
                <option value="Petrol">Petrol</option>
                <option value="Diesel">Diesel</option>
                <option value="Electric">Electric</option>
              </Form.Select>
            </Form.Group>

            <Form.Group className="mb-2">
              <Form.Label>Registration Year</Form.Label>
              <Form.Control
                type="number"
                min="2000"
                max={new Date().getFullYear()}
                name="registrationYear"
                value={formData.registrationYear}
                onChange={handleChange}
                placeholder="e.g. 2018"
              />
            </Form.Group>

            <Form.Group className="mb-2">
              <Form.Label>Registration City</Form.Label>
              <Form.Control
                name="registrationCity"
                value={formData.registrationCity}
                onChange={handleChange}
                placeholder="e.g. Mumbai"
              />
            </Form.Group>

            <Button className="w-100 mt-3" onClick={submitBikeDetails}>
              Submit Bike Details
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
            <Form.Group className="mb-2">
              <Form.Label>Full Name</Form.Label>
              <Form.Control
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                placeholder="Your full name"
              />
            </Form.Group>

            <Form.Group className="mb-2">
              <Form.Label>Mobile Number</Form.Label>
              <Form.Control
                name="mobileNumber"
                value={formData.mobileNumber}
                onChange={handleChange}
                placeholder="10-digit mobile number"
              />
            </Form.Group>

            <Button type="submit" className="w-100 mt-3" disabled={loading}>
              {loading ? <Spinner animation="border" size="sm" /> : "Get Quotes"}
            </Button>
          </Form>
        </Modal.Body>
      </Modal>

      <Footer />
    </>
  );
};

export default BikeInsuranceCard;
