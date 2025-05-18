import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Footer from '../../components/Footer';
import Navbar from '../../components/Navbar';

const AdminDashboard = () => {
  const [adminInfo, setAdminInfo] = useState(null);
  const [policies, setPolicies] = useState([]);
  const [users, setUsers] = useState({});
  
  const [showModal, setShowModal] = useState(false);
  const [newPolicyType, setNewPolicyType] = useState('');
  const [newPolicyData, setNewPolicyData] = useState('{}');

  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [updatePolicyType, setUpdatePolicyType] = useState('');
  const [updatePolicyId, setUpdatePolicyId] = useState('');
  const [updatePolicyData, setUpdatePolicyData] = useState('{}');

  const navigate = useNavigate();
  const token = localStorage.getItem('adminToken');

  useEffect(() => {
    if (!token) {
      navigate('/admin/login');
    } else {
      axios.get(`${process.env.REACT_APP_API_BASE_URL}/api/admin/dashboard`, {
        headers: { Authorization: `Bearer ${token}` },
      }).then(res => setAdminInfo(res.data))
        .catch(console.error);
    }
  }, [navigate, token]);

  const handleGetPolicies = () => {
    const type = prompt('Enter policy type (car, bike, health, investment, guaranteed, term):');
    if (!type) return;

    axios.get(`${process.env.REACT_APP_API_BASE_URL}/api/admin/policies/${type}`, {
      headers: { Authorization: `Bearer ${token}` },
    }).then(res => {
      setPolicies(res.data);
      setUsers({});
    }).catch(err => {
      console.error('Error fetching policies:', err);
      alert('Failed to fetch policies. Please check the type and try again.');
    });
  };

  const handleDeletePolicy = () => {
    const type = prompt('Enter the policy type (e.g., carInsurance, bikeInsurance, etc.):');
    const planId = prompt('Enter the plan ID to delete the policy:');

    if (!type || !planId) return;

    axios.delete(`${process.env.REACT_APP_API_BASE_URL}/api/admin/policies/${type}/${planId}`, {
      headers: { Authorization: `Bearer ${token}` },
    }).then(() => {
      alert('Policy deleted successfully!');
      handleGetPolicies();
    }).catch(err => {
      console.error('Error deleting policy:', err);
      alert('Failed to delete policy. Please check the type and planId and try again.');
    });
  };

  const handleGetUsers = () => {
    axios.get(`${process.env.REACT_APP_API_BASE_URL}/api/admin/users`, {
  headers: { Authorization: `Bearer ${token}` },
})
.then(res => {
  setUsers(res.data.users || res.data); // fallback in case users are directly in res.data
  setPolicies([]);
})
.catch(err => {
  console.error('Error fetching users:', err);
  alert('Failed to fetch users');
});

  };

  const handleAddPolicy = () => {
    try {
      const parsedData = JSON.parse(newPolicyData);
      axios.post(`${process.env.REACT_APP_API_BASE_URL}/api/admin/policies/${newPolicyType}`, parsedData, {
        headers: { Authorization: `Bearer ${token}` },
      }).then(() => {
        alert('Policy added successfully!');
        setShowModal(false);
        setNewPolicyType('');
        setNewPolicyData('{}');
      }).catch(err => {
        console.error('Error adding policy:', err);
        alert('Failed to add policy');
      });
    } catch (error) {
      alert('Invalid JSON format in policy data.');
    }
  };

  const handleUpdatePolicy = () => {
    try {
      const parsedData = JSON.parse(updatePolicyData);
      axios.put(
        `${process.env.REACT_APP_API_BASE_URL}/api/admin/policies/${updatePolicyType}/${updatePolicyId}`,
        parsedData,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      ).then(() => {
        alert('Policy updated successfully!');
        setShowUpdateModal(false);
        setUpdatePolicyType('');
        setUpdatePolicyId('');
        setUpdatePolicyData('{}');
        handleGetPolicies();
      }).catch(err => {
        console.error('Error updating policy:', err);
        alert('Failed to update policy');
      });
    } catch (err) {
      alert('Invalid JSON format in policy data.');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    navigate('/admin/login');
  };

  return (
    <div className="container-fluid mt-4">
      <Navbar />

      <div className="row">
        {/* Sidebar */}
        <div className="col-md-2 bg-light sidebar">
          <h4 className="mt-4">Admin Dashboard</h4>
          <button className="btn btn-primary w-100 mb-3" onClick={handleGetPolicies}>Get Policies</button>
          <button className="btn btn-danger w-100 mb-3" onClick={handleDeletePolicy}>Delete Policy</button>
          {/* <button className="btn btn-secondary w-100 mb-3" onClick={handleGetUsers}>Get Users</button> */}
          <button className="btn btn-success w-100 mb-3" onClick={() => setShowModal(true)}>Add Policy</button>
          <button className="btn btn-warning w-100 mb-3" onClick={() => setShowUpdateModal(true)}>Update Policy</button>
          <button className="btn btn-danger w-100" onClick={handleLogout}>Logout</button>
        </div>

        {/* Main Content */}
        <div className="col-md-10">
          <h2>Admin Dashboard</h2>

          {adminInfo ? (
            <div className="col-md-2">
              <p><strong>Name:</strong> {adminInfo.name}</p>
              <p><strong>Email:</strong> {adminInfo.email}</p>
            </div>
          ) : (
            <p>Loading admin information...</p>
          )}
          {/* Add Policy Modal */}
          {showModal && (
            <div className="modal show fade d-block" tabIndex="-1" role="dialog">
              <div className="modal-dialog" role="document">
                <div className="modal-content">
                  <div className="modal-header">
                    <h5 className="modal-title">Add New Policy</h5>
                    <button type="button" className="btn-close" onClick={() => setShowModal(false)}></button>
                  </div>
                  <div className="modal-body">
                    <div className="mb-3">
                      <label>Policy Type</label>
                      <input
                        className="form-control"
                        placeholder="e.g. carInsurance"
                        value={newPolicyType}
                        onChange={e => setNewPolicyType(e.target.value)}
                      />
                    </div>
                    <div className="mb-3">
                      <label>Policy Data (JSON format)</label>
                      <textarea
                        className="form-control"
                        rows={6}
                        value={newPolicyData}
                        onChange={e => setNewPolicyData(e.target.value)}
                        placeholder='{ "planId": "123", "planName": "Basic Plan", ... }'
                      />
                    </div>
                  </div>
                  <div className="modal-footer">
                    <button className="btn btn-secondary" onClick={() => setShowModal(false)}>Cancel</button>
                    <button className="btn btn-primary" onClick={handleAddPolicy}>Add Policy</button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Update Policy Modal */}
          {showUpdateModal && (
            <div className="modal show fade d-block" tabIndex="-1" role="dialog">
              <div className="modal-dialog" role="document">
                <div className="modal-content">
                  <div className="modal-header">
                    <h5 className="modal-title">Update Policy</h5>
                    <button type="button" className="btn-close" onClick={() => setShowUpdateModal(false)}></button>
                  </div>
                  <div className="modal-body">
                    <div className="mb-3">
                      <label>Policy Type</label>
                      <input
                        className="form-control"
                        placeholder="e.g. carInsurance"
                        value={updatePolicyType}
                        onChange={e => setUpdatePolicyType(e.target.value)}
                      />
                    </div>
                    <div className="mb-3">
                      <label>Plan ID</label>
                      <input
                        className="form-control"
                        placeholder="e.g. 123"
                        value={updatePolicyId}
                        onChange={e => setUpdatePolicyId(e.target.value)}
                      />
                    </div>
                    <div className="mb-3">
                      <label>Policy Data to Update (JSON format)</label>
                      <textarea
                        className="form-control"
                        rows={6}
                        value={updatePolicyData}
                        onChange={e => setUpdatePolicyData(e.target.value)}
                        placeholder='{ "planName": "Updated Plan", ... }'
                      />
                    </div>
                  </div>
                  <div className="modal-footer">
                    <button className="btn btn-secondary" onClick={() => setShowUpdateModal(false)}>Cancel</button>
                    <button className="btn btn-primary" onClick={handleUpdatePolicy}>Update Policy</button>
                  </div>
                </div>
              </div>
            </div>
          )}

                  {/* Render fetched policies */}
        {policies.length > 0 && (
          <div className="mt-4">
            <h5>Fetched Policies</h5>
            <div className="table-responsive">
              <table className="table table-striped table-bordered">
                <thead>
                  <tr>
                    {Object.keys(policies[0])
                      .filter(key => !['logoUrl', '_id'].includes(key))
                      .map((key, i) => (
                        <th key={i}>{key}</th>
                      ))}
                  </tr>
                </thead>
                <tbody>
                  {policies.map((policy, index) => (
                    <tr key={index}>
                      {Object.entries(policy)
                        .filter(([key]) => !['logoUrl', '_id'].includes(key))
                        .map(([key, value], idx) => (
                          <td key={idx}>
                            {typeof value === 'object' ? JSON.stringify(value) : String(value)}
                          </td>
                        ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        </div>
      </div>


      

      <Footer />
    </div>
  );
};

export default AdminDashboard;
