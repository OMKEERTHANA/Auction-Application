import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';

// Components
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';
import AdminProtectedRoute from './components/AdminProtectedRoute';

// Pages - User Pages
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import BrowseAuctions from './pages/BrowseAuctions';
import CreateAuction from './pages/CreateAuction';
import AuctionDetails from './pages/AuctionDetails';

// Pages - Admin Pages
import AdminDashboard from './pages/AdminDashboard';
import AdminUsers from './pages/AdminUsers';
import AdminAuctions from './pages/AdminAuctions';
import AdminBids from './pages/AdminBids';

function App() {
  return (
    // AuthProvider gives all components inside it access to the user state
    <AuthProvider>
      <Router>
        <div className="min-h-screen flex flex-col font-sans">
          {/* Toaster displays our success/error popup messages */}
          <Toaster position="top-right" />
          
          <Navbar />
          
          <main className="flex-1 flex flex-col">
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/auctions" element={<BrowseAuctions />} />
              <Route path="/auction/:id" element={<AuctionDetails />} />
              
              {/* Protected Routes - only accessible if logged in */}
              <Route 
                path="/dashboard" 
                element={
                  <ProtectedRoute>
                    <Dashboard />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/create-auction" 
                element={
                  <ProtectedRoute>
                    <CreateAuction />
                  </ProtectedRoute>
                } 
              />

              {/* Admin Protected Routes - only accessible if logged in AND admin */}
              <Route 
                path="/admin" 
                element={
                  <AdminProtectedRoute>
                    <AdminDashboard />
                  </AdminProtectedRoute>
                } 
              />
              <Route 
                path="/admin/users" 
                element={
                  <AdminProtectedRoute>
                    <AdminUsers />
                  </AdminProtectedRoute>
                } 
              />
              <Route 
                path="/admin/auctions" 
                element={
                  <AdminProtectedRoute>
                    <AdminAuctions />
                  </AdminProtectedRoute>
                } 
              />
              <Route 
                path="/admin/bids" 
                element={
                  <AdminProtectedRoute>
                    <AdminBids />
                  </AdminProtectedRoute>
                } 
              />
            </Routes>
          </main>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
