import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiSearch, FiTrendingUp, FiUsers, FiAward, FiChevronRight } from 'react-icons/fi';
import { useAuthState } from 'react-firebase-hooks/auth';
import { collection, getDocs } from 'firebase/firestore';
import { auth, db } from '../firebase';
import './Challenges.css';

const Challenges = () => {
  const navigate = useNavigate();
  const [user, loading] = useAuthState(auth);
  const [challenges, setChallenges] = useState([]);
  const [filteredChallenges, setFilteredChallenges] = useState([]);
  const [selectedFilter, setSelectedFilter] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!loading && !user) {
      navigate('/');
    }
  }, [user, loading, navigate]);

  useEffect(() => {
    fetchChallenges();
  }, []);

  useEffect(() => {
    filterChallenges();
  }, [selectedFilter, searchQuery, challenges]);

  const fetchChallenges = async () => {
    try {
      // For now, using sample data. In production, fetch from Firestore
      const sampleChallenges = [
        {
          id: 'ch1',
          title: 'Morning Meditation',
          description: 'Meditate for 10 minutes every morning',
          duration: 21,
          category: 'Wellness',
          participants: 1234,
          successRate: 78,
          minStake: 500,
          maxStake: 5000,
          verified: true,
          difficulty: 'Easy',
          icon: '🧘'
        },
        {
          id: 'ch2',
          title: 'Daily Exercise',
          description: '30 minutes of exercise every day',
          duration: 30,
          category: 'Fitness',
          participants: 2156,
          successRate: 65,
          minStake: 1000,
          maxStake: 10000,
          verified: true,
          difficulty: 'Medium',
          icon: '💪'
        },
        {
          id: 'ch3',
          title: 'Read Books',
          description: 'Read 20 pages of a book daily',
          duration: 30,
          category: 'Learning',
          participants: 987,
          successRate: 72,
          minStake: 500,
          maxStake: 5000,
          verified: true,
          difficulty: 'Easy',
          icon: '📚'
        },
        {
          id: 'ch4',
          title: 'No Social Media',
          description: 'Avoid social media for 21 days',
          duration: 21,
          category: 'Digital Detox',
          participants: 543,
          successRate: 45,
          minStake: 2000,
          maxStake: 15000,
          verified: false,
          difficulty: 'Hard',
          icon: '📵'
        },
        {
          id: 'ch5',
          title: 'Learn a Language',
          description: 'Practice a new language for 30 minutes daily',
          duration: 60,
          category: 'Learning',
          participants: 789,
          successRate: 68,
          minStake: 1000,
          maxStake: 8000,
          verified: true,
          difficulty: 'Medium',
          icon: '🗣️'
        },
        {
          id: 'ch6',
          title: 'Healthy Eating',
          description: 'Follow a balanced diet plan',
          duration: 30,
          category: 'Health',
          participants: 1432,
          successRate: 71,
          minStake: 1000,
          maxStake: 10000,
          verified: true,
          difficulty: 'Medium',
          icon: '🥗'
        }
      ];

      setChallenges(sampleChallenges);
      setFilteredChallenges(sampleChallenges);
      setIsLoading(false);
    } catch (error) {
      console.error('Error fetching challenges:', error);
      setIsLoading(false);
    }
  };

  const filterChallenges = () => {
    let filtered = challenges;

    // Apply filter
    if (selectedFilter !== 'All') {
      if (selectedFilter === 'Verified') {
        filtered = filtered.filter(ch => ch.verified);
      } else if (selectedFilter === 'Popular') {
        filtered = filtered.filter(ch => ch.participants > 1000);
      } else if (selectedFilter === 'My') {
        // Filter user's challenges - implement later
        filtered = [];
      }
    }

    // Apply search
    if (searchQuery) {
      filtered = filtered.filter(ch => 
        ch.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        ch.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        ch.category.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    setFilteredChallenges(filtered);
  };

  const filters = ['All', 'My', 'Popular', 'Verified'];

  if (loading || isLoading) {
    return (
      <div className="challenges-page">
        <div className="loading-spinner">Loading...</div>
      </div>
    );
  }

  return (
    <div className="challenges-page">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="challenges-header"
      >
        <h1>Discover Challenges</h1>
        <p>Choose a challenge and stake your commitment</p>
      </motion.div>

      <div className="challenges-controls">
        <div className="search-bar">
          <FiSearch className="search-icon" />
          <input
            type="text"
            placeholder="Search challenges..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="filter-tabs">
          {filters.map(filter => (
            <button
              key={filter}
              className={`filter-tab ${selectedFilter === filter ? 'active' : ''}`}
              onClick={() => setSelectedFilter(filter)}
            >
              {filter}
            </button>
          ))}
        </div>
      </div>

      <div className="challenges-grid">
        {filteredChallenges.map((challenge, index) => (
          <motion.div
            key={challenge.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="challenge-card"
            onClick={() => navigate(`/challenge/${challenge.id}`)}
          >
            <div className="challenge-icon">{challenge.icon}</div>
            
            <div className="challenge-content">
              <div className="challenge-header-row">
                <h3>{challenge.title}</h3>
                {challenge.verified && (
                  <span className="verified-badge" title="Verified Challenge">
                    <FiAward />
                  </span>
                )}
              </div>
              
              <p className="challenge-description">{challenge.description}</p>
              
              <div className="challenge-meta">
                <span className="challenge-duration">{challenge.duration} days</span>
                <span className="challenge-difficulty difficulty-{challenge.difficulty.toLowerCase()}">
                  {challenge.difficulty}
                </span>
              </div>

              <div className="challenge-stats">
                <div className="stat">
                  <FiUsers />
                  <span>{challenge.participants.toLocaleString()}</span>
                </div>
                <div className="stat">
                  <FiTrendingUp />
                  <span>{challenge.successRate}%</span>
                </div>
              </div>

              <div className="challenge-stake">
                <span className="stake-label">Stake Range:</span>
                <span className="stake-amount">
                  ₹{challenge.minStake} - ₹{challenge.maxStake}
                </span>
              </div>
            </div>

            <div className="challenge-footer">
              <button className="btn-challenge-view">
                View Details <FiChevronRight />
              </button>
            </div>
          </motion.div>
        ))}
      </div>

      {filteredChallenges.length === 0 && (
        <div className="empty-state">
          <p>No challenges found</p>
        </div>
      )}
    </div>
  );
};

export default Challenges;
