import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

const Home = () => {
  return (
    <div className="flex-1 flex flex-col items-center justify-center bg-gray-50 text-center px-4">
      <div className="max-w-3xl space-y-8">
        <h1 className="text-5xl md:text-6xl font-extrabold text-gray-900 tracking-tight">
          Welcome to <span className="text-indigo-600">BidMaster</span>
        </h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          The most reliable platform to discover, bid, and win exclusive items. Join our community and start your bidding journey today.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
          <Link
            to="/register"
            className="inline-flex items-center justify-center gap-2 px-8 py-3.5 text-base font-semibold text-white bg-indigo-600 rounded-full hover:bg-indigo-700 hover:shadow-lg transition-all"
          >
            Start Bidding
            <ArrowRight className="w-5 h-5" />
          </Link>
          <Link
            to="/login"
            className="inline-flex items-center justify-center px-8 py-3.5 text-base font-semibold text-gray-700 bg-white border border-gray-300 rounded-full hover:bg-gray-50 hover:shadow-sm transition-all"
          >
            Log into Account
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Home;
