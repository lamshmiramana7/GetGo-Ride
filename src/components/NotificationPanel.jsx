import React, { useState } from 'react';
import { NOTIFICATIONS } from '../data/mockData';

const TYPE_FILTERS = ['All', 'Promo', 'Trip', 'Parcel', 'System'];

export default function NotificationPanel({ onClose, onUnreadChange }) {
  const [notifs, setNotifs] = useState(NOTIFICATIONS);
  const [filter, setFilter] = useState('All');

  const unreadCount = notifs.filter(n => !n.read).length;

  const filtered = notifs.filter(n => {
    if (filter === 'All') return true;
    return n.type === filter.toLowerCase();
  });

  const update = (newNotifs) => {
    setNotifs(newNotifs);
    if (onUnreadChange) onUnreadChange(newNotifs.filter(n => !n.read).length);
  };

  const markAllRead = () => update(notifs.map(n => ({ ...n, read: true })));
  const markRead   = (id) => update(notifs.map(n => n.id === id ? { ...n, read: true } : n));
  const deleteOne  = (id) => update(notifs.filter(n => n.id !== id));
  const clearAll   = () => update([]);

  return (
    <div
      onClick={onClose}
      style={{
        position: 'fixed', inset: 0,
        background: 'rgba(0,0,0,0.55)',
        zIndex: 3000,
        display: 'flex',
        justifyContent: 'flex-end',
        maxWidth: 'var(--mobile-max)',
        margin: '0 auto',
      }}
    >
      {/* Panel slides in from the right */}
      <div
        onClick={e => e.stopPropagation()}
        style={{
          width: '88%',
          maxWidth: 340,
          height: '100%',
          background: 'var(--bg-secondary)',
          borderLeft: '1px solid var(--border)',
          display: 'flex',
          flexDirection: 'column',
          animation: 'slideInRight 0.28s cubic-bezier(0.4,0,0.2,1)',
          overflow: 'hidden',
        }}
      >
        {/* ── Header ── */}
        <div style={{
          padding: '52px 16px 14px',
          background: 'var(--bg-card)',
          borderBottom: '1px solid var(--border)',
          flexShrink: 0,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
            <div>
              <div style={{ fontFamily: 'Poppins', fontWeight: 800, fontSize: '1.0625rem', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: 8 }}>
                🔔 Notifications
                {unreadCount > 0 && (
                  <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', minWidth: 20, height: 20, background: '#EF4444', borderRadius: 10, fontSize: '0.625rem', fontWeight: 700, color: '#fff', padding: '0 5px' }}>
                    {unreadCount}
                  </span>
                )}
              </div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: 2 }}>
                {unreadCount > 0 ? `${unreadCount} unread message${unreadCount > 1 ? 's' : ''}` : 'All caught up ✓'}
              </div>
            </div>
            <button
              id="close-notif-btn"
              onClick={onClose}
              style={{ background: 'var(--bg-input)', border: 'none', color: 'var(--text-secondary)', width: 32, height: 32, borderRadius: '50%', fontSize: '0.875rem', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700 }}
            >✕</button>
          </div>

          {unreadCount > 0 && (
            <button
              id="mark-all-read-btn"
              onClick={markAllRead}
              style={{ background: 'rgba(0,166,81,0.10)', border: '1px solid rgba(0,166,81,0.25)', borderRadius: 8, padding: '5px 12px', color: 'var(--brand-green)', fontWeight: 600, fontSize: '0.75rem', cursor: 'pointer', marginBottom: 10, display: 'inline-flex', alignItems: 'center', gap: 5 }}
            >
              ✓ Mark all as read
            </button>
          )}

          {/* Filter chips */}
          <div style={{ display: 'flex', gap: 6, overflowX: 'auto', paddingBottom: 2 }}>
            {TYPE_FILTERS.map(f => (
              <button
                key={f}
                id={`notif-filter-${f}`}
                onClick={() => setFilter(f)}
                style={{
                  flexShrink: 0,
                  padding: '4px 12px',
                  borderRadius: 20,
                  fontSize: '0.6875rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  border: filter === f ? 'none' : '1px solid var(--border)',
                  background: filter === f ? 'var(--brand-green)' : 'var(--bg-input)',
                  color: filter === f ? '#fff' : 'var(--text-muted)',
                  transition: 'var(--transition)',
                }}
              >
                {f}
              </button>
            ))}
          </div>
        </div>

        {/* ── List ── */}
        <div style={{ flex: 1, overflowY: 'auto' }}>
          {filtered.length === 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 12, padding: '60px 24px', textAlign: 'center' }}>
              <div style={{ fontSize: '2.5rem', opacity: 0.3 }}>🔕</div>
              <div style={{ fontWeight: 600, color: 'var(--text-secondary)', fontSize: '0.9375rem' }}>
                No {filter !== 'All' ? filter.toLowerCase() : ''} notifications
              </div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>You're all caught up!</div>
            </div>
          ) : (
            filtered.map((notif, i) => (
              <NotifItem
                key={notif.id}
                notif={notif}
                isLast={i === filtered.length - 1}
                onRead={() => markRead(notif.id)}
                onDelete={() => deleteOne(notif.id)}
              />
            ))
          )}
        </div>

        {/* ── Footer ── */}
        {notifs.length > 0 && (
          <div style={{ padding: '12px 16px', borderTop: '1px solid var(--border)', flexShrink: 0, background: 'var(--bg-card)' }}>
            <button
              id="clear-all-notifs-btn"
              onClick={clearAll}
              style={{ width: '100%', padding: '10px', background: 'rgba(239,68,68,0.07)', border: '1px solid rgba(239,68,68,0.2)', borderRadius: 10, color: '#F87171', fontWeight: 600, fontSize: '0.8125rem', cursor: 'pointer', transition: 'var(--transition)' }}
              onMouseEnter={e => e.currentTarget.style.background = 'rgba(239,68,68,0.14)'}
              onMouseLeave={e => e.currentTarget.style.background = 'rgba(239,68,68,0.07)'}
            >
              🗑 Clear All Notifications
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

// ── Individual Notification Item ────────────────────────────
function NotifItem({ notif, isLast, onRead, onDelete }) {
  return (
    <div
      id={`notif-${notif.id}`}
      onClick={onRead}
      style={{
        display: 'flex',
        alignItems: 'flex-start',
        gap: 12,
        padding: '13px 14px',
        borderBottom: isLast ? 'none' : '1px solid var(--border)',
        cursor: 'pointer',
        transition: 'background var(--transition)',
        background: notif.read ? 'transparent' : 'rgba(0,166,81,0.03)',
        position: 'relative',
        animation: 'fadeIn 0.2s ease',
      }}
      onMouseEnter={e => e.currentTarget.style.background = 'rgba(0,166,81,0.06)'}
      onMouseLeave={e => e.currentTarget.style.background = notif.read ? 'transparent' : 'rgba(0,166,81,0.03)'}
    >
      {/* Unread dot */}
      {!notif.read && (
        <div style={{
          position: 'absolute', left: 3, top: '50%', transform: 'translateY(-50%)',
          width: 5, height: 5, borderRadius: '50%', background: 'var(--brand-green)',
        }} />
      )}

      {/* Icon bubble */}
      <div style={{
        width: 40, height: 40, borderRadius: 12,
        background: `${notif.color}22`,
        border: `1px solid ${notif.color}30`,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: '1.125rem', flexShrink: 0,
      }}>
        {notif.icon}
      </div>

      {/* Text */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontWeight: notif.read ? 500 : 700, fontSize: '0.8125rem', color: 'var(--text-primary)', lineHeight: 1.35 }}>
          {notif.title}
        </div>
        <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: 3, lineHeight: 1.45 }}>
          {notif.body}
        </div>
        <div style={{ fontSize: '0.5625rem', color: 'var(--text-muted)', marginTop: 5, display: 'flex', alignItems: 'center', gap: 5 }}>
          <span style={{ width: 5, height: 5, borderRadius: '50%', background: notif.color, display: 'inline-block', flexShrink: 0 }} />
          <span style={{ textTransform: 'capitalize' }}>{notif.type}</span>
          <span>·</span>
          <span>{notif.time}</span>
        </div>
      </div>

      {/* Dismiss × */}
      <button
        id={`delete-notif-${notif.id}`}
        onClick={e => { e.stopPropagation(); onDelete(); }}
        style={{
          background: 'none', border: 'none', color: 'var(--text-muted)',
          cursor: 'pointer', fontSize: '0.75rem', padding: '3px 5px',
          borderRadius: 4, flexShrink: 0, lineHeight: 1, transition: 'var(--transition)',
        }}
        onMouseEnter={e => { e.currentTarget.style.color = '#F87171'; e.currentTarget.style.background = 'rgba(239,68,68,0.1)'; }}
        onMouseLeave={e => { e.currentTarget.style.color = 'var(--text-muted)'; e.currentTarget.style.background = 'none'; }}
        title="Dismiss"
      >✕</button>
    </div>
  );
}
