import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import CaseStudy from './pages/CaseStudy';

import { CursorProvider } from './context/CursorContext';
import CustomCursor from './components/CustomCursor';

function App() {
  return (
    <CursorProvider>
      <CustomCursor />
      <Router>
        <div className="app">
          <Navbar />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/case-study/:id" element={<CaseStudy />} />
          </Routes>
        </div>
      </Router>
    </CursorProvider>
  );
}

export default App;
