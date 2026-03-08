'use client';
export const dynamic = 'force-dynamic';
import { useState } from 'react';
import Button from '../../../components/ui/Button';
import Badge from '../../../components/ui/Badge';
import Modal from '../../../components/ui/Modal';
import Select from '../../../components/ui/Select';

// ─── Mock Staff ────────────────────────────────────────────────────
const STAFF = [
  { id: 's1', name: 'Usman Tariq', email: 'usman@techpigeon.org' },
  { id: 's2', name: 'Sara Ahmed', email: 'sara@techpigeon.org' },
  { id: 's3', name: 'Admin TechPigeon', email: 'admin@techpigeon.org' },
];

// ─── Mock Tickets (matches DB schema) ──────────────────────────────
const TICKETS = [
  {
    id: 't1',
    subject: 'Cannot access cPanel after hosting migration',
    department: 'hosting',
    priority: 'urgent',
    status: 'open',
    user_id: 'u1',
    user_name: 'Ali Khan',
    user_email: 'ali@example.com',
    assigned_to: null,
    created_at: '2025-01-29T13:20:00Z',
    updated_at: '2025-01-29T14:05:00Z',
    messages: [
      { id: 'm1', message: 'I just migrated my site to Cloud Pro plan but I cannot access cPanel anymore. It shows "403 Forbidden" error. My domain is cloudpak.com. Please help urgently — my business site is down!', is_staff: false, sender_id: 'u1', sender_name: 'Ali Khan', created_at: '2025-01-29T13:20:00Z' },
      { id: 'm2', message: 'Hi Ali, thank you for reaching out. I can see the migration completed but the DNS propagation is still in progress. Let me check the cPanel access from our end and get back to you shortly.', is_staff: true, sender_id: 's1', sender_name: 'Usman Tariq', created_at: '2025-01-29T13:45:00Z' },
      { id: 'm3', message: 'It has been 30 minutes and my site is still down. I am losing customers. Can you please escalate this?', is_staff: false, sender_id: 'u1', sender_name: 'Ali Khan', created_at: '2025-01-29T14:05:00Z' },
    ],
  },
  {
    id: 't2',
    subject: 'Domain transfer stuck in pending for 5 days',
    department: 'domains',
    priority: 'high',
    status: 'in_progress',
    user_id: 'u3',
    user_name: 'John Doe',
    user_email: 'john@pk.com',
    assigned_to: 's2',
    created_at: '2025-01-24T10:00:00Z',
    updated_at: '2025-01-28T16:30:00Z',
    messages: [
      { id: 'm4', message: 'I initiated a domain transfer for mybusiness.pk 5 days ago and it is still showing "Pending" status. The auth code was correct. Can you check what is going on?', is_staff: false, sender_id: 'u3', sender_name: 'John Doe', created_at: '2025-01-24T10:00:00Z' },
      { id: 'm5', message: 'Hi John, I have checked with our registrar partner. The current registrar has a 5-day waiting period for .pk domains. I have expedited the request and it should complete within 24 hours now.', is_staff: true, sender_id: 's2', sender_name: 'Sara Ahmed', created_at: '2025-01-25T09:15:00Z' },
      { id: 'm6', message: 'Thanks Sara. It is day 6 now and still nothing has changed. Any update?', is_staff: false, sender_id: 'u3', sender_name: 'John Doe', created_at: '2025-01-28T16:30:00Z' },
      { id: 'm7', message: 'I have escalated this with PKNIC directly. They confirmed a processing delay on their end. Expecting resolution by tomorrow morning. Apologies for the inconvenience.', is_staff: true, sender_id: 's2', sender_name: 'Sara Ahmed', created_at: '2025-01-28T17:00:00Z' },
    ],
  },
  {
    id: 't3',
    subject: 'Billing discrepancy on invoice TP-1050',
    department: 'billing',
    priority: 'medium',
    status: 'waiting',
    user_id: 'u1',
    user_name: 'Ali Khan',
    user_email: 'ali@example.com',
    assigned_to: 's3',
    created_at: '2025-01-27T08:30:00Z',
    updated_at: '2025-01-28T10:00:00Z',
    messages: [
      { id: 'm8', message: 'My invoice TP-1050 shows Rs.8,399 but I was on the Cloud Pro plan which should be Rs.3,599/month. Also I see a Wildcard SSL charge of Rs.1,801 that I never ordered. Please review.', is_staff: false, sender_id: 'u1', sender_name: 'Ali Khan', created_at: '2025-01-27T08:30:00Z' },
      { id: 'm9', message: 'Hi Ali, I have reviewed invoice TP-1050. The SSL was auto-added during your domain renewal as part of a promotional bundle. I have removed the SSL charge and issued a credit of Rs.1,801 to your account. The domain renewal charge of Rs.2,999 is correct. Could you confirm you are satisfied with this resolution?', is_staff: true, sender_id: 's3', sender_name: 'Admin TechPigeon', created_at: '2025-01-28T10:00:00Z' },
    ],
  },
  {
    id: 't4',
    subject: 'Docker & Kubernetes course video not loading',
    department: 'training',
    priority: 'low',
    status: 'resolved',
    user_id: 'u2',
    user_name: 'Sara Ahmed',
    user_email: 'sara@mail.com',
    assigned_to: 's1',
    created_at: '2025-01-22T14:00:00Z',
    updated_at: '2025-01-23T09:30:00Z',
    messages: [
      { id: 'm10', message: 'The video for Module 3 — "Kubernetes Deployments" is not loading. I get a spinner that never stops. I tried Chrome and Firefox, same issue. Other modules work fine.', is_staff: false, sender_id: 'u2', sender_name: 'Sara Ahmed', created_at: '2025-01-22T14:00:00Z' },
      { id: 'm11', message: 'Hi Sara, thanks for reporting this. We identified a CDN caching issue affecting Module 3 specifically. Our team has purged the cache and re-uploaded the video file. Could you try again and let us know?', is_staff: true, sender_id: 's1', sender_name: 'Usman Tariq', created_at: '2025-01-22T16:30:00Z' },
      { id: 'm12', message: 'Yes it works now! Thank you for the quick fix.', is_staff: false, sender_id: 'u2', sender_name: 'Sara Ahmed', created_at: '2025-01-23T09:30:00Z' },
    ],
  },
  {
    id: 't5',
    subject: 'Server keeps crashing every 2 hours',
    department: 'technical',
    priority: 'urgent',
    status: 'open',
    user_id: 'u4',
    user_name: 'Fatima Noor',
    user_email: 'fatima@biz.pk',
    assigned_to: 's1',
    created_at: '2025-01-29T09:00:00Z',
    updated_at: '2025-01-29T12:45:00Z',
    messages: [
      { id: 'm13', message: 'My Cloud Business server has been crashing every 2 hours since last night. I have 8 client websites on this hosting. CPU spikes to 100% right before crash. Logs show OOM errors. This is extremely critical for my reseller business.', is_staff: false, sender_id: 'u4', sender_name: 'Fatima Noor', created_at: '2025-01-29T09:00:00Z' },
      { id: 'm14', message: 'Hi Fatima, this is a P1 priority for us. I can see the OOM pattern in our monitoring. It appears one of your WordPress sites (client-site-3.pk) has a cron job running every 30 minutes that consumes excessive memory. I am temporarily increasing your RAM allocation to 4GB while we investigate the root cause.', is_staff: true, sender_id: 's1', sender_name: 'Usman Tariq', created_at: '2025-01-29T10:15:00Z' },
      { id: 'm15', message: 'Thanks for the quick response. The server has been stable for the last hour. But I need a permanent fix — I cannot afford downtime for my clients.', is_staff: false, sender_id: 'u4', sender_name: 'Fatima Noor', created_at: '2025-01-29T11:30:00Z' },
      { id: 'm16', message: 'We have identified the problematic plugin (WP-Cron Manager v2.3.1) on client-site-3.pk. It has a known memory leak in that version. We recommend updating to v2.4.0 or disabling the plugin. Shall we proceed with the update on your behalf?', is_staff: true, sender_id: 's1', sender_name: 'Usman Tariq', created_at: '2025-01-29T12:45:00Z' },
    ],
  },
  {
    id: 't6',
    subject: 'Need help setting up email forwarding',
    department: 'general',
    priority: 'low',
    status: 'closed',
    user_id: 'u8',
    user_name: 'Ayesha Malik',
    user_email: 'ayesha@cloud.pk',
    assigned_to: 's2',
    created_at: '2025-01-20T11:00:00Z',
    updated_at: '2025-01-21T15:00:00Z',
    messages: [
      { id: 'm17', message: 'Hi, I would like to set up email forwarding from info@mycloud.pk to my personal Gmail. I looked in cPanel but could not find the right option. Can you guide me?', is_staff: false, sender_id: 'u8', sender_name: 'Ayesha Malik', created_at: '2025-01-20T11:00:00Z' },
      { id: 'm18', message: 'Hi Ayesha! Sure, here is how to set it up:\n\n1. Log in to cPanel\n2. Go to "Email" section\n3. Click "Forwarders"\n4. Click "Add Forwarder"\n5. Enter info@ as the address\n6. Select "Forward to email address"\n7. Enter your Gmail address\n8. Click "Add Forwarder"\n\nLet me know if you need further help!', is_staff: true, sender_id: 's2', sender_name: 'Sara Ahmed', created_at: '2025-01-20T14:00:00Z' },
      { id: 'm19', message: 'Got it working! Thank you so much Sara. You can close this ticket.', is_staff: false, sender_id: 'u8', sender_name: 'Ayesha Malik', created_at: '2025-01-21T15:00:00Z' },
    ],
  },
];

