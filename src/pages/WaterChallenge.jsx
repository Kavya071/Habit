import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FiDroplet, FiCamera, FiCheckCircle, FiClock, FiTrendingUp, FiAward, FiX } from 'react-icons/fi';
import { auth, db } from '../firebase';
import { useAuthState } from 'react-firebase-hooks/auth';
import { collection, addDoc, query, where, getDocs, updateDoc, doc } from 'firebase/firestore';
import './WaterChallenge.css';

const WaterChallenge = () => {
  const [user] = useAuthState(auth);
  const navigate = useNavigate();
  const { challengeId } = useParams();
  const [selectedDifficulty, setSelectedDifficulty] = useState(null);
  const [stakeAmount, setStakeAmount] = useState(100);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [activeChallenge, setActiveChallenge] = useState(null);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [selectedDay, setSelectedDay] = useState(null);
  const [uploadedImage, setUploadedImage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedGlass, setSelectedGlass] = useState(null);
  const [showGlassTracker, setShowGlassTracker] = useState(false);
  
  const GLASSES_PER_DAY = 15; // 15 glasses = 3L (each glass ~200ml)
  const MIN_INTERVAL_MINUTES = 20; // Minimum 20 minutes between glasses
  const MAX_GLASSES_PER_HOUR = 3; // Maximum 3 glasses per hour
  
  // Check if enough time has passed since last glass
  const canUploadGlass = (dayProgress) => {
    const completedGlasses = dayProgress?.glasses?.filter(g => g !== null) || [];
    
    if (completedGlasses.length === 0) return { allowed: true }; // First glass of the day
    
    // Sort by timestamp to get the most recent
    const lastGlass = completedGlasses[completedGlasses.length - 1];
    const lastUploadTime = new Date(lastGlass.timestamp);
    const now = new Date();
    const minutesSinceLastGlass = (now - lastUploadTime) / (1000 * 60);
    
    // Check minimum interval
    if (minutesSinceLastGlass < MIN_INTERVAL_MINUTES) {
      return {
        allowed: false,
        reason: `Please wait ${Math.ceil(MIN_INTERVAL_MINUTES - minutesSinceLastGlass)} more minutes before drinking your next glass`
      };
    }
    
    // Check glasses per hour
    const oneHourAgo = new Date(now - 60 * 60 * 1000);
    const glassesInLastHour = completedGlasses.filter(g => new Date(g.timestamp) > oneHourAgo).length;
    
    if (glassesInLastHour >= MAX_GLASSES_PER_HOUR) {
      return {
        allowed: false,
        reason: `Maximum ${MAX_GLASSES_PER_HOUR} glasses per hour. Please spread your intake throughout the day`
      };
    }
    
    return { allowed: true };
  };

  useEffect(() => {
    if (!user) {
      navigate('/');
      return;
    }
    fetchActiveChallenge();
  }, [user]);

  const fetchActiveChallenge = async () => {
    if (!user) return;
    
    const q = query(
      collection(db, 'userChallenges'),
      where('userId', '==', user.uid),
      where('challengeType', '==', 'water'),
      where('status', '==', 'active')
    );
    
    const snapshot = await getDocs(q);
    if (!snapshot.empty) {
      const challengeData = snapshot.docs[0].data();
      
      // Migrate old progress structure to new glass-based structure
      if (challengeData.progress && challengeData.progress.length > 0) {
        const firstItem = challengeData.progress[0];
        // Check if it's the old structure (null or simple object without glasses)
        if (firstItem === null || (firstItem && !firstItem.glasses)) {
          challengeData.progress = Array(challengeData.duration).fill(null).map(() => ({
            glasses: Array(GLASSES_PER_DAY).fill(null),
            completed: false
          }));
          
          // Update in database
          await updateDoc(doc(db, 'userChallenges', snapshot.docs[0].id), {
            progress: challengeData.progress
          });
        }
      }
      
      setActiveChallenge({ id: snapshot.docs[0].id, ...challengeData });
    }
  };

  const difficulties = [
    {
      id: 'easy',
      name: 'EASY',
      duration: '1 Day',
      days: 1,
      minStake: 100,
      maxStake: 300,
      maxBonus: 15,
      proofRequired: '2 photos (morning + evening)',
      platformFee: 5,
      description: 'Low commitment • Fast reward',
      color: '#4CAF50',
      icon: '💧'
    },
    {
      id: 'medium',
      name: 'MEDIUM',
      duration: '7 Days',
      days: 7,
      minStake: 300,
      maxStake: 1000,
      maxBonus: 60,
      proofRequired: '1 photo per day',
      platformFee: 3,
      description: 'Build weekly consistency',
      color: '#2196F3',
      icon: '💦'
    },
    {
      id: 'hard',
      name: 'HARD',
      duration: '30 Days',
      days: 30,
      minStake: 1000,
      maxStake: 5000,
      maxBonus: 250,
      proofRequired: 'Daily proof',
      platformFee: 5,
      description: 'Monthly discipline',
      color: '#0077CC',
      icon: '🌊'
    },
    {
      id: 'expert',
      name: 'EXPERT',
      duration: '90 Days',
      days: 90,
      minStake: 2000,
      maxStake: 10000,
      maxBonus: 750,
      proofRequired: 'Daily proof + AI checks',
      platformFee: 7,
      description: 'For elite achievers',
      color: '#9C27B0',
      icon: '⚡'
    }
  ];

  const handleDifficultySelect = (difficulty) => {
    setSelectedDifficulty(difficulty);
    setStakeAmount(difficulty.minStake);
    
    // Smooth scroll to stake section
    setTimeout(() => {
      const stakeSection = document.querySelector('.stake-section');
      if (stakeSection) {
        stakeSection.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }, 100);
  };

  const handleStartChallenge = async () => {
    if (!user || !selectedDifficulty) {
      alert('Please select a difficulty level');
      return;
    }

    setIsLoading(true);

    try {
      const challengeData = {
        userId: user.uid,
        userEmail: user.email,
        challengeType: 'water',
        difficulty: selectedDifficulty.id,
        duration: selectedDifficulty.days,
        stakeAmount: stakeAmount,
        maxBonus: selectedDifficulty.maxBonus,
        platformFee: selectedDifficulty.platformFee,
        startDate: new Date().toISOString(),
        status: 'active',
        completedDays: [],
        progress: Array(selectedDifficulty.days).fill(null).map(() => ({
          glasses: Array(GLASSES_PER_DAY).fill(null),
          completed: false
        })),
        currentDay: 0,
        sponsor: 'Bisleri'
      };

      console.log('Creating challenge...', challengeData);
      const docRef = await addDoc(collection(db, 'userChallenges'), challengeData);
      console.log('Challenge created with ID:', docRef.id);
      
      setActiveChallenge({ id: docRef.id, ...challengeData });
      setShowConfirmModal(false);
      setIsLoading(false);
      
      // Scroll to top to show the progress tracker
      setTimeout(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }, 300);
    } catch (error) {
      console.error('Error starting challenge:', error);
      alert('Failed to start challenge: ' + error.message);
      setIsLoading(false);
    }
  };

  const handleDayClick = (dayIndex) => {
    if (!activeChallenge) return;
    if (dayIndex > activeChallenge.currentDay) return; // Can't upload future days
    
    setSelectedDay(dayIndex);
    setShowGlassTracker(true);
  };

  const handleGlassClick = (glassIndex) => {
    console.log('Glass clicked:', glassIndex);
    
    // Check if user can upload a glass now
    const dayProgress = activeChallenge.progress[selectedDay];
    const validation = canUploadGlass(dayProgress);
    
    if (!validation.allowed) {
      alert(`⏰ ${validation.reason}`);
      return;
    }
    
    setSelectedGlass(glassIndex);
    setShowGlassTracker(false); // Close glass tracker before opening upload
    setTimeout(() => {
      setShowUploadModal(true);
    }, 100);
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setUploadedImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmitProof = async () => {
    if (!uploadedImage || !activeChallenge || selectedDay === null || selectedGlass === null) return;

    try {
      setIsLoading(true);
      // Simulate AI verification (in real app, call your AI service)
      setTimeout(async () => {
        const updatedProgress = [...activeChallenge.progress];
        updatedProgress[selectedDay].glasses[selectedGlass] = {
          verified: true,
          timestamp: new Date().toISOString(),
          imageUrl: uploadedImage
        };

        // Check if all glasses for the day are completed
        const completedGlasses = updatedProgress[selectedDay].glasses.filter(g => g !== null).length;
        const dayComplete = completedGlasses === GLASSES_PER_DAY;
        
        if (dayComplete) {
          updatedProgress[selectedDay].completed = true;
        }

        const updatedCompletedDays = updatedProgress
          .map((day, idx) => day.completed ? idx : null)
          .filter(idx => idx !== null);

        await updateDoc(doc(db, 'userChallenges', activeChallenge.id), {
          progress: updatedProgress,
          completedDays: updatedCompletedDays,
          currentDay: dayComplete ? selectedDay + 1 : selectedDay
        });

        setActiveChallenge({
          ...activeChallenge,
          progress: updatedProgress,
          completedDays: updatedCompletedDays,
          currentDay: dayComplete ? selectedDay + 1 : selectedDay
        });

        setShowUploadModal(false);
        setUploadedImage(null);
        setSelectedGlass(null);
        setIsLoading(false);
        
        // If day is complete, close glass tracker
        if (dayComplete) {
          setShowGlassTracker(false);
          setSelectedDay(null);
        }
      }, 2000);
    } catch (error) {
      console.error('Error submitting proof:', error);
      setIsLoading(false);
    }
  };

  const generateProgressPath = (days) => {
    const path = [];
    const itemsPerRow = 5;
    const rows = Math.ceil(days / itemsPerRow);
    
    for (let i = 0; i < days; i++) {
      const row = Math.floor(i / itemsPerRow);
      const col = i % itemsPerRow;
      const isEvenRow = row % 2 === 0;
      
      path.push({
        id: i,
        x: isEvenRow ? col * 100 : (itemsPerRow - 1 - col) * 100,
        y: row * 120,
        type: i % 7 === 6 ? 'milestone' : 'regular'
      });
    }
    
    return path;
  };

  if (activeChallenge) {
    const progressPath = generateProgressPath(activeChallenge.duration);
    
    return (
      <div className="water-challenge-tracker">
        {/* Sponsored Header */}
        <div className="challenge-sponsored-header">
        <div className="sponsor-banner">
          <img src="/bisleri--banner.webp" alt="Bisleri" className="sponsor-logo" style={{maxHeight: '40px'}} />
          <span className="sponsor-tag">SPONSORED BY BISLERI</span>
        </div>          <div className="challenge-header-info">
            <h1>💧 Hydration Challenge</h1>
            <p>{activeChallenge.duration} Days • Drink 3L Daily</p>
            <div className="challenge-stats">
              <div className="stat-item">
                <FiDroplet />
                <span>{activeChallenge.completedDays.length}/{activeChallenge.duration} Days</span>
              </div>
              <div className="stat-item">
                <FiTrendingUp />
                <span>₹{activeChallenge.stakeAmount} Staked</span>
              </div>
              <div className="stat-item">
                <FiAward />
                <span>Win ₹{activeChallenge.maxBonus}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Duolingo-Style Progress Map */}
        <div className="progress-map-container">

          {/* Progress Circles */}
          <div className="progress-circles">
            {progressPath.map((point, index) => {
              const dayProgress = activeChallenge.progress[index];
              const isCompleted = dayProgress?.completed || false;
              const isCurrent = index === activeChallenge.currentDay;
              const isMilestone = point.type === 'milestone';
              const glassesComplete = dayProgress?.glasses?.filter(g => g !== null).length || 0;
              
              return (
                <motion.div
                  key={index}
                  className={`progress-circle ${isCompleted ? 'completed' : ''} ${isCurrent ? 'current water-current' : ''} ${isMilestone ? 'milestone' : ''}`}
                  style={{
                    left: `${point.x}px`,
                    top: `${point.y}px`
                  }}
                  onClick={() => handleDayClick(index)}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {isCompleted ? (
                    <FiCheckCircle size={isMilestone ? 32 : 24} />
                  ) : isCurrent ? (
                    <FiCamera size={isMilestone ? 32 : 24} />
                  ) : (
                    <FiDroplet size={isMilestone ? 32 : 24} opacity={0.3} />
                  )}
                  <span className="day-number">Day {index + 1}</span>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Sponsor Promo Card */}
        <div className="sponsor-promo-card">
          <img src="/bisleri--banner.webp" alt="Bisleri" className="promo-logo" style={{maxHeight: '50px'}} />
          <div className="promo-content">
            <h3>🎁 Complete & Win Bisleri Hamper!</h3>
            <p>Finish this challenge and get a special discount code + chance to win Bisleri products worth ₹500!</p>
          </div>
        </div>

        {/* Upload Modal */}
        <AnimatePresence>
          {showUploadModal && (
            <motion.div
              className="modal-overlay"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowUploadModal(false)}
            >
              <motion.div
                className="upload-modal"
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.8, opacity: 0 }}
                onClick={(e) => e.stopPropagation()}
              >
                <div className="modal-header">
                  <h2>Upload Proof - Day {selectedDay + 1}, Glass {selectedGlass !== null ? selectedGlass + 1 : '?'}</h2>
                  <button onClick={() => { 
                    setShowUploadModal(false); 
                    setUploadedImage(null); 
                    setSelectedGlass(null);
                    setTimeout(() => setShowGlassTracker(true), 100);
                  }}>
                    <FiX size={24} />
                  </button>
                </div>

                <div className="modal-body">
                  <div className="upload-instructions">
                    <img 
                      src="/bisleri--banner.webp" 
                      alt="Bisleri Bottle" 
                      className="instruction-bottle-image"
                    />
                    <FiCamera size={48} />
                    <p>Take a photo of your water glass/bottle</p>
                    <span>Show that you've completed glass {selectedGlass !== null ? selectedGlass + 1 : '?'} of 15</span>
                    <span className="tip-text">💡 Tip: Use Bisleri bottles for easy tracking!</span>
                  </div>

                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    id="proof-upload"
                    style={{ display: 'none' }}
                  />

                  {uploadedImage ? (
                    <div className="uploaded-preview">
                      <img src={uploadedImage} alt="Proof" />
                      <button className="btn-submit-proof" onClick={handleSubmitProof}>
                        <FiCheckCircle /> Verify & Submit
                      </button>
                    </div>
                  ) : (
                    <label htmlFor="proof-upload" className="btn-upload">
                      <FiCamera /> Take Photo
                    </label>
                  )}
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Glass Tracker Modal */}
        <AnimatePresence>
          {showGlassTracker && selectedDay !== null && (
            <motion.div
              className="modal-overlay"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowGlassTracker(false)}
            >
              <motion.div
                className="glass-tracker-modal"
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.8, opacity: 0 }}
                onClick={(e) => e.stopPropagation()}
              >
                <div className="modal-header">
                  <h2>Day {selectedDay + 1} - Track Your Water Intake</h2>
                  <button onClick={() => setShowGlassTracker(false)}>
                    <FiX size={24} />
                  </button>
                </div>

                <div className="modal-body">
                  <div className="glass-info">
                    <p>🎯 Goal: 15 glasses (3 Liters)</p>
                    <p>💧 Each glass ≈ 200ml</p>
                    <p>⏰ Wait 20 mins between glasses (Max 3 per hour)</p>
                  </div>

                  <div className="glasses-grid">
                    {Array(GLASSES_PER_DAY).fill(null).map((_, glassIndex) => {
                      const glassData = activeChallenge.progress[selectedDay]?.glasses[glassIndex];
                      const isCompleted = glassData !== null;
                      
                      return (
                        <motion.div
                          key={glassIndex}
                          className={`glass-item ${isCompleted ? 'completed' : ''}`}
                          onClick={() => !isCompleted && handleGlassClick(glassIndex)}
                          whileHover={!isCompleted ? { scale: 1.1 } : {}}
                          whileTap={!isCompleted ? { scale: 0.95 } : {}}
                        >
                          {isCompleted ? (
                            <FiCheckCircle size={32} color="#4CAF50" />
                          ) : (
                            <FiDroplet size={32} color="#0077CC" opacity={0.5} />
                          )}
                          <span>Glass {glassIndex + 1}</span>
                        </motion.div>
                      );
                    })}
                  </div>

                  <div className="glass-progress">
                    <div className="progress-bar-container">
                      <div 
                        className="progress-bar-fill" 
                        style={{ 
                          width: `${(activeChallenge.progress[selectedDay]?.glasses.filter(g => g !== null).length / GLASSES_PER_DAY) * 100}%` 
                        }}
                      />
                    </div>
                    <p className="progress-text">
                      {activeChallenge.progress[selectedDay]?.glasses.filter(g => g !== null).length || 0} / {GLASSES_PER_DAY} glasses completed
                    </p>
                    
                    {/* Show next available time */}
                    {(() => {
                      const dayProgress = activeChallenge.progress[selectedDay];
                      const completedGlasses = dayProgress?.glasses?.filter(g => g !== null) || [];
                      
                      if (completedGlasses.length > 0) {
                        const lastGlass = completedGlasses[completedGlasses.length - 1];
                        const lastUploadTime = new Date(lastGlass.timestamp);
                        const nextAvailable = new Date(lastUploadTime.getTime() + MIN_INTERVAL_MINUTES * 60 * 1000);
                        const now = new Date();
                        
                        if (now < nextAvailable) {
                          const minutesLeft = Math.ceil((nextAvailable - now) / (1000 * 60));
                          return (
                            <p className="next-glass-timer">
                              ⏰ Next glass available in: <strong>{minutesLeft} minute{minutesLeft !== 1 ? 's' : ''}</strong>
                            </p>
                          );
                        } else {
                          return (
                            <p className="next-glass-ready">
                              ✅ Ready to log your next glass!
                            </p>
                          );
                        }
                      }
                      return null;
                    })()}
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  }

  return (
    <div className="water-challenge-page">
      {/* Hero Section with Sponsor */}
      <div className="challenge-hero">
        <div className="hero-sponsor-badge">
          <img src="/bisleri--banner.webp" alt="Bisleri" style={{maxHeight: '28px'}} />
          <span>POWERED BY BISLERI</span>
        </div>
        
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="hero-content"
        >
          <div className="hero-visual">
            <div className="bisleri-bottle-showcase">
              <img 
                src="/bisleri--banner.webp" 
                alt="Bisleri 2L" 
                className="bottle-image bottle-left"
              />
              <div className="hero-icon">💧</div>
              <img 
                src="/bisleri--banner.webp" 
                alt="Bisleri 2L" 
                className="bottle-image bottle-right"
              />
            </div>
          </div>
          
          <h1>Hydration Challenge</h1>
          <p className="hero-subtitle">Drink 3 Liters Daily • Build Lasting Habits</p>
          
          <div className="hero-benefits">
            <div className="benefit-item">
              <FiDroplet />
              <span>Improved Energy</span>
            </div>
            <div className="benefit-item">
              <FiTrendingUp />
              <span>Better Focus</span>
            </div>
            <div className="benefit-item">
              <FiAward />
              <span>Earn Rewards</span>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Difficulty Selection */}
      <div className="difficulty-section">
        <h2>Choose Your Challenge Level</h2>
        
        <div className="difficulty-grid">
          {difficulties.map((difficulty, index) => (
            <motion.div
              key={difficulty.id}
              className={`difficulty-card ${selectedDifficulty?.id === difficulty.id ? 'selected' : ''}`}
              onClick={() => handleDifficultySelect(difficulty)}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ y: -10 }}
            >
              <div className="difficulty-badge" style={{ background: difficulty.color }}>
                {difficulty.name}
              </div>
              
              <div className="difficulty-icon">{difficulty.icon}</div>
              
              <h3>{difficulty.duration}</h3>
              <p className="difficulty-description">{difficulty.description}</p>
              
              <div className="difficulty-details">
                <div className="detail-row">
                  <FiDroplet />
                  <span>{difficulty.proofRequired}</span>
                </div>
                <div className="detail-row">
                  <FiAward />
                  <span>Win up to ₹{difficulty.maxBonus}</span>
                </div>
                <div className="detail-row">
                  <FiTrendingUp />
                  <span>Stake: ₹{difficulty.minStake} - ₹{difficulty.maxStake}</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Stake Selection */}
      {selectedDifficulty && (
        <motion.div
          className="stake-section"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h3>Set Your Stake Amount</h3>
          
          <div className="stake-slider">
            <input
              type="range"
              min={selectedDifficulty.minStake}
              max={selectedDifficulty.maxStake}
              value={stakeAmount}
              onChange={(e) => setStakeAmount(parseInt(e.target.value))}
              style={{
                background: `linear-gradient(to right, #0077CC 0%, #0077CC ${((stakeAmount - selectedDifficulty.minStake) / (selectedDifficulty.maxStake - selectedDifficulty.minStake)) * 100}%, #ddd ${((stakeAmount - selectedDifficulty.minStake) / (selectedDifficulty.maxStake - selectedDifficulty.minStake)) * 100}%, #ddd 100%)`
              }}
            />
            <div className="stake-value">₹{stakeAmount}</div>
          </div>

          <div className="reward-calculation">
            <h4>Reward Breakdown</h4>
            <div className="calc-row">
              <span>Your Stake:</span>
              <strong>₹{stakeAmount}</strong>
            </div>
            <div className="calc-row success">
              <span>If you complete:</span>
              <strong>₹{stakeAmount} + ₹{selectedDifficulty.maxBonus} bonus</strong>
            </div>
            <div className="calc-row fail">
              <span>If you fail:</span>
              <strong>Stake → Invested (Platform fee: {selectedDifficulty.platformFee}%)</strong>
            </div>
          </div>

          <button className="btn-start-challenge" onClick={() => setShowConfirmModal(true)}>
            Start {selectedDifficulty.name} Challenge
          </button>
        </motion.div>
      )}

      {/* Sponsor Section */}
      <div className="sponsor-section">
        <div className="sponsor-section-visual">
          <img 
            src="/bisleri--banner.webp" 
            alt="Bisleri Bottle" 
            className="sponsor-bottle-image"
          />
          <img 
            src="https://images.jdmagicbox.com/comp/def_content/water_suppliers/0-water-suppliers-3-y4jyj.jpg?clr=333333" 
            alt="Bisleri" 
            className="sponsor-section-logo"
            style={{maxHeight: '60px'}}
          />
        </div>
        
        <h3>About Our Partner</h3>
        <p>Bisleri has been India's most trusted water brand for over 50 years. Stay hydrated with pure, safe drinking water.</p>
        
        <div className="sponsor-perks">
          <div className="perk-item">
            <FiAward />
            <span>Exclusive discount codes</span>
          </div>
          <div className="perk-item">
            <FiTrendingUp />
            <span>Win Bisleri product hampers worth ₹500</span>
          </div>
          <div className="perk-item">
            <FiDroplet />
            <span>Hydration tips & guides</span>
          </div>
        </div>
      </div>

      {/* Confirmation Modal */}
      <AnimatePresence>
        {showConfirmModal && (
          <motion.div
            className="modal-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowConfirmModal(false)}
          >
            <motion.div
              className="confirm-modal"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              <h2>Confirm Challenge</h2>
              
              <div className="confirm-details">
                <div className="confirm-row">
                  <span>Challenge:</span>
                  <strong>{selectedDifficulty?.duration} Hydration</strong>
                </div>
                <div className="confirm-row">
                  <span>Stake Amount:</span>
                  <strong>₹{stakeAmount}</strong>
                </div>
                <div className="confirm-row">
                  <span>Max Reward:</span>
                  <strong>₹{selectedDifficulty?.maxBonus}</strong>
                </div>
                <div className="confirm-row">
                  <span>Duration:</span>
                  <strong>{selectedDifficulty?.days} days</strong>
                </div>
              </div>

              <p className="confirm-warning">
                ⚠️ Your stake will be locked. Complete the challenge to get it back + bonus. If you fail, it will be invested.
              </p>

              <div className="modal-actions">
                <button className="btn-cancel" onClick={() => setShowConfirmModal(false)} disabled={isLoading}>
                  Cancel
                </button>
                <button className="btn-confirm" onClick={handleStartChallenge} disabled={isLoading}>
                  {isLoading ? 'Starting...' : 'Lock Stake & Start'}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default WaterChallenge;
