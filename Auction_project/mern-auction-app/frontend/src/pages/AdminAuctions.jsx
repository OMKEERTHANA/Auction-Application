import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { getAllAuctions, deleteAuction } from '../services/adminService';

const AdminAuctions = () => {
  const navigate = useNavigate();
  const [auctions, setAuctions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  useEffect(() => {
    fetchAuctions();
  }, []);

  const fetchAuctions = async () => {
    try {
      const data = await getAllAuctions();
      setAuctions(data);
      setLoading(false);
    } catch (error) {
      toast.error('Failed to load auctions');
      setLoading(false);
    }
  };

  const handleDeleteAuction = async (auctionId, title) => {
    try {
      await deleteAuction(auctionId);
      setAuctions(auctions.filter(auction => auction._id !== auctionId));
      setDeleteConfirm(null);
      toast.success(`Auction '${title}' deleted successfully`);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to delete auction');
    }
  };

  const filteredAuctions = auctions.filter(auction => {
    const matchesSearch = auction.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || auction.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status) => {
    switch(status) {
      case 'active':
        return 'bg-emerald-500 bg-opacity-20 text-emerald-300';
      case 'ended':
        return 'bg-orange-500 bg-opacity-20 text-orange-300';
      case 'cancelled':
        return 'bg-red-500 bg-opacity-20 text-red-300';
      default:
        return 'bg-gray-500 bg-opacity-20 text-gray-300';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
          <p className="text-white mt-4">Loading auctions...</p>
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
            <h1 className="text-4xl font-bold text-white">Auction Management</h1>
            <p className="text-purple-200">Total Auctions: {auctions.length}</p>
          </div>
        </div>

        {/* Filters */}
        <div className="mb-6 grid grid-cols-1 md:grid-cols-2 gap-4">
          <input
            type="text"
            placeholder="Search by auction title..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="px-4 py-3 bg-slate-800 text-white rounded-lg border border-purple-500 border-opacity-30 focus:border-opacity-100 focus:outline-none"
          />
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-4 py-3 bg-slate-800 text-white rounded-lg border border-purple-500 border-opacity-30 focus:border-opacity-100 focus:outline-none"
          >
            <option value="all">All Statuses</option>
            <option value="active">Active</option>
            <option value="ended">Ended</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>

        {/* Auctions Table */}
        <div className="bg-slate-800 bg-opacity-50 backdrop-blur rounded-lg overflow-hidden border border-purple-500 border-opacity-30">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-900 bg-opacity-50 border-b border-purple-500 border-opacity-20">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-purple-300">Title</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-purple-300">Seller</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-purple-300">Current Bid</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-purple-300">Status</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-purple-300">End Time</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-purple-300">Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredAuctions.length > 0 ? (
                  filteredAuctions.map((auction) => (
                    <tr key={auction._id} className="border-b border-purple-500 border-opacity-10 hover:bg-purple-500 hover:bg-opacity-10 transition">
                      <td className="px-6 py-4 text-white font-semibold">{auction.title}</td>
                      <td className="px-6 py-4 text-purple-200">{auction.seller?.username || 'Unknown'}</td>
                      <td className="px-6 py-4 text-white">${auction.currentBid}</td>
                      <td className="px-6 py-4">
                        <span className={`px-3 py-1 rounded-full text-sm font-semibold ${getStatusColor(auction.status)}`}>
                          {auction.status.charAt(0).toUpperCase() + auction.status.slice(1)}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-purple-200">
                        {new Date(auction.endTime).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4">
                        <button
                          onClick={() => setDeleteConfirm(auction._id)}
                          className="bg-red-600 hover:bg-red-700 text-white font-semibold py-1 px-3 rounded transition"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" className="px-6 py-4 text-center text-purple-300">
                      No auctions found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Delete Confirmation Modal */}
        {deleteConfirm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-slate-800 rounded-lg p-6 max-w-md w-full mx-4 border border-purple-500">
              <h2 className="text-xl font-bold text-white mb-4">Confirm Delete</h2>
              <p className="text-purple-200 mb-6">
                Are you sure you want to delete this auction? This action will also delete all associated bids.
              </p>
              <div className="flex gap-4">
                <button
                  onClick={() => setDeleteConfirm(null)}
                  className="flex-1 bg-slate-700 hover:bg-slate-600 text-white font-semibold py-2 rounded-lg transition"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    const auction = auctions.find(a => a._id === deleteConfirm);
                    handleDeleteAuction(deleteConfirm, auction.title);
                  }}
                  className="flex-1 bg-red-600 hover:bg-red-700 text-white font-semibold py-2 rounded-lg transition"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminAuctions;
