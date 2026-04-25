import { useEffect, useState } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import { fetchMedicineDetails, checkInteraction } from '../services/api';
import type { MedicineDetails, InteractionResult } from '../types';
import { 
  Check, ArrowLeft, Printer, Info, FlaskConical, Activity, Pill, 
  AlertTriangle, ShieldAlert, Network, Package, Baby, MapPin, Scale, Pill as PillIcon, Map
} from 'lucide-react';

const LoadingScreen = ({ query, isUrdu }: { query: string, isUrdu: boolean }) => {
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

  const steps = isUrdu ? [
    "طبی ڈیٹا بیس سے منسلک ہو رہا ہے",
    "کیمیاوی اجزاء کا تجزیہ ہو رہا ہے",
    "استعمال اور مضر اثرات کی تفصیلات",
    "متبادل ادویات تلاش ہو رہی ہیں"
  ] : [
    "Connecting to Medical Database",
    "Analyzing Composition",
    "Fetching Uses & Side Effects",
    "Finding Alternatives"
  ];

  return (
    <div className="loading-screen fade-up">
      <h2 style={{ fontSize: '36px', marginBottom: '8px' }}>{query}</h2>
      <p className="text-muted" style={{ marginBottom: '24px' }}>
        {isUrdu ? "طبی ڈیٹا بیس تلاش کیا جا رہا ہے..." : "Searching medical databases…"}
      </p>
      
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
  const isUrdu = localStorage.getItem('medifinder_lang') === 'ur';
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<MedicineDetails | null>(null);

  const [interactionInput, setInteractionInput] = useState('');
  const [interactionChecking, setInteractionChecking] = useState(false);
  const [interactionResult, setInteractionResult] = useState<InteractionResult | null>(null);

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
          const historyRaw = localStorage.getItem('medifinder_history');
          const history = historyRaw ? JSON.parse(historyRaw) : [];
          const term = result.brandName || query;
          const newHistory = [term, ...history.filter((i: string) => i.toLowerCase() !== term.toLowerCase())].slice(0, 10);
          localStorage.setItem('medifinder_history', JSON.stringify(newHistory));
        }
      } catch (err: any) {
        if (isMounted) setError(err.message || 'Failed to fetch details');
      } finally {
        if (isMounted) setLoading(false);
      }
    };
    fetchData();
    return () => { isMounted = false; };
  }, [query, navigate]);

  const handleInteractionCheck = async () => {
    if (!interactionInput.trim() || !data) return;
    setInteractionChecking(true);
    try {
      const res = await checkInteraction(data.brandName, interactionInput);
      setInteractionResult(res);
    } catch (e) {
      console.error(e);
    } finally {
      setInteractionChecking(false);
    }
  };

  const handlePrint = () => window.print();

  if (loading) return <LoadingScreen query={query} isUrdu={isUrdu} />;

  if (error) {
    return (
      <div className="container section fade-up text-center">
        <div style={{ backgroundColor: '#fef2f2', padding: '40px', borderRadius: '20px', maxWidth: '600px', margin: '0 auto' }}>
          <AlertTriangle size={48} color="#dc2626" style={{ margin: '0 auto 16px auto' }} />
          <h2 style={{ color: '#991b1b', marginBottom: '16px' }}>{isUrdu ? 'تجزیہ ناکام ہو گیا' : 'Analysis Failed'}</h2>
          <p style={{ color: '#b91c1c', marginBottom: '24px' }}>{error}</p>
          <button onClick={() => navigate('/')} className="btn-primary">
            <ArrowLeft size={18} /> {isUrdu ? 'ہوم پر واپس جائیں' : 'Return Home'}
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
            <Link to="/" className="text-muted hover:text-primary-accent">{isUrdu ? 'ہوم' : 'Home'}</Link>
            <span style={{ margin: '0 8px' }}>›</span>
            <span style={{ color: 'var(--text-primary)' }}>{data.brandName}</span>
          </div>
          
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <p className="text-muted" style={{ fontSize: '14px', marginBottom: '4px' }}>
                {isUrdu ? 'جینرک:' : 'Generic:'} {data.genericName}
              </p>
              <h1 className="med-title">{data.brandName}</h1>
              <div className="flex gap-3">
                <span className="badge badge-amber">{data.type || 'Brand Name'}</span>
                <span className="badge badge-green">{data.category || data.drugClass || 'Medicine'}</span>
              </div>
            </div>
            
            <div className="header-actions">
              <button className="btn-secondary" onClick={handlePrint}>
                <Printer size={18} /> {isUrdu ? 'پرنٹ کریں' : 'Print'}
              </button>
              <Link to="/" className="btn-primary" style={{ padding: '10px 20px' }}>
                <ArrowLeft size={18} /> {isUrdu ? 'نئی تلاش' : 'New Search'}
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="container">
        {/* Info Grid */}
        <div className="info-grid">
          
          {/* Overview */}
          <div className="info-card info-card-full stagger-1">
            <div className="info-header">
              <div className="icon-sm"><Info size={18} /></div>
              <h3>{isUrdu ? 'جائزہ' : 'Overview'}</h3>
            </div>
            <div className="info-content">
              {data.summary || data.overview}
            </div>
          </div>

          {/* Availability & Forms */}
          {data.availability && (
            <div className="info-card info-card-full stagger-1" style={{ backgroundColor: '#fdfbfa' }}>
              <div className="info-header">
                <div className="icon-sm"><Package size={18} /></div>
                <h3>{isUrdu ? 'دستیابی اور شکلیں' : 'Availability & Forms'}</h3>
              </div>
              <div className="info-content">
                <div className="flex flex-wrap gap-4 mb-4">
                  {['Tablet', 'Capsule', 'Syrup', 'Injection/Serum', 'Cream/Ointment', 'Drops', 'Inhaler', 'Patch'].map(f => {
                    const isAvail = data.availability?.forms.some(av => av.toLowerCase().includes(f.toLowerCase()));
                    return (
                      <div key={f} style={{ opacity: isAvail ? 1 : 0.4, border: `1px solid ${isAvail ? 'var(--accent-primary)' : 'var(--border)'}`, padding: '8px 16px', borderRadius: 12, display: 'flex', alignItems: 'center', gap: 8, backgroundColor: isAvail ? 'white' : 'transparent' }}>
                        <PillIcon size={16} color={isAvail ? 'var(--accent-primary)' : 'gray'} />
                        <span style={{ fontSize: 14, fontWeight: isAvail ? 600 : 400 }}>{f}</span>
                      </div>
                    );
                  })}
                </div>
                <div className="flex flex-wrap gap-4">
                  <span className={`badge ${data.availability.prescriptionRequired ? 'badge-amber' : 'badge-green'}`}>
                    {data.availability.prescriptionRequired ? (isUrdu ? 'نسخہ درکار ہے' : 'Prescription Required') : (isUrdu ? 'اوور دی کاؤنٹر' : 'OTC')}
                  </span>
                  <span className="badge badge-blue">{data.availability.availabilityStatus}</span>
                  <span className="badge" style={{ backgroundColor: '#eee' }}>{isUrdu ? 'تخمینہ قیمت:' : 'Price Range:'} {data.availability.priceRangePKR}</span>
                </div>
              </div>
            </div>
          )}

          {/* Composition */}
          <div className="info-card stagger-2">
            <div className="info-header">
              <div className="icon-sm"><FlaskConical size={18} /></div>
              <h3>{isUrdu ? 'کیمیاوی اجزاء' : 'Composition & Formula'}</h3>
            </div>
            <div className="info-content">
              <p style={{ marginBottom: '12px' }}><strong>{isUrdu ? 'کیمیاوی فارمولا:' : 'Chemical Formula:'}</strong> {data.chemicalFormula}</p>
              <p><strong>{isUrdu ? 'فعال اجزاء:' : 'Active Salts:'}</strong> {data.activeSalts || data.composition}</p>
            </div>
          </div>

          {/* Uses */}
          <div className="info-card stagger-2">
            <div className="info-header">
              <div className="icon-sm"><Activity size={18} /></div>
              <h3>{isUrdu ? 'استعمالات' : 'Uses & Indications'}</h3>
            </div>
            <div className="info-content">
              {data.uses}
            </div>
          </div>

          <div className="info-card stagger-3">
            <div className="info-header">
              <div className="icon-sm"><Pill size={18} /></div>
              <h3>{isUrdu ? 'خوراک' : 'Dosage'}</h3>
            </div>
            <div className="info-content">
              {data.dosage}
            </div>
          </div>

          <div className="info-card stagger-3">
            <div className="info-header">
              <div className="icon-sm"><AlertTriangle size={18} /></div>
              <h3>{isUrdu ? 'مضر اثرات' : 'Side Effects'}</h3>
            </div>
            <div className="info-content">
              {data.sideEffects}
            </div>
          </div>

          <div className="info-card stagger-4">
            <div className="info-header">
              <div className="icon-sm"><ShieldAlert size={18} /></div>
              <h3>{isUrdu ? 'احتیاطی تدابیر' : 'Contraindications'}</h3>
            </div>
            <div className="info-content">
              {data.contraindications}
            </div>
          </div>

          {data.pregnancyCategory && (
            <div className="info-card stagger-4">
              <div className="info-header">
                <div className="icon-sm"><Baby size={18} /></div>
                <h3>{isUrdu ? 'حمل کیٹیگری' : 'Pregnancy Category'}</h3>
              </div>
              <div className="info-content">
                {data.pregnancyCategory}
              </div>
            </div>
          )}

          {/* Generic vs Brand Comp */}
          {data.genericVsBrand && (
            <div className="info-card info-card-full stagger-4" style={{ backgroundColor: '#fff', borderColor: 'var(--accent-light)' }}>
              <div className="info-header">
                <div className="icon-sm"><Scale size={18} /></div>
                <h3>{isUrdu ? 'جینرک بمقابلہ برانڈ موازنہ' : 'Generic vs Brand Comparison'}</h3>
                <Link to={`/compare?brand=${data.brandName}&generic=${data.genericName}`} style={{ marginLeft: 'auto', fontSize: 14, color: 'var(--accent-primary)', textDecoration: 'underline' }}>
                  {isUrdu ? 'تفصیلی موازنہ' : 'Detailed Compare'}
                </Link>
              </div>
              <div className="info-content">
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 16 }}>
                  <div style={{ padding: 16, border: '1px solid var(--border)', borderRadius: 12 }}>
                    <div className="badge badge-blue mb-2">Generic</div>
                    <h4>{data.genericVsBrand.genericName}</h4>
                    <p>Price: PKR {data.genericVsBrand.genericPricePKR}</p>
                    <p>Manufacturer: {data.genericVsBrand.genericManufacturer}</p>
                  </div>
                  <div style={{ padding: 16, border: '1px solid var(--border)', borderRadius: 12 }}>
                    <div className="badge badge-amber mb-2">Brand</div>
                    <h4>{data.genericVsBrand.brandName}</h4>
                    <p>Price: PKR {data.genericVsBrand.brandPricePKR}</p>
                    <p>Manufacturer: {data.genericVsBrand.brandManufacturer}</p>
                  </div>
                </div>
                <div className="badge badge-green" style={{ width: '100%', justifyContent: 'center', padding: 12, fontSize: 14 }}>
                  💡 {data.genericVsBrand.recommendation}
                </div>
              </div>
            </div>
          )}

          {/* Drug Interactions Safety Checker Tool */}
          <div className="info-card info-card-full stagger-4">
            <div className="info-header">
              <div className="icon-sm"><Network size={18} /></div>
              <h3>{isUrdu ? 'منشیات کے تعامل کی جانچ' : 'Drug Interaction & Safety Checker'}</h3>
            </div>
            <div className="info-content">
              <p style={{ marginBottom: 16 }}>{isUrdu ? 'کوئی اور دوا درج کر کے تعامل چیک کریں:' : 'Enter another medicine to check interaction:'}</p>
              <div className="flex gap-2" style={{ marginBottom: 24 }}>
                <input 
                  type="text" 
                  className="chat-input" 
                  placeholder={isUrdu ? 'مثال: Aspirin' : 'e.g. Aspirin'}
                  value={interactionInput}
                  onChange={e => setInteractionInput(e.target.value)}
                />
                <button className="btn-primary" onClick={handleInteractionCheck} disabled={interactionChecking}>
                  {interactionChecking ? (isUrdu ? 'چیک ہو رہا ہے...' : 'Checking...') : (isUrdu ? 'چیک کریں' : 'Check')}
                </button>
              </div>

              {interactionResult && (
                <div style={{ 
                  padding: 16, 
                  borderRadius: 12, 
                  backgroundColor: interactionResult.severity === 'Severe' ? '#fee2e2' : interactionResult.severity === 'Moderate' ? '#ffedd5' : interactionResult.severity === 'Mild' ? '#fef9c3' : '#dcfce7',
                  border: `1px solid ${interactionResult.severity === 'Severe' ? '#f87171' : interactionResult.severity === 'Moderate' ? '#fb923c' : interactionResult.severity === 'Mild' ? '#fde047' : '#86efac'}`,
                  marginBottom: 24
                }}>
                  <h4 style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8, color: '#1a1a1a' }}>
                    {interactionResult.severity === 'Severe' && <AlertTriangle color="red" />}
                    Severity: {interactionResult.severity}
                  </h4>
                  <p style={{ color: '#333' }}>{interactionResult.description}</p>
                  <p style={{ color: '#333', fontWeight: 600, marginTop: 8 }}>{interactionResult.recommendation}</p>
                </div>
              )}

              {data.knownInteractions && data.knownInteractions.length > 0 && (
                <div>
                  <h4 style={{ marginBottom: 8 }}>{isUrdu ? 'معلوم تعاملات:' : 'Known Interactions:'}</h4>
                  <div className="flex flex-wrap gap-2">
                    {data.knownInteractions.map(m => (
                      <span key={m} className="chip">{m}</span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Find Pharmacies Inline Card */}
          <div className="info-card info-card-full stagger-4" style={{ backgroundColor: '#F0F9FF', borderColor: '#BDE4FF' }}>
            <div className="info-header" style={{ borderColor: '#BDE4FF' }}>
              <div className="icon-sm" style={{ backgroundColor: 'white' }}><MapPin size={18} color="#0066CC" /></div>
              <h3 style={{ color: '#0044CC' }}>{isUrdu ? 'قریبی فارمیسی تلاش کریں' : 'Find Nearby Pharmacies'}</h3>
            </div>
            <div className="info-content flex flex-col sm:flex-row justify-between items-center gap-4">
              <p style={{ color: '#0055CC' }}>
                {isUrdu ? 'دیکھیں کہ آپ کے قریب کون سی فارمیسی کھلی ہے۔' : 'Quickly locate pharmacies near you that might carry this medicine.'}
              </p>
              <Link to="/pharmacies" className="btn-primary" style={{ backgroundColor: '#0066CC', whiteSpace: 'nowrap' }}>
                <Map size={18} /> {isUrdu ? 'نقشہ کھولیں' : 'Open Map'}
              </Link>
            </div>
          </div>
        </div>

        {/* Alternatives Section */}
        <div style={{ marginBottom: '80px' }}>
          <h2 style={{ fontSize: '32px', marginBottom: '8px' }}>{isUrdu ? 'متبادل ادویات' : 'Alternative Medicines'}</h2>
          <p className="text-muted" style={{ marginBottom: '24px' }}>{isUrdu ? 'ملتے جلتے علاج کے اثرات والی ادویات' : 'Similar medicines with comparable therapeutic effects'}</p>
          
          <div className="alt-grid">
            {data.alternatives?.map((alt, idx) => (
              <div 
                key={idx} 
                className="alt-card"
                onClick={() => navigate(`/result?q=${encodeURIComponent(alt.name)}`)}
              >
                <div className="flex justify-between items-start" style={{ marginBottom: '12px' }}>
                  <h4 className="alt-name">{alt.name}</h4>
                  <span className={`badge ${alt.type?.toLowerCase().includes('brand') ? 'badge-amber' : 'badge-blue'}`} style={{ padding: '4px 10px', fontSize: '11px' }}>
                    {alt.type || 'Generic'}
                  </span>
                </div>
                <p className="text-muted" style={{ fontSize: '14px', flex: 1 }}>{alt.description || (alt as any).note}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
