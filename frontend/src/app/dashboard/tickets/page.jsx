'use client';
export const dynamic = 'force-dynamic';
import { useState } from 'react';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import Modal from '@/components/ui/Modal';
import Input from '@/components/ui/Input';
import Select from '@/components/ui/Select';
import Alert from '@/components/ui/Alert';

// ─── Mock data matching tickets + ticket_messages schema ──────────
const TICKETS = [
  {
    id: 't1', subject: 'Cannot access cPanel for techpigeon.org', department: 'hosting', priority: 'high', status: 'in_progress',
    created_at: '2025-01-28T10:30:00Z', updated_at: '2025-01-29T14:20:00Z', resolved_at: null,
    messages: [
      { id: 'm1', sender: 'You', is_staff: false, message: "Hi, I've been trying to log in to cPanel for techpigeon.org but keep getting a 403 error. I've tried resetting my password but it still doesn't work. Can you help?", created_at: '2025-01-28T10:30:00Z' },
      { id: 'm2', sender: 'Ali (Support)', is_staff: true, message: "Hello! Thank you for reaching out. I can see the issue — your cPanel account was temporarily locked due to multiple failed login attempts. I've unlocked it now. Please try logging in again with your original credentials.", created_at: '2025-01-28T11:15:00Z' },
      { id: 'm3', sender: 'You', is_staff: false, message: "Thanks Ali! I tried again but still getting the same error. Could it be a firewall issue?", created_at: '2025-01-29T09:00:00Z' },
      { id: 'm4', sender: 'Ali (Support)', is_staff: true, message: "Good catch — I've checked and your IP was blocked by our firewall due to the earlier failed attempts. I've whitelisted your IP (203.215.xx.xx). Please clear your browser cache and try again in 5 minutes.", created_at: '2025-01-29T14:20:00Z' },
    ],
  },
  {
    id: 't2', subject: 'Domain transfer request for alistore.com.pk', department: 'domains', priority: 'medium', status: 'waiting',
    created_at: '2025-01-25T08:00:00Z', updated_at: '2025-01-26T16:45:00Z', resolved_at: null,
    messages: [
      { id: 'm5', sender: 'You', is_staff: false, message: "I'd like to transfer alistore.com.pk to my TechPigeon account from my previous registrar (PK NIC). I have the auth code ready.", created_at: '2025-01-25T08:00:00Z' },
      { id: 'm6', sender: 'Sara (Support)', is_staff: true, message: "Thank you! Please provide the auth/EPP code and we'll initiate the transfer. Note that .com.pk transfers typically take 3-5 business days.", created_at: '2025-01-25T10:30:00Z' },
      { id: 'm7', sender: 'You', is_staff: false, message: "Here's the auth code: TPK-2025-XXXX-YYYY. Please proceed with the transfer.", created_at: '2025-01-25T11:00:00Z' },
      { id: 'm8', sender: 'Sara (Support)', is_staff: true, message: "Transfer initiated! We're waiting for approval from your previous registrar. I'll update you once we hear back. Expected completion: Jan 31.", created_at: '2025-01-26T16:45:00Z' },
    ],
  },
  {
    id: 't3', subject: 'Billing discrepancy on invoice TP-1048', department: 'billing', priority: 'low', status: 'resolved',
    created_at: '2024-10-05T12:00:00Z', updated_at: '2024-10-07T09:30:00Z', resolved_at: '2024-10-07T09:30:00Z',
    messages: [
      { id: 'm9', sender: 'You', is_staff: false, message: "On invoice TP-1048, I was charged Rs.12,999 but the course page showed a price of Rs.10,999 with the early bird discount.", created_at: '2024-10-05T12:00:00Z' },
      { id: 'm10', sender: 'Usman (Billing)', is_staff: true, message: "I've reviewed your invoice. You're correct — the early bird discount of Rs.2,000 was applied to the subtotal. The final charge of Rs.12,999 reflects the original price minus the discount. The Rs.10,999 on the course page was an older promotional rate. However, as a goodwill gesture, I've issued a Rs.2,000 credit to your account.", created_at: '2024-10-07T09:30:00Z' },
    ],
  },
  {
    id: 't4', subject: 'SSL certificate not showing on mybusiness.pk', department: 'technical', priority: 'urgent', status: 'open',
    created_at: '2025-01-29T16:00:00Z', updated_at: '2025-01-29T16:00:00Z', resolved_at: null,
    messages: [
      { id: 'm11', sender: 'You', is_staff: false, message: "My SSL certificate for mybusiness.pk is showing as invalid in Chrome. The padlock icon has a red X. This is urgent as customers are reporting the issue.", created_at: '2025-01-29T16:00:00Z' },
    ],
  },
];

