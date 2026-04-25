import { useState, useRef, useEffect } from 'react';
import { MessageSquare, X, Send, Pill } from 'lucide-react';
import { chatWithBot } from '../services/api';
import type { ChatMessage } from '../types';
import { useNavigate } from 'react-router-dom';

export const ChatBot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  const isUrdu = localStorage.getItem('medifinder_lang') === 'ur';

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const newMessage: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: input.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    const newMessages = [...messages, newMessage];
    setMessages(newMessages);
    setInput('');
    setIsTyping(true);

    try {
      const history = newMessages.slice(-20);
      const response = await chatWithBot(history);
      
      setMessages(prev => [...prev, {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: response,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }]);
    } catch (error) {
      setMessages(prev => [...prev, {
        id: (Date.now() + 1).toString(),
        role: 'system',
        content: isUrdu ? 'معذرت، ایک خرابی پیش آ گئی ہے۔ براہ کرم دوبارہ کوشش کریں۔' : 'Sorry, an error occurred. Please try again.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleSearchClick = (_query: string) => {
    setIsOpen(false);
    navigate(`/result?q=${encodeURIComponent(query)}`);
  };

  const renderMessageContent = (content: string) => {
    // Simple parser to extract potential medicine names for quick search
    // We can look for patterns or just render text. For now, simple text.
    return <div style={{ whiteSpace: 'pre-wrap' }}>{content}</div>;
  };

  return (
    <>
      <div className="chatbot-fab" onClick={() => setIsOpen(!isOpen)}>
        {isOpen ? <X size={28} /> : <MessageSquare size={28} />}
      </div>

      {isOpen && (
        <div className="chatbot-panel fade-up">
          <div className="chat-header">
            <div className="flex items-center gap-2">
              <Pill size={20} />
              <div style={{ fontWeight: 600 }}>
                {isUrdu ? 'میڈی باٹ اسسٹنٹ' : 'MediBot Assistant'}
              </div>
            </div>
            <button onClick={() => setIsOpen(false)} style={{ color: 'white' }}>
              <X size={20} />
            </button>
          </div>
          
          <div className="chat-messages">
            {messages.length === 0 && (
              <div className="text-center text-muted mt-4">
                {isUrdu 
                  ? 'مجھ سے ادویات اور صحت کے بارے میں کچھ بھی پوچھیں'
                  : 'Ask me anything about medicines & health'}
              </div>
            )}
            
            {messages.map((msg) => (
              <div key={msg.id} className={msg.role === 'user' ? 'chat-bubble-user' : 'chat-bubble-bot'}>
                {msg.role === 'assistant' && (
                  <div style={{ width: 24, height: 24, borderRadius: '50%', backgroundColor: 'var(--accent-light)', color: 'var(--accent-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <Pill size={14} />
                  </div>
                )}
                <div>
                  {renderMessageContent(msg.content)}
                  <div style={{ fontSize: 10, opacity: 0.7, marginTop: 4, textAlign: msg.role === 'user' ? 'right' : 'left' }}>
                    {msg.timestamp}
                  </div>
                </div>
              </div>
            ))}
            
            {isTyping && (
              <div className="chat-bubble-bot">
                <div style={{ width: 24, height: 24, borderRadius: '50%', backgroundColor: 'var(--accent-light)', color: 'var(--accent-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <Pill size={14} />
                </div>
                <div className="flex items-center gap-1" style={{ height: 24 }}>
                  <div style={{ width: 6, height: 6, borderRadius: '50%', backgroundColor: 'var(--text-muted)', animation: 'pulse 1s infinite' }} />
                  <div style={{ width: 6, height: 6, borderRadius: '50%', backgroundColor: 'var(--text-muted)', animation: 'pulse 1s infinite 0.2s' }} />
                  <div style={{ width: 6, height: 6, borderRadius: '50%', backgroundColor: 'var(--text-muted)', animation: 'pulse 1s infinite 0.4s' }} />
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <div className="chat-input-area">
            <input
              type="text"
              className="chat-input"
              placeholder={isUrdu ? 'پیغام ٹائپ کریں...' : 'Type a message...'}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            />
            <button className="chat-send" onClick={handleSend} disabled={!input.trim() || isTyping}>
              <Send size={18} />
            </button>
          </div>
        </div>
      )}
    </>
  );
};
