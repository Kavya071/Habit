import React from 'react';
import { motion } from 'framer-motion';
import { FiArrowRight, FiTrendingUp, FiTarget, FiAward } from 'react-icons/fi';
import { Link } from 'react-scroll';
import './Hero.css';

const Hero = () => {
  const stats = [
    { icon: <FiTarget />, number: '10K+', label: 'Active Users' },
    { icon: <FiTrendingUp />, number: '85%', label: 'Success Rate' },
    { icon: <FiAward />, number: '50K+', label: 'Habits Completed' }
  ];

  return (
    <section className="hero" id="hero">
      <div className="hero-background">
        <div className="gradient-orb orb-1"></div>
        <div className="gradient-orb orb-2"></div>
        <div className="gradient-orb orb-3"></div>
      </div>

      <div className="hero-container">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="hero-content"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="hero-badge"
          >
            AI-Powered Habit Building Platform
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.8 }}
            className="hero-title"
          >
            Build Habits That
            <span className="gradient-text"> Stick</span>
            <br />
            With Real Money at Stake
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.8 }}
            className="hero-description"
          >
            Put a small amount on the line. Complete the habit → get it back with rewards.
            Miss it → it gets invested. Either way, you grow.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7, duration: 0.8 }}
            className="hero-buttons"
          >
            <motion.button
              whileHover={{ scale: 1.05, boxShadow: '0 10px 30px rgba(99, 102, 241, 0.4)' }}
              whileTap={{ scale: 0.95 }}
              className="btn-primary"
            >
              Start Building Habits
              <FiArrowRight />
            </motion.button>

            <Link to="how-it-works" smooth={true} duration={500} offset={-80}>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="btn-secondary"
              >
                See How It Works
              </motion.button>
            </Link>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1, duration: 0.8 }}
            className="hero-stats"
          >
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1 + index * 0.1, duration: 0.5 }}
                className="stat-card"
                whileHover={{ y: -5, boxShadow: '0 10px 30px rgba(0,0,0,0.1)' }}
              >
                <div className="stat-icon">{stat.icon}</div>
                <div className="stat-number">{stat.number}</div>
                <div className="stat-label">{stat.label}</div>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.5, duration: 0.8 }}
          className="hero-image"
        >
          <div className="phone-mockup">
            <div className="phone-screen">
              <div className="app-preview">
                <div className="preview-header">
                  <div className="preview-avatar"></div>
                  <div className="preview-info">
                    <div className="preview-name"></div>
                    <div className="preview-streak"></div>
                  </div>
                </div>
                <div className="preview-challenge">
                  <div className="challenge-icon"></div>
                  <div className="challenge-details">
                    <div className="challenge-title"></div>
                    <div className="challenge-progress"></div>
                  </div>
                </div>
                <div className="preview-stats">
                  <div className="stat-box"></div>
                  <div className="stat-box"></div>
                  <div className="stat-box"></div>
                </div>
                <div className="preview-button"></div>
              </div>
            </div>
          </div>
          
          <motion.div
            animate={{ 
              y: [0, -20, 0],
              rotate: [0, 5, 0, -5, 0]
            }}
            transition={{ 
              duration: 6,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            className="floating-card card-1"
          >
            <FiTrendingUp size={24} />
            <p>+15% Returns</p>
          </motion.div>

          <motion.div
            animate={{ 
              y: [0, -15, 0],
              rotate: [0, -5, 0, 5, 0]
            }}
            transition={{ 
              duration: 5,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 1
            }}
            className="floating-card card-2"
          >
            <FiAward size={24} />
            <p>30 Day Streak!</p>
          </motion.div>
        </motion.div>
      </div>

      <div className="scroll-indicator">
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          className="scroll-arrow"
        ></motion.div>
      </div>
    </section>
  );
};

export default Hero;
