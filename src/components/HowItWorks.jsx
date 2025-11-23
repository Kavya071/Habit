import React from 'react';
import { motion } from 'framer-motion';
import { FiTarget, FiDollarSign, FiCamera, FiCpu, FiCheckCircle, FiTrendingUp } from 'react-icons/fi';
import './HowItWorks.css';

const HowItWorks = () => {
  const steps = [
    {
      icon: <FiTarget />,
      number: '01',
      title: 'Pick a Challenge',
      description: 'Choose from curated habits: water, reading, coding, steps, sleep, meals.',
      color: 'var(--primary)'
    },
    {
      icon: <FiDollarSign />,
      number: '02',
      title: 'Lock Your Money',
      description: 'Stake ₹10-₹50. This stays locked until completion or failure.',
      color: 'var(--secondary)'
    },
    {
      icon: <FiCheckCircle />,
      number: '03',
      title: 'Complete & Verify',
      description: 'Do it. Upload proof. AI verifies. Pass → money back + rewards. Fail → invested.',
      color: 'var(--success)'
    }
  ];

  return (
    <section className="how-it-works" id="how-it-works">
      <div className="section-container">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="section-header"
        >
          <span className="section-badge">How It Works</span>
          <h2 className="section-title">
            Just 3 Simple Steps
          </h2>
          <p className="section-description">
            Pick a challenge, lock your money, complete it & verify.
          </p>
        </motion.div>

        <div className="steps-container">
          {steps.map((step, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1, duration: 0.6 }}
              viewport={{ once: true }}
              className="step-card"
            >
              <div className="step-number" style={{ color: step.color }}>
                {step.number}
              </div>
              <div className="step-icon" style={{ background: step.color }}>
                {step.icon}
              </div>
              <div className="step-content">
                <h3 className="step-title">{step.title}</h3>
                <p className="step-description">{step.description}</p>
              </div>
              {index < steps.length - 1 && (
                <div className="step-connector"></div>
              )}
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.6 }}
          viewport={{ once: true }}
          className="challenge-examples"
        >
          <h3>Popular Habit Challenges</h3>
          <div className="examples-grid">
            {[
              { name: 'Hydration Hero', desc: 'Drink 8 glasses of water daily', emoji: '💧' },
              { name: 'Book Worm', desc: 'Read 10 pages every day', emoji: '📚' },
              { name: 'Code Warrior', desc: 'Solve 1 DSA/SQL problem', emoji: '💻' },
              { name: 'Step Master', desc: 'Walk 10,000 steps daily', emoji: '👟' },
              { name: 'Early Bird', desc: 'Wake up before 6 AM', emoji: '🌅' },
              { name: 'Protein Power', desc: 'Eat high-protein breakfast', emoji: '🥚' }
            ].map((challenge, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.05, duration: 0.4 }}
                viewport={{ once: true }}
                whileHover={{ scale: 1.05, boxShadow: '0 10px 30px rgba(0,0,0,0.15)' }}
                className="challenge-card"
              >
                <div className="challenge-emoji">{challenge.emoji}</div>
                <div className="challenge-name">{challenge.name}</div>
                <div className="challenge-desc">{challenge.desc}</div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.6 }}
          viewport={{ once: true }}
          className="cta-box"
        >
          <h3>Ready to Build Real Habits?</h3>
          <p>Join thousands building better lives, one day at a time.</p>
          <motion.button
            whileHover={{ scale: 1.05, boxShadow: '0 10px 30px rgba(99, 102, 241, 0.4)' }}
            whileTap={{ scale: 0.95 }}
            className="cta-button"
          >
            Start Your First Challenge
          </motion.button>
        </motion.div>
      </div>
    </section>
  );
};

export default HowItWorks;
