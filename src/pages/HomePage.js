import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import './HomePage.css';
// Import hero image (make sure you have this image in assets folder)
// If you don't have the image yet, comment this line and the <img> tag below
import heroImage from '../assets/hero-dog.jpg';

function HomePage() {
  const navigate = useNavigate();

  return (
    <div className="home-page">
      {/* Header */}
      <motion.header
        className="home-header"
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, type: 'spring', bounce: 0.4 }}
      >
        <motion.div
          className="logo"
          animate={{
            rotate: [0, 5, -5, 0],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        >
          🐾
        </motion.div>
        <h1>Animal Rescue Network</h1>
      </motion.header>

      {/* Hero Section with Image */}
      <div className="hero">
        <motion.div
          className="hero-content"
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.8 }}
        >
          <motion.h1
            animate={{
              scale: [1, 1.02, 1],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          >
            🐕 Save Lives Together
          </motion.h1>
          <p className="hero-subtitle">
            Report injured animals. Connect with nearby NGOs instantly.
          </p>
          <p className="hero-description">
            Every second counts. Help us rescue animals in need with our automated matching system.
          </p>

          {/* Hero Buttons */}
          <div className="hero-buttons">
            <motion.button
              className="btn-primary-hero"
              onClick={() => navigate('/report')}
              whileHover={{ scale: 1.05, boxShadow: '0 10px 30px rgba(255, 107, 107, 0.4)' }}
              whileTap={{ scale: 0.95 }}
              initial={{ x: -50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              ✍️ Report Animal
            </motion.button>

            <motion.button
              className="btn-secondary-hero"
              onClick={() => navigate('/reports')}
              whileHover={{ scale: 1.05, boxShadow: '0 10px 30px rgba(102, 126, 234, 0.4)' }}
              whileTap={{ scale: 0.95 }}
              initial={{ x: 50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.6 }}
            >
              📋 View Reports
            </motion.button>
          </div>
        </motion.div>

        <motion.div
          className="hero-image"
          initial={{ x: 100, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.8 }}
        >
          {/* Remove this img tag if you don't have the image yet */}
          <img src={heroImage} alt="Rescue dog" />

          {/* Floating badge */}
          <motion.div
            className="floating-badge"
            animate={{
              y: [0, -10, 0],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          >
            <span className="badge-icon">🚑</span>
            <div className="badge-text">
              <strong>24/7 Support</strong>
              <small>Instant NGO Matching</small>
            </div>
          </motion.div>
        </motion.div>
      </div>

      {/* Features Section */}
      <motion.div
        className="features"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8, duration: 0.8 }}
      >
        <h2>How It Works</h2>
        <div className="features-grid">
          <motion.div
            className="feature-card"
            whileHover={{ y: -10, boxShadow: '0 20px 40px rgba(0,0,0,0.2)' }}
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.9 }}
          >
            <div className="feature-icon">📸</div>
            <h3>1. Report</h3>
            <p>Take a photo and describe the injured animal's condition and location</p>
          </motion.div>

          <motion.div
            className="feature-card"
            whileHover={{ y: -10, boxShadow: '0 20px 40px rgba(0,0,0,0.2)' }}
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 1.0 }}
          >
            <div className="feature-icon">🗺️</div>
            <h3>2. Auto-Match</h3>
            <p>Our system finds the nearest NGO and alerts them automatically</p>
          </motion.div>

          <motion.div
            className="feature-card"
            whileHover={{ y: -10, boxShadow: '0 20px 40px rgba(0,0,0,0.2)' }}
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 1.1 }}
          >
            <div className="feature-icon">🚑</div>
            <h3>3. Rescue</h3>
            <p>NGO team arrives on-site. Track status in real-time</p>
          </motion.div>
        </div>
      </motion.div>

      {/* Stats Section */}
      <motion.div
        className="stats"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2, duration: 0.8 }}
      >
        <div className="stats-grid">
          <motion.div
            className="stat-item"
            whileHover={{ scale: 1.05 }}
          >
            <motion.div
              className="stat-number"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 1.3, type: 'spring', stiffness: 200 }}
            >
              500+
            </motion.div>
            <div className="stat-label">Animals Rescued</div>
          </motion.div>

          <motion.div
            className="stat-item"
            whileHover={{ scale: 1.05 }}
          >
            <motion.div
              className="stat-number"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 1.4, type: 'spring', stiffness: 200 }}
            >
              50+
            </motion.div>
            <div className="stat-label">NGO Partners</div>
          </motion.div>

          <motion.div
            className="stat-item"
            whileHover={{ scale: 1.05 }}
          >
            <motion.div
              className="stat-number"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 1.5, type: 'spring', stiffness: 200 }}
            >
              &lt;15 min
            </motion.div>
            <div className="stat-label">Avg Response Time</div>
          </motion.div>
        </div>
      </motion.div>

      {/* Call to Action */}
      <motion.div
        className="cta"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.6, duration: 0.8 }}
      >
        <h2>Ready to Save a Life?</h2>
        <p>Join thousands of animal lovers making a difference</p>
        <motion.button
          className="cta-button"
          onClick={() => navigate('/report')}
          whileHover={{
            scale: 1.1,
            boxShadow: '0 20px 50px rgba(255, 107, 107, 0.5)'
          }}
          whileTap={{ scale: 0.95 }}
        >
          🐾 Submit Your First Report
        </motion.button>
      </motion.div>

      {/* Footer */}
      <footer className="home-footer">
        <p>Made with ❤️ for animals | © 2026 Animal Rescue Network</p>
        <div className="footer-links">
          <a href="#about">About</a>
          <a href="#contact">Contact</a>
          <a href="#privacy">Privacy</a>
        </div>
      </footer>
    </div>
  );
}

export default HomePage;
