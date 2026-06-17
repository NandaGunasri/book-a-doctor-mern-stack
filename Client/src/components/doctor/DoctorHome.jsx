import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Table, Button, Badge, Container, Spinner, Alert } from 'react-bootstrap';
import { message } from 'antd';
import { useNavigate } from 'react-router-dom';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import LogoutIcon from '@mui/icons-material/Logout';

const API = import.meta.env.VITE_API_URL;

const DoctorHome = () => {
  const navigate = useNavigate();
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [doctorData, setDoctorData] = useState({});

  const getDoctorInfo = () => {
    const user = JSON.parse(localStorage.getItem('userData'));
    if (user) {
      setDoctorData(user);
    }
  };

  const getAppointments = async () => {
    try {
      const res = await axios.get(
        `${API}/api/doctor/getdoctorappointments`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );

      if (res.data.success) {
        setAppointments(res.data.data);
      }
      setLoading(false);
    } catch (error) {
      console.log(error);
      message.error('Failed to fetch doctor appointments');
      setLoading(false);
    }
  };

  useEffect(() => {
    getDoctorInfo();
    getAppointments();
  }, []);

  const handleStatusUpdate = async (appointmentId, status) => {
    try {
      const res = await axios.post(
        `${API}/api/doctor/handlestatus`,
        { appointmentId, status },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );

      if (res.data.success) {
        message.success(res.data.message || 'Status updated successfully');
        getAppointments(); // Refresh list
      } else {
        message.error(res.data.message || 'Failed to update status');
      }
    } catch (error) {
      console.log(error);
      message.error('Error updating status');
    }
  };

  const handleDownload = async (appointId, filename) => {
    try {
      const response = await axios({
        url: `${API}/api/doctor/getdocumentdownload?appointId=${appointId}`,
        method: 'GET',
        responseType: 'blob', // Important
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', filename || 'patient-document');
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.log(error);
      message.error('Error downloading document');
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  const getStatusBadgeVariant = (status) => {
    switch (status) {
      case 'approved':
        return 'success';
      case 'rejected':
        return 'danger';
      default:
        return 'warning';
    }
  };

  return (
    <div className="dashboard-layout">
      {/* Sidebar */}
      <div className="dashboard-sidebar bg-white shadow-sm">
        <div className="sidebar-header border-bottom py-4 px-3 text-start">
          <h4 className="m-0 fw-bold text-success">MediCareBook</h4>
          <span className="text-muted small">Doctor Dashboard</span>
        </div>

        <div className="sidebar-user-brief py-3 px-3 border-bottom d-flex align-items-center gap-2">
          <div className="user-avatar-small bg-success-subtle text-success fw-bold">
            {doctorData.fullName ? doctorData.fullName.charAt(0).toUpperCase() : 'D'}
          </div>
          <div className="text-start">
            <div className="fw-semibold text-dark text-truncate" style={{ maxWidth: '160px' }}>
              {doctorData.fullName || 'Doctor'}
            </div>
            <span className="text-muted small text-capitalize">Physician</span>
          </div>
        </div>

        <ul className="sidebar-menu list-unstyled p-2">
          <li>
            <button className="sidebar-menu-btn active">
              <CalendarMonthIcon className="menu-icon" />
              <span>Appointments</span>
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
            Appointments Queue
          </h5>
          <div className="d-flex align-items-center gap-3">
            <span className="badge bg-success">Doctor Access</span>
            <div className="header-divider"></div>
            <span className="fw-medium text-dark">{doctorData.fullName}</span>
          </div>
        </header>

        <main className="content-body">
          <Container className="py-4">
            <h3 className="mb-4 text-start font-heading fw-bold">All Appointments</h3>

            {loading ? (
              <div className="text-center py-5">
                <Spinner animation="border" variant="success" />
                <p className="mt-2 text-muted">Loading appointments list...</p>
              </div>
            ) : appointments.length > 0 ? (
              <div className="table-responsive rounded-3 shadow-sm border bg-white">
                <Table hover className="mb-0 align-middle">
                  <thead className="bg-light table-head-custom">
                    <tr>
                      <th className="py-3 px-4 text-secondary text-uppercase small">Patient Name</th>
                      <th className="py-3 px-4 text-secondary text-uppercase small">Phone</th>
                      <th className="py-3 px-4 text-secondary text-uppercase small">Appointment Date</th>
                      <th className="py-3 px-4 text-secondary text-uppercase small">Document</th>
                      <th className="py-3 px-4 text-secondary text-uppercase small">Status</th>
                      <th className="py-3 px-4 text-secondary text-uppercase small text-end">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {appointments.map((item) => (
                      <tr key={item._id} className="border-bottom">
                        <td className="py-3 px-4 fw-semibold text-dark">
                          {item.userInfo?.fullName || 'Patient'}
                        </td>
                        <td className="py-3 px-4 text-muted">
                          {item.userInfo?.phone || 'N/A'}
                        </td>
                        <td className="py-3 px-4 text-dark-emphasis">
                          {item.date}
                        </td>
                        <td className="py-3 px-4">
                          {item.document ? (
                            <button
                              onClick={() => handleDownload(item._id, item.document.name)}
                              className="btn btn-link p-0 text-decoration-none text-primary fw-medium text-start"
                            >
                              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="me-1 align-text-bottom">
                                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                                <polyline points="7 10 12 15 17 10" />
                                <line x1="12" y1="15" x2="12" y2="3" />
                              </svg>
                              {item.document.name || 'Download File'}
                            </button>
                          ) : (
                            <span className="text-muted small">No document</span>
                          )}
                        </td>
                        <td className="py-3 px-4">
                          <Badge bg={getStatusBadgeVariant(item.status)} className="px-3 py-2 text-capitalize">
                            {item.status}
                          </Badge>
                        </td>
                        <td className="py-3 px-4 text-end">
                          {item.status === 'pending' ? (
                            <div className="d-flex gap-2 justify-content-end">
                              <Button
                                size="sm"
                                variant="success"
                                onClick={() => handleStatusUpdate(item._id, 'approved')}
                              >
                                Approve
                              </Button>
                              <Button
                                size="sm"
                                variant="danger"
                                onClick={() => handleStatusUpdate(item._id, 'rejected')}
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
              <Alert variant="info" className="d-flex align-items-center gap-3 p-4">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10" />
                  <line x1="12" y1="16" x2="12" y2="12" />
                  <line x1="12" y1="8" x2="12.01" y2="8" />
                </svg>
                <div>
                  <span className="fw-semibold">No appointments found.</span> Check back later for patient bookings.
                </div>
              </Alert>
            )}
          </Container>
        </main>
      </div>
    </div>
  );
};

export default DoctorHome;
