import { useState, useEffect, useRef } from 'react';
import { MapPin, Navigation, Star, Loader2 } from 'lucide-react';

declare global {
  interface Window {
    google: any;
  }
}

export const Pharmacies = () => {
  const isUrdu = localStorage.getItem('medifinder_lang') === 'ur';
  const [pharmacies, setPharmacies] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const mapRef = useRef<HTMLDivElement>(null);
  const [map, setMap] = useState<any>(null);

  useEffect(() => {
    if (window.google && mapRef.current && !map) {
      const initialMap = new window.google.maps.Map(mapRef.current, {
        center: { lat: 31.5204, lng: 74.3587 }, // Default Lahore
        zoom: 14,
        styles: [
          {
            "featureType": "poi.medical",
            "elementType": "geometry",
            "stylers": [{ "color": "#f1f8e9" }]
          }
        ]
      });
      setMap(initialMap);
      getUserLocation(initialMap);
    }
  }, [mapRef, map]);

  const getUserLocation = (currentMap: any) => {
    setLoading(true);
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const pos = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };
          currentMap.setCenter(pos);
          searchPharmacies(pos, currentMap);
        },
        () => {
          setError(isUrdu ? "مقام تک رسائی ناکام رہی۔" : "Error: The Geolocation service failed.");
          setLoading(false);
        }
      );
    } else {
      setError(isUrdu ? "آپ کا براؤزر مقام کی معلومات کو سپورٹ نہیں کرتا۔" : "Error: Your browser doesn't support geolocation.");
      setLoading(false);
    }
  };

  const searchPharmacies = (location: { lat: number, lng: number }, currentMap: any) => {
    const service = new window.google.maps.places.PlacesService(currentMap);
    const request = {
      location: location,
      radius: '5000',
      type: ['pharmacy']
    };

    service.nearbySearch(request, (results: any, status: any) => {
      if (status === window.google.maps.places.PlacesServiceStatus.OK) {
        const processedResults = results.map((place: any) => ({
          id: place.place_id,
          name: place.name,
          address: place.vicinity,
          rating: place.rating || 0,
          open: place.opening_hours?.isOpen() || false,
          location: place.geometry.location,
          distance: calculateDistance(location.lat, location.lng, place.geometry.location.lat(), place.geometry.location.lng())
        }));
        setPharmacies(processedResults);
        
        // Add markers
        processedResults.forEach((place: any) => {
          new window.google.maps.Marker({
            position: place.location,
            map: currentMap,
            title: place.name,
            icon: {
              url: 'http://maps.google.com/mapfiles/ms/icons/green-dot.png'
            }
          });
        });
      }
      setLoading(false);
    });
  };

  const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number) => {
    const R = 6371; // km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return (R * c).toFixed(1) + ' km';
  };

  return (
    <div className="fade-up" style={{ display: 'flex', height: 'calc(100vh - 104px)' }}>
      {/* Left Panel */}
      <div style={{ width: '400px', backgroundColor: 'var(--surface)', borderRight: '1px solid var(--border)', display: 'flex', flexDirection: 'column' }}>
        <div style={{ padding: 20, borderBottom: '1px solid var(--border)' }}>
          <h2 style={{ fontSize: 24, marginBottom: 16 }}>{isUrdu ? 'قریبی فارمیسی' : 'Nearby Pharmacies'}</h2>
          <div className="flex gap-2">
            <span className="badge badge-green">{isUrdu ? 'کھلی ہیں' : 'Open Now'}</span>
            <button 
              onClick={() => map && getUserLocation(map)}
              className="badge" 
              style={{ backgroundColor: '#eee', border: 'none' }}
            >
              {isUrdu ? 'موجودہ مقام استعمال کریں' : 'Use Current Location'}
            </button>
          </div>
        </div>
        
        <div style={{ flex: 1, overflowY: 'auto', padding: 20 }}>
          {loading ? (
            <div className="text-center text-muted" style={{ marginTop: 40 }}>
              <Loader2 className="mx-auto mb-4 animate-spin" size={32} />
              {isUrdu ? 'تلاش ہو رہا ہے...' : 'Searching nearby...'}
            </div>
          ) : error ? (
            <div className="text-center text-muted" style={{ marginTop: 40 }}>{error}</div>
          ) : pharmacies.length === 0 ? (
            <div className="text-center text-muted" style={{ marginTop: 40 }}>{isUrdu ? 'کوئی فارمیسی نہیں ملی۔' : 'No pharmacies found nearby.'}</div>
          ) : (
            pharmacies.map(p => (
              <div key={p.id} className="pharmacy-card" onClick={() => map.setCenter(p.location)}>
                {/* ... existing card content ... */}
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
                  <a 
                    href={`https://www.google.com/maps/dir/?api=1&destination=${p.location.lat()},${p.location.lng()}`} 
                    target="_blank" 
                    rel="noreferrer"
                    className="btn-secondary" 
                    style={{ padding: '6px 12px', fontSize: 12 }}
                  >
                    <Navigation size={14} /> {isUrdu ? 'راستہ' : 'Directions'}
                  </a>
                </div>
              </div>
            ))
          )}
          
          <div style={{ marginTop: 40, paddingTop: 20, borderTop: '1px solid var(--border)' }}>
            <h4 style={{ marginBottom: 12 }}>{isUrdu ? 'اکثر پوچھے گئے سوالات' : 'Pharmacy Finder FAQ'}</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div style={{ fontSize: 13 }}>
                <strong>{isUrdu ? 'مقام کیسے تلاش کریں؟' : 'How does it find my location?'}</strong>
                <p className="text-muted">{isUrdu ? 'ہم آپ کے براؤزر کا جیو لوکیشن استعمال کرتے ہیں۔' : 'We use your browser\'s secure Geolocation API to find pharmacies near you.'}</p>
              </div>
              <div style={{ fontSize: 13 }}>
                <strong>{isUrdu ? 'کیا یہ معلومات درست ہیں؟' : 'Is the information accurate?'}</strong>
                <p className="text-muted">{isUrdu ? 'یہ ڈیٹا براہ راست گوگل میپس سے حاصل کیا جاتا ہے۔' : 'Data is fetched in real-time from Google Maps. Check the "Open Now" status before visiting.'}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Panel (Map) */}
      <div ref={mapRef} style={{ flex: 1, backgroundColor: '#e5e7eb' }}>
        {!window.google && (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', flexDirection: 'column' }}>
            <Loader2 className="animate-spin mb-4" size={48} />
            <p>Loading Google Maps...</p>
          </div>
        )}
      </div>
    </div>
  );
};