// ─── Maps & Helpers ────────────────────────────────────────────────
const STATUS_MAP = {
  open:        { variant: 'blue',   label: 'Open' },
  in_progress: { variant: 'yellow', label: 'In Progress' },
  waiting:     { variant: 'purple', label: 'Waiting' },
  resolved:    { variant: 'green',  label: 'Resolved' },
  closed:      { variant: 'gray',   label: 'Closed' },
};

const PRIORITY_MAP = {
  low:    { color: '#41D33E', label: 'Low' },
  medium: { color: '#F8D313', label: 'Medium' },
  high:   { color: '#F73730', label: 'High' },
  urgent: { color: '#F73730', label: 'Urgent' },
};

const DEPARTMENT_MAP = {
  domains:   { icon: '🌐', label: 'Domains' },
  hosting:   { icon: '☁️', label: 'Hosting' },
  billing:   { icon: '💳', label: 'Billing' },
  training:  { icon: '🎓', label: 'Training' },
  general:   { icon: '💬', label: 'General' },
  technical: { icon: '🔧', label: 'Technical' },
};

function timeAgo(dateStr) {
  if (!dateStr) return 'Never';
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'Just now';
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  if (days < 30) return `${days}d ago`;
  return new Date(dateStr).toLocaleDateString('en-PK', { month: 'short', day: 'numeric', year: 'numeric' });
}

