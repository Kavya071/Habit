import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FiBook, FiCamera, FiCheckCircle, FiClock, FiTrendingUp, FiAward, FiX } from 'react-icons/fi';
import { auth, db } from '../firebase';
import { useAuthState } from 'react-firebase-hooks/auth';
import { collection, addDoc, query, where, getDocs, updateDoc, doc } from 'firebase/firestore';
import './BookChallenge.css';

const BookChallenge = () => {
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
      where('challengeType', '==', 'book'),
      where('status', '==', 'active')
    );
    
    const snapshot = await getDocs(q);
    if (!snapshot.empty) {
      setActiveChallenge({ id: snapshot.docs[0].id, ...snapshot.docs[0].data() });
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
      proofRequired: 'Photo of book page OR Kindle screenshot',
      platformFee: 5,
      description: 'Start your reading habit',
      color: '#4CAF50',
      icon: '📖'
    },
    {
      id: 'medium',
      name: 'MEDIUM',
      duration: '7 Days',
      days: 7,
      minStake: 300,
      maxStake: 1000,
      maxBonus: 60,
      proofRequired: 'Daily proof with page numbers',
      platformFee: 3,
      description: 'Build weekly consistency',
      color: '#2196F3',
      icon: '📚'
    },
    {
      id: 'hard',
      name: 'HARD',
      duration: '30 Days',
      days: 30,
      minStake: 1000,
      maxStake: 5000,
      maxBonus: 250,
      proofRequired: 'Daily proof + OCR verification',
      platformFee: 5,
      description: 'Monthly reading discipline',
      color: '#FF9800',
      icon: '📕'
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
      description: 'Deep consistency - 3 months',
      color: '#9C27B0',
      icon: '🎓'
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
        challengeType: 'book',
        difficulty: selectedDifficulty.id,
        duration: selectedDifficulty.days,
        stakeAmount: stakeAmount,
        maxBonus: selectedDifficulty.maxBonus,
        platformFee: selectedDifficulty.platformFee,
        startDate: new Date().toISOString(),
        status: 'active',
        completedDays: [],
        progress: Array(selectedDifficulty.days).fill(null),
        currentDay: 0,
        sponsor: 'Kindle'
      };

      console.log('Creating challenge...', challengeData);
      const docRef = await addDoc(collection(db, 'userChallenges'), challengeData);
      console.log('Challenge created with ID:', docRef.id);
      
      setActiveChallenge({ id: docRef.id, ...challengeData });
      setShowConfirmModal(false);
      setIsLoading(false);
      
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
    if (dayIndex > activeChallenge.currentDay) return;
    
    setSelectedDay(dayIndex);
    setShowUploadModal(true);
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
    if (!uploadedImage || !activeChallenge || selectedDay === null) return;

    try {
      setIsLoading(true);
      setTimeout(async () => {
        const updatedProgress = [...activeChallenge.progress];
        updatedProgress[selectedDay] = {
          verified: true,
          timestamp: new Date().toISOString(),
          imageUrl: uploadedImage
        };

        const updatedCompletedDays = [...activeChallenge.completedDays, selectedDay];

        await updateDoc(doc(db, 'userChallenges', activeChallenge.id), {
          progress: updatedProgress,
          completedDays: updatedCompletedDays,
          currentDay: selectedDay + 1
        });

        setActiveChallenge({
          ...activeChallenge,
          progress: updatedProgress,
          completedDays: updatedCompletedDays,
          currentDay: selectedDay + 1
        });

        setShowUploadModal(false);
        setUploadedImage(null);
        setSelectedDay(null);
        setIsLoading(false);
      }, 2000);
    } catch (error) {
      console.error('Error submitting proof:', error);
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
      <div className="book-challenge-tracker">
        <div className="challenge-sponsored-header">
          <div className="sponsor-banner">
            <img src="/amazon kindle logo.png" alt="Kindle" className="sponsor-logo" style={{maxHeight: '40px'}} />
            <span className="sponsor-tag">SPONSORED BY KINDLE</span>
          </div>
          
          <div className="challenge-header-info">
            <h1>📚 Reading Challenge</h1>
            <p>{activeChallenge.duration} Days • Read 10-20 Pages Daily</p>
            <div className="challenge-stats">
              <div className="stat-item">
                <FiBook />
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
                  className={`progress-circle ${isCompleted ? 'completed' : ''} ${isCurrent ? 'current book-current' : ''} ${isMilestone ? 'milestone' : ''}`}
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
                    <FiBook size={isMilestone ? 32 : 24} opacity={0.3} />
                  )}
                  <span className="day-number">Day {index + 1}</span>
                </motion.div>
              );
            })}
          </div>
        </div>

        <div className="sponsor-promo-card">
          <img src="/amazon kindle logo.png" alt="Kindle" className="promo-logo" style={{maxHeight: '50px'}} />
          <div className="promo-content">
            <h3>🎁 Complete & Win Kindle Credits!</h3>
            <p>Finish this challenge and get special discount codes + chance to win Kindle Unlimited subscription!</p>
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
                    <FiBook size={64} color="#FF6F00" />
                    <p>Take a photo of your book page</p>
                    <span>Page numbers must be clearly visible</span>
                    <span className="tip-text">💡 Tip: Good lighting + clear page numbers!</span>
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
    <div className="book-challenge-page">
      <div className="challenge-hero">
        <div className="hero-sponsor-badge">
          <img src="/amazon kindle logo.png" alt="Kindle" style={{maxHeight: '28px'}} />
          <span>POWERED BY KINDLE</span>
        </div>
        
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="hero-content"
        >
          <div className="hero-icon">📚</div>
          <h1>Reading Challenge</h1>
          <p className="hero-subtitle">Read 10-20 Pages Daily • Build Lasting Habits</p>
          
          <div className="hero-benefits">
            <div className="benefit-item">
              <FiBook />
              <span>Improve Knowledge</span>
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
              <p className="difficulty-description">{difficulty.description}</p>
              
              <div className="difficulty-details">
                <div className="detail-row">
                  <FiBook />
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
                background: `linear-gradient(to right, #FF6F00 0%, #FF6F00 ${((stakeAmount - selectedDifficulty.minStake) / (selectedDifficulty.maxStake - selectedDifficulty.minStake)) * 100}%, #ddd ${((stakeAmount - selectedDifficulty.minStake) / (selectedDifficulty.maxStake - selectedDifficulty.minStake)) * 100}%, #ddd 100%)`
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

      <div className="sponsor-section">
        <img 
          src="/amazon kindle logo.png" 
          alt="Kindle" 
          className="sponsor-section-logo"
          style={{maxHeight: '60px'}}
        />
        
        <h3>About Our Partner</h3>
        <p>Kindle by Amazon - the world's leading eReader platform. Build your reading habit with millions of books at your fingertips.</p>
        
        <div className="sponsor-perks">
          <div className="perk-item">
            <FiAward />
            <span>Kindle Unlimited trials</span>
          </div>
          <div className="perk-item">
            <FiTrendingUp />
            <span>Win Kindle device vouchers</span>
          </div>
          <div className="perk-item">
            <FiBook />
            <span>Exclusive book recommendations</span>
          </div>
        </div>
      </div>

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
                  <strong>{selectedDifficulty?.duration} Reading</strong>
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

export default BookChallenge;
