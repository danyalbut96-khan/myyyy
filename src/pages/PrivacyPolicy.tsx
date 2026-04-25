import React from 'react';

export const PrivacyPolicy = () => {
  return (
    <div className="container fade-in">
      <div className="prose card mt-12">
        <h1 className="text-gradient">Privacy Policy</h1>
        
        <p>Last updated: {new Date().toLocaleDateString()}</p>
        
        <h2>1. Information Collection</h2>
        <p>
          MediFinder AI operates predominantly as a client-side application. We do not maintain a backend database
          of user searches or personal profiles. Your search queries are sent directly to the AI service provider (OpenRouter).
        </p>

        <h2>2. API Key Storage</h2>
        <p>
          Your OpenRouter API key is securely stored in your browser's local Session Storage. It is never transmitted 
          to our servers or recorded by MediFinder AI. Clearing your browser session or cache will immediately remove 
          the stored key.
        </p>

        <h2>3. Third-Party Services</h2>
        <p>
          We utilize OpenRouter AI to process medication searches. By using our platform, you agree to their data 
          handling policies. We recommend avoiding entering personally identifiable health information (PHI) into 
          the search bar.
        </p>

        <h2>4. Cookies and Analytics</h2>
        <p>
          We may use minimal local storage purely for functional purposes (like storing your API key). We do not use 
          tracking cookies for targeted advertising.
        </p>
      </div>
    </div>
  );
};
