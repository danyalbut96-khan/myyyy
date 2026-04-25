import { useState, useEffect, type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, ArrowRight, X, FlaskConical, Stethoscope, RefreshCw, AlertTriangle, ShieldAlert, History } from 'lucide-react';

const COMMON_MEDICINES = ['Paracetamol', 'Amoxicillin', 'Omeprazole', 'Ibuprofen', 'Lisinopril', 'Metformin', 'Aspirin'];

export const Home = () => {
  const [query, setQuery] = useState('');
  const [history, setHistory] = useState<string[]>([]);
  const navigate = useNavigate();
  const isUrdu = localStorage.getItem('medifinder_lang') === 'ur';

  useEffect(() => {
    const savedHistory = localStorage.getItem('medifinder_history');
    if (savedHistory) {
      try {
        setHistory(JSON.parse(savedHistory));
      } catch (e) {
        setHistory([]);
      }
    }
  }, []);

  const saveToHistory = (searchTerm: string) => {
    const term = searchTerm.trim();
    if (!term) return;
    
    const newHistory = [term, ...history.filter(item => item.toLowerCase() !== term.toLowerCase())].slice(0, 10);
    localStorage.setItem('medifinder_history', JSON.stringify(newHistory));
    setHistory(newHistory);
  };

  const handleSearch = (e: FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;
    saveToHistory(query);
    navigate(`/result?q=${encodeURIComponent(query)}`);
  };

  const handleChipClick = (med: string) => {
    saveToHistory(med);
    navigate(`/result?q=${encodeURIComponent(med)}`);
  };

  const removeHistoryItem = (e: React.MouseEvent, itemToRemove: string) => {
    e.stopPropagation();
    const newHistory = history.filter(item => item !== itemToRemove);
    localStorage.setItem('medifinder_history', JSON.stringify(newHistory));
    setHistory(newHistory);
  };

  const clearHistory = () => {
    localStorage.removeItem('medifinder_history');
    setHistory([]);
  };

  return (
    <div className="fade-up">
      {/* Hero Section */}
      <section className="section text-center" style={{ paddingTop: '100px' }}>
        <div className="container">
          <div className="flex justify-center mb-6">
            <span className="badge badge-green">
              {isUrdu ? '✦ اے آئی پر مبنی میڈیسن سرچ' : '✦ AI-Powered Medicine Search'}
            </span>
          </div>
          
          <h1 style={{ fontSize: 'clamp(40px, 8vw, 72px)', marginBottom: '24px' }}>
            {isUrdu ? (
              <>دوائیں فوری طور پر <br /><i className="text-primary-accent">دریافت کریں</i></>
            ) : (
              <>Discover <i className="text-primary-accent">Medicine</i><br />Details Instantly</>
            )}
          </h1>
          
          <p className="text-muted mx-auto" style={{ maxWidth: '520px', fontSize: '18px', fontWeight: 300, marginBottom: '48px' }}>
            {isUrdu 
              ? 'جامع، اے آئی سے چلنے والی تفصیلات بشمول اجزاء، استعمال، خوراک، مضر اثرات اور متبادل حاصل کرنے کے لیے دوا کا نام درج کریں۔'
              : 'Enter any medicine name to get comprehensive, AI-powered details including composition, uses, dosage, side effects, and alternatives.'}
          </p>

          <form onSubmit={handleSearch} className="search-wrapper mb-8">
            <Search className="search-icon" size={24} />
            <input
              type="text"
              className="search-input"
              placeholder={isUrdu ? 'مثلاً پیناڈول، امیکسیلین...' : 'e.g. Paracetamol, Adderall, Lipitor…'}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
            <button type="submit" className="search-submit">
              <ArrowRight size={20} />
            </button>
          </form>

          <div className="flex flex-col items-center gap-4">
            <span className="text-muted" style={{ fontSize: '14px' }}>
              {isUrdu ? 'یا ان عام ادویات میں سے کوئی آزمائیں:' : 'Or try one of these common medicines:'}
            </span>
            <div className="flex flex-wrap justify-center gap-3 max-w-xl">
              {COMMON_MEDICINES.map((med) => (
                <button
                  key={med}
                  type="button"
                  className="chip"
                  onClick={() => handleChipClick(med)}
                >
                  {med}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Feature Cards Row */}
      <section className="section" style={{ backgroundColor: 'white', borderTop: '1px solid var(--border)' }}>
        <div className="container">
          <div className="features-grid">
            <div className="feature-card">
              <div className="icon-box"><FlaskConical size={24} /></div>
              <h3>{isUrdu ? 'مکمل اجزاء' : 'Complete Composition'}</h3>
              <p>{isUrdu 
                ? 'کیمیائی فارمولوں اور فعال نمکیات کی تفصیلی تفصیل تاکہ آپ کو معلوم ہو کہ اندر کیا ہے۔'
                : 'Detailed breakdown of chemical formulas and active salts ensuring you know exactly what is inside.'}</p>
            </div>
            <div className="feature-card">
              <div className="icon-box"><Stethoscope size={24} /></div>
              <h3>{isUrdu ? 'خوراک اور استعمال' : 'Dosage & Usage'}</h3>
              <p>{isUrdu
                ? 'واضح، اے آئی سے خلاصہ شدہ ہدایات کہ دوا عام طور پر کیسے دی جاتی ہے اور استعمال کی جاتی ہے۔'
                : 'Clear, AI-summarized instructions on how the medication is typically administered and utilized.'}</p>
            </div>
            <div className="feature-card">
              <div className="icon-box"><RefreshCw size={24} /></div>
              <h3>{isUrdu ? 'سمارٹ متبادل' : 'Smart Alternatives'}</h3>
              <p>{isUrdu
                ? 'مماثل علاج کے اثرات کے ساتھ فوری طور پر قابل موازنہ جینرک اور برانڈ متبادل تلاش کریں۔'
                : 'Find comparable generic and brand alternatives instantly with matching therapeutic effects.'}</p>
            </div>
            <div className="feature-card">
              <div className="icon-box"><AlertTriangle size={24} /></div>
              <h3>{isUrdu ? 'مضر اثرات' : 'Side Effects'}</h3>
              <p>{isUrdu
                ? 'ممکنہ مضر اثرات کا جامع جائزہ جو عام سے لے کر شدید ردعمل تک ہوتا ہے۔'
                : 'Comprehensive overview of potential side effects ranging from common to severe reactions.'}</p>
            </div>
            <div className="feature-card">
              <div className="icon-box"><ShieldAlert size={24} /></div>
              <h3>{isUrdu ? 'دوائیوں کے تعاملات' : 'Drug Interactions'}</h3>
              <p>{isUrdu
                ? 'دیگر عام ادویات کے ساتھ اہم تضادات اور ممکنہ تعاملات کی شناخت کریں۔'
                : 'Identify critical contraindications and potential interactions with other common medications.'}</p>
            </div>
            <div className="feature-card">
              <div className="icon-box"><History size={24} /></div>
              <h3>{isUrdu ? 'تلاش کی تاریخ' : 'Search History'}</h3>
              <p>{isUrdu
                ? 'آپ کے آلے پر محفوظ کردہ کوئیک ایکسیس ہسٹری لاگ کے ساتھ اپنی تازہ ترین پوچھ گچھ کا ٹریک رکھیں۔'
                : 'Keep track of your latest inquiries with a quick-access history log saved securely on your device.'}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Search History Section */}
      {history.length > 0 && (
        <section className="section container">
          <div className="flex items-center justify-between mb-6">
            <h2 style={{ fontSize: '24px' }}>{isUrdu ? 'حالیہ تلاش' : 'Recent Searches'}</h2>
            <button onClick={clearHistory} className="text-muted" style={{ fontSize: '14px', textDecoration: 'underline' }}>
              {isUrdu ? 'سب صاف کریں' : 'Clear All'}
            </button>
          </div>
          <div className="flex flex-wrap gap-3">
            {history.slice(0, 5).map((item) => (
              <div key={item} className="chip" style={{ cursor: 'pointer' }} onClick={() => handleChipClick(item)}>
                {item}
                <button
                  type="button"
                  className="chip-remove"
                  onClick={(e) => removeHistoryItem(e, item)}
                >
                  <X size={14} />
                </button>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
};
