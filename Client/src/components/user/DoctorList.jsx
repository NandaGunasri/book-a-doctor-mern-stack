import { message } from 'antd';
import axios from 'axios';
import React, { useState } from 'react';
import { Form, Row, Col } from 'react-bootstrap';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import Modal from 'react-bootstrap/Modal';

const API = import.meta.env.VITE_API_URL;

const DoctorList = ({ userDoctorId, doctor, userdata }) => {
  const [dateTime, setDateTime] = useState('');
  const [documentFile, setDocumentFile] = useState(null);
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);

  const currentDate = new Date().toISOString().slice(0, 16);

  const handleClose = () => {
    setShow(false);
    setDateTime('');
    setDocumentFile(null);
  };
  const handleShow = () => setShow(true);

  const handleChange = (event) => {
    setDateTime(event.target.value);
  };

  const handleDocumentChange = (event) => {
    setDocumentFile(event.target.files[0]);
  };

  const handleBook = async (e) => {
    e.preventDefault();

    if (!dateTime) {
      return message.error('Please select an appointment date and time');
    }

    setLoading(true);
    try {
      const formattedDateTime = dateTime.replace('T', ' ');
      const formData = new FormData();

      if (documentFile) {
        formData.append('image', documentFile);
      }
      formData.append('date', formattedDateTime);
      formData.append('userId', userDoctorId);
      formData.append('doctorId', doctor._id);
      formData.append('userInfo', JSON.stringify(userdata));
      formData.append('doctorInfo', JSON.stringify(doctor));

      const res = await axios.post(
        `${API}/api/user/getappointment`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );

      setLoading(false);
      if (res.data.success) {
        message.success('Appointment booked successfully!');
        handleClose();
      } else {
        message.error(res.data.message || 'Failed to book appointment');
      }
    } catch (error) {
      setLoading(false);
      console.log(error);
      message.error('Something went wrong during booking');
    }
  };

  // Safe timing parsing
  const formatTimings = (timings) => {
    if (Array.isArray(timings)) {
      return `${timings[0]} - ${timings[1]}`;
    }
    if (typeof timings === 'object' && timings !== null) {
      return `${timings.start || ''} - ${timings.end || ''}`;
    }
    return timings || 'Not specified';
  };

  return (
    <>
      <Card className="doctor-card-view h-100 shadow-sm border-0">
        <Card.Body className="d-flex flex-column p-4 text-start">
          <div className="d-flex align-items-center gap-3 mb-3">
            <div className="doctor-avatar">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-primary">
                <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
              </svg>
            </div>
            <div>
              <Card.Title className="mb-0 fw-bold text-dark">{doctor.fullName}</Card.Title>
              <Card.Subtitle className="text-primary small fw-semibold mt-1">{doctor.specialization}</Card.Subtitle>
            </div>
          </div>

          <div className="doctor-info-grid mb-4 flex-grow-1">
            <div className="info-row">
              <span className="info-label text-muted">Address:</span>
              <span className="info-value text-dark">{doctor.address}</span>
            </div>
            <div className="info-row">
              <span className="info-label text-muted">Phone:</span>
              <span className="info-value text-dark">{doctor.phone}</span>
            </div>
            <div className="info-row">
              <span className="info-label text-muted">Experience:</span>
              <span className="info-value text-dark">{doctor.experience} Yrs</span>
            </div>
            <div className="info-row">
              <span className="info-label text-muted">Consultation Fee:</span>
              <span className="info-value fw-semibold text-success">${doctor.fees}</span>
            </div>
            <div className="info-row">
              <span className="info-label text-muted">Timings:</span>
              <span className="info-value text-dark">{formatTimings(doctor.timings)}</span>
            </div>
          </div>

          <Button variant="primary" onClick={handleShow} className="w-100 py-2 btn-animate mt-auto">
            Book Now
          </Button>
        </Card.Body>
      </Card>

      <Modal show={show} onHide={handleClose} centered className="booking-modal">
        <Modal.Header closeButton className="border-0 pb-0">
          <Modal.Title className="fw-bold">Book Appointment</Modal.Title>
        </Modal.Header>
        <Modal.Body className="pt-3">
          <div className="doctor-brief-card d-flex align-items-center gap-3 p-3 bg-light rounded mb-4">
            <div className="doctor-brief-avatar">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-primary">
                <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
              </svg>
            </div>
            <div className="text-start">
              <h5 className="mb-0 fw-semibold">{doctor.fullName}</h5>
              <p className="text-primary small mb-0">{doctor.specialization}</p>
              <span className="small text-muted">Fee: ${doctor.fees} | {formatTimings(doctor.timings)}</span>
            </div>
          </div>

          <Form onSubmit={handleBook}>
            <Form.Group className="mb-3 text-start">
              <Form.Label className="fw-medium text-dark small">Appointment Date and Time</Form.Label>
              <Form.Control
                type="datetime-local"
                min={currentDate}
                value={dateTime}
                onChange={handleChange}
                className="form-control-custom"
                required
              />
            </Form.Group>

            <Form.Group className="mb-4 text-start">
              <Form.Label className="fw-medium text-dark small">Upload Medical Documents (Optional)</Form.Label>
              <Form.Control
                type="file"
                onChange={handleDocumentChange}
                className="form-control-custom"
                accept=".pdf,.png,.jpg,.jpeg"
              />
              <Form.Text className="text-muted">
                PDF, PNG, JPG up to 5MB.
              </Form.Text>
            </Form.Group>

            <div className="d-flex justify-content-end gap-2 border-top pt-3">
              <Button variant="light" onClick={handleClose} disabled={loading}>
                Close
              </Button>
              <Button variant="primary" type="submit" disabled={loading} className="btn-animate">
                {loading ? 'Booking...' : 'Book'}
              </Button>
            </div>
          </Form>
        </Modal.Body>
      </Modal>
    </>
  );
};

export default DoctorList;