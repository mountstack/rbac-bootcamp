import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import axios from 'axios'

function SignIn() {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({ email: '', password: '' })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setSuccess('')

    try {
      const response = await axios.post('http://localhost:8000/api/auth/signin', {
        email: formData.email,
        password: formData.password
      })

      console.log('Full response:', response.data)

      // Check if login was successful
      if (response.data.success) {
        // Store tokens and user data
        const {user, accessToken, refreshToken} = response.data.data; 

        localStorage.setItem('token', accessToken); 
        localStorage.setItem('refreshToken', refreshToken); 
        localStorage.setItem('user', JSON.stringify(user)); 
        
        if(user.type === 'CUSTOMER') {
          setSuccess('Login successful! You are customer. So No redirecting for now...')
        }
        else {
          setSuccess(response.data.message || 'Login successful! Redirecting...'); 
          
          // Redirect to dashboard after 2 seconds
          setTimeout(() => navigate('/dashboard'), 2000)
        } 
      } 
      else {
        setError(response.data.message || 'Login failed')
      }
    } 
    catch (err) {
      console.error('Signin error:', err)
      if (err.response) {
        setError(err.response.data.message || 'Login failed. Please check your credentials.')
      } else if (err.request) {
        setError('Cannot connect to server. Please check if backend is running.')
      } else {
        setError('An error occurred. Please try again.')
      }
    } finally {
      setLoading(false)
    }
  }

  const styles = {
    container: {
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      padding: '20px'
    },
    card: {
      background: 'rgba(255, 255, 255, 0.95)',
      borderRadius: '30px',
      padding: '50px 40px',
      maxWidth: '450px',
      width: '100%',
      boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
      backdropFilter: 'blur(10px)'
    },
    header: { textAlign: 'center', marginBottom: '40px' },
    icon: { fontSize: '60px', marginBottom: '20px' },
    title: { fontSize: '28px', color: '#333', marginBottom: '10px', fontWeight: '700' },
    subtitle: { color: '#666', fontSize: '14px' },
    form: { display: 'flex', flexDirection: 'column', gap: '20px' },
    inputGroup: { display: 'flex', flexDirection: 'column', gap: '8px' },
    label: { fontSize: '14px', color: '#555', fontWeight: '600' },
    input: {
      padding: '12px 15px',
      border: '2px solid #e0e0e0',
      borderRadius: '12px',
      fontSize: '14px',
      outline: 'none',
      fontFamily: 'inherit'
    },
    button: {
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      color: 'white',
      border: 'none',
      padding: '14px',
      borderRadius: '12px',
      fontSize: '16px',
      fontWeight: '600',
      cursor: 'pointer',
      marginTop: '10px'
    },
    buttonDisabled: { opacity: 0.7, cursor: 'not-allowed' },
    errorMessage: {
      background: '#fee',
      color: '#d32f2f',
      padding: '12px',
      borderRadius: '10px',
      fontSize: '14px',
      textAlign: 'center',
      marginBottom: '20px'
    },
    successMessage: {
      background: '#e8f5e9',
      color: '#4caf50',
      padding: '12px',
      borderRadius: '10px',
      fontSize: '14px',
      textAlign: 'center',
      marginBottom: '20px'
    },
    footer: { textAlign: 'center', marginTop: '25px', fontSize: '14px', color: '#666' },
    link: { color: '#667eea', textDecoration: 'none', fontWeight: '600', cursor: 'pointer' }
  }

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <div style={styles.header}>
          <div style={styles.icon}>🔐</div>
          <h1 style={styles.title}>Welcome Back</h1>
          <p style={styles.subtitle}>Sign in to continue</p>
        </div>

        {error && <div style={styles.errorMessage}>{error}</div>}
        {success && <div style={styles.successMessage}>{success}</div>}

        <form onSubmit={handleSubmit} style={styles.form}>
          <div style={styles.inputGroup}>
            <label style={styles.label}>Email Address</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              style={styles.input}
              placeholder="Enter your email"
              required
              onFocus={(e) => e.target.style.borderColor = '#667eea'}
              onBlur={(e) => e.target.style.borderColor = '#e0e0e0'}
            />
          </div>

          <div style={styles.inputGroup}>
            <label style={styles.label}>Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              style={styles.input}
              placeholder="Enter your password"
              required
              onFocus={(e) => e.target.style.borderColor = '#667eea'}
              onBlur={(e) => e.target.style.borderColor = '#e0e0e0'}
            />
          </div>

          <button
            type="submit"
            style={{ ...styles.button, ...(loading ? styles.buttonDisabled : {}) }}
            disabled={loading}
            onMouseEnter={(e) => !loading && (e.target.style.transform = 'scale(1.02)')}
            onMouseLeave={(e) => !loading && (e.target.style.transform = 'scale(1)')}
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        <div style={styles.footer}>
          Don't have an account?{' '}
          <Link to="/signup" style={styles.link}>
            Sign Up
          </Link>
        </div>
      </div>
    </div>
  )
}

export default SignIn