import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Button, Card, Row, Col, Alert, Spinner } from "react-bootstrap";
import axios from "axios";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";

const BikeQuote = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const queryParams = new URLSearchParams(location.search);
  const initialBrand = queryParams.get("bikeBrand");
  const initialModel = queryParams.get("bikeModel");
  const initialYear = queryParams.get("registrationYear");

  // Log the bike details parsed from URL to debug
  console.log("BikeQuote Params:", {
    bikeBrand: initialBrand,
    bikeModel: initialModel,
    registrationYear: initialYear,
  });

  const [plans, setPlans] = useState([]);
  const [bikeNumber, setBikeNumber] = useState(null);
  const [message, setMessage] = useState(null);
  const [loadingPlanId, setLoadingPlanId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [hasFetched, setHasFetched] = useState(false);

  useEffect(() => {
    const storedBikeNumber = localStorage.getItem("bikeNumber");
    if (storedBikeNumber) setBikeNumber(storedBikeNumber);

    if (initialBrand && initialModel && initialYear) {
      const fetchPlans = async () => {
        try {
          setLoading(true);
          setHasFetched(false);

          console.log("Fetching plans with:", {
            bikeBrand: initialBrand,
            bikeModel: initialModel,
            registrationYear: initialYear,
          });

          const res = await axios.get(
            `${process.env.REACT_APP_API_BASE_URL}/api/bike/plans-by-premium`,
            {
              params: {
                bikeBrand: initialBrand,
                bikeModel: initialModel,
                registrationYear: initialYear,
              },
            }
          );

          console.log("Response from backend:", res.data);

          if (res.data?.success && Array.isArray(res.data.plans)) {
            setPlans(res.data.plans);
          } else {
            setMessage({
              type: "danger",
              text: "No plans found for the provided bike details.",
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
          setHasFetched(true);
        }
      };

      fetchPlans();
    } else {
      setMessage({
        type: "danger",
        text: "Missing required bike details in the URL.",
      });
    }
  }, [initialBrand, initialModel, initialYear]);

  const handleSelectPolicy = async (planId) => {
    console.log("Selected planId:", planId);
    console.log("Stored bikeNumber:", bikeNumber);

    if (!bikeNumber || !planId) {
      setMessage({
        type: "danger",
        text: "Missing bike number or plan ID.",
      });
      return;
    }

    setLoadingPlanId(planId);
    setMessage(null);

    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API_BASE_URL}/api/bike/selectplan`,
        { bikeNumber, planId },
        {
          headers: {
            "Content-Type": "application/json",
          },
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
      <div className="container mt-5">
        <h2 className="text-center mb-4">Bike Insurance Plans</h2>

        {message && (
          <Alert
            variant={message.type}
            onClose={() => setMessage(null)}
            dismissible
          >
            {message.text}
          </Alert>
        )}

        {loading ? (
          <div className="text-center my-5">
            <Spinner animation="border" variant="primary" />
            <p>Loading plans...</p>
          </div>
        ) : !loading && hasFetched && plans.length === 0 ? (
          <Alert variant="warning">
            No plans found for your bike at the moment.
          </Alert>
        ) : (
          plans.map((plan, idx) => (
            <Card className="mb-4 p-3 shadow" key={plan?.planId || idx}>
              <Row className="align-items-center">
                <Col md={3} className="text-center">
                  <img
                    src={plan?.logoUrl}
                    alt="Logo"
                    style={{ maxHeight: "100px", objectFit: "contain" }}
                  />
                </Col>

                <Col md={6}>
                  <h5 className="mb-2">
                    {plan?.planName || plan?.insurerName || "Bike Plan"}
                  </h5>

                  <div
                    className="d-flex flex-column gap-1"
                    style={{ fontSize: "0.9rem", color: "#555" }}
                  >
                    <div>
                      <strong>Provider:</strong> {plan?.provider || "N/A"}
                    </div>
                    <div>
                      <strong>Coverage:</strong> {plan?.coverage || "N/A"}
                    </div>
                    <div>
                      <strong>Eligibility:</strong> {plan?.eligibility || "N/A"}
                    </div>
                  </div>

                  {Array.isArray(plan?.specialBenefits) &&
                    plan.specialBenefits.length > 0 && (
                      <div className="text-success small mt-2">
                        <strong>Key Features:</strong>
                        <ul className="mb-0 list-unstyled">
                          {plan.specialBenefits.map((benefit, i) => (
                            <li key={i}>✔ {benefit}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                </Col>

                <Col md={3} className="text-center">
                  <p className="mb-2">
                    <strong>
                      Starting From ₹
                      {plan?.annualPremium ?? plan?.annualPremium ?? "N/A"}
                    </strong>
                  </p>
                  <Button
                    variant="primary"
                    size="lg"
                    className="w-100 mt-2"
                    onClick={() => handleSelectPolicy(plan?.planId)}
                    disabled={loadingPlanId === plan?.planId}
                  >
                    {loadingPlanId === plan?.planId ? (
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
      </div>
      <Footer />
    </>
  );
};

export default BikeQuote;
