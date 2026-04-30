import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Clock, TrendingUp } from 'lucide-react';

const AuctionCard = ({ auction }) => {
  const [timeLeft, setTimeLeft] = useState('');

  // Countdown Timer Logic
  useEffect(() => {
    // If the auction is already ended or cancelled, no need for a timer
    if (auction.status !== 'active') {
      setTimeLeft(auction.status.charAt(0).toUpperCase() + auction.status.slice(1));
      return;
    }

    const calculateTimeLeft = () => {
      const difference = new Date(auction.endTime) - new Date();
      
      if (difference <= 0) {
        setTimeLeft('Ended');
        return;
      }

      const days = Math.floor(difference / (1000 * 60 * 60 * 24));
      const hours = Math.floor((difference / (1000 * 60 * 60)) % 24);
      const minutes = Math.floor((difference / 1000 / 60) % 60);
      const seconds = Math.floor((difference / 1000) % 60);

      if (days > 0) {
        setTimeLeft(`${days}d ${hours}h left`);
      } else {
        setTimeLeft(`${hours}h ${minutes}m ${seconds}s left`);
      }
    };

    // Calculate immediately, then every second
    calculateTimeLeft();
    const timerId = setInterval(calculateTimeLeft, 1000);

    // Cleanup timer when component unmounts
    return () => clearInterval(timerId);
  }, [auction.endTime, auction.status]);

  const isEnded = timeLeft === 'Ended' || auction.status === 'ended';

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-lg transition-all flex flex-col">
      <div className="relative h-48 w-full bg-gray-200">
        <img
          src={auction.image || 'https://via.placeholder.com/400x300?text=No+Image'}
          alt={auction.title}
          className="w-full h-full object-cover"
        />
        <div className={`absolute top-4 right-4 px-3 py-1 rounded-full text-xs font-bold ${isEnded ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
          {isEnded ? 'Closed' : 'Active'}
        </div>
      </div>
      
      <div className="p-5 flex-1 flex flex-col">
        <h3 className="text-xl font-bold text-gray-900 mb-2 line-clamp-1">{auction.title}</h3>
        <p className="text-gray-500 text-sm line-clamp-2 mb-4 flex-1">
          {auction.description}
        </p>

        <div className="flex items-center justify-between mb-4 pb-4 border-b border-gray-100">
          <div>
            <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold">Current Bid</p>
            <div className="flex items-center gap-1 text-lg font-bold text-indigo-600">
              <TrendingUp className="w-4 h-4" />
              ${auction.currentBid.toLocaleString()}
            </div>
          </div>
          <div className="text-right">
            <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold">Time Left</p>
            <div className={`flex items-center gap-1 font-medium ${isEnded ? 'text-red-500' : 'text-gray-900'}`}>
              <Clock className="w-4 h-4" />
              {timeLeft}
            </div>
          </div>
        </div>

        <Link
          to={`/auction/${auction._id}`}
          className={`w-full py-2.5 rounded-lg text-center font-semibold transition-colors ${
            isEnded 
              ? 'bg-gray-100 text-gray-600 hover:bg-gray-200' 
              : 'bg-indigo-600 text-white hover:bg-indigo-700'
          }`}
        >
          {isEnded ? 'View Details' : 'Place Bid'}
        </Link>
      </div>
    </div>
  );
};

export default AuctionCard;
