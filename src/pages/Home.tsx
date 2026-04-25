import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Pill, ArrowRight } from 'lucide-react';
import { hasApiKey } from '../services/api';

const SAMPLE_MEDICINES = ['Paracetamol', 'Amoxicillin', 'Omeprazole', 'Ibuprofen', 'Lisinopril'];

export const Home = () => {
  const [query, setQuery] = useState('');
  const navigate = useNavigate();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;
    
    if (!hasApiKey()) {
      alert('Please set your OpenRouter API key in Settings first.');
      navigate('/settings');
      return;
    }
    
    navigate(`/result?q=${encodeURIComponent(query)}`);
  };

  const handleChipClick = (med: string) => {
    if (!hasApiKey()) {
      alert('Please set your OpenRouter API key in Settings first.');
      navigate('/settings');
      return;
    }
    navigate(`/result?q=${encodeURIComponent(med)}`);
  };

  return (
    <div className="container fade-in pt-20">
      <h1 className="hero-title">
        Discover <span className="text-gradient">Medicine</span> Details Instantly
      </h1>
      <p className="hero-subtitle">
        Enter any medicine name to get comprehensive, AI-powered details including composition, uses, dosage, side effects, and alternatives.
      </p>

      <form onSubmit={handleSearch} className="search-container mb-8">
        <Search className="text-muted" style={{ position: 'absolute', left: '1.5rem', top: '50%', transform: 'translateY(-50%)' }} size={20} />
        <input
          type="text"
          className="search-input"
          style={{ paddingLeft: '3.5rem' }}
          placeholder="e.g. Paracetamol, Adderall, Lipitor..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <button type="submit" className="search-button" disabled={!query.trim()}>
          <ArrowRight size={20} />
        </button>
      </form>

      <div className="text-center">
        <p className="text-muted mb-4 text-sm">Or try one of these common medicines:</p>
        <div className="chips-container">
          {SAMPLE_MEDICINES.map((med) => (
            <div key={med} className="chip" onClick={() => handleChipClick(med)}>
              <Pill size={14} />
              {med}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
