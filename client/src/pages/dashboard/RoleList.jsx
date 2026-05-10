import { useState, useEffect } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'

function RoleList() {
  const navigate = useNavigate()
  const [roles, setRoles] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [selectedRole, setSelectedRole] = useState(null)

  useEffect(() => {
    fetchRoles()
  }, [])

  const fetchRoles = async () => {
    try {
      const token = localStorage.getItem('token')
      const response = await axios.get('http://localhost:8000/api/role', {
        headers: { 'Authorization': `Bearer ${token}` }
      })
      setRoles(response.data.roles)
    } catch (error) {
      console.error('Error fetching roles:', error)
      setError('Failed to load roles')
    } finally {
      setLoading(false)
    }
  }

  const formatDate = (dateStr) => {
    const date = new Date(dateStr)
    return date.toLocaleString('en-US', {
      year: 'numeric', month: 'short', day: 'numeric',
      hour: '2-digit', minute: '2-digit'
    })
  }

  const groupByModule = (permissions) => {
    return permissions.reduce((acc, perm) => {
      if (!acc[perm.module]) acc[perm.module] = []
      acc[perm.module].push(perm.label)
      return acc
    }, {})
  }

  const moduleLabels = {
    user: 'User',
    product: 'Product',
    category: 'Category',
    review: 'Review',
    order: 'Order',
    role: 'Role',
    company_setting: 'Company Setting'
  }

  const moduleIcons = {
    user: '👤',
    product: '📦',
    category: '📁',
    review: '⭐',
    order: '🛒',
    role: '🔑',
    company_setting: '🏢'
  }

  const moduleColors = {
    user: '#e8f4fd',
    product: '#fef9e7',
    category: '#e8f8f5',
    review: '#fef5e4',
    order: '#fdebd0',
    role: '#f4ecf7',
    company_setting: '#eaf0fb'
  }

  const allLabels = ['Manage', 'View', 'Create', 'Edit', 'Delete']

  const styles = {
    container: {
      padding: '20px',
      maxWidth: '1200px',
      margin: '0 auto'
    },
    header: {
      marginBottom: '30px',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center'
    },
    breadcrumb: {
      color: '#888',
      fontSize: '13px',
      marginBottom: '8px'
    },
    title: {
      fontSize: '26px',
      color: '#1a1a2e',
      margin: 0,
      fontWeight: '700'
    },
    createBtn: {
      padding: '10px 20px',
      background: '#1a1a2e',
      color: 'white',
      border: 'none',
      borderRadius: '8px',
      cursor: 'pointer',
      fontSize: '14px',
      fontWeight: '600'
    },
    card: {
      background: 'white',
      borderRadius: '12px',
      padding: '0',
      boxShadow: '0 2px 12px rgba(0,0,0,0.08)',
      overflow: 'hidden'
    },
    table: {
      width: '100%',
      borderCollapse: 'collapse'
    },
    th: {
      padding: '14px 20px',
      textAlign: 'left',
      background: '#f8f9fa',
      borderBottom: '1px solid #eee',
      fontWeight: '600',
      fontSize: '12px',
      color: '#888',
      textTransform: 'uppercase',
      letterSpacing: '0.5px'
    },
    td: {
      padding: '16px 20px',
      borderBottom: '1px solid #f5f5f5',
      fontSize: '14px',
      color: '#333'
    },
    roleName: {
      fontWeight: '600',
      color: '#1a1a2e',
      fontSize: '15px'
    },
    badgeCount: {
      display: 'inline-block',
      background: '#eef2ff',
      color: '#4f46e5',
      borderRadius: '20px',
      padding: '4px 12px',
      fontSize: '12px',
      fontWeight: '600'
    },
    dateText: {
      color: '#888',
      fontSize: '13px'
    },
    checkBtn: {
      padding: '7px 14px',
      background: 'white',
      border: '1px solid #e0e0e0',
      borderRadius: '8px',
      cursor: 'pointer',
      fontSize: '13px',
      color: '#444',
      fontWeight: '500',
      display: 'inline-flex',
      alignItems: 'center',
      gap: '6px'
    },
    loading: {
      textAlign: 'center',
      padding: '60px',
      fontSize: '16px',
      color: '#888'
    },
    error: {
      background: '#fff0f0',
      color: '#e74c3c',
      padding: '12px 20px',
      fontSize: '14px',
      borderBottom: '1px solid #ffd0d0'
    },
    empty: {
      textAlign: 'center',
      padding: '60px',
      color: '#aaa',
      fontSize: '15px'
    }
  }

  if (loading) return <div style={styles.loading}>Loading roles...</div>

  return (
    <div style={styles.container}>

      {/* Page Header */}
      <div style={styles.header}>
        <div>
          <div style={styles.breadcrumb}>Dashboard / Roles / Role List</div>
          <h1 style={styles.title}>Role List</h1>
        </div>
        <button
          style={styles.createBtn}
          onClick={() => navigate('/dashboard/role')}
          onMouseEnter={e => e.currentTarget.style.opacity = '0.85'}
          onMouseLeave={e => e.currentTarget.style.opacity = '1'}
        >
          + Create Role
        </button>
      </div>

      {/* Table Card */}
      <div style={styles.card}>
        {error && <div style={styles.error}>{error}</div>}

        {roles.length === 0 ? (
          <div style={styles.empty}>No roles found.</div>
        ) : (
          <table style={styles.table}>
            <thead>
              <tr>
                <th style={styles.th}>#</th>
                <th style={styles.th}>Role Name</th>
                <th style={styles.th}>Permissions</th>
                <th style={styles.th}>Created At</th>
                <th style={styles.th}>Action</th>
              </tr>
            </thead>
            <tbody>
              {roles.map((role, index) => (
                <tr
                  key={role._id}
                  onMouseEnter={e => e.currentTarget.style.background = '#fafafa'}
                  onMouseLeave={e => e.currentTarget.style.background = 'white'}
                >
                  <td style={{ ...styles.td, color: '#aaa', width: '50px' }}>{index + 1}</td>
                  <td style={styles.td}>
                    <span style={styles.roleName}>{role.name}</span>
                  </td>
                  <td style={styles.td}>
                    <span style={styles.badgeCount}>
                      {role.permissions.length} permissions
                    </span>
                  </td>
                  <td style={styles.td}>
                    <span style={styles.dateText}>{formatDate(role.createdAt)}</span>
                  </td>
                  <td style={styles.td}>
                    <button
                      style={styles.checkBtn}
                      onClick={() => setSelectedRole(role)}
                      onMouseEnter={e => e.currentTarget.style.borderColor = '#4f46e5'}
                      onMouseLeave={e => e.currentTarget.style.borderColor = '#e0e0e0'}
                    >
                      🔍 Check Permissions
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* ── Permissions Modal ── */}
      {selectedRole && (
        <div
          style={{
            position: 'fixed', inset: 0,
            background: 'rgba(0,0,0,0.5)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            zIndex: 1000, padding: '20px'
          }}
          onClick={() => setSelectedRole(null)}
        >
          <div
            onClick={e => e.stopPropagation()}
            style={{
              background: 'white',
              borderRadius: '16px',
              width: '700px',
              maxWidth: '95vw',
              maxHeight: '88vh',
              overflowY: 'auto',
              boxShadow: '0 24px 64px rgba(0,0,0,0.22)'
            }}
          >

            {/* Modal Header */}
            <div style={{
              padding: '24px 28px',
              borderBottom: '1px solid #f0f0f0',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              position: 'sticky',
              top: 0,
              background: 'white',
              borderRadius: '16px 16px 0 0',
              zIndex: 1
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                <div style={{
                  width: '48px', height: '48px', borderRadius: '12px',
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '22px', flexShrink: 0
                }}>
                  🔑
                </div>
                <div>
                  <h2 style={{
                    margin: 0, fontSize: '18px', fontWeight: '700', color: '#1a1a2e'
                  }}>
                    {selectedRole.name}
                  </h2>
                  <p style={{ margin: '3px 0 0', fontSize: '13px', color: '#999' }}>
                    {selectedRole.permissions.length} permissions assigned across {Object.keys(groupByModule(selectedRole.permissions)).length} modules
                  </p>
                </div>
              </div>
              <button
                onClick={() => setSelectedRole(null)}
                style={{
                  width: '34px', height: '34px', borderRadius: '8px',
                  border: '1px solid #eee', background: '#f8f8f8',
                  cursor: 'pointer', fontSize: '16px', color: '#999',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  flexShrink: 0, fontWeight: '600'
                }}
              >
                ✕
              </button>
            </div>

            {/* Modal Body */}
            <div style={{ padding: '24px 28px' }}>

              {/* Column Header Row */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: '1.8fr repeat(5, 1fr)',
                gap: '8px',
                padding: '0 14px 10px',
              }}>
                <div style={{
                  fontSize: '11px', fontWeight: '700',
                  color: '#bbb', textTransform: 'uppercase', letterSpacing: '0.6px'
                }}>
                  Module
                </div>
                {allLabels.map(label => (
                  <div key={label} style={{
                    fontSize: '11px', fontWeight: '700',
                    color: '#bbb', textTransform: 'uppercase',
                    letterSpacing: '0.6px', textAlign: 'center'
                  }}>
                    {label}
                  </div>
                ))}
              </div>

              {/* Module Rows */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {Object.entries(groupByModule(selectedRole.permissions)).map(([module, labels], idx) => (
                  <div
                    key={module}
                    style={{
                      display: 'grid',
                      gridTemplateColumns: '1.8fr repeat(5, 1fr)',
                      gap: '8px',
                      alignItems: 'center',
                      background: idx % 2 === 0 ? '#fafafa' : 'white',
                      borderRadius: '10px',
                      padding: '12px 14px',
                      border: '1px solid #f0f0f0',
                      transition: 'box-shadow 0.2s'
                    }}
                    onMouseEnter={e => e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.06)'}
                    onMouseLeave={e => e.currentTarget.style.boxShadow = 'none'}
                  >
                    {/* Module Info */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <div style={{
                        width: '36px', height: '36px', borderRadius: '9px',
                        background: moduleColors[module] || '#f0f0f0',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontSize: '17px', flexShrink: 0
                      }}>
                        {moduleIcons[module] || '📄'}
                      </div>
                      <div>
                        <div style={{
                          fontSize: '14px', fontWeight: '600', color: '#1a1a2e'
                        }}>
                          {moduleLabels[module] || module}
                        </div>
                        <div style={{ fontSize: '11px', color: '#bbb', marginTop: '2px' }}>
                          {labels.length} / {allLabels.length} granted
                        </div>
                      </div>
                    </div>

                    {/* Permission Cells */}
                    {allLabels.map(label => (
                      <div key={label} style={{
                        display: 'flex', justifyContent: 'center', alignItems: 'center'
                      }}>
                        {labels.includes(label) ? (
                          <div style={{
                            width: '28px', height: '28px', borderRadius: '50%',
                            background: '#e8faf0', border: '1.5px solid #a8e6c0',
                            display: 'flex', alignItems: 'center', justifyContent: 'center'
                          }}>
                            <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                              <path d="M2 6l3 3 5-5" stroke="#27ae60" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                          </div>
                        ) : (
                          <div style={{
                            width: '28px', height: '28px', borderRadius: '50%',
                            background: '#fef2f2', border: '1.5px solid #fcc',
                            display: 'flex', alignItems: 'center', justifyContent: 'center'
                          }}>
                            <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                              <path d="M2 2l6 6M8 2l-6 6" stroke="#e74c3c" strokeWidth="1.8" strokeLinecap="round" />
                            </svg>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                ))}
              </div>

              {/* Modal Footer */}
              <div style={{
                marginTop: '24px', paddingTop: '18px',
                borderTop: '1px solid #f0f0f0',
                display: 'flex', justifyContent: 'space-between', alignItems: 'center'
              }}>
                <div style={{ display: 'flex', gap: '20px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '7px' }}>
                    <div style={{
                      width: '12px', height: '12px', borderRadius: '50%',
                      background: '#27ae60', border: '2px solid #a8e6c0'
                    }} />
                    <span style={{ fontSize: '12px', color: '#888' }}>Granted</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '7px' }}>
                    <div style={{
                      width: '12px', height: '12px', borderRadius: '50%',
                      background: '#e74c3c', border: '2px solid #fcc'
                    }} />
                    <span style={{ fontSize: '12px', color: '#888' }}>Not granted</span>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedRole(null)}
                  style={{
                    padding: '9px 24px',
                    background: '#1a1a2e', color: 'white',
                    border: 'none', borderRadius: '8px',
                    cursor: 'pointer', fontSize: '13px', fontWeight: '600'
                  }}
                  onMouseEnter={e => e.currentTarget.style.opacity = '0.85'}
                  onMouseLeave={e => e.currentTarget.style.opacity = '1'}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default RoleList; 