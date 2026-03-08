'use client';
export const dynamic = 'force-dynamic';
import { useState } from 'react';
import Badge from '../../components/ui/Badge';
import Button from '../../components/ui/Button';

// ─── Mock data ────────────────────────────────────────────────────
const STATS = [
  { label: 'Total Clients',  value: '12,483', sub: '↑ 234 this month', icon: '👥', color: '#5cc4eb' },
  { label: 'Revenue (MTD)',  value: 'Rs.4.2M', sub: '↑ 18% vs last',  icon: '💰', color: '#41D33E' },
  { label: 'Active Domains', value: '48,291',  sub: '↑ 1,204 new',    icon: '🌐', color: '#bba442' },
  { label: 'Open Tickets',   value: '17',      sub: '3 urgent',        icon: '🎫', color: '#F73730' },
];

const REVENUE_MONTHLY = [
  { month: 'Aug', amount: 2800000 }, { month: 'Sep', amount: 3100000 },
  { month: 'Oct', amount: 2900000 }, { month: 'Nov', amount: 3500000 },
  { month: 'Dec', amount: 3900000 }, { month: 'Jan', amount: 4200000 },
];

const REV_METHODS = [
  { method: 'JazzCash', amount: 'Rs.1.8M', pct: 45, color: '#F73730' },
  { method: 'Stripe', amount: 'Rs.1.2M', pct: 30, color: '#5cc4eb' },
  { method: 'EasyPaisa', amount: 'Rs.0.7M', pct: 18, color: '#41D33E' },
  { method: 'Bank Transfer', amount: 'Rs.0.3M', pct: 7, color: '#bba442' },
];

const RECENT_ORDERS = [
  { no: 'TP-1055', user: 'ali@example.com', type: 'hosting', total: 3599, status: 'paid', time: '12m ago' },
  { no: 'TP-1054', user: 'sara@mail.com', type: 'course', total: 12999, status: 'paid', time: '45m ago' },
  { no: 'TP-1053', user: 'john@pk.com', type: 'domain', total: 3499, status: 'pending', time: '2h ago' },
  { no: 'TP-1052', user: 'fatima@biz.pk', type: 'hosting', total: 8399, status: 'paid', time: '3h ago' },
  { no: 'TP-1051', user: 'usman@dev.com', type: 'domain', total: 1099, status: 'failed', time: '5h ago' },
];

const RECENT_ACTIVITY = [
  { icon: '👤', text: 'New user registered: fatima@biz.pk', time: '10m ago', type: 'user' },
  { icon: '💳', text: 'Payment Rs.3,599 received via JazzCash', time: '12m ago', type: 'payment' },
  { icon: '🌐', text: 'Domain mybusiness.pk renewed for 1 year', time: '45m ago', type: 'domain' },
  { icon: '🎫', text: 'Ticket #T-89 escalated to urgent', time: '1h ago', type: 'ticket' },
  { icon: '☁️', text: 'Server alert: Cloud Pro CPU at 92%', time: '2h ago', type: 'hosting' },
  { icon: '🎓', text: 'New enrollment: Docker & Kubernetes course', time: '3h ago', type: 'course' },
  { icon: '✅', text: 'Ticket #T-85 resolved by Sara', time: '4h ago', type: 'ticket' },
  { icon: '💰', text: 'Refund Rs.8,999 processed for order TP-1042', time: '5h ago', type: 'payment' },
];

const SERVICE_BREAKDOWN = [
  { name: 'Domains', active: 48291, revenue: 'Rs.12.4M', pct: 35, color: '#bba442' },
  { name: 'Hosting', active: 8420, revenue: 'Rs.18.2M', pct: 42, color: '#5cc4eb' },
  { name: 'Courses', active: 3150, revenue: 'Rs.6.8M', pct: 15, color: '#41D33E' },
  { name: 'SSL/Other', active: 2100, revenue: 'Rs.3.1M', pct: 8, color: '#F8D313' },
];

const STATUS_MAP = {
  paid: { variant: 'green', label: 'Paid' },
  pending: { variant: 'yellow', label: 'Pending' },
  failed: { variant: 'red', label: 'Failed' },
};

const TYPE_ICONS = { hosting: '☁️', course: '🎓', domain: '🌐', ssl: '🔒' };

function MiniBarChart({ data }) {
  const max = Math.max(...data.map(d => d.amount));
  return (
    <div className="flex items-end gap-2 h-32">
      {data.map(d => (
        <div key={d.month} className="flex-1 flex flex-col items-center gap-1">
          <div className="w-full rounded-t" style={{ height: `${(d.amount / max) * 100}%`, background: '#5cc4eb', minHeight: 4 }} />
          <span className="text-[10px] text-slate-400">{d.month}</span>
        </div>
      ))}
    </div>
  );
}

