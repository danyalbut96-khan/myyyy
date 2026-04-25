export const PrivacyPolicy = () => {
  const isUrdu = localStorage.getItem('medifinder_lang') === 'ur';

  return (
    <div className="fade-up container section">
      <h1 style={{ fontSize: 40, marginBottom: 32 }}>{isUrdu ? 'پرائیویسی پالیسی' : 'Privacy Policy'}</h1>
      
      <div className="prose max-w-none" style={{ color: 'var(--text-secondary)', lineHeight: 1.8 }}>
        <p className="mb-6">Last Updated: April 25, 2026</p>
        
        <section className="mb-8">
          <h2 style={{ color: 'var(--text-primary)', marginBottom: 16 }}>1. Information We Collect</h2>
          <p>MediFinder AI is designed with a "Privacy First" approach. We do not require account creation, and we do not store personal identifying information on our servers. The only data processed is the medicine names or images you provide for analysis.</p>
        </section>

        <section className="mb-8">
          <h2 style={{ color: 'var(--text-primary)', marginBottom: 16 }}>2. How We Use Your Data</h2>
          <p>Queries are sent to third-party AI models (via OpenRouter) to generate medical information. This data is processed in real-time and is not used for profiling or advertising. Images uploaded for prescription scanning are processed and then immediately discarded from temporary memory.</p>
        </section>

        <section className="mb-8">
          <h2 style={{ color: 'var(--text-primary)', marginBottom: 16 }}>3. Local Storage</h2>
          <p>Your search history and chat logs are stored <strong>locally on your device</strong> using browser LocalStorage. This data never leaves your device unless you choose to share it. You can clear this data at any time through the application settings or by clearing your browser cache.</p>
        </section>

        <section className="mb-8">
          <h2 style={{ color: 'var(--text-primary)', marginBottom: 16 }}>4. Third-Party Services</h2>
          <p>We use Google Maps API for pharmacy location services. Google may collect location data in accordance with their own privacy policy. We also use OpenRouter to access AI models; please refer to OpenRouter's privacy policy for details on their data handling.</p>
        </section>

        <section className="mb-8">
          <h2 style={{ color: 'var(--text-primary)', marginBottom: 16 }}>5. Data Security</h2>
          <p>We implement industry-standard encryption for data in transit (SSL/TLS). However, no method of transmission over the internet is 100% secure.</p>
        </section>

        <div className="disclaimer-box mt-12">
          <strong>Contact Us:</strong> For privacy-related inquiries, please contact the CloudXify team at privacy@cloudxify.site.
        </div>
      </div>
    </div>
  );
};
