import React from 'react';
import { motion } from 'framer-motion';
import { FiStar, FiArrowRight } from 'react-icons/fi';
import './Reviews.css';

const Reviews = () => {
  const reviews = [
    {
      name: 'Priya Sharma',
      role: 'Software Engineer',
      image: '👩‍💻',
      rating: 5,
      challenge: 'DSA Problem Daily',
      streak: '45 days',
      review: 'I finally stayed consistent with coding practice. Stakes made me show up even on tough days.'
    },
    {
      name: 'Rahul Mehta',
      role: 'Fitness Enthusiast',
      image: '💪',
      rating: 5,
      challenge: '10K Steps Daily',
      streak: '60 days',
      review: 'Lost 8kg in 2 months. Even my missed days turned into gold worth Rs 12K. Win-win.'
    },
    {
      name: 'Anjali Reddy',
      role: 'Marketing Manager',
      image: '👩‍💼',
      rating: 5,
      challenge: 'Read 10 Pages Daily',
      streak: '90 days',
      review: 'Read 12 books in 3 months. AI verification is instant. Streaks are addictive in the best way.'
    },
    {
      name: 'Vikram Singh',
      role: 'College Student',
      image: '🎓',
      rating: 5,
      challenge: 'Early Morning Wakeup',
      streak: '30 days',
      review: 'Waking at 5:30 AM seemed impossible. Rs 20 stake was enough pressure. Now it\'s automatic.'
    },
    {
      name: 'Neha Gupta',
      role: 'Entrepreneur',
      image: '👩‍🚀',
      rating: 5,
      challenge: 'Hydration Challenge',
      streak: '75 days',
      review: 'Simple habit, powerful results. More energy, clearer skin, real discipline.'
    },
    {
      name: 'Arjun Patel',
      role: 'Data Analyst',
      image: '👨‍💻',
      rating: 5,
      challenge: 'High-Protein Breakfast',
      streak: '50 days',
      review: 'Down 6kg, gained muscle. Photo verification keeps me honest. This is real accountability.'
    }
  ];

  return (
    <section className="reviews" id="reviews">
      <div className="section-container">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="section-header"
        >
          <span className="section-badge">Success Stories</span>
          <h2 className="section-title">
            Real People, Real Results
          </h2>
          <p className="section-description">
            Thousands have built lasting habits. Here's what they have to say about their journey.
          </p>
        </motion.div>

        <div className="reviews-grid">
          {reviews.map((review, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
              viewport={{ once: true }}
              whileHover={{ y: -10, boxShadow: '0 20px 40px rgba(0,0,0,0.15)' }}
              className="review-card"
            >
              <div className="review-header">
                <div className="reviewer-info">
                  <div className="reviewer-avatar">{review.image}</div>
                  <div className="reviewer-details">
                    <h4 className="reviewer-name">{review.name}</h4>
                    <p className="reviewer-role">{review.role}</p>
                  </div>
                </div>
                <div className="rating">
                  {[...Array(review.rating)].map((_, i) => (
                    <FiStar key={i} fill="var(--accent)" color="var(--accent)" />
                  ))}
                </div>
              </div>

              <div className="challenge-info">
                <div className="challenge-badge">
                  <span className="challenge-label">{review.challenge}</span>
                  <span className="challenge-streak">🔥 {review.streak}</span>
                </div>
              </div>

              <p className="review-text">{review.review}</p>

              <div className="review-verified">
                <FiStar size={16} />
                <span>Verified Challenge Completer</span>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.6 }}
          viewport={{ once: true }}
          className="stats-showcase"
        >
          <div className="stat-item">
            <h3>10,000+</h3>
            <p>Active Users Building Habits</p>
          </div>
          <div className="stat-divider"></div>
          <div className="stat-item">
            <h3>50,000+</h3>
            <p>Challenges Completed</p>
          </div>
          <div className="stat-divider"></div>
          <div className="stat-item">
            <h3>₹2.5Cr+</h3>
            <p>Invested from Failed Attempts</p>
          </div>
          <div className="stat-divider"></div>
          <div className="stat-item">
            <h3>4.9/5</h3>
            <p>Average User Rating</p>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.6 }}
          viewport={{ once: true }}
          className="join-cta"
        >
          <h3>Your Success Story Starts Today</h3>
          <p>Join our community and transform your life one habit at a time</p>
          <motion.button
            whileHover={{ scale: 1.05, boxShadow: '0 10px 30px rgba(236, 72, 153, 0.4)' }}
            whileTap={{ scale: 0.95 }}
            className="cta-button"
          >
            Start Your Journey
            <FiArrowRight />
          </motion.button>
        </motion.div>
      </div>
    </section>
  );
};

export default Reviews;
