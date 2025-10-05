import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { api } from '../../api/api';

const InvestorAnalytics = () => {
  const { investor_id } = useParams();
  const { user } = useAuth();
  const [analyticsData, setAnalyticsData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchAnalyticsData();
  }, [investor_id]);

  const fetchAnalyticsData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Replace with your actual API endpoint
      const result = await api.get(`/analytics/investor/${investor_id}`);
      
      if (result.success) {
        setAnalyticsData(result.data);
      } else {
        setError(result.message || 'Failed to fetch analytics data');
      }
    } catch (err) {
      console.error('Error fetching analytics:', err);
      setError('Failed to load analytics data');
      // Fallback to mock data for development
      setAnalyticsData(getMockAnalyticsData());
    } finally {
      setLoading(false);
    }
  };

  // Mock data for development
  const getMockAnalyticsData = () => {
    return {
      portfolio: [
        { startup: 'TechFlow Solutions', investment: 50000, roi: 25, status: 'active' },
        { startup: 'EcoHarvest', investment: 25000, roi: 15, status: 'active' },
        { startup: 'HealthTrack Pro', investment: 75000, roi: 35, status: 'active' }
      ],
      metrics: {
        totalInvested: 150000,
        averageROI: 25,
        activeInvestments: 3,
        totalReturns: 37500
      },
      trends: [
        { month: 'Jan', investments: 50000, returns: 12500 },
        { month: 'Feb', investments: 25000, returns: 6250 },
        { month: 'Mar', investments: 75000, returns: 18750 }
      ]
    };
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading analytics...</p>
        </div>
      </div>
    );
  }

  if (error && !analyticsData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 text-2xl mb-4">⚠️</div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Error</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button 
            onClick={fetchAnalyticsData}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  // Safe data access with fallbacks
  const portfolio = analyticsData?.portfolio || [];
  const metrics = analyticsData?.metrics || {};
  const trends = analyticsData?.trends || [];

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Investment Analytics</h1>
          <p className="text-gray-600 mt-2">Track your investment portfolio performance</p>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Total Invested</h3>
            <p className="text-2xl font-bold text-blue-600">
              ${metrics.totalInvested?.toLocaleString() || '0'}
            </p>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Average ROI</h3>
            <p className="text-2xl font-bold text-green-600">
              {metrics.averageROI || 0}%
            </p>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Active Investments</h3>
            <p className="text-2xl font-bold text-purple-600">
              {metrics.activeInvestments || 0}
            </p>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Total Returns</h3>
            <p className="text-2xl font-bold text-orange-600">
              ${metrics.totalReturns?.toLocaleString() || '0'}
            </p>
          </div>
        </div>

        {/* Portfolio Table */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-8">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">Investment Portfolio</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Startup
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Investment
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    ROI
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {portfolio.length > 0 ? (
                  portfolio.map((investment, index) => (
                    <tr key={index} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {investment.startup}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        ${investment.investment?.toLocaleString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <span className={`font-semibold ${
                          investment.roi > 20 ? 'text-green-600' : 
                          investment.roi > 10 ? 'text-yellow-600' : 'text-red-600'
                        }`}>
                          {investment.roi}%
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          investment.status === 'active' 
                            ? 'bg-green-100 text-green-800'
                            : 'bg-gray-100 text-gray-800'
                        }`}>
                          {investment.status}
                        </span>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="4" className="px-6 py-4 text-center text-sm text-gray-500">
                      No investments found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Investment Trends */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">Investment Trends</h2>
          </div>
          <div className="p-6">
            {trends.length > 0 ? (
              <div className="space-y-4">
                {trends.map((trend, index) => (
                  <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div className="flex-1">
                      <h3 className="font-medium text-gray-900">{trend.month}</h3>
                      <p className="text-sm text-gray-500">Investment Performance</p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-gray-900">
                        ${trend.investments?.toLocaleString()} invested
                      </p>
                      <p className="text-sm text-green-600">
                        ${trend.returns?.toLocaleString()} returns
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-gray-500">No trend data available</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default InvestorAnalytics;