export default function AdminPage() {
  return (
    <div>
      {/* Header */}
      <div className="mb-6 flex items-center gap-3">
        <span className="bg-[#5cc4eb] text-white text-xs font-bold px-2.5 py-1 rounded-full">ADMIN</span>
        <h1 style={{ fontFamily: "'Aleo',serif" }} className="text-2xl text-[#bba442]">Dashboard Overview</h1>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {STATS.map(s => (
          <div key={s.label} className="bg-white border border-slate-200 rounded-2xl p-5 relative overflow-hidden hover:shadow-md transition-shadow">
            <div className="absolute top-4 right-4 w-11 h-11 rounded flex items-center justify-center text-xl" style={{ background: s.color + '18' }}>{s.icon}</div>
            <p className="text-xs font-medium text-slate-400 mb-2">{s.label}</p>
            <p className="text-3xl font-bold text-[#bba442]" style={{ fontFamily: "'Aleo',serif" }}>{s.value}</p>
            <p className="text-xs font-medium mt-1" style={{ color: s.color }}>{s.sub}</p>
          </div>
        ))}
      </div>

      {/* Row 2: Revenue Chart + Revenue by Method */}
      <div className="grid lg:grid-cols-3 gap-5 mb-6">
        <div className="lg:col-span-2 bg-white border border-slate-200 rounded-2xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-[#1d1d1d]">Monthly Revenue</h3>
            <span className="text-xs text-slate-400">Last 6 months</span>
          </div>
          <MiniBarChart data={REVENUE_MONTHLY} />
          <div className="flex justify-between mt-3 pt-3 border-t border-slate-100">
            <div>
              <span className="text-xs text-slate-400">Total (6mo)</span>
              <div className="font-bold text-[#1d1d1d]" style={{ fontFamily: "'Aleo',serif" }}>Rs.20.4M</div>
            </div>
            <div className="text-right">
              <span className="text-xs text-slate-400">Avg Monthly</span>
              <div className="font-bold text-[#1d1d1d]" style={{ fontFamily: "'Aleo',serif" }}>Rs.3.4M</div>
            </div>
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-6">
          <h3 className="font-semibold text-[#1d1d1d] mb-4">Revenue by Method</h3>
          {REV_METHODS.map(m => (
            <div key={m.method} className="mb-4">
              <div className="flex justify-between text-sm mb-1.5">
                <span className="text-[#1d1d1d] font-medium">{m.method}</span>
                <span className="text-slate-400">{m.amount} ({m.pct}%)</span>
              </div>
              <div className="bg-slate-200 rounded-full h-2">
                <div className="h-2 rounded-full transition-all duration-500" style={{ width: `${m.pct}%`, background: m.color }} />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Row 3: Recent Orders + Activity Feed */}
      <div className="grid lg:grid-cols-3 gap-5 mb-6">
        <div className="lg:col-span-2 bg-white border border-slate-200 rounded-2xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-[#1d1d1d]">Recent Orders</h3>
            <Button size="sm" variant="outline">View All</Button>
          </div>
          <div className="overflow-x-auto rounded border border-slate-200">
            <table className="w-full border-collapse text-sm">
              <thead className="bg-slate-50">
                <tr>
                  {['Order', 'User', 'Type', 'Amount', 'Status', 'Time'].map(h => (
                    <th key={h} className="px-4 py-2.5 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider border-b border-slate-200">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {RECENT_ORDERS.map(o => {
                  const st = STATUS_MAP[o.status] || STATUS_MAP.pending;
                  return (
                    <tr key={o.no} className="border-b border-slate-100 last:border-none hover:bg-slate-50">
                      <td className="px-4 py-3 font-semibold text-[#1d1d1d]">{o.no}</td>
                      <td className="px-4 py-3 text-slate-500">{o.user}</td>
                      <td className="px-4 py-3"><span className="text-sm">{TYPE_ICONS[o.type] || '📦'} {o.type}</span></td>
                      <td className="px-4 py-3 font-semibold text-[#1d1d1d]">Rs.{o.total.toLocaleString()}</td>
                      <td className="px-4 py-3"><Badge variant={st.variant}>{st.label}</Badge></td>
                      <td className="px-4 py-3 text-xs text-slate-400">{o.time}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-6">
          <h3 className="font-semibold text-[#1d1d1d] mb-4">Activity Feed</h3>
          <div className="space-y-3 max-h-[350px] overflow-y-auto pr-1">
            {RECENT_ACTIVITY.map((a, i) => (
              <div key={i} className="flex gap-3 pb-3 border-b border-slate-100 last:border-none">
                <div className="w-8 h-8 rounded flex items-center justify-center text-sm bg-slate-100 flex-shrink-0">{a.icon}</div>
                <div>
                  <p className="text-xs text-[#1d1d1d] leading-snug">{a.text}</p>
                  <p className="text-[10px] text-slate-400 mt-0.5">{a.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Row 4: Service Breakdown */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6">
        <h3 className="font-semibold text-[#1d1d1d] mb-4">Service Breakdown</h3>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {SERVICE_BREAKDOWN.map(s => (
            <div key={s.name} className="border border-slate-200 rounded-2xl p-4 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm font-semibold text-[#1d1d1d]">{s.name}</span>
                <span className="text-xs font-bold px-2 py-0.5 rounded-full" style={{ background: s.color + '18', color: s.color }}>{s.pct}%</span>
              </div>
              <div className="mb-2">
                <div className="text-xs text-slate-400">Active</div>
                <div className="text-lg font-bold text-[#1d1d1d]" style={{ fontFamily: "'Aleo',serif" }}>{s.active.toLocaleString()}</div>
              </div>
              <div>
                <div className="text-xs text-slate-400">Revenue (YTD)</div>
                <div className="text-sm font-bold" style={{ color: s.color }}>{s.revenue}</div>
              </div>
              <div className="bg-slate-200 rounded-full h-1.5 mt-3">
                <div className="h-1.5 rounded-full" style={{ width: `${s.pct}%`, background: s.color }} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
