import { Outlet, Link, useNavigate } from 'react-router-dom';
import { Search, Info, ShieldAlert, FileText, MapPin, MessageSquare, Menu, X, Globe } from 'lucide-react';
import { useState, useEffect } from 'react';
import { ChatBot } from './ChatBot';

const DisclaimerBar = () => {
  const isUrdu = localStorage.getItem('medifinder_lang') === 'ur';
  return (
    <div className="disclaimer-bar">
      {isUrdu 
        ? "⚕ طبی دستبرداری: صرف معلوماتی مقاصد کے لیے۔ ہمیشہ صحت کے پیشہ ور سے مشورہ کریں۔" 
        : "⚕ Medical Disclaimer: For informational purposes only. Always consult a healthcare professional."}
    </div>
  );
};

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [isUrdu, setIsUrdu] = useState(false);

  useEffect(() => {
    const lang = localStorage.getItem('medifinder_lang');
    if (lang === 'ur') {
      setIsUrdu(true);
      document.documentElement.dir = 'rtl';
      document.documentElement.lang = 'ur';
    } else {
      setIsUrdu(false);
      document.documentElement.dir = 'ltr';
      document.documentElement.lang = 'en';
    }
  }, []);

  const toggleLanguage = () => {
    const newLang = isUrdu ? 'en' : 'ur';
    localStorage.setItem('medifinder_lang', newLang);
    window.location.reload();
  };

  const closeMenu = () => setMenuOpen(false);

  return (
    <nav className="navbar">
      <div className="nav-content">
        <Link to="/" className="logo" onClick={closeMenu}>
          MediFinder <span>AI</span>
        </Link>
        
        <div className={`nav-links ${menuOpen ? 'open' : 'hidden md:flex'}`} style={menuOpen ? { position: 'absolute', top: 68, left: 0, right: 0, background: 'var(--surface)', padding: 20, flexDirection: 'column', borderBottom: '1px solid var(--border)' } : {}}>
          <Link to="/" className="nav-pill" onClick={closeMenu}>
            <Search size={16} /> {isUrdu ? 'تلاش' : 'Search'}
          </Link>
          <Link to="/safety" className="nav-pill" onClick={closeMenu}>
            <ShieldAlert size={16} /> {isUrdu ? 'حفاظتی جانچ' : 'Safety Checker'}
          </Link>
          <Link to="/prescription" className="nav-pill" onClick={closeMenu}>
            <FileText size={16} /> {isUrdu ? 'نسخہ' : 'Prescription'}
          </Link>
          <Link to="/pharmacies" className="nav-pill" onClick={closeMenu}>
            <MapPin size={16} /> {isUrdu ? 'فارمیسی' : 'Pharmacies'}
          </Link>
          <Link to="/chat" className="nav-pill" onClick={closeMenu}>
            <MessageSquare size={16} /> {isUrdu ? 'میڈی باٹ' : 'MediBot'}
          </Link>
          <Link to="/about" className="nav-pill" onClick={closeMenu}>
            <Info size={16} /> {isUrdu ? 'ہمارے بارے میں' : 'About'}
          </Link>
          
          <button onClick={toggleLanguage} className="nav-pill" style={{ backgroundColor: 'var(--bg-color)', border: '1px solid var(--border)' }}>
            <Globe size={16} /> {isUrdu ? 'EN | اردو' : 'EN | اردو'}
          </button>
        </div>

        <button className="md:hidden flex items-center" onClick={() => setMenuOpen(!menuOpen)}>
          {menuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>
    </nav>
  );
};

const Footer = () => {
  const isUrdu = localStorage.getItem('medifinder_lang') === 'ur';
  return (
    <>
      <footer className="footer">
        <div className="container">
          <div className="footer-grid">
            <div>
              <Link to="/" className="footer-logo">
                MediFinder <span>AI</span>
              </Link>
              <p className="text-secondary" style={{ color: '#A0A09A' }}>
                {isUrdu 
                  ? "جدید ترین اے آئی پر مبنی میڈیسن سرچ انجن جو ادویات کی تفصیلی معلومات فوری فراہم کرتا ہے۔"
                  : "Advanced AI-powered medicine search engine providing detailed pharmaceutical information instantly."}
              </p>
            </div>
            <div>
              <h4 style={{ color: 'white', marginBottom: '20px' }}>{isUrdu ? 'قانونی معلومات' : 'Legal'}</h4>
              <ul className="footer-links">
                <li><Link to="/privacy-policy">{isUrdu ? 'پرائیویسی پالیسی' : 'Privacy Policy'}</Link></li>
                <li><Link to="/terms">{isUrdu ? 'شرائط و ضوابط' : 'Terms & Conditions'}</Link></li>
              </ul>
            </div>
            <div>
              <h4 style={{ color: 'white', marginBottom: '20px' }}>{isUrdu ? 'نیویگیشن' : 'Navigation'}</h4>
              <ul className="footer-links">
                <li><Link to="/">{isUrdu ? 'تلاش کریں' : 'Home Search'}</Link></li>
                <li><Link to="/about">{isUrdu ? 'ہمارے بارے میں' : 'About Us'}</Link></li>
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
};

export const Layout = () => {
  return (
    <>
      <DisclaimerBar />
      <Navbar />
      <main>
        <Outlet />
      </main>
      <Footer />
      <ChatBot />
    </>
  );
};