const STATUS_MAP = {
  open:        { variant: 'blue',   label: 'Open' },
  in_progress: { variant: 'yellow', label: 'In Progress' },
  waiting:     { variant: 'purple', label: 'Waiting' },
  resolved:    { variant: 'green',  label: 'Resolved' },
  closed:      { variant: 'gray',   label: 'Closed' },
};

const PRIORITY_MAP = {
  low:    { color: 'text-slate-500 bg-slate-100', dot: 'bg-slate-400' },
  medium: { color: 'text-amber-700 bg-amber-50', dot: 'bg-amber-500' },
  high:   { color: 'text-orange-700 bg-orange-50', dot: 'bg-orange-500' },
  urgent: { color: 'text-red-700 bg-red-50', dot: 'bg-red-500 animate-pulse' },
};

const DEPT_MAP = {
  domains:   { label: 'Domains', icon: '🌐' },
  hosting:   { label: 'Hosting', icon: '☁️' },
  billing:   { label: 'Billing', icon: '💳' },
  training:  { label: 'Training', icon: '🎓' },
  general:   { label: 'General', icon: '💬' },
  technical: { label: 'Technical', icon: '🔧' },
};

function timeAgo(dateStr) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  return `${days}d ago`;
}

function CreateTicketModal({ open, onClose }) {
  const [form, setForm] = useState({ subject: '', department: 'general', priority: 'medium', message: '' });
  const [loading, setLoading] = useState(false);
  const set = (k) => (v) => setForm(p => ({ ...p, [k]: typeof v === 'object' && v?.target ? v.target.value : v }));

  const submit = () => {
    if (!form.subject.trim() || !form.message.trim()) return;
    setLoading(true);
    setTimeout(() => { setLoading(false); onClose(); }, 800);
  };

  return (
    <Modal open={open} onClose={onClose} title="Create Support Ticket" width={560}>
      <Input label="Subject" value={form.subject} onChange={set('subject')} placeholder="Brief description of your issue" />
      <div className="grid grid-cols-2 gap-3">
        <Select label="Department" value={form.department} onChange={set('department')} options={[
          { value: 'general', label: 'General' }, { value: 'domains', label: 'Domains' },
          { value: 'hosting', label: 'Hosting' }, { value: 'billing', label: 'Billing' },
          { value: 'training', label: 'Training' }, { value: 'technical', label: 'Technical' },
        ]} />
        <Select label="Priority" value={form.priority} onChange={set('priority')} options={[
          { value: 'low', label: 'Low' }, { value: 'medium', label: 'Medium' },
          { value: 'high', label: 'High' }, { value: 'urgent', label: 'Urgent' },
        ]} />
      </div>
      <div className="mb-4">
        <label className="block text-sm font-semibold text-slate-700 mb-1.5">Message</label>
        <textarea
          value={form.message} onChange={e => setForm(p => ({ ...p, message: e.target.value }))}
          placeholder="Describe your issue in detail..."
          rows={5}
          className="w-full px-4 py-3 border-2 border-slate-200 rounded text-sm text-[#1d1d1d] bg-white outline-none focus:border-[#5cc4eb] focus:ring-4 focus:ring-[#5cc4eb]/10 transition-all resize-none"
        />
      </div>
      <div className="flex gap-3">
        <Button full loading={loading} onClick={submit}>Submit Ticket</Button>
        <Button full variant="outline" onClick={onClose}>Cancel</Button>
      </div>
    </Modal>
  );
}

