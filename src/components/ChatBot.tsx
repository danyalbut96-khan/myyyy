import { useState, useRef, useEffect } from 'react';
import { MessageSquare, X, Send, Pill, Image as ImageIcon } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { chatWithBot } from '../services/api';
import type { ChatMessage } from '../types';

export const ChatBot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const isUrdu = localStorage.getItem('medifinder_lang') === 'ur';

  const [hasGreeted, setHasGreeted] = useState(false);

  const HEALTH_KEYWORDS = [
    'health', 'medicine', 'pill', 'symptom', 'doctor', 'pharmacy', 'prescription', 'pain', 'fever', 'illness', 
    'disease', 'treatment', 'cure', 'medical', 'hospital', 'blood', 'care', 'heart', 'brain', 'lung', 'liver', 
    'kidney', 'stomach', 'skin', 'eye', 'ear', 'nose', 'throat', 'bone', 'muscle', 'nerve', 'allergy', 'infection', 
    'virus', 'bacteria', 'covid', 'cancer', 'diabetes', 'blood pressure', 'hypertension', 'cholesterol', 'weight', 
    'diet', 'nutrition', 'exercise', 'sleep', 'mental', 'stress', 'anxiety', 'depression', 'therapy', 'surgery', 
    'vaccine', 'dose', 'tablet', 'capsule', 'syrup', 'ointment', 'cream', 'gel', 'injection', 'serum', 'drops', 
    'inhaler', 'patch', 'brand', 'generic', 'formula', 'chemical', 'salt', 'active', 'side effect', 'contraindication', 
    'interaction', 'availability', 'price', 'manufacturer', 'hi', 'hello', 'hey', 'help', 'who', 'what', 'how'
  ];

  const URDU_KEYWORDS = [
    'صحت', 'دوا', 'گولی', 'علامت', 'ڈاکٹر', 'فارمیسی', 'نسخہ', 'درد', 'بخار', 'بیماری', 'علاج', 'طبی', 'ہسپتال', 
    'خون', 'دل', 'دماغ', 'پھیپھڑے', 'جگر', 'گردہ', 'معدہ', 'جلد', 'آنکھ', 'کان', 'ناک', 'گلا', 'ہڈی', 'پٹھا', 
    'اعصاب', 'ایلرجی', 'انفیکشن', 'وائرس', 'بیکٹیریا', 'کینسر', 'ذیابیطس', 'شوگر', 'بلڈ پریشر', 'کولیسٹرول', 
    'وزن', 'غذا', 'ورزش', 'نیند', 'ذہنی', 'تناؤ', 'پریشانی', 'ڈپریشن', 'سرجری', 'ویکسین', 'خوراک', 'شربت', 
    'مرہم', 'انجیکشن', 'قطرے', 'متبادل', 'قیمت', 'سلام', 'ہیلو', 'کیسے', 'کون', 'کیا'
  ];

  const checkHealthQuery = (text: string) => {
    const lowerText = text.toLowerCase();
    const isEnglishHealth = HEALTH_KEYWORDS.some(k => lowerText.includes(k));
    const isUrduHealth = URDU_KEYWORDS.some(k => lowerText.includes(k));
    return isEnglishHealth || isUrduHealth;
  };

  useEffect(() => {
    if (isOpen && !hasGreeted) {
      const greeting: ChatMessage = {
        id: 'greeting',
        role: 'assistant',
        content: isUrdu 
          ? 'ہیلو! میں میڈی فائنڈر اے آئی اسسٹنٹ ہوں۔ میں آپ کی صحت کے بارے میں کیا مدد کر سکتا ہوں؟ آپ اپنا نسخہ اپ لوڈ کر سکتے ہیں یا مجھ سے صحت سے متعلق کوئی بھی سوال پوچھ سکتے ہیں۔'
          : 'Hi! I am the MediFinder AI Assistant. How can I help you with your health today? You can upload your prescription or ask me any health-related questions.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages([greeting]);
      setHasGreeted(true);
    }
  }, [isOpen, hasGreeted, isUrdu]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

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

  const handleSend = async () => {
    if (!input.trim() && !selectedImage) return;

    // Guardrail Check
    if (input.trim() && !checkHealthQuery(input)) {
      const refusal: ChatMessage = {
        id: Date.now().toString(),
        role: 'assistant',
        content: isUrdu 
          ? 'میں معذرت خواہ ہوں، لیکن مجھے صحت اور ادویات کے علاوہ دیگر موضوعات پر بات کرنے کی سختی سے ممانعت ہے۔ میں صرف صحت سے متعلق سوالات میں آپ کی مدد کر سکتا ہوں۔'
          : 'I am strictly prohibited from answering non-health related queries. I can only assist you with health and medicine-related questions.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, {
        id: (Date.now() - 1).toString(),
        role: 'user',
        content: input.trim(),
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }, refusal]);
      setInput('');
      return;
    }

    const newMessage: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: input.trim(),
      imageUrl: selectedImage || undefined,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    const newMessages = [...messages, newMessage];
    setMessages(newMessages);
    setInput('');
    setSelectedImage(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
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
        content: isUrdu ? 'معذرت، ایک خرابی پیش آ گئی ہے۔' : 'Sorry, an error occurred.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }]);
    } finally {
      setIsTyping(false);
    }
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
              <div className="text-center text-muted mt-8 px-4">
                <div style={{ width: 48, height: 48, borderRadius: 12, backgroundColor: 'var(--accent-light)', color: 'var(--accent-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
                  <Pill size={24} />
                </div>
                <p style={{ fontSize: 14 }}>
                  {isUrdu 
                    ? 'مجھ سے ادویات، علامات یا صحت کے بارے میں پوچھیں۔ آپ تصویر بھی اپلوڈ کر سکتے ہیں۔'
                    : 'Ask me anything about medicines or symptoms. You can also upload images.'}
                </p>
              </div>
            )}
            
            {messages.map((msg) => (
              <div key={msg.id} className={msg.role === 'user' ? 'chat-bubble-user' : 'chat-bubble-bot'}>
                {msg.role === 'assistant' && (
                  <div style={{ width: 24, height: 24, borderRadius: '50%', backgroundColor: 'var(--accent-light)', color: 'var(--accent-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <Pill size={14} />
                  </div>
                )}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                  {msg.imageUrl && (
                    <div style={{ borderRadius: 8, overflow: 'hidden', border: '1px solid rgba(0,0,0,0.1)' }}>
                      <img src={msg.imageUrl} alt="Uploaded" style={{ maxWidth: '100%', display: 'block' }} />
                    </div>
                  )}
                  <div className="markdown-content" style={{ fontSize: 14 }}>
                    {msg.role === 'assistant' ? (
                      <ReactMarkdown remarkPlugins={[remarkGfm]}>
                        {msg.content}
                      </ReactMarkdown>
                    ) : (
                      <div style={{ whiteSpace: 'pre-wrap' }}>{msg.content}</div>
                    )}
                  </div>
                  <div style={{ fontSize: 9, opacity: 0.6, marginTop: 2, textAlign: msg.role === 'user' ? 'right' : 'left' }}>
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
                  <div className="dot-flashing" style={{ backgroundColor: 'var(--accent-primary)', width: 6, height: 6 }} />
                  <div className="dot-flashing" style={{ backgroundColor: 'var(--accent-primary)', width: 6, height: 6, animationDelay: '0.2s' }} />
                  <div className="dot-flashing" style={{ backgroundColor: 'var(--accent-primary)', width: 6, height: 6, animationDelay: '0.4s' }} />
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <div className="chat-input-area" style={{ flexDirection: 'column', gap: 8 }}>
            {selectedImage && (
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '4px 8px', backgroundColor: 'var(--bg-color)', borderRadius: 8 }}>
                <img src={selectedImage} alt="Preview" style={{ width: 32, height: 32, objectFit: 'cover', borderRadius: 4 }} />
                <button onClick={removeSelectedImage} style={{ color: 'red' }}><X size={14} /></button>
              </div>
            )}
            <div style={{ display: 'flex', gap: 8, width: '100%' }}>
              <button 
                className="chat-action-btn" 
                onClick={() => fileInputRef.current?.click()}
                style={{ padding: 8, borderRadius: 8, backgroundColor: 'var(--accent-light)', color: 'var(--accent-primary)' }}
              >
                <ImageIcon size={18} />
              </button>
              <input type="file" ref={fileInputRef} hidden accept="image/*" onChange={handleImageUpload} />
              
              <input
                type="text"
                className="chat-input"
                placeholder={isUrdu ? 'پیغام...' : 'Type...'}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                style={{ padding: '8px 12px' }}
              />
              <button className="chat-send" onClick={handleSend} disabled={(!input.trim() && !selectedImage) || isTyping} style={{ width: 36, height: 36 }}>
                <Send size={16} />
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
