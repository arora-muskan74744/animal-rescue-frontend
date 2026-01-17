import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import '../App.css';
import './ReportPage.css';
import ChatBot from '../components/ChatBot';


const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

function ReportPage() {
  const navigate = useNavigate();

  const [description, setDescription] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [photo, setPhoto] = useState(null);
  const [lat, setLat] = useState(null);
  const [lng, setLng] = useState(null);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [manualLat, setManualLat] = useState('');
  const [manualLng, setManualLng] = useState('');
  const [locationName, setLocationName] = useState('');
  const [showVan, setShowVan] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showManualLocation, setShowManualLocation] = useState(false);

  const getLocation = () => {
    if (!navigator.geolocation) {
      setMessage('❌ Geolocation is not supported by your browser.');
      return;
    }

    setLoading(true);
    setMessage('📍 Getting your location...');

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const latitude = position.coords.latitude;
        const longitude = position.coords.longitude;

        setLat(latitude);
        setLng(longitude);

        try {
          const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&addressdetails=1`,
            {
              headers: {
                'Accept-Language': 'en'
              }
            }
          );

          if (response.ok) {
            const data = await response.json();
            const address = data.address;
            let placeName = '';

            if (address.road) placeName += address.road;
            if (address.suburb) placeName += (placeName ? ', ' : '') + address.suburb;
            if (address.city) placeName += (placeName ? ', ' : '') + address.city;
            else if (address.town) placeName += (placeName ? ', ' : '') + address.town;
            else if (address.village) placeName += (placeName ? ', ' : '') + address.village;
            if (address.state) placeName += (placeName ? ', ' : '') + address.state;
            if (address.country) placeName += (placeName ? ', ' : '') + address.country;

            setLocationName(placeName || data.display_name);
            setMessage(`✅ Location found: ${placeName || data.display_name}`);
          } else {
            setLocationName(`${latitude.toFixed(6)}, ${longitude.toFixed(6)}`);
            setMessage(`✅ Location found: ${latitude.toFixed(6)}, ${longitude.toFixed(6)}`);
          }
        } catch (error) {
          console.error('Geocoding error:', error);
          setLocationName(`${latitude.toFixed(6)}, ${longitude.toFixed(6)}`);
          setMessage(`✅ Location found: ${latitude.toFixed(6)}, ${longitude.toFixed(6)}`);
        }

        setLoading(false);
      },
      (error) => {
        setLoading(false);
        setMessage(`❌ Error: ${error.message}`);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0
      }
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!description.trim() || !name.trim() || !phone.trim()) {
      setMessage('❌ Please fill description, name, and phone.');
      return;
    }

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
      formData.append('location_name', locationName);

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

      setShowSuccess(true);
      setShowVan(true);

      let successMsg = `🎉 ${data.message}`;
      if (data.assigned_ngo) {
        successMsg += `\n🏥 Assigned to: ${data.assigned_ngo}`;
        if (data.distance_km) {
          successMsg += ` (${data.distance_km} km away)`;
        }
      }
      setMessage(successMsg);

      setTimeout(() => {
        setShowVan(false);
        setShowSuccess(false);
      }, 10000);

      setTimeout(() => {
        setDescription('');
        setName('');
        setPhone('');
        setPhoto(null);
        setLat(null);
        setLng(null);
        setLocationName('');
        setManualLat('');
        setManualLng('');
        setShowManualLocation(false);
        setMessage('');
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

            {/* Ambulance */}
            <motion.div
              className="ambulance"
              initial={{ x: '150%', scale: 0.8 }}
              animate={{
                x: '-50%',
                scale: 1,
                transition: {
                  duration: window.innerWidth < 768 ? 2.5 : 3,
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

            {/* CENTER MESSAGE - Shows immediately with ambulance */}
            <motion.div
              className="rescue-message-center"
              initial={{ opacity: 0, scale: 0.5, y: 50 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.5 }}
              transition={{
                delay: 0.5,
                duration: 0.6,
                type: 'spring',
                bounce: 0.4
              }}
            >
              <div className="message-content">
                <motion.div
                  animate={{
                    scale: [1, 1.03, 1],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: 'easeInOut'
                  }}
                >
                  <div className="message-icon">🚨</div>
                  <h2>Rescue Team is On The Way!</h2>
                  <p className="message-subtitle">Approaching you soon...</p>

                  <div className="thank-you-message">
                    <span className="heart-icon">🙏</span>
                    <p>Thank you for taking a step towards Humanity!</p>
                  </div>

                  <div className="progress-bar">
                    <motion.div
                      className="progress-fill"
                      initial={{ width: 0 }}
                      animate={{ width: '100%' }}
                      transition={{ duration: 8, delay: 1 }}
                    />
                  </div>

                  <p className="eta-text">🕒 Estimated arrival: 5-10 minutes</p>

                  <div className="pulse-dots">
                    <motion.span
                      animate={{ opacity: [0.3, 1, 0.3] }}
                      transition={{ duration: 1.5, repeat: Infinity, delay: 0 }}
                    >●</motion.span>
                    <motion.span
                      animate={{ opacity: [0.3, 1, 0.3] }}
                      transition={{ duration: 1.5, repeat: Infinity, delay: 0.3 }}
                    >●</motion.span>
                    <motion.span
                      animate={{ opacity: [0.3, 1, 0.3] }}
                      transition={{ duration: 1.5, repeat: Infinity, delay: 0.6 }}
                    >●</motion.span>
                  </div>
                </motion.div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Confetti */}
      <AnimatePresence>
        {showSuccess && (
          <motion.div
            className="confetti-container"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {[...Array(30)].map((_, i) => (
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
                  backgroundColor: ['#667eea', '#764ba2', '#4CAF50', '#ff6b6b', '#ffd700'][Math.floor(Math.random() * 5)]
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
              <label>Location *</label>
              <motion.button
                type="button"
                onClick={getLocation}
                className="location-btn"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                📍 Use my current location
              </motion.button>

              <AnimatePresence>
                {lat != null && lng != null && (
                  <motion.div
                    className="location-success"
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                  >
                    <strong>📍 {locationName || `${lat.toFixed(6)}, ${lng.toFixed(6)}`}</strong>
                    <br />
                    <small style={{ fontSize: '0.85rem', opacity: 0.8 }}>
                      Coordinates: {lat.toFixed(6)}, {lng.toFixed(6)}
                    </small>
                  </motion.div>
                )}
              </AnimatePresence>

              {!lat && !lng && (
                <span
                  className="manual-location-link"
                  onClick={() => setShowManualLocation(!showManualLocation)}
                >
                  Or enter coordinates manually
                </span>
              )}

              <AnimatePresence>
                {showManualLocation && (
                  <motion.div
                    className="manual-location-fields"
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                  >
                    <input
                      type="number"
                      step="any"
                      placeholder="Enter latitude (e.g., 28.6139)"
                      value={manualLat}
                      onChange={(e) => setManualLat(e.target.value)}
                    />
                    <input
                      type="number"
                      step="any"
                      placeholder="Enter longitude (e.g., 77.2090)"
                      value={manualLng}
                      onChange={(e) => setManualLng(e.target.value)}
                    />

                    {manualLat && manualLng && (
                      <div style={{
                        marginTop: '10px',
                        padding: '10px',
                        background: '#e8f5e9',
                        borderRadius: '8px',
                        fontSize: '0.95rem'
                      }}>
                        📍 <strong>{manualLat}, {manualLng}</strong>
                      </div>
                    )}
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
            >
              {loading ? '📡 Submitting...' : '✉️ Submit Report'}
            </motion.button>
          </form>
        </motion.section>
      </div>
      {/* AI Chatbot */}
      <ChatBot />
    </div>
  );
}

export default ReportPage;
