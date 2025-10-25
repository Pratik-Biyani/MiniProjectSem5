// BrowseStartupsPage.js
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const BrowseStartupsPage = () => {
  const [startups, setStartups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    industry: '',
    businessStage: '',
    fundingStage: '',
    teamSize: ''
  });
  const [selectedStartup, setSelectedStartup] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const navigate = useNavigate();

  // Fetch startups with additional info
  const fetchStartups = async () => {
    try {
      setLoading(true);
      
      const usersResponse = await fetch('http://localhost:5001/api/users/chat/users');
      if (!usersResponse.ok) {
        throw new Error('Failed to fetch users');
      }
      
      const usersResult = await usersResponse.json();
      
      if (usersResult.success) {
        const startupUsers = usersResult.data.users.filter(user => user.role === 'startup');
        
        const startupsWithDetails = await Promise.all(
          startupUsers.map(async (startup) => {
            try {
              const additionalInfoResponse = await fetch(`http://localhost:5001/api/additional-info/${startup.userId}`);
              if (additionalInfoResponse.ok) {
                const additionalInfoResult = await additionalInfoResponse.json();
                if (additionalInfoResult.success && additionalInfoResult.data) {
                  return { ...startup, additionalInfo: additionalInfoResult.data };
                }
              }
              return { ...startup, additionalInfo: null };
            } catch (error) {
              console.error(`Error fetching additional info for ${startup.userId}:`, error);
              return { ...startup, additionalInfo: null };
            }
          })
        );
        
        setStartups(startupsWithDetails);
      } else {
        throw new Error(usersResult.message || 'Failed to fetch users');
      }
    } catch (err) {
      console.error('Error fetching startups:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStartups();
  }, []);

  // Filter startups based on search and filters
  const filteredStartups = startups.filter(startup => {
    const matchesSearch = startup.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         startup.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         startup.additionalInfo?.industry?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         startup.additionalInfo?.targetMarket?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesIndustry = !filters.industry || startup.additionalInfo?.industry === filters.industry;
    const matchesBusinessStage = !filters.businessStage || startup.additionalInfo?.businessStage === filters.businessStage;
    const matchesFundingStage = !filters.fundingStage || startup.additionalInfo?.fundingStage === filters.fundingStage;
    const matchesTeamSize = !filters.teamSize || 
                           (filters.teamSize === '1-10' && startup.additionalInfo?.teamSize <= 10) ||
                           (filters.teamSize === '11-50' && startup.additionalInfo?.teamSize > 10 && startup.additionalInfo?.teamSize <= 50) ||
                           (filters.teamSize === '50+' && startup.additionalInfo?.teamSize > 50);

    return matchesSearch && matchesIndustry && matchesBusinessStage && matchesFundingStage && matchesTeamSize;
  });

  // Get unique values for filters
  const industries = [...new Set(startups.map(s => s.additionalInfo?.industry).filter(Boolean))];
  const businessStages = [...new Set(startups.map(s => s.additionalInfo?.businessStage).filter(Boolean))];
  const fundingStages = [...new Set(startups.map(s => s.additionalInfo?.fundingStage).filter(Boolean))];

  const handleFilterChange = (filterType, value) => {
    setFilters(prev => ({
      ...prev,
      [filterType]: value
    }));
  };

  const clearFilters = () => {
    setFilters({
      industry: '',
      businessStage: '',
      fundingStage: '',
      teamSize: ''
    });
    setSearchTerm('');
  };

  const handleConnect = (startupId) => {
    navigate(`/chat?user=${startupId}`);
  };

  const handleVideoCall = async (startupId) => {
    try {
      const response = await fetch('http://localhost:5001/api/call/generate-room');
      const result = await response.json();
      
      if (result.success) {
        navigate(`/call/${result.data.roomId}?targetUser=${startupId}`);
      }
    } catch (error) {
      console.error('Error generating call room:', error);
    }
  };

  const handleShowDetails = (startup) => {
    setSelectedStartup(startup);
    setShowDetailModal(true);
  };

  // Format enum values for display
  const formatEnumValue = (value) => {
    if (!value) return '';
    return value.split('-').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading startups...</p>
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
            onClick={fetchStartups}
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
            Browse Startups
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Discover innovative startups and explore investment opportunities
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
                placeholder="Search startups by name, industry, or target market..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="block w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              />
            </div>
          </div>

          {/* Filters Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 items-end">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Industry
              </label>
              <select
                value={filters.industry}
                onChange={(e) => handleFilterChange('industry', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              >
                <option value="">All Industries</option>
                {industries.map(industry => (
                  <option key={industry} value={industry}>
                    {formatEnumValue(industry)}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Business Stage
              </label>
              <select
                value={filters.businessStage}
                onChange={(e) => handleFilterChange('businessStage', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              >
                <option value="">All Stages</option>
                {businessStages.map(stage => (
                  <option key={stage} value={stage}>
                    {formatEnumValue(stage)}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Funding Stage
              </label>
              <select
                value={filters.fundingStage}
                onChange={(e) => handleFilterChange('fundingStage', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              >
                <option value="">All Funding</option>
                {fundingStages.map(stage => (
                  <option key={stage} value={stage}>
                    {formatEnumValue(stage)}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Team Size
              </label>
              <select
                value={filters.teamSize}
                onChange={(e) => handleFilterChange('teamSize', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              >
                <option value="">Any Size</option>
                <option value="1-10">1-10</option>
                <option value="11-50">11-50</option>
                <option value="50+">50+</option>
              </select>
            </div>

            <button 
              onClick={clearFilters}
              className="w-full px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
            >
              Clear Filters
            </button>
          </div>
        </div>

        {/* Results Count */}
        <div className="mb-6 flex justify-between items-center">
          <p className="text-gray-600">
            Showing <span className="font-semibold text-gray-900">{filteredStartups.length}</span> of{' '}
            <span className="font-semibold text-gray-900">{startups.length}</span> startups
          </p>
        </div>

        {/* Startups Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredStartups.length > 0 ? (
            filteredStartups.map(startup => (
              <StartupCard 
                key={startup.userId} 
                startup={startup}
                onConnect={handleConnect}
                onVideoCall={handleVideoCall}
                onShowDetails={handleShowDetails}
                formatEnumValue={formatEnumValue}
              />
            ))
          ) : (
            <div className="col-span-full text-center py-12">
              <div className="text-gray-400 text-6xl mb-4">🔍</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No startups found</h3>
              <p className="text-gray-600">Try adjusting your search criteria or filters</p>
            </div>
          )}
        </div>

        {/* Detail Modal */}
        {showDetailModal && selectedStartup && (
          <StartupDetailModal
            startup={selectedStartup}
            onClose={() => setShowDetailModal(false)}
            onConnect={handleConnect}
            onVideoCall={handleVideoCall}
            formatEnumValue={formatEnumValue}
          />
        )}
      </div>
    </div>
  );
};

