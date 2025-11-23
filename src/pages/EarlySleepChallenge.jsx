import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FiActivity, FiCamera, FiCheckCircle, FiTrendingUp, FiAward, FiX } from 'react-icons/fi';
import { auth, db } from '../firebase';
import { useAuthState } from 'react-firebase-hooks/auth';
import { collection, addDoc, query, where, getDocs, updateDoc, doc } from 'firebase/firestore';
import './EarlySleepChallenge.css';

const EarlySleepChallenge = () => {
  const [user] = useAuthState(auth);
  const navigate = useNavigate();
  const [selectedDifficulty, setSelectedDifficulty] = useState(null);
  const [stakeAmount, setStakeAmount] = useState(500);
  const [isLoading, setIsLoading] = useState(false);
  const [activeChallenge, setActiveChallenge] = useState(null);
  const [selectedDay, setSelectedDay] = useState(0);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [uploadedImage, setUploadedImage] = useState(null);

  const difficulties = [
    {
      id: 'easy',
      name: 'EASY',
      duration: '7 Days',
      days: 7,
      minStake: 500,
      maxStake: 1000,
      maxBonus: 50,
      proofRequired: '1 photo per day',
      platformFee: 3,
      description: 'Start sleeping early',
      color: '#4CAF50',
      icon: '🏃'
    },
    {
      id: 'medium',
      name: 'MEDIUM',
      duration: '21 Days',
      days: 21,
      minStake: 1000,
      maxStake: 3000,
      maxBonus: 200,
      proofRequired: 'Daily proof',
      platformFee: 5,
      description: 'Better sleep habit',
      color: '#FF6B35',
      icon: '🏃‍♂️'
    },
    {
      id: 'hard',
      name: 'HARD',
      duration: '30 Days',
      days: 30,
      minStake: 2000,
      maxStake: 5000,
      maxBonus: 400,
      proofRequired: 'Daily proof',
      platformFee: 5,
      description: 'Master sleep schedule',
      color: '#FF6B35',
      icon: '🏃‍♀️'
    }
  ];

  useEffect(() => {
    if (user) {
      fetchActiveChallenge();
    }
  }, [user]);

  const fetchActiveChallenge = async () => {
    try {
      const q = query(
        collection(db, 'userChallenges'),
        where('userId', '==', user.uid),
        where('challengeType', '==', 'earlysleep'),
        where('status', '==', 'active')
      );
      const querySnapshot = await getDocs(q);
      if (!querySnapshot.empty) {
        const challengeData = querySnapshot.docs[0].data();
        challengeData.id = querySnapshot.docs[0].id;
        setActiveChallenge(challengeData);
      }
    } catch (error) {
      console.error('Error fetching challenge:', error);
    }
  };

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
    setShowConfirmModal(true);
  };

  const confirmStartChallenge = async () => {
    setIsLoading(true);
    try {
      const challengeData = {
        userId: user.uid,
        userEmail: user.email,
        challengeType: 'earlysleep',
        difficulty: selectedDifficulty.id,
        duration: selectedDifficulty.days,
        stakeAmount: stakeAmount,
        maxBonus: selectedDifficulty.maxBonus,
        startDate: new Date(),
        status: 'active',
        completedDays: [],
        currentDay: 0,
        progress: Array(selectedDifficulty.days).fill(null),
        sponsor: 'Sleep Foundation'
      };

      await addDoc(collection(db, 'userChallenges'), challengeData);
      setShowConfirmModal(false);
      await fetchActiveChallenge();
    } catch (error) {
      console.error('Error starting challenge:', error);
      alert('Failed to start challenge: ' + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDayClick = (dayIndex) => {
    if (activeChallenge && dayIndex === activeChallenge.currentDay) {
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
      const updatedProgress = [...activeChallenge.progress];
      updatedProgress[selectedDay] = {
        imageUrl: uploadedImage,
        timestamp: new Date(),
        verified: true
      };

      const updatedCompletedDays = [...activeChallenge.completedDays, selectedDay];
      const challengeRef = doc(db, 'userChallenges', activeChallenge.id);

      await updateDoc(challengeRef, {
        progress: updatedProgress,
        completedDays: updatedCompletedDays,
        currentDay: selectedDay + 1
      });

      setShowUploadModal(false);
      setUploadedImage(null);
      await fetchActiveChallenge();
    } catch (error) {
      console.error('Error submitting proof:', error);
      alert('Failed to submit proof');
    } finally {
      setIsLoading(false);
    }
  };

  const generateProgressPath = (days) => {
    const path = [];
    const itemsPerRow = 5;
    const horizontalSpacing = 90;
    const verticalSpacing = 140;
    
    for (let i = 0; i < days; i++) {
      const row = Math.floor(i / itemsPerRow);
      const col = i % itemsPerRow;
      const isEvenRow = row % 2 === 0;
      
      path.push({
        id: i,
        x: isEvenRow ? col * horizontalSpacing : (itemsPerRow - 1 - col) * horizontalSpacing,
        y: row * verticalSpacing,
        type: i % 7 === 6 ? 'milestone' : 'regular'
      });
    }
    
    return path;
  };

  if (activeChallenge) {
    const progressPath = generateProgressPath(activeChallenge.duration);
    
    return (
      <div className="running-challenge-tracker">
        <div className="challenge-sponsored-header">
          <div className="sponsor-banner">
            <img src="https://upload.wikimedia.org/wikipedia/commons/a/a6/Logo_Sleep Foundation.svg" alt="Sleep Foundation" className="sponsor-logo" style={{maxHeight: '40px'}} />
            <span className="sponsor-tag">SPONSORED BY Sleep Foundation</span>
          </div>
          
          <div className="challenge-header-info">
            <h1>🏃 Early Sleep Challenge</h1>
            <p>{activeChallenge.duration} Days • Sleep by 10 PM</p>
            <div className="challenge-stats">
              <div className="stat-item">
                <FiActivity />
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
                  className={`progress-circle ${isCompleted ? 'completed' : ''} ${isCurrent ? 'current running-current' : ''} ${isMilestone ? 'milestone' : ''}`}
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
                    <FiActivity size={isMilestone ? 32 : 24} opacity={0.3} />
                  )}
                  <span className="day-number">Day {index + 1}</span>
                </motion.div>
              );
            })}
          </div>
        </div>

        <div className="sponsor-promo-card">
          <img src="https://upload.wikimedia.org/wikipedia/commons/a/a6/Logo_Sleep Foundation.svg" alt="Sleep Foundation" className="promo-logo" style={{maxHeight: '50px'}} />
          <div className="promo-content">
            <h3>🎁 Complete & Win Sleep Foundation Gear!</h3>
            <p>Finish this challenge and get special discount codes + chance to win Sleep Foundation running shoes worth ₹5,000!</p>
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
                    <FiActivity size={64} color="#FF6B35" />
                    <p>Upload your proof screenshot</p>
                    <span>Show your progress</span>
                    <span className="tip-text">💡 Tip: Use Sleep Foundation Run Club or Strava app!</span>
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
                      <FiCamera /> Take Photo
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
    <div className="running-challenge-page">
      <div className="challenge-hero">
        <div className="hero-sponsor-badge">
          <img src="https://upload.wikimedia.org/wikipedia/commons/a/a6/Logo_Sleep Foundation.svg" alt="Sleep Foundation" style={{maxHeight: '28px'}} />
          <span>POWERED BY Sleep Foundation</span>
        </div>
        
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="hero-content"
        >
          <div className="hero-icon">🏃</div>
          <h1>Early Sleep Challenge</h1>
          <p className="hero-subtitle">Sleep by 10 PM • Build Endurance</p>
          
          <div className="hero-benefits">
            <div className="benefit-item">
              <FiActivity />
              <span>Build Stamina</span>
            </div>
            <div className="benefit-item">
              <FiTrendingUp />
              <span>Lose Weight</span>
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
              <p className="difficulty-description">{difficulty.description}</p>
              
              <div className="difficulty-details">
                <div className="detail-item">
                  <span className="detail-label">Stake Range</span>
                  <span className="detail-value">₹{difficulty.minStake} - ₹{difficulty.maxStake}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Max Bonus</span>
                  <span className="detail-value">₹{difficulty.maxBonus}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Proof Required</span>
                  <span className="detail-value">{difficulty.proofRequired}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Platform Fee</span>
                  <span className="detail-value">{difficulty.platformFee}%</span>
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
          <h2>💰 Set Your Stake Amount</h2>
          <p>Higher stakes = Higher motivation!</p>
          
          <div className="stake-input-container">
            <span className="currency-symbol">₹</span>
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
            value={stakeAmount}
            onChange={(e) => setStakeAmount(Number(e.target.value))}
            min={selectedDifficulty.minStake}
            max={selectedDifficulty.maxStake}
            step={100}
            className="stake-slider"
          />
          
          <div className="stake-calculator">
            <h3>💵 Potential Earnings</h3>
            <div className="calc-row">
              <span>Your Stake:</span>
              <span>₹{stakeAmount}</span>
            </div>
            <div className="calc-row">
              <span>Platform Fee ({selectedDifficulty.platformFee}%):</span>
              <span>- ₹{(stakeAmount * selectedDifficulty.platformFee / 100).toFixed(0)}</span>
            </div>
            <div className="calc-row">
              <span>Bonus (on success):</span>
              <span className="success">+ ₹{selectedDifficulty.maxBonus}</span>
            </div>
            <div className="calc-row total">
              <span>If you succeed:</span>
              <span className="success">₹{stakeAmount - (stakeAmount * selectedDifficulty.platformFee / 100) + selectedDifficulty.maxBonus}</span>
            </div>
            <div className="calc-row total">
              <span>If you fail:</span>
              <span className="fail">₹0</span>
            </div>
          </div>

          <button className="btn-start-challenge" onClick={handleStartChallenge}>
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
            >
              <h2>⚠️ Confirm Challenge</h2>
              <div className="confirm-details">
                <div className="confirm-row">
                  <span>Challenge:</span>
                  <span>Running - {selectedDifficulty.duration}</span>
                </div>
                <div className="confirm-row">
                  <span>Stake Amount:</span>
                  <span>₹{stakeAmount}</span>
                </div>
                <div className="confirm-row">
                  <span>Max Bonus:</span>
                  <span>₹{selectedDifficulty.maxBonus}</span>
                </div>
              </div>
              <div className="confirm-warning">
                ⚡ Your stake will be locked. You can only get it back by completing the challenge!
              </div>
              <div className="modal-actions">
                <button className="btn-cancel" onClick={() => setShowConfirmModal(false)}>
                  Cancel
                </button>
                <button className="btn-confirm" onClick={confirmStartChallenge} disabled={isLoading}>
                  {isLoading ? 'Starting...' : 'Confirm & Pay'}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default EarlySleepChallenge;



