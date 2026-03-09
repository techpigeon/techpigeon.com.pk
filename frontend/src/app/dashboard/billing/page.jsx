'use client';
export const dynamic = 'force-dynamic';

import { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import Modal from '@/components/ui/Modal';
import Alert from '@/components/ui/Alert';
import { ordersApi, paymentsApi } from '@/lib/api';

const STATUS_MAP = {
  paid:      { variant: 'green',  label: 'Paid' },
  pending:   { variant: 'yellow', label: 'Pending' },
  failed:    { variant: 'red',    label: 'Failed' },
  refunded:  { variant: 'purple', label: 'Refunded' },
  cancelled: { variant: 'gray',   label: 'Cancelled' },
};

const ITEM_ICONS = {
  domain:  '🌐',
  hosting: '☁️',
  course:  '🎓',
  ssl:     '🔒',
  email:   '📧',
  renewal: '🔄',
};

function postGatewayForm(url, data) {
  const form = document.createElement('form');
  form.method = 'POST';
  form.action = url;
  form.style.display = 'none';
  Object.entries(data || {}).forEach(([k, v]) => {
    const i = document.createElement('input');
    i.name = k;
    i.value = String(v ?? '');
    form.appendChild(i);
  });
  document.body.appendChild(form);
  form.submit();
}

function normalizeOrder(order) {
  const items = Array.isArray(order.items)
    ? order.items.filter((x) => x && x.description)
    : [];
  return { ...order, items };
}

function PayModal({ order, open, onClose, onPaid }) {
  const [method, setMethod] = useState('jazzcash');
  const [mobile, setMobile] = useState('');
  const [bankName, setBankName] = useState('Meezan Bank Limited (PKR)');
  const [txnRef, setTxnRef] = useState('');
  const [screenshot, setScreenshot] = useState(null);
  const [screenshotName, setScreenshotName] = useState('');
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState('');

  if (!order) return null;

  const initiate = async () => {
    setErr('');
    setLoading(true);
    try {
      if (method === 'jazzcash') {
        if (!mobile) throw new Error('Mobile number is required for JazzCash.');
        const { data } = await paymentsApi.jazzcash(order.id, mobile);
        if (data?.gateway_url && data?.redirect_data) {
          postGatewayForm(data.gateway_url, data.redirect_data);
          return;
        }
      }

      if (method === 'easypaisa') {
        if (!mobile) throw new Error('Mobile number is required for EasyPaisa.');
        const { data } = await paymentsApi.easypaisa(order.id, mobile);
        if (data?.gateway_url && data?.redirect_data) {
          postGatewayForm(data.gateway_url, data.redirect_data);
          return;
        }
      }

      if (method === 'bank_transfer') {
        if (!txnRef) throw new Error('Transaction reference is required.');
        const { data } = await paymentsApi.bank(order.id, bankName, txnRef, screenshot, screenshotName);
        onPaid(`Bank transfer submitted. ${data?.message || ''}`);
        onClose();
        return;
      }

      if (method === 'stripe') {
        await paymentsApi.stripe(order.id);
        onPaid('Stripe intent created. Continue from your Stripe checkout flow.');
        onClose();
        return;
      }
    } catch (e) {
      setErr(e.response?.data?.error || e.message || 'Payment initiation failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal open={open} onClose={onClose} title={`Pay ${order.order_number}`} width={540}>
      {err && <Alert type="error">{err}</Alert>}
      <div className="space-y-3">
        <div>
          <label className="block text-xs font-semibold text-slate-500 mb-1">Method</label>
          <select value={method} onChange={(e) => setMethod(e.target.value)} className="w-full px-3 py-2.5 border-2 border-slate-200 rounded text-sm outline-none focus:border-[#5cc4eb]">
            <option value="jazzcash">JazzCash</option>
            <option value="easypaisa">EasyPaisa</option>
            <option value="bank_transfer">Bank Transfer</option>
            <option value="stripe">Stripe</option>
          </select>
        </div>

        {(method === 'jazzcash' || method === 'easypaisa') && (
          <div>
            <label className="block text-xs font-semibold text-slate-500 mb-1">Mobile Number</label>
            <input value={mobile} onChange={(e) => setMobile(e.target.value)} placeholder="03XXXXXXXXX" className="w-full px-3 py-2.5 border-2 border-slate-200 rounded text-sm" />
          </div>
        )}

        {method === 'bank_transfer' && (
          <>
            <div className="rounded-lg border border-slate-200 bg-slate-50 p-3 text-sm text-slate-700">
              <p><b>Bank:</b> Meezan Bank Limited (PKR)</p>
              <p><b>Title:</b> TECHPIGEON</p>
              <p><b>IBAN:</b> PK95MEZN0034010105015073</p>
              <p><b>SWIFT CODE:</b> MEZNPKKA</p>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-500 mb-1">Bank Name</label>
              <input value={bankName} onChange={(e) => setBankName(e.target.value)} className="w-full px-3 py-2.5 border-2 border-slate-200 rounded text-sm" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-500 mb-1">Transaction Reference</label>
              <input value={txnRef} onChange={(e) => setTxnRef(e.target.value)} placeholder="TRX-123456" className="w-full px-3 py-2.5 border-2 border-slate-200 rounded text-sm" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-500 mb-1">Payment Screenshot (optional)</label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (!file) {
                    setScreenshot(null);
                    setScreenshotName('');
                    return;
                  }
                  setScreenshotName(file.name);
                  const reader = new FileReader();
                  reader.onload = () => setScreenshot(reader.result);
                  reader.readAsDataURL(file);
                }}
                className="w-full px-3 py-2 border-2 border-slate-200 rounded text-sm bg-white"
              />
            </div>
          </>
        )}

        <div className="rounded-lg border border-slate-200 bg-slate-50 p-3 text-sm text-slate-600">
          Amount: <b>Rs.{Number(order.total_pkr || 0).toLocaleString('en-PK')}</b>
        </div>

        <div className="flex gap-3 pt-1">
          <Button full loading={loading} onClick={initiate}>Continue</Button>
          <Button full variant="outline" onClick={onClose}>Cancel</Button>
        </div>
      </div>
    </Modal>
  );
}

