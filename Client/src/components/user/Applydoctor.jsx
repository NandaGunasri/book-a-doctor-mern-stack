import React, { useState } from 'react';
import { Col, Form, Input, Row, TimePicker, message } from 'antd';
import { Container, Button, Card } from 'react-bootstrap';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const API = import.meta.env.VITE_API_URL;

function ApplyDoctor({ userId }) {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [doctor, setDoctor] = useState({
    fullName: '',
    email: '',
    phone: '',
    address: '',
    specialization: '',
    experience: '',
    fees: '',
    timings: null,
  });

  const handleTimingChange = (time, timeString) => {
    // timeString is an array of two strings: [start, end]
    setDoctor({ ...doctor, timings: timeString });
  };

  const handleChange = (e) => {
    setDoctor({
      ...doctor,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async () => {
    if (
      !doctor.fullName ||
      !doctor.email ||
      !doctor.phone ||
      !doctor.address ||
      !doctor.specialization ||
      !doctor.experience ||
      !doctor.fees ||
      !doctor.timings
    ) {
      return message.error('Please fill in all personal and professional details');
    }

    setLoading(true);
    try {
      const res = await axios.post(
        `${API}/api/user/registerdoc`,
        { doctor, userId: userId },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );

      setLoading(false);
      if (res.data.success) {
        message.success(res.data.message || 'Doctor application submitted successfully');
        // Clear form or navigate
        navigate('/userhome');
      } else {
        message.error(res.data.message || 'Failed to submit application');
      }
    } catch (error) {
      setLoading(false);
      console.log(error);
      message.error('Something went wrong');
    }
  };

  return (
    <Container className="py-4">
      <Card className="glass-card shadow-sm border-0 p-4 p-md-5">
        <h2 className="mb-4 text-center font-heading fw-bold">Apply for Doctor Account</h2>
        <p className="text-muted text-center mb-5">
          Submit your professional credentials to join our healthcare network and start accepting appointments.
        </p>

        <Form layout="vertical" onFinish={handleSubmit}>
          <h4 className="section-title mb-4 pb-2 border-bottom text-primary fw-semibold text-start">
            Personal Details
          </h4>
          <Row gutter={24}>
            <Col xs={24} md={12}>
              <Form.Item label="Full Name" required>
                <Input
                  name="fullName"
                  placeholder="Dr. John Doe"
                  value={doctor.fullName}
                  onChange={handleChange}
                  className="antd-input-custom"
                />
              </Form.Item>
            </Col>
            <Col xs={24} md={12}>
              <Form.Item label="Contact Email" required>
                <Input
                  type="email"
                  name="email"
                  placeholder="doctor@example.com"
                  value={doctor.email}
                  onChange={handleChange}
                  className="antd-input-custom"
                />
              </Form.Item>
            </Col>
            <Col xs={24} md={12}>
              <Form.Item label="Phone Number" required>
                <Input
                  name="phone"
                  placeholder="1234567890"
                  value={doctor.phone}
                  onChange={handleChange}
                  className="antd-input-custom"
                />
              </Form.Item>
            </Col>
            <Col xs={24} md={12}>
              <Form.Item label="Clinic Address" required>
                <Input
                  name="address"
                  placeholder="123 Health Ave, Clinic Block A"
                  value={doctor.address}
                  onChange={handleChange}
                  className="antd-input-custom"
                />
              </Form.Item>
            </Col>
          </Row>

          <h4 className="section-title mt-4 mb-4 pb-2 border-bottom text-primary fw-semibold text-start">
            Professional Details
          </h4>
          <Row gutter={24}>
            <Col xs={24} md={12}>
              <Form.Item label="Specialization" required>
                <Input
                  name="specialization"
                  placeholder="e.g. Cardiology, Pediatrics"
                  value={doctor.specialization}
                  onChange={handleChange}
                  className="antd-input-custom"
                />
              </Form.Item>
            </Col>
            <Col xs={24} md={12}>
              <Form.Item label="Years of Experience" required>
                <Input
                  name="experience"
                  placeholder="e.g. 5, 10"
                  value={doctor.experience}
                  onChange={handleChange}
                  className="antd-input-custom"
                />
              </Form.Item>
            </Col>
            <Col xs={24} md={12}>
              <Form.Item label="Consultation Fees ($)" required>
                <Input
                  type="number"
                  name="fees"
                  placeholder="e.g. 150"
                  value={doctor.fees}
                  onChange={handleChange}
                  className="antd-input-custom"
                />
              </Form.Item>
            </Col>
            <Col xs={24} md={12}>
              <Form.Item label="Work Timings" required>
                <TimePicker.RangePicker
                  format="HH:mm"
                  onChange={handleTimingChange}
                  className="w-100 antd-input-custom"
                />
              </Form.Item>
            </Col>
          </Row>

          <div className="d-flex justify-content-end mt-4 gap-3">
            <Button variant="light" type="button" onClick={() => navigate('/userhome')} className="px-4">
              Cancel
            </Button>
            <Button variant="primary" type="submit" disabled={loading} className="px-5">
              {loading ? 'Submitting...' : 'Submit Application'}
            </Button>
          </div>
        </Form>
      </Card>
    </Container>
  );
}

export default ApplyDoctor;