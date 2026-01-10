import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import './HomePage.css';

function HomePage() {
  const navigate = useNavigate();

  return (
    <div className="homepage">
      <motion.section 
        className="hero"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
      >
        <div className="hero-content">
          <motion.h1
            initial={{ y: -50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.8 }}
          >
            🐾 Save Lives Today
          </motion.h1>
          <motion.p
            className="hero-subtitle"
            initial={{ y: -30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.8 }}
          >
            Help injured animals get the care they deserve
          </motion.p>
          <motion.div
            className="hero-buttons"
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.8 }}
          >
            <motion.button
              className="btn-primary"
              onClick={() => navigate('/report')}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
            >
              🚨 Report Injured Animal
            </motion.button>
            <motion.button
              className="btn-secondary"
              onClick={() => navigate('/report')}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
            >
              📋 View Reports
            </motion.button>
          </motion.div>
        </div>
      </motion.section>

      <section className="features">
        <h2>How We Help</h2>
        <div className="features-grid">
          <motion.div 
            className="feature-card"
            whileHover={{ y: -10 }}
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <div className="feature-icon">📍</div>
            <h3>Easy Reporting</h3>
            <p>Report injured animals with location tracking in seconds</p>
          </motion.div>

          <motion.div 
            className="feature-card"
            whileHover={{ y: -10 }}
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <div className="feature-icon">🚑</div>
            <h3>Fast Response</h3>
            <p>Local NGOs are notified immediately to provide rescue</p>
          </motion.div>

          <motion.div 
            className="feature-card"
            whileHover={{ y: -10 }}
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
          >
            <div className="feature-icon">💚</div>
            <h3>Track Progress</h3>
            <p>Follow the rescue status from report to recovery</p>
          </motion.div>
        </div>
      </section>

      <section className="stats">
        <div className="stats-grid">
          <motion.div 
            className="stat-item"
            initial={{ scale: 0 }}
            whileInView={{ scale: 1 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >
            <h3>500+</h3>
            <p>Animals Rescued</p>
          </motion.div>
          <motion.div 
            className="stat-item"
            initial={{ scale: 0 }}
            whileInView={{ scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            viewport={{ once: true }}
          >
            <h3>50+</h3>
            <p>NGO Partners</p>
          </motion.div>
          <motion.div 
            className="stat-item"
            initial={{ scale: 0 }}
            whileInView={{ scale: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            viewport={{ once: true }}
          >
            <h3>24/7</h3>
            <p>Emergency Support</p>
          </motion.div>
        </div>
      </section>

      <motion.section 
        className="cta"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 1 }}
        viewport={{ once: true }}
      >
        <h2>Every Second Counts</h2>
        <p>Help us save more lives. Report an injured animal now.</p>
        <motion.button
          className="btn-cta"
          onClick={() => navigate('/report')}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
        >
          Report Now →
        </motion.button>
      </motion.section>

      <footer className="footer">
        <p>© 2026 Animal Rescue Hub. Saving lives, one report at a time. 🐾</p>
      </footer>
    </div>
  );
}

export default HomePage;
