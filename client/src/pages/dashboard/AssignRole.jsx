import { useState, useEffect, useRef } from 'react'
import axios from 'axios'
import { useNavigate, useLocation } from 'react-router-dom'

function AssignRole() {
  const navigate = useNavigate()
  const location = useLocation()
  const { userId, email: userEmail } = location.state || {}

  const [roles, setRoles] = useState([])
  const [selectedRole, setSelectedRole] = useState(null)
  const [loadingRoles, setLoadingRoles] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const dropdownRef = useRef(null)

  useEffect(() => {
    fetchRoles()
  }, [])

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const fetchRoles = async () => {
    try {
      const token = localStorage.getItem('token')
      const response = await axios.get('http://localhost:8000/api/role', {
        headers: { 'Authorization': `Bearer ${token}` }
      })
      setRoles(response.data.roles)
    } catch (err) {
      setError('Failed to load roles')
    } finally {
      setLoadingRoles(false)
    }
  }

  const getInitials = (email) => email ? email.slice(0, 2).toUpperCase() : '??'

  const groupByModule = (permissions) => {
    return permissions.reduce((acc, perm) => {
      if (!acc[perm.module]) acc[perm.module] = []
      acc[perm.module].push(perm.label)
      return acc
    }, {})
  }

  const moduleIcons = {
    user: '👤', product: '📦', category: '📁',
    review: '⭐', order: '🛒', role: '🔑', company_setting: '🏢'
  }

  const moduleLabels = {
    user: 'User', product: 'Product', category: 'Category',
    review: 'Review', order: 'Order', role: 'Role', company_setting: 'Company Setting'
  }

  const moduleColors = {
    user: '#e8f4fd', product: '#fef9e7', category: '#e8f8f5',
    review: '#fef5e4', order: '#fdebd0', role: '#f4ecf7', company_setting: '#eaf0fb'
  }

  const allLabels = ['Manage', 'View', 'Create', 'Edit', 'Delete']

  const handleSubmit = async () => {
    if (!selectedRole) {
      setError('Please select a role to continue')
      return
    }
    setError('')
    setSubmitting(true)
    try {
      const token = localStorage.getItem('token')
      await axios.patch(
        `http://localhost:8000/api/user/${userId}/assign-role`,
        { role: 'EMPLOYEE', roleId: selectedRole._id },
        { headers: { 'Authorization': `Bearer ${token}` } }
      )
      navigate('/dashboard/user')
    } catch (err) {
      console.error(err)
      setError(err.response?.data?.message || 'Failed to assign role. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div style={{ padding: '24px', maxWidth: '680px', margin: '0 auto' }}>

      {/* Breadcrumb + title */}
      <div style={{ marginBottom: '28px' }}>
        <p style={{ margin: '0 0 4px', fontSize: '13px', color: '#9ca3af' }}>
          Dashboard / User Management /
          <span style={{ color: '#6366f1', fontWeight: '500' }}> Assign Role</span>
        </p>
        <h1 style={{ margin: 0, fontSize: '24px', fontWeight: '700', color: '#111827' }}>
          Assign Role
        </h1>
      </div>

      {/* Card */}
      <div style={{
        background: 'white', borderRadius: '16px',
        border: '1px solid #f3f4f6',
        boxShadow: '0 2px 12px rgba(0,0,0,0.07)',
        overflow: 'visible'
      }}>

        {/* Card header — user info */}
        <div style={{
          padding: '20px 24px', borderBottom: '1px solid #f3f4f6',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '14px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <div style={{
              width: '48px', height: '48px', borderRadius: '50%',
              background: '#eef2ff', color: '#4338ca',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '16px', fontWeight: '700', flexShrink: 0
            }}>
              {getInitials(userEmail)}
            </div>
            <div>
              <div style={{ fontSize: '15px', fontWeight: '600', color: '#111827' }}>
                {userEmail}
              </div>
              <div style={{ fontSize: '13px', color: '#9ca3af', marginTop: '2px' }}>
                Select a role to assign
              </div>
            </div>
          </div>

          {/* 👇 Add this */}
          <div
            onClick={() => navigate('/dashboard/role')}
            style={{
              display: 'flex', alignItems: 'center', gap: '6px',
              fontSize: '13px', fontWeight: '500', color: '#6366f1',
              cursor: 'pointer', flexShrink: 0,
              padding: '7px 12px', borderRadius: '8px',
              border: '1px solid #e0e7ff', background: '#eef2ff',
              transition: 'background 0.15s'
            }}
            onMouseEnter={e => e.currentTarget.style.background = '#e0e7ff'}
            onMouseLeave={e => e.currentTarget.style.background = '#eef2ff'}
          >
            <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
              <path d="M6.5 1v11M1 6.5h11" stroke="#6366f1" strokeWidth="1.6" strokeLinecap="round" />
            </svg>
            Create Role
          </div>
        </div>

        {/* Card body */}
        <div style={{ padding: '24px', overflow: 'visible' }}>

          {error && (
            <div style={{
              background: '#fef2f2', border: '1px solid #fecaca',
              color: '#dc2626', padding: '12px 16px',
              borderRadius: '8px', fontSize: '13px', marginBottom: '20px',
              display: 'flex', alignItems: 'center', gap: '8px'
            }}>
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <circle cx="8" cy="8" r="7" stroke="#dc2626" strokeWidth="1.4" />
                <path d="M8 5v3.5M8 11h.01" stroke="#dc2626" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
              {error}
            </div>
          )}

          {/* Custom Dropdown */}
          <div style={{ marginBottom: '24px' }}>
            <label style={{
              display: 'block', fontSize: '12px', fontWeight: '700',
              color: '#6b7280', marginBottom: '8px',
              textTransform: 'uppercase', letterSpacing: '0.5px'
            }}>
              Select Role
            </label>

            <div ref={dropdownRef} style={{ position: 'relative' }}>

              {/* Trigger */}
              <div
                onClick={() => !loadingRoles && setDropdownOpen(p => !p)}
                style={{
                  padding: '12px 16px',
                  border: `1.5px solid ${dropdownOpen ? '#6366f1' : selectedRole ? '#6366f1' : '#e5e7eb'}`,
                  borderRadius: '10px', cursor: loadingRoles ? 'not-allowed' : 'pointer',
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  background: loadingRoles ? '#fafafa' : 'white',
                  transition: 'border-color 0.15s',
                  userSelect: 'none'
                }}
              >
                {loadingRoles ? (
                  <span style={{ fontSize: '14px', color: '#9ca3af' }}>Loading roles...</span>
                ) : selectedRole ? (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <div style={{
                      width: '32px', height: '32px', borderRadius: '8px',
                      background: '#eef2ff',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: '15px'
                    }}>
                      🔑
                    </div>
                    <div>
                      <div style={{ fontSize: '14px', fontWeight: '600', color: '#111827' }}>
                        {selectedRole.name}
                      </div>
                      <div style={{ fontSize: '12px', color: '#9ca3af', marginTop: '1px' }}>
                        {selectedRole.permissions?.length || 0} permissions
                      </div>
                    </div>
                  </div>
                ) : (
                  <span style={{ fontSize: '14px', color: '#9ca3af' }}>— Choose a role —</span>
                )}

                {/* Chevron */}
                <svg
                  width="16" height="16" viewBox="0 0 16 16" fill="none"
                  style={{
                    transition: 'transform 0.2s',
                    transform: dropdownOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                    flexShrink: 0
                  }}
                >
                  <path d="M4 6l4 4 4-4" stroke="#9ca3af" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>

              {/* Dropdown list */}
              {dropdownOpen && (
                <div style={{
                  position: 'absolute', top: 'calc(100% + 6px)', left: 0, right: 0,
                  background: 'white', borderRadius: '12px',
                  border: '1px solid #e5e7eb',
                  boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
                  zIndex: 100, overflow: 'hidden',
                  maxHeight: '300px',
                  overflowY: 'auto',
                }}>
                  {roles.length === 0 ? (
                    <div style={{ padding: '16px', textAlign: 'center', color: '#9ca3af', fontSize: '13px' }}>
                      No roles available
                    </div>
                  ) : roles.map((role, idx) => (
                    <div
                      key={role._id}
                      onClick={() => {
                        setSelectedRole(role)
                        setDropdownOpen(false)
                        setError('')
                      }}
                      style={{
                        padding: '12px 16px',
                        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                        cursor: 'pointer',
                        borderBottom: idx < roles.length - 1 ? '1px solid #f9fafb' : 'none',
                        background: selectedRole?._id === role._id ? '#f5f3ff' : 'white',
                        transition: 'background 0.12s'
                      }}
                      onMouseEnter={e => {
                        if (selectedRole?._id !== role._id)
                          e.currentTarget.style.background = '#fafafa'
                      }}
                      onMouseLeave={e => {
                        if (selectedRole?._id !== role._id)
                          e.currentTarget.style.background = 'white'
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <div style={{
                          width: '36px', height: '36px', borderRadius: '9px',
                          background: selectedRole?._id === role._id ? '#ede9fe' : '#f3f4f6',
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          fontSize: '16px', flexShrink: 0
                        }}>
                          🔑
                        </div>
                        <div>
                          <div style={{
                            fontSize: '14px', fontWeight: '600',
                            color: selectedRole?._id === role._id ? '#6366f1' : '#111827'
                          }}>
                            {role.name}
                          </div>
                          <div style={{ fontSize: '12px', color: '#9ca3af', marginTop: '2px' }}>
                            {role.permissions?.length || 0} permissions
                          </div>
                        </div>
                      </div>

                      {/* Checkmark if selected */}
                      {selectedRole?._id === role._id && (
                        <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                          <circle cx="9" cy="9" r="9" fill="#6366f1" />
                          <path d="M5 9l3 3 5-5" stroke="white" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Permission table — shown when role is selected */}
          {selectedRole && selectedRole.permissions?.length > 0 && (
            <div style={{ marginBottom: '24px' }}>
              <div style={{
                fontSize: '12px', fontWeight: '700', color: '#6b7280',
                textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '12px'
              }}>
                Permissions in "{selectedRole.name}"
              </div>

              {/* Column headers */}
              <div style={{
                display: 'grid', gridTemplateColumns: '1.8fr repeat(5, 1fr)',
                gap: '6px', padding: '0 12px 8px',
              }}>
                <div style={{ fontSize: '11px', color: '#c0c4cc', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.4px' }}>
                  Module
                </div>
                {allLabels.map(l => (
                  <div key={l} style={{
                    fontSize: '11px', color: '#c0c4cc', fontWeight: '700',
                    textTransform: 'uppercase', letterSpacing: '0.4px', textAlign: 'center'
                  }}>
                    {l}
                  </div>
                ))}
              </div>

              {/* Module rows */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                {Object.entries(groupByModule(selectedRole.permissions)).map(([module, labels], idx) => (
                  <div
                    key={module}
                    style={{
                      display: 'grid', gridTemplateColumns: '1.8fr repeat(5, 1fr)',
                      gap: '6px', alignItems: 'center',
                      background: idx % 2 === 0 ? '#fafafa' : 'white',
                      border: '1px solid #f3f4f6', borderRadius: '10px',
                      padding: '10px 12px'
                    }}
                  >
                    {/* Module name */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <div style={{
                        width: '32px', height: '32px', borderRadius: '8px',
                        background: moduleColors[module] || '#f3f4f6',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontSize: '15px', flexShrink: 0
                      }}>
                        {moduleIcons[module] || '📄'}
                      </div>
                      <div>
                        <div style={{ fontSize: '13px', fontWeight: '600', color: '#111827' }}>
                          {moduleLabels[module] || module}
                        </div>
                        <div style={{ fontSize: '11px', color: '#c0c4cc', marginTop: '1px' }}>
                          {labels.length}/{allLabels.length}
                        </div>
                      </div>
                    </div>

                    {/* Permission cells */}
                    {allLabels.map(label => (
                      <div key={label} style={{ display: 'flex', justifyContent: 'center' }}>
                        {labels.includes(label) ? (
                          <div style={{
                            width: '24px', height: '24px', borderRadius: '50%',
                            background: '#e8faf0', border: '1.5px solid #a8e6c0',
                            display: 'flex', alignItems: 'center', justifyContent: 'center'
                          }}>
                            <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                              <path d="M2 5l2.5 2.5 3.5-4" stroke="#27ae60" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                          </div>
                        ) : (
                          <div style={{
                            width: '24px', height: '24px', borderRadius: '50%',
                            background: '#fef2f2', border: '1.5px solid #fcc',
                            display: 'flex', alignItems: 'center', justifyContent: 'center'
                          }}>
                            <svg width="8" height="8" viewBox="0 0 8 8" fill="none">
                              <path d="M1.5 1.5l5 5M6.5 1.5l-5 5" stroke="#e74c3c" strokeWidth="1.6" strokeLinecap="round" />
                            </svg>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Buttons */}
          <div style={{ display: 'flex', gap: '12px' }}>
            <button
              onClick={() => navigate('/dashboard/user')}
              style={{
                flex: 1, padding: '11px',
                background: 'white', color: '#374151',
                border: '1px solid #e5e7eb', borderRadius: '8px',
                fontSize: '14px', fontWeight: '500', cursor: 'pointer',
                transition: 'background 0.15s'
              }}
              onMouseEnter={e => e.currentTarget.style.background = '#f9fafb'}
              onMouseLeave={e => e.currentTarget.style.background = 'white'}
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              disabled={submitting || loadingRoles}
              style={{
                flex: 2, padding: '11px',
                background: submitting ? '#e5e7eb' : '#111827',
                color: submitting ? '#9ca3af' : 'white',
                border: 'none', borderRadius: '8px',
                fontSize: '14px', fontWeight: '600',
                cursor: submitting ? 'not-allowed' : 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                transition: 'opacity 0.2s'
              }}
              onMouseEnter={e => { if (!submitting) e.currentTarget.style.opacity = '0.85' }}
              onMouseLeave={e => { e.currentTarget.style.opacity = '1' }}
            >
              {submitting ? (
                <>
                  <div style={{
                    width: '14px', height: '14px',
                    border: '2px solid #d1d5db', borderTopColor: '#6b7280',
                    borderRadius: '50%', animation: 'spin 0.7s linear infinite'
                  }} />
                  Assigning...
                </>
              ) : (
                <>
                  <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
                    <circle cx="5.5" cy="4.5" r="2.5" stroke="currentColor" strokeWidth="1.4" />
                    <path d="M1 13c0-2.5 2-4.5 4.5-4.5S10 10.5 10 13" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
                    <path d="M12 6v4M10 8h4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
                  </svg>
                  Confirm & Make Employee
                </>
              )}
            </button>
          </div>
        </div>
      </div>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  )
}

export default AssignRole; 