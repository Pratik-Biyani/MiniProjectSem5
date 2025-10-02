import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { SocketProvider } from './context/SocketContext';

import LandingPage from './pages/LandingPage';
import ResourcesPage from './pages/ResourcesPage';

// Admin Pages
import AdminEventsPage from './pages/admin/AdminEventsPage';
import AdminEventDashboard from './pages/admin/AdminEventDashboard';
import AdminAnalytics from './pages/admin/AdminAnalytics';
import AdminStartupAnalytics from './pages/admin/AdminStartupAnalytics';
import AdminBlogs from './pages/admin/AdminBlogs';
import AdminCreateBlog from './pages/admin/AdminCreateBlog';

// Startup Pages  
import BrowseEvents from './pages/startup/BrowseEvents';
import MyEvents from './pages/startup/MyEvents';
import StartupAnalytics from './pages/startup/StartupAnalytics';
import StartupAddMetrics from './pages/startup/StartupAddMetrics';
import StartupBlogs from './pages/startup/StartupBlogs';
import StartupAnalysis from './pages/startup/StartupAnalysis';
import StartupAnalysisHistory from './pages/startup/StartupAnalysisHistory';

// Investor Pages
import InvestorAnalytics from './pages/investor/InvestorAnalytics';
import InvestorStartupAnalytics from './pages/investor/InvestorStartupAnalytics';
import InvestorBlogs from './pages/investor/InvestorBlogs';
import InvestorCreateBlog from './pages/investor/InvestorCreateBlog';

// Chat & Call Pages
import Chat from './pages/Chat';
import VideoCall from './pages/VideoCall';

const App = () => {
  return (
    <SocketProvider>
      <Router>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/resources" element={<ResourcesPage />} />
          {/* Admin Routes */}
          <Route path="/admin/:admin_id/events" element={<AdminEventsPage />} />
          <Route path="/admin/:admin_id/events/:event_id" element={<AdminEventDashboard />} />
          <Route path="/admin/:admin_id/analytics" element={<AdminAnalytics />} />
          <Route path="/admin/:admin_id/startup/:startup_id" element={<AdminStartupAnalytics />} />
          <Route path="/admin/:admin_id/blogs" element={<AdminBlogs />} />
          <Route path="/admin/:admin_id/create-blog" element={<AdminCreateBlog />} />
          <Route path="/admin/:admin_id/chats" element={<Chat />} />

          {/* Startup Routes */}
          <Route path="/startup/:startup_id/events" element={<BrowseEvents />} />
          <Route path="/startup/:startup_id/myevents" element={<MyEvents />} />
          <Route path="/startup/:startup_id/add-metrics" element={<StartupAddMetrics />} />
          <Route path="/startup/:startup_id/analytics" element={<StartupAnalytics />} />
          <Route path="/startup/:startup_id/blogs" element={<StartupBlogs />} />
          <Route path="/startup/:startup_id/analysis" element={<StartupAnalysis />} />
          <Route path="/startup/:startup_id/analysis-history" element={<StartupAnalysisHistory />} />
          <Route path="/startup/:startup_id/chats" element={<Chat />} />
          
          {/* Investor Routes */}
          <Route path="/investor/:investor_id/analytics" element={<InvestorAnalytics />} />
          <Route path="/investor/:investor_id/startup/:startup_id" element={<InvestorStartupAnalytics />} />
          <Route path="/investor/:investor_id/blogs" element={<InvestorBlogs />} />
          <Route path="/investor/:investor_id/create-blog" element={<InvestorCreateBlog />} />
          <Route path="/investor/:investor_id/chats" element={<Chat />} />
          
          {/* Video Call Route */}
          <Route path="/call/:roomId" element={<VideoCall />} />
        </Routes>
      </Router>
    </SocketProvider>
  );
};

export default App;