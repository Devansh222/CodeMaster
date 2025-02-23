import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const AdminLoginLogs = () => {
  const [logs, setLogs] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get(`${import.meta.env.VITE_REACT_APP_BACKEND_BASE_URL}/api/admin/login-logs`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setLogs(res.data);
      } catch (error) {
        console.error('Error fetching login logs:', error);
      }
    };
    fetchLogs();
  }, [navigate]);

  return (
    <div className="max-w-5xl mx-auto p-6 bg-white shadow-xl rounded-lg">
      <h2 className="text-3xl font-bold mb-6">User Login Logs</h2>
      {logs.length === 0 ? (
        <p>No login logs available.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full border">
            <thead>
              <tr>
                <th className="border p-2">Username</th>
                <th className="border p-2">Email</th>
                <th className="border p-2">IP</th>
                <th className="border p-2">User Agent</th>
                <th className="border p-2">Timestamp</th>
              </tr>
            </thead>
            <tbody>
              {logs.map(log => (
                <tr key={log._id}>
                  <td className="border p-2">{log.user?.username || 'N/A'}</td>
                  <td className="border p-2">{log.email}</td>
                  <td className="border p-2">{log.ip}</td>
                  <td className="border p-2">{log.userAgent}</td>
                  <td className="border p-2">{new Date(log.timestamp).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      <div className="mt-6">
        <button 
          onClick={() => navigate('/admin')} 
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
        >
          Back to Admin Panel
        </button>
      </div>
    </div>
  );
};

export default AdminLoginLogs;
