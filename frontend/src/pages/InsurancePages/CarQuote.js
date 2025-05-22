import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  Container,
  Row,
  Col,
  Card,
  Spinner,
  Alert,
  Button,
} from "react-bootstrap";
import axios from "axios";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";

const CarQuote = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [calculatedIDV, setCalculatedIDV] = useState(null);
  const [error, setError] = useState(null);
  const [carNumber, setCarNumber] = useState(null);
  const [message, setMessage] = useState(null);
  const [loadingPlanId, setLoadingPlanId] = useState(null);

  const queryParams = new URLSearchParams(location.search);
  const carBrand = queryParams.get("carBrand");
  const carModel = queryParams.get("carModel");
  const registrationYear = queryParams.get("registrationYear");

  useEffect(() => {
    const storedCarNumber = localStorage.getItem("carNumber");
    if (storedCarNumber) {
      setCarNumber(storedCarNumber);
    }

    const fetchPlans = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_API_BASE_URL}/api/car/plans-near-idv`,
          {
            params: {
              carBrand,
              carModel,
              registrationYear,
            },
          }
        );

        if (response.data.success) {
          setPlans(response.data.plans);
          setCalculatedIDV(response.data.calculatedIDV);
          setError(null);
        } else {
          setError(response.data.message || "Failed to fetch plans.");
          setPlans([]);
          setCalculatedIDV(null);
        }
      } catch (err) {
        console.error("Error fetching plans:", err);
        setError("Server error. Please try again.");
        setPlans([]);
        setCalculatedIDV(null);
      } finally {
        setLoading(false);
      }
    };

    if (carBrand && carModel && registrationYear) {
      fetchPlans();
    } else {
      setError("Missing car details in URL parameters.");
      setLoading(false);
    }
  }, [carBrand, carModel, registrationYear]);

  const handleSelectPolicy = async (planId) => {
    const storedCarNumber = localStorage.getItem("carNumber");
    console.log("Stored car number from localStorage:", storedCarNumber);

    if (!storedCarNumber) {
      setMessage({ type: "danger", text: "Car number not found." });
      return;
    }

    try {
      setLoadingPlanId(planId);
      setMessage(null);

      const response = await axios.post(
        `${process.env.REACT_APP_API_BASE_URL}/api/car/selectplan`,
        {
          carNumber: storedCarNumber,
          planId,
        }
      );

      setMessage({
        type: "success",
        text: response.data.message || "Policy selected successfully.",
      });

    } catch (error) {
      console.error("Error selecting policy:", error);
      setMessage({
        type: "danger",
        text:
          error.response?.data?.message ||
          "Something went wrong while selecting the policy.",
      });
    } finally {
      setLoadingPlanId(null);
    }
  };

  return (
    <>
      <Navbar />
      <Container className="mt-5">
        <h2 className="mb-3 text-center">Car Insurance Plans </h2>

        {calculatedIDV && (
          <Alert variant="info">
            Estimated IDV based on your car: ₹{calculatedIDV.toLocaleString()}
          </Alert>
        )}
        {error && <Alert variant="danger">{error}</Alert>}
        {message && (
          <Alert
            variant={message.type}
            dismissible
            onClose={() => setMessage(null)}
          >
            {message.text}
          </Alert>
        )}

        {loading ? (
          <div className="text-center my-5">
            <Spinner animation="border" />
            <p>Loading plans...</p>
          </div>
        ) : plans.length === 0 ? (
          <Alert variant="warning">
            No plans found near your car's IDV.
          </Alert>
        ) : (
          plans.map((plan) => (
            <Card className="mb-4 p-3 shadow" key={plan.planId || plan._id}>
              <Row className="align-items-center">
                {/* Image */}
                <Col md={3} className="text-center">
                  <img
                    src={plan.logoUrl}
                    alt={plan.company}
                    style={{
                      maxHeight: "100px",
                      objectFit: "contain",
                    }}
                  />
                </Col>

                {/* Info */}
                <Col md={6}>
                  <h5 className="mb-2">{plan.policyName}</h5>
                  <div
                    className="d-flex flex-column gap-1"
                    style={{ fontSize: "0.9rem", color: "#555" }}
                  >
                    <div>
                      <strong>Provider:</strong> {plan.insurerName || "N/A"}
                    </div>
                    <div>
                      <strong>Premium:</strong> ₹
                      {plan.premiumAmount?.toLocaleString() || "N/A"}
                    </div>
                    <div>
                      <strong>IDV:</strong> ₹
                      {plan.idvValue?.toLocaleString() || "N/A"}
                    </div>
                  </div>

                  {Array.isArray(plan.specialBenefits) &&
                    plan.specialBenefits.length > 0 && (
                      <div className="text-success small mt-2">
                        <strong>Benefits:</strong>
                        <ul className="mb-0 list-unstyled">
                          {plan.specialBenefits.map((benefit, idx) => (
                            <li key={idx}>✔ {benefit}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                </Col>

                {/* Select Button */}
                <Col md={3} className="text-center">
                  <Button
                    variant="primary"
                    size="lg"
                    className="w-100 mt-2"
                    onClick={() => handleSelectPolicy(plan.planId)}
                    disabled={loadingPlanId === plan.planId}
                  >
                    {loadingPlanId === plan.planId ? (
                      <>
                        <Spinner animation="border" size="sm" className="me-2" />
                        Selecting...
                      </>
                    ) : (
                      "Select Policy"
                    )}
                  </Button>
                </Col>
              </Row>
            </Card>
          ))
        )}
      </Container>
      <Footer />
    </>
  );
};

export default CarQuote;
