import React, { useState } from 'react';
import { User, Lock } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Banner from '@/components/Banner';

const SettingsPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'profile' | 'account'>('profile');


  return (
    <div className="min-h-screen bg-[#F8F6FF]">
      <Navbar />
      <Banner title='Settings' subtitle='Personalize your experience here!' />
      <div className="max-w-6xl mx-auto px-6 py-8">
        <div className="flex gap-8">
          <div className="w-64">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
              <button
                onClick={() => setActiveTab('profile')}
                className={`w-full flex items-center px-4 py-3 text-left border-b border-gray-200 transition-colors ${
                  activeTab === 'profile'
                    ? 'bg-gray-100 text-gray-900'
                    : 'bg-white text-gray-700 hover:bg-gray-50'
                }`}
              >
                <User className="w-4 h-4 mr-3 text-gray-500" />
                Profile
              </button>
              <button
                onClick={() => setActiveTab('account')}
                className={`w-full flex items-center px-4 py-3 text-left transition-colors ${
                  activeTab === 'account'
                    ? 'bg-gray-100 text-gray-900'
                    : 'bg-white text-gray-700 hover:bg-gray-50'
                }`}
              >
                <Lock className="w-4 h-4 mr-3 text-gray-500" />
                Account
              </button>
            </div>
          </div>

          <div className="flex-1">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              {activeTab === 'profile' ? (
                <div>
                  <h2 className="text-xl font-semibold text-gray-900 mb-2">Profile Information</h2>
                  <p className="text-gray-600 mb-6">Update your basic profile information</p>
                  
                  <div className="space-y-6">
                    <div>
                      <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 mb-2">
                        Full Name
                      </label>
                      <input
                        type="text"
                        id="fullName"
                        // value=
                        // onChange=
                        className="bg-[#cebff9]/20 backdrop-blur-sm border border-white/30 rounded-lg px-4 py-2 text-base placeholder-gray-500 focus:border-secondary-foreground w-full transition-all duration-200"
                        placeholder="Enter your full name"
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                        Email Address
                      </label>
                      <input
                        type="email"
                        id="email"
                        // value=
                        // onChange=
                        className="bg-[#cebff9]/20 backdrop-blur-sm border border-white/30 rounded-lg px-4 py-2 text-base placeholder-gray-500 focus:border-secondary-foreground w-full transition-all duration-200"
                        placeholder="Enter your email address"
                      />
                    </div>
                  </div>
                  
                  <div className="flex gap-3 mt-8">
                    <button
                      // onClick=
                      className="px-4 py-2 bg-secondary-foreground text-white rounded-md hover:bg-secondary-foreground/70 transition-colors font-medium"
                    >
                      Save Changes
                    </button>
                    <button
                      // onClick=
                      className="px-4 py-2 bg-white text-gray-700 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors font-medium"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <div className="text-center py-16">
                  <Lock className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <h2 className="text-xl font-semibold text-gray-900 mb-2">Account Settings</h2>
                  <p className="text-gray-600 max-w-md mx-auto">
                    Account management features are currently under development. 
                    This section will be available soon with advanced security and 
                    account configuration options.
                  </p>
                  <div className="mt-6">
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-yellow-100 text-yellow-800">
                      Coming Soon
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;