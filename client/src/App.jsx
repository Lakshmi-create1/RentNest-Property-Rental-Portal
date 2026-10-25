import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

// Layouts
import PublicLayout from './layouts/PublicLayout';
import DashboardLayout from './layouts/DashboardLayout';

// Route Guards
import ProtectedRoute from './routes/ProtectedRoute';
import RoleBasedRoute from './routes/RoleBasedRoute';

// Public Pages
import HomePage from './pages/public/HomePage';
import BrowsePropertiesPage from './pages/public/BrowsePropertiesPage';
import PropertyDetailsPage from './pages/public/PropertyDetailsPage';
import LoginPage from './pages/public/LoginPage';
import RegisterPage from './pages/public/RegisterPage';
import AboutPage from './pages/public/AboutPage';
import ContactPage from './pages/public/ContactPage';

// Tenant Pages
import TenantDashboard from './pages/tenant/TenantDashboard';
import MyFavoritesPage from './pages/tenant/MyFavoritesPage';
import MyInquiriesPage from './pages/tenant/MyInquiriesPage';

// Owner Pages
import OwnerDashboard from './pages/owner/OwnerDashboard';
import AddPropertyPage from './pages/owner/AddPropertyPage';
import MyPropertiesPage from './pages/owner/MyPropertiesPage';
import EditPropertyPage from './pages/owner/EditPropertyPage';
import ManageInquiriesPage from './pages/owner/ManageInquiriesPage';

// Admin Pages
import AdminDashboard from './pages/admin/AdminDashboard';
import ManageUsersPage from './pages/admin/ManageUsersPage';
import ManagePropertiesPage from './pages/admin/ManagePropertiesPage';
import ReportedPropertiesPage from './pages/admin/ReportedPropertiesPage';
import ContactMessagesPage from './pages/admin/ContactMessagesPage';

function App() {
  return (
    <Routes>
      {/* Public Pages with PublicLayout */}
      <Route element={<PublicLayout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/properties" element={<BrowsePropertiesPage />} />
        <Route path="/properties/:id" element={<PropertyDetailsPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/contact" element={<ContactPage />} />
      </Route>

      {/* Tenant Protected Pages */}
      <Route
        path="/tenant"
        element={
          <RoleBasedRoute allowedRoles={['tenant']}>
            <DashboardLayout />
          </RoleBasedRoute>
        }
      >
        <Route index element={<Navigate to="/tenant/dashboard" replace />} />
        <Route path="dashboard" element={<TenantDashboard />} />
        <Route path="favorites" element={<MyFavoritesPage />} />
        <Route path="inquiries" element={<MyInquiriesPage />} />
      </Route>

      {/* Owner Protected Pages */}
      <Route
        path="/owner"
        element={
          <RoleBasedRoute allowedRoles={['owner']}>
            <DashboardLayout />
          </RoleBasedRoute>
        }
      >
        <Route index element={<Navigate to="/owner/dashboard" replace />} />
        <Route path="dashboard" element={<OwnerDashboard />} />
        <Route path="add-property" element={<AddPropertyPage />} />
        <Route path="properties" element={<MyPropertiesPage />} />
        <Route path="edit-property/:id" element={<EditPropertyPage />} />
        <Route path="inquiries" element={<ManageInquiriesPage />} />
      </Route>

      {/* Admin Protected Pages */}
      <Route
        path="/admin"
        element={
          <RoleBasedRoute allowedRoles={['admin']}>
            <DashboardLayout />
          </RoleBasedRoute>
        }
      >
        <Route index element={<Navigate to="/admin/dashboard" replace />} />
        <Route path="dashboard" element={<AdminDashboard />} />
        <Route path="users" element={<ManageUsersPage />} />
        <Route path="properties" element={<ManagePropertiesPage />} />
        <Route path="reports" element={<ReportedPropertiesPage />} />
        <Route path="messages" element={<ContactMessagesPage />} />
      </Route>

      {/* 404 Fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;
