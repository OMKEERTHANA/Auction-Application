import axios from 'axios';

const API_URL = 'http://localhost:5000/api/admin';

// ==================== USER MANAGEMENT ====================

export const getAllUsers = async () => {
  try {
    const response = await axios.get(`${API_URL}/users`);
    return response.data.users;
  } catch (error) {
    console.error('Error fetching users:', error.response?.data?.message);
    throw error;
  }
};

export const deleteUser = async (userId) => {
  try {
    const response = await axios.delete(`${API_URL}/users/${userId}`);
    return response.data;
  } catch (error) {
    console.error('Error deleting user:', error.response?.data?.message);
    throw error;
  }
};

// ==================== AUCTION MANAGEMENT ====================

export const getAllAuctions = async () => {
  try {
    const response = await axios.get(`${API_URL}/auctions`);
    return response.data.auctions;
  } catch (error) {
    console.error('Error fetching auctions:', error.response?.data?.message);
    throw error;
  }
};

export const deleteAuction = async (auctionId) => {
  try {
    const response = await axios.delete(`${API_URL}/auctions/${auctionId}`);
    return response.data;
  } catch (error) {
    console.error('Error deleting auction:', error.response?.data?.message);
    throw error;
  }
};

// ==================== BID MANAGEMENT ====================

export const getAllBids = async () => {
  try {
    const response = await axios.get(`${API_URL}/bids`);
    return response.data.bids;
  } catch (error) {
    console.error('Error fetching bids:', error.response?.data?.message);
    throw error;
  }
};

// ==================== STATISTICS ====================

export const getStatistics = async () => {
  try {
    const response = await axios.get(`${API_URL}/statistics`);
    return response.data.statistics;
  } catch (error) {
    console.error('Error fetching statistics:', error.response?.data?.message);
    throw error;
  }
};