function TicketThreadModal({ ticket, open, onClose }) {
  const [reply, setReply] = useState('');
  const [sending, setSending] = useState(false);

  if (!ticket) return null;
  const st = STATUS_MAP[ticket.status] || STATUS_MAP.open;
  const pr = PRIORITY_MAP[ticket.priority] || PRIORITY_MAP.medium;
  const dept = DEPT_MAP[ticket.department] || DEPT_MAP.general;

  const sendReply = () => {
    if (!reply.trim()) return;
    setSending(true);
    setTimeout(() => { setSending(false); setReply(''); }, 600);
  };

  return (
    <Modal open={open} onClose={onClose} title={ticket.subject} width={640}>
      {/* Ticket Meta */}
      <div className="flex flex-wrap items-center gap-2 mb-4">
        <Badge variant={st.variant}>{st.label}</Badge>
        <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold capitalize ${pr.color}`}>
          <span className={`w-1.5 h-1.5 rounded-full ${pr.dot}`} />
          {ticket.priority}
        </span>
        <span className="text-xs text-slate-400">{dept.icon} {dept.label}</span>
        <span className="text-xs text-slate-400">Opened {timeAgo(ticket.created_at)}</span>
      </div>

      {ticket.status === 'resolved' && (
        <Alert type="success">This ticket has been resolved. If you need further help, feel free to reopen it.</Alert>
      )}

      {/* Message Thread */}
      <div className="space-y-4 max-h-[380px] overflow-y-auto pr-1 mb-4">
        {ticket.messages.map(msg => (
          <div key={msg.id} className={`flex gap-3 ${msg.is_staff ? '' : 'flex-row-reverse'}`}>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 ${msg.is_staff ? 'bg-[#e8f6fc] text-[#3ba8d4]' : 'bg-[#1d1d1d] text-white'}`}>
              {msg.is_staff ? 'S' : 'U'}
            </div>
            <div className={`flex-1 max-w-[80%] ${msg.is_staff ? '' : 'text-right'}`}>
              <div className={`inline-block text-left p-4 rounded-2xl text-sm leading-relaxed ${msg.is_staff ? 'bg-[#e8f6fc] text-[#1d1d1d] rounded-tl-sm' : 'bg-[#1d1d1d] text-white rounded-tr-sm'}`}>
                {msg.message}
              </div>
              <div className="flex items-center gap-2 mt-1 text-xs text-slate-400">
                <span>{msg.sender}</span>
                <span>&middot;</span>
                <span>{new Date(msg.created_at).toLocaleString('en-PK', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Reply Box */}
      {ticket.status !== 'closed' && (
        <div className="border-t border-slate-100 pt-4">
          <div className="flex gap-3">
            <textarea
              value={reply} onChange={e => setReply(e.target.value)}
              placeholder="Type your reply..."
              rows={3}
              className="flex-1 px-4 py-3 border-2 border-slate-200 rounded text-sm text-[#1d1d1d] bg-white outline-none focus:border-[#5cc4eb] focus:ring-4 focus:ring-[#5cc4eb]/10 transition-all resize-none"
            />
          </div>
          <div className="flex justify-end gap-2 mt-3">
            <Button size="sm" variant="outline" onClick={onClose}>Close</Button>
            <Button size="sm" loading={sending} onClick={sendReply}>Send Reply</Button>
          </div>
        </div>
      )}
    </Modal>
  );
}

