import React, { useState } from 'react';
import axios from 'axios';

const GetUsers = ({ token }) => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/api/admin/users`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (Array.isArray(res.data)) {
        setUsers(res.data);
      } else {
        console.error('Expected array but got:', res.data);
        setUsers([]);
      }
    } catch (err) {
      console.error('Failed to fetch users:', err);
      alert('Error fetching users.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mt-4">
      <button className="btn btn-primary mb-3" onClick={fetchUsers}>
        Fetch Users
      </button>

      {loading && <p>Loading users...</p>}

      {users.length > 0 ? (
        <ul className="list-group">
          {users.map((user, index) => (
            <li key={index} className="list-group-item">
              <strong>User Info:</strong> {JSON.stringify(user.userInfo)} <br />
              {/* <strong>Plan Details:</strong> {JSON.stringify(user.planDetails)} */}
            </li>
          ))}
        </ul>
      ) : (
        !loading && <p>No users to display.</p>
      )}
    </div>
  );
};

export default GetUsers;
