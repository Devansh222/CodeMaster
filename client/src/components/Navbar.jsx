import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Navbar = () => {
  const token = localStorage.getItem('token');
  const role = localStorage.getItem('role');
  const username = localStorage.getItem('username');
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    localStorage.removeItem('username');
    navigate('/');
  };

  return (
    <nav className="bg-white p-4 shadow">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        {/* Logo */}
        <Link to="/" className="text-blue-500 text-2xl font-extrabold mr-8">
          CodeMaster
        </Link>
  
        {/* Desktop Menu */}
        <div className="hidden md:flex space-x-4">
          {token && (
            <Link
              to="/problems"
              className="text-gray-800 hover:text-blue-500">
              Problems
            </Link>
          )}
          {token && (
            <Link to="/dashboard" className="text-gray-800 hover:text-blue-500">
              Dashboard
            </Link>
          )}
          {token && role === 'admin' && (
            <Link to="/admin" className="text-gray-800 hover:text-blue-500">
              Admin
            </Link>
          )}
        </div>
  
        {/* Desktop Auth */}
        <div className="hidden md:flex space-x-4 items-center">
          {token ? (
            <>
              {username && <span className="text-gray-800">Hello, {username}</span>}
              <button
                onClick={logout}
                className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded font-bold"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="text-gray-800 hover:text-blue-500 font-bold">
                Login
              </Link>
              <Link
                to="/register"
                className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded font-bold"
              >
                Register
              </Link>
            </>
          )}
        </div>
  
        {/* Mobile Menu Button */}
        <div className="md:hidden flex items-center">
          <button
            onClick={() => setIsOpen(!isOpen)}
            type="button"
            className="text-gray-800 hover:text-blue-500 focus:outline-none"
          >
            <svg className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="2"
              viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round">
              {isOpen ? (
                <path d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path d="M3 6h18M3 12h18M3 18h18" />
              )}
            </svg>
          </button>
        </div>
      </div>
  
      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden px-2 pt-2 pb-3 space-y-1">
          {token && (
            <Link
              to="/problems"
              className="block text-gray-800 hover:text-blue-500"
              onClick={() => setIsOpen(false)}
            >
              Problems
            </Link>
          )}

          {token && (
            <Link
              to="/dashboard"
              className="block text-gray-800 hover:text-blue-500"
              onClick={() => setIsOpen(false)}
            >
              Dashboard
            </Link>
          )}
          
          {token && role === 'admin' && (
            <Link
              to="/admin"
              className="block text-gray-800 hover:text-blue-500"
              onClick={() => setIsOpen(false)}
            >
              Admin
            </Link>
          )}
          <div className="mt-2 border-t border-gray-300 pt-2">
            {token ? (
              <button
                onClick={() => {
                  logout();
                  setIsOpen(false);
                }}
                className="block w-full text-left text-gray-800 hover:text-blue-500"
              >
                Logout
              </button>
            ) : (
              <>
                <Link
                  to="/login"
                  className="block text-gray-800 hover:text-blue-500"
                  onClick={() => setIsOpen(false)}
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="block text-gray-800 hover:text-blue-500"
                  onClick={() => setIsOpen(false)}
                >
                  Register
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
  };
  
  export default Navbar;