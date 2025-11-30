import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import CaseStudy from './pages/CaseStudy';

import { CursorProvider } from './context/CursorContext';
import CustomCursor from './components/CustomCursor';

import { AuthProvider } from './context/AuthContext';
import Login from './pages/Login';
import AdminDashboard from './pages/AdminDashboard';
import EditWork from './pages/EditWork';
import CaseStudyEditor from './pages/CaseStudyEditor';
import ProtectedRoute from './components/ProtectedRoute';
import { useLocation } from 'react-router-dom';

const AppContent = () => {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith('/admin');
  const isCaseStudyRoute = location.pathname.startsWith('/case-study/');

  return (
    <div className="app">
      {!isAdminRoute && !isCaseStudyRoute && <Navbar />}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/case-study/:id" element={<CaseStudy />} />

        {/* Admin Routes */}
        <Route path="/admin/login" element={<Login />} />
        <Route path="/admin" element={
          <ProtectedRoute>
            <AdminDashboard />
          </ProtectedRoute>
        } />
        <Route path="/admin/work/new" element={
          <ProtectedRoute>
            <EditWork />
          </ProtectedRoute>
        } />
        <Route path="/admin/work/:id" element={
          <ProtectedRoute>
            <EditWork />
          </ProtectedRoute>
        } />
        <Route path="/admin/work/:id/case-study" element={
          <ProtectedRoute>
            <CaseStudyEditor />
          </ProtectedRoute>
        } />
      </Routes>
    </div>
  );
};

function App() {
  return (
    <CursorProvider>
      <CustomCursor />
      <AuthProvider>
        <Router>
          <AppContent />
        </Router>
      </AuthProvider>
    </CursorProvider>
  );
}

export default App;
