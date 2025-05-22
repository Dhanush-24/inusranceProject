import React, { useState, useEffect } from "react";
import { Button, Form, Card, Modal, Row, Col } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";

const brandModels = {
  Toyota: ["Corolla", "Camry", "Prius", "RAV4", "Fortuner"],
  Honda: ["Civic", "Accord", "CR-V", "City", "Jazz"],
  Ford: ["Figo", "EcoSport", "Mustang", "Endeavour", "Aspire"],
  Hyundai: ["i10", "i20", "Creta", "Verna", "Elantra"],
  Chevrolet: ["Spark", "Beat", "Cruze", "Captiva", "Trailblazer"],
  Nissan: ["Micra", "Altima", "Sentra", "Juke", "Rogue"],
  Volkswagen: ["Polo", "Vento", "Passat", "Tiguan", "Golf"],
  BMW: ["3 Series", "5 Series", "X1", "X3", "X5"],
  "Mercedes-Benz": ["A-Class", "C-Class", "E-Class", "GLA", "GLE"],
  Audi: ["A3", "A4", "Q3", "Q5", "Q7"],
  Kia: ["Seltos", "Sonet", "Carnival", "Sportage", "Rio"],
  Mazda: ["Mazda3", "CX-3", "CX-5", "Mazda6", "MX-5"],
};

