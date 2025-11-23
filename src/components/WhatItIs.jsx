import React from 'react';
import { motion } from 'framer-motion';
import { FiDollarSign, FiCheckCircle, FiTrendingUp, FiZap } from 'react-icons/fi';
import './WhatItIs.css';

const WhatItIs = () => {
  const features = [
    {
      icon: <FiDollarSign />,
      title: 'Lock Money, Stay Committed',
      description: 'A small stake increases daily discipline.'
    },
    {
      icon: <FiCheckCircle />,
      title: 'AI-Verified Proof',
      description: 'Photo, screenshot, or location — checked in seconds.'
    },
    {
      icon: <FiTrendingUp />,
      title: 'Win or Invest',
      description: 'Complete → money back + XP. Miss → invested in gold/assets.'
    },
    {
      icon: <FiZap />,
      title: 'Keep Leveling Up',
      description: 'Streaks, badges, challenges, leaderboards.'
    }
  ];

  return (
    <section className="what-it-is" id="what-it-is">
      <div className="section-container">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="section-header"
        >
          <span className="section-badge">What It Is</span>
          <h2 className="section-title">
            A Habit System Powered by Psychology, Money & AI
          </h2>
          <p className="section-description">
            Consistency becomes easy when your habits have real consequences.
          </p>
        </motion.div>

        <div className="features-grid">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1, duration: 0.6 }}
              viewport={{ once: true }}
              whileHover={{ y: -10, boxShadow: '0 20px 40px rgba(0,0,0,0.1)' }}
              className="feature-card"
            >
              <div className="feature-icon">
                {feature.icon}
              </div>
              <h3 className="feature-title">{feature.title}</h3>
              <p className="feature-description">{feature.description}</p>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.6 }}
          viewport={{ once: true }}
          className="value-proposition"
        >
          <div className="value-content">
            <h3>The Most Effective Way to Build Real Habits</h3>
            <p>
              Loss aversion + instant accountability = unmatched consistency.
            </p>
            <div className="value-stats">
              <div className="value-stat">
                <h4>85%</h4>
                <p>Higher Completion Rate vs Free Apps</p>
              </div>
              <div className="value-stat">
                <h4>3.2x</h4>
                <p>Better Habit Retention After 30 Days</p>
              </div>
              <div className="value-stat">
                <h4>₹50K+</h4>
                <p>Average Wealth Built from Failed Challenges</p>
              </div>
            </div>
          </div>
          <div className="value-visual">
            <div className="visual-card card-success">
              <div className="card-icon success">
                <FiCheckCircle size={32} />
              </div>
              <div className="card-label">Challenge Completed</div>
              <div className="card-reward">+₹50 + Streak + XP</div>
            </div>
            <div className="visual-arrow">OR</div>
            <div className="visual-card card-invest">
              <div className="card-icon invest">
                <FiTrendingUp size={32} />
              </div>
              <div className="card-label">Challenge Failed</div>
              <div className="card-reward">₹50 → Invested in Gold</div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default WhatItIs;
