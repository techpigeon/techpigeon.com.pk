'use client';
export const dynamic = 'force-dynamic';
import { useState } from 'react';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import Modal from '@/components/ui/Modal';
import Alert from '@/components/ui/Alert';

// ─── Mock data matching orders + payments + order_items schema ─────
const ORDERS = [
  {
    id: 'o1', order_number: 'TP-1050', status: 'paid', subtotal_pkr: 8399, tax_pkr: 0, discount_pkr: 0, total_pkr: 8399,
    created_at: '2025-01-15', paid_at: '2025-01-15',
    items: [{ item_type: 'hosting', description: 'Cloud Pro Hosting — Monthly', quantity: 1, unit_price: 3599, total_price: 3599 }, { item_type: 'domain', description: 'techpigeon.org — 1 Year Renewal', quantity: 1, unit_price: 2999, total_price: 2999 }, { item_type: 'ssl', description: 'Wildcard SSL Certificate', quantity: 1, unit_price: 1801, total_price: 1801 }],
    payment: { method: 'jazzcash', transaction_id: 'JC-20250115-8842', amount_pkr: 8399, status: 'completed' },
  },
  {
    id: 'o2', order_number: 'TP-1049', status: 'paid', subtotal_pkr: 3599, tax_pkr: 0, discount_pkr: 0, total_pkr: 3599,
    created_at: '2024-12-15', paid_at: '2024-12-15',
    items: [{ item_type: 'hosting', description: 'Cloud Pro Hosting — Monthly', quantity: 1, unit_price: 3599, total_price: 3599 }],
    payment: { method: 'easypaisa', transaction_id: 'EP-20241215-3321', amount_pkr: 3599, status: 'completed' },
  },
  {
    id: 'o3', order_number: 'TP-1048', status: 'paid', subtotal_pkr: 14999, tax_pkr: 0, discount_pkr: 2000, total_pkr: 12999,
    created_at: '2024-10-01', paid_at: '2024-10-02',
    items: [{ item_type: 'course', description: 'CompTIA Security+ Full Prep', quantity: 1, unit_price: 12999, total_price: 12999 }, { item_type: 'course', description: 'Discount: Early Bird 2024', quantity: 1, unit_price: -2000, total_price: -2000 }],
    payment: { method: 'stripe', transaction_id: 'pi_3O8aKLG2j9d...', amount_pkr: 12999, status: 'completed' },
  },
  {
    id: 'o4', order_number: 'TP-1051', status: 'pending', subtotal_pkr: 7198, tax_pkr: 0, discount_pkr: 0, total_pkr: 7198,
    created_at: '2025-01-28', paid_at: null,
    items: [{ item_type: 'hosting', description: 'Cloud Pro Hosting — Monthly', quantity: 1, unit_price: 3599, total_price: 3599 }, { item_type: 'hosting', description: 'Cloud Starter — Monthly', quantity: 1, unit_price: 1399, total_price: 1399 }, { item_type: 'domain', description: 'mybusiness.pk — Renewal', quantity: 1, unit_price: 1099, total_price: 1099 }, { item_type: 'domain', description: 'cloudpak.com — Registration', quantity: 1, unit_price: 3499, total_price: 3499 }],
    payment: null,
  },
  {
    id: 'o5', order_number: 'TP-1042', status: 'failed', subtotal_pkr: 8999, tax_pkr: 0, discount_pkr: 0, total_pkr: 8999,
    created_at: '2024-09-20', paid_at: null,
    items: [{ item_type: 'course', description: 'AWS Cloud Practitioner Essentials', quantity: 1, unit_price: 8999, total_price: 8999 }],
    payment: { method: 'jazzcash', transaction_id: 'JC-20240920-FAIL', amount_pkr: 8999, status: 'failed' },
  },
];

const UPCOMING_RENEWALS = [
  { service: 'Cloud Pro Hosting', domain: 'techpigeon.org', due: '2025-02-01', amount: 3599, type: 'hosting' },
  { service: 'Cloud Starter Hosting', domain: 'mybusiness.pk', due: '2025-09-15', amount: 1049, type: 'hosting' },
  { service: 'Domain Renewal', domain: 'mybusiness.pk', due: '2026-03-01', amount: 1099, type: 'domain' },
  { service: 'Domain Renewal', domain: 'techpigeon.org', due: '2025-12-15', amount: 2999, type: 'domain' },
];

