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
          id: 'water',
          title: 'Hydration Challenge',
          description: 'Drink 3 liters of water daily',
          duration: 30,
          category: 'Health',
          participants: 3452,
          successRate: 82,
          minStake: 100,
          maxStake: 10000,
          verified: true,
          difficulty: 'Easy',
          icon: '💧',
          sponsored: true,
          sponsor: 'Bisleri'
        },
        {
          id: 'book',
          title: 'Reading Challenge',
          description: 'Read 10-20 pages every day',
          duration: 30,
          category: 'Learning',
          participants: 2847,
          successRate: 75,
          minStake: 100,
          maxStake: 10000,
          verified: true,
          difficulty: 'Easy',
          icon: '📚',
          sponsored: true,
          sponsor: 'Kindle'
        },
        {
          id: 'running',
          title: 'Running Challenge',
          description: 'Run 5km daily',
          duration: 30,
          category: 'Fitness',
          participants: 4235,
          successRate: 68,
          minStake: 500,
          maxStake: 10000,
          verified: true,
          difficulty: 'Medium',
          icon: '🏃',
          sponsored: true,
          sponsor: 'Nike'
        },
        {
          id: 'walking',
          title: 'Walking Challenge',
          description: 'Walk 10,000 steps daily',
          duration: 30,
          category: 'Fitness',
          participants: 5621,
          successRate: 85,
          minStake: 300,
          maxStake: 5000,
          verified: true,
          difficulty: 'Easy',
          icon: '🚶',
          sponsored: true,
          sponsor: 'Decathlon'
        },
        {
          id: 'detox',
          title: 'Social Media Detox',
          description: 'Reduce screen time on Instagram/Facebook',
          duration: 21,
          category: 'Wellness',
          participants: 3892,
          successRate: 71,
          minStake: 500,
          maxStake: 5000,
          verified: true,
          difficulty: 'Hard',
          icon: '📱',
          sponsored: true,
          sponsor: 'Digital Wellbeing'
        },
        {
          id: 'dsa',
          title: 'DSA Challenge',
          description: 'Solve 1 DSA problem daily',
          duration: 30,
          category: 'Learning',
          participants: 6234,
          successRate: 73,
          minStake: 500,
          maxStake: 10000,
          verified: true,
          difficulty: 'Medium',
          icon: '💻',
          sponsored: true,
          sponsor: 'LeetCode'
        },
        {
          id: 'sql',
          title: 'SQL Challenge',
          description: 'Solve 1 SQL query daily',
          duration: 30,
          category: 'Learning',
          participants: 4156,
          successRate: 79,
          minStake: 500,
          maxStake: 10000,
          verified: true,
          difficulty: 'Medium',
          icon: '🗄️',
          sponsored: true,
          sponsor: 'HackerRank'
        },
        {
          id: 'earlyrise',
          title: 'Early Morning Challenge',
          description: 'Wake up at 6 AM daily',
          duration: 21,
          category: 'Wellness',
          participants: 4892,
          successRate: 64,
          minStake: 500,
          maxStake: 5000,
          verified: true,
          difficulty: 'Hard',
          icon: '🌅',
          sponsored: true,
          sponsor: 'Headspace'
        },
        {
          id: 'earlysleep',
          title: 'Early Sleep Challenge',
          description: 'Sleep by 10 PM daily',
          duration: 21,
          category: 'Wellness',
          participants: 3721,
          successRate: 69,
          minStake: 500,
          maxStake: 5000,
          verified: true,
          difficulty: 'Medium',
          icon: '😴',
          sponsored: true,
          sponsor: 'Sleep Foundation'
        },
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
            className={`challenge-card ${challenge.sponsored ? 'sponsored-challenge' : ''}`}
            onClick={() => {
              if (challenge.id === 'water') navigate('/water-challenge');
              else if (challenge.id === 'book') navigate('/book-challenge');
              else if (challenge.id === 'running') navigate('/running-challenge');
              else if (challenge.id === 'walking') navigate('/walking-challenge');
              else if (challenge.id === 'detox') navigate('/detox-challenge');
              else if (challenge.id === 'dsa') navigate('/dsa-challenge');
              else if (challenge.id === 'sql') navigate('/sql-challenge');
              else if (challenge.id === 'earlyrise') navigate('/earlyrise-challenge');
              else if (challenge.id === 'earlysleep') navigate('/earlysleep-challenge');
              else navigate(`/challenge/${challenge.id}`);
            }}
          >
            {challenge.sponsored && (
              <div className="sponsored-badge">
                <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/f/f9/Bisleri_Logo.svg/2560px-Bisleri_Logo.svg.png" alt={challenge.sponsor} />
                <span>SPONSORED</span>
              </div>
            )}
            
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
