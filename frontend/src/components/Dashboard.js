import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Card, Spinner, Alert } from 'react-bootstrap';
import Navbar from './Navbar';
import Footer from './Footer';

const Dashboard = ({ mobile }) => {
  const [user, setUser] = useState(null);
  const [policies, setPolicies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/api/auth/dashboard/${mobile}`);
        setUser(response.data.user);
        setPolicies(response.data.policies || []);
      } catch (err) {
        setError('Failed to fetch dashboard data');
      } finally {
        setLoading(false);
      }
    };

    if (mobile) {
      fetchDashboard();
    }
  }, [mobile]);

  if (loading) return <div className="text-center mt-5"><Spinner animation="border" /></div>;
  if (error) return <Alert variant="danger" className="mt-5 text-center">{error}</Alert>;

  return (
    <div className="container mt-5">
      <Navbar/>
      <h2 className="mb-4">Welcome, {user.name}</h2>

      <Card className="mb-4">
        <Card.Body>
          <h5>User Information</h5>
          <p><strong>Mobile:</strong> {user.mobile}</p>
          <p><strong>Email:</strong> {user.email}</p>
          <p><strong>Gender:</strong> {user.gender}</p>
          <p><strong>Date of Birth:</strong> {user.dob}</p>
        </Card.Body>
      </Card>

      <Card>
        <Card.Body>
          <h5>Policies</h5>
          {policies.length === 0 ? (
            <p>No policies found.</p>
          ) : (
            policies.map((policy, index) => (
              <div key={index} className="mb-3">
                <p><strong>Policy ID:</strong> {policy.policyId}</p>
                <p><strong>Type:</strong> {policy.type}</p>
                <p><strong>Status:</strong> {policy.status}</p>
                <p><strong>Start Date:</strong> {policy.startDate}</p>
                <p><strong>End Date:</strong> {policy.endDate}</p>
                <hr />
              </div>
            ))
          )}
        </Card.Body>
      </Card>
      <Footer/>
    </div>
  );
};

export default Dashboard;
