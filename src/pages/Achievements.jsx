import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiAward, FiTarget, FiTrendingUp, FiStar, FiLock } from 'react-icons/fi';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '../firebase';
import './Achievements.css';

const Achievements = () => {
  const navigate = useNavigate();
  const [user, loading] = useAuthState(auth);
  const [selectedTab, setSelectedTab] = useState('All');

  useEffect(() => {
    if (!loading && !user) {
      navigate('/');
    }
  }, [user, loading, navigate]);

  if (loading) {
    return (
      <div className="achievements-page">
        <div className="loading-spinner">Loading...</div>
      </div>
    );
  }

  const userStats = {
    totalPoints: 1250,
    level: 5,
    nextLevelPoints: 1500,
    achievements: 8,
    badges: 5
  };

  const achievements = [
    {
      id: 1,
      title: 'First Challenge',
      description: 'Complete your first challenge',
      icon: '🎯',
      tier: 'bronze',
      unlocked: true,
      progress: 100,
      points: 100
    },
    {
      id: 2,
      title: '7-Day Streak',
      description: 'Maintain a 7-day streak',
      icon: '🔥',
      tier: 'bronze',
      unlocked: true,
      progress: 100,
      points: 150
    },
    {
      id: 3,
      title: 'Challenge Master',
      description: 'Complete 10 challenges',
      icon: '👑',
      tier: 'silver',
      unlocked: false,
      progress: 30,
      points: 300
    },
    {
      id: 4,
      title: 'Investor',
      description: 'Make your first investment',
      icon: '💰',
      tier: 'bronze',
      unlocked: true,
      progress: 100,
      points: 200
    },
    {
      id: 5,
      title: '30-Day Warrior',
      description: 'Maintain a 30-day streak',
      icon: '⚔️',
      tier: 'gold',
      unlocked: false,
      progress: 23,
      points: 500
    },
    {
      id: 6,
      title: 'Community Leader',
      description: 'Help 10 users complete challenges',
      icon: '🌟',
      tier: 'gold',
      unlocked: false,
      progress: 0,
      points: 500
    }
  ];

  const badges = [
    { id: 1, name: 'Early Bird', icon: '🌅', unlocked: true },
    { id: 2, name: 'Night Owl', icon: '🦉', unlocked: true },
    { id: 3, name: 'Consistent', icon: '📊', unlocked: true },
    { id: 4, name: 'Risk Taker', icon: '🎲', unlocked: false },
    { id: 5, name: 'Mentor', icon: '👨‍🏫', unlocked: false }
  ];

  const filteredAchievements = selectedTab === 'All' 
    ? achievements 
    : selectedTab === 'Unlocked'
    ? achievements.filter(a => a.unlocked)
    : achievements.filter(a => !a.unlocked);

  return (
    <div className="achievements-page">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="achievements-container"
      >
        <div className="achievements-header">
          <h1>Achievements & Rewards</h1>
          <p>Track your progress and unlock rewards</p>
        </div>

        <div className="user-stats-card">
          <div className="stats-section">
            <div className="stat-item">
              <div className="stat-icon">
                <FiStar />
              </div>
              <div className="stat-content">
                <div className="stat-value">{userStats.totalPoints}</div>
                <div className="stat-label">Total Points</div>
              </div>
            </div>
            <div className="stat-item">
              <div className="stat-icon">
                <FiTrendingUp />
              </div>
              <div className="stat-content">
                <div className="stat-value">Level {userStats.level}</div>
                <div className="stat-label">Current Level</div>
              </div>
            </div>
            <div className="stat-item">
              <div className="stat-icon">
                <FiAward />
              </div>
              <div className="stat-content">
                <div className="stat-value">{userStats.achievements}</div>
                <div className="stat-label">Achievements</div>
              </div>
            </div>
          </div>
          <div className="level-progress">
            <div className="progress-info">
              <span>Level {userStats.level}</span>
              <span>{userStats.totalPoints}/{userStats.nextLevelPoints} XP</span>
            </div>
            <div className="progress-bar">
              <div 
                className="progress-fill" 
                style={{ width: `${(userStats.totalPoints / userStats.nextLevelPoints) * 100}%` }}
              ></div>
            </div>
          </div>
        </div>

        <div className="achievements-tabs">
          {['All', 'Unlocked', 'Locked'].map(tab => (
            <button
              key={tab}
              className={`tab-btn ${selectedTab === tab ? 'active' : ''}`}
              onClick={() => setSelectedTab(tab)}
            >
              {tab}
            </button>
          ))}
        </div>

        <div className="achievements-grid">
          {filteredAchievements.map((achievement, index) => (
            <motion.div
              key={achievement.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`achievement-card ${achievement.unlocked ? 'unlocked' : 'locked'} tier-${achievement.tier}`}
            >
              <div className="achievement-tier-badge">{achievement.tier}</div>
              <div className={`achievement-icon ${!achievement.unlocked ? 'locked-icon' : ''}`}>
                {achievement.unlocked ? achievement.icon : '🔒'}
              </div>
              <div className="achievement-content">
                <h3>{achievement.title}</h3>
                <p>{achievement.description}</p>
                
                {!achievement.unlocked && (
                  <div className="achievement-progress">
                    <div className="progress-bar-mini">
                      <div 
                        className="progress-fill-mini" 
                        style={{ width: `${achievement.progress}%` }}
                      ></div>
                    </div>
                    <span className="progress-text-mini">{achievement.progress}%</span>
                  </div>
                )}

                <div className="achievement-points">
                  <FiStar />
                  <span>{achievement.points} points</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <section className="badges-section">
          <h2 className="section-title">Badges</h2>
          <div className="badges-grid">
            {badges.map((badge, index) => (
              <motion.div
                key={badge.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
                className={`badge-card ${badge.unlocked ? 'unlocked' : 'locked'}`}
              >
                <div className="badge-icon">
                  {badge.unlocked ? badge.icon : <FiLock />}
                </div>
                <div className="badge-name">{badge.name}</div>
              </motion.div>
            ))}
          </div>
        </section>

        <section className="rewards-section">
          <h2 className="section-title">Redeem Rewards</h2>
          <div className="rewards-info">
            <FiAward size={48} />
            <h3>Coming Soon</h3>
            <p>Redeem your points for exciting rewards, discounts, and perks</p>
          </div>
        </section>
      </motion.div>
    </div>
  );
};

export default Achievements;
