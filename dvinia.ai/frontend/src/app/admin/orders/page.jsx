'use client';
export const dynamic = 'force-dynamic';
import { useState } from 'react';
import Button from '../../../components/ui/Button';
import Badge from '../../../components/ui/Badge';
import Modal from '../../../components/ui/Modal';

const ORDERS = [
  { id: 'o1', order_number: 'TP-1055', user: 'ali@example.com', user_name: 'Ali Khan', status: 'paid', total_pkr: 3599, created_at: '2025-01-29T10:00:00Z', paid_at: '2025-01-29T10:05:00Z', items: [{ type: 'hosting', desc: 'Cloud Pro — Monthly', price: 3599 }], payment_method: 'jazzcash' },
  { id: 'o2', order_number: 'TP-1054', user: 'sara@mail.com', user_name: 'Sara Ahmed', status: 'paid', total_pkr: 12999, created_at: '2025-01-29T08:00:00Z', paid_at: '2025-01-29T08:10:00Z', items: [{ type: 'course', desc: 'CompTIA Security+ Full Prep', price: 12999 }], payment_method: 'stripe' },
  { id: 'o3', order_number: 'TP-1053', user: 'john@pk.com', user_name: 'John Doe', status: 'pending', total_pkr: 3499, created_at: '2025-01-28T16:00:00Z', paid_at: null, items: [{ type: 'domain', desc: 'cloudpak.com — Registration', price: 3499 }], payment_method: null },
  { id: 'o4', order_number: 'TP-1052', user: 'fatima@biz.pk', user_name: 'Fatima Noor', status: 'paid', total_pkr: 8399, created_at: '2025-01-28T12:00:00Z', paid_at: '2025-01-28T12:15:00Z', items: [{ type: 'hosting', desc: 'Cloud Business — Monthly', price: 8399 }], payment_method: 'easypaisa' },
  { id: 'o5', order_number: 'TP-1051', user: 'ali@example.com', user_name: 'Ali Khan', status: 'pending', total_pkr: 7198, created_at: '2025-01-28T10:00:00Z', paid_at: null, items: [{ type: 'hosting', desc: 'Cloud Pro — Monthly', price: 3599 }, { type: 'domain', desc: 'mybusiness.pk — Renewal', price: 1099 }, { type: 'domain', desc: 'cloudpak.com — Registration', price: 3499 }], payment_method: null },
  { id: 'o6', order_number: 'TP-1050', user: 'ali@example.com', user_name: 'Ali Khan', status: 'paid', total_pkr: 8399, created_at: '2025-01-15T11:00:00Z', paid_at: '2025-01-15T11:05:00Z', items: [{ type: 'hosting', desc: 'Cloud Pro — Monthly', price: 3599 }, { type: 'domain', desc: 'techpigeon.org — Renewal', price: 2999 }, { type: 'ssl', desc: 'Wildcard SSL', price: 1801 }], payment_method: 'jazzcash' },
  { id: 'o7', order_number: 'TP-1042', user: 'usman@dev.com', user_name: 'Usman Tariq', status: 'failed', total_pkr: 8999, created_at: '2024-09-20T14:00:00Z', paid_at: null, items: [{ type: 'course', desc: 'AWS Cloud Practitioner', price: 8999 }], payment_method: 'jazzcash' },
  { id: 'o8', order_number: 'TP-1040', user: 'hassan@test.pk', user_name: 'Hassan Raza', status: 'refunded', total_pkr: 1399, created_at: '2024-09-15T09:00:00Z', paid_at: '2024-09-15T09:05:00Z', items: [{ type: 'hosting', desc: 'Cloud Starter — Monthly', price: 1399 }], payment_method: 'easypaisa' },
];

