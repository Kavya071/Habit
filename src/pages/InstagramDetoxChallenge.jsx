import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FiInstagram, FiCamera, FiCheckCircle, FiClock, FiTrendingUp, FiAward, FiX, FiSmartphone } from 'react-icons/fi';
import { auth, db } from '../firebase';
import { useAuthState } from 'react-firebase-hooks/auth';
import { collection, addDoc, query, where, getDocs, updateDoc, doc } from 'firebase/firestore';
import './InstagramDetoxChallenge.css';

const InstagramDetoxChallenge = () => {
  const [user] = useAuthState(auth);
  const navigate = useNavigate();
  const [selectedDifficulty, setSelectedDifficulty] = useState(null);
  const [stakeAmount, setStakeAmount] = useState(100);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [activeChallenge, setActiveChallenge] = useState(null);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [selectedDay, setSelectedDay] = useState(null);
  const [uploadedImage, setUploadedImage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (user) {
      fetchActiveChallenge();
    }
  }, [user]);

  const difficulties = [
    {
      id: 'easy',
      name: 'EASY',
      duration: '7 Days',
      days: 7,
      timeLimit: 2, // 2 hours per day
      minStake: 300,
      maxStake: 1000,
      maxBonus: 60,
      proofRequired: 'Daily screenshot',
      platformFee: 3,
      description: '2 hours daily limit',
      color: '#4CAF50',
      icon: '⏱️'
    },
    {
      id: 'medium',
      name: 'MEDIUM',
      duration: '14 Days',
      days: 14,
      timeLimit: 1.5, // 1.5 hours per day
      minStake: 500,
      maxStake: 2000,
      maxBonus: 150,
      proofRequired: 'Daily screenshot',
      platformFee: 3,
      description: '1.5 hours daily limit',
      color: '#2196F3',
      icon: '📱'
    },
    {
      id: 'hard',
      name: 'HARD',
      duration: '21 Days',
      days: 21,
      timeLimit: 1, // 1 hour per day
      minStake: 1000,
      maxStake: 5000,
      maxBonus: 350,
      proofRequired: 'Daily screenshot',
      platformFee: 5,
      description: '1 hour daily limit',
      color: '#9C27B0',
      icon: '🎯'
    },
    {
      id: 'expert',
      name: 'EXPERT',
      duration: '30 Days',
      days: 30,
      timeLimit: 0.5, // 30 minutes per day
      minStake: 2000,
      maxStake: 10000,
      maxBonus: 750,
      proofRequired: 'Daily screenshot + weekly check',
      platformFee: 7,
      description: '30 min daily limit',
      color: '#E91E63',
      icon: '🔥'
    }
  ];

  const handleDifficultySelect = (difficulty) => {
    setSelectedDifficulty(difficulty);
    setStakeAmount(difficulty.minStake);
    
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
        challengeType: 'instagram-detox',
        difficulty: selectedDifficulty.id,
        duration: selectedDifficulty.days,
        timeLimit: selectedDifficulty.timeLimit,
        stakeAmount: stakeAmount,
        maxBonus: selectedDifficulty.maxBonus,
        startDate: new Date().toISOString(),
        currentDay: 0,
        completedDays: [],
        progress: Array(selectedDifficulty.days).fill(null),
        status: 'active',
        sponsor: 'OnePlus Digital Wellbeing'
      };

      await addDoc(collection(db, 'userChallenges'), challengeData);
      
      alert('Challenge started successfully! 🎉');
      setShowConfirmModal(false);
      fetchActiveChallenge();
    } catch (error) {
      console.error('Error starting challenge:', error);
      alert('Failed to start challenge: ' + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchActiveChallenge = async () => {
    try {
      const q = query(
        collection(db, 'userChallenges'),
        where('userId', '==', user.uid),
        where('challengeType', '==', 'instagram-detox'),
        where('status', '==', 'active')
      );
      
      const querySnapshot = await getDocs(q);
      
      if (!querySnapshot.empty) {
        const challengeDoc = querySnapshot.docs[0];
        setActiveChallenge({ id: challengeDoc.id, ...challengeDoc.data() });
      }
    } catch (error) {
      console.error('Error fetching challenge:', error);
    }
  };

  const generateProgressPath = (days) => {
    const path = [];
    const itemsPerRow = 7;
    const horizontalSpacing = 80;
    const verticalSpacing = 100;
    
    for (let i = 0; i < days; i++) {
      const row = Math.floor(i / itemsPerRow);
      const col = i % itemsPerRow;
      
      path.push({
        id: i,
        x: col * horizontalSpacing,
        y: row * verticalSpacing,
        type: i % 7 === 6 ? 'milestone' : 'regular'
      });
    }
    
    return path;
  };

  const handleDayClick = (dayIndex) => {
    if (dayIndex === activeChallenge.currentDay) {
      setSelectedDay(dayIndex);
      setShowUploadModal(true);
    }
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
    if (!uploadedImage) return;

    setIsLoading(true);

    try {
      const newProgress = [...activeChallenge.progress];
      newProgress[selectedDay] = uploadedImage;
      
      const newCompletedDays = [...activeChallenge.completedDays, selectedDay];
      const newCurrentDay = selectedDay + 1;

      await updateDoc(doc(db, 'userChallenges', activeChallenge.id), {
        progress: newProgress,
        completedDays: newCompletedDays,
        currentDay: newCurrentDay,
        status: newCurrentDay >= activeChallenge.duration ? 'completed' : 'active'
      });

      alert('✅ Day completed! Keep going! 💪');
      setShowUploadModal(false);
      setUploadedImage(null);
      fetchActiveChallenge();
    } catch (error) {
      console.error('Error submitting proof:', error);
      alert('Failed to submit proof. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  if (activeChallenge) {
    const progressPath = generateProgressPath(activeChallenge.duration);
    
    return (
      <div className="instagram-detox-tracker">
        <div className="challenge-sponsored-header">
          <div className="sponsor-banner">
            <FiSmartphone size={32} color="white" />
            <span className="sponsor-tag">SPONSORED BY ONEPLUS DIGITAL WELLBEING</span>
          </div>
          
          <div className="challenge-header-info">
            <h1>📱 Instagram Detox Challenge</h1>
            <p>{activeChallenge.duration} Days • Max {activeChallenge.timeLimit}h Daily</p>
            <div className="challenge-stats">
              <div className="stat-item">
                <FiInstagram />
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

        <div className="progress-map-container">

          <div className="progress-circles">
            {progressPath.map((point, index) => {
              const isCompleted = activeChallenge.completedDays.includes(index);
              const isCurrent = index === activeChallenge.currentDay;
              const isMilestone = point.type === 'milestone';
              
              return (
                <motion.div
                  key={index}
                  className={`progress-circle ${isCompleted ? 'completed' : ''} ${isCurrent ? 'current detox-current' : ''} ${isMilestone ? 'milestone' : ''}`}
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
                    <FiInstagram size={isMilestone ? 32 : 24} opacity={0.3} />
                  )}
                  <span className="day-number">Day {index + 1}</span>
                </motion.div>
              );
            })}
          </div>
        </div>

        <div className="sponsor-promo-card">
          <FiSmartphone size={60} color="white" />
          <div className="promo-content">
            <h3>🎁 Complete & Win OnePlus Rewards!</h3>
            <p>Finish this challenge and get special discount codes + chance to win OnePlus accessories worth ₹5,000!</p>
          </div>
        </div>

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
                  <h2>Upload Proof - Day {selectedDay + 1}</h2>
                  <button onClick={() => { setShowUploadModal(false); setUploadedImage(null); }}>
                    <FiX size={24} />
                  </button>
                </div>

                <div className="modal-body">
                  <div className="upload-instructions">
                    <FiSmartphone size={64} color="#E91E63" />
                    <p>Upload Screen Time Screenshot</p>
                    <span>Show Instagram usage from Digital Wellbeing / Screen Time</span>
                    <span className="tip-text">💡 Tip: Settings → Digital Wellbeing → Instagram</span>
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
                      <button className="btn-submit-proof" onClick={handleSubmitProof} disabled={isLoading}>
                        <FiCheckCircle /> {isLoading ? 'Verifying...' : 'Verify & Submit'}
                      </button>
                    </div>
                  ) : (
                    <label htmlFor="proof-upload" className="btn-upload">
                      <FiCamera /> Take Screenshot
                    </label>
                  )}
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  }

  return (
    <div className="instagram-detox-page">
      <div className="challenge-hero">
        <div className="hero-sponsor-badge">
          <FiSmartphone size={24} color="white" />
          <span>POWERED BY ONEPLUS</span>
        </div>
        
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="hero-content"
        >
          <div className="hero-icon">📱</div>
          <h1>Instagram Detox Challenge</h1>
          <p className="hero-subtitle">Limit Your Usage • Reclaim Your Time</p>
          
          <div className="hero-benefits">
            <div className="benefit-item">
              <FiClock />
              <span>More Free Time</span>
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
              <p className="difficulty-desc">{difficulty.description}</p>
              
              <div className="difficulty-details">
                <div className="detail-row">
                  <span className="label">Max Usage:</span>
                  <span className="value">{difficulty.timeLimit}h/day</span>
                </div>
                <div className="detail-row">
                  <span className="label">Stake Range:</span>
                  <span className="value">₹{difficulty.minStake} - ₹{difficulty.maxStake}</span>
                </div>
                <div className="detail-row">
                  <span className="label">Win Up To:</span>
                  <span className="value success">+₹{difficulty.maxBonus}</span>
                </div>
                <div className="detail-row">
                  <span className="label">Proof:</span>
                  <span className="value">{difficulty.proofRequired}</span>
                </div>
                <div className="detail-row">
                  <span className="label">Platform Fee:</span>
                  <span className="value">{difficulty.platformFee}%</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {selectedDifficulty && (
        <motion.div
          className="stake-section"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h2>💰 Lock Your Stake</h2>
          <p>Choose your stake amount. Higher stakes = Higher rewards!</p>
          
          <div className="stake-input-container">
            <span className="currency">₹</span>
            <input
              type="number"
              value={stakeAmount}
              onChange={(e) => setStakeAmount(Number(e.target.value))}
              min={selectedDifficulty.minStake}
              max={selectedDifficulty.maxStake}
              step={100}
            />
          </div>
          
          <input
            type="range"
            min={selectedDifficulty.minStake}
            max={selectedDifficulty.maxStake}
            value={stakeAmount}
            onChange={(e) => setStakeAmount(Number(e.target.value))}
            className="stake-slider"
            step={100}
          />
          
          <div className="stake-breakdown">
            <h3>Breakdown</h3>
            <div className="calc-row">
              <span>Your Stake:</span>
              <span>₹{stakeAmount}</span>
            </div>
            <div className="calc-row">
              <span>Platform Fee ({selectedDifficulty.platformFee}%):</span>
              <span>₹{Math.round(stakeAmount * selectedDifficulty.platformFee / 100)}</span>
            </div>
            <div className="calc-row success">
              <span>If You Win:</span>
              <span>₹{stakeAmount + selectedDifficulty.maxBonus}</span>
            </div>
            <div className="calc-row fail">
              <span>If You Fail:</span>
              <span>₹0 (Lose Stake)</span>
            </div>
          </div>

          <button className="btn-start-challenge" onClick={() => setShowConfirmModal(true)}>
            🔒 Lock Stake & Start Challenge
          </button>
        </motion.div>
      )}

      <AnimatePresence>
        {showConfirmModal && (
          <motion.div
            className="modal-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="confirm-modal"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              <h2>⚠️ Confirm Challenge</h2>
              <div className="confirm-details">
                <div className="confirm-row">
                  <strong>Challenge:</strong>
                  <span>Instagram Detox</span>
                </div>
                <div className="confirm-row">
                  <strong>Duration:</strong>
                  <span>{selectedDifficulty.duration}</span>
                </div>
                <div className="confirm-row">
                  <strong>Usage Limit:</strong>
                  <span>{selectedDifficulty.timeLimit}h/day</span>
                </div>
                <div className="confirm-row">
                  <strong>Stake Amount:</strong>
                  <span>₹{stakeAmount}</span>
                </div>
              </div>
              
              <div className="confirm-warning">
                ⚠️ Once started, your stake will be locked. You must upload daily screen time proof showing Instagram usage below {selectedDifficulty.timeLimit}h!
              </div>

              <div className="modal-actions">
                <button className="btn-cancel" onClick={() => setShowConfirmModal(false)} disabled={isLoading}>
                  Cancel
                </button>
                <button className="btn-confirm" onClick={handleStartChallenge} disabled={isLoading}>
                  {isLoading ? 'Starting...' : 'Confirm & Start 🚀'}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default InstagramDetoxChallenge;
