import { useEffect, useState } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import { fetchMedicineDetails } from '../services/api';
import type { MedicineDetails } from '../types';
import { 
  Check, 
  ArrowLeft, 
  Share, 
  BookmarkPlus, 
  Printer, 
  Info, 
  FlaskConical, 
  Activity, 
  Pill, 
  AlertTriangle, 
  ShieldAlert, 
  Network, 
  Package, 
  Baby 
} from 'lucide-react';

const LoadingScreen = ({ query }: { query: string }) => {
  const [activeStep, setActiveStep] = useState(0);

  useEffect(() => {
    const timeouts = [
      setTimeout(() => setActiveStep(1), 300),
      setTimeout(() => setActiveStep(2), 900),
      setTimeout(() => setActiveStep(3), 1500),
      setTimeout(() => setActiveStep(4), 2100)
    ];
    return () => timeouts.forEach(clearTimeout);
  }, []);

  const steps = [
    "Connecting to Medical Database",
    "Analyzing Composition",
    "Fetching Uses & Side Effects",
    "Finding Alternatives"
  ];

  return (
    <div className="loading-screen fade-up">
      <h2 style={{ fontSize: '36px', marginBottom: '8px' }}>{query}</h2>
      <p className="text-muted" style={{ marginBottom: '24px' }}>Searching medical databases…</p>
      
      <div className="spinner-ring"></div>

      <div className="loading-steps">
        {steps.map((step, index) => {
          const isActive = activeStep === index + 1;
          const isDone = activeStep > index + 1;
          const isVisible = activeStep >= index;
          
          if (!isVisible && index !== 0) return null;

          return (
            <div key={index} className={`loading-step-card ${isVisible ? 'active' : ''}`}>
              <div className={`step-dot ${isActive ? 'pulsing' : ''} ${isDone ? 'done' : ''}`}>
                {isDone ? <Check size={14} /> : <div style={{width: 8, height: 8, borderRadius: '50%', backgroundColor: 'currentColor'}} />}
              </div>
              <span style={{ fontWeight: 500, color: isActive || isDone ? 'var(--text-primary)' : 'var(--text-muted)' }}>
                {step}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export const Result = () => {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q') || '';
  const navigate = useNavigate();
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<MedicineDetails | null>(null);

  useEffect(() => {
    if (!query) {
      navigate('/');
      return;
    }

    let isMounted = true;
    
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const result = await fetchMedicineDetails(query);
        if (isMounted) {
          setData(result);
          // Save to history on success
          const historyRaw = localStorage.getItem('medifinder_history');
          const history = historyRaw ? JSON.parse(historyRaw) : [];
          const term = result.brandName || query;
          const newHistory = [term, ...history.filter((i: string) => i.toLowerCase() !== term.toLowerCase())].slice(0, 10);
          localStorage.setItem('medifinder_history', JSON.stringify(newHistory));
        }
      } catch (err: any) {
        if (isMounted) {
          setError(err.message || 'Failed to fetch details');
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchData();
    
    return () => {
      isMounted = false;
    };
  }, [query, navigate]);

  const handlePrint = () => {
    window.print();
  };

  const handleShare = async () => {
    try {
      await navigator.share({
        title: `MediFinder AI - ${data?.brandName}`,
        text: `Check out the medical details for ${data?.brandName} on MediFinder AI.`,
        url: window.location.href,
      });
    } catch (e) {
      console.log('Sharing failed or not supported');
    }
  };

  if (loading) return <LoadingScreen query={query} />;

  if (error) {
    return (
      <div className="container section fade-up text-center">
        <div style={{ backgroundColor: '#fef2f2', padding: '40px', borderRadius: '20px', maxWidth: '600px', margin: '0 auto' }}>
          <AlertTriangle size={48} color="#dc2626" style={{ margin: '0 auto 16px auto' }} />
          <h2 style={{ color: '#991b1b', marginBottom: '16px' }}>Analysis Failed</h2>
          <p style={{ color: '#b91c1c', marginBottom: '24px' }}>{error}</p>
          <button onClick={() => navigate('/')} className="btn-primary">
            <ArrowLeft size={18} /> Return Home
          </button>
        </div>
      </div>
    );
  }

  if (!data) return null;

  return (
    <div className="fade-up">
      {/* Page Header */}
      <div className="page-header">
        <div className="container">
          <div className="breadcrumb">
            <Link to="/" className="text-muted hover:text-primary-accent">Home</Link>
            <span style={{ margin: '0 8px' }}>›</span>
            <span style={{ color: 'var(--text-primary)' }}>{data.brandName}</span>
          </div>
          
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <p className="text-muted" style={{ fontSize: '14px', marginBottom: '4px' }}>
                Generic: {data.genericName}
              </p>
              <h1 className="med-title">{data.brandName}</h1>
              <div className="flex gap-3">
                <span className="badge badge-amber">Brand Name</span>
                <span className="badge badge-green">{data.category}</span>
              </div>
            </div>
            
            <div className="header-actions">
              <button className="btn-secondary">
                <BookmarkPlus size={18} /> Save
              </button>
              <button className="btn-secondary" onClick={handleShare}>
                <Share size={18} /> Share
              </button>
              <Link to="/" className="btn-primary" style={{ padding: '10px 20px' }}>
                <ArrowLeft size={18} /> New Search
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="container">
        {/* Info Grid */}
        <div className="info-grid">
          {/* Overview Card */}
          <div className="info-card info-card-full stagger-1">
            <div className="info-header">
              <div className="icon-sm"><Info size={18} /></div>
              <h3>Overview</h3>
            </div>
            <div className="info-content">
              {data.summary}
            </div>
          </div>

          <div className="info-card stagger-2">
            <div className="info-header">
              <div className="icon-sm"><FlaskConical size={18} /></div>
              <h3>Composition & Formula</h3>
            </div>
            <div className="info-content">
              <p style={{ marginBottom: '12px' }}><strong>Chemical Formula:</strong> {data.chemicalFormula}</p>
              <p><strong>Active Salts:</strong> {data.composition}</p>
            </div>
          </div>

          <div className="info-card stagger-2">
            <div className="info-header">
              <div className="icon-sm"><Activity size={18} /></div>
              <h3>Uses & Indications</h3>
            </div>
            <div className="info-content">
              {data.uses}
            </div>
          </div>

          <div className="info-card stagger-3">
            <div className="info-header">
              <div className="icon-sm"><Pill size={18} /></div>
              <h3>Dosage</h3>
            </div>
            <div className="info-content">
              {data.dosage}
            </div>
          </div>

          <div className="info-card stagger-3">
            <div className="info-header">
              <div className="icon-sm"><AlertTriangle size={18} /></div>
              <h3>Side Effects</h3>
            </div>
            <div className="info-content">
              {data.sideEffects}
            </div>
          </div>

          <div className="info-card stagger-4">
            <div className="info-header">
              <div className="icon-sm"><ShieldAlert size={18} /></div>
              <h3>Contraindications</h3>
            </div>
            <div className="info-content">
              {data.contraindications}
            </div>
          </div>

          {data.drugInteractions && (
            <div className="info-card stagger-4">
              <div className="info-header">
                <div className="icon-sm"><Network size={18} /></div>
                <h3>Drug Interactions</h3>
              </div>
              <div className="info-content">
                {data.drugInteractions}
              </div>
            </div>
          )}

          {data.storageInstructions && (
            <div className="info-card stagger-4">
              <div className="info-header">
                <div className="icon-sm"><Package size={18} /></div>
                <h3>Storage Instructions</h3>
              </div>
              <div className="info-content">
                {data.storageInstructions}
              </div>
            </div>
          )}

          {data.pregnancyCategory && (
            <div className="info-card stagger-4">
              <div className="info-header">
                <div className="icon-sm"><Baby size={18} /></div>
                <h3>Pregnancy Category</h3>
              </div>
              <div className="info-content">
                {data.pregnancyCategory}
              </div>
            </div>
          )}
        </div>

        <div className="flex justify-center" style={{ marginBottom: '80px' }}>
          <button className="btn-secondary" onClick={handlePrint}>
            <Printer size={18} /> Print Info Sheet
          </button>
        </div>

        {/* Alternatives Section */}
        <div style={{ marginBottom: '80px' }}>
          <h2 style={{ fontSize: '32px', marginBottom: '8px' }}>Alternative Medicines</h2>
          <p className="text-muted" style={{ marginBottom: '24px' }}>Similar medicines with comparable therapeutic effects</p>
          
          <div className="alt-grid">
            {data.alternatives?.map((alt, idx) => (
              <div 
                key={idx} 
                className="alt-card"
                onClick={() => navigate(`/result?q=${encodeURIComponent(alt.name)}`)}
              >
                <div className="flex justify-between items-start" style={{ marginBottom: '12px' }}>
                  <h4 className="alt-name">{alt.name}</h4>
                  <span className={`badge ${alt.type?.toLowerCase() === 'brand' ? 'badge-amber' : 'badge-blue'}`} style={{ padding: '4px 10px', fontSize: '11px' }}>
                    {alt.type || 'Generic'}
                  </span>
                </div>
                <p className="text-muted" style={{ fontSize: '14px', flex: 1 }}>{alt.note}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
