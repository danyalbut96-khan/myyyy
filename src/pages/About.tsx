export const About = () => {
  return (
    <div className="container fade-in">
      <div className="prose card mt-12">
        <h1 className="text-gradient">About MediFinder AI</h1>
        
        <p>
          MediFinder AI is a cutting-edge platform designed to demystify complex medical information. 
          By leveraging advanced artificial intelligence, we provide users with instantly accessible, 
          comprehensive details about thousands of medications.
        </p>

        <h2>Our Mission</h2>
        <p>
          Our mission is to empower individuals with accurate, easy-to-understand pharmaceutical knowledge. 
          We believe that everyone deserves to know exactly what they are putting into their bodies, 
          the potential side effects, and viable alternatives.
        </p>

        <h2>The Team</h2>
        <p>
          We are a dedicated group of technologists and healthcare advocates committed to building 
          bridges between complex medical databases and everyday consumers.
        </p>

        <div className="mt-8 p-6" style={{ background: 'rgba(255,255,255,0.03)', borderRadius: '0.75rem', border: '1px solid rgba(255,255,255,0.1)' }}>
          <h3 className="mb-2 text-accent-teal">Disclaimer</h3>
          <p className="text-sm">
            MediFinder AI is an informational tool powered by artificial intelligence. While we strive for accuracy, 
            AI-generated content can occasionally be incomplete or outdated. Always consult with a qualified 
            healthcare provider, pharmacist, or physician before starting, stopping, or changing any medication regimen.
          </p>
        </div>
      </div>
    </div>
  );
};
