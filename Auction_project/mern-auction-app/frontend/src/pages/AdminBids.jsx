import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { getAllBids } from '../services/adminService';

const AdminBids = () => {
  const navigate = useNavigate();
  const [bids, setBids] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('recent');

  useEffect(() => {
    fetchBids();
  }, []);

  const fetchBids = async () => {
    try {
      const data = await getAllBids();
      setBids(data);
      setLoading(false);
    } catch (error) {
      toast.error('Failed to load bids');
      setLoading(false);
    }
  };

  const getSortedBids = () => {
    let sorted = [...bids];
    
    switch(sortBy) {
      case 'recent':
        sorted.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        break;
      case 'oldest':
        sorted.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
        break;
      case 'highestBid':
        sorted.sort((a, b) => b.amount - a.amount);
        break;
      case 'lowestBid':
        sorted.sort((a, b) => a.amount - b.amount);
        break;
      default:
        break;
    }
    
    return sorted;
  };

  const filteredBids = getSortedBids().filter(bid =>
    bid.bidder?.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
    bid.auction?.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
          <p className="text-white mt-4">Loading bids...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <button
              onClick={() => navigate('/admin')}
              className="text-purple-400 hover:text-purple-300 mb-4 flex items-center"
            >
              ← Back to Dashboard
            </button>
            <h1 className="text-4xl font-bold text-white">Bid Monitoring</h1>
            <p className="text-purple-200">Total Bids: {bids.length}</p>
          </div>
        </div>

        {/* Filters */}
        <div className="mb-6 grid grid-cols-1 md:grid-cols-2 gap-4">
          <input
            type="text"
            placeholder="Search by bidder or auction..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="px-4 py-3 bg-slate-800 text-white rounded-lg border border-purple-500 border-opacity-30 focus:border-opacity-100 focus:outline-none"
          />
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-4 py-3 bg-slate-800 text-white rounded-lg border border-purple-500 border-opacity-30 focus:border-opacity-100 focus:outline-none"
          >
            <option value="recent">Most Recent</option>
            <option value="oldest">Oldest First</option>
            <option value="highestBid">Highest Bid</option>
            <option value="lowestBid">Lowest Bid</option>
          </select>
        </div>

        {/* Bids Table */}
        <div className="bg-slate-800 bg-opacity-50 backdrop-blur rounded-lg overflow-hidden border border-purple-500 border-opacity-30">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-900 bg-opacity-50 border-b border-purple-500 border-opacity-20">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-purple-300">Bidder</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-purple-300">Auction</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-purple-300">Bid Amount</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-purple-300">Bid Time</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-purple-300">Time Ago</th>
                </tr>
              </thead>
              <tbody>
                {filteredBids.length > 0 ? (
                  filteredBids.map((bid) => {
                    const bidTime = new Date(bid.createdAt);
                    const now = new Date();
                    const diffMs = now - bidTime;
                    const diffMins = Math.floor(diffMs / 60000);
                    const diffHours = Math.floor(diffMs / 3600000);
                    const diffDays = Math.floor(diffMs / 86400000);
                    
                    let timeAgo = '';
                    if (diffMins < 1) timeAgo = 'Just now';
                    else if (diffMins < 60) timeAgo = `${diffMins}m ago`;
                    else if (diffHours < 24) timeAgo = `${diffHours}h ago`;
                    else timeAgo = `${diffDays}d ago`;

                    return (
                      <tr key={bid._id} className="border-b border-purple-500 border-opacity-10 hover:bg-purple-500 hover:bg-opacity-10 transition">
                        <td className="px-6 py-4 text-white font-semibold">{bid.bidder?.username || 'Unknown'}</td>
                        <td className="px-6 py-4 text-purple-200">{bid.auction?.title || 'Unknown'}</td>
                        <td className="px-6 py-4">
                          <span className="text-green-400 font-bold text-lg">${bid.amount.toLocaleString()}</span>
                        </td>
                        <td className="px-6 py-4 text-purple-200">
                          {bidTime.toLocaleString()}
                        </td>
                        <td className="px-6 py-4 text-orange-300 font-semibold">{timeAgo}</td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan="5" className="px-6 py-4 text-center text-purple-300">
                      No bids found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Stats */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-slate-800 bg-opacity-50 backdrop-blur rounded-lg p-6 border border-purple-500 border-opacity-30">
            <p className="text-purple-200 text-sm mb-1">Average Bid Amount</p>
            <p className="text-2xl font-bold text-white">
              ${filteredBids.length > 0 
                ? (filteredBids.reduce((sum, bid) => sum + bid.amount, 0) / filteredBids.length).toLocaleString()
                : 0}
            </p>
          </div>

          <div className="bg-slate-800 bg-opacity-50 backdrop-blur rounded-lg p-6 border border-purple-500 border-opacity-30">
            <p className="text-purple-200 text-sm mb-1">Highest Bid</p>
            <p className="text-2xl font-bold text-green-400">
              ${filteredBids.length > 0 
                ? Math.max(...filteredBids.map(bid => bid.amount)).toLocaleString()
                : 0}
            </p>
          </div>

          <div className="bg-slate-800 bg-opacity-50 backdrop-blur rounded-lg p-6 border border-purple-500 border-opacity-30">
            <p className="text-purple-200 text-sm mb-1">Total Bid Value</p>
            <p className="text-2xl font-bold text-blue-400">
              ${filteredBids.length > 0 
                ? filteredBids.reduce((sum, bid) => sum + bid.amount, 0).toLocaleString()
                : 0}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminBids;
