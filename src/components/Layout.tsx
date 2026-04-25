import { Outlet, Link } from 'react-router-dom';
import { Search, Info, ShieldAlert, FileText, MapPin, MessageSquare, Menu, X, Globe, Pill, ArrowRight } from 'lucide-react';
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
      <div className="nav-content flex items-center justify-between w-full">
        <Link to="/" className="logo" onClick={closeMenu}>
          <div className="flex items-center gap-2">
            <div className="logo-icon" style={{ width: 32, height: 32 }}>
              <Pill size={20} />
            </div>
            <span style={{ fontSize: 20 }}>MediFinder <span className="text-primary-accent">AI</span></span>
          </div>
        </Link>
        
        <div className="flex items-center gap-2">
          <button onClick={toggleLanguage} className="nav-pill" style={{ padding: '6px 12px', fontSize: 13, backgroundColor: 'var(--bg-color)', border: '1px solid var(--border)' }}>
            <Globe size={14} /> {isUrdu ? 'EN' : 'UR'}
          </button>

          <button className="flex items-center p-2 rounded-full hover:bg-gray-100" onClick={() => setMenuOpen(!menuOpen)}>
            {menuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Full-screen / Overlay Menu */}
        <div className={`nav-links ${menuOpen ? 'open' : 'hidden'}`}>
          <div className="flex flex-col gap-2 w-full max-w-sm mx-auto">
            <Link to="/" className="nav-pill justify-between" onClick={closeMenu}>
              <div className="flex items-center gap-3"><Search size={18} /> {isUrdu ? 'تلاش' : 'Search'}</div>
              <ArrowRight size={14} className="text-muted" />
            </Link>
            <Link to="/safety" className="nav-pill justify-between" onClick={closeMenu}>
              <div className="flex items-center gap-3"><ShieldAlert size={18} /> {isUrdu ? 'حفاظتی جانچ' : 'Safety Checker'}</div>
              <ArrowRight size={14} className="text-muted" />
            </Link>
            <Link to="/prescription" className="nav-pill justify-between" onClick={closeMenu}>
              <div className="flex items-center gap-3"><FileText size={18} /> {isUrdu ? 'نسخہ' : 'Prescription'}</div>
              <ArrowRight size={14} className="text-muted" />
            </Link>
            <Link to="/pharmacies" className="nav-pill justify-between" onClick={closeMenu}>
              <div className="flex items-center gap-3"><MapPin size={18} /> {isUrdu ? 'فارمیسی' : 'Pharmacies'}</div>
              <ArrowRight size={14} className="text-muted" />
            </Link>
            <Link to="/chat" className="nav-pill justify-between" onClick={closeMenu}>
              <div className="flex items-center gap-3"><MessageSquare size={18} /> {isUrdu ? 'میڈی باٹ' : 'MediBot'}</div>
              <ArrowRight size={14} className="text-muted" />
            </Link>
            <Link to="/about" className="nav-pill justify-between" onClick={closeMenu}>
              <div className="flex items-center gap-3"><Info size={18} /> {isUrdu ? 'ہمارے بارے میں' : 'About'}</div>
              <ArrowRight size={14} className="text-muted" />
            </Link>
          </div>
        </div>
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
            <p>Made with <span style={{ color: '#ff4d4d' }}>❤️</span> by <a href="https://cloudexify.site" target="_blank" rel="noreferrer" style={{ color: 'inherit', textDecoration: 'underline' }}>Cloudexify</a></p>
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
