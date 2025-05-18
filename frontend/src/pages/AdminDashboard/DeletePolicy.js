import React, { useState } from 'react';
import axios from 'axios';

const DeletePolicy = ({ token, policyType, fetchPolicies }) => {
  const [policyIdToDelete, setPolicyIdToDelete] = useState(null);

  const handleDeletePolicy = () => {
    if (!policyIdToDelete) {
      alert('Please enter a policy ID.');
      return;
    }
    axios.delete(`${process.env.REACT_APP_API_BASE_URL}/api/admin/policies/${policyType}/${policyIdToDelete}`, {
      headers: { Authorization: `Bearer ${token}` },
    }).then(() => {
      fetchPolicies(policyType); // Refresh the policy list
      alert('Policy deleted successfully!');
    }).catch(console.error);
  };

  return (
    <div>
      <h3>Delete a Policy</h3>
      <input
        type="text"
        value={policyIdToDelete}
        onChange={e => setPolicyIdToDelete(e.target.value)}
        placeholder="Enter Policy ID"
        className="form-control mb-2"
      />
      <button onClick={handleDeletePolicy} className="btn btn-danger">Delete Policy</button>
    </div>
  );
};

export default DeletePolicy;
