'use client';
export const dynamic = 'force-dynamic';

import { useEffect, useState } from 'react';
import Button from '../../../components/ui/Button';
import Badge from '../../../components/ui/Badge';
import Alert from '../../../components/ui/Alert';
import { adminApi } from '../../../lib/api';

const STATUS_MAP = {
  paid: { variant: 'green', label: 'Paid' },
  pending: { variant: 'yellow', label: 'Pending' },
  failed: { variant: 'red', label: 'Failed' },
  refunded: { variant: 'purple', label: 'Refunded' },
  cancelled: { variant: 'gray', label: 'Cancelled' },
};

export default function OrdersPage() {
  const PAGE_SIZE = 20;
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState('');
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('all');
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);

  const load = async () => {
    setLoading(true);
    setErr('');
    try {
      const { data } = await adminApi.orders({ status: status === 'all' ? undefined : status, search: search || undefined, page, limit: PAGE_SIZE });
      setOrders(data.orders || []);
      setTotal(Number(data.total || 0));
    } catch (e) {
      setErr(e.response?.data?.error || 'Failed to load orders.');
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

  const pendingCount = orders.filter(o => o.status === 'pending').length;
  const revenue = orders.filter(o => o.status === 'paid').reduce((s, o) => s + Number(o.total_pkr || 0), 0);
  const totalPages = Math.max(Math.ceil(total / PAGE_SIZE), 1);
  const from = total === 0 ? 0 : (page - 1) * PAGE_SIZE + 1;
  const to = Math.min(page * PAGE_SIZE, total);

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <span className="bg-[#5cc4eb] text-white text-xs font-bold px-2.5 py-1 rounded-full">ADMIN</span>
        <h1 style={{ fontFamily: "'Aleo',serif" }} className="text-2xl text-[#bba442]">Orders</h1>
      </div>

      {err && <Alert type="error">{err}</Alert>}

      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
        <div className="bg-white border border-slate-200 rounded-2xl p-5"><p className="text-xs text-slate-400">Total Orders</p><p className="text-2xl text-[#bba442]" style={{ fontFamily: "'Aleo',serif" }}>{orders.length}</p></div>
        <div className="bg-white border border-slate-200 rounded-2xl p-5"><p className="text-xs text-slate-400">Pending</p><p className="text-2xl text-[#bba442]" style={{ fontFamily: "'Aleo',serif" }}>{pendingCount}</p></div>
        <div className="bg-white border border-slate-200 rounded-2xl p-5"><p className="text-xs text-slate-400">Paid Revenue</p><p className="text-2xl text-[#bba442]" style={{ fontFamily: "'Aleo',serif" }}>Rs.{revenue.toLocaleString('en-PK')}</p></div>
      </div>

      <div className="flex gap-3 mb-5">
        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search by order/customer" className="flex-1 px-4 py-2.5 border-2 border-slate-200 rounded text-sm" />
        <select value={status} onChange={e => setStatus(e.target.value)} className="px-3 py-2.5 border-2 border-slate-200 rounded text-sm">
          <option value="all">All</option>
          <option value="pending">Pending</option>
          <option value="paid">Paid</option>
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
                {['Order', 'Customer', 'Amount', 'Status', 'Date'].map(h => (
                  <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-slate-400 uppercase border-b border-slate-200">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loading && <tr><td colSpan={5} className="px-4 py-8 text-center text-slate-400">Loading...</td></tr>}
              {!loading && orders.length === 0 && <tr><td colSpan={5} className="px-4 py-8 text-center text-slate-400">No orders found.</td></tr>}
              {!loading && orders.map(o => {
                const st = STATUS_MAP[o.status] || STATUS_MAP.pending;
                return (
                  <tr key={o.id} className="border-b border-slate-100">
                    <td className="px-4 py-3.5 font-semibold text-[#1d1d1d]">{o.order_number || o.id.slice(0, 8)}</td>
                    <td className="px-4 py-3.5 text-slate-500">{`${o.first_name || ''} ${o.last_name || ''}`.trim() || o.email || '-'}</td>
                    <td className="px-4 py-3.5 font-semibold">Rs.{Number(o.total_pkr || 0).toLocaleString('en-PK')}</td>
                    <td className="px-4 py-3.5"><Badge variant={st.variant}>{st.label}</Badge></td>
                    <td className="px-4 py-3.5 text-xs text-slate-400">{o.created_at ? new Date(o.created_at).toLocaleString('en-PK') : '-'}</td>
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
    </div>
  );
}
