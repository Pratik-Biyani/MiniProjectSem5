import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import AdminEventsPage from './pages/admin/AdminEventsPage';
import AdminEventDashboard from './pages/admin/AdminEventDashboard';

import BrowseEvents from './pages/startup/BrowseEvents';
import MyEvents from './pages/startup/MyEvents';



const App = () => {
  return (
    <Router>
      <Routes>
        {/* Admin */}
        <Route path="/admin/:admin_id/events" element={<AdminEventsPage />} />
        <Route path="/admin/:admin_id/events/:event_id" element={<AdminEventDashboard />} />

        {/* Startup */}
        <Route path="/startup/:startup_id/events" element={<BrowseEvents />} />
        <Route path="/startup/:startup_id/myevents" element={<MyEvents />} />

        
      </Routes>
    </Router>
  );
};

export default App;
