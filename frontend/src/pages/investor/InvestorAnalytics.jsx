import React, { useEffect, useState } from 'react';
import { useParams, Link, useSearchParams } from 'react-router-dom';
import { api } from '../../api/api';
import { Search, Building2, TrendingUp, Filter, ArrowRight, BarChart3, Briefcase } from 'lucide-react';

const InvestorAnalytics = () => {
  const { investor_id } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  const [startups, setStartups] = useState([]);
  const [domain, setDomain] = useState(searchParams.get('domain') || '');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    async function fetchStartups() {
      setIsLoading(true);
      try {
        const res = await api.get(`/analytics/startups${domain ? `?domain=${domain}` : ''}`);
        setStartups(res.data);
      } catch (err) {
        console.error('Failed to fetch startups:', err);
      } finally {
        setIsLoading(false);
      }
    }
    fetchStartups();
  }, [domain]);

  const handleApplyFilter = () => {
    setSearchParams({ domain });
  };

  const handleClearFilter = () => {
    setDomain('');
    setSearchParams({});
  };

  // Get unique domains for quick filter suggestions
  const uniqueDomains = [...new Set(startups.map(s => s.domain))];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center mb-3">
            <div className="p-3 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl mr-4 shadow-lg">
              <Briefcase className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-bold text-gray-900 mb-1">Startup Analytics</h1>
              <p className="text-gray-600">Monitor and analyze your portfolio startups</p>
            </div>
          </div>
        </div>

        {/* Filter Section */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6 border border-gray-100">
          <div className="flex items-center gap-2 mb-4">
            <Filter className="w-5 h-5 text-indigo-600" />
            <h3 className="text-lg font-bold text-gray-900">Filter Startups</h3>
          </div>
          
          <div className="flex flex-col md:flex-row gap-3">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                type="text"
                value={domain}
                onChange={e => setDomain(e.target.value)}
                placeholder="Enter domain (e.g., FinTech, HealthTech)"
              />
            </div>
            <div className="flex gap-2">
              <button 
                onClick={handleApplyFilter} 
                className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all flex items-center gap-2"
              >
                <Filter className="w-4 h-4" />
                Apply
              </button>
              {domain && (
                <button 
                  onClick={handleClearFilter} 
                  className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-6 py-3 rounded-xl font-semibold transition-all"
                >
                  Clear
                </button>
              )}
            </div>
          </div>

          {/* Quick Domain Filters */}
          {uniqueDomains.length > 0 && !domain && (
            <div className="mt-4 pt-4 border-t border-gray-200">
              <p className="text-sm text-gray-600 mb-2">Quick filters:</p>
              <div className="flex flex-wrap gap-2">
                {uniqueDomains.slice(0, 6).map(d => (
                  <button
                    key={d}
                    onClick={() => {
                      setDomain(d);
                      setSearchParams({ domain: d });
                    }}
                    className="bg-gradient-to-r from-blue-50 to-indigo-50 hover:from-blue-100 hover:to-indigo-100 border border-blue-200 px-3 py-1.5 rounded-lg text-sm font-semibold text-gray-700 transition-all"
                  >
                    {d}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Stats Summary */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 font-medium mb-1">Total Startups</p>
                <p className="text-3xl font-bold text-gray-900">{startups.length}</p>
              </div>
              <div className="p-3 bg-blue-100 rounded-xl">
                <Building2 className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 font-medium mb-1">Domains</p>
                <p className="text-3xl font-bold text-gray-900">{uniqueDomains.length}</p>
              </div>
              <div className="p-3 bg-purple-100 rounded-xl">
                <TrendingUp className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 font-medium mb-1">Filtered Results</p>
                <p className="text-3xl font-bold text-gray-900">
                  {domain ? startups.length : '-'}
                </p>
              </div>
              <div className="p-3 bg-indigo-100 rounded-xl">
                <BarChart3 className="w-6 h-6 text-indigo-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Startups List */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
          <div className="px-6 py-4 bg-gradient-to-r from-indigo-50 to-purple-50 border-b border-gray-200">
            <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
              <Building2 className="w-5 h-5 text-indigo-600" />
              Portfolio Startups {domain && `- ${domain}`}
            </h3>
          </div>

          {isLoading ? (
            <div className="p-12 text-center">
              <div className="inline-block w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mb-4"></div>
              <p className="text-gray-600">Loading startups...</p>
            </div>
          ) : startups.length === 0 ? (
            <div className="p-12 text-center">
              <Building2 className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-600 font-medium">No startups found</p>
              <p className="text-sm text-gray-500 mt-1">
                {domain ? 'Try adjusting your filter' : 'No startups available in your portfolio'}
              </p>
            </div>
          ) : (
            <div className="divide-y divide-gray-100">
              {startups.map(s => (
                <Link
                  key={s._id}
                  to={`/investor/${investor_id}/startup/${s._id}`}
                  className="flex items-center justify-between p-6 hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 transition-all group"
                >
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl shadow-md group-hover:shadow-lg transition-all">
                      <Building2 className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h4 className="text-lg font-bold text-gray-900 group-hover:text-indigo-600 transition-colors">
                        {s.name}
                      </h4>
                      <p className="text-sm text-gray-600 flex items-center gap-1">
                        <span className="inline-block w-2 h-2 bg-indigo-400 rounded-full"></span>
                        {s.domain}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-semibold text-indigo-600 opacity-0 group-hover:opacity-100 transition-opacity">
                      View Analytics
                    </span>
                    <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-indigo-600 group-hover:translate-x-1 transition-all" />
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default InvestorAnalytics;