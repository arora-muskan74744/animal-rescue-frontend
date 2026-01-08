import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import './App.css';

function App() {
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
  
  // ADD: State to trigger reports refresh
  const [refreshReports, setRefreshReports] = useState(0);

  const handleGetLocation = () => {
    setLocationError('');
    if (!navigator.geolocation) {
      setLocationError('Geolocation is not supported by this browser.');
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLat(position.coords.latitude);
        setLng(position.coords.longitude);
      },
      (error) => {
        console.error('Geolocation error:', error);
        setLocationError('Could not get location automatically. Please enter it manually.');
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
      setMessage('Please fill description, name, and phone.');
      return;
    }
    if (phone.trim().length < 10) {
      setMessage('Please enter a valid phone number.');
      return;
    }

    setMessage('');
    setLoading(true);

    try {
      const formData = new FormData();
      formData.append('description', description);
      formData.append('reporter_name', name);
      formData.append('reporter_phone', phone);

      const finalLat = lat != null ? lat : manualLat || null;
      const finalLng = lng != null ? lng : manualLng || null;

      if (finalLat != null) formData.append('latitude', finalLat);
      if (finalLng != null) formData.append('longitude', finalLng);
      if (photo) formData.append('photo', photo);

      const res = await fetch('http://localhost:5000/api/reports', {
        method: 'POST',
        body: formData
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || `HTTP ${res.status}`);
      }

      const data = await res.json();
      console.log('Created report:', data);

      // Trigger animations
      setShowSuccess(true);
      setShowVan(true);
      setMessage('🎉 Report submitted! Rescue team is on the way!');
      
      // Hide animations
      setTimeout(() => setShowVan(false), 3000);
      setTimeout(() => setShowSuccess(false), 4000);

      // Reset form
      setDescription('');
      setName('');
      setPhone('');
      setPhoto(null);
      setLat(null);
      setLng(null);
      setManualLat('');
      setManualLng('');
      
      // CRITICAL: Trigger reports refresh
      setRefreshReports(prev => prev + 1);
      
    } catch (err) {
      console.error('Error submitting report:', err);
      setMessage(`❌ Failed to submit: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="App">
      {/* Moving Van Animation */}
      <AnimatePresence>
        {showVan && (
          <motion.div
            className="rescue-van"
            initial={{ x: '-100%', y: 0 }}
            animate={{ x: '110%', y: 0 }}
            exit={{ x: '110%' }}
            transition={{ duration: 3, ease: 'easeInOut' }}
          >
            🚐💨
          </motion.div>
        )}
      </AnimatePresence>

      {/* Success Confetti Animation */}
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

      {/* Animated Header */}
      <motion.header 
        className="app-header"
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, type: 'spring', bounce: 0.4 }}
      >
        <h1>🐕 INJURED ANIMAL REPORT</h1>
        <p>Report injured animals to local NGOs</p>
      </motion.header>

      <div className="container">
        {/* Animated Form Section */}
        <motion.section 
          className="form-section"
          initial={{ x: -100, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <h2>Submit a Report</h2>
          <form onSubmit={handleSubmit}>
            <motion.div 
              className="form-group"
              whileHover={{ scale: 1.02 }}
              transition={{ type: 'spring', stiffness: 300 }}
            >
              <label htmlFor="description">Description *</label>
              <textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={4}
                placeholder="Describe the injury and animal."
                required
              />
            </motion.div>

            <motion.div 
              className="form-group"
              whileHover={{ scale: 1.02 }}
            >
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

            <motion.div 
              className="form-group"
              whileHover={{ scale: 1.02 }}
            >
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
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                📍 Use my current location
              </motion.button>

              <AnimatePresence>
                {lat != null && lng != null && (
                  <motion.div 
                    className="location-display"
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                  >
                    ✅ Captured: {lat.toFixed(5)}, {lng.toFixed(5)}
                  </motion.div>
                )}
              </AnimatePresence>

              <AnimatePresence>
                {locationError && (
                  <motion.div 
                    className="error-message"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    {locationError}
                  </motion.div>
                )}
              </AnimatePresence>

              <div className="manual-location">
                <p>If automatic location fails, enter coordinates manually:</p>
                <input
                  type="text"
                  placeholder="Latitude, e.g. 29.43055"
                  value={manualLat}
                  onChange={(e) => setManualLat(e.target.value)}
                />
                <input
                  type="text"
                  placeholder="Longitude, e.g. 74.92088"
                  value={manualLng}
                  onChange={(e) => setManualLng(e.target.value)}
                />
              </div>
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
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              animate={loading ? { scale: [1, 1.05, 1] } : {}}
              transition={{ repeat: loading ? Infinity : 0, duration: 0.8 }}
            >
              {loading ? '📡 Submitting...' : '✉️ Submit report'}
            </motion.button>
          </form>
        </motion.section>

        {/* Animated Reports Section - PASS refreshReports to trigger reload */}
        <motion.section 
          className="reports-section"
          initial={{ x: 100, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <h2>Recent NGO Reports</h2>
          <ReportsList key={refreshReports} refreshTrigger={refreshReports} />
        </motion.section>
      </div>
    </div>
  );
}

// UPDATED: ReportsList component with auto-refresh
function ReportsList({ refreshTrigger }) {
  const [reports, setReports] = useState([]);
  const [loadingReports, setLoadingReports] = useState(true);
  const [error, setError] = useState('');

  // Load reports function
  const loadReports = async () => {
    setLoadingReports(true);
    try {
      const res = await fetch('http://localhost:5000/api/reports?onlyOpen=true');
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      
      const data = await res.json();
      console.log('Loaded reports:', data);
      setReports(Array.isArray(data) ? data : []);
      setError('');
    } catch (err) {
      console.error('Error loading reports:', err);
      setError('Failed to load reports.');
    } finally {
      setLoadingReports(false);
    }
  };

  // Load reports when component mounts OR when refreshTrigger changes
  useEffect(() => {
    loadReports();
  }, [refreshTrigger]); // ← This makes it reload when form submits!

  const updateStatus = async (id, newStatus) => {
    try {
      const res = await fetch(`http://localhost:5000/api/reports/${id}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      });
      
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      
      // Update local state
      setReports((prev) =>
        prev.map((r) => (r.id === id ? { ...r, status: newStatus } : r))
      );
      
      console.log(`Updated report ${id} to ${newStatus}`);
    } catch (err) {
      console.error('Failed to update status:', err);
      alert('Failed to update status');
    }
  };

  if (loadingReports) {
    return (
      <div style={{ textAlign: 'center', padding: '40px' }}>
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
          style={{ fontSize: '3rem' }}
        >
          🔄
        </motion.div>
        <p>Loading reports...</p>
      </div>
    );
  }
  
  if (error) return <p className="error-message">{error}</p>;
  
  if (reports.length === 0) {
    return (
      <div style={{ textAlign: 'center', padding: '40px', color: '#666' }}>
        <p style={{ fontSize: '3rem', marginBottom: '10px' }}>📭</p>
        <p>No reports yet. Be the first to report!</p>
      </div>
    );
  }

  return (
    <div className="reports-list">
      <AnimatePresence>
        {reports.map((r, index) => (
          <motion.div 
            key={r.id} 
            className="report-card"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, x: -100 }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ scale: 1.03, boxShadow: '0 15px 40px rgba(0,0,0,0.3)' }}
          >
            <h3>🆔 Report #{r.id}</h3>
            <p><strong>⏰ Time:</strong> {new Date(r.created_at).toLocaleString()}</p>
            <p><strong>📝 Description:</strong> {r.description}</p>
            <p><strong>👤 Reporter:</strong> {r.reporter_name} ({r.reporter_phone})</p>
            
            {r.image_path && (
              <p>
                <strong>📷 Photo:</strong>{' '}
                <a href={`http://localhost:5000${r.image_path}`} target="_blank" rel="noreferrer">
                  View image
                </a>
              </p>
            )}
            
            {r.latitude && r.longitude && (
              <p>
                <strong>📍 Location:</strong>{' '}
                <a
                  href={`https://www.google.com/maps/search/?api=1&query=${r.latitude},${r.longitude}`}
                  target="_blank"
                  rel="noreferrer"
                >
                  Open in Google Maps
                </a>
              </p>
            )}
            
            <p>
              <strong>📊 Status:</strong>{' '}
              <span className={`status-${r.status.toLowerCase()}`}>
                {r.status}
              </span>
            </p>

            <div className="action-buttons">
              {r.status === 'PENDING' && (
                <>
                  <motion.button 
                    onClick={() => updateStatus(r.id, 'ON_THE_WAY')} 
                    className="btn-secondary"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    🚗 On the way
                  </motion.button>
                  <motion.button 
                    onClick={() => updateStatus(r.id, 'RESOLVED')} 
                    className="btn-success"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    ✅ Resolved
                  </motion.button>
                </>
              )}

              {r.status === 'ON_THE_WAY' && (
                <motion.button 
                  onClick={() => updateStatus(r.id, 'RESOLVED')} 
                  className="btn-success"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  ✅ Mark Resolved
                </motion.button>
              )}

              {r.status === 'RESOLVED' && (
                <span className="completed-badge">✔️ Completed</span>
              )}
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}

export default App;
