import { useState, useRef } from 'react';
import { UploadCloud, FileText, CheckCircle2, ArrowRight, Printer } from 'lucide-react';
import { analyzePrescription } from '../services/api';
import type { PrescriptionAnalysis } from '../types';
import { useNavigate } from 'react-router-dom';

export const Prescription = () => {
  const isUrdu = localStorage.getItem('medifinder_lang') === 'ur';
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<PrescriptionAnalysis | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selected = e.target.files[0];
      if (selected.size > 5 * 1024 * 1024) {
        setError(isUrdu ? 'فائل کا سائز 5MB سے کم ہونا چاہیے۔' : 'File size must be less than 5MB.');
        return;
      }
      setFile(selected);
      setError(null);

      const reader = new FileReader();
      reader.onload = (e) => setPreview(e.target?.result as string);
      reader.readAsDataURL(selected);
    }
  };

  const handleAnalyze = async () => {
    if (!preview || !file) return;
    setLoading(true);
    setError(null);
    try {
      const res = await analyzePrescription(preview, file.type);
      setResult(res);
    } catch (err: any) {
      setError(err.message || 'Failed to analyze document.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fade-up">
      <section className="section text-center" style={{ backgroundColor: 'white' }}>
        <div className="container">
          <div className="flex justify-center mb-6">
            <span className="badge badge-green">{isUrdu ? 'اے آئی ریڈر' : 'AI Reader'}</span>
          </div>
          <h1 style={{ fontSize: 'clamp(32px, 5vw, 56px)', marginBottom: '24px' }}>
            {isUrdu ? 'نسخہ سکینر' : 'Prescription Scanner'}
          </h1>
        </div>
      </section>

      <section className="section container">
        <div className="max-w-xl mx-auto mb-8">
          {!result && (
            <div 
              className="upload-zone"
              onClick={() => fileInputRef.current?.click()}
            >
              {preview ? (
                <div>
                  <CheckCircle2 size={48} color="var(--accent-primary)" className="mx-auto mb-4" />
                  <p style={{ fontWeight: 600 }}>{file?.name}</p>
                  <p className="text-muted" style={{ fontSize: 14 }}>Click to change file</p>
                </div>
              ) : (
                <div>
                  <UploadCloud size={48} color="var(--accent-primary)" className="mx-auto mb-4" />
                  <h3 style={{ marginBottom: 8 }}>{isUrdu ? 'اپنا نسخہ اپ لوڈ کریں' : '📄 Upload Your Prescription'}</h3>
                  <p className="text-muted">JPG, PNG, PDF (Max 5MB)</p>
                </div>
              )}
              <input 
                type="file" 
                ref={fileInputRef} 
                onChange={handleFileChange} 
                accept="image/jpeg,image/png,application/pdf"
                style={{ display: 'none' }}
              />
            </div>
          )}

          {error && (
            <div className="badge badge-amber w-full mt-4" style={{ padding: 16, justifyContent: 'center' }}>
              {error}
            </div>
          )}

          {!result && preview && (
            <button 
              className="btn-primary w-full justify-center" 
              style={{ marginTop: 24, padding: 16 }}
              onClick={handleAnalyze}
              disabled={loading}
            >
              <FileText size={20} />
              {loading ? (isUrdu ? 'تجزیہ ہو رہا ہے...' : 'Analyzing...') : (isUrdu ? 'تجزیہ کریں' : 'Analyze Prescription')}
            </button>
          )}
        </div>

        {result && (
          <div className="info-card fade-up mx-auto" style={{ maxWidth: 800 }}>
            <div className="flex justify-between items-center mb-6 border-b pb-4" style={{ borderColor: 'var(--border)' }}>
              <div>
                <h2 style={{ fontSize: 24 }}>{isUrdu ? 'تجزیاتی رپورٹ' : 'Analysis Report'}</h2>
                <p className="text-muted">{result.date}</p>
              </div>
              <button className="btn-secondary" onClick={() => window.print()}>
                <Printer size={18} /> {isUrdu ? 'پرنٹ کریں' : 'Download'}
              </button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 24 }}>
              <div>
                <p className="text-muted" style={{ fontSize: 14 }}>{isUrdu ? 'مریض کا نام' : 'Patient Name'}</p>
                <p style={{ fontWeight: 600, fontSize: 18 }}>{result.patientName}</p>
              </div>
              <div>
                <p className="text-muted" style={{ fontSize: 14 }}>{isUrdu ? 'ڈاکٹر کا نام' : 'Doctor Name'}</p>
                <p style={{ fontWeight: 600, fontSize: 18 }}>{result.doctorName}</p>
              </div>
            </div>

            <div className="mb-6">
              <span className="badge badge-blue" style={{ fontSize: 16, padding: '8px 16px' }}>
                Diagnosis: {result.diagnosis}
              </span>
            </div>

            <h3 style={{ marginBottom: 16 }}>{isUrdu ? 'ادویات' : 'Medicines'}</h3>
            <div style={{ overflowX: 'auto', marginBottom: 24 }}>
              <table style={{ width: '100%', textAlign: 'left', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ borderBottom: '2px solid var(--border)' }}>
                    <th style={{ padding: 12 }}>Medicine</th>
                    <th style={{ padding: 12 }}>Dosage</th>
                    <th style={{ padding: 12 }}>Frequency</th>
                    <th style={{ padding: 12 }}>Duration</th>
                  </tr>
                </thead>
                <tbody>
                  {result.medicines.map((m, i) => (
                    <tr key={i} style={{ borderBottom: '1px solid var(--border)' }}>
                      <td style={{ padding: 12 }}>
                        <button 
                          onClick={() => navigate(`/result?q=${encodeURIComponent(m.name)}`)}
                          style={{ color: 'var(--accent-primary)', fontWeight: 600, textDecoration: 'underline' }}
                        >
                          {m.name}
                        </button>
                        <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>{m.purpose}</div>
                      </td>
                      <td style={{ padding: 12 }}>{m.dosage}</td>
                      <td style={{ padding: 12 }}>{m.frequency}</td>
                      <td style={{ padding: 12 }}>{m.duration}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {result.specialInstructions && (
              <div className="disclaimer-box" style={{ marginTop: 0, marginBottom: 24, padding: 20 }}>
                <h4 style={{ marginBottom: 8, color: 'var(--warning-text)' }}>Special Instructions</h4>
                <p>{result.specialInstructions}</p>
              </div>
            )}

            {result.warnings && (
              <div className="disclaimer-box" style={{ marginTop: 0, padding: 20, backgroundColor: '#fee2e2', borderColor: '#f87171' }}>
                <h4 style={{ marginBottom: 8, color: '#dc2626' }}>Warnings</h4>
                <p style={{ color: '#dc2626' }}>{result.warnings}</p>
              </div>
            )}

            <button 
              className="btn-primary w-full justify-center" 
              style={{ marginTop: 24 }}
              onClick={() => navigate(`/result?q=${encodeURIComponent(result.medicines[0]?.name || '')}`)}
            >
              <ArrowRight size={20} /> {isUrdu ? 'پہلی دوا تلاش کریں' : 'Search First Medicine'}
            </button>
          </div>
        )}
        {/* FAQ Section */}
        <div className="max-w-3xl mx-auto mt-20 pt-10 border-t" style={{ borderColor: 'var(--border)' }}>
          <h2 className="text-center mb-10" style={{ fontSize: 28 }}>{isUrdu ? 'اکثر پوچھے گئے سوالات' : 'Frequently Asked Questions'}</h2>
          <div className="flex flex-col gap-6">
            <div className="info-card">
              <h4 style={{ marginBottom: 12 }}>{isUrdu ? 'نسخہ کیسے اپ لوڈ کریں؟' : 'How do I upload my prescription?'}</h4>
              <p className="text-muted">{isUrdu 
                ? 'اپنے نسخے کی تصویر کھینچیں یا پی ڈی ایف فائل اپ لوڈ کریں۔ یقینی بنائیں کہ لکھائی صاف اور پڑھنے کے قابل ہے۔' 
                : 'Simply take a clear photo of your prescription or upload a PDF file. Ensure the handwriting is legible and the lighting is good for the best results.'}</p>
            </div>
            <div className="info-card">
              <h4 style={{ marginBottom: 12 }}>{isUrdu ? 'کیا میری معلومات محفوظ ہیں؟' : 'Is my data secure?'}</h4>
              <p className="text-muted">{isUrdu 
                ? 'جی ہاں، ہم آپ کی تصاویر کو محفوظ نہیں کرتے۔ تجزیہ کے بعد فائل فوری طور پر ڈیلیٹ کر دی جاتی ہے۔' 
                : 'Yes. We process your images in real-time and do not store them on our servers. Your privacy is our top priority.'}</p>
            </div>
            <div className="info-card">
              <h4 style={{ marginBottom: 12 }}>{isUrdu ? 'کیا اے آئی غلطی کر سکتی ہے؟' : 'Can the AI make mistakes?'}</h4>
              <p className="text-muted">{isUrdu 
                ? 'اے آئی بہت درست ہے لیکن یہ سو فیصد یقینی نہیں ہے۔ ہمیشہ ڈاکٹر کی ہدایت پر عمل کریں۔' 
                : 'While our AI is highly advanced, handwriting can sometimes be misinterpreted. Always verify the results with a qualified pharmacist or doctor.'}</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
