import { useState } from 'react'
import { useNavigate, Routes, Route, useLocation } from 'react-router-dom'
import User from './User';
import Role from './Role';
import RoleList from './RoleList';
import AssignRole from './AssignRole';

function Dashboard() {
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    localStorage.removeItem('refreshToken');
    navigate('/signin')
  }

  const user = JSON.parse(localStorage.getItem('user'));
  const permissionModule = [];

  if (user.type !== 'BUSINESS-OWNER') {
    const { permissions } = user?.role;
    for (let i = 0; i < permissions.length; i++) {
      if (!permissionModule.includes(permissions[i]?.module)) {
        permissionModule.push(permissions[i]?.module);
      }
    }
  }

  const menuItems = [
    { id: 'home', module: '', name: 'Home', icon: '🏠', path: '/dashboard' },
    { id: 'user', module: 'user', name: 'User', icon: '👥', path: '/dashboard/user' },
    { id: 'product', module: 'product', name: 'Product', icon: '📦', path: '/dashboard/product' },
    { id: 'category', module: 'category', name: 'Category', icon: '📁', path: '/dashboard/category' },
    { id: 'order', module: 'order', name: 'Order', icon: '🛒', path: '/dashboard/order' },
    { id: 'review', module: 'review', name: 'Review', icon: '⭐', path: '/dashboard/review' },
    { id: 'role', module: 'role', name: 'Role', icon: '🔑', path: '/dashboard/role' },
    { id: 'company_setting', module: 'company_setting', name: 'Company Setting', icon: '🏢', path: '/dashboard/company-setting' }
  ];

  const styles = {
    dashboard: {
      display: 'flex',
      minHeight: '100vh',
      fontFamily: 'Arial, sans-serif'
    },
    sidebar: {
      width: '250px',
      background: '#2c3e50',
      color: 'white',
      display: 'flex',
      flexDirection: 'column'
    },
    logo: {
      padding: '20px',
      fontSize: '20px',
      fontWeight: 'bold',
      borderBottom: '1px solid #34495e'
    },
    menuItem: {
      padding: '15px 20px',
      display: 'flex',
      alignItems: 'center',
      gap: '10px',
      cursor: 'pointer',
      transition: 'background 0.3s'
    },
    logoutBtn: {
      marginTop: 'auto',
      margin: '20px',
      padding: '10px',
      background: '#e74c3c',
      color: 'white',
      border: 'none',
      cursor: 'pointer',
      borderRadius: '5px'
    },
    content: {
      flex: 1,
      background: '#ecf0f1',
      padding: '20px'
    },
    contentTitle: {
      fontSize: '24px',
      color: '#333',
      marginBottom: '20px'
    },
    emptyContent: {
      background: 'white',
      padding: '40px',
      textAlign: 'center',
      borderRadius: '10px',
      color: '#999'
    }
  }

  return (
    <div style={styles.dashboard}>
      {/* Left Menu */}
      <div style={styles.sidebar}>
        <div style={styles.logo}>
          Dashboard
        </div>

        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            height: '100%'
          }}
        >
          <div>
            {menuItems.map(item => {
              if (user.type === 'EMPLOYEE') {
                if (!permissionModule.includes(item.module)) {
                  return null;
                }
              }

              return (
                <div
                  key={item.id}
                  style={{
                    ...styles.menuItem,
                    background: location.pathname === item.path ? '#34495e' : 'transparent'
                  }}
                  onClick={() => navigate(item.path)}
                >
                  <span>{item.icon}</span>
                  <span>{item.name}</span>
                </div>
              )
            })}
          </div>

          <button
            style={{ ...styles.logoutBtn, fontSize: '16px', width: '85%', marginBlock: '30px' }}
            onClick={handleLogout}>
            Logout
          </button>
        </div>
      </div> 

      {/* Right Content */}
      <div style={styles.content}>
        <Routes>
          <Route path="" element={
            <>
              <h2 style={styles.contentTitle}>Welcome to Dashboard</h2>
              <div style={styles.emptyContent}>
                Hello {user?.email}! Welcome back.
              </div>
            </> 
          } /> 

          <Route path="user" element={<User />} /> 
          <Route path="user/assign-role" element={<AssignRole />} /> 

          <Route path="product" element={
            <div style={styles.emptyContent}>Product Page - Coming Soon</div>
          } />
          <Route path="category" element={
            <div style={styles.emptyContent}>Category Page - Coming Soon</div>
          } />
          <Route path="order" element={
            <div style={styles.emptyContent}>Order Page - Coming Soon</div>
          } />
          <Route path="review" element={
            <div style={styles.emptyContent}>Review Page - Coming Soon</div>
          } />
          <Route path="role" element={<Role />} />
          <Route path="role/list" element={<RoleList />} /> 

          <Route path="company-setting" element={
            <div style={styles.emptyContent}>Company Setting Page - Coming Soon</div>
          } />
        </Routes>
      </div>
    </div>
  )
}

export default Dashboard; 





// 1. User list
// 2. Assign EMPLOYEE type to user
// 3. Assign Role to EMPLOYEE
// 4. Create Role & Assign Permissions 








