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
  const [showPayments, setShowPayments] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [paymentDueNotifications, setPaymentDueNotifications] = useState([]);


  const [selectedPolicyType, setSelectedPolicyType] = useState(null);
  const [showFullDetails, setShowFullDetails] = useState(false);

  const toggleDropdown = () => setDropdownOpen((prev) => !prev);

  const [notificationDismissed, setNotificationDismissed] = useState(
  localStorage.getItem('notificationsDismissed') === 'true'
);

const handleDismissNotification = () => {
  setNotificationDismissed(true);
  localStorage.setItem('notificationsDismissed', 'true');
};


  const handleSelectPolicyType = (type) => {
    setSelectedPolicyType((prev) => (prev === type ? null : type));
  };

  // Modified pay premium function to accept params (policyType, userMobile)
  const handlePayPremium = async (policyType, userMobile) => {
    const type = policyType.toLowerCase();
    const validTypes = ["car", "bike", "health", "term", "guaranteed", "investment"];

    if (!validTypes.includes(type)) return alert("Invalid policy type.");
    if (!userMobile) return alert("User mobile number is required.");

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
                [type]: res.data.data && res.data.data.length !== 0 ? res.data.data : null,
              }));
            })
            .catch(() => {
              setSelectedPolicies((prev) => ({
                ...prev,
                [type]: null,
              }));
            });
        });

        axios.get(`${process.env.REACT_APP_API_BASE_URL}/api/payment/payment-details/${userData.mobile}`)
          .then((res) => setPaymentHistory(res.data.data || []))
          .catch(() => setPaymentHistory([]));
      })
      .catch((err) => {
        console.error('Failed to fetch user details:', err);
        setUserDetails(null);
      });
  }, [mobile, user, navigate]);

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

  const filterPolicyData = (data) => {
    const flattened = flattenData(data);
    return Object.entries(flattened).filter(([key]) => {
      if (!showFullDetails) {
        const keyLower = key.toLowerCase();
        return ['name', 'mobile', 'company', 'planname', 'premium'].some(field => keyLower.includes(field));
      }
      return !['__v', '_v'].includes(key); // include _id in full view
    });
  };

   const computePaymentDueNotifications = (payments) => {
    const oneYearMs = 365 * 24 * 60 * 60 * 1000;
    // Group payments by policyType and find latest payment date per type
    const latestPaymentsByType = {};

    payments.forEach(({ policyType, created_at }) => {
      const paymentDate = new Date(created_at * 1000);
      if (
        !latestPaymentsByType[policyType] ||
        paymentDate > latestPaymentsByType[policyType]
      ) {
        latestPaymentsByType[policyType] = paymentDate;
      }
    });

    // For each policyType with a payment, calculate days remaining
    const notifications = Object.entries(latestPaymentsByType).map(
      ([policyType, lastPaymentDate]) => {
        const dueDate = new Date(lastPaymentDate.getTime() + oneYearMs);
        const now = new Date();
        const diffMs = dueDate - now;
        const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24));

        if (diffDays <= 0) {
          return `Your ${policyType} policy payment is due today or overdue.`;
        } else {
          return `Your ${policyType} policy payment is due in ${diffDays} day${diffDays > 1 ? 's' : ''}.`;
        }
      }
    );

    return notifications;
  };

  // Update notifications whenever paymentHistory changes
  useEffect(() => {
    if (paymentHistory.length > 0) {
      const notifications = computePaymentDueNotifications(paymentHistory);
      setPaymentDueNotifications(notifications);
    } else {
      setPaymentDueNotifications([]);
    }
  }, [paymentHistory]);

  useEffect(() => {
  if (paymentDueNotifications.length > 0) {
    setNotificationDismissed(false);
    localStorage.removeItem('notificationsDismissed');
  }
}, [paymentDueNotifications.length]);





  return (
    <div className="d-flex flex-column min-vh-100 bg-light">
      <Navbar />

       <div className="container my-2 flex-grow-1">
  {!notificationDismissed && paymentDueNotifications.length > 0 && (
    <div className="alert alert-warning position-relative">
      <button
        type="button"
        className="btn-close position-absolute top-0 end-0 m-3"
        aria-label="Close"
        onClick={handleDismissNotification}
      ></button>
      <h5>🔔 Payment Due Notifications</h5>
      <ul>
        {paymentDueNotifications.map((msg, i) => (
          <li key={i}>{msg}</li>
        ))}
      </ul>
    </div>
  )}
</div>


      <div className="container my-5 flex-grow-1">
        <div className="row">
          <div className="col-md-3 mb-4">
            <div className="card shadow rounded p-3 border-0 bg-white text-start">
              <h5 className="mb-3">👤 Dashboard Menu</h5>
              <button
                className="btn btn-outline-primary mb-2 w-100"
                onClick={() => {
                  setShowPayments(false);
                  setSelectedPolicyType(null);
                }}
              >
                🏠 User Profile
              </button>

              <button className="btn btn-outline-primary mb-2 w-100" onClick={toggleDropdown}>
                📄 View Policies
              </button>
              

              {dropdownOpen && (
                <div className="ms-2 mb-3">
                  {Object.keys(selectedPolicies).map((type) => (
                    <div
                      key={type}
                      className="text-start mb-1"
                      style={{ cursor: 'pointer', fontWeight: selectedPolicyType === type ? 'bold' : 'normal' }}
                      onClick={() => {
                        setShowPayments(false);
                        setSelectedPolicyType(type);
                        setDropdownOpen(false);
                      }}
                    >
                      <strong>{type} Policy:</strong> {selectedPolicies[type] ? "Available" : "Not found"}
                    </div>
                  ))}
                </div>
              )}

              <button
                className="btn btn-outline-primary mb-2 w-100"
                onClick={() => {
                  setShowPayments((prev) => !prev);
                  setSelectedPolicyType(null);
                }}
              >
                💳 Payment History
              </button>


              <button className="btn btn-danger w-100" onClick={logout}>
                🚪 Logout
              </button>
            </div>
          </div>

          <div className="col-md-9">
            {userDetails ? (
              <div>
                {/* Personal Info */}
                <div className="card p-4 mb-4 shadow-sm border-0 rounded bg-white">
                  <h3 className="mb-4">Personal Information</h3>
                  <div className="row">
                    <div className="col-md-8">
                      <div className="row mb-2"><div className="col-4 fw-bold">Full Name:</div><div className="col-8">{userDetails.name}</div></div>
                      <div className="row mb-2"><div className="col-4 fw-bold">Gender:</div><div className="col-8">{userDetails.gender}</div></div>
                      <div className="row mb-2"><div className="col-4 fw-bold">Birth Date:</div><div className="col-8">{new Date(userDetails.dob).toLocaleDateString()}</div></div>
                      <div className="row mb-2"><div className="col-4 fw-bold">Email:</div><div className="col-8">{userDetails.email}</div></div>
                      <div className="row mb-2"><div className="col-4 fw-bold">Mobile:</div><div className="col-8">{userDetails.mobile}</div></div>
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
                    {paymentHistory.length > 0 ? (
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
                    ) : (
                      <p>No payment history found.</p>
                    )}
                  </div>
                )}

                {/* Policies */}
                {selectedPolicyType && (
                  <div className="card p-4 shadow-sm border-0 rounded bg-white">
                    <h4 className="mb-3">{selectedPolicyType} Policy Details</h4>
                    <button
                      className="btn btn-outline-secondary mb-3"
                      onClick={() => setShowFullDetails((prev) => !prev)}
                    >
                      {showFullDetails ? 'Show Filtered Details' : 'Show All Details'}
                    </button>

                    {selectedPolicies[selectedPolicyType] && selectedPolicies[selectedPolicyType].length > 0 ? (
                      selectedPolicies[selectedPolicyType].map((policy, idx) => (
                        <div key={idx} className="mb-4 border-bottom pb-3">
                          {filterPolicyData(policy).map(([key, val]) => (
                            <div className="row mb-1" key={key}>
                              <div className="col-4 fw-semibold text-capitalize">{key.replace(/_/g, ' ')}:</div>
                              <div className="col-8">{String(val)}</div>
                            </div>
                          ))}

                          {/* Pay Premium button below each policy */}
                          <button
                            className="btn btn-primary mt-3"
                            onClick={() => handlePayPremium(selectedPolicyType, policy.mobile || userDetails.mobile)}
                          >
                            💰 Pay Premium
                          </button>
                        </div>
                      ))
                    ) : (
                      <p>No {selectedPolicyType} policy found.</p>
                    )}
                  </div>
                )}
              </div>
            ) : (
              <div>
                <h2>Loading user details...</h2>
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