export default function TicketsPage() {
  const [createModal, setCreateModal] = useState(false);
  const [threadModal, setThreadModal] = useState(null);
  const [filter, setFilter] = useState('all');

  const open = TICKETS.filter(t => ['open', 'in_progress', 'waiting'].includes(t.status)).length;
  const resolved = TICKETS.filter(t => t.status === 'resolved').length;
  const urgent = TICKETS.filter(t => t.priority === 'urgent').length;
  const filtered = filter === 'all' ? TICKETS : TICKETS.filter(t => t.status === filter);

  return (
    <div>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 style={{ fontFamily: "'Aleo',serif" }} className="text-2xl text-[#bba442]">Support Tickets</h1>
          <p className="text-sm text-slate-500 mt-1">Get help from our support team</p>
        </div>
        <Button size="sm" onClick={() => setCreateModal(true)}>+ New Ticket</Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {[
          { label: 'Total Tickets', value: String(TICKETS.length), icon: '🎫', color: '#5cc4eb' },
          { label: 'Open', value: String(open), icon: '📬', color: '#F59E0B' },
          { label: 'Resolved', value: String(resolved), icon: '✅', color: '#10B981' },
          { label: 'Urgent', value: String(urgent), icon: '🚨', color: '#EF4444' },
        ].map(s => (
          <div key={s.label} className="bg-white border border-slate-200 rounded-2xl p-5 relative overflow-hidden hover:shadow-md transition-shadow">
            <div className="absolute top-4 right-4 w-11 h-11 rounded-xl flex items-center justify-center text-xl" style={{ background: s.color + '18' }}>{s.icon}</div>
            <p className="text-xs font-medium text-slate-400 mb-2">{s.label}</p>
            <p className="text-2xl font-bold text-[#bba442]" style={{ fontFamily: "'Aleo',serif" }}>{s.value}</p>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex gap-2 mb-5 flex-wrap">
        {['all', 'open', 'in_progress', 'waiting', 'resolved'].map(f => (
          <button key={f} onClick={() => setFilter(f)} className={`px-4 py-1.5 rounded-full border text-xs font-semibold cursor-pointer transition-all ${filter === f ? 'bg-[#e8f6fc] border-[#5cc4eb] text-[#5cc4eb]' : 'bg-white border-slate-200 text-slate-500 hover:border-slate-300'}`}>
            {f === 'all' ? `All (${TICKETS.length})` : `${f.replace('_', ' ')} (${TICKETS.filter(t => t.status === f).length})`}
          </button>
        ))}
      </div>

      {/* Ticket List */}
      <div className="space-y-3">
        {filtered.length === 0 && (
          <div className="bg-white border border-slate-200 rounded-2xl p-8 text-center text-slate-400">No tickets found.</div>
        )}
        {filtered.map(ticket => {
          const st = STATUS_MAP[ticket.status] || STATUS_MAP.open;
          const pr = PRIORITY_MAP[ticket.priority] || PRIORITY_MAP.medium;
          const dept = DEPT_MAP[ticket.department] || DEPT_MAP.general;
          const lastMsg = ticket.messages[ticket.messages.length - 1];

          return (
            <div
              key={ticket.id}
              onClick={() => setThreadModal(ticket)}
              className={`bg-white border rounded-2xl p-5 cursor-pointer transition-all hover:shadow-md hover:-translate-y-0.5 ${ticket.priority === 'urgent' ? 'border-red-200 bg-red-50/20' : 'border-slate-200'}`}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  {/* Title Row */}
                  <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                    <span className={`w-2 h-2 rounded-full flex-shrink-0 ${pr.dot}`} />
                    <h3 className="font-semibold text-sm text-[#1d1d1d] truncate">{ticket.subject}</h3>
                  </div>

                  {/* Meta */}
                  <div className="flex items-center gap-2 flex-wrap mb-2">
                    <Badge variant={st.variant}>{st.label}</Badge>
                    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold capitalize ${pr.color}`}>{ticket.priority}</span>
                    <span className="text-xs text-slate-400">{dept.icon} {dept.label}</span>
                  </div>

                  {/* Last message preview */}
                  <p className="text-xs text-slate-400 truncate max-w-md">
                    <span className="font-semibold">{lastMsg.sender}:</span> {lastMsg.message.substring(0, 100)}...
                  </p>
                </div>

                <div className="text-right flex-shrink-0">
                  <div className="text-xs text-slate-400 mb-1">{timeAgo(ticket.updated_at)}</div>
                  <div className="text-xs text-slate-400">{ticket.messages.length} message{ticket.messages.length !== 1 ? 's' : ''}</div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <CreateTicketModal open={createModal} onClose={() => setCreateModal(false)} />
      <TicketThreadModal ticket={threadModal} open={!!threadModal} onClose={() => setThreadModal(null)} />
    </div>
  );
}
