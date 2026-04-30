import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { getStatistics } from '../services/adminService';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStatistics();
  }, []);

  const fetchStatistics = async () => {
    try {
      const data = await getStatistics();
      setStats(data);
      setLoading(false);
    } catch (error) {
      toast.error('Failed to load statistics');
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
          <p className="text-white mt-4">Loading Admin Dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">Admin Dashboard</h1>
          <p className="text-purple-200">Manage users, auctions, and monitor platform activity</p>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Total Users Card */}
          <div className="bg-gradient-to-br from-blue-600 to-blue-800 rounded-lg p-6 text-white shadow-lg">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-blue-200 text-sm font-semibold">Total Users</p>
                <p className="text-3xl font-bold mt-2">{stats?.users?.total || 0}</p>
              </div>
              <div className="bg-blue-500 bg-opacity-30 p-3 rounded-full">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM9 10a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
          </div>

          {/* Active Auctions Card */}
          <div className="bg-gradient-to-br from-emerald-600 to-emerald-800 rounded-lg p-6 text-white shadow-lg">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-emerald-200 text-sm font-semibold">Active Auctions</p>
                <p className="text-3xl font-bold mt-2">{stats?.auctions?.active || 0}</p>
              </div>
              <div className="bg-emerald-500 bg-opacity-30 p-3 rounded-full">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M4 4a2 2 0 00-2 2v4a2 2 0 002 2V6h10a2 2 0 00-2-2H4zm2 6a2 2 0 012-2h8a2 2 0 012 2v4a2 2 0 01-2 2H8a2 2 0 01-2-2v-4zm6 4a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                </svg>
              </div>
            </div>
          </div>

          {/* Completed Auctions Card */}
          <div className="bg-gradient-to-br from-orange-600 to-orange-800 rounded-lg p-6 text-white shadow-lg">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-orange-200 text-sm font-semibold">Completed Auctions</p>
                <p className="text-3xl font-bold mt-2">{stats?.auctions?.completed || 0}</p>
              </div>
              <div className="bg-orange-500 bg-opacity-30 p-3 rounded-full">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              </div>
            </div>
          </div>

          {/* Total Bids Card */}
          <div className="bg-gradient-to-br from-pink-600 to-pink-800 rounded-lg p-6 text-white shadow-lg">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-pink-200 text-sm font-semibold">Total Bids</p>
                <p className="text-3xl font-bold mt-2">{stats?.bids?.total || 0}</p>
              </div>
              <div className="bg-pink-500 bg-opacity-30 p-3 rounded-full">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Bid Statistics */}
        <div className="bg-slate-800 bg-opacity-50 backdrop-blur rounded-lg p-6 mb-8 border border-purple-500 border-opacity-30">
          <h2 className="text-xl font-bold text-white mb-4">Bidding Activity</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <p className="text-purple-200 text-sm mb-1">Total Bid Value</p>
              <p className="text-2xl font-bold text-white">${stats?.bids?.totalValue?.toLocaleString() || 0}</p>
            </div>
            <div>
              <p className="text-purple-200 text-sm mb-1">Average Bid Value</p>
              <p className="text-2xl font-bold text-white">${stats?.bids?.averageValue?.toLocaleString() || 0}</p>
            </div>
          </div>
        </div>

        {/* Management Panels */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Manage Users Panel */}
          <div className="bg-slate-800 bg-opacity-50 backdrop-blur rounded-lg p-6 border border-purple-500 border-opacity-30 hover:border-opacity-50 transition">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-xl font-bold text-white">User Management</h2>
                <p className="text-purple-200 text-sm mt-1">View and delete users</p>
              </div>
              <div className="bg-blue-500 bg-opacity-20 p-3 rounded-full">
                <svg className="w-6 h-6 text-blue-400" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M10.5 1.5H5.75A2.25 2.25 0 003.5 3.75v12.5A2.25 2.25 0 005.75 18.5h8.5a2.25 2.25 0 002.25-2.25V6.75" />
                </svg>
              </div>
            </div>
            <button
              onClick={() => navigate('/admin/users')}
              className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-semibold py-2 rounded-lg transition"
            >
              Manage Users
            </button>
          </div>

          {/* Manage Auctions Panel */}
          <div className="bg-slate-800 bg-opacity-50 backdrop-blur rounded-lg p-6 border border-purple-500 border-opacity-30 hover:border-opacity-50 transition">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-xl font-bold text-white">Auction Management</h2>
                <p className="text-purple-200 text-sm mt-1">Delete spam/fake auctions</p>
              </div>
              <div className="bg-emerald-500 bg-opacity-20 p-3 rounded-full">
                <svg className="w-6 h-6 text-emerald-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm0-2a6 6 0 100-12 6 6 0 000 12z" clipRule="evenodd" />
                </svg>
              </div>
            </div>
            <button
              onClick={() => navigate('/admin/auctions')}
              className="w-full bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white font-semibold py-2 rounded-lg transition"
            >
              Manage Auctions
            </button>
          </div>

          {/* Monitor Bids Panel */}
          <div className="bg-slate-800 bg-opacity-50 backdrop-blur rounded-lg p-6 border border-purple-500 border-opacity-30 hover:border-opacity-50 transition">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-xl font-bold text-white">Bid Monitoring</h2>
                <p className="text-purple-200 text-sm mt-1">View all bids and activity</p>
              </div>
              <div className="bg-orange-500 bg-opacity-20 p-3 rounded-full">
                <svg className="w-6 h-6 text-orange-400" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h12a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6z" />
                </svg>
              </div>
            </div>
            <button
              onClick={() => navigate('/admin/bids')}
              className="w-full bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-semibold py-2 rounded-lg transition"
            >
              Monitor Bids
            </button>
          </div>

          {/* Platform Stats Panel */}
          <div className="bg-slate-800 bg-opacity-50 backdrop-blur rounded-lg p-6 border border-purple-500 border-opacity-30 hover:border-opacity-50 transition">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-xl font-bold text-white">Platform Stats</h2>
                <p className="text-purple-200 text-sm mt-1">View detailed analytics</p>
              </div>
              <div className="bg-pink-500 bg-opacity-20 p-3 rounded-full">
                <svg className="w-6 h-6 text-pink-400" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M2 11a1 1 0 011-1h2a1 1 0 011 1v5a1 1 0 01-1 1H3a1 1 0 01-1-1v-5zM8 7a1 1 0 011-1h2a1 1 0 011 1v9a1 1 0 01-1 1H9a1 1 0 01-1-1V7zM14 4a1 1 0 011-1h2a1 1 0 011 1v12a1 1 0 01-1 1h-2a1 1 0 01-1-1V4z" />
                </svg>
              </div>
            </div>
            <button
              onClick={() => window.location.reload()}
              className="w-full bg-gradient-to-r from-pink-500 to-pink-600 hover:from-pink-600 hover:to-pink-700 text-white font-semibold py-2 rounded-lg transition"
            >
              Refresh Stats
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
