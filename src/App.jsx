import React,{ useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

// Main entry file for a Next.js or Vite app that uses the NetworkDiagram component
import ReactDOM from 'react-dom';
// import NetworkDiagram from './NetworkDiagram'; // Import the NetworkDiagram component
import './index.css';

const SplashPage = () => {
  return (
    <div className="splash-container">
      <h1>Welcome to Network Diagram Builder</h1>
      <p>Easily create and visualize your network infrastructure.</p>
      <button onClick={() => window.location.href = '/app'}>Get Started</button>
    </div>
  );
};

const LandingPage = () => {
  return (
    <div className="landing-container">
      <header className="landing-header">
        <h1>Network Diagram Builder</h1>
        <p>Design, visualize, and export your network diagrams with ease.</p>
        <button onClick={() => window.location.href = '/app'}>Start Building</button>
      </header>
      <section className="features">
        <div className="feature">
          <h2>Interactive Diagramming</h2>
          <p>Use our intuitive drag-and-drop interface to build your network diagrams effortlessly.</p>
        </div>
        <div className="feature">
          <h2>Customizable Nodes & Edges</h2>
          <p>Add, edit, and connect nodes with customizable properties to suit your needs.</p>
        </div>
        <div className="feature">
          <h2>Export Your Work</h2>
          <p>Easily export your network diagrams as images to share with your team.</p>
        </div>
      </section>
    </div>
  );
};

 
function App() {
  const isSplash = window.location.pathname === '/';

  return (
    <>
      <div className="app-container">
      {isSplash ? <SplashPage /> : <LandingPage />}
    </div>
    </>
  )
}

export default App
