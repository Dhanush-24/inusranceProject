import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Button, Card, Row, Col, Alert, Spinner } from "react-bootstrap";
import axios from "axios";

const CarQuote = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const plansData = location.state?.plans?.data;
  const carNumber = location.state?.carNumber;

  const [message, setMessage] = React.useState(null);
  const [loadingPlanId, setLoadingPlanId] = React.useState(null);

  if (!Array.isArray(plansData) || !carNumber) {
    return (
      <div className="container mt-5">
        <h4>No valid plans or car number found. Check data:</h4>
        <pre>{JSON.stringify(location.state, null, 2)}</pre>
      </div>
    );
  }

  const handleSelectPolicy = async (planId) => {
    setLoadingPlanId(planId);
    setMessage(null);
    try {
      const response = await axios.post(`${process.env.REACT_APP_API_BASE_URL}/api/car/selectplan`, {
        carNumber,
        planId,
      });

      setMessage({
        type: "success",
        text: response.data.message || "Policy selected successfully.",
      });

      // Optional: Navigate to success page or dashboard
      // navigate("/user-dashboard");
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
    <div className="container mt-5">
      <h2 className="text-center mb-4">Available Car Insurance Plans</h2>

      {message && (
        <Alert variant={message.type} onClose={() => setMessage(null)} dismissible>
          {message.text}
        </Alert>
      )}

      {plansData.map((plan) => (
        <Card className="mb-4 p-3 shadow" key={plan.planId}>
          <Row className="align-items-center">
            <Col md={3} className="text-center">
              <img
                src={plan.logoUrl}
                alt="Logo"
                style={{ maxHeight: "100px", objectFit: "contain" }}
              />
            </Col>
            <Col md={6}>
              <h5>{plan.policyName}</h5>
              <p><strong>Insurer:</strong> {plan.insurerName}</p>
              <p><strong>IDV Value:</strong> ₹{plan.idvValue}</p>
              <p><strong>Premium:</strong> ₹{plan.premiumAmount}</p>
              <p><strong>Claim Ratio:</strong> {plan.claimSettlementRatio}</p>
              <p><strong>Cashless Garages:</strong> {plan.cashlessGarages}</p>
              <p><strong>Special Benefits:</strong></p>
              <ul>
                {plan.specialBenefits.map((benefit, idx) => (
                  <li key={idx}>{benefit}</li>
                ))}
              </ul>
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
    </div>
  );
};

export default CarQuote;
