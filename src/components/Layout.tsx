import { Outlet, Link } from 'react-router-dom';
import { Search, Info } from 'lucide-react';

const DisclaimerBar = () => (
  <div className="disclaimer-bar">
    ⚕ Medical Disclaimer: For informational purposes only. Always consult a healthcare professional.
  </div>
);

const Navbar = () => {
  return (
    <nav className="navbar">
      <div className="nav-content">
        <Link to="/" className="logo">
          MediFinder <span>AI</span>
        </Link>
        
        <div className="nav-links">
          <Link to="/" className="nav-pill">
            <Search size={16} /> Search
          </Link>
          <Link to="/about" className="nav-pill">
            <Info size={16} /> About
          </Link>
        </div>
      </div>
    </nav>
  );
};

const Footer = () => (
  <>
    <footer className="footer">
      <div className="container">
        <div className="footer-grid">
          <div>
            <Link to="/" className="footer-logo">
              MediFinder <span>AI</span>
            </Link>
            <p className="text-secondary" style={{ color: '#A0A09A' }}>
              Advanced AI-powered medicine search engine providing detailed pharmaceutical information instantly.
            </p>
          </div>
          <div>
            <h4 style={{ color: 'white', marginBottom: '20px' }}>Legal</h4>
            <ul className="footer-links">
              <li><Link to="/privacy-policy">Privacy Policy</Link></li>
              <li><Link to="/terms">Terms & Conditions</Link></li>
            </ul>
          </div>
          <div>
            <h4 style={{ color: 'white', marginBottom: '20px' }}>Navigation</h4>
            <ul className="footer-links">
              <li><Link to="/">Home Search</Link></li>
              <li><Link to="/about">About Us</Link></li>
            </ul>
          </div>
        </div>
        <div className="footer-bottom">
          <p>© {new Date().getFullYear()} MediFinder AI. All rights reserved.</p>
          <p>Powered by Claude AI</p>
        </div>
      </div>
    </footer>
    <DisclaimerBar />
  </>
);

export const Layout = () => {
  return (
    <>
      <DisclaimerBar />
      <Navbar />
      <main>
        <Outlet />
      </main>
      <Footer />
    </>
  );
};
