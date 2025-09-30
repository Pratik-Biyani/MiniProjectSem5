import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import AdminEventsPage from './pages/admin/AdminEventsPage';
import AdminEventDashboard from './pages/admin/AdminEventDashboard';

import BrowseEvents from './pages/startup/BrowseEvents';
import MyEvents from './pages/startup/MyEvents';
import StartupAnalytics from './pages/startup/StartupAnalytics';
import StartupAddMetrics from './pages/startup/StartupAddMetrics';
import InvestorAnalytics from './pages/investor/InvestorAnalytics';
import InvestorStartupAnalytics from './pages/investor/InvestorStartupAnalytics';
import AdminAnalytics from './pages/admin/AdminAnalytics';
import AdminStartupAnalytics from './pages/admin/AdminStartupAnalytics';



const App = () => {
  return (
    <Router>
      <Routes>
        {/* Admin */}
        <Route path="/admin/:admin_id/events" element={<AdminEventsPage />} />
        <Route path="/admin/:admin_id/events/:event_id" element={<AdminEventDashboard />} />
         <Route path="/admin/:admin_id/analytics" element={<AdminAnalytics />} />
        <Route path="/admin/:admin_id/startup/:startup_id" element={<AdminStartupAnalytics />} />

        {/* Startup */}
        <Route path="/startup/:startup_id/events" element={<BrowseEvents />} />
        <Route path="/startup/:startup_id/myevents" element={<MyEvents />} />
        <Route path="/startup/:startup_id/add-metrics" element={<StartupAddMetrics />} />
        <Route path="/startup/:startup_id/analytics" element={<StartupAnalytics />} />

        {/* Investor */}
        <Route path="/investor/:investor_id/analytics" element={<InvestorAnalytics />} />
        <Route path="/investor/:investor_id/startup/:startup_id" element={<InvestorStartupAnalytics />} />
        
      </Routes>
    </Router>
  );
};

export default App;
