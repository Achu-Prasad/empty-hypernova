import React from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Experience from './components/Experience';

function App() {
  return (
    <div className="app">
      <Navbar />
      <main>
        <Hero />
        <Experience />
      </main>
    </div>
  );
}

export default App;
