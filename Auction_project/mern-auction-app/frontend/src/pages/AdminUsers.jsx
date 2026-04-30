import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { getAllUsers, deleteUser } from '../services/adminService';

const AdminUsers = () => {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const data = await getAllUsers();
      setUsers(data);
      setLoading(false);
    } catch (error) {
      toast.error('Failed to load users');
      setLoading(false);
    }
  };

  const handleDeleteUser = async (userId, username) => {
    try {
      await deleteUser(userId);
      setUsers(users.filter(user => user._id !== userId));
      setDeleteConfirm(null);
      toast.success(`User '${username}' deleted successfully`);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to delete user');
    }
  };

  const filteredUsers = users.filter(user =>
  (user.username || user.name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
  (user.email || '').toLowerCase().includes(searchTerm.toLowerCase())
);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
          <p className="text-white mt-4">Loading users...</p>
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
            <h1 className="text-4xl font-bold text-white">User Management</h1>
            <p className="text-purple-200">Total Users: {users.length}</p>
          </div>
        </div>

        {/* Search Bar */}
        <div className="mb-6">
          <input
            type="text"
            placeholder="Search by username or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-3 bg-slate-800 text-white rounded-lg border border-purple-500 border-opacity-30 focus:border-opacity-100 focus:outline-none"
          />
        </div>

        {/* Users Table */}
        <div className="bg-slate-800 bg-opacity-50 backdrop-blur rounded-lg overflow-hidden border border-purple-500 border-opacity-30">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-900 bg-opacity-50 border-b border-purple-500 border-opacity-20">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-purple-300">Username</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-purple-300">Email</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-purple-300">Role</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-purple-300">Joined</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-purple-300">Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.length > 0 ? (
                  filteredUsers.map((user) => (
                    <tr key={user._id} className="border-b border-purple-500 border-opacity-10 hover:bg-purple-500 hover:bg-opacity-10 transition">
                      <td className="px-6 py-4 text-white">{user.username || user.name}</td>
                      <td className="px-6 py-4 text-purple-200">{user.email}</td>
                      <td className="px-6 py-4">
                        <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                          user.role === 'admin'
                            ? 'bg-red-500 bg-opacity-20 text-red-300'
                            : 'bg-blue-500 bg-opacity-20 text-blue-300'
                        }`}>
                          {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-purple-200">
                        {new Date(user.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4">
                        <button
                          onClick={() => setDeleteConfirm(user._id)}
                          className="bg-red-600 hover:bg-red-700 text-white font-semibold py-1 px-3 rounded transition"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" className="px-6 py-4 text-center text-purple-300">
                      No users found
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
                Are you sure you want to delete this user? This action will also delete all their auctions and bids.
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
                    const user = users.find(u => u._id === deleteConfirm);
                    handleDeleteUser(deleteConfirm, user.username || user.name);
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

export default AdminUsers;
