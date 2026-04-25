import { useState } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { Search, Settings, Info, Menu, X } from 'lucide-react';

const DisclaimerBanner = ({ isFooter = false }) => (
  <div className={`disclaimer-banner ${isFooter ? 'disclaimer-footer' : ''}`}>
    <strong>Medical Disclaimer:</strong> For informational purposes only. Consult a qualified healthcare professional before taking any medication.
  </div>
);

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();

  const toggleMenu = () => setMenuOpen(!menuOpen);
  const closeMenu = () => setMenuOpen(false);

  const navLinks = [
    { path: '/', label: 'Search', icon: <Search size={18} /> },
    { path: '/about', label: 'About', icon: <Info size={18} /> },
    { path: '/settings', label: 'Settings', icon: <Settings size={18} /> },
  ];

  return (
    <nav className="navbar">
      <DisclaimerBanner />
      <div className="container nav-container">
        <Link to="/" className="nav-brand" onClick={closeMenu}>
          <span className="text-gradient">MediFinder</span> AI
        </Link>
        
        <button className="mobile-menu-btn text-main" onClick={toggleMenu}>
          {menuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>

        <div className={`nav-links ${menuOpen ? 'open' : ''}`}>
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className={`nav-link ${location.pathname === link.path ? 'active' : ''}`}
              onClick={closeMenu}
            >
              {link.icon}
              {link.label}
            </Link>
          ))}
        </div>
      </div>
    </nav>
  );
};

const Footer = () => (
  <footer className="footer">
    <div className="container">
      <div className="footer-grid">
        <div>
          <h3 className="footer-title"><span className="text-gradient">MediFinder</span> AI</h3>
          <p className="footer-text">
            Advanced AI-powered medicine search engine providing detailed pharmaceutical information instantly.
          </p>
        </div>
        <div>
          <h4 className="mb-4" style={{ fontFamily: 'var(--font-display)' }}>Legal</h4>
          <ul className="footer-links">
            <li><Link to="/privacy-policy" className="footer-link">Privacy Policy</Link></li>
            <li><Link to="/terms" className="footer-link">Terms & Conditions</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="mb-4" style={{ fontFamily: 'var(--font-display)' }}>Navigation</h4>
          <ul className="footer-links">
            <li><Link to="/" className="footer-link">Home Search</Link></li>
            <li><Link to="/about" className="footer-link">About Us</Link></li>
            <li><Link to="/settings" className="footer-link">API Settings</Link></li>
          </ul>
        </div>
      </div>
    </div>
    <div className="footer-bottom">
      <DisclaimerBanner isFooter={true} />
      <p className="mt-4">© {new Date().getFullYear()} MediFinder AI. All rights reserved.</p>
    </div>
  </footer>
);

export const Layout = () => {
  return (
    <>
      <Navbar />
      <main className="page-container">
        <Outlet />
      </main>
      <Footer />
    </>
  );
};
