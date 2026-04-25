import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Clock, Search as SearchIcon } from 'lucide-react';
import { fetchBlogs, type Blog } from '../services/api';

export const Blogs = () => {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const isUrdu = localStorage.getItem('medifinder_lang') === 'ur';

  useEffect(() => {
    const loadBlogs = async () => {
      const data = await fetchBlogs();
      setBlogs(data);
      setLoading(false);
    };
    loadBlogs();
    window.scrollTo(0, 0);
  }, []);

  const filteredBlogs = blogs.filter(blog => 
    blog.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    blog.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="fade-up">
      {/* Header */}
      <section className="section bg-light text-center" style={{ padding: '80px 0', backgroundColor: 'var(--surface-alt)' }}>
        <div className="container">
          <div className="flex justify-center mb-6">
            <span className="badge badge-green">
              {isUrdu ? 'ہیلتھ نالج حب' : 'Health Knowledge Hub'}
            </span>
          </div>
          <h1 style={{ fontSize: 'clamp(32px, 5vw, 56px)', marginBottom: '24px' }}>
            {isUrdu ? 'صحت کے بارے میں ہر چیز' : 'Everything About Your Health'}
          </h1>
          <p className="text-muted mx-auto" style={{ maxWidth: '600px', fontSize: '18px' }}>
            {isUrdu 
              ? 'ہمارے طبی ماہرین کے لکھے ہوئے مضامین کے ذریعے اپنی صحت کے بارے میں باخبر رہیں۔'
              : 'Stay informed about your well-being through articles written by our medical experts.'}
          </p>

          <div className="search-wrapper mx-auto mt-10" style={{ maxWidth: '500px' }}>
            <SearchIcon className="search-icon" size={20} />
            <input
              type="text"
              className="search-input"
              placeholder={isUrdu ? 'مضامین تلاش کریں...' : 'Search articles...'}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{ paddingLeft: '48px' }}
            />
          </div>
        </div>
      </section>

      {/* Blogs Grid */}
      <section className="section container">
        {loading ? (
          <div className="news-grid">
            {[1, 2, 3, 4, 5, 6, 7, 8].map(i => (
              <div key={i} className="news-card skeleton-loading" style={{ height: 260 }}></div>
            ))}
          </div>
        ) : (
          <div className="news-grid">
            {filteredBlogs.map(blog => (
              <Link key={blog.id} to={`/blog/${blog.id}`} className="news-card group">
                <div className="news-image-wrapper">
                  <img src={blog.image} alt={blog.title} className="news-image" />
                  <div className="news-category-badge">{blog.category}</div>
                </div>
                <div className="news-content">
                  <div className="flex items-center gap-3 text-[10px] text-muted mb-2">
                    <span className="flex items-center gap-1"><Clock size={10} /> {blog.readTime}</span>
                  </div>
                  <h3 className="news-title group-hover:text-primary-accent transition-colors">
                    {blog.title}
                  </h3>
                  <p className="news-summary">
                    {blog.summary}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        )}
        
        {!loading && filteredBlogs.length === 0 && (
          <div className="text-center py-20 text-muted">
            {isUrdu ? 'کوئی مضمون نہیں ملا۔' : 'No articles found matching your search.'}
          </div>
        )}
      </section>
    </div>
  );
};
