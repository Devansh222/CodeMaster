



// client/src/pages/AdminUserList.jsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const AdminUserList = () => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_REACT_APP_BACKEND_BASE_URL}/api/admin/users`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        });
        setUsers(res.data); // array of user documents
      } catch (error) {
        console.error(error);
      }
    };
    fetchUsers();
  }, []);

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded shadow-lg">
      <h2 className="text-3xl font-bold mb-6">Manage Users</h2>
      {users.length === 0 ? (
        <p>No users found.</p>
      ) : (
        <table className="min-w-full border">
          <thead>
            <tr className="bg-gray-200">
              <th className="border p-3 font-bold">Username</th>
              <th className="border p-3 font-bold">Email</th>
              <th className="border p-3 font-bold">Role</th>
              <th className="border p-3 font-bold">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u._id}>
                <td className="border p-3">{u.username}</td>
                <td className="border p-3">{u.email}</td>
                <td className="border p-3">{u.role}</td>
                <td className="border p-3">
                  <Link
                    to={`/admin/users/${u._id}`}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded font-bold"
                  >
                    View / Edit
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default AdminUserList;