function formatDate(dateStr) {
  return new Date(dateStr).toLocaleString('en-PK', {
    month: 'short', day: 'numeric', year: 'numeric',
    hour: '2-digit', minute: '2-digit',
  });
}

// ─── Thread Modal ──────────────────────────────────────────────────
function TicketThreadModal({ ticket, open, onClose }) {
  const [reply, setReply] = useState('');
  const [sending, setSending] = useState(false);
  const [status, setStatus] = useState(ticket?.status || 'open');
  const [assignee, setAssignee] = useState(ticket?.assigned_to || '');

  if (!ticket) return null;

  const st = STATUS_MAP[ticket.status] || STATUS_MAP.open;
  const pr = PRIORITY_MAP[ticket.priority] || PRIORITY_MAP.medium;
  const dept = DEPARTMENT_MAP[ticket.department] || DEPARTMENT_MAP.general;

  const handleSendReply = () => {
    if (!reply.trim()) return;
    setSending(true);
    setTimeout(() => {
      setSending(false);
      setReply('');
    }, 800);
  };

  return (
    <Modal open={open} onClose={onClose} title={`Ticket #${ticket.id.toUpperCase()}`} width={680}>
      {/* Ticket Meta Header */}
      <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 mb-5">
        <div className="flex items-start justify-between gap-3 mb-3">
          <h4 style={{ fontFamily: "'Aleo',serif" }} className="text-lg text-[#bba442] leading-snug flex-1">
            {ticket.subject}
          </h4>
          <Badge variant={st.variant}>{st.label}</Badge>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div>
            <div className="text-[10px] uppercase font-semibold text-slate-400 mb-0.5">Priority</div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ background: pr.color }} />
              <span className="text-sm font-semibold text-[#1d1d1d]">{pr.label}</span>
            </div>
          </div>
          <div>
            <div className="text-[10px] uppercase font-semibold text-slate-400 mb-0.5">Department</div>
            <span className="text-sm text-[#1d1d1d]">{dept.icon} {dept.label}</span>
          </div>
          <div>
            <div className="text-[10px] uppercase font-semibold text-slate-400 mb-0.5">User</div>
            <span className="text-sm text-[#1d1d1d]">{ticket.user_name}</span>
          </div>
          <div>
            <div className="text-[10px] uppercase font-semibold text-slate-400 mb-0.5">Email</div>
            <span className="text-xs text-slate-500 break-all">{ticket.user_email}</span>
          </div>
        </div>

        <div className="flex items-center gap-4 mt-3 pt-3 border-t border-slate-200">
          <span className="text-[10px] text-slate-400">Created: {formatDate(ticket.created_at)}</span>
          <span className="text-[10px] text-slate-400">Updated: {formatDate(ticket.updated_at)}</span>
          {ticket.assigned_to && (
            <span className="text-[10px] text-slate-400">
              Assigned: {STAFF.find(s => s.id === ticket.assigned_to)?.name || 'Unknown'}
            </span>
          )}
        </div>
      </div>

      {/* Message Thread */}
      <div className="mb-5">
        <h5 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">
          Conversation ({ticket.messages.length} messages)
        </h5>
        <div className="space-y-3 max-h-[340px] overflow-y-auto pr-1">
          {ticket.messages.map((msg) => {
            const isStaff = msg.is_staff;
            return (
              <div key={msg.id} className={`flex ${isStaff ? 'justify-start' : 'justify-end'}`}>
                <div
                  className={`max-w-[85%] rounded-xl px-4 py-3 ${
                    isStaff
                      ? 'bg-[#e8f6fc] border border-blue-100'
                      : 'bg-slate-100 border border-slate-200'
                  }`}
                >
                  <div className="flex items-center gap-2 mb-1.5">
                    <div
                      className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold text-white flex-shrink-0 ${
                        isStaff ? 'bg-[#5cc4eb]' : 'bg-[#1d1d1d]'
                      }`}
                    >
                      {msg.sender_name.split(' ').map(n => n[0]).join('')}
                    </div>
                    <span className="text-xs font-semibold text-[#1d1d1d]">{msg.sender_name}</span>
                    {isStaff && (
                      <span className="text-[10px] font-semibold text-[#5cc4eb] bg-[#5cc4eb18] px-1.5 py-0.5 rounded">
                        Staff
                      </span>
                    )}
                    <span className="text-[10px] text-slate-400 ml-auto">{timeAgo(msg.created_at)}</span>
                  </div>
                  <p className="text-sm text-[#1d1d1d] leading-relaxed whitespace-pre-wrap">{msg.message}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Staff Actions */}
      {ticket.status !== 'closed' && (
        <div className="border-t border-slate-200 pt-5">
          {/* Reply */}
          <div className="mb-4">
            <label className="block text-sm font-semibold text-slate-700 mb-1.5">Staff Reply</label>
            <textarea
              value={reply}
              onChange={(e) => setReply(e.target.value)}
              placeholder="Type your reply to the customer..."
              rows={4}
              className="w-full px-4 py-3 border-2 border-slate-200 rounded text-sm text-[#1d1d1d] bg-white outline-none focus:border-[#5cc4eb] transition-all resize-none"
              style={{ fontFamily: "'Open Sans',sans-serif" }}
            />
          </div>

          {/* Status + Assign */}
          <div className="grid grid-cols-2 gap-3 mb-4">
            <Select
              label="Change Status"
              value={status}
              onChange={setStatus}
              options={[
                { value: 'open', label: 'Open' },
                { value: 'in_progress', label: 'In Progress' },
                { value: 'waiting', label: 'Waiting on Customer' },
                { value: 'resolved', label: 'Resolved' },
                { value: 'closed', label: 'Closed' },
              ]}
            />
            <Select
              label="Assign to Staff"
              value={assignee}
              onChange={setAssignee}
              options={[
                { value: '', label: 'Unassigned' },
                ...STAFF.map(s => ({ value: s.id, label: s.name })),
              ]}
            />
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3">
            <Button full loading={sending} onClick={handleSendReply}>
              Send Reply
            </Button>
            <Button full variant="outline" onClick={onClose}>
              Close Panel
            </Button>
          </div>
        </div>
      )}

      {ticket.status === 'closed' && (
        <div className="border-t border-slate-200 pt-5">
          <div className="flex items-center gap-3 p-4 rounded bg-slate-50 border border-slate-200">
            <span className="text-lg">🔒</span>
            <div>
              <p className="text-sm font-semibold text-[#1d1d1d]">This ticket is closed</p>
              <p className="text-xs text-slate-400">Reopen the ticket to send a new reply.</p>
            </div>
            <Button size="sm" variant="outline" className="ml-auto" onClick={() => setStatus('open')}>
              Reopen
            </Button>
          </div>
        </div>
      )}
    </Modal>
  );
}

// ─── Main Page ─────────────────────────────────────────────────────
export default function AdminTicketsPage() {
  const [statusFilter, setStatusFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');
  const [search, setSearch] = useState('');
  const [selectedTicket, setSelectedTicket] = useState(null);

  // Filtering
  let filtered = TICKETS;
  if (statusFilter !== 'all') filtered = filtered.filter(t => t.status === statusFilter);
  if (priorityFilter !== 'all') filtered = filtered.filter(t => t.priority === priorityFilter);
  if (search) {
    const q = search.toLowerCase();
    filtered = filtered.filter(t =>
      `${t.subject} ${t.user_email} ${t.user_name} ${t.department}`.toLowerCase().includes(q)
    );
  }

  // Stats
  const totalTickets = TICKETS.length;
  const openCount = TICKETS.filter(t => t.status === 'open').length;
  const inProgressCount = TICKETS.filter(t => t.status === 'in_progress').length;
  const urgentCount = TICKETS.filter(t => t.priority === 'urgent').length;

  const STATUS_TABS = [
    { key: 'all', label: `All (${totalTickets})` },
    { key: 'open', label: 'Open' },
    { key: 'in_progress', label: 'In Progress' },
    { key: 'waiting', label: 'Waiting' },
    { key: 'resolved', label: 'Resolved' },
    { key: 'closed', label: 'Closed' },
  ];

  const PRIORITY_OPTIONS = [
    { key: 'all', label: 'All Priorities' },
    { key: 'low', label: 'Low' },
    { key: 'medium', label: 'Medium' },
    { key: 'high', label: 'High' },
    { key: 'urgent', label: 'Urgent' },
  ];

  return (
    <div>
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <span className="bg-[#5cc4eb] text-white text-xs font-bold px-2.5 py-1 rounded-full">ADMIN</span>
        <h1 style={{ fontFamily: "'Aleo',serif" }} className="text-2xl text-[#bba442]">Tickets</h1>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {[
          { label: 'Total Tickets', value: String(totalTickets), icon: '🎫', color: '#5cc4eb' },
          { label: 'Open', value: String(openCount), icon: '📬', color: '#F8D313' },
          { label: 'In Progress', value: String(inProgressCount), icon: '🔄', color: '#bba442' },
          { label: 'Urgent', value: String(urgentCount), icon: '🚨', color: '#F73730' },
        ].map(s => (
          <div key={s.label} className="bg-white border border-slate-200 rounded-2xl p-5 relative overflow-hidden hover:shadow-md transition-shadow">
            <div
              className="absolute top-4 right-4 w-11 h-11 rounded flex items-center justify-center text-xl"
              style={{ background: s.color + '18' }}
            >
              {s.icon}
            </div>
            <p className="text-xs font-medium text-slate-400 mb-2">{s.label}</p>
            <p className="text-2xl font-bold text-[#bba442]" style={{ fontFamily: "'Aleo',serif" }}>
              {s.value}
            </p>
          </div>
        ))}
      </div>

      {/* Search + Filters */}
      <div className="flex flex-col gap-3 mb-5">
        {/* Search bar + Priority filter row */}
        <div className="flex flex-col sm:flex-row gap-3">
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search tickets by subject, email, user..."
            className="flex-1 px-4 py-2.5 border-2 border-slate-200 rounded text-sm text-[#1d1d1d] bg-white outline-none focus:border-[#5cc4eb] transition-all"
            style={{ fontFamily: "'Open Sans',sans-serif" }}
          />
          <div className="flex gap-2 flex-wrap">
            {PRIORITY_OPTIONS.map(p => (
              <button
                key={p.key}
                onClick={() => setPriorityFilter(p.key)}
                className={`px-3 py-1.5 rounded-full border text-xs font-semibold cursor-pointer transition-all ${
                  priorityFilter === p.key
                    ? 'bg-[#e8f6fc] border-[#5cc4eb] text-[#5cc4eb]'
                    : 'bg-white border-slate-200 text-slate-500 hover:border-slate-300'
                }`}
              >
                {p.key !== 'all' && (
                  <span
                    className="inline-block w-2 h-2 rounded-full mr-1.5"
                    style={{ background: PRIORITY_MAP[p.key]?.color }}
                  />
                )}
                {p.label}
              </button>
            ))}
          </div>
        </div>

        {/* Status tabs */}
        <div className="flex gap-2 flex-wrap">
          {STATUS_TABS.map(tab => (
            <button
              key={tab.key}
              onClick={() => setStatusFilter(tab.key)}
              className={`px-4 py-1.5 rounded-full border text-xs font-semibold cursor-pointer transition-all ${
                statusFilter === tab.key
                  ? 'bg-[#e8f6fc] border-[#5cc4eb] text-[#5cc4eb]'
                  : 'bg-white border-slate-200 text-slate-500 hover:border-slate-300'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Ticket Cards List */}
      <div className="space-y-3">
        {filtered.length === 0 && (
          <div className="bg-white border border-slate-200 rounded-2xl p-10 text-center">
            <p className="text-slate-400 text-sm">No tickets found matching your filters.</p>
          </div>
        )}

        {filtered.map(ticket => {
          const st = STATUS_MAP[ticket.status] || STATUS_MAP.open;
          const pr = PRIORITY_MAP[ticket.priority] || PRIORITY_MAP.medium;
          const dept = DEPARTMENT_MAP[ticket.department] || DEPARTMENT_MAP.general;
          const isUrgent = ticket.priority === 'urgent';
          const assignedStaff = ticket.assigned_to
            ? STAFF.find(s => s.id === ticket.assigned_to)
            : null;

          return (
            <div
              key={ticket.id}
              onClick={() => setSelectedTicket(ticket)}
              className={`bg-white rounded-2xl p-5 cursor-pointer hover:shadow-md transition-all ${
                isUrgent
                  ? 'border-2 border-red-300 shadow-sm shadow-red-100'
                  : 'border border-slate-200'
              }`}
            >
              {/* Top row: subject + badges */}
              <div className="flex items-start justify-between gap-3 mb-3">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    {isUrgent && (
                      <span className="text-[10px] font-bold text-white bg-[#F73730] px-2 py-0.5 rounded">
                        URGENT
                      </span>
                    )}
                    <span className="text-[10px] font-semibold text-slate-400 uppercase">
                      #{ticket.id.toUpperCase()}
                    </span>
                  </div>
                  <h3
                    className="text-sm font-semibold text-[#1d1d1d] leading-snug truncate"
                    style={{ fontFamily: "'Open Sans',sans-serif" }}
                  >
                    {ticket.subject}
                  </h3>
                </div>
                <Badge variant={st.variant}>{st.label}</Badge>
              </div>

              {/* Middle row: meta info */}
              <div className="flex items-center flex-wrap gap-x-4 gap-y-2 mb-3">
                {/* User */}
                <div className="flex items-center gap-1.5">
                  <div className="w-5 h-5 rounded-full bg-[#1d1d1d] text-white flex items-center justify-center text-[9px] font-bold flex-shrink-0">
                    {ticket.user_name.split(' ').map(n => n[0]).join('')}
                  </div>
                  <span className="text-xs text-slate-500">{ticket.user_email}</span>
                </div>

                {/* Department */}
                <span className="text-xs text-slate-500">
                  {dept.icon} {dept.label}
                </span>

                {/* Priority dot */}
                <span className="flex items-center gap-1 text-xs text-slate-500">
                  <span
                    className="w-2 h-2 rounded-full flex-shrink-0"
                    style={{ background: pr.color }}
                  />
                  {pr.label}
                </span>

                {/* Assigned */}
                {assignedStaff && (
                  <span className="text-xs text-slate-400">
                    → {assignedStaff.name}
                  </span>
                )}
              </div>

              {/* Bottom row: time + message count */}
              <div className="flex items-center justify-between">
                <span className="text-[11px] text-slate-400">
                  Updated {timeAgo(ticket.updated_at)}
                </span>
                <div className="flex items-center gap-1.5">
                  <span className="text-[11px] text-slate-400">
                    💬 {ticket.messages.length} {ticket.messages.length === 1 ? 'message' : 'messages'}
                  </span>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedTicket(ticket);
                    }}
                  >
                    View Thread
                  </Button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Thread Modal */}
      <TicketThreadModal
        ticket={selectedTicket}
        open={!!selectedTicket}
        onClose={() => setSelectedTicket(null)}
      />
    </div>
  );
}
