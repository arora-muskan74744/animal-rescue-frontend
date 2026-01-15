import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import '../App.css';
import './ReportPage.css';


const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

function ReportPage() {
  const navigate = useNavigate();

  const [description, setDescription] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [photo, setPhoto] = useState(null);
  const [lat, setLat] = useState(null);
  const [lng, setLng] = useState(null);
  const [locationError, setLocationError] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [manualLat, setManualLat] = useState('');
  const [manualLng, setManualLng] = useState('');
  const [showVan, setShowVan] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showManualLocation, setShowManualLocation] = useState(false); // ← NEW STATE

  const handleGetLocation = () => {
    setLocationError('');
    setShowManualLocation(false); // ← Hide manual location when trying auto

    if (!navigator.geolocation) {
      setLocationError('Geolocation is not supported by this browser.');
      setShowManualLocation(true); // ← Show manual entry
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLat(position.coords.latitude);
        setLng(position.coords.longitude);
        setShowManualLocation(false); // ← Hide manual entry on success
      },
      (error) => {
        console.error('Geolocation error:', error);
        setLocationError('Could not get location automatically. Please enter manually below.');
        setShowManualLocation(true); // ← Show manual entry on failure
      },
      {
        enableHighAccuracy: false,
        timeout: 20000,
        maximumAge: 60000
      }
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!description.trim() || !name.trim() || !phone.trim()) {
      setMessage('❌ Please fill description, name, and phone.');
      return;
    }

    // MANDATORY LOCATION CHECK
    const finalLat = lat != null ? lat : manualLat || null;
    const finalLng = lng != null ? lng : manualLng || null;

    if (!finalLat || !finalLng) {
      setMessage('❌ Location is mandatory! Please click "Use my current location" or enter manually.');
      return;
    }

    if (phone.trim().length < 10) {
      setMessage('❌ Please enter a valid phone number.');
      return;
    }

    setMessage('');
    setLoading(true);

    try {
      const formData = new FormData();
      formData.append('description', description);
      formData.append('reporter_name', name);
      formData.append('reporter_phone', phone);
      formData.append('latitude', finalLat);
      formData.append('longitude', finalLng);

      if (photo) formData.append('photo', photo);

      const res = await fetch(`${API_URL}/api/reports`, {
        method: 'POST',
        body: formData
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || `HTTP ${res.status}`);
      }

      const data = await res.json();
      console.log('Report created:', data);

      // ✅ SHOW SUCCESS AND AMBULANCE
      setShowSuccess(true);
      setShowVan(true);  // ← THIS TRIGGERS AMBULANCE

      let successMsg = `🎉 ${data.message}`;
      if (data.assigned_ngo) {
        successMsg += `\n🏥 Assigned to: ${data.assigned_ngo}`;
        if (data.distance_km) {
          successMsg += ` (${data.distance_km} km away)`;
        }
      }
      setMessage(successMsg);

      // Keep ambulance visible for 10 seconds
      setTimeout(() => {
        setShowVan(false);
        setShowSuccess(false);
      }, 10000);

      // Reset form after animation
      setTimeout(() => {
        setDescription('');
        setName('');
        setPhone('');
        setPhoto(null);
        setLat(null);
        setLng(null);
        setManualLat('');
        setManualLng('');
        setShowManualLocation(false);
      }, 11000);

    } catch (err) {
      console.error('Error:', err);
      setMessage(`❌ ${err.message}`);
    } finally {
      setLoading(false);
    }
  };


  return (
    <div className="report-page">
      <motion.button
        className="back-home-btn"
        onClick={() => navigate('/')}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        ← Back to Home
      </motion.button>

      {/* ========== AMBULANCE ANIMATION ========== */}
      <AnimatePresence>
        {showVan && (
          <>
            {/* Road */}
            <motion.div
              className="road"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <div className="road-line"></div>
              <div className="road-line"></div>
              <div className="road-line"></div>
            </motion.div>

            {/* Ambulance - comes from right, stops at center */}
            {/* Ambulance - responsive animation */}
            <motion.div
              className="ambulance"
              initial={{ x: '150%', scale: 0.8 }}
              animate={{
                x: '-50%',
                scale: 1,
                transition: {
                  duration: window.innerWidth < 768 ? 2.5 : 3,  // Faster on mobile
                  ease: [0.43, 0.13, 0.23, 0.96]
                }
              }}
            >

              <div className="ambulance-body">
                <div className="ambulance-top">
                  <motion.div
                    className="siren"
                    animate={{
                      backgroundColor: ['#ff0000', '#0000ff', '#ff0000'],
                      boxShadow: [
                        '0 0 20px #ff0000',
                        '0 0 20px #0000ff',
                        '0 0 20px #ff0000'
                      ]
                    }}
                    transition={{
                      duration: 0.5,
                      repeat: Infinity,
                      ease: 'linear'
                    }}
                  />
                </div>

                <div className="ambulance-main">
                  <span className="ambulance-icon">🚑</span>
                  <span className="red-cross">+</span>
                </div>

                <div className="wheels">
                  <motion.div
                    className="wheel"
                    animate={{ rotate: 360 }}
                    transition={{
                      duration: 0.4,
                      repeat: Infinity,
                      ease: 'linear'
                    }}
                  />
                  <motion.div
                    className="wheel"
                    animate={{ rotate: 360 }}
                    transition={{
                      duration: 0.4,
                      repeat: Infinity,
                      ease: 'linear'
                    }}
                  />
                </div>
              </div>
            </motion.div>

            {/* Message: "On The Way" - shows immediately */}
            {/* Message: "Arrived" - adjust delay for mobile */}
            <motion.div
              className="rescue-status"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{
                delay: window.innerWidth < 768 ? 2.7 : 3.2  // Earlier on mobile
              }}
            >

              <div className="status-content ontheway">
                <motion.div
                  animate={{
                    scale: [1, 1.05, 1],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: 'easeInOut'
                  }}
                >
                  <h3>🚨 Rescue Team On The Way!</h3>
                  <p>Ambulance approaching...</p>
                  <div className="status-dots">
                    <motion.span
                      animate={{ opacity: [0, 1, 0] }}
                      transition={{ duration: 1.5, repeat: Infinity, delay: 0 }}
                    >●</motion.span>
                    <motion.span
                      animate={{ opacity: [0, 1, 0] }}
                      transition={{ duration: 1.5, repeat: Infinity, delay: 0.3 }}
                    >●</motion.span>
                    <motion.span
                      animate={{ opacity: [0, 1, 0] }}
                      transition={{ duration: 1.5, repeat: Infinity, delay: 0.6 }}
                    >●</motion.span>
                  </div>
                </motion.div>
              </div>
            </motion.div>

            {/* Message: "Arrived" - shows after 3 seconds (when ambulance stops) */}
            <motion.div
              className="rescue-status"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 3.2 }}
            >
              <div className="status-content arrived">
                <motion.div
                  animate={{
                    scale: [1, 1.08, 1],
                  }}
                  transition={{
                    duration: 1.5,
                    repeat: Infinity,
                    ease: 'easeInOut'
                  }}
                >
                  <h3>✅ Rescue Team is arriving soon!</h3>
                  <p>Animal will be rescued now...</p>
                  <p>Thank you for taking a step towards humanity</p>
                  <div className="progress-bar">
                    <motion.div
                      className="progress-fill"
                      initial={{ width: 0 }}
                      animate={{ width: '100%' }}
                      transition={{ duration: 6, delay: 0.5 }}
                    />
                  </div>
                  <p style={{ fontSize: '0.9rem', marginTop: '10px', color: '#666' }}>
                    🕒 Estimated rescue time: 5-10 minutes
                  </p>
                </motion.div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showSuccess && (
          <motion.div
            className="confetti-container"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {[...Array(20)].map((_, i) => (
              <motion.div
                key={i}
                className="confetti"
                initial={{
                  y: -20,
                  x: Math.random() * window.innerWidth,
                  rotate: 0
                }}
                animate={{
                  y: window.innerHeight + 100,
                  rotate: 360
                }}
                transition={{
                  duration: 2 + Math.random() * 2,
                  ease: 'linear'
                }}
                style={{
                  left: `${Math.random() * 100}%`,
                  backgroundColor: ['#667eea', '#764ba2', '#4CAF50', '#ff6b6b'][Math.floor(Math.random() * 4)]
                }}
              />
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      <motion.header
        className="app-header"
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, type: 'spring', bounce: 0.4 }}
      >
        <h1>🐕 Report Injured Animal</h1>
        <p>Report injured animals to local NGOs</p>
      </motion.header>

      <div className="form-container-centered">
        <motion.section
          className="form-section-full"
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <h2>Submit a Report</h2>
          <form onSubmit={handleSubmit}>
            <motion.div
              className="form-group"
              whileHover={{ scale: 1.01 }}
              transition={{ type: 'spring', stiffness: 300 }}
            >
              <label htmlFor="description">Description *</label>
              <textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={4}
                placeholder="Describe the injury and animal type (e.g., 'Injured dog with broken leg near Park Street')"
                required
              />
            </motion.div>

            <div className="form-row">
              <motion.div className="form-group" whileHover={{ scale: 1.01 }}>
                <label htmlFor="name">Your name *</label>
                <input
                  id="name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Your full name"
                  required
                />
              </motion.div>

              <motion.div className="form-group" whileHover={{ scale: 1.01 }}>
                <label htmlFor="phone">Phone number *</label>
                <input
                  id="phone"
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="9876543210"
                  required
                />
              </motion.div>
            </div>

            <div className="form-group">
              <label htmlFor="photo">Upload photo of animal (optional)</label>
              <input
                id="photo"
                type="file"
                accept="image/*"
                onChange={(e) => setPhoto(e.target.files[0] || null)}
              />
            </div>

            <div className="form-group">
              <label>Location</label>
              <motion.button
                type="button"
                onClick={handleGetLocation}
                className="location-btn"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                📍 Use my current location
              </motion.button>

              <AnimatePresence>
                {lat != null && lng != null && (
                  <motion.div
                    className="location-display"
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                  >
                    ✅ Location captured: {lat.toFixed(5)}, {lng.toFixed(5)}
                  </motion.div>
                )}
              </AnimatePresence>

              <AnimatePresence>
                {locationError && (
                  <motion.div
                    className="error-message"
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                  >
                    {locationError}
                  </motion.div>
                )}
              </AnimatePresence>

              {/* MANUAL LOCATION TOGGLE BUTTON */}
              {!showManualLocation && lat == null && (
                <motion.button
                  type="button"
                  onClick={() => setShowManualLocation(true)}
                  className="manual-location-toggle"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  📝 Or add your location manually
                </motion.button>
              )}

              {/* Manual Location Fields */}
              <AnimatePresence>
                {showManualLocation && (
                  <motion.div
                    className="manual-location"
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                      <p style={{ color: '#667eea', fontWeight: 600, margin: 0 }}>
                        📍 Enter location manually:
                      </p>
                      <button
                        type="button"
                        onClick={() => setShowManualLocation(false)}
                        style={{
                          background: 'none',
                          border: 'none',
                          color: '#999',
                          cursor: 'pointer',
                          fontSize: '1.2rem'
                        }}
                      >
                        ✕
                      </button>
                    </div>
                    <div className="manual-inputs">
                      <input
                        type="text"
                        placeholder="Latitude (e.g., 29.43055)"
                        value={manualLat}
                        onChange={(e) => setManualLat(e.target.value)}
                      />
                      <input
                        type="text"
                        placeholder="Longitude (e.g., 74.92088)"
                        value={manualLng}
                        onChange={(e) => setManualLng(e.target.value)}
                      />
                    </div>
                    <p style={{ fontSize: '0.85rem', color: '#666', marginTop: 8 }}>
                      💡 Tip: Right-click on Google Maps → Click on coordinates to copy
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>


            <AnimatePresence>
              {message && (
                <motion.div
                  className={message.includes('Failed') || message.includes('❌') ? 'error-message' : 'success-message'}
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                >
                  {message}
                </motion.div>
              )}
            </AnimatePresence>

            <motion.button
              type="submit"
              className="submit-btn"
              disabled={loading}
              whileHover={{ scale: loading ? 1 : 1.03 }}
              whileTap={{ scale: loading ? 1 : 0.97 }}
              animate={loading ? { scale: [1, 1.05, 1] } : {}}
              transition={{ repeat: loading ? Infinity : 0, duration: 0.8 }}
            >
              {loading ? '📡 Submitting...' : '✉️ Submit Report'}
            </motion.button>
          </form>
        </motion.section>
      </div>
    </div>
  );
}

export default ReportPage;
