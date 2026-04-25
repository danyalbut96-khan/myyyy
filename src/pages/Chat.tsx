import { useState, useRef, useEffect } from 'react';
import { Pill, Send, Plus, Image as ImageIcon, X } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { chatWithBot } from '../services/api';
import type { ChatMessage, ChatSession } from '../types';

export const Chat = () => {
  const isUrdu = localStorage.getItem('medifinder_lang') === 'ur';
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [activeSessionId, setActiveSessionId] = useState<string | null>(null);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const saved = localStorage.getItem('medifinder_chat_sessions');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setSessions(parsed);
        if (parsed.length > 0) {
          setActiveSessionId(parsed[0].id);
        }
      } catch (e) {
        setSessions([]);
      }
    }
  }, []);

  const saveSessions = (newSessions: ChatSession[]) => {
    const limited = newSessions.slice(0, 10);
    setSessions(limited);
    localStorage.setItem('medifinder_chat_sessions', JSON.stringify(limited));
  };

  const activeSession = sessions.find(s => s.id === activeSessionId);
  const messages = activeSession?.messages || [];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const handleNewChat = () => {
    setActiveSessionId(null);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeSelectedImage = () => {
    setSelectedImage(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleSend = async (textOverride?: string) => {
    const text = textOverride || input;
    if (!text.trim() && !selectedImage) return;

    const newMessage: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: text.trim(),
      imageUrl: selectedImage || undefined,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    let updatedSessions = [...sessions];
    let currentSessionId = activeSessionId;

    if (!currentSessionId) {
      currentSessionId = Date.now().toString();
      const newSession: ChatSession = {
        id: currentSessionId,
        title: text.trim() ? (text.trim().substring(0, 30) + '...') : (isUrdu ? 'تصویری تجزیہ...' : 'Image Analysis...'),
        messages: [newMessage],
        updatedAt: new Date().toISOString()
      };
      updatedSessions = [newSession, ...updatedSessions];
    } else {
      updatedSessions = updatedSessions.map(s => {
        if (s.id === currentSessionId) {
          return { ...s, messages: [...s.messages, newMessage], updatedAt: new Date().toISOString() };
        }
        return s;
      });
    }

    saveSessions(updatedSessions);
    setActiveSessionId(currentSessionId);
    if (!textOverride) setInput('');
    setSelectedImage(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
    setIsTyping(true);

    try {
      const activeMsgs = updatedSessions.find(s => s.id === currentSessionId)?.messages || [];
      const history = activeMsgs.slice(-20);
      const response = await chatWithBot(history);
      
      const botMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: response,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      const finalSessions = updatedSessions.map(s => {
        if (s.id === currentSessionId) {
          return { ...s, messages: [...s.messages, botMessage] };
        }
        return s;
      });
      saveSessions(finalSessions);

    } catch (error) {
      console.error(error);
      const errorMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'system',
        content: isUrdu ? 'معذرت، ایک خرابی پیش آ گئی ہے۔' : 'Sorry, an error occurred.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      const finalSessions = updatedSessions.map(s => {
        if (s.id === currentSessionId) {
          return { ...s, messages: [...s.messages, errorMsg] };
        }
        return s;
      });
      saveSessions(finalSessions);
    } finally {
      setIsTyping(false);
    }
  };

  const starterQuestions = isUrdu ? [
    "میں پینا ڈول کے بارے میں جاننا چاہتا ہوں",
    "کیا روزانہ آئبوپروفین لینا محفوظ ہے؟",
    "ذیابیطس کی علامات کیا ہیں؟",
    "جینرک اور برانڈڈ دوائی میں کیا فرق ہے؟"
  ] : [
    "What is Paracetamol used for?",
    "Is it safe to take ibuprofen daily?",
    "What are symptoms of diabetes?",
    "Difference between generic and branded medicine?"
  ];

  return (
    <div className="fade-up container section" style={{ display: 'flex', height: 'calc(100vh - 104px)', gap: 20 }}>
      {/* Sidebar */}
      <div style={{ width: 300, backgroundColor: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 24, display: 'flex', flexDirection: 'column', overflow: 'hidden' }} className="hidden md:flex shadow-soft">
        <div style={{ padding: 20, borderBottom: '1px solid var(--border)' }}>
          <button className="btn-primary w-full justify-center" onClick={handleNewChat}>
            <Plus size={18} /> {isUrdu ? 'نئی چیٹ' : 'New Chat'}
          </button>
        </div>
        <div style={{ flex: 1, overflowY: 'auto' }}>
          {sessions.map(s => (
            <div 
              key={s.id} 
              onClick={() => setActiveSessionId(s.id)}
              style={{ 
                padding: '16px 20px', 
                borderBottom: '1px solid var(--border)', 
                cursor: 'pointer',
                backgroundColor: s.id === activeSessionId ? 'var(--accent-light)' : 'transparent',
                fontWeight: s.id === activeSessionId ? 600 : 400,
                transition: 'all 0.2s'
              }}
              className="hover-bg"
            >
              <div style={{ fontSize: 14, color: 'var(--text-primary)', marginBottom: 4 }} className="truncate">{s.title}</div>
              <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>{new Date(s.updatedAt).toLocaleDateString()}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Main Chat Area */}
      <div style={{ flex: 1, backgroundColor: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 24, display: 'flex', flexDirection: 'column', overflow: 'hidden' }} className="shadow-soft">
        <div className="chat-header" style={{ padding: '20px 24px' }}>
          <div className="flex items-center gap-3">
            <div style={{ width: 44, height: 44, borderRadius: 14, backgroundColor: 'white', color: 'var(--accent-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
              <Pill size={24} />
            </div>
            <div>
              <div style={{ fontWeight: 700, fontSize: 18 }}>{isUrdu ? 'میڈی باٹ اسسٹنٹ' : 'MediBot Assistant'}</div>
              <div style={{ fontSize: 13, opacity: 0.9, color: 'var(--text-muted)' }}>{isUrdu ? 'صحت سے متعلق کوئی بھی سوال پوچھیں یا تصویر اپلوڈ کریں' : 'Ask anything or upload an image of medicine/symptoms'}</div>
            </div>
          </div>
        </div>

        <div className="chat-messages" style={{ padding: 24 }}>
          {(!activeSession || messages.length === 0) && (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', textAlign: 'center' }}>
              <div className="pulse-slow" style={{ width: 80, height: 80, borderRadius: 24, backgroundColor: 'var(--accent-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 24 }}>
                <Pill size={40} color="var(--accent-primary)" />
              </div>
              <h2 style={{ marginBottom: 12, fontSize: 24, fontWeight: 800 }}>{isUrdu ? 'میں آپ کی کیسے مدد کر سکتا ہوں؟' : 'How can I help you today?'}</h2>
              <p style={{ color: 'var(--text-muted)', marginBottom: 32, maxWidth: 400 }}>{isUrdu ? 'آپ مجھ سے دواؤں، بیماریوں اور صحت کے بارے میں سوالات پوچھ سکتے ہیں۔ آپ نسخے یا دوا کی تصویر بھی بھیج سکتے ہیں۔' : 'You can ask about medicines, health conditions, or symptoms. You can even upload images of prescriptions or medicine packs.'}</p>
              <div className="flex flex-wrap gap-2 justify-center max-w-xl">
                {starterQuestions.map(q => (
                  <button key={q} className="chip" onClick={() => handleSend(q)} style={{ padding: '10px 18px' }}>
                    {q}
                  </button>
                ))}
              </div>
            </div>
          )}

          {messages.map((msg) => (
            <div key={msg.id} className={msg.role === 'user' ? 'chat-bubble-user' : 'chat-bubble-bot'} style={{ maxWidth: '85%' }}>
              {msg.role === 'assistant' && (
                <div style={{ width: 32, height: 32, borderRadius: 10, backgroundColor: 'var(--accent-light)', color: 'var(--accent-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: 4 }}>
                  <Pill size={18} />
                </div>
              )}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {msg.imageUrl && (
                  <div style={{ borderRadius: 12, overflow: 'hidden', border: '1px solid rgba(0,0,0,0.1)', marginBottom: 4 }}>
                    <img src={msg.imageUrl} alt="Uploaded content" style={{ maxWidth: '100%', maxHeight: 300, display: 'block' }} />
                  </div>
                )}
                {msg.content && (
                  <div className="markdown-content" style={{ fontSize: 16, lineHeight: 1.6 }}>
                    {msg.role === 'assistant' ? (
                      <ReactMarkdown remarkPlugins={[remarkGfm]}>
                        {msg.content}
                      </ReactMarkdown>
                    ) : (
                      <div style={{ whiteSpace: 'pre-wrap' }}>{msg.content}</div>
                    )}
                  </div>
                )}
                <div style={{ fontSize: 11, opacity: 0.6, marginTop: 2, textAlign: msg.role === 'user' ? 'right' : 'left' }}>
                  {msg.timestamp}
                </div>
              </div>
            </div>
          ))}
          
          {isTyping && (
            <div className="chat-bubble-bot">
              <div style={{ width: 32, height: 32, borderRadius: 10, backgroundColor: 'var(--accent-light)', color: 'var(--accent-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <Pill size={18} />
              </div>
              <div className="flex items-center gap-1.5" style={{ height: 32, padding: '0 8px' }}>
                <div className="dot-flashing" style={{ backgroundColor: 'var(--accent-primary)' }} />
                <div className="dot-flashing" style={{ backgroundColor: 'var(--accent-primary)', animationDelay: '0.2s' }} />
                <div className="dot-flashing" style={{ backgroundColor: 'var(--accent-primary)', animationDelay: '0.4s' }} />
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        <div className="chat-input-area" style={{ padding: '24px', borderTop: '1px solid var(--border)', position: 'relative' }}>
          {selectedImage && (
            <div style={{ position: 'absolute', bottom: '100%', left: 24, padding: 12, backgroundColor: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '16px 16px 0 0', display: 'flex', alignItems: 'center', gap: 12, boxShadow: '0 -4px 12px rgba(0,0,0,0.05)', borderBottom: 'none' }}>
              <div style={{ width: 60, height: 60, borderRadius: 8, overflow: 'hidden', border: '1px solid var(--border)' }}>
                <img src={selectedImage} alt="Preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              </div>
              <button onClick={removeSelectedImage} style={{ width: 28, height: 28, borderRadius: '50%', backgroundColor: 'rgba(255,0,0,0.1)', color: 'red', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <X size={16} />
              </button>
            </div>
          )}
          
          <div style={{ display: 'flex', gap: 12, alignItems: 'flex-end' }}>
            <button 
              className="chat-action-btn" 
              onClick={() => fileInputRef.current?.click()}
              style={{ width: 56, height: 56, borderRadius: 18, backgroundColor: 'var(--accent-light)', color: 'var(--accent-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
            >
              <ImageIcon size={24} />
            </button>
            <input 
              type="file" 
              ref={fileInputRef} 
              hidden 
              accept="image/*" 
              onChange={handleImageUpload} 
            />
            
            <div style={{ flex: 1, position: 'relative' }}>
              <textarea
                className="chat-input"
                placeholder={isUrdu ? 'اپنا سوال یہاں لکھیں...' : 'Type your medical question here...'}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSend();
                  }
                }}
                style={{ 
                  fontSize: 16, 
                  padding: '16px 24px', 
                  width: '100%', 
                  borderRadius: 18, 
                  border: '1px solid var(--border)',
                  backgroundColor: 'var(--bg-color)',
                  resize: 'none',
                  maxHeight: 150,
                  outline: 'none'
                }}
                rows={1}
              />
            </div>
            
            <button 
              className="chat-send" 
              onClick={() => handleSend()} 
              disabled={(!input.trim() && !selectedImage) || isTyping} 
              style={{ width: 56, height: 56, borderRadius: 18, flexShrink: 0 }}
            >
              <Send size={24} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
