import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../App';
import { MOCK_USER } from '../data/mockData';

const SEED_MESSAGES = [
  { id: 1, from: 'driver', text: 'I am on my way. Will reach in 3 minutes.', time: '10:32 AM' },
  { id: 2, from: 'user', text: 'Okay, I am waiting near the main gate.', time: '10:33 AM' },
  { id: 3, from: 'driver', text: 'I can see you. I am in a white Honda Activa.', time: '10:34 AM' },
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
    // Auto driver reply after 1.5s
    setTimeout(() => {
      const replies = ['Okay!', 'Got it 👍', 'On my way!', 'I see you!', '✓'];
      setMessages(prev => [...prev, { id: Date.now() + 1, from: 'driver', text: replies[Math.floor(Math.random() * replies.length)], time: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }) }]);
    }, 1500);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <div className="top-bar">
        <button className="back-btn" onClick={() => navigate(-1)}>←</button>
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ width: 36, height: 36, background: 'var(--bg-card)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.125rem', border: '2px solid var(--brand-green)' }}>🏍️</div>
          <div>
            <div style={{ fontWeight: 700, fontSize: '0.9375rem' }}>Driver</div>
            <div style={{ fontSize: '0.6875rem', color: 'var(--brand-green)' }}>🟢 Active trip · Phone numbers masked</div>
          </div>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <button id="call-driver-btn" style={{ background: 'rgba(0,166,81,0.15)', border: 'none', color: 'var(--brand-green)', borderRadius: 20, padding: '6px 14px', fontSize: '0.8125rem', fontWeight: 600, cursor: 'pointer' }}>📞 Call</button>
        </div>
      </div>

      {/* Privacy notice */}
      <div style={{ background: 'rgba(37,99,235,0.1)', borderBottom: '1px solid rgba(37,99,235,0.2)', padding: '8px 16px', fontSize: '0.6875rem', color: '#93C5FD', textAlign: 'center' }}>
        🔒 This is a masked conversation — real phone numbers are never shared
      </div>

      {/* Messages */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '16px 16px 8px', display: 'flex', flexDirection: 'column', gap: 12 }}>
        {messages.map(msg => (
          <div key={msg.id} style={{ display: 'flex', flexDirection: 'column', alignItems: msg.from === 'user' ? 'flex-end' : 'flex-start', animation: 'slideUp 0.2s ease' }}>
            {msg.from === 'driver' && (
              <div style={{ fontSize: '0.625rem', color: 'var(--text-muted)', marginBottom: 3, paddingLeft: 4 }}>Driver</div>
            )}
            <div className={`chat-bubble ${msg.from === 'user' ? 'sent' : 'received'}`}>
              {msg.text}
            </div>
            <div style={{ fontSize: '0.5625rem', color: 'var(--text-muted)', marginTop: 3, paddingLeft: msg.from === 'driver' ? 4 : 0, paddingRight: msg.from === 'user' ? 4 : 0 }}>
              {msg.time}
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Quick replies */}
      <div style={{ padding: '6px 12px', display: 'flex', gap: 8, overflowX: 'auto', borderTop: '1px solid var(--border)' }}>
        {QUICK_REPLIES.map(r => (
          <button key={r} id={`quick-reply-${r}`} onClick={() => sendMessage(r)}
            style={{ flexShrink: 0, background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 16, padding: '5px 12px', fontSize: '0.75rem', color: 'var(--text-secondary)', cursor: 'pointer', whiteSpace: 'nowrap', transition: 'var(--transition)' }}
            onMouseEnter={e => { e.currentTarget.style.background = 'rgba(0,166,81,0.1)'; e.currentTarget.style.borderColor = 'rgba(0,166,81,0.3)'; e.currentTarget.style.color = 'var(--brand-green)'; }}
            onMouseLeave={e => { e.currentTarget.style.background = 'var(--bg-card)'; e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.color = 'var(--text-secondary)'; }}>
            {r}
          </button>
        ))}
      </div>

      {/* Input */}
      <div style={{ display: 'flex', gap: 10, padding: '10px 12px', borderTop: '1px solid var(--border)', background: 'var(--bg-secondary)' }}>
        <input
          id="chat-input"
          className="input-field"
          style={{ flex: 1, padding: '12px 16px', borderRadius: 24 }}
          placeholder="Type a message..."
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && sendMessage(input)}
        />
        <button
          id="send-message-btn"
          onClick={() => sendMessage(input)}
          disabled={!input.trim()}
          style={{ width: 46, height: 46, borderRadius: '50%', background: input.trim() ? 'var(--brand-green)' : 'var(--bg-card)', border: 'none', color: input.trim() ? '#fff' : 'var(--text-muted)', fontSize: '1.125rem', cursor: 'pointer', transition: 'var(--transition)', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          ➤
        </button>
      </div>
    </div>
  );
}