const STATUS_MAP = { paid: { variant: 'green', label: 'Paid' }, pending: { variant: 'yellow', label: 'Pending' }, failed: { variant: 'red', label: 'Failed' }, refunded: { variant: 'purple', label: 'Refunded' }, cancelled: { variant: 'gray', label: 'Cancelled' } };
const METHOD_MAP = { jazzcash: { label: 'JazzCash', color: 'text-red-600 bg-red-50' }, easypaisa: { label: 'EasyPaisa', color: 'text-emerald-700 bg-emerald-50' }, stripe: { label: 'Stripe', color: 'text-purple-700 bg-purple-50' }, bank_transfer: { label: 'Bank', color: 'text-blue-700 bg-blue-50' } };
const TYPE_ICONS = { hosting: '☁️', course: '🎓', domain: '🌐', ssl: '🔒' };

function OrderModal({ order, open, onClose }) {
  if (!order) return null;
  const st = STATUS_MAP[order.status] || STATUS_MAP.pending;
  const pm = order.payment_method ? METHOD_MAP[order.payment_method] : null;

  return (
    <Modal open={open} onClose={onClose} title={`Order ${order.order_number}`} width={560}>
      <div className="flex items-center justify-between p-4 rounded bg-slate-50 border border-slate-200 mb-5">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span style={{ fontFamily: "'Aleo',serif" }} className="text-xl text-[#bba442]">{order.order_number}</span>
            <Badge variant={st.variant}>{st.label}</Badge>
          </div>
          <p className="text-xs text-slate-400">{order.user_name} &middot; {order.user}</p>
        </div>
        <div style={{ fontFamily: "'Aleo',serif" }} className="text-2xl text-[#bba442]">Rs.{order.total_pkr.toLocaleString()}</div>
      </div>

      <div className="border border-slate-200 rounded overflow-hidden mb-5">
        <table className="w-full text-sm">
          <thead className="bg-slate-50"><tr>{['Item', 'Price'].map(h => <th key={h} className="px-4 py-2.5 text-left text-xs font-semibold text-slate-400 uppercase border-b border-slate-200">{h}</th>)}</tr></thead>
          <tbody>
            {order.items.map((item, i) => (
              <tr key={i} className="border-b border-slate-100 last:border-none">
                <td className="px-4 py-3 flex items-center gap-2"><span>{TYPE_ICONS[item.type] || '📦'}</span><span className="text-[#1d1d1d]">{item.desc}</span></td>
                <td className="px-4 py-3 font-semibold text-[#1d1d1d]">Rs.{item.price.toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="grid grid-cols-2 gap-3 mb-5">
        <div className="bg-slate-50 rounded p-3 border border-slate-100">
          <div className="text-xs text-slate-400">Payment Method</div>
          {pm ? <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold mt-1 ${pm.color}`}>{pm.label}</span> : <span className="text-xs text-slate-400">—</span>}
        </div>
        <div className="bg-slate-50 rounded p-3 border border-slate-100">
          <div className="text-xs text-slate-400">Created</div>
          <div className="text-sm font-semibold text-[#1d1d1d]">{new Date(order.created_at).toLocaleString('en-PK', { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' })}</div>
        </div>
      </div>

      <div className="flex gap-3">
        {order.status === 'pending' && <Button full>Mark as Paid</Button>}
        {order.status === 'paid' && <Button full variant="outline">Issue Refund</Button>}
        <Button full variant="ghost" onClick={onClose}>Close</Button>
      </div>
    </Modal>
  );
}

export default function OrdersPage() {
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');
  const [orderModal, setOrderModal] = useState(null);

  let filtered = ORDERS;
  if (filter !== 'all') filtered = filtered.filter(o => o.status === filter);
  if (search) filtered = filtered.filter(o => `${o.order_number} ${o.user} ${o.user_name}`.toLowerCase().includes(search.toLowerCase()));

  const totalRevenue = ORDERS.filter(o => o.status === 'paid').reduce((a, o) => a + o.total_pkr, 0);

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <span className="bg-[#5cc4eb] text-white text-xs font-bold px-2.5 py-1 rounded-full">ADMIN</span>
        <h1 style={{ fontFamily: "'Aleo',serif" }} className="text-2xl text-[#bba442]">Orders</h1>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {[
          { label: 'Total Orders', value: String(ORDERS.length), icon: '📦', color: '#5cc4eb' },
          { label: 'Revenue', value: `Rs.${(totalRevenue / 1000).toFixed(0)}K`, icon: '💰', color: '#41D33E' },
          { label: 'Pending', value: String(ORDERS.filter(o => o.status === 'pending').length), icon: '⏳', color: '#F8D313' },
          { label: 'Failed', value: String(ORDERS.filter(o => o.status === 'failed').length), icon: '✗', color: '#F73730' },
        ].map(s => (
          <div key={s.label} className="bg-white border border-slate-200 rounded-2xl p-5 relative overflow-hidden hover:shadow-md transition-shadow">
            <div className="absolute top-4 right-4 w-11 h-11 rounded flex items-center justify-center text-xl" style={{ background: s.color + '18' }}>{s.icon}</div>
            <p className="text-xs font-medium text-slate-400 mb-2">{s.label}</p>
            <p className="text-2xl font-bold text-[#bba442]" style={{ fontFamily: "'Aleo',serif" }}>{s.value}</p>
          </div>
        ))}
      </div>

      <div className="flex flex-col sm:flex-row gap-3 mb-5">
        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search orders..." className="flex-1 px-4 py-2.5 border-2 border-slate-200 rounded text-sm text-[#1d1d1d] bg-white outline-none focus:border-[#5cc4eb]" />
        <div className="flex gap-2 flex-wrap">
          {['all', 'paid', 'pending', 'failed', 'refunded'].map(f => (
            <button key={f} onClick={() => setFilter(f)} className={`px-4 py-1.5 rounded-full border text-xs font-semibold cursor-pointer transition-all capitalize ${filter === f ? 'bg-[#e8f6fc] border-[#5cc4eb] text-[#5cc4eb]' : 'bg-white border-slate-200 text-slate-500'}`}>{f === 'all' ? `All (${ORDERS.length})` : f}</button>
          ))}
        </div>
      </div>

      <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-sm">
            <thead className="bg-slate-50"><tr>{['Order', 'Customer', 'Items', 'Amount', 'Method', 'Status', 'Date', ''].map(h => <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider border-b border-slate-200 whitespace-nowrap">{h}</th>)}</tr></thead>
            <tbody>
              {filtered.map(o => {
                const st = STATUS_MAP[o.status] || STATUS_MAP.pending;
                const pm = o.payment_method ? METHOD_MAP[o.payment_method] : null;
                return (
                  <tr key={o.id} className="border-b border-slate-100 last:border-none hover:bg-slate-50/50 cursor-pointer" onClick={() => setOrderModal(o)}>
                    <td className="px-4 py-3.5 font-semibold text-[#1d1d1d]">{o.order_number}</td>
                    <td className="px-4 py-3.5"><div className="text-[#1d1d1d] text-sm">{o.user_name}</div><div className="text-xs text-slate-400">{o.user}</div></td>
                    <td className="px-4 py-3.5"><div className="flex gap-1">{o.items.map((item, i) => <span key={i} title={item.desc}>{TYPE_ICONS[item.type] || '📦'}</span>)}<span className="text-xs text-slate-400 ml-1">{o.items.length}</span></div></td>
                    <td className="px-4 py-3.5 font-semibold text-[#1d1d1d]">Rs.{o.total_pkr.toLocaleString()}</td>
                    <td className="px-4 py-3.5">{pm ? <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold ${pm.color}`}>{pm.label}</span> : <span className="text-xs text-slate-400">—</span>}</td>
                    <td className="px-4 py-3.5"><Badge variant={st.variant}>{st.label}</Badge></td>
                    <td className="px-4 py-3.5 text-xs text-slate-400">{new Date(o.created_at).toLocaleDateString('en-PK', { month: 'short', day: 'numeric' })}</td>
                    <td className="px-4 py-3.5"><Button size="sm" variant="ghost" onClick={e => { e.stopPropagation(); setOrderModal(o); }}>View</Button></td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      <OrderModal order={orderModal} open={!!orderModal} onClose={() => setOrderModal(null)} />
    </div>
  );
}
