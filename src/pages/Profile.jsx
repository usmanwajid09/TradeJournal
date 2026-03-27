import React from 'react';
import { Card, Row, Col, Form, Button, Image } from 'react-bootstrap';
import { User, Mail, Shield, Bell } from 'lucide-react';

const Profile = () => {
    return (
        <div>
            <h2 className="page-title mb-4 text-white">Account Profile</h2>
            
            <Row className="g-4">
                <Col lg={4}>
                    <div className="auth-card shadow-lg text-center p-4 border-subtle-custom mb-4">
                        <div className="mb-4">
                            <div className="profile-avatar mx-auto shadow-lg" style={{ width: '100px', height: '100px', fontSize: '32px' }}>JD</div>
                        </div>
                        <h4 className="fw-bold mb-1 text-white">John Doe</h4>
                        <p className="text-secondary-custom small mb-4">Professional Trader</p>
                        <Button variant="secondary" size="sm" className="px-4 rounded-pill btn-secondary border-subtle-custom text-white">
                            Change Avatar
                        </Button>
                    </div>

                    <div className="auth-card shadow-lg p-3 border-subtle-custom">
                        <h6 className="fw-bold mb-3 d-flex align-items-center gap-2 text-white">
                            <Shield size={18} className="text-accent" /> Account Security
                        </h6>
                        <div className="d-grid gap-2">
                            <Button variant="secondary" className="btn btn-secondary text-start border-subtle-custom text-white small">Change Security Key</Button>
                            <Button variant="secondary" className="btn btn-secondary text-start border-subtle-custom text-white small">Manage 2FA</Button>
                        </div>
                    </div>
                </Col>

                <Col lg={8}>
                    <div className="auth-card shadow-lg p-4 border-subtle-custom">
                        <h5 className="fw-bold mb-4 text-white">Personal Information</h5>
                        <Form>
                            <Row className="g-4 mb-4">
                                <Col md={6}>
                                    <Form.Group controlId="firstName">
                                        <Form.Label className="form-label text-secondary-custom">First Name</Form.Label>
                                        <Form.Control defaultValue="John" className="form-input" />
                                    </Form.Group>
                                </Col>
                                <Col md={6}>
                                    <Form.Group controlId="lastName">
                                        <Form.Label className="form-label text-secondary-custom">Last Name</Form.Label>
                                        <Form.Control defaultValue="Doe" className="form-input" />
                                    </Form.Group>
                                </Col>
                            </Row>

                            <Form.Group className="mb-4" controlId="email">
                                <Form.Label className="form-label text-secondary-custom">Email Address</Form.Label>
                                <Form.Control type="email" defaultValue="john.doe@example.com" className="form-input" />
                            </Form.Group>

                            <Form.Group className="mb-5" controlId="bio">
                                <Form.Label className="form-label text-secondary-custom">Journaling Style / Bio</Form.Label>
                                <Form.Control as="textarea" rows={3} defaultValue="Price Action trader specializing in Forex and Crypto. Focus on supply and demand zones." className="form-input" />
                            </Form.Group>

                            <div className="d-flex justify-content-end pt-3 border-top border-subtle-custom">
                                <Button variant="primary" className="btn btn-primary px-5 py-2 fw-bold shadow-lg">
                                    Update Settings
                                </Button>
                            </div>
                        </Form>
                    </div>

                    <div className="auth-card shadow-lg mt-4 p-4 border-subtle-custom">
                        <h5 className="fw-bold mb-4 d-flex align-items-center gap-2 text-white">
                            <Bell size={20} className="text-accent" /> Journal Alerts
                        </h5>
                        <Form.Check 
                            type="switch"
                            id="email-notifications"
                            label="Email alerts for weekly summaries"
                            defaultChecked
                            className="mb-3 text-secondary-custom"
                        />
                        <Form.Check 
                            type="switch"
                            id="weekly-report"
                            label="System notifications for trade entry"
                            defaultChecked
                            className="text-secondary-custom"
                        />
                    </div>
                </Col>
            </Row>
        </div>
    );
};

export default Profile;
