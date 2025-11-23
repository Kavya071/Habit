import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FiTrendingUp, FiTarget, FiAward, FiDollarSign, FiClock, FiCheckCircle } from 'react-icons/fi';
import { auth, db } from '../firebase';
import { doc, getDoc, collection, query, where, getDocs } from 'firebase/firestore';
import { useAuthState } from 'react-firebase-hooks/auth';
import { useNavigate } from 'react-router-dom';
import './Dashboard.css';

const Dashboard = () => {
  const [user] = useAuthState(auth);
  const navigate = useNavigate();
  const [userData, setUserData] = useState(null);
  const [activeChallenges, setActiveChallenges] = useState([]);
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      navigate('/');
      return;
    }

    const fetchUserData = async () => {
      try {
        const userDoc = await getDoc(doc(db, 'users', user.uid));
        if (userDoc.exists()) {
          setUserData(userDoc.data());
        }

        // Fetch active challenges
        const challengesQuery = query(
          collection(db, 'userChallenges'),
          where('uid', '==', user.uid),
          where('status', '==', 'active')
        );
        const challengesSnapshot = await getDocs(challengesQuery);
        setActiveChallenges(challengesSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));

        setLoading(false);
      } catch (error) {
        console.error('Error fetching user data:', error);
        setLoading(false);
      }
    };

    fetchUserData();
  }, [user, navigate]);

  if (loading) {
    return (
      <div className="dashboard-loading">
        <div className="spinner"></div>
        <p>Loading your dashboard...</p>
      </div>
    );
  }

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  const stats = {
    streak: userData?.meta?.streak?.current || 0,
    completed: userData?.completedChallenges || 0,
    invested: userData?.wallet?.invested || 0,
    balance: userData?.wallet?.balance || 0,
    escrowed: userData?.wallet?.escrowed || 0
  };

  return (
    <div className="dashboard">
      <div className="dashboard-container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="dashboard-grid"
        >
          {/* Left Column */}
          <div className="dashboard-main">
            {/* Greeting */}
            <div className="greeting-section">
              <h1 className="greeting-title">
                {getGreeting()}, {user?.displayName || 'there'} 👋
              </h1>
              <p className="greeting-subtitle">Keep the streak alive!</p>
              <div className="greeting-actions">
                <button className="btn-primary" onClick={() => navigate('/challenges')}>
                  Start Challenge
                </button>
                <button className="btn-secondary">Create Custom</button>
              </div>
            </div>

            {/* Active Challenges */}
            <section className="section">
              <div className="section-header">
                <h2 className="section-title">Active Challenges</h2>
                <button className="btn-link">View all</button>
              </div>

              {activeChallenges.length === 0 ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="empty-state"
                >
                  <FiTarget size={48} />
                  <h3>No active challenges</h3>
                  <p>Start your first challenge to build lasting habits</p>
                  <button className="btn-primary" onClick={() => navigate('/challenges')}>
                    Browse Challenges
                  </button>
                </motion.div>
              ) : (
                <div className="challenges-grid">
                  {activeChallenges.map((challenge, index) => (
                    <motion.div
                      key={challenge.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="challenge-card"
                    >
                      <div className="challenge-header">
                        <div className="challenge-icon">💧</div>
                        <span className={`status-pill ${challenge.status}`}>
                          {challenge.status === 'pending_verification' ? 'Verifying' : 'Active'}
                        </span>
                      </div>
                      <h3 className="challenge-title">{challenge.challengeTitle || 'Hydration Hero'}</h3>
                      <p className="challenge-subtitle">Stake: ₹{challenge.stake}</p>
                      <div className="challenge-progress">
                        <div className="progress-bar">
                          <div className="progress-fill" style={{ width: '60%' }}></div>
                        </div>
                        <span className="progress-text">Day 3 of 7</span>
                      </div>
                      <button className="btn-challenge">Upload Proof</button>
                    </motion.div>
                  ))}
                </div>
              )}
            </section>

            {/* Activity Feed */}
            <section className="section">
              <div className="section-header">
                <h2 className="section-title">Recent Activity</h2>
              </div>
              <div className="activity-feed">
                {activities.length === 0 ? (
                  <div className="activity-empty">
                    <p>No recent activity. Start a challenge to see updates here!</p>
                  </div>
                ) : (
                  activities.map((activity, index) => (
                    <div key={index} className="activity-item">
                      <div className="activity-icon">
                        <FiCheckCircle />
                      </div>
                      <div className="activity-content">
                        <p className="activity-text">{activity.text}</p>
                        <span className="activity-time">{activity.time}</span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </section>
          </div>

          {/* Right Column */}
          <aside className="dashboard-sidebar">
            {/* Wallet Card */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="wallet-card"
            >
              <h3 className="wallet-title">Wallet</h3>
              <div className="wallet-balance">
                <span className="balance-label">Available Balance</span>
                <div className="balance-amount">₹{stats.balance}</div>
              </div>
              <div className="wallet-details">
                <div className="wallet-item">
                  <span>Escrowed</span>
                  <span className="wallet-value">₹{stats.escrowed}</span>
                </div>
                <div className="wallet-item">
                  <span>Invested</span>
                  <span className="wallet-value">₹{stats.invested}</span>
                </div>
              </div>
              <div className="wallet-actions">
                <button className="btn-wallet-primary">Recharge</button>
                <button className="btn-wallet-secondary">Withdraw</button>
              </div>
            </motion.div>

            {/* KPI Cards */}
            <div className="kpi-grid">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="kpi-card"
              >
                <div className="kpi-icon" style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
                  <FiTarget />
                </div>
                <div className="kpi-content">
                  <div className="kpi-value">{stats.streak}</div>
                  <div className="kpi-label">Day Streak</div>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="kpi-card"
              >
                <div className="kpi-icon" style={{ background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)' }}>
                  <FiAward />
                </div>
                <div className="kpi-content">
                  <div className="kpi-value">{stats.completed}</div>
                  <div className="kpi-label">Completed</div>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="kpi-card"
              >
                <div className="kpi-icon" style={{ background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)' }}>
                  <FiTrendingUp />
                </div>
                <div className="kpi-content">
                  <div className="kpi-value">₹{stats.invested}</div>
                  <div className="kpi-label">Invested</div>
                </div>
              </motion.div>
            </div>

            {/* Quick Actions */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="quick-actions"
            >
              <h3 className="quick-actions-title">Quick Actions</h3>
              <div className="quick-actions-grid">
                <button className="quick-action-btn" onClick={() => navigate('/investments')}>
                  <FiDollarSign />
                  <span>Investments</span>
                </button>
                <button className="quick-action-btn" onClick={() => navigate('/achievements')}>
                  <FiAward />
                  <span>Achievements</span>
                </button>
              </div>
            </motion.div>
          </aside>
        </motion.div>
      </div>
    </div>
  );
};

export default Dashboard;
