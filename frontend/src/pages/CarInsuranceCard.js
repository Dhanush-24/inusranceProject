import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const CarInsuranceCard = () => {
  const [carNumber, setCarNumber] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
  
    try {
      // 1. Check if car number already exists
      const checkRes = await axios.post(`${process.env.REACT_APP_API_BASE_URL}/api/car/check-existing`, {
        carNumber,
      });
  
      // 2. Save car number if it doesn't exist
      if (!checkRes.data.exists) {
        await axios.post(`${process.env.REACT_APP_API_BASE_URL}/api/car/savenumber`, {
          carNumber,
        });
      }
  
      // 3. Fetch car insurance plans
      const plansRes = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/api/car/plans`);
  
      // 4. Navigate to car-quote with data
      navigate('/car-quote', {
        state: {
          plans: plansRes.data,
          carNumber: carNumber,
        },
      });
    } catch (err) {
      console.error('Error:', err);
      alert(err.response?.data?.message || 'Something went wrong.');
    } finally {
      setLoading(false);
    }
  };
  
  



  return (
    <div className="container mt-5">
      <h3>Enter Your Car Number</h3>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={carNumber}
          onChange={(e) => setCarNumber(e.target.value.toUpperCase())}
          placeholder="e.g., MH-12-AB-1234"
          required
          className="form-control mb-3"
        />
        <button type="submit" className="btn btn-primary" disabled={loading}>
          {loading ? 'Loading...' : 'Get Quotes'}
        </button>
      </form>
    </div>
  );
};

export default CarInsuranceCard;
