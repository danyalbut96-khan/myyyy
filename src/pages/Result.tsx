import { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, CheckCircle2, Circle, AlertTriangle, AlertCircle, Pill, BookOpen, Activity, Beaker } from 'lucide-react';
import { fetchMedicineDetails } from '../services/api';
import type { MedicineDetails } from '../types';

const LoadingScreen = () => {
  const [step, setStep] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setStep((prev) => (prev < 3 ? prev + 1 : prev));
    }, 1500);
    return () => clearInterval(timer);
  }, []);

  const steps = [
    "Connecting to Medical Database...",
    "Analyzing Composition...",
    "Fetching Uses and Side Effects...",
    "Finding Alternatives..."
  ];

  return (
    <div className="loading-overlay fade-in">
      <div className="spinner"></div>
      <div className="loading-steps">
        {steps.map((text, idx) => {
          let stateClass = '';
          if (idx < step) stateClass = 'completed';
          else if (idx === step) stateClass = 'active';

          return (
            <div key={idx} className={`loading-step ${stateClass}`}>
              <div className="step-icon">
                {idx < step ? <CheckCircle2 size={14} /> : <Circle size={14} />}
              </div>
              <span>{text}</span>
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

    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const details = await fetchMedicineDetails(query);
        setData(details);
      } catch (err: any) {
        setError(err.message || 'An error occurred while fetching details.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [query, navigate]);

  if (loading) return <LoadingScreen />;

  if (error) {
    return (
      <div className="container pt-20 text-center fade-in">
        <AlertTriangle size={48} className="text-rose-500 mb-4 mx-auto" color="#f43f5e" />
        <h2 className="mb-4">Error Fetching Data</h2>
        <p className="text-muted mb-8">{error}</p>
        <button className="btn btn-primary" onClick={() => navigate('/')}>
          <ArrowLeft size={18} /> Back to Search
        </button>
      </div>
    );
  }

  if (!data) return null;

  return (
    <div className="container fade-in">
      <button className="btn btn-outline mb-6" onClick={() => navigate('/')}>
        <ArrowLeft size={18} /> Back to Search
      </button>

      <div className="card mb-8">
        <div className="mb-6 pb-6" style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
          <div className="flex justify-between items-start flex-wrap gap-4 mb-4">
            <div>
              <h1 className="text-gradient" style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>{data.brandName}</h1>
              <p className="text-muted" style={{ fontSize: '1.25rem' }}>Generic: {data.genericName}</p>
            </div>
            <div className="flex gap-2 flex-wrap" style={{ display: 'flex' }}>
              <span className="tag tag-blue">{data.category}</span>
              <span className="tag tag-purple">{data.manufacturer}</span>
            </div>
          </div>
          <p style={{ fontSize: '1.1rem', lineHeight: 1.6 }}>{data.summary}</p>
        </div>

        <div className="grid-2">
          <div>
            <div className="detail-section">
              <h3 className="detail-title"><Beaker size={18} className="text-accent-blue" /> Composition & Formula</h3>
              <div className="detail-content">
                <p><strong>Chemical Formula:</strong> {data.chemicalFormula}</p>
                <p className="mt-2"><strong>Active Salts:</strong> {data.composition}</p>
              </div>
            </div>

            <div className="detail-section">
              <h3 className="detail-title"><BookOpen size={18} className="text-accent-teal" /> Uses & Indications</h3>
              <div className="detail-content">
                <p>{data.uses}</p>
              </div>
            </div>

            <div className="detail-section">
              <h3 className="detail-title"><Pill size={18} className="text-accent-blue" /> Dosage</h3>
              <div className="detail-content">
                <p>{data.dosage}</p>
              </div>
            </div>
          </div>

          <div>
            <div className="detail-section">
              <h3 className="detail-title"><Activity size={18} color="#fca5a5" /> Side Effects</h3>
              <div className="detail-content">
                <p>{data.sideEffects}</p>
              </div>
            </div>

            <div className="detail-section">
              <h3 className="detail-title"><AlertCircle size={18} color="#fca5a5" /> Contraindications</h3>
              <div className="detail-content">
                <p>{data.contraindications}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <h2 className="mb-6 font-display" style={{ fontSize: '2rem' }}>Alternative Medicines</h2>
      <div className="grid-3 mb-8">
        {data.alternatives?.map((alt, idx) => (
          <div 
            key={idx} 
            className="alt-card"
            onClick={() => navigate(`/result?q=${encodeURIComponent(alt.name)}`)}
          >
            <div className="alt-header">
              <span className="alt-name">{alt.name}</span>
              <span className={`tag ${alt.type === 'Generic' ? 'tag-amber' : 'tag-teal'}`} style={{ fontSize: '0.65rem' }}>
                {alt.type}
              </span>
            </div>
            <p className="alt-note">{alt.note}</p>
          </div>
        ))}
      </div>
    </div>
  );
};
