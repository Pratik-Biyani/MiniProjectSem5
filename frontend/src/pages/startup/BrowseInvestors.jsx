// BrowseInvestorsPage.js
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const BrowseInvestorsPage = () => {
  const [investors, setInvestors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    domain: '',
    subscriptionStatus: ''
  });
  const navigate = useNavigate();

  // Fetch investors from your API
  const fetchInvestors = async () => {
    try {
      setLoading(true);
      const response = await fetch('http://localhost:5001/api/users/chat/users');
      
      if (!response.ok) {
        throw new Error('Failed to fetch investors');
      }
      
      const result = await response.json();
      
      if (result.success) {
        // Filter users to only show investors
        const investorUsers = result.data.users.filter(user => user.role === 'investor');
        setInvestors(investorUsers);
      } else {
        throw new Error(result.message || 'Failed to fetch investors');
      }
    } catch (err) {
      console.error('Error fetching investors:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInvestors();
  }, []);

  // Filter investors based on search and filters
  const filteredInvestors = investors.filter(investor => {
    const matchesSearch = investor.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         investor.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         investor.domain?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesDomain = !filters.domain || investor.domain?.toLowerCase().includes(filters.domain.toLowerCase());
    const matchesSubscription = !filters.subscriptionStatus || 
                               (filters.subscriptionStatus === 'subscribed' && investor.isSubscribed) ||
                               (filters.subscriptionStatus === 'unsubscribed' && !investor.isSubscribed);

    return matchesSearch && matchesDomain && matchesSubscription;
  });

  // Get unique domains for filter dropdown
  const domains = [...new Set(investors.map(inv => inv.domain).filter(Boolean))];

  const handleFilterChange = (filterType, value) => {
    setFilters(prev => ({
      ...prev,
      [filterType]: value
    }));
  };

  const clearFilters = () => {
    setFilters({
      domain: '',
      subscriptionStatus: ''
    });
    setSearchTerm('');
  };

  const handleConnect = (investorId) => {
    // Navigate to chat or initiate connection
    navigate(`/chat?user=${investorId}`);
  };

  const handleVideoCall = async (investorId) => {
    try {
      const response = await fetch('http://localhost:5001/api/call/generate-room');
      const result = await response.json();
      
      if (result.success) {
        navigate(`/call/${result.data.roomId}?targetUser=${investorId}`);
      }
    } catch (error) {
      console.error('Error generating call room:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading investors...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="text-red-500 text-2xl mb-4">⚠️</div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Error</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button 
            onClick={fetchInvestors}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Browse Investors
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Connect with verified investors and explore partnership opportunities
          </p>
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
          {/* Search Box */}
          <div className="mb-6">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg className="h-5 w-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                </svg>
              </div>
              <input
                type="text"
                placeholder="Search investors by name, email, or domain..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="block w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              />
            </div>
          </div>

          {/* Filters Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Domain/Industry
              </label>
              <select
                value={filters.domain}
                onChange={(e) => handleFilterChange('domain', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              >
                <option value="">All Domains</option>
                {domains.map(domain => (
                  <option key={domain} value={domain}>{domain}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Subscription Status
              </label>
              <select
                value={filters.subscriptionStatus}
                onChange={(e) => handleFilterChange('subscriptionStatus', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              >
                <option value="">All Status</option>
                <option value="subscribed">Subscribed</option>
                <option value="unsubscribed">Not Subscribed</option>
              </select>
            </div>

            <button 
              onClick={clearFilters}
              className="w-full md:w-auto px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
            >
              Clear Filters
            </button>
          </div>
        </div>

        {/* Results Count */}
        <div className="mb-6 flex justify-between items-center">
          <p className="text-gray-600">
            Showing <span className="font-semibold text-gray-900">{filteredInvestors.length}</span> of{' '}
            <span className="font-semibold text-gray-900">{investors.length}</span> investors
          </p>
          
          {/* Sort Options */}
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-600">Sort by:</span>
            <select className="text-sm border border-gray-300 rounded-lg px-3 py-1 focus:ring-2 focus:ring-blue-500">
              <option value="name">Name</option>
              <option value="recent">Most Recent</option>
              <option value="domain">Domain</option>
            </select>
          </div>
        </div>

        {/* Investors Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredInvestors.length > 0 ? (
            filteredInvestors.map(investor => (
              <InvestorCard 
                key={investor.userId} 
                investor={investor}
                onConnect={handleConnect}
                onVideoCall={handleVideoCall}
              />
            ))
          ) : (
            <div className="col-span-full text-center py-12">
              <div className="text-gray-400 text-6xl mb-4">🔍</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No investors found</h3>
              <p className="text-gray-600">Try adjusting your search criteria or filters</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// Investor Card Component
const InvestorCard = ({ investor, onConnect, onVideoCall }) => {
  const [showDetails, setShowDetails] = useState(false);

  const getSubscriptionBadge = (isSubscribed) => {
    return isSubscribed ? (
      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
        Subscribed
      </span>
    ) : (
      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
        Free Tier
      </span>
    );
  };

  const getRoleBadge = (role) => {
    const roleConfig = {
      investor: { color: 'bg-purple-100 text-purple-800', label: 'Investor' },
      admin: { color: 'bg-red-100 text-red-800', label: 'Admin' },
      startup: { color: 'bg-blue-100 text-blue-800', label: 'Startup' }
    };
    
    const config = roleConfig[role] || { color: 'bg-gray-100 text-gray-800', label: role };
    
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.color}`}>
        {config.label}
      </span>
    );
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow duration-300">
      {/* Card Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-start space-x-4 flex-1">
          <div className="flex-shrink-0">
            <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-full flex items-center justify-center text-white font-bold text-xl">
              {investor.name?.charAt(0).toUpperCase() || 'I'}
            </div>
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center space-x-2 mb-1">
              <h3 className="text-lg font-semibold text-gray-900 truncate">
                {investor.name}
              </h3>
              {getRoleBadge(investor.role)}
            </div>
            <p className="text-gray-500 text-sm truncate mb-1">
              {investor.email}
            </p>
            <div className="flex items-center space-x-2">
              {getSubscriptionBadge(investor.isSubscribed)}
              <span className="text-xs text-gray-400">
                Joined {new Date(investor.createdAt).toLocaleDateString()}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Investor Details */}
      <div className="space-y-3 mb-6">
        {investor.domain && (
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium text-gray-700">Domain:</span>
            <span className="text-sm text-gray-900 bg-blue-50 px-2 py-1 rounded">
              {investor.domain}
            </span>
          </div>
        )}
        
        {/* Additional details that can be shown/hidden */}
        {showDetails && (
          <>
            <div className="border-t pt-3 mt-3">
              <div className="flex justify-between items-center text-sm">
                <span className="font-medium text-gray-700">Member Since:</span>
                <span className="text-gray-900">
                  {new Date(investor.createdAt).toLocaleDateString()}
                </span>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Action Buttons */}
      <div className="flex space-x-3">
        <button 
          onClick={() => onConnect(investor.userId)}
          className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg transition-colors duration-200 font-medium text-sm flex items-center justify-center"
        >
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
          </svg>
          Message
        </button>
        
        <button 
          onClick={() => onVideoCall(investor.userId)}
          className="flex-1 bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-lg transition-colors duration-200 font-medium text-sm flex items-center justify-center"
        >
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
          </svg>
          Call
        </button>
      </div>

      {/* Toggle Details Button */}
      <button 
        onClick={() => setShowDetails(!showDetails)}
        className="w-full mt-3 text-center text-sm text-blue-600 hover:text-blue-700 font-medium"
      >
        {showDetails ? 'Show Less' : 'Show More'}
      </button>
    </div>
  );
};

export default BrowseInvestorsPage;