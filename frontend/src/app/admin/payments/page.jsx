'use client';
export const dynamic = 'force-dynamic';

import { useEffect, useState } from 'react';
import Button from '../../../components/ui/Button';
import Badge from '../../../components/ui/Badge';
import Modal from '../../../components/ui/Modal';
import Alert from '../../../components/ui/Alert';
import { adminApi } from '../../../lib/api';

const STATUS_MAP = {
  completed: { variant: 'green', label: 'Completed' },
  pending: { variant: 'yellow', label: 'Pending' },
  failed: { variant: 'red', label: 'Failed' },
  refunded: { variant: 'purple', label: 'Refunded' },
};

function PaymentDetail({ payment, open, onClose, onConfirm }) {
  if (!payment) return null;
  const st = STATUS_MAP[payment.status] || STATUS_MAP.pending;
  let gateway = {};
  try { gateway = typeof payment.gateway_response === 'string' ? JSON.parse(payment.gateway_response) : (payment.gateway_response || {}); } catch {}

  return (
    <Modal open={open} onClose={onClose} title={`Payment ${payment.transaction_id || payment.id}`} width={620}>
      <div className="grid grid-cols-2 gap-3 mb-4">
        <div className="bg-slate-50 p-3 rounded border border-slate-200"><div className="text-xs text-slate-400">Order</div><div className="text-sm font-semibold">{payment.order_number || payment.order_id}</div></div>
        <div className="bg-slate-50 p-3 rounded border border-slate-200"><div className="text-xs text-slate-400">Amount</div><div className="text-sm font-semibold">Rs.{Number(payment.amount_pkr || 0).toLocaleString('en-PK')}</div></div>
        <div className="bg-slate-50 p-3 rounded border border-slate-200"><div className="text-xs text-slate-400">Method</div><div className="text-sm font-semibold">{payment.method}</div></div>
        <div className="bg-slate-50 p-3 rounded border border-slate-200"><div className="text-xs text-slate-400">Status</div><Badge variant={st.variant}>{st.label}</Badge></div>
      </div>

      {payment.method === 'bank_transfer' && (
        <div className="mb-4 border border-slate-200 rounded p-3 bg-slate-50 text-sm">
          <p><b>Bank Name:</b> {gateway.bank_name || '-'}</p>
          <p><b>Reference:</b> {gateway.transaction_ref || payment.transaction_id || '-'}</p>
          {gateway.screenshot_name && <p><b>Screenshot:</b> {gateway.screenshot_name}</p>}
          {gateway.screenshot_base64 && (
            <div className="mt-2">
              <img src={gateway.screenshot_base64} alt="Payment proof" className="max-h-56 rounded border border-slate-200" />
            </div>
          )}
        </div>
      )}

      <div className="flex gap-3">
        {payment.status === 'pending' && <Button full variant="success" onClick={() => onConfirm(payment.id)}>Confirm Payment</Button>}
        <Button full variant="ghost" onClick={onClose}>Close</Button>
      </div>
    </Modal>
  );
}

