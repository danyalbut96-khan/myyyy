export const PrivacyPolicy = () => {
  return (
    <div className="fade-up">
      <section className="section text-center" style={{ backgroundColor: 'white' }}>
        <div className="container">
          <div className="flex justify-center mb-6">
            <span className="badge badge-amber">Legal Documentation</span>
          </div>
          <h1 style={{ fontSize: 'clamp(32px, 5vw, 56px)' }}>Privacy Policy</h1>
        </div>
      </section>

      <section className="section container">
        <div className="prose">
          <h2>1. Data Collection</h2>
          <p>
            MediFinder AI is designed with privacy as a core principle. We do not require account creation 
            and we do not collect personally identifiable health information (PHI). 
            Your search queries are processed in real-time and are not linked to your identity.
          </p>

          <h2>2. Local Storage</h2>
          <p>
            To improve your experience, we use your browser's local storage to save your recent search history. 
            This data never leaves your device and is never transmitted to our servers. You can clear this history 
            at any time directly from the homepage.
          </p>

          <h2>3. Third-Party APIs</h2>
          <p>
            When you search for a medication, the search term is sent securely to our AI provider (OpenRouter/Claude AI) 
            to generate the medical details. The API providers are strictly bound by their own data processing 
            agreements and do not use your queries to train their public models.
          </p>

          <h2>4. Cookies & Analytics</h2>
          <p>
            We may use basic, anonymized analytics to monitor website performance and errors. 
            We do not use tracking cookies for advertising purposes.
          </p>

          <div className="disclaimer-box" style={{ backgroundColor: 'var(--accent-light)', borderColor: 'var(--border)' }}>
            <h3 style={{ color: 'var(--accent-primary)' }}>Questions about privacy?</h3>
            <p style={{ color: 'var(--text-secondary)' }}>
              If you have any questions regarding how we handle your data, please contact our support team.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};
