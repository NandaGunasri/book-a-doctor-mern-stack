import React from 'react';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import { Link } from 'react-router-dom';
import { Container, Button, Row, Col, Card } from 'react-bootstrap';

const Home = () => {
  return (
    <div className="landing-page">
      {/* Navigation */}
      <Navbar expand="lg" className="bg-white py-3 shadow-sm sticky-top">
        <Container>
          <Navbar.Brand className="brand-text">
            <Link to={'/'} className="nav-logo text-primary fw-bold fs-3 text-decoration-none">MediCareBook</Link>
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="navbarScroll" />
          <Navbar.Collapse id="navbarScroll">
            <Nav className="ms-auto flex-row align-items-center gap-3">
              <Link to={'/login'} className="btn btn-outline-primary px-4 py-2 border-2">Login</Link>
              <Link to={'/register'} className="btn btn-primary px-4 py-2">Register</Link>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      {/* Hero Section */}
      <div className="hero-section text-start py-5">
        <Container>
          <Row className="align-items-center g-5">
            <Col lg={6}>
              <div className="hero-content">
                <span className="badge bg-primary-subtle text-primary px-3 py-2 mb-3 fw-semibold">
                  Healthcare Scheduling Made Simple
                </span>
                <h1 className="display-4 fw-bold text-dark mb-4">
                  Effortlessly schedule your doctor appointments
                </h1>
                <p className="lead text-secondary mb-5">
                  Connect with trusted healthcare professionals in your area. Book consultations, manage schedules, and upload medical records securely—all in one place.
                </p>
                <div className="d-flex gap-3">
                  <Link to={'/login'} className="btn btn-primary btn-lg px-4 py-3 shadow btn-animate">
                    Book your Doctor
                  </Link>
                  <Link to={'/register'} className="btn btn-outline-secondary btn-lg px-4 py-3">
                    Create Free Account
                  </Link>
                </div>
              </div>
            </Col>
            <Col lg={6} className="d-none d-lg-block">
              <div className="hero-illustration-wrapper">
                <svg viewBox="0 0 500 500" width="100%" height="100%" fill="none">
                  {/* Clean Background Gradients */}
                  <defs>
                    <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#aa3bff" stopOpacity="0.1" />
                      <stop offset="100%" stopColor="#00c6ff" stopOpacity="0.2" />
                    </linearGradient>
                  </defs>
                  <rect width="500" height="500" rx="30" fill="url(#grad1)" />
                  {/* Medical Symbol Illustration */}
                  <circle cx="250" cy="250" r="140" fill="white" className="pulse-slow" />
                  <circle cx="250" cy="250" r="110" fill="#e0f2fe" />
                  <path d="M250 180 v140 M180 250 h140" stroke="#0ea5e9" strokeWidth="24" strokeLinecap="round" />
                  {/* Little Floating Health Stats Cards */}
                  <g transform="translate(60, 80)">
                    <rect width="140" height="60" rx="10" fill="white" filter="drop-shadow(0 4px 6px rgba(0,0,0,0.05))" />
                    <circle cx="25" cy="30" r="15" fill="#f0fdf4" />
                    <path d="M20 30 l4 4 l6-6" stroke="#22c55e" strokeWidth="2" strokeLinecap="round" />
                    <text x="50" y="28" fill="#1e293b" fontSize="11" fontWeight="bold">Verified Drs</text>
                    <text x="50" y="42" fill="#64748b" fontSize="10">99.8% Active</text>
                  </g>
                  <g transform="translate(300, 350)">
                    <rect width="140" height="60" rx="10" fill="white" filter="drop-shadow(0 4px 6px rgba(0,0,0,0.05))" />
                    <circle cx="25" cy="30" r="15" fill="#fdf2f8" />
                    <path d="M19 30 h12" stroke="#ec4899" strokeWidth="2" strokeLinecap="round" />
                    <text x="50" y="28" fill="#1e293b" fontSize="11" fontWeight="bold">Secure Files</text>
                    <text x="50" y="42" fill="#64748b" fontSize="10">256-bit Enc</text>
                  </g>
                </svg>
              </div>
            </Col>
          </Row>
        </Container>
      </div>

      {/* Features Section */}
      <div className="features-section py-5 bg-light">
        <Container>
          <div className="text-center max-width-600 mx-auto mb-5">
            <h2 className="fw-bold">Why Choose MediCareBook?</h2>
            <p className="text-muted">A comprehensive booking system designed for patients and medical staff.</p>
          </div>
          <Row className="g-4">
            <Col md={4}>
              <Card className="h-100 border-0 shadow-sm p-4 feature-card">
                <div className="feature-icon mb-3 bg-primary-subtle text-primary">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                    <line x1="16" y1="2" x2="16" y2="6" />
                    <line x1="8" y1="2" x2="8" y2="6" />
                    <line x1="3" y1="10" x2="21" y2="10" />
                  </svg>
                </div>
                <h5 className="fw-bold">Instant Scheduling</h5>
                <p className="text-muted">Book consultations in just a few clicks. Select convenient slots matching doctor availability instantly.</p>
              </Card>
            </Col>
            <Col md={4}>
              <Card className="h-100 border-0 shadow-sm p-4 feature-card">
                <div className="feature-icon mb-3 bg-success-subtle text-success">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                    <polyline points="7 10 12 15 17 10" />
                    <line x1="12" y1="15" x2="12" y2="3" />
                  </svg>
                </div>
                <h5 className="fw-bold">Secure Uploads</h5>
                <p className="text-muted">Upload medical records and test reports. Allow doctors to review your documents before your visit.</p>
              </Card>
            </Col>
            <Col md={4}>
              <Card className="h-100 border-0 shadow-sm p-4 feature-card">
                <div className="feature-icon mb-3 bg-danger-subtle text-danger">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9M13.73 21a2 2 0 0 1-3.46 0" />
                  </svg>
                </div>
                <h5 className="fw-bold">Realtime Notifications</h5>
                <p className="text-muted">Stay informed with live alerts when your appointment status changes or when registration is approved.</p>
              </Card>
            </Col>
          </Row>
        </Container>
      </div>

      {/* Footer */}
      <footer className="bg-dark text-white-50 py-4 border-top border-secondary">
        <Container>
          <Row className="align-items-center">
            <Col md={6} className="text-md-start mb-3 mb-md-0">
              <span className="text-white fw-semibold">MediCareBook</span>
              <p className="mb-0 small mt-1">&copy; {new Date().getFullYear()} MediCareBook. All rights reserved.</p>
            </Col>
            <Col md={6} className="text-md-end">
              <Link to={'/login'} className="text-white-50 text-decoration-none me-3 small">Terms</Link>
              <Link to={'/login'} className="text-white-50 text-decoration-none small">Privacy Policy</Link>
            </Col>
          </Row>
        </Container>
      </footer>
    </div>
  );
};

export default Home;