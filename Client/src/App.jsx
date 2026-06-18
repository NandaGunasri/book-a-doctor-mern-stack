import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Home from './components/common/Home';
import Login from './components/common/Login';
import Register from './components/common/Register';
import UserHome from './components/user/UserHome';
import AdminHome from './components/admin/AdminHome';
import DoctorHome from './components/doctor/DoctorHome';
import './App.css';

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  if (!token) {
    return <Navigate to="/login" />;
  }
  return children;
};

// Admin Route Wrapper - Route protection for Admin dashboard
const AdminRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  if (!token) {
    return <Navigate to="/login" />;
  }
  try {
    const userData = JSON.parse(localStorage.getItem('userData'));
    if (userData?.type === 'admin') {
      return children;
    }
    return <Navigate to={userData?.type === 'doctor' ? '/doctorHome' : '/userhome'} />;
  } catch (e) {
    localStorage.clear();
    return <Navigate to="/login" />;
  }
};

// Doctor Route Wrapper
const DoctorRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  if (!token) {
    return <Navigate to="/login" />;
  }
  try {
    const userData = JSON.parse(localStorage.getItem('userData'));
    if (userData?.type === 'doctor') {
      return children;
    }
    return <Navigate to={userData?.type === 'admin' ? '/adminHome' : '/userhome'} />;
  } catch (e) {
    localStorage.clear();
    return <Navigate to="/login" />;
  }
};

// Patient Route Wrapper
const PatientRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  if (!token) {
    return <Navigate to="/login" />;
  }
  try {
    const userData = JSON.parse(localStorage.getItem('userData'));
    if (userData?.type === 'user') {
      return children;
    }
    return <Navigate to={userData?.type === 'admin' ? '/adminHome' : '/doctorHome'} />;
  } catch (e) {
    localStorage.clear();
    return <Navigate to="/login" />;
  }
};

// Public Route Component (prevents logged in users from visiting login/register)
const PublicRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  if (token) {
    try {
      const userData = JSON.parse(localStorage.getItem('userData'));
      if (userData?.type === 'admin') {
        return <Navigate to="/adminHome" />;
      } else if (userData?.type === 'doctor') {
        return <Navigate to="/doctorHome" />;
      } else {
        return <Navigate to="/userhome" />;
      }
    } catch (e) {
      localStorage.clear();
      return <Navigate to="/login" />;
    }
  }
  return children;
};

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
        <Route path="/register" element={<PublicRoute><Register /></PublicRoute>} />
        <Route path="/userhome" element={<PatientRoute><UserHome /></PatientRoute>} />
        <Route path="/adminHome" element={<AdminRoute><AdminHome /></AdminRoute>} />
        <Route path="/doctorHome" element={<DoctorRoute><DoctorHome /></DoctorRoute>} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
}

export default App;
