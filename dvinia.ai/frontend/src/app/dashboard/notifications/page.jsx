'use client';
export const dynamic = 'force-dynamic';
import { useState } from 'react';
import Button from '../../../../components/ui/Button';
import Badge from '../../../../components/ui/Badge';

// ─── Mock data matching notifications schema ──────────────────────
const INITIAL_NOTIFICATIONS = [
  { id: 'n1', type: 'domain_expiry', title: 'Domain Expiring Soon', message: 'mybusiness.com expires in 45 days. Enable auto-renew to avoid losing it.', link: '/dashboard/domains', read_at: null, created_at: '2025-01-29T14:00:00Z' },
  { id: 'n2', type: 'ssl_renewed', title: 'SSL Certificate Renewed', message: 'SSL auto-renewed successfully for techpigeon.org. Valid until Jan 2026.', link: '/dashboard/hosting', read_at: null, created_at: '2025-01-28T09:30:00Z' },
  { id: 'n3', type: 'course_update', title: 'New Module Available', message: 'Module 10: "Lambda & Serverless" is now live in your AWS Cloud Practitioner course.', link: '/dashboard/training', read_at: null, created_at: '2025-01-27T16:00:00Z' },
  { id: 'n4', type: 'billing', title: 'Invoice Due', message: 'Invoice #TP-1051 for Rs.7,198 is due on Feb 1, 2025. Pay now to avoid service interruption.', link: '/dashboard/billing', read_at: null, created_at: '2025-01-27T10:00:00Z' },
  { id: 'n5', type: 'ticket_reply', title: 'Ticket Reply', message: 'Ali (Support) replied to your ticket: "Cannot access cPanel for techpigeon.org"', link: '/dashboard/tickets', read_at: '2025-01-29T15:00:00Z', created_at: '2025-01-29T14:20:00Z' },
  { id: 'n6', type: 'hosting', title: 'Server Maintenance', message: 'Scheduled maintenance on your Cloud Pro server on Feb 5, 2025 (02:00-04:00 PKT). Expect brief downtime.', link: '/dashboard/hosting', read_at: '2025-01-26T08:00:00Z', created_at: '2025-01-25T12:00:00Z' },
  { id: 'n7', type: 'security', title: 'New Login Detected', message: 'A new login was detected from Rawalpindi, PK (Chrome on Windows). If this wasn\'t you, change your password immediately.', link: '/dashboard/settings', read_at: '2025-01-24T18:00:00Z', created_at: '2025-01-24T17:30:00Z' },
  { id: 'n8', type: 'course_update', title: 'Certificate Ready', message: 'Congratulations! Your CompTIA Security+ certificate is ready to download.', link: '/dashboard/training', read_at: '2024-08-20T10:00:00Z', created_at: '2024-08-20T09:00:00Z' },
  { id: 'n9', type: 'billing', title: 'Payment Successful', message: 'Payment of Rs.8,399 received for order #TP-1050 via JazzCash. Thank you!', link: '/dashboard/billing', read_at: '2025-01-15T12:00:00Z', created_at: '2025-01-15T11:00:00Z' },
  { id: 'n10', type: 'promotion', title: 'Special Offer', message: 'Get 30% off on all hosting plans this weekend! Use code TECHPK30 at checkout.', link: '/hosting', read_at: '2025-01-20T10:00:00Z', created_at: '2025-01-18T09:00:00Z' },
];

