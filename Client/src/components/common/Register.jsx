import React, { useState } from 'react';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import { message, Spin } from 'antd';
import { Button, Form, Card, Row, Col } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

const API = import.meta.env.VITE_API_URL;

const Register = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState({
    fullName: '',
    email: '',
    password: '',
    phone: '',
    type: 'user', // Default to normal user
  });

  const handleChange = (e) => {
    setUser({
      ...user,
      [e.target.name]: e.target.value,
    });
  };

  const handleRoleChange = (role) => {
    setUser({
      ...user,
      type: role,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!user.fullName || !user.email || !user.password || !user.phone || !user.type) {
      return message.error('All fields are required');
    }

    setLoading(true);
    try {
      const res = await axios.post(
        `${API}/api/user/register`,
        user
      );

      setLoading(false);
      if (res.data.success) {
        message.success('Registered Successfully');
        navigate('/login');
      } else {
        message.error(res.data.message || 'Registration failed');
      }
    } catch (error) {
      setLoading(false);
      console.log(error);
      message.error(error.response?.data?.message || 'Something went wrong');
    }
  };

  return (
    <div className="auth-page">
      <Navbar expand="lg" className="bg-body-transparent custom-navbar">
        <Container fluid>
          <Navbar.Brand className="brand-text">
            <Link to={'/'} className="nav-logo">MediCareBook</Link>
          </Navbar.Brand>
          <Nav className="ms-auto flex-row gap-3">
            <Link to={'/'} className="nav-link-custom">Home</Link>
            <Link to={'/login'} className="nav-link-custom">Login</Link>
          </Nav>
        </Container>
      </Navbar>

      <Container className="d-flex align-items-center justify-content-center auth-container">
        <Card className="glass-card auth-card register-card">
          <Row className="g-0 w-100 h-100">
            <Col md={5} className="d-none d-md-flex align-items-center justify-content-center auth-visual register-visual">
              <div className="visual-circle">
                <svg viewBox="0 0 24 24" width="120" height="120" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className="text-white float-animation">
                  <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                  <circle cx="8.5" cy="7" r="4" />
                  <line x1="20" y1="8" x2="20" y2="14" />
                  <line x1="23" y1="11" x2="17" y2="11" />
                </svg>
                <h3 className="visual-title mt-4 text-white">Join Us</h3>
                <p className="visual-text text-white-50 text-center px-4">Create your account to consult with qualified doctors or manage your practice.</p>
              </div>
            </Col>
            <Col md={7} className="d-flex align-items-center justify-content-center p-4 p-md-5">
              <div className="auth-form-wrapper w-100">
                <h2 className="auth-title mb-2">Create an account</h2>
                <p className="auth-subtitle mb-4 text-muted">Register to start booking appointments</p>
                
                <Form onSubmit={handleSubmit}>
                  <Form.Group className="mb-3">
                    <Form.Label className="form-label-custom">Full Name</Form.Label>
                    <Form.Control
                      type="text"
                      name="fullName"
                      placeholder="John Doe"
                      value={user.fullName}
                      onChange={handleChange}
                      className="form-control-custom"
                      required
                    />
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label className="form-label-custom">Email Address</Form.Label>
                    <Form.Control
                      type="email"
                      name="email"
                      placeholder="john@example.com"
                      value={user.email}
                      onChange={handleChange}
                      className="form-control-custom"
                      required
                    />
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label className="form-label-custom">Password</Form.Label>
                    <Form.Control
                      type="password"
                      name="password"
                      placeholder="••••••••"
                      value={user.password}
                      onChange={handleChange}
                      className="form-control-custom"
                      required
                    />
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label className="form-label-custom">Phone Number</Form.Label>
                    <Form.Control
                      type="text"
                      name="phone"
                      placeholder="1234567890"
                      value={user.phone}
                      onChange={handleChange}
                      className="form-control-custom"
                      required
                    />
                  </Form.Group>

                  <Form.Group className="mb-4">
                    <Form.Label className="form-label-custom d-block">Register As</Form.Label>
                    <div className="d-flex gap-3">
                      <Button
                        type="button"
                        variant={user.type === 'user' ? 'primary' : 'outline-primary'}
                        onClick={() => handleRoleChange('user')}
                        className="flex-grow-1 py-2"
                      >
                        User
                      </Button>
                      <Button
                        type="button"
                        variant={user.type === 'admin' ? 'primary' : 'outline-primary'}
                        onClick={() => handleRoleChange('admin')}
                        className="flex-grow-1 py-2"
                      >
                        Admin
                      </Button>
                    </div>
                  </Form.Group>

                  <Button variant="primary" type="submit" className="w-100 btn-submit btn-animate" disabled={loading}>
                    {loading ? <Spin size="small" /> : 'Register'}
                  </Button>
                </Form>

                <div className="text-center mt-4 auth-footer">
                  <p className="mb-0">
                    Already have an account? <Link to="/login" className="auth-link">Login here</Link>
                  </p>
                </div>
              </div>
            </Col>
          </Row>
        </Card>
      </Container>
    </div>
  );
};

export default Register;