import React, { useState, useEffect } from 'react';
import { Key, Save, CheckCircle2 } from 'lucide-react';
import { getApiKey, setApiKey } from '../services/api';

export const Settings = () => {
  const [key, setKey] = useState('');
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const existingKey = getApiKey();
    if (existingKey) {
      setKey(existingKey);
    }
  }, []);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (key.trim()) {
      setApiKey(key.trim());
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    }
  };

  return (
    <div className="container fade-in">
      <div className="card settings-card mt-12">
        <div className="text-center mb-8">
          <Key size={48} className="mx-auto mb-4" color="var(--accent-teal)" />
          <h1 className="font-display text-3xl mb-2">API Configuration</h1>
          <p className="text-muted">Enter your OpenRouter API key to power MediFinder AI.</p>
        </div>

        <form onSubmit={handleSave}>
          <div className="form-group">
            <label className="form-label" htmlFor="apiKey">OpenRouter API Key</label>
            <input
              type="password"
              id="apiKey"
              className="form-input"
              placeholder="sk-or-v1-..."
              value={key}
              onChange={(e) => setKey(e.target.value)}
            />
          </div>

          <div className="p-4 mb-6 rounded-lg" style={{ background: 'rgba(99, 179, 237, 0.1)', border: '1px solid rgba(99, 179, 237, 0.2)' }}>
            <h4 className="flex items-center gap-2 mb-2 text-accent-blue"><CheckCircle2 size={16} /> Privacy Assured</h4>
            <p className="text-sm text-muted">
              Your API key is stored locally in your browser's session storage. It is never transmitted to our servers or stored permanently.
            </p>
          </div>

          <button type="submit" className="btn btn-primary w-full" style={{ width: '100%' }} disabled={!key.trim()}>
            <Save size={18} /> Save Configuration
          </button>

          {saved && (
            <p className="text-center mt-4 text-accent-teal flex items-center justify-center gap-2">
              <CheckCircle2 size={16} /> Key saved to session storage successfully!
            </p>
          )}
        </form>
      </div>
    </div>
  );
};
