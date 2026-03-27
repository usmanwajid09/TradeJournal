import React from 'react';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import { Container } from 'react-bootstrap';
import { Outlet } from 'react-router-dom';

const MainLayout = () => {
    return (
        <div className="d-flex flex-column vh-100 overflow-hidden bg-deep">
            <Navbar />
            <div className="d-flex flex-grow-1 overflow-hidden">
                <div className="d-none d-lg-block">
                    <Sidebar />
                </div>
                <main className="flex-grow-1 overflow-auto p-4">
                    <Container fluid>
                        <Outlet />
                    </Container>
                </main>
            </div>
        </div>
    );
};

export default MainLayout;