const STATUS_MAP = {
  paid:      { variant: 'green',  label: 'Paid' },
  pending:   { variant: 'yellow', label: 'Pending' },
  failed:    { variant: 'red',    label: 'Failed' },
  refunded:  { variant: 'purple', label: 'Refunded' },
  cancelled: { variant: 'gray',   label: 'Cancelled' },
};

const METHOD_MAP = {
  jazzcash:      { label: 'JazzCash', color: 'text-red-600 bg-red-50' },
  easypaisa:     { label: 'EasyPaisa', color: 'text-emerald-700 bg-emerald-50' },
  stripe:        { label: 'Stripe', color: 'text-purple-700 bg-purple-50' },
  bank_transfer: { label: 'Bank Transfer', color: 'text-blue-700 bg-blue-50' },
  sadapay:       { label: 'SadaPay', color: 'text-teal-700 bg-teal-50' },
};

const ITEM_ICONS = {
  domain:  '🌐',
  hosting: '☁️',
  course:  '🎓',
  ssl:     '🔒',
  email:   '📧',
  renewal: '🔄',
};

function InvoiceModal({ order, open, onClose }) {
  if (!order) return null;
  const st = STATUS_MAP[order.status] || STATUS_MAP.pending;
  const pm = order.payment ? METHOD_MAP[order.payment.method] : null;

  return (
    <Modal open={open} onClose={onClose} title={`Invoice ${order.order_number}`} width={580}>
      {/* Invoice Header */}
      <div className="flex items-center justify-between p-4 rounded bg-slate-50 border border-slate-200 mb-5">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span style={{ fontFamily: "'Aleo',serif" }} className="text-xl text-[#bba442]">{order.order_number}</span>
            <Badge variant={st.variant}>{st.label}</Badge>
          </div>
          <p className="text-xs text-slate-400">
            Created {new Date(order.created_at).toLocaleDateString('en-PK', { year: 'numeric', month: 'long', day: 'numeric' })}
          </p>
        </div>
        <div className="text-right">
          <div style={{ fontFamily: "'Aleo',serif" }} className="text-2xl text-[#bba442]">Rs.{order.total_pkr.toLocaleString()}</div>
          {order.paid_at && <p className="text-xs text-emerald-600">Paid {new Date(order.paid_at).toLocaleDateString('en-PK', { month: 'short', day: 'numeric', year: 'numeric' })}</p>}
        </div>
      </div>

      {order.status === 'pending' && (
        <Alert type="warning">This invoice is awaiting payment. Please pay before the services are suspended.</Alert>
      )}
      {order.status === 'failed' && (
        <Alert type="error">Payment failed. Please retry with a different payment method.</Alert>
      )}

      {/* Line Items */}
      <div className="border border-slate-200 rounded overflow-hidden mb-5">
        <table className="w-full text-sm">
          <thead className="bg-slate-50">
            <tr>
              {['Item', 'Qty', 'Price', 'Total'].map(h => (
                <th key={h} className="px-4 py-2.5 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider border-b border-slate-200">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {order.items.map((item, i) => (
              <tr key={i} className="border-b border-slate-100 last:border-none">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <span>{ITEM_ICONS[item.item_type] || '📦'}</span>
                    <span className="text-[#1d1d1d]">{item.description}</span>
                  </div>
                </td>
                <td className="px-4 py-3 text-slate-500">{item.quantity}</td>
                <td className="px-4 py-3 text-slate-500">Rs.{Math.abs(item.unit_price).toLocaleString()}</td>
                <td className="px-4 py-3 font-semibold text-[#1d1d1d]">
                  {item.total_price < 0 ? (
                    <span className="text-emerald-600">-Rs.{Math.abs(item.total_price).toLocaleString()}</span>
                  ) : (
                    `Rs.${item.total_price.toLocaleString()}`
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {/* Totals */}
        <div className="bg-slate-50 px-4 py-3 border-t border-slate-200">
          <div className="flex justify-between text-sm mb-1">
            <span className="text-slate-500">Subtotal</span>
            <span className="text-[#1d1d1d]">Rs.{order.subtotal_pkr.toLocaleString()}</span>
          </div>
          {order.discount_pkr > 0 && (
            <div className="flex justify-between text-sm mb-1">
              <span className="text-emerald-600">Discount</span>
              <span className="text-emerald-600">-Rs.{order.discount_pkr.toLocaleString()}</span>
            </div>
          )}
          {order.tax_pkr > 0 && (
            <div className="flex justify-between text-sm mb-1">
              <span className="text-slate-500">Tax</span>
              <span className="text-[#1d1d1d]">Rs.{order.tax_pkr.toLocaleString()}</span>
            </div>
          )}
          <div className="flex justify-between text-sm font-bold pt-2 border-t border-slate-200">
            <span className="text-[#1d1d1d]">Total</span>
            <span className="text-[#bba442]" style={{ fontFamily: "'Aleo',serif", fontSize: '1.1rem' }}>Rs.{order.total_pkr.toLocaleString()}</span>
          </div>
        </div>
      </div>

      {/* Payment Info */}
      {order.payment && (
        <div className="border border-slate-200 rounded p-4 mb-5">
          <h4 className="text-sm font-semibold text-[#1d1d1d] mb-3">Payment Details</h4>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <div className="text-xs text-slate-400 mb-0.5">Method</div>
              {pm && <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${pm.color}`}>{pm.label}</span>}
            </div>
            <div>
              <div className="text-xs text-slate-400 mb-0.5">Transaction ID</div>
              <div className="text-sm font-mono text-[#1d1d1d]">{order.payment.transaction_id}</div>
            </div>
          </div>
        </div>
      )}

      <div className="flex gap-3">
        {order.status === 'pending' && <Button full>Pay Now</Button>}
        {order.status === 'paid' && <Button full variant="outline">Download Receipt</Button>}
        {order.status === 'failed' && <Button full variant="primary">Retry Payment</Button>}
        <Button full variant="ghost" onClick={onClose}>Close</Button>
      </div>
    </Modal>
  );
}

export default function BillingPage() {
  const [invoiceModal, setInvoiceModal] = useState(null);
  const [filter, setFilter] = useState('all');
  const [tab, setTab] = useState('invoices');

  const totalSpent = ORDERS.filter(o => o.status === 'paid').reduce((a, o) => a + o.total_pkr, 0);
  const pendingAmount = ORDERS.filter(o => o.status === 'pending').reduce((a, o) => a + o.total_pkr, 0);
  const filtered = filter === 'all' ? ORDERS : ORDERS.filter(o => o.status === filter);

  return (
    <div>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 style={{ fontFamily: "'Aleo',serif" }} className="text-2xl text-[#bba442]">Billing</h1>
          <p className="text-sm text-slate-500 mt-1">Manage invoices, payments, and renewals</p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {[
          { label: 'Total Spent', value: `Rs.${(totalSpent / 1000).toFixed(1)}K`, icon: '💰', color: '#10B981' },
          { label: 'Pending', value: pendingAmount > 0 ? `Rs.${pendingAmount.toLocaleString()}` : 'Rs.0', icon: '⏳', color: '#F59E0B' },
          { label: 'Invoices', value: String(ORDERS.length), icon: '🧾', color: '#5cc4eb' },
          { label: 'Next Renewal', value: 'Feb 1', icon: '📅', color: '#8B5CF6' },
        ].map(s => (
          <div key={s.label} className="bg-white border border-slate-200 rounded-2xl p-5 relative overflow-hidden hover:shadow-md transition-shadow">
            <div className="absolute top-4 right-4 w-11 h-11 rounded flex items-center justify-center text-xl" style={{ background: s.color + '18' }}>{s.icon}</div>
            <p className="text-xs font-medium text-slate-400 mb-2">{s.label}</p>
            <p className="text-2xl font-bold text-[#bba442]" style={{ fontFamily: "'Aleo',serif" }}>{s.value}</p>
          </div>
        ))}
      </div>

      {/* Tab Switcher */}
      <div className="flex gap-1 bg-white border border-slate-200 rounded-full p-1 mb-5 inline-flex">
        {['invoices', 'renewals'].map(t => (
          <button key={t} onClick={() => setTab(t)} className={`px-5 py-2 rounded-full text-sm font-semibold border-none cursor-pointer transition-all capitalize ${tab === t ? 'bg-[#5cc4eb] text-white' : 'bg-transparent text-slate-500 hover:text-[#1d1d1d]'}`}>
            {t === 'invoices' ? 'Invoices' : 'Upcoming Renewals'}
          </button>
        ))}
      </div>

      {/* Invoices Tab */}
      {tab === 'invoices' && (
        <>
          {/* Filter */}
          <div className="flex gap-2 mb-5 flex-wrap">
            {['all', 'paid', 'pending', 'failed'].map(f => (
              <button key={f} onClick={() => setFilter(f)} className={`px-4 py-1.5 rounded-full border text-xs font-semibold cursor-pointer transition-all capitalize ${filter === f ? 'bg-[#e8f6fc] border-[#5cc4eb] text-[#5cc4eb]' : 'bg-white border-slate-200 text-slate-500 hover:border-slate-300'}`}>
                {f === 'all' ? `All (${ORDERS.length})` : `${f} (${ORDERS.filter(o => o.status === f).length})`}
              </button>
            ))}
          </div>

          {/* Invoices Table */}
          <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full border-collapse text-sm">
                <thead className="bg-slate-50">
                  <tr>
                    {['Invoice', 'Date', 'Items', 'Method', 'Amount', 'Status', ''].map(h => (
                      <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider border-b border-slate-200 whitespace-nowrap">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filtered.length === 0 && (
                    <tr><td colSpan={7} className="px-4 py-8 text-center text-slate-400">No invoices found.</td></tr>
                  )}
                  {filtered.map(order => {
                    const st = STATUS_MAP[order.status] || STATUS_MAP.pending;
                    const pm = order.payment ? METHOD_MAP[order.payment.method] : null;
                    return (
                      <tr key={order.id} className="border-b border-slate-100 last:border-none hover:bg-slate-50/50 transition-colors cursor-pointer" onClick={() => setInvoiceModal(order)}>
                        <td className="px-4 py-3.5">
                          <span className="font-semibold text-[#1d1d1d]">{order.order_number}</span>
                        </td>
                        <td className="px-4 py-3.5 text-slate-500">
                          {new Date(order.created_at).toLocaleDateString('en-PK', { month: 'short', day: 'numeric', year: 'numeric' })}
                        </td>
                        <td className="px-4 py-3.5">
                          <div className="flex items-center gap-1.5">
                            {[...new Set(order.items.map(i => i.item_type))].map(type => (
                              <span key={type} className="text-sm" title={type}>{ITEM_ICONS[type] || '📦'}</span>
                            ))}
                            <span className="text-xs text-slate-400">{order.items.filter(i => i.total_price > 0).length} items</span>
                          </div>
                        </td>
                        <td className="px-4 py-3.5">
                          {pm ? (
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${pm.color}`}>{pm.label}</span>
                          ) : (
                            <span className="text-xs text-slate-400">—</span>
                          )}
                        </td>
                        <td className="px-4 py-3.5">
                          <span style={{ fontFamily: "'Aleo',serif" }} className="text-base text-[#bba442]">Rs.{order.total_pkr.toLocaleString()}</span>
                        </td>
                        <td className="px-4 py-3.5"><Badge variant={st.variant}>{st.label}</Badge></td>
                        <td className="px-4 py-3.5">
                          <Button size="sm" variant="ghost" onClick={(e) => { e.stopPropagation(); setInvoiceModal(order); }}>View</Button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}

      {/* Renewals Tab */}
      {tab === 'renewals' && (
        <div className="space-y-3">
          {UPCOMING_RENEWALS.sort((a, b) => new Date(a.due) - new Date(b.due)).map((r, i) => {
            const days = Math.ceil((new Date(r.due) - new Date()) / (1000 * 60 * 60 * 24));
            return (
              <div key={i} className={`flex items-center justify-between bg-white border rounded-2xl p-5 transition-all hover:shadow-md ${days <= 30 ? 'border-amber-200 bg-amber-50/30' : 'border-slate-200'}`}>
                <div className="flex items-center gap-4">
                  <div className="w-11 h-11 rounded flex items-center justify-center text-xl" style={{ background: r.type === 'hosting' ? '#5cc4eb18' : '#00C8B418' }}>
                    {r.type === 'hosting' ? '☁️' : '🌐'}
                  </div>
                  <div>
                    <div className="font-semibold text-sm text-[#1d1d1d]">{r.service}</div>
                    <div className="text-xs text-slate-400">{r.domain}</div>
                  </div>
                </div>
                <div className="flex items-center gap-6">
                  <div className="text-right">
                    <div className="text-sm text-[#1d1d1d]">
                      {new Date(r.due).toLocaleDateString('en-PK', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </div>
                    <div className={`text-xs font-semibold ${days <= 30 ? 'text-amber-600' : 'text-slate-400'}`}>
                      {days <= 0 ? 'Overdue' : `In ${days} days`}
                    </div>
                  </div>
                  <div style={{ fontFamily: "'Aleo',serif" }} className="text-xl text-[#bba442] min-w-[100px] text-right">
                    Rs.{r.amount.toLocaleString()}
                  </div>
                  <Button size="sm" variant={days <= 30 ? 'primary' : 'outline'}>
                    {days <= 30 ? 'Renew Now' : 'Details'}
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      <InvoiceModal order={invoiceModal} open={!!invoiceModal} onClose={() => setInvoiceModal(null)} />
    </div>
  );
}
