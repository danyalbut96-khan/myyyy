import { useState, useRef, useEffect } from 'react';
import { Pill, Send, Plus, Search } from 'lucide-react';
import { chatWithBot } from '../services/api';
import type { ChatMessage, ChatSession } from '../types';
import { useNavigate } from 'react-router-dom';

export const Chat = () => {
  const isUrdu = localStorage.getItem('medifinder_lang') === 'ur';
  const navigate = useNavigate();
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [activeSessionId, setActiveSessionId] = useState<string | null>(null);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
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

  const handleSend = async (textOverride?: string) => {
    const text = textOverride || input;
    if (!text.trim()) return;

    const newMessage: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: text.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    let updatedSessions = [...sessions];
    let currentSessionId = activeSessionId;

    if (!currentSessionId) {
      currentSessionId = Date.now().toString();
      const newSession: ChatSession = {
        id: currentSessionId,
        title: text.trim().substring(0, 30) + '...',
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
      <div style={{ width: 300, backgroundColor: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 20, display: 'flex', flexDirection: 'column', overflow: 'hidden' }} className="hidden md:flex">
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
                fontWeight: s.id === activeSessionId ? 600 : 400
              }}
            >
              <div style={{ fontSize: 14, color: 'var(--text-primary)', marginBottom: 4 }}>{s.title}</div>
              <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>{new Date(s.updatedAt).toLocaleDateString()}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Main Chat Area */}
      <div style={{ flex: 1, backgroundColor: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 20, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        <div className="chat-header" style={{ padding: '20px 24px' }}>
          <div className="flex items-center gap-3">
            <div style={{ width: 40, height: 40, borderRadius: '50%', backgroundColor: 'white', color: 'var(--accent-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Pill size={24} />
            </div>
            <div>
              <div style={{ fontWeight: 700, fontSize: 18 }}>{isUrdu ? 'میڈی باٹ اسسٹنٹ' : 'MediBot Assistant'}</div>
              <div style={{ fontSize: 13, opacity: 0.9 }}>{isUrdu ? 'صحت سے متعلق کوئی بھی سوال پوچھیں' : 'Ask me anything about medicines & health'}</div>
            </div>
          </div>
        </div>

        <div className="chat-messages" style={{ padding: 24 }}>
          {(!activeSession || messages.length === 0) && (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
              <Pill size={64} color="var(--accent-light)" style={{ marginBottom: 20 }} />
              <h2 style={{ marginBottom: 24 }}>{isUrdu ? 'میں آپ کی کیسے مدد کر سکتا ہوں؟' : 'How can I help you today?'}</h2>
              <div className="flex flex-wrap gap-2 justify-center max-w-xl">
                {starterQuestions.map(q => (
                  <button key={q} className="chip" onClick={() => handleSend(q)}>
                    {q}
                  </button>
                ))}
              </div>
            </div>
          )}

          {messages.map((msg) => (
            <div key={msg.id} className={msg.role === 'user' ? 'chat-bubble-user' : 'chat-bubble-bot'}>
              {msg.role === 'assistant' && (
                <div style={{ width: 28, height: 28, borderRadius: '50%', backgroundColor: 'var(--accent-light)', color: 'var(--accent-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <Pill size={16} />
                </div>
              )}
              <div>
                <div style={{ whiteSpace: 'pre-wrap', fontSize: 16 }}>{msg.content}</div>
                <div style={{ fontSize: 11, opacity: 0.7, marginTop: 6, textAlign: msg.role === 'user' ? 'right' : 'left' }}>
                  {msg.timestamp}
                </div>
              </div>
            </div>
          ))}
          
          {isTyping && (
            <div className="chat-bubble-bot">
              <div style={{ width: 28, height: 28, borderRadius: '50%', backgroundColor: 'var(--accent-light)', color: 'var(--accent-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <Pill size={16} />
              </div>
              <div className="flex items-center gap-1" style={{ height: 28 }}>
                <div style={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: 'var(--text-muted)', animation: 'pulse 1s infinite' }} />
                <div style={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: 'var(--text-muted)', animation: 'pulse 1s infinite 0.2s' }} />
                <div style={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: 'var(--text-muted)', animation: 'pulse 1s infinite 0.4s' }} />
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        <div className="chat-input-area" style={{ padding: 24, borderTop: '1px solid var(--border)' }}>
          <input
            type="text"
            className="chat-input"
            placeholder={isUrdu ? 'اپنا سوال یہاں لکھیں...' : 'Type your medical question here...'}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            style={{ fontSize: 16, padding: '16px 24px' }}
          />
          <button className="chat-send" onClick={() => handleSend()} disabled={!input.trim() || isTyping} style={{ width: 56, height: 56 }}>
            <Send size={24} />
          </button>
        </div>
      </div>
    </div>
  );
};
