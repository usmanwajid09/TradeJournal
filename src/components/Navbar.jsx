import React from 'react';
import { Navbar as BsNavbar, Container, Nav, Dropdown } from 'react-bootstrap';
import { User, LogOut, Settings } from 'lucide-react';
import { Link } from 'react-router-dom';

const Navbar = () => {
    return (
        <BsNavbar expand="lg" className="border-bottom border-subtle-custom py-2 sticky-top" style={{ backgroundColor: 'var(--bg-sidebar)', color: 'var(--text-primary)' }}>
            <Container fluid>
                <BsNavbar.Brand as={Link} to="/dashboard" className="fw-bold text-accent">
                    TradeJournal
                </BsNavbar.Brand>
                <BsNavbar.Toggle aria-controls="basic-navbar-nav" className="bg-light" />
                <BsNavbar.Collapse id="basic-navbar-nav" className="justify-content-end">
                    <Nav className="align-items-center">
                        <Dropdown align="end">
                            <Dropdown.Toggle variant="transparent" id="dropdown-user" className="d-flex align-items-center gap-2 border-0 text-white">
                                <div className="profile-avatar" style={{ width: '32px', height: '32px', fontSize: '12px' }}>JD</div>
                                <span className="d-none d-md-inline fw-medium">John Doe</span>
                            </Dropdown.Toggle>
                            <Dropdown.Menu className="bg-dark-card border-subtle-custom shadow-lg">
                                <Dropdown.Item as={Link} to="/profile" className="text-white hover-bg-light">
                                    <Settings size={16} className="me-2" /> Profile
                                </Dropdown.Item>
                                <Dropdown.Divider className="bg-secondary" />
                                <Dropdown.Item as={Link} to="/login" className="text-danger hover-bg-light">
                                    <LogOut size={16} className="me-2" /> Logout
                                </Dropdown.Item>
                            </Dropdown.Menu>
                        </Dropdown>
                    </Nav>
                </BsNavbar.Collapse>
            </Container>
        </BsNavbar>
    );
};

export default Navbar;
