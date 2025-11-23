import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiCheckCircle, FiClock, FiDollarSign, FiUsers, FiTrendingUp, FiChevronLeft, FiCamera, FiInfo } from 'react-icons/fi';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth, db } from '../firebase';
import { doc, setDoc } from 'firebase/firestore';
import './ChallengeDetail.css';

const ChallengeDetail = () => {
  const { challengeId } = useParams();
  const navigate = useNavigate();
  const [user] = useAuthState(auth);
  const [challenge, setChallenge] = useState(null);
  const [selectedStake, setSelectedStake] = useState(1000);
  const [showStartModal, setShowStartModal] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      navigate('/');
      return;
    }
    fetchChallengeDetails();
  }, [challengeId, user]);

  const fetchChallengeDetails = () => {
    // Sample challenge data - replace with Firestore fetch
    const challengeData = {
      id: challengeId,
      title: 'Morning Meditation',
      description: 'Start your day with mindfulness and peace. Meditate for 10 minutes every morning.',
      longDescription: 'Build a consistent meditation practice that helps reduce stress, improve focus, and enhance overall well-being. This challenge is designed for beginners and experienced meditators alike.',
      duration: 21,
      category: 'Wellness',
      participants: 1234,
      successRate: 78,
      minStake: 500,
      maxStake: 5000,
      verified: true,
      difficulty: 'Easy',
      icon: '🧘',
      steps: [
        {
          title: 'Wake Up',
          description: 'Set your alarm and wake up at your chosen time',
          verification: 'Photo of you in meditation posture'
        },
        {
          title: 'Find Your Space',
          description: 'Choose a quiet, comfortable space for meditation',
          verification: 'Photo of your meditation space'
        },
        {
          title: 'Set Timer',
          description: 'Use a meditation app or timer for 10 minutes',
          verification: 'Screenshot of timer or app'
        },
        {
          title: 'Meditate',
          description: 'Focus on your breath and maintain stillness',
          verification: 'Post-meditation photo with timestamp'
        },
        {
          title: 'Complete',
          description: 'Upload proof within 1 hour of meditation',
          verification: 'Photo with visible clock/timestamp'
        }
      ],
      sampleProofs: [
        'Photo of meditation posture with timestamp',
        'Screenshot of meditation app showing completed session',
        'Selfie in meditation space with clock visible',
        'Video clip of meditation (10-30 seconds)'
      ],
      rules: [
        'Upload proof within 1 hour of completing daily meditation',
        'Photo must show you in meditation posture with visible timestamp',
        'Submissions after deadline will not be accepted',
        'AI will verify authenticity of submissions',
        'Manual review for flagged submissions'
      ]
    };

    setChallenge(challengeData);
    setSelectedStake(challengeData.minStake);
    setLoading(false);
  };

  const handleStartChallenge = async () => {
    try {
      // Create challenge entry in Firestore
      const challengeRef = doc(db, 'userChallenges', `${user.uid}_${challengeId}_${Date.now()}`);
      await setDoc(challengeRef, {
        uid: user.uid,
        challengeId: challengeId,
        challengeTitle: challenge.title,
        stake: selectedStake,
        status: 'active',
        startDate: new Date().toISOString(),
        endDate: new Date(Date.now() + challenge.duration * 24 * 60 * 60 * 1000).toISOString(),
        progress: {
          daysCompleted: 0,
          totalDays: challenge.duration,
          lastSubmission: null
        },
        createdAt: new Date().toISOString()
      });

      // Navigate to dashboard
      navigate('/dashboard');
    } catch (error) {
      console.error('Error starting challenge:', error);
      alert('Failed to start challenge. Please try again.');
    }
  };

  if (loading) {
    return (
      <div className="challenge-detail-loading">
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <div className="challenge-detail-page">
      <div className="challenge-detail-container">
        {/* Header */}
        <div className="challenge-detail-header">
          <button className="btn-back" onClick={() => navigate('/challenges')}>
            <FiChevronLeft /> Back to Challenges
          </button>
        </div>

        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="challenge-hero"
        >
          <div className="challenge-hero-icon">{challenge.icon}</div>
          <h1 className="challenge-hero-title">{challenge.title}</h1>
          <p className="challenge-hero-subtitle">{challenge.description}</p>
          
          <div className="challenge-meta-row">
            <div className="meta-item">
              <FiClock />
              <span>{challenge.duration} days</span>
            </div>
            <div className="meta-item">
              <FiUsers />
              <span>{challenge.participants.toLocaleString()} participants</span>
            </div>
            <div className="meta-item">
              <FiTrendingUp />
              <span>{challenge.successRate}% success rate</span>
            </div>
          </div>
        </motion.div>

        <div className="challenge-detail-grid">
          {/* Main Content */}
          <div className="challenge-detail-main">
            {/* About Section */}
            <section className="detail-section">
              <h2 className="section-title">About This Challenge</h2>
              <p className="section-text">{challenge.longDescription}</p>
            </section>

            {/* Steps Section */}
            <section className="detail-section">
              <h2 className="section-title">Challenge Steps</h2>
              <div className="steps-list">
                {challenge.steps.map((step, index) => (
                  <div key={index} className="step-card">
                    <div className="step-number">{index + 1}</div>
                    <div className="step-content">
                      <h3 className="step-title">{step.title}</h3>
                      <p className="step-description">{step.description}</p>
                      <div className="step-verification">
                        <FiCamera />
                        <span>{step.verification}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Verification Examples */}
            <section className="detail-section">
              <h2 className="section-title">Proof Examples</h2>
              <div className="proof-examples">
                {challenge.sampleProofs.map((proof, index) => (
                  <div key={index} className="proof-item">
                    <FiCheckCircle />
                    <span>{proof}</span>
                  </div>
                ))}
              </div>
            </section>

            {/* Rules Section */}
            <section className="detail-section">
              <h2 className="section-title">Challenge Rules</h2>
              <div className="rules-list">
                {challenge.rules.map((rule, index) => (
                  <div key={index} className="rule-item">
                    <FiInfo />
                    <span>{rule}</span>
                  </div>
                ))}
              </div>
            </section>
          </div>

          {/* Sidebar */}
          <aside className="challenge-detail-sidebar">
            <div className="sticky-sidebar">
              {/* Stake Selector */}
              <div className="stake-selector-card">
                <h3 className="stake-title">Select Your Stake</h3>
                <p className="stake-subtitle">Higher stakes = Higher commitment</p>
                
                <div className="stake-input-group">
                  <FiDollarSign className="stake-icon" />
                  <input
                    type="number"
                    value={selectedStake}
                    onChange={(e) => setSelectedStake(Math.max(challenge.minStake, Math.min(challenge.maxStake, Number(e.target.value))))}
                    min={challenge.minStake}
                    max={challenge.maxStake}
                    step={100}
                    className="stake-input"
                  />
                </div>

                <div className="stake-range">
                  <input
                    type="range"
                    value={selectedStake}
                    onChange={(e) => setSelectedStake(Number(e.target.value))}
                    min={challenge.minStake}
                    max={challenge.maxStake}
                    step={100}
                    className="stake-slider"
                  />
                  <div className="stake-range-labels">
                    <span>₹{challenge.minStake}</span>
                    <span>₹{challenge.maxStake}</span>
                  </div>
                </div>

                <div className="stake-breakdown">
                  <div className="breakdown-item">
                    <span>Your Stake</span>
                    <span className="breakdown-value">₹{selectedStake}</span>
                  </div>
                  <div className="breakdown-item">
                    <span>Potential Gain</span>
                    <span className="breakdown-value positive">₹{Math.round(selectedStake * 0.15)}</span>
                  </div>
                  <div className="breakdown-item">
                    <span>If You Fail</span>
                    <span className="breakdown-value negative">-₹{selectedStake}</span>
                  </div>
                </div>

                <button
                  className="btn-start-challenge"
                  onClick={() => setShowStartModal(true)}
                >
                  Start Challenge
                </button>
              </div>
            </div>
          </aside>
        </div>
      </div>

      {/* Start Challenge Modal */}
      {showStartModal && (
        <div className="modal-overlay" onClick={() => setShowStartModal(false)}>
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="modal-content"
            onClick={(e) => e.stopPropagation()}
          >
            <h2>Start Challenge?</h2>
            <p>You're about to stake ₹{selectedStake} on this {challenge.duration}-day challenge.</p>
            
            <div className="modal-summary">
              <div className="summary-item">
                <span>Challenge:</span>
                <strong>{challenge.title}</strong>
              </div>
              <div className="summary-item">
                <span>Duration:</span>
                <strong>{challenge.duration} days</strong>
              </div>
              <div className="summary-item">
                <span>Your Stake:</span>
                <strong>₹{selectedStake}</strong>
              </div>
            </div>

            <div className="modal-actions">
              <button className="btn-modal-cancel" onClick={() => setShowStartModal(false)}>
                Cancel
              </button>
              <button className="btn-modal-confirm" onClick={handleStartChallenge}>
                Confirm & Start
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default ChallengeDetail;
