export const About = () => {
  return (
    <div className="fade-up">
      {/* Hero Section */}
      <section className="section text-center" style={{ backgroundColor: 'white' }}>
        <div className="container">
          <div className="flex justify-center mb-6">
            <span className="badge badge-green">About MediFinder AI</span>
          </div>
          
          <h1 style={{ fontSize: 'clamp(36px, 6vw, 64px)', marginBottom: '24px' }}>
            Bridging Medicine &<br />
            <i className="text-primary-accent">Technology</i>
          </h1>
          
          <p className="text-muted mx-auto" style={{ maxWidth: '600px', fontSize: '18px', fontWeight: 300 }}>
            We leverage advanced artificial intelligence to make complex medical data accessible, understandable, and actionable for everyone.
          </p>
        </div>
      </section>

      {/* Content Section */}
      <section className="section container">
        <div className="prose">
          <h2>Our Mission</h2>
          <p>
            MediFinder AI was created with a singular vision: to democratize medical information. 
            Navigating pharmaceutical details, understanding chemical compositions, and identifying potential 
            side effects shouldn't require a medical degree. We aim to bridge the gap between complex medical 
            jargon and everyday understanding.
          </p>
          <p>
            By synthesizing vast amounts of medical data into clear, actionable insights, we empower 
            individuals to make informed decisions about their health while providing a valuable reference 
            tool for healthcare professionals.
          </p>

          <h2>How It Works</h2>
          <p>
            When you search for a medication, MediFinder AI utilizes state-of-the-art Large Language Models, 
            specifically <strong>Claude AI</strong>, to instantly query, analyze, and structure pharmaceutical data.
          </p>
          <p>
            The system cross-references active ingredients, dosages, and interactions to generate a comprehensive 
            profile of the requested medicine. It even identifies comparable therapeutic alternatives to help users 
            understand generic vs. brand-name options available in the market.
          </p>

          <h2>Technology Stack</h2>
          <div className="flex gap-4" style={{ marginTop: '24px', flexWrap: 'wrap' }}>
            <span className="badge" style={{ backgroundColor: '#000', color: '#fff' }}>Next.js / React</span>
            <span className="badge" style={{ backgroundColor: '#D97757', color: '#fff' }}>Claude AI</span>
            <span className="badge" style={{ backgroundColor: '#000', color: '#fff' }}>Vercel</span>
          </div>

          <div className="disclaimer-box">
            <h3><span style={{ fontSize: '20px' }}>⚠️</span> Disclaimer</h3>
            <p>
              MediFinder AI is an informational tool and is not a substitute for professional medical advice, 
              diagnosis, or treatment. Always seek the advice of your physician or other qualified health provider 
              with any questions you may have regarding a medical condition or medication.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};
