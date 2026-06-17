import React, { useState } from 'react';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import { message, Spin } from 'antd';
import { Button, Form, Card, Row, Col } from 'react-bootstrap';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';

const API = import.meta.env.VITE_API_URL;

const Login = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState({
    email: '',
    password: ''
  });

  const handleChange = (e) => {
    setUser({
      ...user,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user.email || !user.password) {
      return message.error('Please fill all fields');
    }

    setLoading(true);
    try {
      const res = await axios.post(
        `${API}/api/user/login`,
        user
      );

      setLoading(false);
      if (res.data.success) {
        localStorage.setItem('token', res.data.token);
        localStorage.setItem(
          'userData',
          JSON.stringify(res.data.userData)
        );

        message.success('Login successfully');

        const { type } = res.data.userData;

        switch (type) {
          case 'admin':
            navigate('/adminHome');
            break;
          case 'doctor':
            navigate('/doctorHome');
            break;
          default:
            navigate('/userhome');
            break;
        }
      } else {
        message.error(res.data.message || 'Login failed');
      }
    } catch (error) {
      setLoading(false);
      console.log(error);
      message.error(error.response?.data?.message || 'Login failed');
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
            <Link to={'/register'} className="nav-link-custom">Register</Link>
          </Nav>
        </Container>
      </Navbar>

      <Container className="d-flex align-items-center justify-content-center auth-container">
        <Card className="glass-card auth-card">
          <Row className="g-0 w-100 h-100">
            <Col md={5} className="d-none d-md-flex align-items-center justify-content-center auth-visual">
              <div className="visual-circle">
                <svg viewBox="0 0 24 24" width="120" height="120" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className="text-white pulse-animation">
                  <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
                </svg>
                <h3 className="visual-title mt-4 text-white">Welcome Back</h3>
                <p className="visual-text text-white-50 text-center px-4">Access your portal to book appointments or manage patient schedules.</p>
              </div>
            </Col>
            <Col md={7} className="d-flex align-items-center justify-content-center p-4 p-md-5">
              <div className="auth-form-wrapper w-100">
                <h2 className="auth-title mb-2">Sign in to your account</h2>
                <p className="auth-subtitle mb-4 text-muted">Enter your details to access your dashboard</p>
                
                <Form onSubmit={handleSubmit}>
                  <Form.Group className="mb-3" controlId="formBasicEmail">
                    <Form.Label className="form-label-custom">Email Address</Form.Label>
                    <Form.Control
                      type="email"
                      name="email"
                      placeholder="name@email.com"
                      value={user.email}
                      onChange={handleChange}
                      className="form-control-custom"
                      required
                    />
                  </Form.Group>

                  <Form.Group className="mb-4" controlId="formBasicPassword">
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

                  <Button variant="primary" type="submit" className="w-100 btn-submit btn-animate" disabled={loading}>
                    {loading ? <Spin size="small" /> : 'Sign In'}
                  </Button>
                </Form>

                <div className="text-center mt-4 auth-footer">
                  <p className="mb-0">
                    Don't have an account? <Link to="/register" className="auth-link">Register here</Link>
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

export default Login;