function InvoiceModal({ order, open, onClose, onPay }) {
  if (!order) return null;
  const st = STATUS_MAP[order.status] || STATUS_MAP.pending;

  return (
    <Modal open={open} onClose={onClose} title={`Invoice ${order.order_number}`} width={620}>
      <div className="flex items-center justify-between p-4 rounded bg-slate-50 border border-slate-200 mb-5">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span style={{ fontFamily: "'Aleo',serif" }} className="text-xl text-[#bba442]">{order.order_number}</span>
            <Badge variant={st.variant}>{st.label}</Badge>
          </div>
          <p className="text-xs text-slate-400">Created {new Date(order.created_at).toLocaleDateString('en-PK', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
        </div>
        <div style={{ fontFamily: "'Aleo',serif" }} className="text-2xl text-[#bba442]">Rs.{Number(order.total_pkr || 0).toLocaleString('en-PK')}</div>
      </div>

      {order.status === 'pending' && <Alert type="warning">This invoice is pending. Complete payment to activate services.</Alert>}

      <div className="border border-slate-200 rounded overflow-hidden mb-5">
        <table className="w-full text-sm">
          <thead className="bg-slate-50">
            <tr>
              {['Item', 'Qty', 'Price', 'Total'].map(h => (
                <th key={h} className="px-4 py-2.5 text-left text-xs font-semibold text-slate-400 uppercase border-b border-slate-200">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {(order.items || []).map((item, i) => (
              <tr key={i} className="border-b border-slate-100 last:border-none">
                <td className="px-4 py-3"><span className="mr-2">{ITEM_ICONS[item.item_type] || '📦'}</span>{item.description}</td>
                <td className="px-4 py-3 text-slate-500">{item.quantity || 1}</td>
                <td className="px-4 py-3 text-slate-500">Rs.{Number(Math.abs(item.unit_price || 0)).toLocaleString('en-PK')}</td>
                <td className="px-4 py-3 font-semibold">{Number(item.total_price || 0) < 0 ? `-Rs.${Number(Math.abs(item.total_price || 0)).toLocaleString('en-PK')}` : `Rs.${Number(item.total_price || 0).toLocaleString('en-PK')}`}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex gap-3">
        {order.status === 'pending' && <Button full onClick={() => onPay(order)}>Pay Now</Button>}
        <Button full variant="ghost" onClick={onClose}>Close</Button>
      </div>
    </Modal>
  );
}

export default function BillingPage() {
  const searchParams = useSearchParams();
  const orderFromCheckout = searchParams.get('order');

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [invoiceModal, setInvoiceModal] = useState(null);
  const [payModalOrder, setPayModalOrder] = useState(null);
  const [err, setErr] = useState('');
  const [ok, setOk] = useState('');

  const load = async () => {
    setLoading(true);
    setErr('');
    try {
      const { data } = await ordersApi.list();
      const list = (data.orders || []).map(normalizeOrder);
      setOrders(list);
      if (orderFromCheckout) {
        const created = list.find((o) => o.id === orderFromCheckout);
        if (created) setInvoiceModal(created);
      }
    } catch (e) {
      setErr(e.response?.data?.error || 'Failed to load billing data.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const totalSpent = orders.filter(o => o.status === 'paid').reduce((a, o) => a + Number(o.total_pkr || 0), 0);
  const pendingAmount = orders.filter(o => o.status === 'pending').reduce((a, o) => a + Number(o.total_pkr || 0), 0);
  const filtered = filter === 'all' ? orders : orders.filter(o => o.status === filter);

  const onPaymentInit = (message) => {
    setOk(message || 'Payment initiated.');
    setPayModalOrder(null);
    load();
  };

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 style={{ fontFamily: "'Aleo',serif" }} className="text-2xl text-[#bba442]">Billing</h1>
          <p className="text-sm text-slate-500 mt-1">Manage invoices and complete your pending payments</p>
        </div>
      </div>

      {orderFromCheckout && <Alert type="info">Order created successfully. Complete payment below to activate services.</Alert>}
      {err && <Alert type="error">{err}</Alert>}
      {ok && <Alert type="success">{ok}</Alert>}

      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
        {[
          { label: 'Total Spent', value: `Rs.${(totalSpent / 1000).toFixed(1)}K`, icon: '💰', color: '#10B981' },
          { label: 'Pending', value: pendingAmount > 0 ? `Rs.${pendingAmount.toLocaleString('en-PK')}` : 'Rs.0', icon: '⏳', color: '#F59E0B' },
          { label: 'Invoices', value: String(orders.length), icon: '🧾', color: '#5cc4eb' },
        ].map(s => (
          <div key={s.label} className="bg-white border border-slate-200 rounded-2xl p-5 relative overflow-hidden hover:shadow-md transition-shadow">
            <div className="absolute top-4 right-4 w-11 h-11 rounded flex items-center justify-center text-xl" style={{ background: s.color + '18' }}>{s.icon}</div>
            <p className="text-xs font-medium text-slate-400 mb-2">{s.label}</p>
            <p className="text-2xl font-bold text-[#bba442]" style={{ fontFamily: "'Aleo',serif" }}>{s.value}</p>
          </div>
        ))}
      </div>

      <div className="flex gap-2 mb-5 flex-wrap">
        {['all', 'paid', 'pending', 'failed'].map(f => (
          <button key={f} onClick={() => setFilter(f)} className={`px-4 py-1.5 rounded-full border text-xs font-semibold cursor-pointer transition-all capitalize ${filter === f ? 'bg-[#e8f6fc] border-[#5cc4eb] text-[#5cc4eb]' : 'bg-white border-slate-200 text-slate-500 hover:border-slate-300'}`}>
            {f === 'all' ? `All (${orders.length})` : `${f} (${orders.filter(o => o.status === f).length})`}
          </button>
        ))}
        <Button size="sm" variant="outline" onClick={load}>Refresh</Button>
      </div>

      <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-sm">
            <thead className="bg-slate-50">
              <tr>
                {['Invoice', 'Date', 'Items', 'Amount', 'Status', ''].map(h => (
                  <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider border-b border-slate-200 whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loading && <tr><td colSpan={6} className="px-4 py-8 text-center text-slate-400">Loading invoices...</td></tr>}
              {!loading && filtered.length === 0 && <tr><td colSpan={6} className="px-4 py-8 text-center text-slate-400">No invoices found.</td></tr>}
              {!loading && filtered.map(order => {
                const st = STATUS_MAP[order.status] || STATUS_MAP.pending;
                const itemTypes = [...new Set((order.items || []).map(i => i.item_type))];
                return (
                  <tr key={order.id} className="border-b border-slate-100 last:border-none hover:bg-slate-50/50 transition-colors cursor-pointer" onClick={() => setInvoiceModal(order)}>
                    <td className="px-4 py-3.5"><span className="font-semibold text-[#1d1d1d]">{order.order_number || order.id.slice(0,8)}</span></td>
                    <td className="px-4 py-3.5 text-slate-500">{order.created_at ? new Date(order.created_at).toLocaleDateString('en-PK', { month: 'short', day: 'numeric', year: 'numeric' }) : '-'}</td>
                    <td className="px-4 py-3.5">
                      <div className="flex items-center gap-1.5">
                        {itemTypes.map(type => <span key={type} className="text-sm" title={type}>{ITEM_ICONS[type] || '📦'}</span>)}
                        <span className="text-xs text-slate-400">{(order.items || []).filter(i => Number(i.total_price || 0) > 0).length} items</span>
                      </div>
                    </td>
                    <td className="px-4 py-3.5"><span style={{ fontFamily: "'Aleo',serif" }} className="text-base text-[#bba442]">Rs.{Number(order.total_pkr || 0).toLocaleString('en-PK')}</span></td>
                    <td className="px-4 py-3.5"><Badge variant={st.variant}>{st.label}</Badge></td>
                    <td className="px-4 py-3.5">
                      <div className="flex gap-2">
                        <Button size="sm" variant="ghost" onClick={(e) => { e.stopPropagation(); setInvoiceModal(order); }}>View</Button>
                        {order.status === 'pending' && (
                          <Button size="sm" onClick={(e) => { e.stopPropagation(); setPayModalOrder(order); }}>Pay</Button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      <InvoiceModal
        order={invoiceModal}
        open={!!invoiceModal}
        onClose={() => setInvoiceModal(null)}
        onPay={(order) => { setInvoiceModal(null); setPayModalOrder(order); }}
      />

      <PayModal
        order={payModalOrder}
        open={!!payModalOrder}
        onClose={() => setPayModalOrder(null)}
        onPaid={onPaymentInit}
      />
    </div>
  );
}