// Startup Card Component (Simplified)
const StartupCard = ({ startup, onConnect, onVideoCall, onShowDetails, formatEnumValue }) => {
  const additionalInfo = startup.additionalInfo;

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

  const formatCurrency = (amount) => {
    if (!amount) return 'N/A';
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow duration-300">
      {/* Card Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-start space-x-4 flex-1">
          <div className="flex-shrink-0">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-full flex items-center justify-center text-white font-bold text-xl">
              {startup.name?.charAt(0).toUpperCase() || 'S'}
            </div>
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-lg font-semibold text-gray-900 truncate mb-1">
              {startup.name}
            </h3>
            <p className="text-gray-500 text-sm truncate mb-2">
              {startup.email}
            </p>
            <div className="flex items-center space-x-2">
              {getSubscriptionBadge(startup.isSubscribed)}
            </div>
          </div>
        </div>
      </div>

      {/* Startup Details */}
      <div className="space-y-3 mb-6">
        {/* Basic Info */}
        <div className="grid grid-cols-2 gap-2 text-sm">
          {additionalInfo?.industry && (
            <div>
              <span className="font-medium text-gray-700">Industry:</span>
              <p className="text-gray-900">{formatEnumValue(additionalInfo.industry)}</p>
            </div>
          )}
          {additionalInfo?.businessStage && (
            <div>
              <span className="font-medium text-gray-700">Stage:</span>
              <p className="text-gray-900">{formatEnumValue(additionalInfo.businessStage)}</p>
            </div>
          )}
          {additionalInfo?.fundingStage && (
            <div>
              <span className="font-medium text-gray-700">Funding:</span>
              <p className="text-gray-900">{formatEnumValue(additionalInfo.fundingStage)}</p>
            </div>
          )}
          {additionalInfo?.teamSize && (
            <div>
              <span className="font-medium text-gray-700">Team:</span>
              <p className="text-gray-900">{additionalInfo.teamSize} people</p>
            </div>
          )}
        </div>

        {/* Location */}
        {additionalInfo?.location && (
          <div className="flex items-center text-sm text-gray-600">
            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            </svg>
            {additionalInfo.location}
          </div>
        )}

        {/* Quick Financial Info */}
        {(additionalInfo?.revenue || additionalInfo?.mrr) && (
          <div className="bg-gray-50 rounded-lg p-3">
            <div className="grid grid-cols-2 gap-2 text-xs">
              {additionalInfo.revenue && (
                <div>
                  <span className="text-gray-600">Annual Revenue:</span>
                  <p className="font-semibold text-gray-900">{formatCurrency(additionalInfo.revenue)}</p>
                </div>
              )}
              {additionalInfo.mrr && (
                <div>
                  <span className="text-gray-600">Monthly Revenue:</span>
                  <p className="font-semibold text-gray-900">{formatCurrency(additionalInfo.mrr)}</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Action Buttons */}
      <div className="flex space-x-2">
        <button 
          onClick={() => onConnect(startup.userId)}
          className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 px-3 rounded-lg transition-colors duration-200 font-medium text-sm flex items-center justify-center"
        >
          <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
          </svg>
          Message
        </button>
        
        <button 
          onClick={() => onVideoCall(startup.userId)}
          className="flex-1 bg-green-600 hover:bg-green-700 text-white py-2 px-3 rounded-lg transition-colors duration-200 font-medium text-sm flex items-center justify-center"
        >
          <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
          </svg>
          Call
        </button>

        <button 
          onClick={() => onShowDetails(startup)}
          className="flex-1 bg-gray-600 hover:bg-gray-700 text-white py-2 px-3 rounded-lg transition-colors duration-200 font-medium text-sm flex items-center justify-center"
        >
          <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          Details
        </button>
      </div>
    </div>
  );
};

// Startup Detail Modal Component
const StartupDetailModal = ({ startup, onClose, onConnect, onVideoCall, formatEnumValue }) => {
  const additionalInfo = startup.additionalInfo;

  const formatCurrency = (amount) => {
    if (!amount) return 'Not specified';
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  const formatNumber = (num) => {
    if (!num) return 'Not specified';
    return num.toLocaleString();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-full flex items-center justify-center text-white font-bold text-2xl">
              {startup.name?.charAt(0).toUpperCase() || 'S'}
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">{startup.name}</h2>
              <p className="text-gray-600">{startup.email}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition duration-200 p-2"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Basic Information Section */}
          <section>
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <svg className="w-5 h-5 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Basic Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <InfoItem label="Industry" value={formatEnumValue(additionalInfo?.industry)} />
              <InfoItem label="Business Stage" value={formatEnumValue(additionalInfo?.businessStage)} />
              <InfoItem label="Funding Stage" value={formatEnumValue(additionalInfo?.fundingStage)} />
              <InfoItem label="Team Size" value={additionalInfo?.teamSize ? `${additionalInfo.teamSize} people` : ''} />
              <InfoItem label="Location" value={additionalInfo?.location} />
              <InfoItem label="Business Model" value={formatEnumValue(additionalInfo?.businessModel)} />
            </div>
          </section>

          {/* Business Description */}
          {additionalInfo?.description && (
            <section>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Business Description</h3>
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-gray-700 leading-relaxed">{additionalInfo.description}</p>
              </div>
            </section>
          )}

          {/* Target Market */}
          {additionalInfo?.targetMarket && (
            <section>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Target Market</h3>
              <div className="bg-blue-50 rounded-lg p-4">
                <p className="text-blue-800">{additionalInfo.targetMarket}</p>
              </div>
            </section>
          )}

          {/* Financial Information */}
          <section>
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <svg className="w-5 h-5 mr-2 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
              </svg>
              Financial Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <InfoItem label="Annual Revenue" value={formatCurrency(additionalInfo?.revenue)} />
              <InfoItem label="Monthly Revenue (MRR)" value={formatCurrency(additionalInfo?.mrr)} />
              <InfoItem label="Monthly Burn Rate" value={formatCurrency(additionalInfo?.monthlyBurnRate)} />
              <InfoItem label="Cash Runway" value={additionalInfo?.runway ? `${additionalInfo.runway} months` : ''} />
              <InfoItem label="Customer Count" value={formatNumber(additionalInfo?.customerCount)} />
              <InfoItem label="Funding Needs" value={formatCurrency(additionalInfo?.fundingNeeds)} />
            </div>
          </section>

          {/* Business Metrics & Strategy */}
          {(additionalInfo?.keyMetrics || additionalInfo?.competitiveAdvantage || additionalInfo?.growthStrategy) && (
            <section>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Business Strategy & Metrics</h3>
              <div className="space-y-4">
                {additionalInfo?.keyMetrics && (
                  <div>
                    <h4 className="font-medium text-gray-700 mb-2">Key Metrics</h4>
                    <div className="bg-gray-50 rounded-lg p-4">
                      <p className="text-gray-700">{additionalInfo.keyMetrics}</p>
                    </div>
                  </div>
                )}
                {additionalInfo?.competitiveAdvantage && (
                  <div>
                    <h4 className="font-medium text-gray-700 mb-2">Competitive Advantage</h4>
                    <div className="bg-green-50 rounded-lg p-4">
                      <p className="text-green-800">{additionalInfo.competitiveAdvantage}</p>
                    </div>
                  </div>
                )}
                {additionalInfo?.growthStrategy && (
                  <div>
                    <h4 className="font-medium text-gray-700 mb-2">Growth Strategy</h4>
                    <div className="bg-blue-50 rounded-lg p-4">
                      <p className="text-blue-800">{additionalInfo.growthStrategy}</p>
                    </div>
                  </div>
                )}
              </div>
            </section>
          )}

          {/* Challenges & Future Plans */}
          {(additionalInfo?.businessChallenges || additionalInfo?.exitStrategy) && (
            <section>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Challenges & Future Plans</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {additionalInfo?.businessChallenges && (
                  <div>
                    <h4 className="font-medium text-gray-700 mb-2">Current Challenges</h4>
                    <div className="bg-yellow-50 rounded-lg p-4">
                      <p className="text-yellow-800">{additionalInfo.businessChallenges}</p>
                    </div>
                  </div>
                )}
                {additionalInfo?.exitStrategy && (
                  <div>
                    <h4 className="font-medium text-gray-700 mb-2">Long-term Vision</h4>
                    <div className="bg-purple-50 rounded-lg p-4">
                      <p className="text-purple-800">{formatEnumValue(additionalInfo.exitStrategy)}</p>
                    </div>
                  </div>
                )}
              </div>
            </section>
          )}

          {/* Contact & Social Links */}
          <section>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Contact & Links</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {additionalInfo?.website && (
                <a href={additionalInfo.website} target="_blank" rel="noopener noreferrer" className="flex items-center text-blue-600 hover:text-blue-800">
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9v-9m0-9v9" />
                  </svg>
                  Website
                </a>
              )}
              {additionalInfo?.linkedinProfile && (
                <a href={additionalInfo.linkedinProfile} target="_blank" rel="noopener noreferrer" className="flex items-center text-blue-600 hover:text-blue-800">
                  <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                  </svg>
                  LinkedIn Profile
                </a>
              )}
            </div>
          </section>
        </div>

        {/* Footer Actions */}
        <div className="flex justify-between items-center p-6 border-t border-gray-200 bg-gray-50 rounded-b-xl">
          <button
            onClick={onClose}
            className="px-6 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-medium"
          >
            Close
          </button>
          <div className="flex space-x-3">
            <button 
              onClick={() => onConnect(startup.userId)}
              className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors duration-200 font-medium flex items-center"
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
              Send Message
            </button>
            
            <button 
              onClick={() => onVideoCall(startup.userId)}
              className="px-6 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors duration-200 font-medium flex items-center"
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
              Schedule Pitch Call
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Reusable Info Item Component
const InfoItem = ({ label, value }) => {
  if (!value) return null;
  
  return (
    <div className="bg-gray-50 rounded-lg p-3">
      <dt className="text-sm font-medium text-gray-600">{label}</dt>
      <dd className="text-sm text-gray-900 mt-1">{value}</dd>
    </div>
  );
};

export default BrowseStartupsPage;