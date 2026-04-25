import { ShieldCheck, Heart, Users, Target, Code, Cpu, ExternalLink } from 'lucide-react';

export const About = () => {
  const isUrdu = localStorage.getItem('medifinder_lang') === 'ur';

  const developers = [
    {
      name: 'CloudXify',
      role: 'Core Infrastructure',
      bio: 'Scaling AI solutions and modern web experiences. Specializing in high-performance cloud architectures and intelligent digital automation.',
      link: 'https://cloudexify.site'
    },
    {
      name: 'Mustafa Hussain',
      role: 'Software Engineer',
      bio: 'BSc Software Engineering student specializing in full-stack web development and AI chatbot integration. Passionate about building intelligent, scalable digital solutions.',
      link: 'https://mustafa-hussain-portfolio.vercel.app/'
    },
    {
      name: 'Shayan Abbas',
      role: 'Lead Developer',
      bio: 'BSc Software Engineering student focused on modern software architectures and high-impact digital products.',
      link: 'https://www.linkedin.com/in/shahyan-abbas-01b445404?utm_source=share_via&utm_content=profile&utm_medium=member_android'
    }
  ];

  return (
    <div className="fade-up">
      {/* Hero Section */}
      <section className="section text-center" style={{ backgroundColor: 'white' }}>
        <div className="container">
          <div className="flex justify-center mb-6">
            <span className="badge badge-green">{isUrdu ? 'ہمارے بارے میں' : 'About Us'}</span>
          </div>
          <h1 style={{ fontSize: 'clamp(32px, 5vw, 56px)', marginBottom: '24px' }}>
            {isUrdu ? 'صحت کی معلومات کو بہتر بنانا' : 'Empowering Healthcare Information'}
          </h1>
          <p className="text-muted mx-auto" style={{ maxWidth: '700px', fontSize: '18px' }}>
            {isUrdu
              ? 'میڈی فائنڈر اے آئی کا مقصد پیچیدہ طبی ڈیٹا اور عام لوگوں کے درمیان فرق کو ختم کرنا ہے۔'
              : 'MediFinder AI is dedicated to bridging the gap between complex medical data and everyday users through advanced artificial intelligence.'}
          </p>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="section container">
        <div className="features-grid">
          <div className="feature-card">
            <div className="icon-box"><Target size={24} /></div>
            <h3>{isUrdu ? 'ہمارا مشن' : 'Our Mission'}</h3>
            <p>{isUrdu
              ? 'ہر ایک کو قابل اعتماد اور آسانی سے سمجھنے والی طبی معلومات تک رسائی فراہم کرنا۔'
              : 'To provide everyone with access to reliable, easy-to-understand medical information at their fingertips.'}</p>
          </div>
          <div className="feature-card">
            <div className="icon-box"><Heart size={24} /></div>
            <h3>{isUrdu ? 'ہمارا وژن' : 'Our Vision'}</h3>
            <p>{isUrdu
              ? 'ایک ایسی دنیا جہاں ٹیکنالوجی صحت کے بہتر فیصلوں میں مددگار ثابت ہو۔'
              : 'A world where technology empowers better health decisions and improved patient outcomes globally.'}</p>
          </div>
          <div className="feature-card">
            <div className="icon-box"><ShieldCheck size={24} /></div>
            <h3>{isUrdu ? 'ہمارے اصول' : 'Our Values'}</h3>
            <p>{isUrdu
              ? 'درستگی، رازداری، اور صارف کی آسانی ہماری اولین ترجیحات ہیں۔'
              : 'Accuracy, privacy, and user accessibility are the core pillars of everything we build.'}</p>
          </div>
        </div>
      </section>

      {/* Developers Section */}
      <section className="section container">
        <div className="text-center mb-12">
          <h2 style={{ fontSize: 32 }}>{isUrdu ? 'ہماری ٹیم' : 'Meet the Developers'}</h2>
        </div>
        <div className="features-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))' }}>
          {developers.map((dev, i) => (
            <div key={i} className="info-card text-center" style={{ padding: 40, display: 'flex', flexDirection: 'column', height: '100%' }}>
              <div className="icon-box mx-auto mb-6"><Users size={32} /></div>
              <h3 style={{ fontSize: 24, marginBottom: 8 }}>{dev.name}</h3>
              <div className="badge badge-blue mb-4">{dev.role}</div>
              <p className="text-muted" style={{ fontSize: 14, flex: 1, marginBottom: 24 }}>{dev.bio}</p>
              {dev.link !== '#' && (
                <a
                  href={dev.link}
                  target="_blank"
                  rel="noreferrer"
                  className="btn-secondary"
                  style={{ alignSelf: 'center', padding: '8px 16px', fontSize: 14 }}
                >
                  View Portfolio <ExternalLink size={14} />
                </a>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Tech Stack */}
      <section className="section" style={{ backgroundColor: 'var(--accent-light)' }}>
        <div className="container text-center">
          <h2 style={{ marginBottom: 40 }}>{isUrdu ? 'ہماری ٹیکنالوجی' : 'Our Technology Stack'}</h2>
          <div className="flex flex-wrap justify-center gap-8">
            <div className="flex items-center gap-2 text-primary-accent" style={{ fontWeight: 600 }}>
              <Code size={20} /> Next.js & React
            </div>
            <div className="flex items-center gap-2 text-primary-accent" style={{ fontWeight: 600 }}>
              <Cpu size={20} /> Claude AI (OpenRouter)
            </div>
            <div className="flex items-center gap-2 text-primary-accent" style={{ fontWeight: 600 }}>
              <Heart size={20} /> CloudXify Infrastructure
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
