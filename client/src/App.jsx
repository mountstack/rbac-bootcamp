import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import SignIn from './pages/auth/Signin'
import SignUp from './pages/auth/Signup'
import Dashboard from './pages/dashboard/Dashboard'

function PrivateRoute({ children }) {
  const token = localStorage.getItem('token'); 
  return token ? children : <Navigate to="/signin" />
} 

function App() {
  return (
    <BrowserRouter> 
      <Routes> 
        <Route path="/" element={<Home />} /> 
        <Route path="/signin" element={<SignIn />} /> 
        <Route path="/signup" element={<SignUp />} /> 
        <Route 
          path="/dashboard/*" 
          element={
            <PrivateRoute>
              <Dashboard /> 
            </PrivateRoute>
          } 
        /> 
      </Routes>
    </BrowserRouter>
  )
}

export default App; 