export default function PaymentsPage() {
  const PAGE_SIZE = 20;
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('all');
  const [detail, setDetail] = useState(null);
  const [err, setErr] = useState('');
  const [ok, setOk] = useState('');
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);

  const load = async () => {
    setLoading(true);
    setErr('');
    try {
      const { data } = await adminApi.payments({ status: status === 'all' ? undefined : status, q: search || undefined, page, limit: PAGE_SIZE });
      setPayments(data.payments || []);
      setTotal(Number(data.total || 0));
    } catch (e) {
      setErr(e.response?.data?.error || 'Failed to load payments.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setPage(1);
  }, [status, search]);

  useEffect(() => {
    const t = setTimeout(() => {
      load();
    }, 300);
    return () => clearTimeout(t);
  }, [status, search, page]);

  const confirmPayment = async (id) => {
    try {
      await adminApi.confirmPay(id);
      setOk('Payment confirmed and order activated.');
      setDetail(null);
      await load();
    } catch (e) {
      setErr(e.response?.data?.error || 'Failed to confirm payment.');
    }
  };

  const pendingCount = payments.filter(p => p.status === 'pending').length;
  const totalCompleted = payments.filter(p => p.status === 'completed').reduce((s, p) => s + Number(p.amount_pkr || 0), 0);
  const totalPages = Math.max(Math.ceil(total / PAGE_SIZE), 1);
  const from = total === 0 ? 0 : (page - 1) * PAGE_SIZE + 1;
  const to = Math.min(page * PAGE_SIZE, total);

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <span className="bg-[#5cc4eb] text-white text-xs font-bold px-2.5 py-1 rounded-full">ADMIN</span>
        <h1 style={{ fontFamily: "'Aleo',serif" }} className="text-2xl text-[#bba442]">Payments</h1>
      </div>

      {err && <Alert type="error">{err}</Alert>}
      {ok && <Alert type="success">{ok}</Alert>}

      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
        <div className="bg-white border border-slate-200 rounded-2xl p-5"><p className="text-xs text-slate-400">Total Payments</p><p className="text-2xl text-[#bba442]" style={{ fontFamily: "'Aleo',serif" }}>{payments.length}</p></div>
        <div className="bg-white border border-slate-200 rounded-2xl p-5"><p className="text-xs text-slate-400">Pending Confirmation</p><p className="text-2xl text-[#bba442]" style={{ fontFamily: "'Aleo',serif" }}>{pendingCount}</p></div>
        <div className="bg-white border border-slate-200 rounded-2xl p-5"><p className="text-xs text-slate-400">Completed Amount</p><p className="text-2xl text-[#bba442]" style={{ fontFamily: "'Aleo',serif" }}>Rs.{totalCompleted.toLocaleString('en-PK')}</p></div>
      </div>

      <div className="flex gap-3 mb-5">
        <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search payments" className="flex-1 px-4 py-2.5 border-2 border-slate-200 rounded text-sm" />
        <select value={status} onChange={(e) => setStatus(e.target.value)} className="px-3 py-2.5 border-2 border-slate-200 rounded text-sm">
          <option value="all">All</option>
          <option value="pending">Pending</option>
          <option value="completed">Completed</option>
          <option value="failed">Failed</option>
          <option value="refunded">Refunded</option>
        </select>
        <Button size="sm" variant="outline" onClick={load}>Refresh</Button>
      </div>

      <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-slate-50">
              <tr>
                {['Txn', 'Order', 'Method', 'Amount', 'Status', 'Date', ''].map(h => (
                  <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-slate-400 uppercase border-b border-slate-200">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loading && <tr><td colSpan={7} className="px-4 py-8 text-center text-slate-400">Loading...</td></tr>}
              {!loading && payments.length === 0 && <tr><td colSpan={7} className="px-4 py-8 text-center text-slate-400">No payments found.</td></tr>}
              {!loading && payments.map(p => {
                const st = STATUS_MAP[p.status] || STATUS_MAP.pending;
                return (
                  <tr key={p.id} className="border-b border-slate-100">
                    <td className="px-4 py-3.5 font-mono text-xs">{p.transaction_id || '-'}</td>
                    <td className="px-4 py-3.5 font-semibold text-[#1d1d1d]">{p.order_number || p.order_id}</td>
                    <td className="px-4 py-3.5 text-slate-500">{p.method}</td>
                    <td className="px-4 py-3.5 font-semibold">Rs.{Number(p.amount_pkr || 0).toLocaleString('en-PK')}</td>
                    <td className="px-4 py-3.5"><Badge variant={st.variant}>{st.label}</Badge></td>
                    <td className="px-4 py-3.5 text-xs text-slate-400">{p.created_at ? new Date(p.created_at).toLocaleString('en-PK') : '-'}</td>
                    <td className="px-4 py-3.5">
                      <div className="flex gap-2">
                        {p.status === 'pending' && <Button size="sm" variant="success" onClick={() => confirmPayment(p.id)}>Confirm</Button>}
                        <Button size="sm" variant="ghost" onClick={() => setDetail(p)}>View</Button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      <div className="mt-4 flex items-center justify-between">
        <p className="text-xs text-slate-500">Showing {from}-{to} of {total}</p>
        <div className="flex gap-2">
          <Button size="sm" variant="outline" onClick={() => setPage(p => Math.max(p - 1, 1))} disabled={page <= 1 || loading}>Previous</Button>
          <span className="px-3 py-1.5 text-xs text-slate-500 border border-slate-200 rounded">Page {page} / {totalPages}</span>
          <Button size="sm" variant="outline" onClick={() => setPage(p => Math.min(p + 1, totalPages))} disabled={page >= totalPages || loading}>Next</Button>
        </div>
      </div>

      <PaymentDetail payment={detail} open={!!detail} onClose={() => setDetail(null)} onConfirm={confirmPayment} />
    </div>
  );
}
