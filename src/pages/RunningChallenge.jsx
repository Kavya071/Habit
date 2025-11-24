import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FiZap, FiCamera, FiCheckCircle, FiClock, FiTrendingUp, FiAward, FiX } from 'react-icons/fi';
import { auth, db } from '../firebase';
import { useAuthState } from 'react-firebase-hooks/auth';
import { collection, addDoc, query, where, getDocs, updateDoc, doc } from 'firebase/firestore';
import './RunningChallenge.css';

const RunningChallenge = () => {
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

  const difficulties = [
    { id: 'easy', name: 'Easy', duration: 7, target: '2 km', icon: '🏃', color: '#FF5722' },
    { id: 'medium', name: 'Medium', duration: 14, target: '3 km', icon: '🏃‍♂️', color: '#FF9800' },
    { id: 'hard', name: 'Hard', duration: 21, target: '5 km', icon: '🏃‍♀️', color: '#F44336' },
    { id: 'expert', name: 'Expert', duration: 30, target: '7 km', icon: '⚡', color: '#D32F2F' }
  ];

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
      where('challengeType', '==', 'running'),
      where('status', '==', 'active')
    );
    
    const snapshot = await getDocs(q);
    if (!snapshot.empty) {
      const challengeData = { id: snapshot.docs[0].id, ...snapshot.docs[0].data() };
      setActiveChallenge(challengeData);
    }
  };

  const handleStartChallenge = async () => {
    if (!user || !selectedDifficulty) return;
    
    setIsLoading(true);
    try {
      const difficulty = difficulties.find(d => d.id === selectedDifficulty);
      const totalDays = difficulty.duration;
      
      const challengeData = {
        userId: user.uid,
        challengeType: 'running',
        difficulty: selectedDifficulty,
        target: difficulty.target,
        duration: totalDays,
        stakeAmount: stakeAmount,
        startDate: new Date().toISOString(),
        status: 'active',
        completedDays: [],
        progress: Array(totalDays).fill(null),
        maxBonus: Math.floor(stakeAmount * 0.15)
      };

      const docRef = await addDoc(collection(db, 'userChallenges'), challengeData);
      setActiveChallenge({ id: docRef.id, ...challengeData });
      setShowConfirmModal(false);
    } catch (error) {
      console.error('Error starting challenge:', error);
      alert('Failed to start challenge. Please try again.');
    }
    setIsLoading(false);
  };

  const handleDayClick = (dayIndex) => {
    if (!activeChallenge) return;
    
    const today = new Date();
    const startDate = new Date(activeChallenge.startDate);
    const daysSinceStart = Math.floor((today - startDate) / (1000 * 60 * 60 * 24));
    
    if (dayIndex === daysSinceStart && !activeChallenge.completedDays.includes(dayIndex)) {
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
    if (!uploadedImage || selectedDay === null) return;
    
    setIsLoading(true);
    try {
      const updatedCompletedDays = [...activeChallenge.completedDays, selectedDay];
      const updatedProgress = [...activeChallenge.progress];
      updatedProgress[selectedDay] = {
        completed: true,
        timestamp: new Date().toISOString(),
        proofUrl: uploadedImage
      };

      await updateDoc(doc(db, 'userChallenges', activeChallenge.id), {
        completedDays: updatedCompletedDays,
        progress: updatedProgress
      });

      setActiveChallenge({
        ...activeChallenge,
        completedDays: updatedCompletedDays,
        progress: updatedProgress
      });

      setShowUploadModal(false);
      setUploadedImage(null);
      setSelectedDay(null);
    } catch (error) {
      console.error('Error submitting proof:', error);
      alert('Failed to submit proof. Please try again.');
    }
    setIsLoading(false);
  };

  if (!user) {
    return null;
  }

  if (activeChallenge) {
    const today = new Date();
    const startDate = new Date(activeChallenge.startDate);
    const currentDayIndex = Math.floor((today - startDate) / (1000 * 60 * 60 * 24));
    
    const itemsPerRow = 7;
    const horizontalSpacing = 80;
    const verticalSpacing = 100;

    return (
      <div className="running-challenge-tracker">
        {/* Sponsored Header */}
        <div className="challenge-sponsored-header">
          <div className="sponsor-banner">
            <FiZap style={{fontSize: '2rem', color: 'white'}} />
            <span className="sponsor-tag">SPONSORED BY ADIDAS</span>
          </div>
          <div className="challenge-header-info">
            <h1>🏃 Running Challenge</h1>
            <p>{activeChallenge.duration} Days • {activeChallenge.target} Daily</p>
            <div className="challenge-stats">
              <div className="stat-item">
                <FiZap />
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

        {/* Progress Map */}
        <div className="progress-map-container">
          <div className="progress-circles">
            {activeChallenge.progress.map((day, index) => {
              const row = Math.floor(index / itemsPerRow);
              const col = index % itemsPerRow;
              const x = col * horizontalSpacing;
              const y = row * verticalSpacing;
              
              const isCompleted = activeChallenge.completedDays.includes(index);
              const isCurrent = index === currentDayIndex;
              const isFuture = index > currentDayIndex;
              const isPast = index < currentDayIndex && !isCompleted;

              return (
                <motion.div
                  key={index}
                  className={`progress-circle ${isCompleted ? 'completed' : ''} ${isCurrent ? 'running-current' : ''} ${isFuture ? 'future' : ''} ${isPast ? 'missed' : ''}`}
                  style={{
                    position: 'absolute',
                    left: `${x}px`,
                    top: `${y}px`,
                  }}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: index * 0.05 }}
                  onClick={() => handleDayClick(index)}
                  whileHover={isCurrent && !isCompleted ? { scale: 1.1 } : {}}
                >
                  <div className="circle-content">
                    {isCompleted ? (
                      <FiCheckCircle className="check-icon" />
                    ) : isCurrent ? (
                      <FiCamera className="camera-icon" />
                    ) : (
                      <FiClock className="clock-icon" />
                    )}
                    <span className="day-number">Day {index + 1}</span>
                  </div>
                </motion.div>
              );
            })}
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
              onClick={() => !isLoading && setShowUploadModal(false)}
            >
              <motion.div
                className="modal-content"
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.8, opacity: 0 }}
                onClick={(e) => e.stopPropagation()}
              >
                <button className="modal-close" onClick={() => setShowUploadModal(false)}>
                  <FiX />
                </button>
                
                <h2>Upload Today's Proof</h2>
                <p className="modal-subtitle">Day {selectedDay + 1} - {activeChallenge.target}</p>
                
                <div className="upload-instructions">
                  <h3>📸 Proof Requirements:</h3>
                  <ul>
                    <li>Screenshot from running app (Strava, Nike Run Club, etc.)</li>
                    <li>Must show distance covered for today</li>
                    <li>Distance must meet or exceed {activeChallenge.target}</li>
                    <li>Clear and readable timestamp</li>
                  </ul>
                </div>

                <div className="upload-area">
                  {uploadedImage ? (
                    <div className="image-preview">
                      <img src={uploadedImage} alt="Proof" />
                      <button onClick={() => setUploadedImage(null)} className="btn-change-image">
                        Change Image
                      </button>
                    </div>
                  ) : (
                    <label className="upload-label">
                      <FiCamera size={48} />
                      <span>Click to upload screenshot</span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        style={{ display: 'none' }}
                      />
                    </label>
                  )}
                </div>

                <button
                  className="btn-submit-proof"
                  onClick={handleSubmitProof}
                  disabled={!uploadedImage || isLoading}
                >
                  {isLoading ? 'Submitting...' : 'Submit Proof'}
                </button>
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
          <FiZap style={{fontSize: '1.5rem'}} />
          <span>SPONSORED BY ADIDAS</span>
        </div>
        
        <div className="hero-icon">🏃</div>
        
        <div className="hero-content">
          <h1>Running Challenge</h1>
          <p className="hero-subtitle">Push your limits - Track your daily runs</p>
          
          <div className="hero-benefits">
            <div className="benefit-item">
              <FiZap />
              <span>Daily Distance Goals</span>
            </div>
            <div className="benefit-item">
              <FiAward />
              <span>Earn Up to 15% Bonus</span>
            </div>
            <div className="benefit-item">
              <FiTrendingUp />
              <span>Track Progress</span>
            </div>
          </div>
        </div>
      </div>

      {/* Difficulty Selection */}
      <div className="difficulty-section">
        <h2>Choose Your Challenge</h2>
        <div className="difficulty-grid">
          {difficulties.map((diff) => (
            <motion.div
              key={diff.id}
              className={`difficulty-card ${selectedDifficulty === diff.id ? 'selected' : ''}`}
              onClick={() => setSelectedDifficulty(diff.id)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <div className="difficulty-badge" style={{ background: diff.color }}>
                {diff.name}
              </div>
              <div className="difficulty-icon">{diff.icon}</div>
              <h3>{diff.target}</h3>
              <p>{diff.duration} Days Challenge</p>
              <div className="difficulty-details">
                <span>📱 Upload run tracking daily</span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Stake Amount */}
      {selectedDifficulty && (
        <motion.div
          className="stake-section"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h2>Set Your Stake</h2>
          <p>Higher stakes = Higher motivation & rewards!</p>
          
          <div className="stake-input-group">
            <span className="currency-symbol">₹</span>
            <input
              type="number"
              value={stakeAmount}
              onChange={(e) => setStakeAmount(Math.max(100, parseInt(e.target.value) || 100))}
              min="100"
              step="50"
            />
          </div>

          <div className="stake-info">
            <div className="info-row">
              <span>Your Stake:</span>
              <strong>₹{stakeAmount}</strong>
            </div>
            <div className="info-row success">
              <span>Potential Win:</span>
              <strong>₹{Math.floor(stakeAmount * 0.15)}</strong>
            </div>
          </div>

          <button className="btn-start-challenge" onClick={() => setShowConfirmModal(true)}>
            Start Challenge
          </button>
        </motion.div>
      )}

      {/* Confirmation Modal */}
      <AnimatePresence>
        {showConfirmModal && (
          <motion.div
            className="modal-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => !isLoading && setShowConfirmModal(false)}
          >
            <motion.div
              className="modal-content"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              <h2>Confirm Your Challenge</h2>
              <div className="confirmation-details">
                <p><strong>Challenge:</strong> Running Challenge</p>
                <p><strong>Difficulty:</strong> {difficulties.find(d => d.id === selectedDifficulty)?.name}</p>
                <p><strong>Target:</strong> {difficulties.find(d => d.id === selectedDifficulty)?.target} daily</p>
                <p><strong>Duration:</strong> {difficulties.find(d => d.id === selectedDifficulty)?.duration} days</p>
                <p><strong>Stake Amount:</strong> ₹{stakeAmount}</p>
                <p><strong>Potential Win:</strong> ₹{Math.floor(stakeAmount * 0.15)}</p>
              </div>
              
              <div className="modal-actions">
                <button onClick={() => setShowConfirmModal(false)} disabled={isLoading}>
                  Cancel
                </button>
                <button onClick={handleStartChallenge} disabled={isLoading} className="btn-confirm">
                  {isLoading ? 'Starting...' : 'Confirm & Start'}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default RunningChallenge;
