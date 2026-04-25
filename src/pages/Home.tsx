import { useState, useEffect, type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, ArrowRight, X, FlaskConical, Stethoscope, RefreshCw, AlertTriangle, ShieldAlert, History } from 'lucide-react';

const COMMON_MEDICINES = ['Paracetamol', 'Amoxicillin', 'Omeprazole', 'Ibuprofen', 'Lisinopril', 'Metformin', 'Aspirin'];

export const Home = () => {
  const [query, setQuery] = useState('');
  const [history, setHistory] = useState<string[]>([]);
  const navigate = useNavigate();

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
            <span className="badge badge-green">✦ AI-Powered Medicine Search</span>
          </div>
          
          <h1 style={{ fontSize: 'clamp(42px, 8vw, 72px)', marginBottom: '24px' }}>
            Discover <i className="text-primary-accent">Medicine</i><br />
            Details Instantly
          </h1>
          
          <p className="text-muted mx-auto" style={{ maxWidth: '520px', fontSize: '18px', fontWeight: 300, marginBottom: '48px' }}>
            Enter any medicine name to get comprehensive, AI-powered details including composition, uses, dosage, side effects, and alternatives.
          </p>

          <form onSubmit={handleSearch} className="search-wrapper mb-8">
            <Search className="search-icon" size={24} />
            <input
              type="text"
              className="search-input"
              placeholder="e.g. Paracetamol, Adderall, Lipitor…"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
            <button type="submit" className="search-submit">
              <ArrowRight size={20} />
            </button>
          </form>

          <div className="flex flex-col items-center gap-4">
            <span className="text-muted" style={{ fontSize: '14px' }}>Or try one of these common medicines:</span>
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
              <h3>Complete Composition</h3>
              <p>Detailed breakdown of chemical formulas and active salts ensuring you know exactly what is inside.</p>
            </div>
            <div className="feature-card">
              <div className="icon-box"><Stethoscope size={24} /></div>
              <h3>Dosage & Usage</h3>
              <p>Clear, AI-summarized instructions on how the medication is typically administered and utilized.</p>
            </div>
            <div className="feature-card">
              <div className="icon-box"><RefreshCw size={24} /></div>
              <h3>Smart Alternatives</h3>
              <p>Find comparable generic and brand alternatives instantly with matching therapeutic effects.</p>
            </div>
            <div className="feature-card">
              <div className="icon-box"><AlertTriangle size={24} /></div>
              <h3>Side Effects</h3>
              <p>Comprehensive overview of potential side effects ranging from common to severe reactions.</p>
            </div>
            <div className="feature-card">
              <div className="icon-box"><ShieldAlert size={24} /></div>
              <h3>Drug Interactions</h3>
              <p>Identify critical contraindications and potential interactions with other common medications.</p>
            </div>
            <div className="feature-card">
              <div className="icon-box"><History size={24} /></div>
              <h3>Search History</h3>
              <p>Keep track of your latest inquiries with a quick-access history log saved securely on your device.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Search History Section */}
      {history.length > 0 && (
        <section className="section container">
          <div className="flex items-center justify-between mb-6">
            <h2 style={{ fontSize: '24px' }}>Recent Searches</h2>
            <button onClick={clearHistory} className="text-muted" style={{ fontSize: '14px', textDecoration: 'underline' }}>
              Clear All
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
