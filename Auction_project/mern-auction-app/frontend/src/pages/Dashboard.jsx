import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { UserCircle, Shield, Mail, Search, PlusCircle } from 'lucide-react';

const Dashboard = () => {
  const { user } = useContext(AuthContext);

  return (
    <div className="flex-1 bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-6">
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
          <div className="flex flex-col md:flex-row items-start gap-6">
            <div className="bg-indigo-100 p-4 rounded-full text-indigo-600">
              <UserCircle className="w-16 h-16" />
            </div>
            <div className="space-y-4 flex-1 w-full">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Welcome, {user?.username}!</h2>
                <p className="text-gray-500">Here is your account overview.</p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 mb-8">
                <div className="flex items-center gap-3 bg-gray-50 p-4 rounded-lg border border-gray-100">
                  <Mail className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-500">Email Address</p>
                    <p className="font-medium text-gray-900">{user?.email}</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3 bg-gray-50 p-4 rounded-lg border border-gray-100">
                  <Shield className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-500">Account Role</p>
                    <p className="font-medium text-gray-900 capitalize">{user?.role}</p>
                  </div>
                </div>
              </div>

              {/* Quick Actions */}
              <div>
                <h3 className="text-lg font-bold text-gray-900 mb-4">Quick Actions</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Link 
                    to="/create-auction" 
                    className="flex flex-col items-center justify-center p-6 bg-indigo-50 hover:bg-indigo-100 border border-indigo-100 rounded-xl transition-colors text-indigo-700"
                  >
                    <PlusCircle className="w-8 h-8 mb-2" />
                    <span className="font-bold">List New Item</span>
                    <span className="text-sm text-indigo-500 mt-1">Start a new auction</span>
                  </Link>
                  <Link 
                    to="/auctions" 
                    className="flex flex-col items-center justify-center p-6 bg-white hover:bg-gray-50 border border-gray-200 rounded-xl transition-colors text-gray-700 shadow-sm"
                  >
                    <Search className="w-8 h-8 mb-2 text-indigo-500" />
                    <span className="font-bold">Browse Auctions</span>
                    <span className="text-sm text-gray-500 mt-1">Find items to bid on</span>
                  </Link>
                </div>
              </div>

            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
