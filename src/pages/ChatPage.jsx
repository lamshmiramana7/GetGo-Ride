import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Phone, Send, ShieldCheck, User } from 'lucide-react';
import { useAuth } from '../App';
import { MOCK_USER } from '../data/mockData';

const SEED_MESSAGES = [
  { id: 1, from: 'driver', text: 'I am on my way. Will reach in 3 minutes.', time: '10:32 AM' },
  { id: 2, from: 'user', text: 'Okay, I am waiting near the main gate.', time: '10:33 AM' },
  { id: 3, from: 'driver', text: 'I can see you. I am in a white sedan.', time: '10:34 AM' },
  { id: 4, from: 'user', text: 'Got it, coming!', time: '10:34 AM' },
];

const QUICK_REPLIES = [
  "I'm waiting outside", "Almost there", "Please wait 2 min", "Where are you?", "I can see you",
];

export default function ChatPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [messages, setMessages] = useState(SEED_MESSAGES);
  const [input, setInput] = useState('');
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = (text) => {
    if (!text.trim()) return;
    const newMsg = { id: Date.now(), from: 'user', text: text.trim(), time: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }) };
    setMessages(prev => [...prev, newMsg]);
    setInput('');
    setTimeout(() => {
      const replies = ['Okay!', 'Got it', 'On my way!', 'I see you!', 'Understood'];
      setMessages(prev => [...prev, { id: Date.now() + 1, from: 'driver', text: replies[Math.floor(Math.random() * replies.length)], time: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }) }]);
    }, 1500);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', gap: 16 }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <button
            className="btn-secondary"
            onClick={() => navigate(-1)}
            style={{ width: 40, height: 40, padding: 0, borderRadius: 'var(--radius-md)' }}
          >
            <ArrowLeft size={18} />
          </button>
          <div>
            <h1 className="text-section" style={{ color: 'var(--text-primary)' }}>
              Driver Chat
            </h1>
            <p className="text-caption" style={{ color: 'var(--brand-green-text)' }}>
              Active trip · Phone number masked
            </p>
          </div>
        </div>
        <button className="btn-secondary" style={{ width: 'auto', padding: '0 16px', gap: 6 }}>
          <Phone size={16} /> Call Driver
        </button>
      </div>

      {/* Messages Box */}
      <div className="flat-card" style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 12, overflowY: 'auto' }}>
        {messages.map(msg => (
          <div
            key={msg.id}
            style={{
              alignSelf: msg.from === 'user' ? 'flex-end' : 'flex-start',
              maxWidth: '80%',
              backgroundColor: msg.from === 'user' ? 'var(--brand-green)' : 'var(--bg-secondary)',
              color: msg.from === 'user' ? '#FFFFFF' : 'var(--text-primary)',
              padding: '10px 14px',
              borderRadius: 'var(--radius-md)',
              fontSize: 14,
            }}
          >
            <div>{msg.text}</div>
            <div style={{ fontSize: 11, opacity: 0.8, marginTop: 4, textAlign: 'right' }}>{msg.time}</div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Quick Replies */}
      <div style={{ display: 'flex', gap: 8, overflowX: 'auto' }}>
        {QUICK_REPLIES.map((r, i) => (
          <button key={i} className="badge-flat" onClick={() => sendMessage(r)} style={{ cursor: 'pointer' }}>
            {r}
          </button>
        ))}
      </div>

      {/* Input Form */}
      <form
        onSubmit={e => { e.preventDefault(); sendMessage(input); }}
        style={{ display: 'flex', gap: 8 }}
      >
        <input
          className="input-field"
          placeholder="Type message to driver..."
          value={input}
          onChange={e => setInput(e.target.value)}
        />
        <button type="submit" className="btn-primary" style={{ width: 'auto', padding: '0 20px' }}>
          <Send size={18} />
        </button>
      </form>
    </div>
  );
}
