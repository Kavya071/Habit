import React from 'react';
import { motion } from 'framer-motion';
import { FiCpu, FiShield, FiZap, FiTrendingUp, FiUsers, FiAward, FiTarget, FiSmile } from 'react-icons/fi';
import './Benefits.css';

const Benefits = () => {
  const benefits = [
    {
      icon: <FiCpu />,
      title: 'Psychological Power',
      description: 'Stakes make consistency automatic.',
      stat: '3x',
      statLabel: 'Better Retention'
    },
    {
      icon: <FiShield />,
      title: 'No Real Loss',
      description: 'Missed stakes become investments.',
      stat: '₹50K+',
      statLabel: 'Avg Investment'
    },
    {
      icon: <FiZap />,
      title: 'Instant Accountability',
      description: 'AI verifies in seconds.',
      stat: '<10s',
      statLabel: 'Verification'
    },
    {
      icon: <FiTrendingUp />,
      title: 'Build Wealth While Building Habits',
      description: 'Every failure grows your assets.',
      stat: '15%',
      statLabel: 'Annual Returns'
    },
    {
      icon: <FiUsers />,
      title: 'Supportive Community',
      description: 'Streaks, progress, leaderboards.',
      stat: '10K+',
      statLabel: 'Active Users'
    },
    {
      icon: <FiAward />,
      title: 'Gamified',
      description: 'XP, badges, and achievements.',
      stat: '50+',
      statLabel: 'Badges'
    },
    {
      icon: <FiTarget />,
      title: 'Flexible',
      description: 'Pre-built or custom challenges.',
      stat: '20+',
      statLabel: 'Challenges'
    },
    {
      icon: <FiSmile />,
      title: 'Low-Pressure System',
      description: 'Small stakes, manageable consistency.',
      stat: '85%',
      statLabel: 'Satisfaction'
    }
  ];

  return (
    <section className="benefits" id="benefits">
      <div className="section-container">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="section-header"
        >
          <span className="section-badge">Benefits</span>
          <h2 className="section-title">
            Why StakeYourHabit Works
          </h2>
          <p className="section-description">
            Proven psychology meets real accountability.
          </p>
        </motion.div>

        <div className="benefits-grid">
          {benefits.map((benefit, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05, duration: 0.5 }}
              viewport={{ once: true }}
              whileHover={{ y: -8, boxShadow: '0 20px 40px rgba(0,0,0,0.12)' }}
              className="benefit-card"
            >
              <div className="benefit-header">
                <div className="benefit-icon">{benefit.icon}</div>
                <div className="benefit-stat">
                  <div className="stat-number">{benefit.stat}</div>
                  <div className="stat-label">{benefit.statLabel}</div>
                </div>
              </div>
              <h3 className="benefit-title">{benefit.title}</h3>
              <p className="benefit-description">{benefit.description}</p>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.6 }}
          viewport={{ once: true }}
          className="comparison-section"
        >
          <h3>How We Compare to Traditional Habit Apps</h3>
          <div className="comparison-table">
            <div className="comparison-header">
              <div className="comparison-col">Feature</div>
              <div className="comparison-col highlight">Stake Your Habit</div>
              <div className="comparison-col">Other Apps</div>
            </div>
            {[
              { feature: 'Stakes', us: 'Real Money', them: 'None' },
              { feature: 'Verification', us: 'AI (10s)', them: 'Self-reported' },
              { feature: 'Failed Stakes', us: 'Auto-invested', them: 'Lost' },
              { feature: 'Retention', us: '3x higher', them: 'Low' },
              { feature: 'Community', us: 'Active', them: 'Limited' },
              { feature: 'Gamification', us: 'Full', them: 'Basic' }
            ].map((row, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1, duration: 0.4 }}
                viewport={{ once: true }}
                className="comparison-row"
              >
                <div className="comparison-col feature">{row.feature}</div>
                <div className="comparison-col highlight us">{row.us}</div>
                <div className="comparison-col them">{row.them}</div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Benefits;
