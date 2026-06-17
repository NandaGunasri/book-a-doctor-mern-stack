import React, { useEffect, useState } from 'react';
import { Badge } from 'antd';
import Notification from '../common/Notification';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import MedicationIcon from '@mui/icons-material/Medication';
import LogoutIcon from '@mui/icons-material/Logout';
import NotificationsIcon from '@mui/icons-material/Notifications';
import HomeIcon from '@mui/icons-material/Home';
import { Container, Row, Col } from 'react-bootstrap';

import ApplyDoctor from './Applydoctor';
import UserAppointments from './UserAppointments';
import DoctorList from './DoctorList';

const API = import.meta.env.VITE_API_URL;

const UserHome = () => {
  const navigate = useNavigate();
  const [doctors, setDoctors] = useState([]);
  const [userdata, setUserData] = useState({});
  const [activeMenuItem, setActiveMenuItem] = useState('home'); // Default to home doctors list

  const getUser = () => {
    const user = JSON.parse(localStorage.getItem('userData'));
    if (user) {
      setUserData(user);
    }
  };

  const getUserData = async () => {
    try {
      const res = await axios.post(
        `${API}/api/user/getuserdata`,
        {},
        {
          headers: {
            Authorization: 'Bearer ' + localStorage.getItem('token'),
          },
        }
      );
      if (res.data.success) {
        localStorage.setItem('userData', JSON.stringify(res.data.data));
        setUserData(res.data.data);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const getDoctorData = async () => {
    try {
      const res = await axios.get(
        `${API}/api/user/getalldoctorsu`,
        {
          headers: {
            Authorization: 'Bearer ' + localStorage.getItem('token'),
          },
        }
      );

      if (res.data.success) {
        setDoctors(res.data.data);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getUser();
    getUserData();
    getDoctorData();
  }, []);

  // Sync state whenever active tab changes to refresh data
  useEffect(() => {
    getUserData();
    if (activeMenuItem === 'home') {
      getDoctorData();
    }
  }, [activeMenuItem]);

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  const renderContent = () => {
    switch (activeMenuItem) {
      case 'appointments':
        return <UserAppointments />;
      case 'apply':
        return <ApplyDoctor userId={userdata._id} />;
      case 'notifications':
        return <Notification />;
      case 'home':
      default:
        return (
          <Container className="py-4">
            <h3 className="mb-4 text-start font-heading fw-bold">Available Doctors</h3>
            {doctors.length > 0 ? (
              <Row className="g-4">
                {doctors.map((doctor) => (
                  <Col key={doctor._id} xs={12} sm={6} lg={4}>
                    <DoctorList
                      userDoctorId={userdata._id}
                      doctor={doctor}
                      userdata={userdata}
                    />
                  </Col>
                ))}
              </Row>
            ) : (
              <div className="text-center py-5 text-muted shadow-sm border rounded bg-white mt-3">
                <svg width="60" height="60" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="mb-3 opacity-50">
                  <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
                </svg>
                <h4>No Doctors Available</h4>
                <p>We are currently updating our medical roster. Please check back later.</p>
              </div>
            )}
          </Container>
        );
    }
  };

  const unreadCount = userdata.notification?.length || 0;

  return (
    <div className="dashboard-layout">
      {/* Sidebar */}
      <div className="dashboard-sidebar bg-white shadow-sm">
        <div className="sidebar-header border-bottom py-4 px-3 text-start">
          <h4 className="m-0 fw-bold text-primary">Book A Doctor</h4>
          <span className="text-muted small">Patient Portal</span>
        </div>

        <div className="sidebar-user-brief py-3 px-3 border-bottom d-flex align-items-center gap-2">
          <div className="user-avatar-small bg-primary-subtle text-primary fw-bold">
            {userdata.fullName ? userdata.fullName.charAt(0).toUpperCase() : 'U'}
          </div>
          <div className="text-start">
            <div className="fw-semibold text-dark text-truncate" style={{ maxWidth: '160px' }}>
              {userdata.fullName || 'User'}
            </div>
            <span className="text-muted small text-capitalize">Patient</span>
          </div>
        </div>

        <ul className="sidebar-menu list-unstyled p-2">
          <li>
            <button
              onClick={() => setActiveMenuItem('home')}
              className={`sidebar-menu-btn ${activeMenuItem === 'home' ? 'active' : ''}`}
            >
              <HomeIcon className="menu-icon" />
              <span>Doctors</span>
            </button>
          </li>
          <li>
            <button
              onClick={() => setActiveMenuItem('appointments')}
              className={`sidebar-menu-btn ${activeMenuItem === 'appointments' ? 'active' : ''}`}
            >
              <CalendarMonthIcon className="menu-icon" />
              <span>Appointments</span>
            </button>
          </li>
          <li>
            <button
              onClick={() => setActiveMenuItem('apply')}
              className={`sidebar-menu-btn ${activeMenuItem === 'apply' ? 'active' : ''}`}
            >
              <MedicationIcon className="menu-icon" />
              <span>Apply Doctor</span>
            </button>
          </li>
          <li>
            <button
              onClick={() => setActiveMenuItem('notifications')}
              className={`sidebar-menu-btn ${activeMenuItem === 'notifications' ? 'active' : ''}`}
            >
              <Badge count={unreadCount} size="small" offset={[10, 0]}>
                <NotificationsIcon className="menu-icon" />
              </Badge>
              <span>Notifications</span>
            </button>
          </li>
          <li className="mt-5 border-top pt-2">
            <button
              onClick={handleLogout}
              className="sidebar-menu-btn text-danger hover-bg-danger-subtle"
            >
              <LogoutIcon className="menu-icon" />
              <span>Logout</span>
            </button>
          </li>
        </ul>
      </div>

      {/* Main Content Area */}
      <div className="dashboard-content bg-light">
        <header className="content-header bg-white shadow-sm border-bottom d-flex justify-content-between align-items-center py-3 px-4">
          <h5 className="m-0 fw-semibold text-capitalize text-secondary">
            {activeMenuItem === 'home' ? 'Find Doctors' : activeMenuItem}
          </h5>
          <div className="d-flex align-items-center gap-3">
            <button
              onClick={() => setActiveMenuItem('notifications')}
              className="btn btn-link text-dark-emphasis position-relative p-0 border-0"
            >
              <Badge count={unreadCount} size="small">
                <NotificationsIcon />
              </Badge>
            </button>
            <div className="header-divider"></div>
            <span className="fw-medium text-dark">{userdata.fullName}</span>
          </div>
        </header>

        <main className="content-body">
          {renderContent()}
        </main>
      </div>
    </div>
  );
};

export default UserHome;