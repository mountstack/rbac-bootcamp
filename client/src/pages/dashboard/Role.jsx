import { useState, useEffect } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'

function Role() {
  const navigate = useNavigate()
  const [roleName, setRoleName] = useState('')
  const [permissions, setPermissions] = useState([])
  const [selectedPermissions, setSelectedPermissions] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    fetchPermissions()
  }, [])

  const fetchPermissions = async () => {
    try {
      const token = localStorage.getItem('token')
      const response = await axios.get('http://localhost:8000/api/permission', {
        headers: { 'Authorization': `Bearer ${token}` }
      })
      setPermissions(response.data.permissions)
    } catch (error) {
      console.error('Error fetching permissions:', error)
      setError('Failed to load permissions')
    }
  }

  const handlePermissionToggle = (permissionId) => {
    setSelectedPermissions(prev => {
      if (prev.includes(permissionId)) {
        return prev.filter(id => id !== permissionId)
      } else {
        return [...prev, permissionId]
      }
    })
  }

  const handleSelectAll = (modulePermissions) => {
    const modulePermissionIds = modulePermissions.map(p => p._id)
    const allSelected = modulePermissionIds.every(id => selectedPermissions.includes(id))

    if (allSelected) {
      setSelectedPermissions(prev => prev.filter(id => !modulePermissionIds.includes(id)))
    } else {
      setSelectedPermissions(prev => [...new Set([...prev, ...modulePermissionIds])])
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!roleName.trim()) {
      setError('Role name is required')
      return
    }

    if (selectedPermissions.length === 0) {
      setError('Role must have at least one permission')
      return
    }

    setLoading(true)
    setError('')

    try {
      const token = localStorage.getItem('token')
      const response = await axios.post('http://localhost:8000/api/role', {
        name: roleName,
        permissions: selectedPermissions
      }, {
        headers: { 'Authorization': `Bearer ${token}` }
      })

      alert('Role created successfully!')
      navigate('/dashboard/role')
    } catch (error) {
      console.error('Error creating role:', error)
      setError(error.response?.data?.message || 'Failed to create role')
    } finally {
      setLoading(false)
    }
  }

  // Group permissions by module 
  const groupedPermissions = permissions?.reduce((acc, permission) => {
    if (!acc[permission.module]) {
      acc[permission.module] = []
    }
    acc[permission.module].push(permission)
    return acc
  }, {})

  const styles = {
    container: {
      padding: '20px',
      maxWidth: '1200px',
      margin: '0 auto'
    },
    header: {
      marginBottom: '30px'
    },
    breadcrumb: {
      color: '#666',
      fontSize: '14px',
      marginBottom: '10px'
    },
    title: {
      fontSize: '28px',
      color: '#333',
      margin: 0
    },
    card: {
      background: 'white',
      borderRadius: '10px',
      padding: '25px',
      boxShadow: '0 2px 5px rgba(0,0,0,0.1)'
    },
    sectionTitle: {
      fontSize: '18px',
      fontWeight: '600',
      color: '#333',
      marginBottom: '20px',
      paddingBottom: '10px',
      borderBottom: '2px solid #f0f0f0'
    },
    formGroup: {
      marginBottom: '25px'
    },
    label: {
      display: 'block',
      fontSize: '14px',
      fontWeight: '600',
      color: '#555',
      marginBottom: '8px'
    },
    input: {
      width: '100%',
      padding: '10px 15px',
      border: '1px solid #ddd',
      borderRadius: '5px',
      fontSize: '14px',
      outline: 'none'
    },
    table: {
      width: '100%',
      borderCollapse: 'collapse',
      marginTop: '15px'
    },
    th: {
      padding: '12px',
      textAlign: 'left',
      background: '#f8f9fa',
      borderBottom: '2px solid #dee2e6',
      fontWeight: '600',
      fontSize: '14px'
    },
    td: {
      padding: '10px 12px',
      borderBottom: '1px solid #eee',
      fontSize: '14px'
    },
    moduleRow: {
      background: '#f8f9fa',
      fontWeight: '600'
    },
    checkbox: {
      width: '18px',
      height: '18px',
      cursor: 'pointer'
    },
    selectAllBtn: {
      background: 'none',
      border: 'none',
      color: '#3498db',
      cursor: 'pointer',
      fontSize: '12px',
      marginLeft: '10px'
    },
    error: {
      background: '#fee',
      color: '#e74c3c',
      padding: '10px',
      borderRadius: '5px',
      marginBottom: '20px',
      fontSize: '14px'
    },
    buttonGroup: {
      display: 'flex',
      gap: '15px',
      marginTop: '30px',
      paddingTop: '20px',
      borderTop: '1px solid #eee'
    },
    cancelBtn: {
      padding: '10px 25px',
      background: '#ecf0f1',
      border: 'none',
      borderRadius: '5px',
      cursor: 'pointer',
      fontSize: '14px'
    },
    createBtn: {
      padding: '10px 25px',
      background: '#3498db',
      color: 'white',
      border: 'none',
      borderRadius: '5px',
      cursor: 'pointer',
      fontSize: '14px'
    },
    roleList: {
      padding: '10px 25px',
      background: '#3a5aa9',
      color: 'white',
      border: 'none',
      borderRadius: '5px',
      cursor: 'pointer',
      fontSize: '14px'
    },
    createBtnDisabled: {
      background: '#95a5a6',
      cursor: 'not-allowed'
    }
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

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <div style={styles.breadcrumb}>Dashboard / Roles / Create Role</div>
        <h1 style={styles.title}>Create Role</h1>
      </div>

      <div style={styles.card}>
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between',  
          alignItems: 'center'  
        }}> 
          <h3 style={styles.sectionTitle}>Role Details</h3> 
          <button 
            style={{...styles.roleList}} 
            onClick={() => navigate('/dashboard/role/list')}
          > 
            Role List 
          </button> 
        </div> 

        {error && <div style={styles.error}>{error}</div>}

        <div style={styles.formGroup}>
          <label style={styles.label}>ROLE NAME</label>
          <input
            type="text"
            value={roleName}
            onChange={(e) => setRoleName(e.target.value)}
            placeholder="Enter role name"
            style={{ ...styles.input, width: '300px' }}
          />
        </div>

        <h3 style={styles.sectionTitle}>PERMISSIONS</h3>

        <table style={styles.table}>
          <thead>
            <tr>
              <th style={styles.th}>MODULE</th>
              <th style={styles.th}>MANAGE</th>
              <th style={styles.th}>VIEW</th>
              <th style={styles.th}>CREATE</th>
              <th style={styles.th}>EDIT</th>
              <th style={styles.th}>DELETE</th>
            </tr>
          </thead>
          <tbody>
            {Object.keys(groupedPermissions).map(module => {
              const modulePermissions = groupedPermissions[module]
              const allSelected = modulePermissions.every(p => selectedPermissions.includes(p._id))

              // Find permission by label for this module
              const getPermission = (label) => modulePermissions.find(p => p.label === label)

              const renderCheckbox = (label) => {
                const permission = getPermission(label)
                if (!permission) return <td style={styles.td}>—</td>
                return (
                  <td style={styles.td}>
                    <input
                      type="checkbox"
                      checked={selectedPermissions.includes(permission._id)}
                      onChange={() => handlePermissionToggle(permission._id)}
                      style={styles.checkbox}
                    />
                  </td>
                )
              }

              return (
                <tr key={module}>
                  <td style={styles.td}>
                    <strong>{moduleLabels[module] || module}</strong>
                    <button
                      style={styles.selectAllBtn}
                      onClick={() => handleSelectAll(modulePermissions)}
                    >
                      {allSelected ? 'Deselect All' : 'Select All'}
                    </button>
                  </td>
                  {renderCheckbox('Manage')}
                  {renderCheckbox('View')}
                  {renderCheckbox('Create')}
                  {renderCheckbox('Edit')}
                  {renderCheckbox('Delete')}
                </tr>
              )
            })}
          </tbody>
        </table>

        <div style={styles.buttonGroup}>
          <button
            style={styles.cancelBtn}
            onClick={() => navigate('/dashboard')}
          >
            Cancel
          </button>
          <button
            style={{
              ...styles.createBtn,
              ...(loading ? styles.createBtnDisabled : {})
            }}
            onClick={handleSubmit}
            disabled={loading}
          >
            {loading ? 'Creating...' : 'Create Role'}
          </button>
        </div>
      </div>
    </div>
  )
}

export default Role; 