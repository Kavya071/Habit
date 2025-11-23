import React from 'react';
import { motion } from 'framer-motion';
import { FiMail, FiPhone, FiMapPin, FiTwitter, FiInstagram, FiLinkedin, FiFacebook, FiArrowUp } from 'react-icons/fi';
import { Link } from 'react-scroll';
import './Footer.css';

const Footer = () => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-content">
          <div className="footer-column brand-column">
            <div className="footer-logo">
              <span className="logo-text">Stake</span>
              <span className="logo-accent">Your</span>
              <span className="logo-text">Habit</span>
            </div>
            <p className="footer-tagline">
              Build habits that stick with real money on the line. Win either way.
            </p>
            <div className="social-links">
              <motion.a
                href="#"
                whileHover={{ scale: 1.1, y: -3 }}
                whileTap={{ scale: 0.95 }}
                className="social-icon"
              >
                <FiTwitter />
              </motion.a>
              <motion.a
                href="#"
                whileHover={{ scale: 1.1, y: -3 }}
                whileTap={{ scale: 0.95 }}
                className="social-icon"
              >
                <FiInstagram />
              </motion.a>
              <motion.a
                href="#"
                whileHover={{ scale: 1.1, y: -3 }}
                whileTap={{ scale: 0.95 }}
                className="social-icon"
              >
                <FiLinkedin />
              </motion.a>
              <motion.a
                href="#"
                whileHover={{ scale: 1.1, y: -3 }}
                whileTap={{ scale: 0.95 }}
                className="social-icon"
              >
                <FiFacebook />
              </motion.a>
            </div>
          </div>

          <div className="footer-column">
            <h4 className="footer-heading">Product</h4>
            <ul className="footer-links">
              <li><Link to="what-it-is" smooth={true} duration={500} offset={-80}>What It Is</Link></li>
              <li><Link to="how-it-works" smooth={true} duration={500} offset={-80}>How It Works</Link></li>
              <li><Link to="benefits" smooth={true} duration={500} offset={-80}>Benefits</Link></li>
              <li><a href="#">Challenges</a></li>
              <li><a href="#">Pricing</a></li>
            </ul>
          </div>

          <div className="footer-column">
            <h4 className="footer-heading">Resources</h4>
            <ul className="footer-links">
              <li><a href="#">Blog</a></li>
              <li><a href="#">Help Center</a></li>
              <li><a href="#">Community</a></li>
              <li><a href="#">Success Stories</a></li>
              <li><a href="#">API Docs</a></li>
            </ul>
          </div>

          <div className="footer-column">
            <h4 className="footer-heading">Company</h4>
            <ul className="footer-links">
              <li><a href="#">About Us</a></li>
              <li><a href="#">Careers</a></li>
              <li><a href="#">Press Kit</a></li>
              <li><a href="#">Partners</a></li>
              <li><a href="#">Contact</a></li>
            </ul>
          </div>

          <div className="footer-column">
            <h4 className="footer-heading">Contact</h4>
            <ul className="footer-contact">
              <li>
                <FiMail />
                <a href="mailto:hello@stakeyourhabit.com">hello@stakeyourhabit.com</a>
              </li>
              <li>
                <FiPhone />
                <a href="tel:+911234567890">+91 123 456 7890</a>
              </li>
              <li>
                <FiMapPin />
                <span>Bangalore, India</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="footer-bottom">
          <div className="footer-legal">
            <p>&copy; 2024 Stake Your Habit. All rights reserved.</p>
            <div className="legal-links">
              <a href="#">Privacy Policy</a>
              <span className="separator">•</span>
              <a href="#">Terms of Service</a>
              <span className="separator">•</span>
              <a href="#">Cookie Policy</a>
            </div>
          </div>

          <motion.button
            className="scroll-top"
            onClick={scrollToTop}
            whileHover={{ scale: 1.1, y: -5 }}
            whileTap={{ scale: 0.95 }}
          >
            <FiArrowUp />
          </motion.button>
        </div>
      </div>

      <div className="footer-decoration">
        <div className="decoration-orb orb-1"></div>
        <div className="decoration-orb orb-2"></div>
      </div>
    </footer>
  );
};

export default Footer;
