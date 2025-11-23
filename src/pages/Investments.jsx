import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiTrendingUp, FiDollarSign, FiPieChart, FiArrowUp, FiArrowDown } from 'react-icons/fi';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '../firebase';
import './Investments.css';

const Investments = () => {
  const navigate = useNavigate();
  const [user, loading] = useAuthState(auth);
  const [selectedTab, setSelectedTab] = useState('Portfolio');

  useEffect(() => {
    if (!loading && !user) {
      navigate('/');
    }
  }, [user, loading, navigate]);

  if (loading) {
    return (
      <div className="investments-page">
        <div className="loading-spinner">Loading...</div>
      </div>
    );
  }

  const portfolio = {
    totalValue: 25000,
    totalGain: 2500,
    gainPercent: 11.1
  };

  const investments = [
    {
      id: 1,
      name: 'Digital Gold',
      type: 'Gold',
      amount: 10000,
      currentValue: 11200,
      gain: 1200,
      gainPercent: 12,
      icon: '🥇'
    },
    {
      id: 2,
      name: 'US Stocks',
      type: 'Stocks',
      amount: 8000,
      currentValue: 8800,
      gain: 800,
      gainPercent: 10,
      icon: '📈'
    },
    {
      id: 3,
      name: 'Mutual Funds',
      type: 'Funds',
      amount: 5000,
      currentValue: 5500,
      gain: 500,
      gainPercent: 10,
      icon: '📊'
    }
  ];

  return (
    <div className="investments-page">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="investments-container"
      >
        <div className="investments-header">
          <h1>Investments & Wallet</h1>
          <p>Grow your money while building habits</p>
        </div>

        <div className="portfolio-summary">
          <div className="portfolio-card">
            <div className="portfolio-icon">
              <FiPieChart />
            </div>
            <div className="portfolio-content">
              <div className="portfolio-label">Total Portfolio Value</div>
              <div className="portfolio-value">₹{portfolio.totalValue.toLocaleString()}</div>
              <div className="portfolio-gain positive">
                <FiArrowUp />
                <span>₹{portfolio.totalGain.toLocaleString()} ({portfolio.gainPercent}%)</span>
              </div>
            </div>
          </div>
        </div>

        <div className="investments-tabs">
          {['Portfolio', 'Transactions', 'Wallet'].map(tab => (
            <button
              key={tab}
              className={`tab-btn ${selectedTab === tab ? 'active' : ''}`}
              onClick={() => setSelectedTab(tab)}
            >
              {tab}
            </button>
          ))}
        </div>

        {selectedTab === 'Portfolio' && (
          <div className="investments-grid">
            {investments.map((investment, index) => (
              <motion.div
                key={investment.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="investment-card"
              >
                <div className="investment-icon">{investment.icon}</div>
                <div className="investment-content">
                  <h3>{investment.name}</h3>
                  <p className="investment-type">{investment.type}</p>
                  <div className="investment-values">
                    <div className="value-item">
                      <span className="value-label">Invested</span>
                      <span className="value-amount">₹{investment.amount.toLocaleString()}</span>
                    </div>
                    <div className="value-item">
                      <span className="value-label">Current</span>
                      <span className="value-amount">₹{investment.currentValue.toLocaleString()}</span>
                    </div>
                  </div>
                  <div className={`investment-gain ${investment.gain >= 0 ? 'positive' : 'negative'}`}>
                    {investment.gain >= 0 ? <FiArrowUp /> : <FiArrowDown />}
                    <span>₹{Math.abs(investment.gain).toLocaleString()} ({investment.gainPercent}%)</span>
                  </div>
                </div>
              </motion.div>
            ))}

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="add-investment-card"
            >
              <FiDollarSign size={48} />
              <h3>Add New Investment</h3>
              <p>Diversify your portfolio</p>
              <button className="btn-add-investment">Explore Options</button>
            </motion.div>
          </div>
        )}

        {selectedTab === 'Transactions' && (
          <div className="transactions-section">
            <p className="coming-soon">Transaction history coming soon...</p>
          </div>
        )}

        {selectedTab === 'Wallet' && (
          <div className="wallet-section">
            <div className="wallet-actions-grid">
              <button className="wallet-action-card">
                <FiArrowUp size={32} />
                <h3>Recharge Wallet</h3>
                <p>Add money to your wallet</p>
              </button>
              <button className="wallet-action-card">
                <FiArrowDown size={32} />
                <h3>Withdraw Funds</h3>
                <p>Transfer to bank account</p>
              </button>
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default Investments;
