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
          id: 'instagram-detox',
          title: 'Instagram Detox',
          description: 'Limit Instagram usage with screen time tracking',
          duration: 30,
          category: 'Digital Detox',
          participants: 1856,
          successRate: 68,
          minStake: 200,
          maxStake: 10000,
          verified: true,
          difficulty: 'Medium',
          icon: '📱',
          sponsored: true,
          sponsor: 'OnePlus'
        },
        {
          id: 'walking',
          title: 'Walking Challenge',
          description: 'Walk daily and track your steps',
          duration: 30,
          category: 'Fitness',
          participants: 2543,
          successRate: 81,
          minStake: 100,
          maxStake: 10000,
          verified: true,
          difficulty: 'Easy',
          icon: '🚶',
          sponsored: true,
          sponsor: 'Nike'
        },
        {
          id: 'running',
          title: 'Running Challenge',
          description: 'Run daily and reach your distance goals',
          duration: 30,
          category: 'Fitness',
          participants: 1876,
          successRate: 72,
          minStake: 100,
          maxStake: 10000,
          verified: true,
          difficulty: 'Medium',
          icon: '🏃',
          sponsored: true,
          sponsor: 'Adidas'
        },
        {
          id: 'meditation',
          title: 'Meditation Challenge',
          description: 'Daily meditation sessions for mindfulness',
          duration: 30,
          category: 'Wellness',
          participants: 2234,
          successRate: 79,
          minStake: 100,
          maxStake: 10000,
          verified: true,
          difficulty: 'Easy',
          icon: '🧘',
          sponsored: true,
          sponsor: 'Headspace'
        },
        {
          id: 'gym',
          title: 'Gym Challenge',
          description: 'Daily gym sessions to build strength',
          duration: 30,
          category: 'Fitness',
          participants: 1987,
          successRate: 74,
          minStake: 100,
          maxStake: 10000,
          verified: true,
          difficulty: 'Medium',
          icon: '💪',
          sponsored: true,
          sponsor: "Gold's Gym"
        },
        {
          id: 'earlyrise',
          title: 'Early Rise Challenge',
          description: 'Wake up early and start your day right',
          duration: 30,
          category: 'Lifestyle',
          participants: 1654,
          successRate: 67,
          minStake: 100,
          maxStake: 10000,
          verified: true,
          difficulty: 'Medium',
          icon: '🌅',
          sponsored: true,
          sponsor: 'Fitbit'
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
              else if (challenge.id === 'instagram-detox') navigate('/instagram-detox-challenge');
              else if (challenge.id === 'walking') navigate('/walking-challenge');
              else if (challenge.id === 'running') navigate('/running-challenge');
              else if (challenge.id === 'meditation') navigate('/meditation-challenge');
              else if (challenge.id === 'gym') navigate('/gym-challenge');
              else if (challenge.id === 'earlyrise') navigate('/earlyrise-challenge');
              else navigate(`/challenge/${challenge.id}`);
            }}
          >
            {challenge.sponsored && (
              <div className="sponsored-badge">
                <img 
                  src={
                    challenge.sponsor === 'Bisleri' 
                      ? "https://upload.wikimedia.org/wikipedia/commons/thumb/f/f9/Bisleri_Logo.svg/2560px-Bisleri_Logo.svg.png"
                      : challenge.sponsor === 'Kindle'
                      ? "/amazon kindle logo.png"
                      : challenge.sponsor === 'OnePlus'
                      ? "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c3/OnePlus_Logo_red.svg/2560px-OnePlus_Logo_red.svg.png"
                      : ""
                  } 
                  alt={challenge.sponsor} 
                />
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
