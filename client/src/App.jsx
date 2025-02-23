

import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Problems from './pages/Problems';
import AdminPanel from './pages/AdminPanel';
import AdminUserList from './pages/AdminUserList';
import AdminUserDetail from './pages/AdminUserDetail';
import AdminLoginLogs from './pages/AdminLoginLogs';

function App() {
  const token = localStorage.getItem('token');
  const isAuthenticated = !!token;
  const userRole = localStorage.getItem('role');

  return (
    <Router>
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-grow">
          <div className="container mx-auto p-4">
            <Routes>
              <Route path="/" element={<Home />} />
              
              {/* Always show login/register pages */}
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />

              <Route path="/problems" element={<Problems />} />

              {/* Protected Routes */}
              <Route 
                path="/dashboard" 
                element={isAuthenticated ? <Dashboard /> : <Navigate to="/login" replace />} 
              />
              <Route 
                path="/admin" 
                element={isAuthenticated && userRole === 'admin' ? <AdminPanel /> : <Navigate to="/dashboard" replace />} 
              />
              <Route 
                path="/admin/users" 
                element={isAuthenticated && userRole === 'admin' ? <AdminUserList /> : <Navigate to="/dashboard" replace />} 
              />
              <Route 
                path="/admin/users/:id" 
                element={isAuthenticated && userRole === 'admin' ? <AdminUserDetail /> : <Navigate to="/dashboard" replace />} 
              />
              {/* New route for login logs */}
              <Route 
                path="/admin/login-logs" 
                element={isAuthenticated && userRole === 'admin' ? <AdminLoginLogs /> : <Navigate to="/dashboard" replace />} 
              />
              
              <Route path="*" element={<Navigate to={isAuthenticated ? "/dashboard" : "/login"} replace />} />
            </Routes>
          </div>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
