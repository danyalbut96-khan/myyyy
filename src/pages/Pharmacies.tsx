import { useState, useEffect } from 'react';
import { MapPin, Navigation, Star } from 'lucide-react';

export const Pharmacies = () => {
  const isUrdu = localStorage.getItem('medifinder_lang') === 'ur';
  const [pharmacies, setPharmacies] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Note: To implement actual Google Maps Places API:
    // 1. Add <script src="https://maps.googleapis.com/maps/api/js?key=YOUR_API_KEY&libraries=places"></script> to index.html
    // 2. Use navigator.geolocation.getCurrentPosition
    // 3. Use new google.maps.places.PlacesService(map).nearbySearch
    // 
    // For now, since the user asked to put a placeholder for the API key,
    // I am simulating a response to demonstrate the UI.
    
    const simulateFetch = () => {
      setLoading(true);
      setTimeout(() => {
        setPharmacies([
          { id: 1, name: 'Fazal Din Pharma Plus', address: 'Main Boulevard, Lahore', distance: '0.8 km', rating: 4.5, open: true },
          { id: 2, name: 'Servaid Pharmacy', address: 'DHA Phase 5, Lahore', distance: '1.2 km', rating: 4.2, open: true },
          { id: 3, name: 'Clinix Pharmacy', address: 'Model Town, Lahore', distance: '2.5 km', rating: 4.0, open: false },
        ]);
        setLoading(false);
      }, 1000);
    };

    simulateFetch();
  }, []);

  return (
    <div className="fade-up" style={{ display: 'flex', height: 'calc(100vh - 104px)' }}>
      {/* Left Panel */}
      <div style={{ width: '400px', backgroundColor: 'var(--surface)', borderRight: '1px solid var(--border)', display: 'flex', flexDirection: 'column' }}>
        <div style={{ padding: 20, borderBottom: '1px solid var(--border)' }}>
          <h2 style={{ fontSize: 24, marginBottom: 16 }}>{isUrdu ? 'قریبی فارمیسی' : 'Nearby Pharmacies'}</h2>
          <div className="flex gap-2">
            <span className="badge badge-green">Open Now</span>
            <span className="badge" style={{ backgroundColor: '#eee' }}>Rated 4+</span>
          </div>
        </div>
        
        <div style={{ flex: 1, overflowY: 'auto', padding: 20 }}>
          {loading ? (
            <div className="text-center text-muted" style={{ marginTop: 40 }}>{isUrdu ? 'تلاش ہو رہا ہے...' : 'Searching...'}</div>
          ) : (
            pharmacies.map(p => (
              <div key={p.id} className="pharmacy-card">
                <h3 style={{ fontSize: 18, marginBottom: 8 }}>{p.name}</h3>
                <p className="text-muted" style={{ fontSize: 14, marginBottom: 8 }}>{p.address}</p>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-1 text-secondary" style={{ fontSize: 14 }}>
                    <MapPin size={14} /> {p.distance}
                  </div>
                  <div className="flex items-center gap-1" style={{ color: '#fbbf24', fontSize: 14 }}>
                    <Star size={14} fill="currentColor" /> {p.rating}
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className={`badge ${p.open ? 'badge-green' : 'badge-amber'}`}>
                    {p.open ? (isUrdu ? 'کھلی ہے' : 'Open Now') : (isUrdu ? 'بند ہے' : 'Closed')}
                  </span>
                  <button className="btn-secondary" style={{ padding: '6px 12px', fontSize: 12 }}>
                    <Navigation size={14} /> {isUrdu ? 'راستہ' : 'Directions'}
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Right Panel (Map Placeholder) */}
      <div style={{ flex: 1, backgroundColor: '#e5e7eb', position: 'relative' }}>
        <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', color: '#6b7280' }}>
          <MapPin size={48} style={{ marginBottom: 16 }} />
          <p>Google Maps Integration Placeholder</p>
          <p style={{ fontSize: 14 }}>Add NEXT_PUBLIC_GOOGLE_MAPS_API_KEY to your environment</p>
        </div>
      </div>
    </div>
  );
};
