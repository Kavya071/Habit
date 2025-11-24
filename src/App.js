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
import InstagramDetoxChallenge from './pages/InstagramDetoxChallenge';
import WalkingChallenge from './pages/WalkingChallenge';
import RunningChallenge from './pages/RunningChallenge';
import MeditationChallenge from './pages/MeditationChallenge';
import GymChallenge from './pages/GymChallenge';
import EarlyRiseChallenge from './pages/EarlyRiseChallenge';
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
          <Route path="/instagram-detox-challenge" element={<InstagramDetoxChallenge />} />
          <Route path="/walking-challenge" element={<WalkingChallenge />} />
          <Route path="/running-challenge" element={<RunningChallenge />} />
          <Route path="/meditation-challenge" element={<MeditationChallenge />} />
          <Route path="/gym-challenge" element={<GymChallenge />} />
          <Route path="/earlyrise-challenge" element={<EarlyRiseChallenge />} />
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
