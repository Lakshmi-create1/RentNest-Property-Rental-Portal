import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import DashboardSidebar from '../components/DashboardSidebar';

const DashboardLayout = () => {
  return (
    <>
      <Navbar />
      <div className="dashboard-container">
        <DashboardSidebar />
        <main className="dashboard-main">
          <Outlet />
        </main>
      </div>
      <Footer />
    </>
  );
};

export default DashboardLayout;
