import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import auctionService from '../services/auctionService';
import { AuthContext } from '../context/AuthContext';
import { Clock, TrendingUp, User, History } from 'lucide-react';
import toast from 'react-hot-toast';

const AuctionDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  
  const [auction, setAuction] = useState(null);
  const [bids, setBids] = useState([]);
  const [loading, setLoading] = useState(true);
  const [bidAmount, setBidAmount] = useState('');
  const [isBidding, setIsBidding] = useState(false);
  const [timeLeft, setTimeLeft] = useState('');

  // Fetch auction data
  const fetchAuctionDetails = async () => {
    try {
      const data = await auctionService.getAuctionById(id);
      setAuction(data.auction);
      setBids(data.bids);
      // Automatically suggest the next minimum bid
      setBidAmount(data.auction.currentBid + 10);
    } catch (error) {
      toast.error('Failed to load auction details');
      navigate('/auctions');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAuctionDetails();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  // Countdown Timer Logic
  useEffect(() => {
    if (!auction) return;
    
    if (auction.status !== 'active') {
      setTimeLeft(auction.status.charAt(0).toUpperCase() + auction.status.slice(1));
      return;
    }

    const calculateTimeLeft = () => {
      const difference = new Date(auction.endTime) - new Date();
      if (difference <= 0) {
        setTimeLeft('Ended');
        // If it just ended while viewing, refresh to see the winner
        fetchAuctionDetails();
        return;
      }
      
      const days = Math.floor(difference / (1000 * 60 * 60 * 24));
      const hours = Math.floor((difference / (1000 * 60 * 60)) % 24);
      const minutes = Math.floor((difference / 1000 / 60) % 60);
      const seconds = Math.floor((difference / 1000) % 60);

      setTimeLeft(`${days}d ${hours}h ${minutes}m ${seconds}s`);
    };

    calculateTimeLeft();
    const timerId = setInterval(calculateTimeLeft, 1000);
    return () => clearInterval(timerId);
  }, [auction]);

  // Handle placing a bid
  const handlePlaceBid = async (e) => {
    e.preventDefault();
    if (!user) {
      toast.error('You must be logged in to place a bid');
      navigate('/login');
      return;
    }

    setIsBidding(true);
    try {
      await auctionService.placeBid(auction._id, bidAmount);
      toast.success('Bid placed successfully!');
      // Refresh the data to show the new bid
      await fetchAuctionDetails();
      setBidAmount('');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to place bid');
    } finally {
      setIsBidding(false);
    }
  };

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  const isEnded = auction.status !== 'active' || timeLeft === 'Ended';
  const isSeller = user && auction.seller._id === user._id;

  return (
    <div className="flex-1 bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column: Image and Details */}
        <div className="lg:col-span-2 space-y-8">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="h-96 bg-gray-200 relative">
              <img
                src={auction.image || 'https://via.placeholder.com/800x600?text=No+Image'}
                alt={auction.title}
                className="w-full h-full object-cover"
              />
              <div className={`absolute top-4 right-4 px-4 py-2 rounded-full font-bold shadow-md ${isEnded ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
                {isEnded ? 'Auction Closed' : 'Live Auction'}
              </div>
            </div>
            <div className="p-8">
              <h1 className="text-3xl font-bold text-gray-900 mb-4">{auction.title}</h1>
              <div className="flex items-center gap-2 text-sm text-gray-500 mb-6 pb-6 border-b border-gray-100">
                <User className="w-4 h-4" />
                <span>Listed by <span className="font-semibold text-gray-700">{auction.seller.username}</span></span>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Description</h3>
              <p className="text-gray-600 leading-relaxed whitespace-pre-wrap">{auction.description}</p>
            </div>
          </div>
        </div>

        {/* Right Column: Bidding UI and History */}
        <div className="space-y-8">
          {/* Bidding Card */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sticky top-6">
            <div className="text-center pb-6 border-b border-gray-100 mb-6">
              <p className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-2">Time Remaining</p>
              <div className={`flex items-center justify-center gap-2 text-2xl font-bold ${isEnded ? 'text-red-600' : 'text-gray-900'}`}>
                <Clock className="w-6 h-6" />
                {timeLeft}
              </div>
            </div>

            <div className="mb-8 text-center">
              <p className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-2">Current Highest Bid</p>
              <div className="flex items-center justify-center gap-2 text-4xl font-extrabold text-indigo-600">
                <TrendingUp className="w-8 h-8" />
                ${auction.currentBid.toLocaleString()}
              </div>
              <p className="text-xs text-gray-400 mt-2">Starting price: ${auction.basePrice}</p>
            </div>

            {/* Winner Display */}
            {isEnded && auction.winner && (
              <div className="bg-green-50 border border-green-200 text-green-800 rounded-lg p-4 mb-6 text-center">
                <p className="font-bold text-lg">Auction Won!</p>
                <p>Winner: {auction.winner.username}</p>
              </div>
            )}

            {/* Place Bid Form */}
            {!isEnded && (
              <>
                {isSeller ? (
                  <div className="bg-gray-100 text-gray-600 rounded-lg p-4 text-center text-sm font-medium">
                    You cannot bid on your own auction.
                  </div>
                ) : (
                  <form onSubmit={handlePlaceBid} className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Your Bid Amount ($)</label>
                      <input
                        type="number"
                        required
                        min={auction.currentBid + 1}
                        value={bidAmount}
                        onChange={(e) => setBidAmount(e.target.value)}
                        className="w-full py-3 px-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-lg font-bold text-center"
                      />
                    </div>
                    <button
                      type="submit"
                      disabled={isBidding}
                      className={`w-full py-3.5 px-4 text-white font-bold bg-indigo-600 rounded-lg hover:bg-indigo-700 transition ${isBidding ? 'opacity-70 cursor-not-allowed' : ''}`}
                    >
                      {isBidding ? 'Placing Bid...' : 'Place Bid'}
                    </button>
                    <p className="text-xs text-center text-gray-500">
                      By placing a bid, you commit to buying this item if you win.
                    </p>
                  </form>
                )}
              </>
            )}
          </div>

          {/* Bid History */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center gap-2 mb-4 pb-2 border-b border-gray-100">
              <History className="w-5 h-5 text-gray-500" />
              <h3 className="font-bold text-gray-900">Bid History ({bids.length})</h3>
            </div>
            
            {bids.length === 0 ? (
              <p className="text-gray-500 text-sm text-center py-4">No bids placed yet.</p>
            ) : (
              <ul className="space-y-3 max-h-60 overflow-y-auto pr-2">
                {bids.map((bid) => (
                  <li key={bid._id} className="flex justify-between items-center text-sm p-3 bg-gray-50 rounded-lg border border-gray-100">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold text-xs">
                        {bid.bidder.username.charAt(0).toUpperCase()}
                      </div>
                      <span className="font-medium text-gray-900">{bid.bidder.username}</span>
                    </div>
                    <div className="text-right">
                      <span className="font-bold text-gray-900">${bid.amount.toLocaleString()}</span>
                      <p className="text-xs text-gray-400">{new Date(bid.createdAt).toLocaleTimeString()}</p>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuctionDetails;
