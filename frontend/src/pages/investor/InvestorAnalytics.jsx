import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const InvestorAnalytics = () => {
  const { investor_id } = useParams();
  const { user } = useAuth();
  const [analyticsData, setAnalyticsData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate loading delay for better UX
    const timer = setTimeout(() => {
      setAnalyticsData(getMockAnalyticsData());
      setLoading(false);
    }, 800);
    
    return () => clearTimeout(timer);
  }, []);

  // Enhanced mock data with more realistic investment portfolio
  const getMockAnalyticsData = () => {
    return {
      portfolio: [
        { 
          startup: 'Quantum AI Systems', 
          investment: 150000, 
          roi: 42, 
          status: 'active',
          sector: 'Artificial Intelligence',
          investedDate: '2023-01-15',
          currentValuation: 213000
        },
        { 
          startup: 'EcoRenew Energy', 
          investment: 80000, 
          roi: 28, 
          status: 'active',
          sector: 'Clean Energy',
          investedDate: '2023-03-22',
          currentValuation: 102400
        },
        { 
          startup: 'HealthTech Diagnostics', 
          investment: 120000, 
          roi: 35, 
          status: 'active',
          sector: 'Healthcare',
          investedDate: '2023-02-10',
          currentValuation: 162000
        },
        { 
          startup: 'FinBlock Solutions', 
          investment: 60000, 
          roi: -8, 
          status: 'monitoring',
          sector: 'FinTech',
          investedDate: '2023-04-05',
          currentValuation: 55200
        },
        { 
          startup: 'AgriGrow Tech', 
          investment: 90000, 
          roi: 15, 
          status: 'active',
          sector: 'AgriTech',
          investedDate: '2023-05-18',
          currentValuation: 103500
        }
      ],
      metrics: {
        totalInvested: 500000,
        averageROI: 22.4,
        activeInvestments: 5,
        totalReturns: 112000,
        portfolioValue: 636100,
        bestPerformer: 'Quantum AI Systems',
        worstPerformer: 'FinBlock Solutions'
      },
      trends: [
        { month: 'Jan 2023', investments: 150000, returns: 0, newInvestments: 1 },
        { month: 'Feb 2023', investments: 270000, returns: 22500, newInvestments: 1 },
        { month: 'Mar 2023', investments: 350000, returns: 42000, newInvestments: 1 },
        { month: 'Apr 2023', investments: 410000, returns: 51200, newInvestments: 1 },
        { month: 'May 2023', investments: 500000, returns: 73500, newInvestments: 1 },
        { month: 'Jun 2023', investments: 500000, returns: 89000, newInvestments: 0 },
        { month: 'Jul 2023', investments: 500000, returns: 112000, newInvestments: 0 }
      ],
      sectorBreakdown: [
        { sector: 'Artificial Intelligence', amount: 150000, percentage: 30 },
        { sector: 'Healthcare', amount: 120000, percentage: 24 },
        { sector: 'Clean Energy', amount: 80000, percentage: 16 },
        { sector: 'AgriTech', amount: 90000, percentage: 18 },
        { sector: 'FinTech', amount: 60000, percentage: 12 }
      ],
      performanceInsights: [
        "Your AI investments are outperforming market average by 18%",
        "Consider diversifying into emerging blockchain technologies",
        "Healthcare sector shows strong growth potential for Q4",
        "Portfolio ROI is 4.2% above industry benchmark"
      ]
    };
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading investment analytics...</p>
        </div>
      </div>
    );
  }

  // Safe data access with fallbacks
  const portfolio = analyticsData?.portfolio || [];
  const metrics = analyticsData?.metrics || {};
  const trends = analyticsData?.trends || [];
  const sectorBreakdown = analyticsData?.sectorBreakdown || [];
  const performanceInsights = analyticsData?.performanceInsights || [];

  const getROIColor = (roi) => {
    if (roi > 30) return 'text-green-600';
    if (roi > 15) return 'text-blue-600';
    if (roi > 0) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'monitoring': return 'bg-yellow-100 text-yellow-800';
      case 'at-risk': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
            <div className="flex items-center">
              <div className="text-blue-600 mr-3">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
              </div>
              <div>
                <h3 className="text-sm font-medium text-blue-800">
                  Portfolio Overview
                </h3>
                <p className="text-sm text-blue-700 mt-1">
                  Real-time insights into your investment performance and portfolio health
                </p>
              </div>
            </div>
          </div>
          
          <h1 className="text-3xl font-bold text-gray-900">Investment Analytics</h1>
          <p className="text-gray-600 mt-2">Track your investment portfolio performance and make data-driven decisions</p>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">Portfolio Value</h3>
              <div className="text-green-500">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M12 7a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0V8.414l-4.293 4.293a1 1 0 01-1.414 0L8 10.414l-4.293 4.293a1 1 0 01-1.414-1.414l5-5a1 1 0 011.414 0L11 10.586 14.586 7H12z" clipRule="evenodd" />
                </svg>
              </div>
            </div>
            <p className="text-2xl font-bold text-blue-600 mt-2">
              ${metrics.portfolioValue?.toLocaleString() || '0'}
            </p>
            <p className="text-sm text-green-600 mt-1">+22.4% overall growth</p>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Average ROI</h3>
            <p className="text-2xl font-bold text-green-600">
              {metrics.averageROI || 0}%
            </p>
            <p className="text-sm text-gray-500 mt-1">Industry avg: 18.2%</p>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Active Investments</h3>
            <p className="text-2xl font-bold text-purple-600">
              {metrics.activeInvestments || 0}
            </p>
            <p className="text-sm text-gray-500 mt-1">Across 5 sectors</p>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Total Returns</h3>
            <p className="text-2xl font-bold text-orange-600">
              ${metrics.totalReturns?.toLocaleString() || '0'}
            </p>
            <p className="text-sm text-green-600 mt-1">+$112K this year</p>
          </div>
        </div>

        {/* Performance Insights */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-8">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">Performance Insights</h2>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {performanceInsights.map((insight, index) => (
                <div key={index} className="flex items-start p-4 bg-blue-50 rounded-lg">
                  <div className="text-blue-500 mr-3 mt-0.5">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <p className="text-sm text-blue-800">{insight}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Portfolio Table */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-8">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">Investment Portfolio</h2>
            <p className="text-gray-600 text-sm mt-1">Detailed breakdown of your current investments</p>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Startup
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Sector
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Investment
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Current Value
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
                {portfolio.map((investment, index) => (
                  <tr key={index} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">{investment.startup}</div>
                        <div className="text-xs text-gray-500">Invested: {investment.investedDate}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {investment.sector}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      ${investment.investment?.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      ${investment.currentValuation?.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <span className={`font-semibold ${getROIColor(investment.roi)}`}>
                        {investment.roi > 0 ? '+' : ''}{investment.roi}%
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(investment.status)}`}>
                        {investment.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Sector Breakdown and Trends */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Sector Breakdown */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900">Sector Allocation</h2>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                {sectorBreakdown.map((sector, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className={`w-3 h-3 rounded-full mr-3 ${
                        index === 0 ? 'bg-blue-500' :
                        index === 1 ? 'bg-green-500' :
                        index === 2 ? 'bg-purple-500' :
                        index === 3 ? 'bg-yellow-500' : 'bg-red-500'
                      }`}></div>
                      <span className="text-sm font-medium text-gray-900">{sector.sector}</span>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-semibold text-gray-900">
                        ${sector.amount?.toLocaleString()}
                      </div>
                      <div className="text-xs text-gray-500">{sector.percentage}%</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Investment Trends */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900">Monthly Performance</h2>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                {trends.slice(-6).map((trend, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex-1">
                      <h3 className="font-medium text-gray-900">{trend.month}</h3>
                      <p className="text-xs text-gray-500">
                        {trend.newInvestments > 0 ? `${trend.newInvestments} new investment(s)` : 'Portfolio growth'}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-semibold text-gray-900">
                        ${trend.investments?.toLocaleString()}
                      </p>
                      <p className={`text-xs ${trend.returns > 0 ? 'text-green-600' : 'text-red-600'}`}>
                        +${trend.returns?.toLocaleString()} returns
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Summary Card */}
        <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg shadow-sm p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold mb-2">Portfolio Summary</h2>
              <p className="text-blue-100">
                Your investments are performing <strong>22.4% above</strong> the market average. 
                Consider rebalancing your portfolio to maintain optimal sector allocation.
              </p>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold">Excellent</div>
              <div className="text-blue-200 text-sm">Performance Rating</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InvestorAnalytics;