const TYPE_CONFIG = {
  domain_expiry:  { icon: '⚠️', bg: 'bg-amber-50',   border: 'border-amber-200', iconBg: '#FEF3C7' },
  ssl_renewed:    { icon: '🔒', bg: 'bg-emerald-50',  border: 'border-emerald-200', iconBg: '#D1FAE5' },
  course_update:  { icon: '🎓', bg: 'bg-blue-50',     border: 'border-blue-200', iconBg: '#DBEAFE' },
  billing:        { icon: '💳', bg: 'bg-purple-50',   border: 'border-purple-200', iconBg: '#EDE9FE' },
  ticket_reply:   { icon: '🎫', bg: 'bg-[#e8f6fc]',  border: 'border-blue-200', iconBg: '#e8f6fc' },
  hosting:        { icon: '☁️', bg: 'bg-cyan-50',     border: 'border-cyan-200', iconBg: '#CFFAFE' },
  security:       { icon: '🛡️', bg: 'bg-red-50',      border: 'border-red-200', iconBg: '#FEE2E2' },
  promotion:      { icon: '🎉', bg: 'bg-yellow-50',   border: 'border-yellow-200', iconBg: '#FEF9C3' },
};

const FILTER_TYPES = [
  { value: 'all', label: 'All' },
  { value: 'domain_expiry', label: 'Domains' },
  { value: 'hosting', label: 'Hosting' },
  { value: 'billing', label: 'Billing' },
  { value: 'course_update', label: 'Training' },
  { value: 'ticket_reply', label: 'Tickets' },
  { value: 'security', label: 'Security' },
];