const CarInsuranceCard = () => {
  const [formData, setFormData] = useState({
    carNumber: "",
    carBrand: "",
    carModel: "",
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
  const [carNumberError, setCarNumberError] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    const fetchPlans = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_API_BASE_URL}/api/car/plans`
        );
        setPlans(Array.isArray(response.data.data) ? response.data.data : []);
      } catch (error) {
        console.error("Failed to fetch car insurance plans:", error);
      }
    };
    fetchPlans();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "carBrand") {
      setFormData((prev) => ({
        ...prev,
        carBrand: value,
        carModel: "",
      }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const startFlow = (plan) => {
    setSelectedPlan(plan);
    setFormStep(1);
  };

const submitCarNumber = () => {
  const { carNumber } = formData;
  const carNumberPattern = /^[A-Z]{2}-\d{2}-[A-Z]{2}-\d{4}$/;
  const formatted = carNumber.trim().toUpperCase();
  if (!carNumber || !carNumberPattern.test(formatted)) {
    setCarNumberError("Invalid format: XX-00-XX-0000 (e.g., DL-12-AB-2345)");
    return;
  }
  setCarNumberError("");
  localStorage.setItem("carNumber", formatted); // 🔥 Add this line
  setFormData((prev) => ({ ...prev, carNumber: formatted }));
  setFormStep(2);
};

  const submitCarDetails = async () => {
    const {
      carNumber,
      carBrand,
      carModel,
      fuelType,
      registrationYear,
      registrationCity,
    } = formData;

    if (!carBrand || !carModel || !fuelType || !registrationYear || !registrationCity) {
      alert("Please fill in all car details.");
      return;
    }

    try {
      await axios.post(`${process.env.REACT_APP_API_BASE_URL}/api/car/details`, {
        carNumber,
        carBrand,
        carModel,
        fuelType,
        registrationYear,
        registrationCity,
      });

      setFormStep(3);
    } catch (err) {
      console.error("Error submitting car details:", err);
      alert("Failed to submit car details.");
    }
  };

  const handleUserInfoSubmit = async (e) => {
    e.preventDefault();
    const { fullName, mobileNumber, carNumber, carBrand, carModel, registrationYear } = formData;

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

      navigate(`/car-quote?carBrand=${carBrand}&carModel=${carModel}&registrationYear=${registrationYear}`, {
        state: {
          plans,
          carNumber,
          selectedPlan,
          carBrand,
          carModel,
          registrationYear,
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
                Car insurance starting from{" "}
                <span className="text-primary">₹6/day*</span>
              </h4>
              <p className="mt-2 text-muted" style={{ fontSize: "0.9rem" }}>
                Enter your car number and select a plan to get started.
              </p>

              {/* Car Number Input */}
              <Row className="mt-3">
                <Col md={8}>
                  <Form.Group>
                    <Form.Control
                      name="carNumber"
                      placeholder="Your car number (e.g., DL-12-AB-2345)"
                      value={formData.carNumber}
                      onChange={(e) => {
                        handleChange(e);
                        setCarNumberError("");
                      }}
                      style={{ width: "100%" }}
                    />
                    {carNumberError && (
                      <div
                        className="text-danger mt-1"
                        style={{ fontSize: "0.85rem" }}
                      >
                        {carNumberError}
                      </div>
                    )}
                  </Form.Group>
                </Col>
              </Row>

              {/* Next Button */}
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

      {/* Insurance Plans */}
      <div className="container mt-4">
        <h3>Top Car Insurance Plans</h3>
        <div className="row">
          {plans.length > 0 ? (
            plans.map((plan, index) => (
              <div
                className="col-md-12 mb-4"
                key={plan.planId || plan._id || index}
              >
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
                      <h5 className="mb-2">{plan.insurerName}</h5>
                      <Row className="mb-2" style={{ fontSize: "0.9rem", color: "#555" }}>
                        <Col xs={4}>
                          <strong>Garages:</strong> {plan.cashlessGarages}
                        </Col>
                        <Col xs={4}>
                          <strong>Claims:</strong> {plan.claimSettlementRatio}
                        </Col>
                        <Col xs={4}>
                          <strong>IDV Value:</strong> {plan.idvValue}
                        </Col>
                      </Row>
                      {Array.isArray(plan.specialBenefits) &&
                        plan.specialBenefits.length > 0 && (
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
                      <p className="mb-2">
                        <strong>Starting From ₹{plan.premiumAmount}</strong>
                      </p>
                      <Button variant="danger" className="w-100" onClick={() => startFlow(plan)}>
                        Select Policy
                      </Button>
                    </Col>
                  </Row>
                </Card>
              </div>
            ))
          ) : (
            <p>No plans available currently.</p>
          )}
        </div>
      </div>

      {/* Modal for car details and user info */}
      <Modal
        show={formStep === 2 || formStep === 3}
        onHide={() => setFormStep(0)}
        size="lg"
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>{formStep === 2 ? "Car Details" : "User Information"}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {formStep === 2 && (
            <Form>
              <Row className="mb-3">
                <Col md={6}>
                  <Form.Group controlId="carBrand">
                    <Form.Label>Car Brand</Form.Label>
                    <Form.Select
                      name="carBrand"
                      value={formData.carBrand}
                      onChange={handleChange}
                    >
                      <option value="">Select Brand</option>
                      {Object.keys(brandModels).map((brand) => (
                        <option key={brand} value={brand}>
                          {brand}
                        </option>
                      ))}
                    </Form.Select>
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group controlId="carModel">
                    <Form.Label>Car Model</Form.Label>
                    <Form.Select
                      name="carModel"
                      value={formData.carModel}
                      onChange={handleChange}
                      disabled={!formData.carBrand}
                    >
                      <option value="">Select Model</option>
                      {formData.carBrand &&
                        brandModels[formData.carBrand].map((model) => (
                          <option key={model} value={model}>
                            {model}
                          </option>
                        ))}
                    </Form.Select>
                  </Form.Group>
                </Col>
              </Row>

              <Row className="mb-3">
                <Col md={6}>
                  <Form.Group controlId="fuelType">
                    <Form.Label>Fuel Type</Form.Label>
                    <Form.Select
                      name="fuelType"
                      value={formData.fuelType}
                      onChange={handleChange}
                    >
                      <option value="">Select Fuel Type</option>
                      <option value="Petrol">Petrol</option>
                      <option value="Diesel">Diesel</option>
                      <option value="Electric">Electric</option>
                      <option value="Hybrid">Hybrid</option>
                    </Form.Select>
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group controlId="registrationYear">
                    <Form.Label>Registration Year</Form.Label>
                    <Form.Control
                      type="number"
                      min="1990"
                      max={new Date().getFullYear()}
                      name="registrationYear"
                      value={formData.registrationYear}
                      onChange={handleChange}
                      placeholder="e.g., 2015"
                    />
                  </Form.Group>
                </Col>

              </Row>

              <Row className="mb-3">

                <Col md={6}>
                  <Form.Group controlId="registrationCity">
                    <Form.Label>Registration City</Form.Label>
                    <Form.Control
                      type="text"
                      name="registrationCity"
                      value={formData.registrationCity}
                      onChange={handleChange}
                      placeholder="Enter city"
                    />
                  </Form.Group>
                </Col>
              </Row>

              <Button variant="primary" onClick={submitCarDetails}>
                Next
              </Button>
            </Form>
          )}

          {formStep === 3 && (
            <Form onSubmit={handleUserInfoSubmit}>
              <Form.Group controlId="fullName" className="mb-3">
                <Form.Label>Full Name</Form.Label>
                <Form.Control
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  placeholder="Enter your full name"
                />
              </Form.Group>

              <Form.Group controlId="mobileNumber" className="mb-3">
                <Form.Label>Mobile Number</Form.Label>
                <Form.Control
                  type="tel"
                  name="mobileNumber"
                  value={formData.mobileNumber}
                  onChange={handleChange}
                  placeholder="Enter your mobile number"
                />
              </Form.Group>

              <Button variant="success" type="submit" disabled={loading}>
                {loading ? "Submitting..." : "Submit"}
              </Button>
            </Form>
          )}
        </Modal.Body>
      </Modal>

      <Footer />
    </>
  );
};

export default CarInsuranceCard;
