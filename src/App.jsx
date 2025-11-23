import React from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Perspective from './components/Perspective';
import Experience from './components/Experience';

import { CursorProvider } from './context/CursorContext';
import CustomCursor from './components/CustomCursor';

function App() {
  return (
    <CursorProvider>
      <CustomCursor />
      <div className="app">
        <Navbar />
        <main>
          <Hero />
          <Perspective />
          <Experience />
        </main>
      </div>
    </CursorProvider>
  );
}

export default App;
