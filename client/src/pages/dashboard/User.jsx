import { useState, useEffect } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'

function User() {
  const navigate = useNavigate()
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')

  useEffect(() => {
    fetchUsers()
  }, [])

  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem('token')
      const response = await axios.get('http://localhost:8000/api/user', {
        headers: { 'Authorization': `Bearer ${token}` }
      })
      setUsers(response.data.users)
    } catch (error) {
      console.error('Error fetching users:', error)
    } finally {
      setLoading(false)
    }
  }

  const getInitials = (email) => {
    return email ? email.slice(0, 2).toUpperCase() : '??'
  }

  const avatarColors = [
    { bg: '#eef2ff', color: '#4338ca' },
    { bg: '#f0fdf4', color: '#15803d' },
    { bg: '#fff7ed', color: '#c2410c' },
    { bg: '#fdf4ff', color: '#9333ea' },
    { bg: '#eff6ff', color: '#1d4ed8' },
    { bg: '#fef2f2', color: '#dc2626' },
  ]

  const getAvatarColor = (email) => {
    const idx = (email?.charCodeAt(0) || 0) % avatarColors.length
    return avatarColors[idx]
  }

  const typeBadge = (type) => {
    const map = {
      'BUSINESS-OWNER': { bg: '#fef9c3', color: '#854d0e', label: 'Owner' },
      'EMPLOYEE':       { bg: '#dcfce7', color: '#166534', label: 'Employee' },
      'CUSTOMER':       { bg: '#f1f5f9', color: '#475569', label: 'Customer' },
    }
    return map[type] || { bg: '#f1f5f9', color: '#475569', label: type }
  }

  const filtered = users.filter(u =>
    u.email?.toLowerCase().includes(search.toLowerCase()) ||
    u.type?.toLowerCase().includes(search.toLowerCase()) ||
    u.role?.name?.toLowerCase().includes(search.toLowerCase())
  )

  const totalCustomers = users.filter(u => u.type === 'CUSTOMER').length
  const totalEmployees = users.filter(u => u.type === 'EMPLOYEE').length

  if (loading) {
    return (
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        height: '300px', flexDirection: 'column', gap: '14px'
      }}>
        <div style={{
          width: '36px', height: '36px', border: '3px solid #e5e7eb',
          borderTopColor: '#6366f1', borderRadius: '50%',
          animation: 'spin 0.8s linear infinite'
        }} />
        <span style={{ fontSize: '14px', color: '#9ca3af' }}>Loading users...</span>
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    )
  }

  return (
    <div style={{ padding: '24px', maxWidth: '1100px', margin: '0 auto' }}>

      {/* Page header */}
      <div style={{ marginBottom: '24px' }}>
        <p style={{ margin: '0 0 4px', fontSize: '13px', color: '#9ca3af' }}>
          Dashboard / User Management
        </p>
        <h1 style={{ margin: 0, fontSize: '24px', fontWeight: '700', color: '#111827' }}>
          User Management
        </h1>
      </div>

      {/* Stat cards */}
      <div style={{
        display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)',
        gap: '14px', marginBottom: '24px'
      }}>
        {[
          { label: 'Total Users',  value: users.length,   bg: '#eef2ff', color: '#4338ca', icon: '👥' },
          { label: 'Employees',    value: totalEmployees, bg: '#dcfce7', color: '#166534', icon: '🧑‍💼' },
          { label: 'Customers',    value: totalCustomers, bg: '#fff7ed', color: '#c2410c', icon: '🛍️' },
        ].map(card => (
          <div key={card.label} style={{
            background: 'white', border: '1px solid #f3f4f6',
            borderRadius: '12px', padding: '18px 20px',
            display: 'flex', alignItems: 'center', gap: '14px'
          }}>
            <div style={{
              width: '44px', height: '44px', borderRadius: '10px',
              background: card.bg,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '20px', flexShrink: 0
            }}>
              {card.icon}
            </div>
            <div>
              <div style={{ fontSize: '22px', fontWeight: '700', color: '#111827', lineHeight: 1 }}>
                {card.value}
              </div>
              <div style={{ fontSize: '13px', color: '#9ca3af', marginTop: '4px' }}>
                {card.label}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Table card */}
      <div style={{
        background: 'white', borderRadius: '14px',
        border: '1px solid #f3f4f6',
        boxShadow: '0 1px 8px rgba(0,0,0,0.06)', overflow: 'hidden'
      }}>

        {/* Toolbar */}
        <div style={{
          padding: '16px 20px', borderBottom: '1px solid #f3f4f6',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px'
        }}>
          <span style={{ fontSize: '15px', fontWeight: '600', color: '#111827' }}>
            All Users
            <span style={{
              marginLeft: '8px', background: '#f3f4f6', color: '#6b7280',
              fontSize: '12px', padding: '2px 8px', borderRadius: '20px'
            }}>
              {filtered.length}
            </span>
          </span>
          <input
            type="text"
            placeholder="Search by email, type or role..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            style={{
              padding: '8px 14px', fontSize: '13px',
              border: '1px solid #e5e7eb', borderRadius: '8px',
              outline: 'none', width: '260px', color: '#374151',
              background: '#fafafa'
            }}
          />
        </div>

        {/* Table */}
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: '#f9fafb' }}>
                {['#', 'User', 'Type', 'Role', 'Action'].map(h => (
                  <th key={h} style={{
                    padding: '11px 20px', textAlign: 'left',
                    fontSize: '11px', fontWeight: '700', color: '#9ca3af',
                    textTransform: 'uppercase', letterSpacing: '0.5px',
                    borderBottom: '1px solid #f3f4f6'
                  }}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={5} style={{
                    padding: '48px', textAlign: 'center',
                    color: '#9ca3af', fontSize: '14px'
                  }}>
                    No users found
                  </td>
                </tr>
              ) : filtered.map((user, idx) => {
                const av = getAvatarColor(user.email)
                const badge = typeBadge(user.type)
                const isEmployee = user.type === 'EMPLOYEE' || user.type === 'BUSINESS-OWNER'

                return (
                  <tr
                    key={user._id}
                    style={{ borderBottom: '1px solid #f9fafb', transition: 'background 0.15s' }}
                    onMouseEnter={e => e.currentTarget.style.background = '#fafafa'}
                    onMouseLeave={e => e.currentTarget.style.background = 'white'}
                  >
                    {/* # */}
                    <td style={{ padding: '14px 20px', fontSize: '13px', color: '#d1d5db', width: '48px' }}>
                      {idx + 1}
                    </td>

                    {/* User */}
                    <td style={{ padding: '14px 20px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <div style={{
                          width: '36px', height: '36px', borderRadius: '50%',
                          background: av.bg, color: av.color,
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          fontSize: '13px', fontWeight: '700', flexShrink: 0
                        }}>
                          {getInitials(user.email)}
                        </div>
                        <span style={{ fontSize: '14px', fontWeight: '500', color: '#111827' }}>
                          {user.email}
                        </span>
                      </div>
                    </td>

                    {/* Type badge */}
                    <td style={{ padding: '14px 20px' }}>
                      <span style={{
                        display: 'inline-block',
                        background: badge.bg, color: badge.color,
                        fontSize: '12px', fontWeight: '600',
                        padding: '4px 10px', borderRadius: '20px'
                      }}>
                        {badge.label}
                      </span>
                    </td>

                    {/* Role */}
                    <td style={{ padding: '14px 20px', fontSize: '14px', color: '#6b7280' }}>
                      {user.role?.name
                        ? <span style={{
                            background: '#eef2ff', color: '#4338ca',
                            fontSize: '12px', fontWeight: '600',
                            padding: '4px 10px', borderRadius: '20px'
                          }}>
                            {user.role.name}
                          </span>
                        : <span style={{ color: '#d1d5db', fontSize: '13px' }}>—</span>
                      }
                    </td>

                    {/* Action */}
                    <td style={{ padding: '14px 20px' }}>
                      {isEmployee ? (
                        <span style={{ fontSize: '12px', color: '#d1d5db' }}>—</span>
                      ) : (
                        <button
                          onClick={() => navigate('/dashboard/user/assign-role', { state: { userId: user._id, email: user.email } })}
                          style={{
                            display: 'inline-flex', alignItems: 'center', gap: '6px',
                            padding: '7px 14px', fontSize: '13px', fontWeight: '500',
                            background: '#111827', color: 'white',
                            border: 'none', borderRadius: '8px', cursor: 'pointer',
                            transition: 'opacity 0.2s'
                          }}
                          onMouseEnter={e => e.currentTarget.style.opacity = '0.8'}
                          onMouseLeave={e => e.currentTarget.style.opacity = '1'}
                        >
                          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                            <circle cx="5" cy="4" r="2.5" stroke="currentColor" strokeWidth="1.4"/>
                            <path d="M1 12c0-2.2 1.8-4 4-4s4 1.8 4 4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
                            <path d="M11 5v4M9 7h4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
                          </svg>
                          Assign Role 
                        </button>
                      )}
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

export default User; 