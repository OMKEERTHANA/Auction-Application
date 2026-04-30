import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

const auctionService = {
  // Fetch all auctions
  getAllAuctions: async () => {
    const response = await axios.get(`${API_URL}/auctions`);
    return response.data;
  },

  // Fetch a single auction by ID
  getAuctionById: async (id) => {
    const response = await axios.get(`${API_URL}/auctions/${id}`);
    return response.data;
  },

  // Create a new auction (Requires auth token automatically attached by interceptor)
  createAuction: async (auctionData) => {
    const response = await axios.post(`${API_URL}/auctions`, auctionData);
    return response.data;
  },

  // Place a bid on an auction
  placeBid: async (auctionId, amount) => {
    const response = await axios.post(`${API_URL}/bids/${auctionId}`, { amount });
    return response.data;
  }
};

export default auctionService;
