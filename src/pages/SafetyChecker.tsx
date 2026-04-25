import { useState } from 'react';
import { ShieldAlert, ArrowRight, AlertTriangle } from 'lucide-react';
import { checkInteraction } from '../services/api';
import type { InteractionResult } from '../types';

export const SafetyChecker = () => {
  const isUrdu = localStorage.getItem('medifinder_lang') === 'ur';
  const [med1, setMed1] = useState('');
  const [med2, setMed2] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<InteractionResult | null>(null);

  const handleCheck = async () => {
    if (!med1 || !med2) return;
    setLoading(true);
    try {
      const res = await checkInteraction(med1, med2);
      setResult(res);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fade-up">
      <section className="section text-center" style={{ backgroundColor: 'white' }}>
        <div className="container">
          <div className="flex justify-center mb-6">
            <span className="badge badge-amber">{isUrdu ? 'حفاظتی جانچ' : 'Safety Checker'}</span>
          </div>
          <h1 style={{ fontSize: 'clamp(32px, 5vw, 56px)', marginBottom: '24px' }}>
            {isUrdu ? 'منشیات کے تعامل کی جانچ' : 'Drug Interaction Checker'}
          </h1>
          <p className="text-muted mx-auto" style={{ maxWidth: '600px', fontSize: '18px' }}>
            {isUrdu 
              ? 'دو ادویات درج کریں تاکہ معلوم ہو سکے کہ آیا انہیں ایک ساتھ لینا محفوظ ہے۔' 
              : 'Enter two medicines to see if they are safe to take together.'}
          </p>
        </div>
      </section>

      <section className="section container">
        <div className="max-w-xl mx-auto">
          <div className="feature-card" style={{ marginBottom: 40 }}>
            <div className="flex flex-col md:flex-row gap-4 items-center">
              <input
                type="text"
                className="search-input"
                placeholder={isUrdu ? 'پہلی دوا' : 'Medicine 1'}
                value={med1}
                onChange={e => setMed1(e.target.value)}
                style={{ padding: '16px 24px' }}
              />
              <ArrowRight size={24} className="text-muted hidden md:block" />
              <input
                type="text"
                className="search-input"
                placeholder={isUrdu ? 'دوسری دوا' : 'Medicine 2'}
                value={med2}
                onChange={e => setMed2(e.target.value)}
                style={{ padding: '16px 24px' }}
              />
            </div>
            <button 
              className="btn-primary w-full justify-center" 
              style={{ marginTop: 24, padding: '16px' }}
              onClick={handleCheck}
              disabled={loading || !med1 || !med2}
            >
              <ShieldAlert size={20} /> 
              {loading ? (isUrdu ? 'چیک ہو رہا ہے...' : 'Checking...') : (isUrdu ? 'تعامل چیک کریں' : 'Check Interaction')}
            </button>
          </div>

          {result && (
            <div className="info-card fade-up" style={{ 
              backgroundColor: result.severity === 'Severe' ? '#fee2e2' : result.severity === 'Moderate' ? '#ffedd5' : result.severity === 'Mild' ? '#fef9c3' : '#dcfce7',
              borderColor: result.severity === 'Severe' ? '#f87171' : result.severity === 'Moderate' ? '#fb923c' : result.severity === 'Mild' ? '#fde047' : '#86efac'
            }}>
              <div className="info-header" style={{ borderColor: 'rgba(0,0,0,0.1)' }}>
                {result.severity === 'Severe' && <div className="icon-sm" style={{ backgroundColor: '#fef2f2', color: 'red' }}><AlertTriangle size={18} /></div>}
                <h3 style={{ margin: 0, color: '#1a1a1a' }}>Severity: {result.severity}</h3>
              </div>
              <div className="info-content" style={{ color: '#333' }}>
                <p style={{ marginBottom: 16 }}>{result.description}</p>
                <div className="badge" style={{ backgroundColor: 'white', color: '#1a1a1a', padding: '12px 20px', display: 'flex', fontSize: 16 }}>
                  💡 {result.recommendation}
                </div>
              </div>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};
