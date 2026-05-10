import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'

function Home() {
  const [healthStatus, setHealthStatus] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchHealthStatus = async () => {
      try {
        const response = await fetch('http://localhost:8000/health')
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }
        
        const data = await response.json()
        setHealthStatus(data)
        setLoading(false)
      } catch (err) {
        console.error('Fetch error:', err)
        setError(err.message)
        setLoading(false)
      }
    }

    fetchHealthStatus()
  }, [])

  useEffect(() => {
    const styleSheet = document.createElement("style")
    styleSheet.textContent = `
      @keyframes slideUp {
        from { opacity: 0; transform: translateY(30px); }
        to { opacity: 1; transform: translateY(0); }
      }
      @keyframes pulse {
        0% { transform: translate(-50%, -50%) scale(1); opacity: 0.3; }
        100% { transform: translate(-50%, -50%) scale(1.5); opacity: 0; }
      }
      @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
      }
      @keyframes blink {
        0%, 100% { opacity: 1; }
        50% { opacity: 0.3; }
      }
      button:hover { transform: scale(1.05); }
    `
    document.head.appendChild(styleSheet)
    return () => document.head.removeChild(styleSheet)
  }, [])

  const styles = {
    container: {
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      position: 'relative',
      overflow: 'hidden',
      padding: '20px'
    },
    decorativeCircle: {
      position: 'absolute',
      borderRadius: '50%',
      background: 'rgba(255,255,255,0.1)',
      zIndex: 1
    },
    card: {
      background: 'rgba(255, 255, 255, 0.95)',
      borderRadius: '30px',
      padding: '50px 40px',
      maxWidth: '550px',
      width: '100%',
      textAlign: 'center',
      boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
      backdropFilter: 'blur(10px)',
      zIndex: 2,
      animation: 'slideUp 0.6s ease-out'
    },
    header: { marginBottom: '30px' },
    iconWrapper: { position: 'relative', display: 'inline-block', marginBottom: '20px' },
    pulseRing: {
      position: 'absolute',
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
      width: '80px',
      height: '80px',
      background: 'rgba(102, 126, 234, 0.3)',
      borderRadius: '50%',
      animation: 'pulse 2s ease-in-out infinite'
    },
    icon: {
      fontSize: '60px',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
      backgroundClip: 'text',
      position: 'relative',
      zIndex: 1
    },
    title: { fontSize: '28px', color: '#333', marginBottom: '10px', fontWeight: '700' },
    statusContainer: { marginTop: '30px', marginBottom: '30px' },
    loadingWrapper: { display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '15px' },
    spinner: {
      width: '50px',
      height: '50px',
      border: '4px solid #f3f3f3',
      borderTop: '4px solid #667eea',
      borderRadius: '50%',
      animation: 'spin 1s linear infinite'
    },
    loadingText: { color: '#666', fontSize: '16px' },
    errorWrapper: { background: '#fee', borderRadius: '15px', padding: '20px', border: '1px solid #fcc' },
    errorIcon: { fontSize: '48px', marginBottom: '10px' },
    errorText: { color: '#d32f2f', fontSize: '18px', fontWeight: '600', marginBottom: '8px' },
    errorDetails: { color: '#999', fontSize: '12px', marginBottom: '15px' },
    retryBtn: {
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      color: 'white',
      border: 'none',
      padding: '10px 30px',
      borderRadius: '25px',
      fontSize: '14px',
      cursor: 'pointer',
      fontWeight: '600'
    },
    healthWrapper: {
      background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
      borderRadius: '20px',
      padding: '25px'
    },
    healthBadge: { display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', marginBottom: '15px' },
    statusDot: {
      width: '10px',
      height: '10px',
      background: '#4caf50',
      borderRadius: '50%',
      animation: 'blink 1.5s ease-in-out infinite'
    },
    statusLabel: { color: '#666', fontSize: '12px', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '1px' },
    healthMessage: {
      fontSize: '32px',
      fontWeight: '700',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
      backgroundClip: 'text',
      marginBottom: '20px'
    },
    infoGrid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginTop: '20px' },
    infoCard: { background: 'white', padding: '12px', borderRadius: '12px', textAlign: 'center' },
    infoLabel: { display: 'block', fontSize: '11px', color: '#999', textTransform: 'uppercase', marginBottom: '5px' },
    infoValue: { display: 'block', fontSize: '14px', color: '#333', fontWeight: '600' },
    loginButtonContainer: { marginTop: '20px' },
    loginButton: {
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      color: 'white',
      border: 'none',
      padding: '16px 40px',
      borderRadius: '25px',
      fontSize: '16px',
      fontWeight: '600',
      cursor: 'pointer',
      transition: 'transform 0.2s',
      width: '60%'
    },
    metrics: { display: 'flex', justifyContent: 'space-around', marginTop: '30px', paddingTop: '20px', borderTop: '1px solid #e0e0e0' },
    metric: { textAlign: 'center' },
    metricLabel: { display: 'block', fontSize: '11px', color: '#999', textTransform: 'uppercase', marginBottom: '5px' },
    metricValue: { display: 'block', fontSize: '18px', fontWeight: '700', color: '#667eea' }
  }

  return (
    <div style={styles.container}>
      <div style={{...styles.decorativeCircle, width: '300px', height: '300px', top: '-100px', right: '-100px'}}></div>
      <div style={{...styles.decorativeCircle, width: '200px', height: '200px', bottom: '-50px', left: '-50px'}}></div>
      <div style={{...styles.decorativeCircle, width: '150px', height: '150px', top: '50%', left: '10%'}}></div>
      
      <div style={styles.card}>
        <div style={styles.header}>
          <div style={styles.iconWrapper}>
            <div style={styles.pulseRing}></div>
            <div style={styles.icon}>💚</div>
          </div>
          <h1 style={styles.title}>System Health Monitor</h1>
        </div>

        <div style={styles.statusContainer}>
          {loading && (
            <div style={styles.loadingWrapper}>
              <div style={styles.spinner}></div>
              <p style={styles.loadingText}>Checking system health...</p>
            </div>
          )}
          
          {error && (
            <div style={styles.errorWrapper}>
              <div style={styles.errorIcon}>⚠️</div>
              <p style={styles.errorText}>Connection Failed</p>
              <p style={styles.errorDetails}>{error}</p>
              <button onClick={() => window.location.reload()} style={styles.retryBtn}>Try Again</button>
            </div>
          )}
          
          {healthStatus && !loading && !error && (
            <div style={styles.healthWrapper}>
              <div style={styles.healthBadge}>
                <div style={styles.statusDot}></div>
                <span style={styles.statusLabel}>Active & Running</span>
              </div>
              
              <div style={styles.healthMessage}>{healthStatus?.message}</div>
              
              <div style={styles.infoGrid}>
                <div style={styles.infoCard}>
                  <span style={styles.infoLabel}>Server</span>
                  <span style={styles.infoValue}>localhost:8000</span>
                </div>
                <div style={styles.infoCard}>
                  <span style={styles.infoLabel}>Endpoint</span>
                  <span style={styles.infoValue}>/health</span>
                </div>
                <div style={styles.infoCard}>
                  <span style={styles.infoLabel}>Method</span>
                  <span style={styles.infoValue}>GET</span>
                </div>
                <div style={styles.infoCard}>
                  <span style={styles.infoLabel}>Status</span>
                  <span style={styles.infoValue}>✅ Online</span>
                </div>
              </div>
            </div>
          )}
        </div>

        <div style={styles.loginButtonContainer}>
          <Link to="/signin">
            <button style={styles.loginButton}>Sign In</button>
          </Link>
        </div>

        <div style={styles.metrics}>
          <div style={styles.metric}>
            <span style={styles.metricLabel}>Response Time</span>
            <span style={styles.metricValue}>&lt;100ms</span>
          </div>
          <div style={styles.metric}>
            <span style={styles.metricLabel}>Uptime</span>
            <span style={styles.metricValue}>99.9%</span>
          </div>
          <div style={styles.metric}>
            <span style={styles.metricLabel}>Reliability</span>
            <span style={styles.metricValue}>High</span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Home; 