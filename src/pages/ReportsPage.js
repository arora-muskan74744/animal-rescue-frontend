import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import './ReportsPage.css';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

function ReportsPage() {
  const navigate = useNavigate();
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState('all'); // all, pending, on_the_way, resolved

  const loadReports = async () => {
    setLoading(true);
    try {
      const url = filter === 'all' 
        ? `${API_URL}/api/reports`
        : `${API_URL}/api/reports?onlyOpen=true`;
      
      const res = await fetch(url);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      
      let data = await res.json();
      
      // Apply client-side filtering
      if (filter !== 'all' && filter !== 'open') {
        data = data.filter(r => r.status === filter.toUpperCase());
      }
      
      setReports(Array.isArray(data) ? data : []);
      setError('');
    } catch (err) {
      console.error('Error loading reports:', err);
      setError('Failed to load reports.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadReports();
  }, [filter]);

  const updateStatus = async (id, newStatus) => {
    try {
      const res = await fetch(`${API_URL}/api/reports/${id}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      });
      
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      
      setReports((prev) =>
        prev.map((r) => (r.id === id ? { ...r, status: newStatus } : r))
      );
      
      console.log(`Updated report ${id} to ${newStatus}`);
    } catch (err) {
      console.error('Failed to update status:', err);
      alert('Failed to update status');
    }
  };

  return (
    <div className="reports-page">
      <motion.button
        className="back-home-btn"
        onClick={() => navigate('/')}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        ← Back to Home
      </motion.button>

      <motion.header 
        className="reports-header"
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8 }}
      >
        <h1>🐕 NGO Reports Dashboard</h1>
        <p>Track and manage animal rescue reports</p>
      </motion.header>

      <div className="reports-container">
        <div className="reports-controls">
          <div className="filter-buttons">
            <button 
              className={filter === 'all' ? 'active' : ''}
              onClick={() => setFilter('all')}
            >
              📋 All Reports
            </button>
            <button 
              className={filter === 'PENDING' ? 'active' : ''}
              onClick={() => setFilter('PENDING')}
            >
              ⏳ Pending
            </button>
            <button 
              className={filter === 'ON_THE_WAY' ? 'active' : ''}
              onClick={() => setFilter('ON_THE_WAY')}
            >
              🚗 On the Way
            </button>
            <button 
              className={filter === 'RESOLVED' ? 'active' : ''}
              onClick={() => setFilter('RESOLVED')}
            >
              ✅ Resolved
            </button>
          </div>

          <motion.button 
            className="new-report-btn"
            onClick={() => navigate('/report')}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            + New Report
          </motion.button>
        </div>

        {loading ? (
          <div className="loading-state">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
              style={{ fontSize: '4rem' }}
            >
              🔄
            </motion.div>
            <p>Loading reports...</p>
          </div>
        ) : error ? (
          <div className="error-state">
            <p>{error}</p>
            <button onClick={loadReports}>Retry</button>
          </div>
        ) : reports.length === 0 ? (
          <div className="empty-state">
            <p style={{ fontSize: '4rem' }}>📭</p>
            <h2>No reports found</h2>
            <p>Be the first to report an injured animal!</p>
            <motion.button 
              onClick={() => navigate('/report')}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
            >
              Submit First Report
            </motion.button>
          </div>
        ) : (
          <div className="reports-grid">
            <AnimatePresence>
              {reports.map((r, index) => (
                <motion.div 
                  key={r.id} 
                  className="report-card"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  transition={{ delay: index * 0.05 }}
                  whileHover={{ y: -5, boxShadow: '0 15px 40px rgba(0,0,0,0.3)' }}
                >
                  <div className="report-id">Report #{r.id}</div>
                  
                  <p><strong>⏰ Time:</strong> {new Date(r.created_at).toLocaleString()}</p>
                  <p><strong>📝 Description:</strong> {r.description}</p>
                  <p><strong>👤 Reporter:</strong> {r.reporter_name}</p>
                  <p><strong>📞 Phone:</strong> {r.reporter_phone}</p>
                  
                  {r.image_path && (
                    <p>
                      <strong>📷 Photo:</strong>{' '}
                      <a href={`${API_URL}${r.image_path}`} target="_blank" rel="noreferrer">
                        View Image
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
                        Open in Maps
                      </a>
                    </p>
                  )}
                  
                  <div className="status-badge">
                    <strong>Status:</strong>{' '}
                    <span className={`status-${r.status.toLowerCase()}`}>
                      {r.status}
                    </span>
                  </div>

                  <div className="action-buttons">
                    {r.status === 'PENDING' && (
                      <>
                        <motion.button 
                          onClick={() => updateStatus(r.id, 'ON_THE_WAY')} 
                          className="btn-secondary"
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          🚗 On the way
                        </motion.button>
                        <motion.button 
                          onClick={() => updateStatus(r.id, 'RESOLVED')} 
                          className="btn-success"
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          ✅ Resolved
                        </motion.button>
                      </>
                    )}

                    {r.status === 'ON_THE_WAY' && (
                      <motion.button 
                        onClick={() => updateStatus(r.id, 'RESOLVED')} 
                        className="btn-success"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
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
        )}
      </div>
    </div>
  );
}

export default ReportsPage;
