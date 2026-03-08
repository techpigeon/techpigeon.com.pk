'use client';
export const dynamic = 'force-dynamic';
import { useState } from 'react';
import Button from '../../../components/ui/Button';
import Badge from '../../../components/ui/Badge';
import Modal from '../../../components/ui/Modal';
import Alert from '../../../components/ui/Alert';

// ─── Mock payments matching DB schema (payments table) ─────────────
const PAYMENTS = [
  {
    id: 'pay1',
    order_id: 'o1',
    order_number: 'TP-1055',
    user_id: 'u1',
    user_name: 'Ali Khan',
    user_email: 'ali@example.com',
    method: 'jazzcash',
    amount_pkr: 3599,
    status: 'completed',
    transaction_id: 'TXN-20250129-001',
    gateway_ref: 'JC-9847362510',
    created_at: '2025-01-29T10:00:00Z',
    confirmed_at: '2025-01-29T10:05:00Z',
  },
  {
    id: 'pay2',
    order_id: 'o2',
    order_number: 'TP-1054',
    user_id: 'u2',
    user_name: 'Sara Ahmed',
    user_email: 'sara@mail.com',
    method: 'stripe',
    amount_pkr: 12999,
    status: 'completed',
    transaction_id: 'TXN-20250129-002',
    gateway_ref: 'ch_3Nk8s2LI4q9xYz',
    created_at: '2025-01-29T08:00:00Z',
    confirmed_at: '2025-01-29T08:02:00Z',
  },
  {
    id: 'pay3',
    order_id: 'o3',
    order_number: 'TP-1053',
    user_id: 'u3',
    user_name: 'John Doe',
    user_email: 'john@pk.com',
    method: 'bank_transfer',
    amount_pkr: 3499,
    status: 'pending',
    transaction_id: 'TXN-20250128-003',
    gateway_ref: null,
    created_at: '2025-01-28T16:00:00Z',
    confirmed_at: null,
  },
  {
    id: 'pay4',
    order_id: 'o4',
    order_number: 'TP-1052',
    user_id: 'u4',
    user_name: 'Fatima Noor',
    user_email: 'fatima@biz.pk',
    method: 'easypaisa',
    amount_pkr: 8399,
    status: 'completed',
    transaction_id: 'TXN-20250128-004',
    gateway_ref: 'EP-5529103847',
    created_at: '2025-01-28T12:00:00Z',
    confirmed_at: '2025-01-28T12:15:00Z',
  },
  {
    id: 'pay5',
    order_id: 'o5',
    order_number: 'TP-1051',
    user_id: 'u1',
    user_name: 'Ali Khan',
    user_email: 'ali@example.com',
    method: 'bank_transfer',
    amount_pkr: 7198,
    status: 'pending',
    transaction_id: 'TXN-20250128-005',
    gateway_ref: null,
    created_at: '2025-01-28T10:00:00Z',
    confirmed_at: null,
  },
  {
    id: 'pay6',
    order_id: 'o6',
    order_number: 'TP-1050',
    user_id: 'u1',
    user_name: 'Ali Khan',
    user_email: 'ali@example.com',
    method: 'jazzcash',
    amount_pkr: 8399,
    status: 'completed',
    transaction_id: 'TXN-20250115-006',
    gateway_ref: 'JC-7721045893',
    created_at: '2025-01-15T11:00:00Z',
    confirmed_at: '2025-01-15T11:05:00Z',
  },
  {
    id: 'pay7',
    order_id: 'o7',
    order_number: 'TP-1042',
    user_id: 'u5',
    user_name: 'Usman Tariq',
    user_email: 'usman@dev.com',
    method: 'jazzcash',
    amount_pkr: 8999,
    status: 'failed',
    transaction_id: 'TXN-20240920-007',
    gateway_ref: 'JC-FAIL-448291',
    created_at: '2024-09-20T14:00:00Z',
    confirmed_at: null,
  },
  {
    id: 'pay8',
    order_id: 'o8',
    order_number: 'TP-1040',
    user_id: 'u7',
    user_name: 'Hassan Raza',
    user_email: 'hassan@test.pk',
    method: 'easypaisa',
    amount_pkr: 1399,
    status: 'refunded',
    transaction_id: 'TXN-20240915-008',
    gateway_ref: 'EP-3310294756',
    created_at: '2024-09-15T09:00:00Z',
    confirmed_at: '2024-09-15T09:05:00Z',
  },
  {
    id: 'pay9',
    order_id: 'o9',
    order_number: 'TP-1048',
    user_id: 'u8',
    user_name: 'Ayesha Malik',
    user_email: 'ayesha@cloud.pk',
    method: 'stripe',
    amount_pkr: 5499,
    status: 'completed',
    transaction_id: 'TXN-20250125-009',
    gateway_ref: 'ch_7Qm4t9PI2r6wAb',
    created_at: '2025-01-25T14:30:00Z',
    confirmed_at: '2025-01-25T14:31:00Z',
  },
  {
    id: 'pay10',
    order_id: 'o10',
    order_number: 'TP-1046',
    user_id: 'u4',
    user_name: 'Fatima Noor',
    user_email: 'fatima@biz.pk',
    method: 'bank_transfer',
    amount_pkr: 24999,
    status: 'pending',
    transaction_id: 'TXN-20250127-010',
    gateway_ref: null,
    created_at: '2025-01-27T09:00:00Z',
    confirmed_at: null,
  },
];

