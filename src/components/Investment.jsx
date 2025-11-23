import React from 'react';
import { motion } from 'framer-motion';
import { FiTrendingUp, FiShield, FiPieChart, FiDollarSign } from 'react-icons/fi';
import './Investment.css';

const Investment = () => {
  const investments = [
    {
      icon: '🪙',
      name: 'Digital Gold',
      description: 'Safe asset, inflation protection.',
      returns: '12-15% annually',
      liquidity: 'Instant sell',
      risk: 'Low'
    },
    {
      icon: '📈',
      name: 'US Stocks (ETFs)',
      description: 'S&P 500 and NASDAQ exposure.',
      returns: '15-20% annually',
      liquidity: '1-2 days',
      risk: 'Medium'
    },
    {
      icon: '💰',
      name: 'Mutual Funds',
      description: 'Managed equity & debt funds.',
      returns: '10-14% annually',
      liquidity: '2-3 days',
      risk: 'Low-Medium'
    },
    {
      icon: '🏦',
      name: 'Fixed Deposits',
      description: 'Guaranteed returns, zero risk.',
      returns: '6-8% annually',
      liquidity: 'At maturity',
      risk: 'Zero'
    }
  ];

  return (
    <section className="investment" id="investment">
      <div className="section-container">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="section-header"
        >
          <span className="section-badge">Investment Strategy</span>
          <h2 className="section-title">
            Where Your Money Goes
          </h2>
          <p className="section-description">
            Held safely while the challenge runs. Returned instantly on completion. Automatically invested if you fail.
          </p>
        </motion.div>

        <div className="investment-grid">
          {investments.map((investment, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
              viewport={{ once: true }}
              whileHover={{ y: -10, boxShadow: '0 20px 40px rgba(0,0,0,0.15)' }}
              className="investment-card"
            >
              <div className="investment-icon">{investment.icon}</div>
              <h3 className="investment-name">{investment.name}</h3>
              <p className="investment-description">{investment.description}</p>
              <div className="investment-stats">
                <div className="stat-row">
                  <span className="stat-label">Returns</span>
                  <span className="stat-value success">{investment.returns}</span>
                </div>
                <div className="stat-row">
                  <span className="stat-label">Liquidity</span>
                  <span className="stat-value">{investment.liquidity}</span>
                </div>
                <div className="stat-row">
                  <span className="stat-label">Risk</span>
                  <span className={`stat-value risk-${investment.risk.toLowerCase().replace('-', '')}`}>
                    {investment.risk}
                  </span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.6 }}
          viewport={{ once: true }}
          className="investment-flow"
        >
          <h3>Simple • Safe • Transparent</h3>
          <div className="flow-diagram">
            <div className="flow-step">
              <div className="flow-icon">
                <FiDollarSign size={32} />
              </div>
              <div className="flow-content">
                <h4>Challenge Failed</h4>
                <p>You miss your daily challenge deadline</p>
              </div>
            </div>

            <div className="flow-arrow">→</div>

            <div className="flow-step">
              <div className="flow-icon">
                <FiPieChart size={32} />
              </div>
              <div className="flow-content">
                <h4>Asset Selection</h4>
                <p>Money goes to your chosen investment asset</p>
              </div>
            </div>

            <div className="flow-arrow">→</div>

            <div className="flow-step">
              <div className="flow-icon">
                <FiTrendingUp size={32} />
              </div>
              <div className="flow-content">
                <h4>Automatic Growth</h4>
                <p>Investment grows over time with market returns</p>
              </div>
            </div>

            <div className="flow-arrow">→</div>

            <div className="flow-step">
              <div className="flow-icon">
                <FiShield size={32} />
              </div>
              <div className="flow-content">
                <h4>Portfolio Building</h4>
                <p>Withdraw anytime or let it compound</p>
              </div>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.6 }}
          viewport={{ once: true }}
          className="investment-example"
        >
          <div className="example-content">
            <h3>Real Example: Priya's Journey</h3>
            <p className="example-intro">
              Priya committed to a 90-day DSA challenge with ₹50/day stake. Here's what happened:
            </p>
            <div className="example-stats">
              <div className="example-stat">
                <div className="example-number">60 days</div>
                <div className="example-label">Challenges Completed</div>
                <div className="example-result success">₹3,000 returned + rewards</div>
              </div>
              <div className="example-divider">+</div>
              <div className="example-stat">
                <div className="example-number">30 days</div>
                <div className="example-label">Challenges Failed</div>
                <div className="example-result invest">₹1,500 → Gold (now ₹1,890)</div>
              </div>
              <div className="example-divider">=</div>
              <div className="example-stat highlight">
                <div className="example-number">Net Result</div>
                <div className="example-label">Total Value</div>
                <div className="example-result total">
                  ₹4,890 value + 60-day coding habit!
                </div>
              </div>
            </div>
            <p className="example-conclusion">
              She built a solid coding habit AND grew her wealth by 26%. That's the power
              of our system - you can never truly lose.
            </p>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.6 }}
          viewport={{ once: true }}
          className="investment-features"
        >
          <div className="feature-box">
            <FiShield size={40} />
            <h4>100% Secure</h4>
            <p>Partnered with regulated financial institutions. Your money is always safe.</p>
          </div>
          <div className="feature-box">
            <FiTrendingUp size={40} />
            <h4>Auto-Rebalancing</h4>
            <p>Portfolio automatically adjusts based on market conditions and your preferences.</p>
          </div>
          <div className="feature-box">
            <FiPieChart size={40} />
            <h4>Full Transparency</h4>
            <p>Track your investment performance in real-time with detailed analytics.</p>
          </div>
          <div className="feature-box">
            <FiDollarSign size={40} />
            <h4>Zero Fees</h4>
            <p>No hidden charges. No management fees. Keep 100% of your returns.</p>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Investment;
