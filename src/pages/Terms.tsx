export const Terms = () => {
  const isUrdu = localStorage.getItem('medifinder_lang') === 'ur';

  return (
    <div className="fade-up container section">
      <h1 style={{ fontSize: 40, marginBottom: 32 }}>{isUrdu ? 'شرائط و ضوابط' : 'Terms & Conditions'}</h1>
      
      <div className="prose max-w-none" style={{ color: 'var(--text-secondary)', lineHeight: 1.8 }}>
        <p className="mb-6">Effective Date: April 25, 2026</p>

        <div className="disclaimer-box mb-8" style={{ backgroundColor: '#fee2e2', borderColor: '#f87171' }}>
          <strong style={{ color: '#dc2626' }}>CRITICAL MEDICAL DISCLAIMER:</strong> MediFinder AI is an informational tool powered by Artificial Intelligence. It is NOT a substitute for professional medical advice, diagnosis, or treatment. Always seek the advice of your physician or other qualified health provider with any questions you may have regarding a medical condition.
        </div>
        
        <section className="mb-8">
          <h2 style={{ color: 'var(--text-primary)', marginBottom: 16 }}>1. Acceptance of Terms</h2>
          <p>By accessing or using MediFinder AI, you agree to be bound by these Terms and Conditions and all applicable laws and regulations.</p>
        </section>

        <section className="mb-8">
          <h2 style={{ color: 'var(--text-primary)', marginBottom: 16 }}>2. Use License</h2>
          <p>Permission is granted to use MediFinder AI for personal, non-commercial transitory viewing only. This is the grant of a license, not a transfer of title, and under this license, you may not:</p>
          <ul className="list-disc ml-6 mt-4">
            <li>Modify or copy the materials;</li>
            <li>Use the materials for any commercial purpose;</li>
            <li>Attempt to decompile or reverse engineer any software contained in the platform;</li>
            <li>Remove any copyright or other proprietary notations from the materials.</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 style={{ color: 'var(--text-primary)', marginBottom: 16 }}>3. Limitations of Liability</h2>
          <p>In no event shall MediFinder AI or its developers (Danyal, RedHeart, CloudXify) be liable for any damages (including, without limitation, damages for loss of data or profit, or due to business interruption) arising out of the use or inability to use the materials on the platform, even if notified orally or in writing of the possibility of such damage.</p>
        </section>

        <section className="mb-8">
          <h2 style={{ color: 'var(--text-primary)', marginBottom: 16 }}>4. Accuracy of Materials</h2>
          <p>The materials appearing on MediFinder AI could include technical, typographical, or photographic errors. While we use advanced AI models, we do not warrant that any of the materials on its website are accurate, complete, or current. We may make changes to the materials contained on its website at any time without notice.</p>
        </section>

        <section className="mb-8">
          <h2 style={{ color: 'var(--text-primary)', marginBottom: 16 }}>5. External Links</h2>
          <p>MediFinder AI has not reviewed all of the sites linked to its website and is not responsible for the contents of any such linked site. The inclusion of any link does not imply endorsement by MediFinder AI. Use of any such linked website is at the user's own risk.</p>
        </section>

        <p className="mt-12 text-sm">© 2026 MediFinder AI | Powered by CloudXify</p>
      </div>
    </div>
  );
};
