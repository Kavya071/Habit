import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import './App.css';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Dashboard from './pages/Dashboard';
import Challenges from './pages/Challenges';
import ChallengeDetail from './pages/ChallengeDetail';
import WaterChallenge from './pages/WaterChallenge';
import BookChallenge from './pages/BookChallenge';
import RunningChallenge from './pages/RunningChallenge';
import WalkingChallenge from './pages/WalkingChallenge';
import DetoxChallenge from './pages/DetoxChallenge';
import DSAChallenge from './pages/DSAChallenge';
import SQLChallenge from './pages/SQLChallenge';
import EarlyRiseChallenge from './pages/EarlyRiseChallenge';
import EarlySleepChallenge from './pages/EarlySleepChallenge';
import Investments from './pages/Investments';
import Achievements from './pages/Achievements';

function AppContent() {
  const location = useLocation();
  const [sidebarWidth, setSidebarWidth] = useState(260);
  const isPortalPage = location.pathname !== '/';

  const handleSidebarChange = (width) => {
    setSidebarWidth(width);
  };

  return (
    <div className="app">
      {isPortalPage ? (
        <Sidebar onWidthChange={handleSidebarChange} />
      ) : (
        <Navbar />
      )}
      <div 
        className={isPortalPage ? 'app-content-with-sidebar' : ''}
        style={isPortalPage && window.innerWidth > 768 ? { marginLeft: `${sidebarWidth}px`, width: `calc(100% - ${sidebarWidth}px)` } : {}}
      >
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/challenges" element={<Challenges />} />
          <Route path="/challenge/:challengeId" element={<ChallengeDetail />} />
          <Route path="/water-challenge" element={<WaterChallenge />} />
          <Route path="/book-challenge" element={<BookChallenge />} />
          <Route path="/running-challenge" element={<RunningChallenge />} />
          <Route path="/walking-challenge" element={<WalkingChallenge />} />
          <Route path="/detox-challenge" element={<DetoxChallenge />} />
          <Route path="/dsa-challenge" element={<DSAChallenge />} />
          <Route path="/sql-challenge" element={<SQLChallenge />} />
          <Route path="/earlyrise-challenge" element={<EarlyRiseChallenge />} />
          <Route path="/earlysleep-challenge" element={<EarlySleepChallenge />} />
          <Route path="/investments" element={<Investments />} />
          <Route path="/achievements" element={<Achievements />} />
        </Routes>
        {!isPortalPage && <Footer />}
      </div>
    </div>
  );
}

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;
