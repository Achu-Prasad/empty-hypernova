import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import CaseStudy from './pages/CaseStudy';
import { useParams } from 'react-router-dom';
import ErrorBoundary from './components/ErrorBoundary';

const CaseStudyWrapper = () => {
  const { id } = useParams();
  return (
    <ErrorBoundary>
      <CaseStudy />
    </ErrorBoundary>
  );
};

import { CursorProvider } from './context/CursorContext';
import CustomCursor from './components/CustomCursor';

import { CMSProvider } from './context/CMSContext';
import AdminDashboard from './pages/AdminDashboard';
import Login from './pages/Login';

const App = () => {
  return (
    <CMSProvider>
      <CursorProvider>
        <Router>
          <div className="app">
            <CustomCursor />
            <Navbar />
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/case-study/:id" element={<CaseStudyWrapper />} />
              <Route path="/admin" element={<AdminDashboard />} />
              <Route path="/login" element={<Login />} />
            </Routes>
          </div>
        </Router>
      </CursorProvider>
    </CMSProvider>
  );
};

export default App;
