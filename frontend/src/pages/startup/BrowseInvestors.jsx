// BrowseInvestorsPage.js
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const BrowseInvestorsPage = () => {
  const [investors, setInvestors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    investmentFocus: '',
    investmentStage: '',
    checkSize: '',
    geographicFocus: ''
  });
  const [selectedInvestor, setSelectedInvestor] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const navigate = useNavigate();

  // Fetch investors with additional info
  const fetchInvestors = async () => {
    try {
      setLoading(true);
      
      const usersResponse = await fetch('http://localhost:5001/api/users/chat/users');
      if (!usersResponse.ok) {
        throw new Error('Failed to fetch users');
      }
      
      const usersResult = await usersResponse.json();
      
      if (usersResult.success) {
        const investorUsers = usersResult.data.users.filter(user => user.role === 'investor');
        
        const investorsWithDetails = await Promise.all(
          investorUsers.map(async (investor) => {
            try {
              const additionalInfoResponse = await fetch(`http://localhost:5001/api/additional-info/${investor.userId}`);
              if (additionalInfoResponse.ok) {
                const additionalInfoResult = await additionalInfoResponse.json();
                if (additionalInfoResult.success && additionalInfoResult.data) {
                  return { ...investor, additionalInfo: additionalInfoResult.data };
                }
              }
              return { ...investor, additionalInfo: null };
            } catch (error) {
              console.error(`Error fetching additional info for ${investor.userId}:`, error);
              return { ...investor, additionalInfo: null };
            }
          })
        );
        
        setInvestors(investorsWithDetails);
      } else {
        throw new Error(usersResult.message || 'Failed to fetch users');
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
                         investor.additionalInfo?.investmentPhilosophy?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (investor.additionalInfo?.investmentFocus?.some(focus => 
                           focus.toLowerCase().includes(searchTerm.toLowerCase())
                         ));
    
    const matchesInvestmentFocus = !filters.investmentFocus || 
                                 investor.additionalInfo?.investmentFocus?.includes(filters.investmentFocus);
    const matchesInvestmentStage = !filters.investmentStage || investor.additionalInfo?.investmentStage === filters.investmentStage;
    const matchesGeographicFocus = !filters.geographicFocus || 
                                 investor.additionalInfo?.geographicFocus?.includes(filters.geographicFocus);
    const matchesCheckSize = !filters.checkSize || 
                           (filters.checkSize === 'small' && investor.additionalInfo?.checkSize < 100000) ||
                           (filters.checkSize === 'medium' && investor.additionalInfo?.checkSize >= 100000 && investor.additionalInfo?.checkSize < 1000000) ||
                           (filters.checkSize === 'large' && investor.additionalInfo?.checkSize >= 1000000);

    return matchesSearch && matchesInvestmentFocus && matchesInvestmentStage && matchesGeographicFocus && matchesCheckSize;
  });

  // Get unique values for filters
  const investmentFocuses = [...new Set(investors.flatMap(inv => inv.additionalInfo?.investmentFocus || []).filter(Boolean))];
  const investmentStages = [...new Set(investors.map(inv => inv.additionalInfo?.investmentStage).filter(Boolean))];
  const geographicFocuses = [...new Set(investors.flatMap(inv => inv.additionalInfo?.geographicFocus || []).filter(Boolean))];

  const handleFilterChange = (filterType, value) => {
    setFilters(prev => ({
      ...prev,
      [filterType]: value
    }));
  };

  const clearFilters = () => {
    setFilters({
      investmentFocus: '',
      investmentStage: '',
      checkSize: '',
      geographicFocus: ''
    });
    setSearchTerm('');
  };

  const handleConnect = (investorId) => {
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

  const handleShowDetails = (investor) => {
    setSelectedInvestor(investor);
    setShowDetailModal(true);
  };

  // Format enum values for display
  const formatEnumValue = (value) => {
    if (!value) return '';
    return value.split('-').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
  };

  // Format currency for display
  const formatCurrency = (amount) => {
    if (!amount) return 'Not specified';
    if (amount >= 1000000) {
      return `$${(amount / 1000000).toFixed(1)}M`;
    } else if (amount >= 1000) {
      return `$${(amount / 1000).toFixed(1)}K`;
    }
    return `$${amount}`;
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
                placeholder="Search investors by name, philosophy, or investment focus..."
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
                Investment Focus
              </label>
              <select
                value={filters.investmentFocus}
                onChange={(e) => handleFilterChange('investmentFocus', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              >
                <option value="">All Focus Areas</option>
                {investmentFocuses.map(focus => (
                  <option key={focus} value={focus}>
                    {formatEnumValue(focus)}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Investment Stage
              </label>
              <select
                value={filters.investmentStage}
                onChange={(e) => handleFilterChange('investmentStage', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              >
                <option value="">All Stages</option>
                {investmentStages.map(stage => (
                  <option key={stage} value={stage}>
                    {formatEnumValue(stage)}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Check Size
              </label>
              <select
                value={filters.checkSize}
                onChange={(e) => handleFilterChange('checkSize', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              >
                <option value="">Any Size</option>
                <option value="small">Under $100K</option>
                <option value="medium">$100K - $1M</option>
                <option value="large">$1M+</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Geographic Focus
              </label>
              <select
                value={filters.geographicFocus}
                onChange={(e) => handleFilterChange('geographicFocus', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              >
                <option value="">All Regions</option>
                {geographicFocuses.map(region => (
                  <option key={region} value={region}>
                    {formatEnumValue(region)}
                  </option>
                ))}
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
            Showing <span className="font-semibold text-gray-900">{filteredInvestors.length}</span> of{' '}
            <span className="font-semibold text-gray-900">{investors.length}</span> investors
          </p>
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
                onShowDetails={handleShowDetails}
                formatEnumValue={formatEnumValue}
                formatCurrency={formatCurrency}
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

        {/* Detail Modal */}
        {showDetailModal && selectedInvestor && (
          <InvestorDetailModal
            investor={selectedInvestor}
            onClose={() => setShowDetailModal(false)}
            onConnect={handleConnect}
            onVideoCall={handleVideoCall}
            formatEnumValue={formatEnumValue}
            formatCurrency={formatCurrency}
          />
        )}
      </div>
    </div>
  );
};

// Investor Card Component (Simplified)
const InvestorCard = ({ investor, onConnect, onVideoCall, onShowDetails, formatEnumValue, formatCurrency }) => {
  const additionalInfo = investor.additionalInfo;

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
            <h3 className="text-lg font-semibold text-gray-900 truncate mb-1">
              {investor.name}
            </h3>
            <p className="text-gray-500 text-sm truncate mb-2">
              {investor.email}
            </p>
            <div className="flex items-center space-x-2">
              {getSubscriptionBadge(investor.isSubscribed)}
            </div>
          </div>
        </div>
      </div>

      {/* Investor Details */}
      <div className="space-y-3 mb-6">
        {/* Basic Info */}
        <div className="grid grid-cols-2 gap-2 text-sm">
          {additionalInfo?.investmentStage && (
            <div>
              <span className="font-medium text-gray-700">Stage:</span>
              <p className="text-gray-900">{formatEnumValue(additionalInfo.investmentStage)}</p>
            </div>
          )}
          {additionalInfo?.checkSize && (
            <div>
              <span className="font-medium text-gray-700">Check Size:</span>
              <p className="text-gray-900">{formatCurrency(additionalInfo.checkSize)}</p>
            </div>
          )}
          {additionalInfo?.portfolioSize && (
            <div>
              <span className="font-medium text-gray-700">Portfolio:</span>
              <p className="text-gray-900">{additionalInfo.portfolioSize} companies</p>
            </div>
          )}
          {additionalInfo?.yearsInvesting && (
            <div>
              <span className="font-medium text-gray-700">Experience:</span>
              <p className="text-gray-900">{additionalInfo.yearsInvesting} years</p>
            </div>
          )}
        </div>

        {/* Investment Focus */}
        {additionalInfo?.investmentFocus && additionalInfo.investmentFocus.length > 0 && (
          <div>
            <span className="text-sm font-medium text-gray-700">Focus Areas:</span>
            <div className="flex flex-wrap gap-1 mt-1">
              {additionalInfo.investmentFocus.slice(0, 2).map(focus => (
                <span key={focus} className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded capitalize">
                  {formatEnumValue(focus)}
                </span>
              ))}
              {additionalInfo.investmentFocus.length > 2 && (
                <span className="bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded">
                  +{additionalInfo.investmentFocus.length - 2} more
                </span>
              )}
            </div>
          </div>
        )}

        {/* Location */}
        {additionalInfo?.location && (
          <div className="flex items-center text-sm text-gray-600">
            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            </svg>
            {additionalInfo.location}
          </div>
        )}
      </div>

      {/* Action Buttons */}
      <div className="flex space-x-2">
        <button 
          onClick={() => onConnect(investor.userId)}
          className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 px-3 rounded-lg transition-colors duration-200 font-medium text-sm flex items-center justify-center"
        >
          <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
          </svg>
          Message
        </button>
        
        <button 
          onClick={() => onVideoCall(investor.userId)}
          className="flex-1 bg-green-600 hover:bg-green-700 text-white py-2 px-3 rounded-lg transition-colors duration-200 font-medium text-sm flex items-center justify-center"
        >
          <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
          </svg>
          Call
        </button>

        <button 
          onClick={() => onShowDetails(investor)}
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

// Investor Detail Modal Component
const InvestorDetailModal = ({ investor, onClose, onConnect, onVideoCall, formatEnumValue, formatCurrency }) => {
  const additionalInfo = investor.additionalInfo;

  const formatNumber = (num) => {
    if (!num) return 'Not specified';
    return num.toLocaleString();
  };

  const getBooleanText = (value) => {
    if (value === true) return 'Yes';
    if (value === false) return 'No';
    return 'Not specified';
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-full flex items-center justify-center text-white font-bold text-2xl">
              {investor.name?.charAt(0).toUpperCase() || 'I'}
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">{investor.name}</h2>
              <p className="text-gray-600">{investor.email}</p>
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
              <svg className="w-5 h-5 mr-2 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              Basic Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <InfoItem label="Location" value={additionalInfo?.location} />
              <InfoItem label="Years Investing" value={additionalInfo?.yearsInvesting ? `${additionalInfo.yearsInvesting} years` : ''} />
              <InfoItem label="Portfolio Size" value={additionalInfo?.portfolioSize ? `${additionalInfo.portfolioSize} companies` : ''} />
              <InfoItem label="Total AUM" value={formatCurrency(additionalInfo?.totalAum)} />
              <InfoItem label="Average Round Size" value={formatCurrency(additionalInfo?.avgRoundSize)} />
              <InfoItem label="Typical Ownership" value={additionalInfo?.typicalOwnership} />
            </div>
          </section>

          {/* Investment Preferences */}
          <section>
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <svg className="w-5 h-5 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
              Investment Preferences
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-medium text-gray-700 mb-3">Investment Details</h4>
                <div className="space-y-3">
                  <InfoItem label="Investment Stage" value={formatEnumValue(additionalInfo?.investmentStage)} />
                  <InfoItem label="Typical Check Size" value={formatCurrency(additionalInfo?.checkSize)} />
                  <InfoItem label="Minimum Investment" value={formatCurrency(additionalInfo?.minInvestment)} />
                  <InfoItem label="Maximum Investment" value={formatCurrency(additionalInfo?.maxInvestment)} />
                </div>
              </div>
              <div>
                <h4 className="font-medium text-gray-700 mb-3">Investment Style</h4>
                <div className="space-y-3">
                  <InfoItem label="Board Seat Required" value={getBooleanText(additionalInfo?.boardSeat)} />
                  <InfoItem label="Lead Investor" value={getBooleanText(additionalInfo?.leadInvestor)} />
                </div>
              </div>
            </div>
          </section>

          {/* Focus Areas */}
          <section>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Focus Areas</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Investment Focus */}
              {additionalInfo?.investmentFocus && additionalInfo.investmentFocus.length > 0 && (
                <div>
                  <h4 className="font-medium text-gray-700 mb-3">Industry Focus</h4>
                  <div className="flex flex-wrap gap-2">
                    {additionalInfo.investmentFocus.map(focus => (
                      <span key={focus} className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm capitalize">
                        {formatEnumValue(focus)}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Geographic Focus */}
              {additionalInfo?.geographicFocus && additionalInfo.geographicFocus.length > 0 && (
                <div>
                  <h4 className="font-medium text-gray-700 mb-3">Geographic Focus</h4>
                  <div className="flex flex-wrap gap-2">
                    {additionalInfo.geographicFocus.map(region => (
                      <span key={region} className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm capitalize">
                        {formatEnumValue(region)}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </section>

          {/* Investment Philosophy */}
          {additionalInfo?.investmentPhilosophy && (
            <section>
              <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
                <svg className="w-5 h-5 mr-2 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
                Investment Philosophy
              </h3>
              <div className="bg-yellow-50 rounded-lg p-4">
                <p className="text-yellow-800 leading-relaxed">{additionalInfo.investmentPhilosophy}</p>
              </div>
            </section>
          )}

          {/* Value Add & Process */}
          <section>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Investment Process</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {additionalInfo?.valueAdd && (
                <div>
                  <h4 className="font-medium text-gray-700 mb-3">Value Add to Portfolio</h4>
                  <div className="bg-blue-50 rounded-lg p-4">
                    <p className="text-blue-800">{additionalInfo.valueAdd}</p>
                  </div>
                </div>
              )}
              {additionalInfo?.dueDiligenceProcess && (
                <div>
                  <h4 className="font-medium text-gray-700 mb-3">Due Diligence Process</h4>
                  <div className="bg-green-50 rounded-lg p-4">
                    <p className="text-green-800">{additionalInfo.dueDiligenceProcess}</p>
                  </div>
                </div>
              )}
            </div>
          </section>

          {/* Deal Flow & Co-investment */}
          <section>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Deal Flow & Partnerships</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Deal Flow Sources */}
              {additionalInfo?.dealFlowSource && additionalInfo.dealFlowSource.length > 0 && (
                <div>
                  <h4 className="font-medium text-gray-700 mb-3">Deal Flow Sources</h4>
                  <div className="flex flex-wrap gap-2">
                    {additionalInfo.dealFlowSource.map(source => (
                      <span key={source} className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm capitalize">
                        {formatEnumValue(source)}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Co-investors */}
              {additionalInfo?.coInvestors && (
                <div>
                  <h4 className="font-medium text-gray-700 mb-3">Preferred Co-investors</h4>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <p className="text-gray-700">{additionalInfo.coInvestors}</p>
                  </div>
                </div>
              )}
            </div>
          </section>

          {/* Investment Criteria */}
          {additionalInfo?.investmentCriteria && (
            <section>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Investment Criteria</h3>
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-gray-700 leading-relaxed">{additionalInfo.investmentCriteria}</p>
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
              onClick={() => onConnect(investor.userId)}
              className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors duration-200 font-medium flex items-center"
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
              Send Message
            </button>
            
            <button 
              onClick={() => onVideoCall(investor.userId)}
              className="px-6 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors duration-200 font-medium flex items-center"
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
              Schedule Meeting
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

export default BrowseInvestorsPage;