function timeAgo(dateStr) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  if (days < 7) return `${days}d ago`;
  const weeks = Math.floor(days / 7);
  if (weeks < 4) return `${weeks}w ago`;
  return new Date(dateStr).toLocaleDateString('en-PK', { month: 'short', day: 'numeric' });
}

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState(INITIAL_NOTIFICATIONS);
  const [filter, setFilter] = useState('all');
  const [showRead, setShowRead] = useState('all'); // 'all' | 'unread' | 'read'

  const unreadCount = notifications.filter(n => !n.read_at).length;

  const markAsRead = (id) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read_at: new Date().toISOString() } : n));
  };

  const markAllRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read_at: n.read_at || new Date().toISOString() })));
  };

  const deleteNotif = (id) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  let filtered = notifications;
  if (filter !== 'all') filtered = filtered.filter(n => n.type === filter);
  if (showRead === 'unread') filtered = filtered.filter(n => !n.read_at);
  if (showRead === 'read') filtered = filtered.filter(n => n.read_at);

  return (
    <div>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 style={{ fontFamily: "'Aleo',serif" }} className="text-2xl text-[#bba442]">
            Notifications
            {unreadCount > 0 && (
              <span className="ml-2 inline-flex items-center justify-center w-6 h-6 rounded-full bg-red-500 text-white text-xs font-bold">{unreadCount}</span>
            )}
          </h1>
          <p className="text-sm text-slate-500 mt-1">{unreadCount} unread notification{unreadCount !== 1 ? 's' : ''}</p>
        </div>
        {unreadCount > 0 && (
          <Button size="sm" variant="outline" onClick={markAllRead}>Mark All as Read</Button>
        )}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {[
          { label: 'Total', value: String(notifications.length), icon: '🔔', color: '#5cc4eb' },
          { label: 'Unread', value: String(unreadCount), icon: '📬', color: '#EF4444' },
          { label: 'This Week', value: String(notifications.filter(n => (Date.now() - new Date(n.created_at).getTime()) < 7 * 86400000).length), icon: '📅', color: '#F59E0B' },
          { label: 'Action Required', value: String(notifications.filter(n => !n.read_at && ['domain_expiry', 'billing', 'security'].includes(n.type)).length), icon: '⚡', color: '#F97316' },
        ].map(s => (
          <div key={s.label} className="bg-white border border-slate-200 rounded-2xl p-5 relative overflow-hidden hover:shadow-md transition-shadow">
            <div className="absolute top-4 right-4 w-11 h-11 rounded flex items-center justify-center text-xl" style={{ background: s.color + '18' }}>{s.icon}</div>
            <p className="text-xs font-medium text-slate-400 mb-2">{s.label}</p>
            <p className="text-2xl font-bold text-[#bba442]" style={{ fontFamily: "'Aleo',serif" }}>{s.value}</p>
          </div>
        ))}
      </div>

      {/* Filters Row */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-5">
        {/* Type Filter */}
        <div className="flex gap-2 flex-wrap flex-1">
          {FILTER_TYPES.map(f => (
            <button key={f.value} onClick={() => setFilter(f.value)} className={`px-4 py-1.5 rounded-full border text-xs font-semibold cursor-pointer transition-all ${filter === f.value ? 'bg-[#e8f6fc] border-[#5cc4eb] text-[#5cc4eb]' : 'bg-white border-slate-200 text-slate-500 hover:border-slate-300'}`}>
              {f.label}
            </button>
          ))}
        </div>

        {/* Read/Unread Filter */}
        <div className="flex gap-1 bg-white border border-slate-200 rounded-full p-0.5">
          {[['all', 'All'], ['unread', 'Unread'], ['read', 'Read']].map(([v, l]) => (
            <button key={v} onClick={() => setShowRead(v)} className={`px-3 py-1 rounded-full text-xs font-semibold border-none cursor-pointer transition-all ${showRead === v ? 'bg-[#1d1d1d] text-white' : 'bg-transparent text-slate-500'}`}>
              {l}
            </button>
          ))}
        </div>
      </div>

      {/* Notification List */}
      <div className="space-y-2">
        {filtered.length === 0 && (
          <div className="bg-white border border-slate-200 rounded-2xl p-12 text-center">
            <div className="text-4xl mb-3">🔔</div>
            <h3 className="font-semibold text-[#1d1d1d] mb-1">No notifications</h3>
            <p className="text-sm text-slate-400">You're all caught up!</p>
          </div>
        )}

        {filtered.map(notif => {
          const config = TYPE_CONFIG[notif.type] || TYPE_CONFIG.billing;
          const isUnread = !notif.read_at;

          return (
            <div
              key={notif.id}
              className={`flex items-start gap-4 p-4 rounded-2xl border transition-all cursor-pointer hover:shadow-sm group ${isUnread ? `${config.bg} ${config.border}` : 'bg-white border-slate-200 opacity-75 hover:opacity-100'}`}
              onClick={() => { if (isUnread) markAsRead(notif.id); }}
            >
              {/* Icon */}
              <div className="w-10 h-10 rounded flex items-center justify-center text-lg flex-shrink-0" style={{ background: config.iconBg }}>
                {config.icon}
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-0.5">
                  <h4 className={`text-sm font-semibold ${isUnread ? 'text-[#1d1d1d]' : 'text-slate-600'}`}>{notif.title}</h4>
                  {isUnread && <span className="w-2 h-2 rounded-full bg-[#5cc4eb] flex-shrink-0" />}
                </div>
                <p className={`text-sm leading-relaxed mb-1 ${isUnread ? 'text-slate-600' : 'text-slate-400'}`}>{notif.message}</p>
                <div className="flex items-center gap-3">
                  <span className="text-xs text-slate-400">{timeAgo(notif.created_at)}</span>
                  {notif.link && (
                    <a href={notif.link} className="text-xs text-[#5cc4eb] font-semibold no-underline hover:underline" onClick={e => e.stopPropagation()}>
                      View details →
                    </a>
                  )}
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0">
                {isUnread && (
                  <button onClick={(e) => { e.stopPropagation(); markAsRead(notif.id); }} className="w-8 h-8 rounded-lg bg-white/80 hover:bg-white flex items-center justify-center text-xs text-slate-400 hover:text-[#5cc4eb] border border-slate-200 cursor-pointer" title="Mark as read">
                    ✓
                  </button>
                )}
                <button onClick={(e) => { e.stopPropagation(); deleteNotif(notif.id); }} className="w-8 h-8 rounded-lg bg-white/80 hover:bg-red-50 flex items-center justify-center text-xs text-slate-400 hover:text-red-500 border border-slate-200 cursor-pointer" title="Delete">
                  ✕
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
