import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Table, Button, Badge, Container, Row, Col, Card, Alert, Spinner } from 'react-bootstrap';
import { message } from 'antd';
import { useNavigate } from 'react-router-dom';
import PeopleIcon from '@mui/icons-material/People';
import LocalHospitalIcon from '@mui/icons-material/LocalHospital';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import LogoutIcon from '@mui/icons-material/Logout';
import AdminAppointments from '../../pages/AdminAppointment';

const API = import.meta.env.VITE_API_URL;

const AdminHome = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('users');
  const [users, setUsers] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [adminData, setAdminData] = useState({});

  const getAdminInfo = () => {
    const user = JSON.parse(localStorage.getItem('userData'));
    if (user) {
      setAdminData(user);
    }
  };

  const getAllUsers = async () => {
    try {
      const res = await axios.get(`${API}/api/admin/getallusers`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      if (res.data.success) {
        setUsers(res.data.data);
      }
    } catch (error) {
      console.log(error);
      message.error('Error fetching users');
    }
  };

  const getAllDoctors = async () => {
    try {
      const res = await axios.get(`${API}/api/admin/getalldoctors`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      if (res.data.success) {
        setDoctors(res.data.data);
      }
    } catch (error) {
      console.log(error);
      message.error('Error fetching doctors');
    }
  };

  const handleFetchAll = async () => {
    setLoading(true);
    await Promise.all([getAllUsers(), getAllDoctors()]);
    setLoading(false);
  };

  useEffect(() => {
    getAdminInfo();
    handleFetchAll();
  }, []);

  useEffect(() => {
    handleFetchAll();
  }, [activeTab]);

  const handleStatusChange = async (doctor, status) => {
    try {
      const endpoint = status === 'approved' ? 'getapprove' : 'getreject';
      const res = await axios.post(
        `${API}/api/admin/${endpoint}`,
        {
          doctorId: doctor._id,
          status: status,
          userid: doctor.userId,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );

      if (res.data.success) {
        message.success(res.data.message);
        getAllDoctors(); // refresh list
      } else {
        message.error(res.data.message);
      }
    } catch (error) {
      console.log(error);
      message.error('Error updating doctor status');
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  const getDocStatusBadge = (status) => {
    switch (status) {
      case 'approved':
        return 'success';
      case 'rejected':
        return 'danger';
      default:
        return 'warning';
    }
  };

  const renderContent = () => {
    if (loading) {
      return (
        <Container className="text-center py-5">
          <Spinner animation="border" variant="primary" />
          <p className="mt-2 text-muted">Loading data...</p>
        </Container>
      );
    }

    switch (activeTab) {
      case 'doctors':
        return (
          <Container className="py-4">
            <h3 className="mb-4 text-start font-heading fw-bold">All Doctors & Applications</h3>
            {doctors.length > 0 ? (
              <div className="table-responsive rounded-3 shadow-sm border bg-white">
                <Table hover className="mb-0 align-middle">
                  <thead className="bg-light table-head-custom">
                    <tr>
                      <th className="py-3 px-4 text-secondary text-uppercase small">Doctor Name</th>
                      <th className="py-3 px-4 text-secondary text-uppercase small">Specialization</th>
                      <th className="py-3 px-4 text-secondary text-uppercase small">Experience</th>
                      <th className="py-3 px-4 text-secondary text-uppercase small">Fees</th>
                      <th className="py-3 px-4 text-secondary text-uppercase small">Status</th>
                      <th className="py-3 px-4 text-secondary text-uppercase small text-end">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {doctors.map((doc) => (
                      <tr key={doc._id} className="border-bottom">
                        <td className="py-3 px-4 fw-semibold text-dark">
                          {doc.fullName}
                          <div className="text-muted small">{doc.email} | {doc.phone}</div>
                        </td>
                        <td className="py-3 px-4 text-dark-emphasis">{doc.specialization}</td>
                        <td className="py-3 px-4 text-muted">{doc.experience} Yrs</td>
                        <td className="py-3 px-4 fw-medium text-success">${doc.fees}</td>
                        <td className="py-3 px-4">
                          <Badge bg={getDocStatusBadge(doc.status)} className="px-3 py-2 text-capitalize">
                            {doc.status}
                          </Badge>
                        </td>
                        <td className="py-3 px-4 text-end">
                          {doc.status === 'pending' ? (
                            <div className="d-flex gap-2 justify-content-end">
                              <Button
                                size="sm"
                                variant="success"
                                onClick={() => handleStatusChange(doc, 'approved')}
                              >
                                Approve
                              </Button>
                              <Button
                                size="sm"
                                variant="danger"
                                onClick={() => handleStatusChange(doc, 'rejected')}
                              >
                                Reject
                              </Button>
                            </div>
                          ) : (
                            <span className="text-muted small">Processed</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </div>
            ) : (
              <Alert variant="info">No doctor registrations or applications found.</Alert>
            )}
          </Container>
        );

      case 'appointments':
        return <AdminAppointments />;

      case 'users':
      default:
        return (
          <Container className="py-4">
            <h3 className="mb-4 text-start font-heading fw-bold">All Registered Users</h3>
            {users.length > 0 ? (
              <div className="table-responsive rounded-3 shadow-sm border bg-white">
                <Table hover className="mb-0 align-middle">
                  <thead className="bg-light table-head-custom">
                    <tr>
                      <th className="py-3 px-4 text-secondary text-uppercase small">Name</th>
                      <th className="py-3 px-4 text-secondary text-uppercase small">Email</th>
                      <th className="py-3 px-4 text-secondary text-uppercase small">Phone</th>
                      <th className="py-3 px-4 text-secondary text-uppercase small">Account Type</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map((item) => (
                      <tr key={item._id} className="border-bottom">
                        <td className="py-3 px-4 fw-semibold text-dark">{item.fullName}</td>
                        <td className="py-3 px-4 text-dark-emphasis">{item.email}</td>
                        <td className="py-3 px-4 text-muted">{item.phone}</td>
                        <td className="py-3 px-4">
                          {item.isAdmin ? (
                            <Badge bg="danger" className="px-2 py-1">Admin</Badge>
                          ) : item.isDoctor ? (
                            <Badge bg="success" className="px-2 py-1">Doctor</Badge>
                          ) : (
                            <Badge bg="primary" className="px-2 py-1">User</Badge>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </div>
            ) : (
              <Alert variant="info">No users registered.</Alert>
            )}
          </Container>
        );
    }
  };

  return (
    <div className="dashboard-layout">
      {/* Sidebar */}
      <div className="dashboard-sidebar bg-white shadow-sm">
        <div className="sidebar-header border-bottom py-4 px-3 text-start">
          <h4 className="m-0 fw-bold text-danger">MediCareBook</h4>
          <span className="text-muted small">Admin Dashboard</span>
        </div>

        <div className="sidebar-user-brief py-3 px-3 border-bottom d-flex align-items-center gap-2">
          <div className="user-avatar-small bg-danger-subtle text-danger fw-bold">
            {adminData.fullName ? adminData.fullName.charAt(0).toUpperCase() : 'A'}
          </div>
          <div className="text-start">
            <div className="fw-semibold text-dark text-truncate" style={{ maxWidth: '160px' }}>
              {adminData.fullName || 'Admin'}
            </div>
            <span className="text-muted small">System Admin</span>
          </div>
        </div>

        <ul className="sidebar-menu list-unstyled p-2">
          <li>
            <button
              onClick={() => setActiveTab('users')}
              className={`sidebar-menu-btn ${activeTab === 'users' ? 'active' : ''}`}
            >
              <PeopleIcon className="menu-icon" />
              <span>All Users</span>
            </button>
          </li>
          <li>
            <button
              onClick={() => setActiveTab('doctors')}
              className={`sidebar-menu-btn ${activeTab === 'doctors' ? 'active' : ''}`}
            >
              <LocalHospitalIcon className="menu-icon" />
              <span>All Doctors</span>
            </button>
          </li>
          <li>
            <button
              onClick={() => setActiveTab('appointments')}
              className={`sidebar-menu-btn ${activeTab === 'appointments' ? 'active' : ''}`}
            >
              <CalendarMonthIcon className="menu-icon" />
              <span>All Bookings</span>
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

      {/* Main Content */}
      <div className="dashboard-content bg-light">
        <header className="content-header bg-white shadow-sm border-bottom d-flex justify-content-between align-items-center py-3 px-4">
          <h5 className="m-0 fw-semibold text-capitalize text-secondary">
            {activeTab === 'users' ? 'Registered Users' : activeTab === 'doctors' ? 'Doctors Control' : 'All Bookings'}
          </h5>
          <div className="d-flex align-items-center gap-3">
            <span className="badge bg-danger">Admin Access</span>
            <div className="header-divider"></div>
            <span className="fw-medium text-dark">{adminData.fullName}</span>
          </div>
        </header>

        <main className="content-body">
          {renderContent()}
        </main>
      </div>
    </div>
  );
};

export default AdminHome;
