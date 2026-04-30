import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { Gavel, LogOut, User, Search, PlusCircle, Shield } from 'lucide-react';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="bg-white shadow-md border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo Section */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center gap-2 text-indigo-600 hover:text-indigo-700 transition">
              <Gavel className="w-8 h-8" />
              <span className="font-bold text-xl tracking-tight">BidMaster</span>
            </Link>
          </div>

          {/* Navigation Links */}
          <div className="flex items-center gap-4">
            {/* Always visible link */}
            <Link to="/auctions" className="flex items-center gap-1 text-gray-600 hover:text-indigo-600 font-medium transition mr-2">
              <Search className="w-4 h-4" />
              Browse
            </Link>

            {user ? (
              // Links for Logged-In Users
              <>
                {/* Admin Dashboard Link - Only visible to admins */}
                {user.role === 'admin' && (
                  <>
                    <Link to="/admin" className="flex items-center gap-1 text-red-600 hover:text-red-800 font-bold transition mr-2 bg-red-50 px-3 py-1 rounded-md">
                      <Shield className="w-4 h-4" />
                      Admin
                    </Link>
                    <div className="h-6 w-px bg-gray-200 mx-1"></div>
                  </>
                )}

                <Link to="/create-auction" className="flex items-center gap-1 text-indigo-600 hover:text-indigo-800 font-medium transition mr-2">
                  <PlusCircle className="w-4 h-4" />
                  Create
                </Link>
                <Link to="/dashboard" className="text-gray-600 hover:text-indigo-600 font-medium transition">
                  Dashboard
                </Link>
                <div className="h-6 w-px bg-gray-200 mx-2"></div>
                <div className="flex items-center gap-2 text-sm text-gray-700">
                  <User className="w-4 h-4 text-gray-500" />
                  <span className="font-semibold">{user.username}</span>
                  {user.role === 'admin' && (
                    <span className="ml-1 px-2 py-0.5 bg-red-100 text-red-700 text-xs font-bold rounded-full">ADMIN</span>
                  )}
                </div>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-1 ml-2 bg-gray-50 hover:bg-gray-100 text-gray-700 px-3 py-2 rounded-md text-sm font-medium transition border border-gray-200 shadow-sm"
                >
                  <LogOut className="w-4 h-4" />
                  Logout
                </button>
              </>
            ) : (
              // Links for Guests
              <>
                <div className="h-6 w-px bg-gray-200 mx-2"></div>
                <Link
                  to="/login"
                  className="text-gray-600 hover:text-indigo-600 font-medium px-3 py-2 transition"
                >
                  Log in
                </Link>
                <Link
                  to="/register"
                  className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md font-medium shadow-sm transition"
                >
                  Sign up
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
