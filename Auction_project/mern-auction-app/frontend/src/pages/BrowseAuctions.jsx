import React, { useState, useEffect } from 'react';
import auctionService from '../services/auctionService';
import AuctionCard from '../components/AuctionCard';
import { Search } from 'lucide-react';
import toast from 'react-hot-toast';

const BrowseAuctions = () => {
  const [auctions, setAuctions] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch all auctions when the component mounts
  useEffect(() => {
    const fetchAuctions = async () => {
      try {
        const data = await auctionService.getAllAuctions();
        setAuctions(data);
      } catch (error) {
        toast.error('Failed to load auctions');
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchAuctions();
  }, []);

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="flex-1 bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Active Auctions</h1>
            <p className="text-gray-500 mt-1">Discover unique items and place your bids.</p>
          </div>
          
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search auctions..."
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white w-full md:w-64"
            />
          </div>
        </div>

        {/* Grid of Auctions */}
        {auctions.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-2xl border border-gray-100">
            <p className="text-gray-500 text-lg">No active auctions found.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {auctions.map((auction) => (
              <AuctionCard key={auction._id} auction={auction} />
            ))}
          </div>
        )}

      </div>
    </div>
  );
};

export default BrowseAuctions;
