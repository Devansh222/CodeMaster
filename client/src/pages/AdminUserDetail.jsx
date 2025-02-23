import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';

const AdminUserDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [formData, setFormData] = useState({ username: '', email: '', role: '' });
  const [notification, setNotification] = useState(null);

  // Show notification for 3 seconds
  const showNotification = (message, type = 'success') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  };

  const fetchUser = async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_REACT_APP_BACKEND_BASE_URL}/api/admin/users/${id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      setUser(res.data);
      setFormData({
        username: res.data.username,
        email: res.data.email,
        role: res.data.role
      });
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchUser();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const onChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`${import.meta.env.VITE_REACT_APP_BACKEND_BASE_URL}/api/admin/users/${id}`, formData, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      showNotification('User updated successfully', 'success');
      fetchUser();
    } catch (error) {
      console.error(error);
      showNotification(error.response?.data?.message || 'Error updating user', 'error');
    }
  };

  const onDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this user?')) return;
    try {
      await axios.delete(`${import.meta.env.VITE_REACT_APP_BACKEND_BASE_URL}/api/admin/users/${id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      showNotification('User deleted successfully', 'success');
      navigate('/admin/users');
    } catch (error) {
      console.error(error);
      showNotification(error.response?.data?.message || 'Error deleting user', 'error');
    }
  };

  if (!user) return <div>Loading...</div>;

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded shadow-lg">
      {notification && (
        <div
          className={`mb-4 p-2 rounded text-white ${
            notification.type === 'success'
              ? 'bg-blue-500'
              : notification.type === 'error'
              ? 'bg-red-500'
              : 'bg-blue-700'
          }`}
        >
          {notification.message}
        </div>
      )}
      <h2 className="text-2xl font-bold mb-4">User Detail</h2>
      <form onSubmit={onSubmit}>
        <div className="mb-4">
          <label className="font-semibold">Username:</label>
          <input
            type="text"
            name="username"
            value={formData.username}
            onChange={onChange}
            className="w-full p-2 border rounded"
          />
        </div>
        <div className="mb-4">
          <label className="font-semibold">Email:</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={onChange}
            className="w-full p-2 border rounded"
          />
        </div>
        <div className="mb-4">
          <label className="font-semibold">Role:</label>
          <select
            name="role"
            value={formData.role}
            onChange={onChange}
            className="w-full p-2 border rounded"
          >
            <option value="user">User</option>
            <option value="staff">Staff</option>
            <option value="admin">Admin</option>
          </select>
        </div>
        <div className="flex justify-between">
          <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded font-bold">
            Update
          </button>
          <button
            type="button"
            onClick={onDelete}
            className="bg-red-500 text-white px-4 py-2 rounded font-bold"
          >
            Delete
          </button>
        </div>
      </form>
    </div>
  );
};

export default AdminUserDetail;