// ─── Maps ──────────────────────────────────────────────────────────
const STATUS_MAP = {
  completed: { variant: 'green', label: 'Completed' },
  pending: { variant: 'yellow', label: 'Pending' },
  failed: { variant: 'red', label: 'Failed' },
  refunded: { variant: 'purple', label: 'Refunded' },
};

const METHOD_MAP = {
  jazzcash: { label: 'JazzCash', variant: 'red', color: 'text-red-600 bg-red-50' },
  easypaisa: { label: 'EasyPaisa', variant: 'green', color: 'text-emerald-700 bg-emerald-50' },
  stripe: { label: 'Stripe', variant: 'purple', color: 'text-purple-700 bg-purple-50' },
  bank_transfer: { label: 'Bank Transfer', variant: 'blue', color: 'text-blue-700 bg-blue-50' },
};

// ─── Helpers ───────────────────────────────────────────────────────
function formatDate(dateStr) {
  if (!dateStr) return '—';
  return new Date(dateStr).toLocaleDateString('en-PK', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

function formatDateTime(dateStr) {
  if (!dateStr) return '—';
  return new Date(dateStr).toLocaleString('en-PK', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

// ─── Confirm Payment Modal ─────────────────────────────────────────
function ConfirmPaymentModal({ payment, open, onClose, onConfirm }) {
  const [gatewayRef, setGatewayRef] = useState('');
  const [notes, setNotes] = useState('');
  const [confirming, setConfirming] = useState(false);
  const [error, setError] = useState('');

  if (!payment) return null;
  const pm = METHOD_MAP[payment.method];

  const handleConfirm = () => {
    if (!gatewayRef.trim()) {
      setError('Please enter the bank reference / receipt number to confirm this payment.');
      return;
    }
    setError('');
    setConfirming(true);
    setTimeout(() => {
      setConfirming(false);
      onConfirm(payment.id, gatewayRef, notes);
      setGatewayRef('');
      setNotes('');
      onClose();
    }, 800);
  };

  return (
    <Modal open={open} onClose={onClose} title="Confirm Payment" width={520}>
      {/* Payment summary */}
      <div className="flex items-center justify-between p-4 rounded bg-[#e8f6fc] border border-blue-100 mb-5">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span style={{ fontFamily: "'Aleo',serif" }} className="text-lg font-bold text-[#bba442]">{payment.transaction_id}</span>
          </div>
          <p className="text-xs text-slate-400">{payment.user_name} &middot; Order {payment.order_number}</p>
        </div>
        <div style={{ fontFamily: "'Aleo',serif" }} className="text-2xl font-bold text-[#bba442]">Rs.{payment.amount_pkr.toLocaleString()}</div>
      </div>

      {/* Payment details grid */}
      <div className="grid grid-cols-2 gap-3 mb-5">
        <div className="bg-slate-50 rounded p-3 border border-slate-100">
          <div className="text-xs text-slate-400 mb-1">Payment Method</div>
          {pm && <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${pm.color}`}>{pm.label}</span>}
        </div>
        <div className="bg-slate-50 rounded p-3 border border-slate-100">
          <div className="text-xs text-slate-400 mb-1">Submitted</div>
          <div className="text-sm font-semibold text-[#1d1d1d]">{formatDateTime(payment.created_at)}</div>
        </div>
        <div className="bg-slate-50 rounded p-3 border border-slate-100">
          <div className="text-xs text-slate-400 mb-1">Customer Email</div>
          <div className="text-sm text-[#1d1d1d]">{payment.user_email}</div>
        </div>
        <div className="bg-slate-50 rounded p-3 border border-slate-100">
          <div className="text-xs text-slate-400 mb-1">Status</div>
          <Badge variant="yellow">Pending Confirmation</Badge>
        </div>
      </div>

      {error && (
        <div className="mb-4">
          <Alert type="error">{error}</Alert>
        </div>
      )}

      {/* Input fields */}
      <div className="mb-4">
        <label className="block text-sm font-semibold text-[#1d1d1d] mb-1.5">Bank Reference / Receipt Number <span className="text-red-500">*</span></label>
        <input
          value={gatewayRef}
          onChange={e => setGatewayRef(e.target.value)}
          placeholder="e.g. BT-20250128-xxxx or deposit slip #"
          className="w-full px-4 py-2.5 border-2 border-slate-200 rounded text-sm text-[#1d1d1d] bg-white outline-none focus:border-[#5cc4eb] transition-all"
        />
      </div>

      <div className="mb-5">
        <label className="block text-sm font-semibold text-[#1d1d1d] mb-1.5">Admin Notes (optional)</label>
        <textarea
          value={notes}
          onChange={e => setNotes(e.target.value)}
          placeholder="Any notes regarding this payment confirmation..."
          rows={3}
          className="w-full px-4 py-2.5 border-2 border-slate-200 rounded text-sm text-[#1d1d1d] bg-white outline-none focus:border-[#5cc4eb] transition-all resize-none"
        />
      </div>

      <div className="flex gap-3">
        <Button full variant="success" loading={confirming} onClick={handleConfirm}>Confirm Payment</Button>
        <Button full variant="ghost" onClick={onClose}>Cancel</Button>
      </div>
    </Modal>
  );
}

// ─── Process Refund Modal ──────────────────────────────────────────
function ProcessRefundModal({ payment, open, onClose, onRefund }) {
  const [reason, setReason] = useState('');
  const [refundAmount, setRefundAmount] = useState('');
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState('');

  if (!payment) return null;
  const pm = METHOD_MAP[payment.method];

  const handleRefund = () => {
    const amount = refundAmount ? parseFloat(refundAmount) : payment.amount_pkr;
    if (isNaN(amount) || amount <= 0) {
      setError('Please enter a valid refund amount.');
      return;
    }
    if (amount > payment.amount_pkr) {
      setError(`Refund amount cannot exceed the original payment of Rs.${payment.amount_pkr.toLocaleString()}.`);
      return;
    }
    if (!reason.trim()) {
      setError('Please provide a reason for this refund.');
      return;
    }
    setError('');
    setProcessing(true);
    setTimeout(() => {
      setProcessing(false);
      onRefund(payment.id, amount, reason);
      setReason('');
      setRefundAmount('');
      onClose();
    }, 1000);
  };

  return (
    <Modal open={open} onClose={onClose} title="Process Refund" width={520}>
      {/* Warning banner */}
      <div className="mb-5">
        <Alert type="warning">This action will initiate a refund. The customer will be notified via email and the order status will be updated.</Alert>
      </div>

      {/* Payment summary */}
      <div className="flex items-center justify-between p-4 rounded bg-slate-50 border border-slate-200 mb-5">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span style={{ fontFamily: "'Aleo',serif" }} className="text-lg font-bold text-[#bba442]">{payment.transaction_id}</span>
            <Badge variant="green">Completed</Badge>
          </div>
          <p className="text-xs text-slate-400">{payment.user_name} &middot; Order {payment.order_number}</p>
        </div>
        <div style={{ fontFamily: "'Aleo',serif" }} className="text-2xl font-bold text-[#bba442]">Rs.{payment.amount_pkr.toLocaleString()}</div>
      </div>

      {/* Payment info */}
      <div className="grid grid-cols-3 gap-3 mb-5">
        <div className="bg-slate-50 rounded p-3 border border-slate-100">
          <div className="text-xs text-slate-400 mb-1">Method</div>
          {pm && <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${pm.color}`}>{pm.label}</span>}
        </div>
        <div className="bg-slate-50 rounded p-3 border border-slate-100">
          <div className="text-xs text-slate-400 mb-1">Gateway Ref</div>
          <div className="text-xs font-mono text-[#1d1d1d] truncate">{payment.gateway_ref || '—'}</div>
        </div>
        <div className="bg-slate-50 rounded p-3 border border-slate-100">
          <div className="text-xs text-slate-400 mb-1">Paid On</div>
          <div className="text-sm font-semibold text-[#1d1d1d]">{formatDate(payment.confirmed_at)}</div>
        </div>
      </div>

      {error && (
        <div className="mb-4">
          <Alert type="error">{error}</Alert>
        </div>
      )}

      {/* Refund amount */}
      <div className="mb-4">
        <label className="block text-sm font-semibold text-[#1d1d1d] mb-1.5">Refund Amount (PKR)</label>
        <input
          value={refundAmount}
          onChange={e => setRefundAmount(e.target.value)}
          placeholder={`Full refund: Rs.${payment.amount_pkr.toLocaleString()}`}
          type="number"
          min="1"
          max={payment.amount_pkr}
          className="w-full px-4 py-2.5 border-2 border-slate-200 rounded text-sm text-[#1d1d1d] bg-white outline-none focus:border-[#5cc4eb] transition-all"
        />
        <p className="text-xs text-slate-400 mt-1">Leave blank for a full refund of Rs.{payment.amount_pkr.toLocaleString()}</p>
      </div>

      {/* Reason */}
      <div className="mb-5">
        <label className="block text-sm font-semibold text-[#1d1d1d] mb-1.5">Reason for Refund <span className="text-red-500">*</span></label>
        <textarea
          value={reason}
          onChange={e => setReason(e.target.value)}
          placeholder="Customer requested cancellation, service issue, etc."
          rows={3}
          className="w-full px-4 py-2.5 border-2 border-slate-200 rounded text-sm text-[#1d1d1d] bg-white outline-none focus:border-[#5cc4eb] transition-all resize-none"
        />
      </div>

      <div className="flex gap-3">
        <Button full variant="danger" loading={processing} onClick={handleRefund}>Process Refund</Button>
        <Button full variant="ghost" onClick={onClose}>Cancel</Button>
      </div>
    </Modal>
  );
}

// ─── View Payment Detail Modal ─────────────────────────────────────
function PaymentDetailModal({ payment, open, onClose, onOpenConfirm, onOpenRefund }) {
  if (!payment) return null;
  const st = STATUS_MAP[payment.status] || STATUS_MAP.pending;
  const pm = METHOD_MAP[payment.method];

  return (
    <Modal open={open} onClose={onClose} title="Payment Details" width={580}>
      {/* Header summary */}
      <div className="flex items-center justify-between p-4 rounded bg-slate-50 border border-slate-200 mb-5">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span style={{ fontFamily: "'Aleo',serif" }} className="text-xl text-[#bba442]">{payment.transaction_id}</span>
            <Badge variant={st.variant}>{st.label}</Badge>
          </div>
          <p className="text-xs text-slate-400">{payment.user_name} &middot; {payment.user_email}</p>
        </div>
        <div style={{ fontFamily: "'Aleo',serif" }} className="text-2xl font-bold text-[#bba442]">Rs.{payment.amount_pkr.toLocaleString()}</div>
      </div>

      {/* Detail grid */}
      <div className="grid grid-cols-2 gap-3 mb-5">
        <div className="bg-slate-50 rounded p-3 border border-slate-100">
          <div className="text-xs text-slate-400 mb-1">Order Number</div>
          <div className="text-sm font-semibold text-[#1d1d1d]">{payment.order_number}</div>
        </div>
        <div className="bg-slate-50 rounded p-3 border border-slate-100">
          <div className="text-xs text-slate-400 mb-1">Payment Method</div>
          {pm ? <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${pm.color}`}>{pm.label}</span> : <span className="text-xs text-slate-400">—</span>}
        </div>
        <div className="bg-slate-50 rounded p-3 border border-slate-100">
          <div className="text-xs text-slate-400 mb-1">Gateway Reference</div>
          <div className="text-xs font-mono text-[#1d1d1d]">{payment.gateway_ref || '—'}</div>
        </div>
        <div className="bg-slate-50 rounded p-3 border border-slate-100">
          <div className="text-xs text-slate-400 mb-1">Amount (PKR)</div>
          <div className="text-sm font-semibold text-[#1d1d1d]">Rs.{payment.amount_pkr.toLocaleString()}</div>
        </div>
        <div className="bg-slate-50 rounded p-3 border border-slate-100">
          <div className="text-xs text-slate-400 mb-1">Created</div>
          <div className="text-sm text-[#1d1d1d]">{formatDateTime(payment.created_at)}</div>
        </div>
        <div className="bg-slate-50 rounded p-3 border border-slate-100">
          <div className="text-xs text-slate-400 mb-1">Confirmed</div>
          <div className="text-sm text-[#1d1d1d]">{payment.confirmed_at ? formatDateTime(payment.confirmed_at) : '—'}</div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-3">
        {payment.status === 'pending' && (
          <Button full variant="success" onClick={() => { onClose(); onOpenConfirm(payment); }}>Confirm Payment</Button>
        )}
        {payment.status === 'completed' && (
          <Button full variant="danger" onClick={() => { onClose(); onOpenRefund(payment); }}>Process Refund</Button>
        )}
        <Button full variant="ghost" onClick={onClose}>Close</Button>
      </div>
    </Modal>
  );
}

// ─── Main Page ─────────────────────────────────────────────────────
export default function PaymentsPage() {
  const [payments, setPayments] = useState(PAYMENTS);
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');
  const [detailModal, setDetailModal] = useState(null);
  const [confirmModal, setConfirmModal] = useState(null);
  const [refundModal, setRefundModal] = useState(null);
  const [alert, setAlert] = useState(null);

  // ── Filter & search ──
  let filtered = payments;
  if (filter !== 'all') filtered = filtered.filter(p => p.status === filter);
  if (search) {
    filtered = filtered.filter(p =>
      `${p.transaction_id} ${p.order_number} ${p.user_name} ${p.user_email} ${p.gateway_ref || ''}`
        .toLowerCase()
        .includes(search.toLowerCase())
    );
  }

  // ── Stats ──
  const totalPayments = payments.length;
  const completedCount = payments.filter(p => p.status === 'completed').length;
  const pendingCount = payments.filter(p => p.status === 'pending').length;
  const totalRevenue = payments
    .filter(p => p.status === 'completed')
    .reduce((sum, p) => sum + p.amount_pkr, 0);

  // ── Handlers ──
  const handleConfirmPayment = (paymentId, gatewayRef) => {
    setPayments(prev =>
      prev.map(p =>
        p.id === paymentId
          ? { ...p, status: 'completed', gateway_ref: gatewayRef, confirmed_at: new Date().toISOString() }
          : p
      )
    );
    setAlert({ type: 'success', message: 'Payment confirmed successfully. Order has been activated.' });
    setTimeout(() => setAlert(null), 4000);
  };

  const handleProcessRefund = (paymentId, amount, reason) => {
    setPayments(prev =>
      prev.map(p =>
        p.id === paymentId ? { ...p, status: 'refunded' } : p
      )
    );
    setAlert({ type: 'success', message: `Refund of Rs.${amount.toLocaleString()} processed. Customer will be notified.` });
    setTimeout(() => setAlert(null), 4000);
  };

  // ── Filter tabs config ──
  const tabs = [
    { key: 'all', label: `All (${payments.length})` },
    { key: 'completed', label: 'Completed' },
    { key: 'pending', label: 'Pending' },
    { key: 'failed', label: 'Failed' },
    { key: 'refunded', label: 'Refunded' },
  ];

  return (
    <div>
      {/* ── Header ── */}
      <div className="flex items-center gap-3 mb-6">
        <span className="bg-[#5cc4eb] text-white text-xs font-bold px-2.5 py-1 rounded-full">ADMIN</span>
        <h1 style={{ fontFamily: "'Aleo',serif" }} className="text-2xl text-[#bba442]">Payments</h1>
      </div>

      {/* ── Global Alert ── */}
      {alert && (
        <div className="mb-5">
          <Alert type={alert.type}>{alert.message}</Alert>
        </div>
      )}

      {/* ── Stat Cards ── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {[
          { label: 'Total Payments', value: String(totalPayments), icon: '💳', color: '#5cc4eb' },
          { label: 'Completed', value: String(completedCount), icon: '✓', color: '#41D33E' },
          { label: 'Pending Confirmation', value: String(pendingCount), icon: '⏳', color: '#F8D313' },
          { label: 'Total Revenue', value: `Rs.${totalRevenue >= 1000 ? (totalRevenue / 1000).toFixed(totalRevenue >= 100000 ? 0 : 1) + 'K' : totalRevenue.toLocaleString()}`, icon: '💰', color: '#bba442' },
        ].map(s => (
          <div key={s.label} className="bg-white border border-slate-200 rounded-2xl p-5 relative overflow-hidden hover:shadow-md transition-shadow">
            <div className="absolute top-4 right-4 w-11 h-11 rounded flex items-center justify-center text-xl" style={{ background: s.color + '18' }}>{s.icon}</div>
            <p className="text-xs font-medium text-slate-400 mb-2">{s.label}</p>
            <p className="text-2xl font-bold text-[#bba442]" style={{ fontFamily: "'Aleo',serif" }}>{s.value}</p>
          </div>
        ))}
      </div>

      {/* ── Search + Filter Tabs ── */}
      <div className="flex flex-col sm:flex-row gap-3 mb-5">
        <input
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search by transaction ID, order, customer..."
          className="flex-1 px-4 py-2.5 border-2 border-slate-200 rounded text-sm text-[#1d1d1d] bg-white outline-none focus:border-[#5cc4eb] transition-all"
        />
        <div className="flex gap-2 flex-wrap">
          {tabs.map(t => (
            <button
              key={t.key}
              onClick={() => setFilter(t.key)}
              className={`px-4 py-1.5 rounded-full border text-xs font-semibold cursor-pointer transition-all ${
                filter === t.key
                  ? 'bg-[#e8f6fc] border-[#5cc4eb] text-[#5cc4eb]'
                  : 'bg-white border-slate-200 text-slate-500 hover:border-slate-300'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      {/* ── Payments Table ── */}
      <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-sm">
            <thead className="bg-slate-50">
              <tr>
                {['Transaction ID', 'Order #', 'Customer', 'Method', 'Amount', 'Status', 'Date', 'Actions'].map(h => (
                  <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider border-b border-slate-200 whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={8} className="px-4 py-12 text-center text-slate-400">
                    <div className="text-3xl mb-2">💳</div>
                    <div className="text-sm">No payments found matching your criteria.</div>
                  </td>
                </tr>
              )}
              {filtered.map(p => {
                const st = STATUS_MAP[p.status] || STATUS_MAP.pending;
                const pm = METHOD_MAP[p.method];
                return (
                  <tr
                    key={p.id}
                    className="border-b border-slate-100 last:border-none hover:bg-slate-50/50 cursor-pointer transition-colors"
                    onClick={() => setDetailModal(p)}
                  >
                    {/* Transaction ID */}
                    <td className="px-4 py-3.5">
                      <span className="font-mono text-xs font-semibold text-[#1d1d1d]">{p.transaction_id}</span>
                    </td>

                    {/* Order # */}
                    <td className="px-4 py-3.5 font-semibold text-[#1d1d1d]">{p.order_number}</td>

                    {/* Customer */}
                    <td className="px-4 py-3.5">
                      <div className="text-[#1d1d1d] text-sm font-medium">{p.user_name}</div>
                      <div className="text-xs text-slate-400">{p.user_email}</div>
                    </td>

                    {/* Method */}
                    <td className="px-4 py-3.5">
                      {pm ? (
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${pm.color}`}>{pm.label}</span>
                      ) : (
                        <span className="text-xs text-slate-400">—</span>
                      )}
                    </td>

                    {/* Amount */}
                    <td className="px-4 py-3.5 font-semibold text-[#1d1d1d]">Rs.{p.amount_pkr.toLocaleString()}</td>

                    {/* Status */}
                    <td className="px-4 py-3.5">
                      <Badge variant={st.variant}>{st.label}</Badge>
                    </td>

                    {/* Date */}
                    <td className="px-4 py-3.5 text-xs text-slate-400 whitespace-nowrap">{formatDate(p.created_at)}</td>

                    {/* Actions */}
                    <td className="px-4 py-3.5">
                      <div className="flex gap-2" onClick={e => e.stopPropagation()}>
                        {p.status === 'pending' && (
                          <Button size="sm" variant="success" onClick={() => setConfirmModal(p)}>Confirm</Button>
                        )}
                        {p.status === 'completed' && (
                          <Button size="sm" variant="outline" onClick={() => setRefundModal(p)}>Refund</Button>
                        )}
                        <Button size="sm" variant="ghost" onClick={() => setDetailModal(p)}>View</Button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* ── Table Footer ── */}
        {filtered.length > 0 && (
          <div className="flex items-center justify-between px-4 py-3 border-t border-slate-200 bg-slate-50">
            <p className="text-xs text-slate-400">
              Showing {filtered.length} of {payments.length} payment{payments.length !== 1 ? 's' : ''}
            </p>
            <p className="text-xs text-slate-400">
              Filtered total: <span className="font-semibold text-[#1d1d1d]">Rs.{filtered.reduce((s, p) => s + p.amount_pkr, 0).toLocaleString()}</span>
            </p>
          </div>
        )}
      </div>

      {/* ── Modals ── */}
      <PaymentDetailModal
        payment={detailModal}
        open={!!detailModal}
        onClose={() => setDetailModal(null)}
        onOpenConfirm={p => setConfirmModal(p)}
        onOpenRefund={p => setRefundModal(p)}
      />
      <ConfirmPaymentModal
        payment={confirmModal}
        open={!!confirmModal}
        onClose={() => setConfirmModal(null)}
        onConfirm={handleConfirmPayment}
      />
      <ProcessRefundModal
        payment={refundModal}
        open={!!refundModal}
        onClose={() => setRefundModal(null)}
        onRefund={handleProcessRefund}
      />
    </div>
  );
}
