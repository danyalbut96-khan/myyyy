import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Scale } from 'lucide-react';
import { fetchMedicineDetails } from '../services/api';

export const Compare = () => {
  const isUrdu = localStorage.getItem('medifinder_lang') === 'ur';
  const [searchParams] = useSearchParams();
  const initialBrand = searchParams.get('brand') || '';
  // const initialGeneric = searchParams.get('generic') || '';

  const [brand, setBrand] = useState(initialBrand);
  // const [generic, setGeneric] = useState(initialGeneric);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);

  useEffect(() => {
    if (initialBrand) {
      handleCompare(initialBrand);
    }
  }, [initialBrand]);

  const handleCompare = async (queryBrand: string) => {
    if (!queryBrand) return;
    setLoading(true);
    try {
      const res = await fetchMedicineDetails(queryBrand);
      if (res.genericVsBrand) {
        setResult(res.genericVsBrand);
        // setGeneric(res.genericVsBrand.genericName);
      }
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
            <span className="badge badge-blue">{isUrdu ? 'موازنہ' : 'Compare'}</span>
          </div>
          <h1 style={{ fontSize: 'clamp(32px, 5vw, 56px)', marginBottom: '24px' }}>
            {isUrdu ? 'جینرک بمقابلہ برانڈ' : 'Generic vs Brand'}
          </h1>
        </div>
      </section>

      <section className="section container">
        <div className="max-w-xl mx-auto mb-8">
          <div className="feature-card">
            <div className="flex flex-col md:flex-row gap-4 items-center">
              <input
                type="text"
                className="search-input"
                placeholder={isUrdu ? 'برانڈ کا نام' : 'Brand Name'}
                value={brand}
                onChange={e => setBrand(e.target.value)}
                style={{ padding: '16px 24px' }}
              />
            </div>
            <button 
              className="btn-primary w-full justify-center" 
              style={{ marginTop: 24, padding: '16px' }}
              onClick={() => handleCompare(brand)}
              disabled={loading || !brand}
            >
              <Scale size={20} /> 
              {loading ? (isUrdu ? 'چیک ہو رہا ہے...' : 'Comparing...') : (isUrdu ? 'موازنہ کریں' : 'Compare')}
            </button>
          </div>
        </div>

        {result && (
          <div className="info-card fade-up mx-auto" style={{ maxWidth: 800 }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 40 }}>
              <div>
                <div className="badge badge-blue mb-4">Generic</div>
                <h3 style={{ fontSize: 24, marginBottom: 16 }}>{result.genericName}</h3>
                <div className="prose">
                  <p><strong>Price:</strong> PKR {result.genericPricePKR}</p>
                  <p><strong>Manufacturer:</strong> {result.genericManufacturer}</p>
                  <p><strong>Approval:</strong> {result.approvalStatus}</p>
                </div>
              </div>
              
              <div>
                <div className="badge badge-amber mb-4">Brand</div>
                <h3 style={{ fontSize: 24, marginBottom: 16 }}>{result.brandName}</h3>
                <div className="prose">
                  <p><strong>Price:</strong> PKR {result.brandPricePKR}</p>
                  <p><strong>Manufacturer:</strong> {result.brandManufacturer}</p>
                  <p><strong>Approval:</strong> {result.approvalStatus}</p>
                </div>
              </div>
            </div>

            <div style={{ marginTop: 40, paddingTop: 24, borderTop: '1px solid var(--border)' }}>
              <p style={{ marginBottom: 16 }}><strong>Bioavailability:</strong> {result.bioavailability}</p>
              <div className="badge badge-green" style={{ width: '100%', justifyContent: 'center', padding: 16, fontSize: 16, whiteSpace: 'normal', textAlign: 'center' }}>
                💡 {result.recommendation}
              </div>
            </div>
          </div>
        )}
      </section>
    </div>
  );
};
