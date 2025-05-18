import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { Card, Button, Alert, Spinner } from "react-bootstrap";
import axios from "axios";

const CarPlans = () => {
  const location = useLocation();
  const passedPlans = location.state?.plans || [];
  const carNumber = location.state?.carNumber || ""; // optional

  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchPlans = async () => {
      try {
        if (passedPlans.length) {
          setPlans(passedPlans.sort((a, b) => a.premium - b.premium));
        } else {
          const res = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/api/car/plans`, {
            params: { carNumber },
          });
          const data = Array.isArray(res.data) ? res.data : res.data.plans;
          setPlans((data || []).sort((a, b) => a.premium - b.premium));
        }
      } catch (err) {
        console.error("Failed to fetch plans:", err);
        setError("Could not load insurance plans.");
      } finally {
        setLoading(false);
      }
    };

    fetchPlans();
  }, [passedPlans, carNumber]);

  const handleSelect = async (planId) => {
    try {
      const res = await axios.post(`${process.env.REACT_APP_API_BASE_URL}/api/car/selectplan`, { planId });
      alert(res.data.message || "Policy selected successfully!");
    } catch (err) {
      console.error("Selection failed:", err);
      alert("Failed to select policy.");
    }
  };

  return (
    <div className="container mt-5">
      <h3>Available Car Insurance Plans</h3>
      {loading ? (
        <div className="text-center">
          <Spinner animation="border" />
          <p>Loading plans...</p>
        </div>
      ) : error ? (
        <Alert variant="danger">{error}</Alert>
      ) : plans.length === 0 ? (
        <Alert variant="warning">No plans available.</Alert>
      ) : (
        plans.map((plan, index) => (
          <Card key={plan._id || index} className="mb-3 shadow-sm">
            <Card.Body>
              <h5>{plan.planName}</h5>
              <p><strong>Company:</strong> {plan.company}</p>
              <p><strong>Premium:</strong> ₹{plan.premium.toLocaleString()}</p>
              <p><strong>IDV:</strong> ₹{plan.idv?.toLocaleString()}</p>
              <p><strong>Claim Ratio:</strong> {plan.claimRatio}</p>
              <Button onClick={() => handleSelect(plan._id)}>Select Plan</Button>
            </Card.Body>
          </Card>
        ))
      )}
    </div>
  );
};

export default CarPlans;
