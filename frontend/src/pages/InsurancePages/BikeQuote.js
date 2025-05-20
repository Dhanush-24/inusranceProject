import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Button, Card, Row, Col, Alert, Spinner } from "react-bootstrap";
import axios from "axios";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";

const BikeQuote = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const initialPlans = location.state?.plans || [];
  const initialBikeNumber = location.state?.bikeNumber;

  const [plans, setPlans] = useState(initialPlans);
  const [bikeNumber, setBikeNumber] = useState(initialBikeNumber);
  const [message, setMessage] = useState(null);
  const [loadingPlanId, setLoadingPlanId] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if ((!plans || plans.length === 0) && bikeNumber) {
      const fetchPlans = async () => {
        try {
          setLoading(true);
          const res = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/api/bike/plans`, {
            params: { bikeNumber },
          });

          if (res.data && res.data.success) {
            setPlans(res.data.data);
          } else {
            setMessage({
              type: "danger",
              text: "No plans found for this bike number.",
            });
          }
        } catch (err) {
          console.error("Failed to fetch plans:", err);
          setMessage({
            type: "danger",
            text: "Failed to load plans. Please try again.",
          });
        } finally {
          setLoading(false);
        }
      };

      fetchPlans();
    }
  }, [plans, bikeNumber]);

  const handleSelectPolicy = async (planId) => {
    if (!bikeNumber || !planId) {
      setMessage({
        type: "danger",
        text: "Missing bike number or plan ID.",
      });
      return;
    }

    setLoadingPlanId(planId);
    setMessage(null);

    console.log("Selecting plan with:", { bikeNumber, planId });

    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API_BASE_URL}/api/bike/selectplan`,
        { bikeNumber, planId },
        {
          headers: {
            "Content-Type": "application/json",
            // Authorization: `Bearer ${yourTokenIfRequired}`, // Uncomment if needed
          },
        }
      );

      setMessage({
        type: "success",
        text: response.data.message || "Policy selected successfully.",
      });

      // Optional: Navigate to another page
      // navigate("/user-dashboard", { state: { bikeNumber } });

    } catch (error) {
      console.error("Error selecting policy:", {
        message: error.message,
        status: error.response?.status,
        data: error.response?.data,
      });

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

  if (!bikeNumber) {
    return (
      <div className="container mt-5">
        <h4>No bike number found in navigation state.</h4>
        <p>Please go back and start the bike insurance process again.</p>
        <Button variant="primary" onClick={() => navigate("/")}>
          Go Home
        </Button>
      </div>
    );
  }

  return (
    <>
      <Navbar />
      <div className="container mt-5">
        <h2 className="text-center mb-4">Available Bike Insurance Plans</h2>

        {message && (
          <Alert variant={message.type} onClose={() => setMessage(null)} dismissible>
            {message.text}
          </Alert>
        )}

        {loading && (
          <div className="text-center my-5">
            <Spinner animation="border" variant="primary" />
            <p>Loading plans...</p>
          </div>
        )}

        {!loading && plans.length === 0 && (
          <Alert variant="warning">No plans available for your bike.</Alert>
        )}

        {plans.map((plan) => (
        <Card className="mb-4 p-3 shadow" key={plan.planId || plan._id}>
          <Row className="align-items-center">
            {/* Image on left */}
            <Col md={3} className="text-center">
              <img
                src={plan.logoUrl}
                alt="Logo"
                style={{ maxHeight: "100px", objectFit: "contain" }}
              />
            </Col>

            {/* Middle column with info */}
            <Col md={6}>
              <h5 className="mb-2">{plan.planName || plan.insurerName}</h5>

              <div
                className="d-flex flex-column gap-1"
                style={{ fontSize: "0.9rem", color: "#555" }}
              >
                <div><strong>Provider:</strong> {plan.provider || "N/A"}</div>
                <div><strong>Coverage:</strong> {plan.coverage || "N/A"}</div>
                <div><strong>Eligibility:</strong> {plan.eligibility || "N/A"}</div>
              </div>

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

            {/* Right column with premium and button */}
            <Col md={3} className="text-center">
              <p className="mb-2">
                <strong>Starting From ₹{plan.annualPremium || plan.premiumAmount}</strong>
              </p>

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


        ))}
      </div>
      <Footer />
    </>
  );
};

export default BikeQuote;
