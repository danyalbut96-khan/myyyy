import { useState, useEffect, type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, ArrowRight, X, FlaskConical, Stethoscope, RefreshCw, AlertTriangle, ShieldAlert, History, Newspaper, ExternalLink, Calendar } from 'lucide-react';
import { fetchHealthNews, type HealthNewsItem } from '../services/api';

const COMMON_MEDICINES = ['Paracetamol', 'Amoxicillin', 'Omeprazole', 'Ibuprofen', 'Lisinopril', 'Metformin', 'Aspirin'];

export const Home = () => {
  const [query, setQuery] = useState('');
  const [history, setHistory] = useState<string[]>([]);
  const [textIndex, setTextIndex] = useState(0);
  const [displayText, setDisplayText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const [news, setNews] = useState<HealthNewsItem[]>([]);
  const [loadingNews, setLoadingNews] = useState(true);
  const navigate = useNavigate();
  const isUrdu = localStorage.getItem('medifinder_lang') === 'ur';

  const words = isUrdu 
    ? ['ادویات', 'خوراک', 'متبادل', 'اثرات', 'قیمت'] 
    : ['Medicine', 'Dosage', 'Side Effects', 'Alternatives', 'Prices'];

  useEffect(() => {
    const loadNews = async () => {
      try {
        const newsData = await fetchHealthNews();
        setNews(newsData);
      } catch (e) {
        console.error(e);
      } finally {
        setLoadingNews(false);
      }
    };
    loadNews();
  }, []);

  useEffect(() => {
    const timeout = setTimeout(() => {
      const currentWord = words[textIndex % words.length];
      
      if (!isDeleting) {
        setDisplayText(currentWord.substring(0, displayText.length + 1));
        if (displayText === currentWord) {
          setTimeout(() => setIsDeleting(true), 2000);
        }
      } else {
        setDisplayText(currentWord.substring(0, displayText.length - 1));
        if (displayText === '') {
          setIsDeleting(false);
          setTextIndex(textIndex + 1);
        }
      }
    }, isDeleting ? 50 : 100);

    return () => clearTimeout(timeout);
  }, [displayText, isDeleting, textIndex, words]);

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
      <section className="section text-center" style={{ paddingTop: '100px', paddingBottom: '60px' }}>
        <div className="container">
          <div className="flex justify-center mb-6">
            <span className="badge badge-green">
              {isUrdu ? '✦ اے آئی پر مبنی میڈیسن سرچ' : '✦ AI-Powered Medicine Search'}
            </span>
          </div>
          
          <h1 style={{ fontSize: 'clamp(40px, 8vw, 72px)', marginBottom: '24px' }}>
            {isUrdu ? (
              <>دوائیں <i className="text-primary-accent" style={{ borderRight: '3px solid', paddingRight: '4px' }}>{displayText}</i> <br />دریافت کریں</>
            ) : (
              <>Discover <i className="text-primary-accent" style={{ borderRight: '3px solid', paddingRight: '4px' }}>{displayText}</i><br />Details Instantly</>
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

      {/* Health News Section */}
      <section className="section bg-light" style={{ borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)' }}>
        <div className="container">
          <div className="flex items-center justify-between mb-10">
            <div>
              <div className="flex items-center gap-2 text-primary-accent font-semibold mb-2">
                <Newspaper size={20} />
                <span>{isUrdu ? 'تازہ ترین ہیلتھ اپڈیٹس' : 'Latest Health Updates'}</span>
              </div>
              <h2 style={{ fontSize: 'clamp(28px, 4vw, 36px)', fontWeight: 800 }}>
                {isUrdu ? 'صحت کی دنیا سے اہم خبریں' : 'Top Medical & Health News'}
              </h2>
            </div>
            {!loadingNews && (
              <button onClick={() => window.location.reload()} className="btn-secondary" style={{ padding: '8px 16px', fontSize: '14px' }}>
                <RefreshCw size={16} /> {isUrdu ? 'ریفریش' : 'Refresh'}
              </button>
            )}
          </div>

          {loadingNews ? (
            <div className="news-grid">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="news-card" style={{ height: 320 }}>
                  <div className="news-image-wrapper skeleton-loading"></div>
                  <div className="news-content">
                    <div className="skeleton-loading" style={{ height: 20, width: '80%', marginBottom: 12 }}></div>
                    <div className="skeleton-loading" style={{ height: 40, width: '100%' }}></div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="news-grid">
              {news.slice(0, 4).map((item) => (
                <a 
                  key={item.id} 
                  href={item.url} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="news-card group"
                >
                  <div className="news-image-wrapper">
                    <img 
                      src={`https://images.unsplash.com/photo-${item.id}?auto=format&fit=crop&q=80&w=600&fallback=https://images.unsplash.com/photo-1505751172107-5739a00723a5?q=80&w=600`} 
                      alt={item.title} 
                      className="news-image"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1505751172107-5739a00723a5?q=80&w=600';
                      }}
                    />
                    <div className="news-category-badge">{item.category}</div>
                  </div>
                  <div className="news-content">
                    <div className="flex items-center gap-2 text-xs text-muted mb-2">
                      <span>{item.date}</span>
                      <span>•</span>
                      <span>{item.source}</span>
                    </div>
                    <h3 className="news-title group-hover:text-primary-accent transition-colors">
                      {item.title}
                    </h3>
                    <p className="news-summary">
                      {item.summary}
                    </p>
                  </div>
                </a>
              ))}
            </div>
          )}
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

      {/* Coming Soon: Personal Health Profile */}
      <section className="section container">
        <div className="coming-soon-card">
          <div className="coming-soon-badge">{isUrdu ? 'جلد آ رہا ہے' : 'Coming Soon'}</div>
          <h2 style={{ fontSize: '32px', marginBottom: '16px' }}>
            {isUrdu ? 'آپ کا ذاتی ہیلتھ پروفائل' : 'Your Personal Health Profile'}
          </h2>
          <p className="text-muted mx-auto" style={{ maxWidth: '600px', marginBottom: '32px' }}>
            {isUrdu
              ? 'اپنا اکاؤنٹ بنائیں اور اپنی طبی تاریخ (جیسے ذیابیطس یا بلڈ پریشر) محفوظ کریں۔ میڈی فائنڈر آپ کو ایسی ادویات کے بارے میں خودکار طور پر خبردار کرے گا جو آپ کے لیے خطرناک ہو سکتی ہیں۔'
              : 'Create your account and store your medical history (like diabetes or hypertension). MediFinder will automatically warn you about medications that might be unsafe for your specific condition.'}
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <div className="chip" style={{ opacity: 0.7 }}><ShieldAlert size={14} /> {isUrdu ? 'سمارٹ الرٹس' : 'Smart Alerts'}</div>
            <div className="chip" style={{ opacity: 0.7 }}><History size={14} /> {isUrdu ? 'تاریخ کا مطالعہ' : 'Full History Sync'}</div>
            <div className="chip" style={{ opacity: 0.7 }}><FlaskConical size={14} /> {isUrdu ? 'ذاتی تجاویز' : 'Personalized Recommendations'}</div>
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
