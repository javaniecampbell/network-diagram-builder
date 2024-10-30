import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

// Main entry file for a Next.js or Vite app that uses the NetworkDiagram component
// import ReactDOM from 'react-dom';
import NetworkDiagram from './NetworkDiagram'; // Import the NetworkDiagram component
import './index.css';

const SplashPage = ({ navigateToLanding }) => {
  return (
    <div className="splash-container">
      <h1>Welcome to Network Diagram Builder</h1>
      <p>Easily create and visualize your network infrastructure.</p>
      <button onClick={navigateToLanding}>Get Started</button>
    </div>
  );
};

const LandingPage = ({ navigateToBuilder }) => {
  return (
    <div className="landing-container">
      <header className="landing-header">
        <h1>Network Diagram Builder</h1>
        <p>Design, visualize, and export your network diagrams with ease.</p>
        <button onClick={navigateToBuilder}>Start Building</button>
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
  const [currentPage, setCurrentPage] = useState('splash');

  const navigateToLanding = () => {
    setCurrentPage('landing');
  };

  const navigateToBuilder = () => {
    setCurrentPage('builder');
  };

  return (
    <>
        <div className="app-container">
      {currentPage === 'splash' && <SplashPage navigateToLanding={navigateToLanding} />}
      {currentPage === 'landing' && <LandingPage navigateToBuilder={navigateToBuilder} />}
      {currentPage === 'builder' && <NetworkDiagram />}
    </div>
    </>
  )
}

export default App
