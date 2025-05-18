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
    setLoadingPlanId(planId);
    setMessage(null);
    try {
      const response = await axios.post(`${process.env.REACT_APP_API_BASE_URL}/api/bike/selectplan`, {
        bikeNumber,
        planId,
      });

      setMessage({
        type: "success",
        text: response.data.message || "Policy selected successfully.",
      });

      // ❌ Remove navigation unless you want to redirect to user dashboard
    //   navigate("/user-dashboard", { state: { bikeNumber } });
      console.log(planId)

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
    <div className="container mt-5">
      <Navbar />
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
            <Col md={3} className="text-center">
              <img
                src={plan.logoUrl}
                alt="Logo"
                style={{ maxHeight: "100px", objectFit: "contain" }}
              />
            </Col>
            <Col md={6}>
              <h5>{plan.planName}</h5>
              <p><strong>Provider:</strong> {plan.provider}</p>
              <p><strong>Coverage:</strong> {plan.coverage}</p>
              <p><strong>Premium:</strong> ₹{plan.annualPremium}</p>
              <p><strong>Eligibility:</strong> {plan.eligibility}</p>
              {Array.isArray(plan.specialBenefits) && (
                <>
                  <p><strong>Special Benefits:</strong></p>
                  <ul>
                    {plan.specialBenefits.map((benefit, idx) => (
                      <li key={idx}>{benefit}</li>
                    ))}
                  </ul>
                </>
              )}
            </Col>
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
      ))}
      <Footer />
    </div>
  );
};

export default BikeQuote;
