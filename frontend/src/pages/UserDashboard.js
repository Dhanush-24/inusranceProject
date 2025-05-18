import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import CustomerSpeak from '../components/CustomerCard';

const UserDashboard = () => {
  const { user, logout } = useAuth();
  const { mobile } = useParams();
  const navigate = useNavigate();

  const [userDetails, setUserDetails] = useState(null);
  const [paymentHistory, setPaymentHistory] = useState([]);
  const [selectedPolicies, setSelectedPolicies] = useState({
    Car: null,
    Bike: null,
    Health: null,
    Guaranteed: null,
    Investment: null,
    Term: null,
  });
  const [activePolicy, setActivePolicy] = useState(null);
  const [showPayments, setShowPayments] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const toggleDropdown = () => setDropdownOpen((prev) => !prev);

  const handlePayPremium = async () => {
    const type = prompt("Enter policy type (car, bike, health, term, guaranteed, investment):")?.toLowerCase();
    const userMobile = prompt("Enter your mobile number:");
    if (!type || !userMobile) return alert("Both fields are required.");

    const validTypes = ["car", "bike", "health", "term", "guaranteed", "investment"];
    if (!validTypes.includes(type)) return alert("Invalid policy type.");

    try {
      const { data } = await axios.post(`${process.env.REACT_APP_API_BASE_URL}/api/payment/create-order`, { type, mobile: userMobile });
      const { order } = data;

      const options = {
        key: 'rzp_test_ovPv0GONZBMcPf',
        amount: order.amount,
        currency: order.currency,
        name: 'Insurance Payment',
        description: `${type} policy`,
        order_id: order.id,
        handler: async function (response) {
          alert('Payment successful!');
          await axios.post(`${process.env.REACT_APP_API_BASE_URL}/api/payment/verify-payment`, {
            razorpay_payment_id: response.razorpay_payment_id,
            razorpay_order_id: response.razorpay_order_id,
            razorpay_signature: response.razorpay_signature,
            policyType: type,
            mobile: userMobile,
          });
          alert("Payment verified.");
        },
        prefill: { contact: userMobile },
        theme: { color: '#0f62fe' },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (err) {
      console.error(err);
      alert("Payment initiation failed.");
    }
  };

  useEffect(() => {
    if (!user?.mobile || user.mobile !== mobile) return navigate('/');

    axios.get(`${process.env.REACT_APP_API_BASE_URL}/api/auth/dashboard/${mobile}`)
      .then((res) => {
        const userData = res.data.user || res.data;
        setUserDetails(userData);

        const endpoints = {
          Car: 'car/policy-details',
          Bike: 'bike/policy-details',
          Health: 'health/policy-details',
          Guaranteed: 'guarented-policy/policy-details',
          Investment: 'investmentPolicy',
          Term: 'term',
        };

        Object.entries(endpoints).forEach(([type, path]) => {
          axios.get(`${process.env.REACT_APP_API_BASE_URL}/api/${path}/${userData.mobile}`)
            .then((res) => {
              setSelectedPolicies((prev) => ({
                ...prev,
                [type]: res.data.data,
              }));
            });
        });

        axios.get(`${process.env.REACT_APP_API_BASE_URL}/api/payment/payment-details/${userData.mobile}`)
          .then((res) => setPaymentHistory(res.data.data));
      })
      .catch((err) => console.error('Failed to fetch user details:', err));
  }, [mobile, user, navigate]);

  return (
    <div className="d-flex flex-column min-vh-100 bg-light">
      <Navbar />
      <div className="container my-5 flex-grow-1">
        <div className="row">
          <div className="col-md-3 mb-4">
            <div className="card shadow rounded p-3 border-0 bg-white text-start">
              <h5 className="mb-3">👤 Dashboard Menu</h5>
              <button className="btn btn-outline-primary mb-2 w-100" onClick={() => {
                setShowPayments(false);
                setActivePolicy(null);
              }}>🏠 User Profile</button>

              <button className="btn btn-outline-primary mb-2 w-100" onClick={toggleDropdown}>
                📄 View Policies
              </button>

              {dropdownOpen && (
                <div className="ms-2 mb-3">
                  {Object.keys(selectedPolicies).map((type) => (
                    <button
                      key={type}
                      className={`btn btn-outline-secondary mb-2 w-100 text-start ${activePolicy === type ? 'active' : ''}`}
                      onClick={() => {
                        setShowPayments(false);
                        setActivePolicy(type);
                      }}
                    >
                      {type} Policy
                    </button>
                  ))}
                </div>
              )}

              <button className="btn btn-outline-primary mb-2 w-100" onClick={() => {
                setActivePolicy(null);
                setShowPayments((prev) => !prev);
              }}>💳 Payment History</button>

              <button className="btn btn-success w-100 mb-2" onClick={handlePayPremium}>
                💰 Pay Premium
              </button>

              <button className="btn btn-danger w-100" onClick={logout}>
                🚪 Logout
              </button>
            </div>
          </div>

          <div className="col-md-9">
            {userDetails ? (
              <div>
                {/* Updated Personal Info Card */}
                <div className="card p-4 mb-4 shadow-sm border-0 rounded bg-white">
                  <h3 className="mb-4" style={{ fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif", fontWeight: 700 }}>
                    Personal Information
                  </h3>
                  <div className="row">
                    <div className="col-md-8">
                      <div className="row mb-2">
                        <div className="col-4 fw-bold">Full Name:</div>
                        <div className="col-8">{userDetails.name}</div>
                      </div>
                      <div className="row mb-2">
                        <div className="col-4 fw-bold">Gender:</div>
                        <div className="col-8">{userDetails.gender}</div>
                      </div>
                      <div className="row mb-2">
                        <div className="col-4 fw-bold">Birth Date:</div>
                        <div className="col-8">{new Date(userDetails.dob).toLocaleDateString()}</div>
                      </div>
                      <div className="row mb-2">
                        <div className="col-4 fw-bold">Email:</div>
                        <div className="col-8">{userDetails.email}</div>
                      </div>
                      <div className="row mb-2">
                        <div className="col-4 fw-bold">Mobile:</div>
                        <div className="col-8">{userDetails.mobile}</div>
                      </div>
                    </div>
                    <div className="col-md-4 d-flex justify-content-center align-items-start">
                      <img
                        src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTHBwvlnIzoEG9gEsYUZJQWNc_Hh9IChqH5dg&s"
                        alt="Profile"
                        className="img-fluid"
                        style={{ maxHeight: '200px', objectFit: 'contain' }}
                      />
                    </div>
                  </div>
                </div>

                {/* Payment History */}
                {showPayments && (
                  <div className="card p-4 mb-4 shadow-sm border-0 rounded bg-white">
                    <h5 className="mb-3">💳 Payment History</h5>
                    <div className="table-responsive">
                      <table className="table table-hover table-bordered">
                        <thead className="table-primary">
                          <tr>
                            <th>Policy</th>
                            <th>Amount</th>
                            <th>Status</th>
                            <th>Method</th>
                            <th>Payment ID</th>
                            <th>Mobile</th>
                            <th>Date</th>
                          </tr>
                        </thead>
                        <tbody>
                          {paymentHistory.map((p, i) => (
                            <tr key={i}>
                              <td>{p.policyType}</td>
                              <td>₹{p.amount / 100}</td>
                              <td>{p.status}</td>
                              <td>{p.method}</td>
                              <td>{p.paymentId}</td>
                              <td>{p.mobile}</td>
                              <td>{new Date(p.created_at * 1000).toLocaleString()}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}

                {/* Active Policy Details */}
                {activePolicy && selectedPolicies[activePolicy] && (() => {
                  const type = activePolicy;
                  const data = selectedPolicies[type];

                  const flattenData = (obj) => {
                    const result = {};
                    for (const key in obj) {
                      if (Array.isArray(obj[key])) {
                        result[key] = obj[key].join(', ');
                      } else if (typeof obj[key] === 'object' && obj[key] !== null) {
                        const nested = flattenData(obj[key]);
                        for (const nestedKey in nested) {
                          result[`${key}.${nestedKey}`] = nested[nestedKey];
                        }
                      } else {
                        result[key] = obj[key];
                      }
                    }
                    return result;
                  };

                  const displayData = type === 'Car' || type === 'Bike' ? flattenData(data) : data;

                  return (
                    <div className="card p-4 mb-4 shadow-sm border-0 rounded bg-white">
                      <h5 className="mb-3">📃 {type} Policy Details</h5>
                      <div className="table-responsive">
                        <table className="table table-striped table-bordered">
                          <thead className="table-secondary">
                            <tr>
                              {Object.keys(displayData).map((key) => (
                                <th key={key}>{key}</th>
                              ))}
                            </tr>
                          </thead>
                          <tbody>
                            <tr>
                              {Object.values(displayData).map((value, i) => (
                                <td key={i}>{String(value)}</td>
                              ))}
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    </div>
                  );
                })()}
              </div>
            ) : (
              <div className="text-center my-5">
                <div className="spinner-border text-primary" role="status" />
                <p className="mt-2">Loading user data...</p>
              </div>
            )}
          </div>
        </div>
      </div>
      <CustomerSpeak />
      <Footer />
    </div>
  );
};

export default UserDashboard;
