import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Table, Badge, Alert, Container, Spinner } from 'react-bootstrap';
import { message } from 'antd';

const API = import.meta.env.VITE_API_URL;

const UserAppointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  const getAppointments = async () => {
    try {
      const res = await axios.get(
        `${API}/api/user/getuserappointments`,
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
      message.error('Failed to fetch appointments');
      setLoading(false);
    }
  };

  useEffect(() => {
    getAppointments();
  }, []);

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

      // Create a temporary link to download the file
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', filename || 'medical-document');
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.log(error);
      message.error('Error downloading document');
    }
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

  if (loading) {
    return (
      <Container className="text-center py-5">
        <Spinner animation="border" variant="primary" />
        <p className="mt-2 text-muted">Loading your appointments...</p>
      </Container>
    );
  }

  return (
    <Container className="py-4">
      <h3 className="mb-4 text-start font-heading fw-bold">My Appointments</h3>
      {appointments.length > 0 ? (
        <div className="table-responsive rounded-3 shadow-sm border">
          <Table hover className="mb-0 align-middle">
            <thead className="bg-light table-head-custom">
              <tr>
                <th className="py-3 px-4 text-secondary text-uppercase small">Doctor Name</th>
                <th className="py-3 px-4 text-secondary text-uppercase small">Specialization</th>
                <th className="py-3 px-4 text-secondary text-uppercase small">Appointment Date</th>
                <th className="py-3 px-4 text-secondary text-uppercase small">Uploaded Document</th>
                <th className="py-3 px-4 text-secondary text-uppercase small">Status</th>
              </tr>
            </thead>
            <tbody>
              {appointments.map((item) => (
                <tr key={item._id} className="border-bottom">
                  <td className="py-3 px-4 fw-semibold text-dark">
                    {item.doctorInfo?.fullName || 'Doctor'}
                  </td>
                  <td className="py-3 px-4 text-muted">
                    {item.doctorInfo?.specialization || 'General'}
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
                        {item.document.name || 'Download Document'}
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
            <span className="fw-semibold">No appointments found.</span> Book an appointment from the Doctors tab.
          </div>
        </Alert>
      )}
    </Container>
  );
};

export default UserAppointments;
