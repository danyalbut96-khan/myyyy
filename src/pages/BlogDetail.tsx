import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Clock, Calendar, Share2, Globe, Send, Link as LinkIcon, MessageSquare } from 'lucide-react';
import { MOCK_BLOGS, type Blog } from '../services/api';

export const BlogDetail = () => {
  const { id } = useParams();
  const [blog, setBlog] = useState<Blog | null>(null);
  const isUrdu = localStorage.getItem('medifinder_lang') === 'ur';

  useEffect(() => {
    const foundBlog = MOCK_BLOGS.find(b => b.id === id);
    if (foundBlog) {
      setBlog(foundBlog);
      window.scrollTo(0, 0);
    }
  }, [id]);

  if (!blog) return <div className="container section text-center">Blog not found</div>;

  return (
    <div className="fade-up">
      {/* Blog Header */}
      <div style={{ backgroundColor: 'var(--bg-color)', borderBottom: '1px solid var(--border)', padding: '60px 0' }}>
        <div className="container">
          <Link to="/" className="flex items-center gap-2 text-muted mb-8 hover:text-primary-accent transition-colors">
            <ArrowLeft size={18} /> {isUrdu ? 'واپس ہوم پیج پر' : 'Back to Home'}
          </Link>
          
          <div className="flex items-center gap-2 text-primary-accent font-semibold mb-4">
            <span className="badge badge-green">{blog.category}</span>
          </div>
          
          <h1 style={{ fontSize: 'clamp(32px, 5vw, 48px)', lineHeight: 1.2, marginBottom: '24px', fontWeight: 800 }}>
            {blog.title}
          </h1>
          
          <div className="flex flex-wrap items-center gap-6 text-muted">
            <div className="flex items-center gap-2">
              <div style={{ width: 40, height: 40, borderRadius: '50%', backgroundColor: 'var(--accent-primary)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700 }}>
                {blog.author[0]}
              </div>
              <div>
                <div style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text-main)' }}>{blog.author}</div>
                <div style={{ fontSize: '12px' }}>{isUrdu ? 'طبی ماہر' : 'Medical Expert'}</div>
              </div>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Calendar size={16} /> {blog.date}
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Clock size={16} /> {blog.readTime} {isUrdu ? 'مطالعہ' : 'read'}
            </div>
          </div>
        </div>
      </div>

      {/* Blog Content */}
      <article className="container section">
        <div className="max-w-4xl mx-auto">
          {/* Main Image */}
          <div className="mb-12" style={{ borderRadius: '24px', overflow: 'hidden', boxShadow: '0 20px 40px rgba(0,0,0,0.1)' }}>
            <img src={blog.image} alt={blog.title} style={{ width: '100%', height: 'auto', display: 'block' }} />
          </div>

          {/* Article Text */}
          <div className="markdown-content" style={{ fontSize: '18px', lineHeight: 1.8, color: 'var(--text-main)' }}>
            {blog.content.split('\n\n').map((paragraph, idx) => (
              <p key={idx} style={{ marginBottom: '24px' }}>{paragraph}</p>
            ))}
          </div>

          {/* Secondary Image */}
          {blog.image2 && (
            <div className="my-12" style={{ borderRadius: '24px', overflow: 'hidden' }}>
              <img src={blog.image2} alt="Supplementary content" style={{ width: '100%', height: 'auto', display: 'block' }} />
            </div>
          )}

          {/* Share Section */}
          <div style={{ marginTop: '60px', padding: '32px', backgroundColor: 'var(--surface-alt)', borderRadius: '24px', border: '1px solid var(--border)' }}>
            <div className="flex flex-wrap items-center justify-between gap-6">
              <div>
                <h3 style={{ marginBottom: '8px' }}>{isUrdu ? 'اس مضمون کو شیئر کریں' : 'Share this article'}</h3>
                <p className="text-muted text-sm">{isUrdu ? 'صحت کے بارے میں شعور پھیلانے میں ہماری مدد کریں۔' : 'Help us spread awareness about health and wellness.'}</p>
              </div>
              <div className="flex gap-3">
                <button className="btn-secondary" style={{ padding: '12px' }}><Globe size={20} /></button>
                <button className="btn-secondary" style={{ padding: '12px' }}><Send size={20} /></button>
                <button className="btn-secondary" style={{ padding: '12px' }}><Share2 size={20} /></button>
                <button className="btn-secondary" style={{ padding: '12px' }}><LinkIcon size={20} /></button>
              </div>
            </div>
          </div>

          {/* Newsletter Signup (Dummy) */}
          <div style={{ marginTop: '40px', textAlign: 'center' }}>
            <div className="flex items-center justify-center gap-2 text-primary-accent mb-4">
              <MessageSquare size={24} />
              <span style={{ fontWeight: 700 }}>{isUrdu ? 'ہمارے نیوز لیٹر میں شامل ہوں' : 'Join our Newsletter'}</span>
            </div>
            <p className="text-muted mb-6">{isUrdu ? 'تازہ ترین ہیلتھ ٹپس براہ راست اپنے ان باکس میں حاصل کریں۔' : 'Get the latest health tips delivered directly to your inbox.'}</p>
            <div className="flex max-w-md mx-auto gap-2">
              <input type="email" placeholder="Email address" className="search-input" style={{ padding: '12px 20px', margin: 0 }} />
              <button className="btn-primary">{isUrdu ? 'سبسکرائب' : 'Subscribe'}</button>
            </div>
          </div>
        </div>
      </article>

      {/* Related Blogs */}
      <section style={{ backgroundColor: 'var(--surface-alt)', padding: '80px 0' }}>
        <div className="container">
          <h2 className="mb-8">{isUrdu ? 'مزید مضامین' : 'Related Articles'}</h2>
          <div className="news-grid">
            {MOCK_BLOGS.filter(b => b.id !== blog.id).slice(0, 2).map(b => (
              <Link key={b.id} to={`/blog/${b.id}`} className="news-card group">
                <div className="news-image-wrapper">
                  <img src={b.image} alt={b.title} className="news-image" />
                </div>
                <div className="news-content">
                  <h3 className="news-title group-hover:text-primary-accent transition-colors">{b.title}</h3>
                  <p className="news-summary">{b.summary}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};
