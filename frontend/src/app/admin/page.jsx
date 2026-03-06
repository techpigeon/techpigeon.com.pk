'use client';
export const dynamic = 'force-dynamic';

import StatCard from '../../components/ui/StatCard';
import Badge from '../../components/ui/Badge';

const ORDERS = [
  { no:'TP-1050', user:'ali@example.com',  total:8399,  status:'paid' },
  { no:'TP-1049', user:'sara@mail.com',     total:3599,  status:'pending' },
  { no:'TP-1048', user:'john@pk.com',       total:14999, status:'paid' },
];

const REV = [
  ['JazzCash','Rs.1.8M',45],
  ['Stripe','Rs.1.2M',30],
  ['EasyPaisa','Rs.0.7M',18],
  ['Bank Transfer','Rs.0.3M',7],
];

export default function AdminPage() {
  return (
    <div>
      <div className="mb-6 flex items-center gap-2">
        <span className="bg-[#00A8E8] text-white text-xs font-bold px-2.5 py-1 rounded-full">ADMIN</span>
        <h1 style={{fontFamily:"'DM Serif Display',serif"}} className="text-2xl text-[#0B1D3A]">Dashboard Overview</h1>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard label="Total Clients"  value="12,483" sub="↑ 234 this month" icon="👥" color="#00A8E8"/>
        <StatCard label="Revenue (MTD)"  value="Rs.4.2M" sub="↑ 18% vs last"  icon="💰" color="#10B981"/>
        <StatCard label="Active Domains" value="48,291"  sub="↑ 1,204 new"    icon="🌐" color="#00C8B4"/>
        <StatCard label="Open Tickets"   value="17"      sub="3 urgent"        icon="🎫" color="#F97316"/>
      </div>

      <div className="grid lg:grid-cols-3 gap-5">
        {/* Orders table - inline, no render props */}
        <div className="lg:col-span-2 bg-white border border-slate-200 rounded-2xl p-6">
          <h3 className="font-semibold text-[#0B1D3A] mb-4">Recent Orders</h3>
          <div className="overflow-x-auto rounded-xl border border-slate-200">
            <table className="w-full border-collapse text-sm">
              <thead className="bg-slate-50">
                <tr>
                  {['Order #','User','Amount','Status'].map(h => (
                    <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider border-b border-slate-200">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {ORDERS.map((row, i) => (
                  <tr key={i} className="border-b border-slate-100 last:border-none hover:bg-slate-50">
                    <td className="px-4 py-3.5 text-slate-700">{row.no}</td>
                    <td className="px-4 py-3.5 text-slate-700">{row.user}</td>
                    <td className="px-4 py-3.5 text-slate-700">Rs.{row.total.toLocaleString()}</td>
                    <td className="px-4 py-3.5">
                      <Badge variant={row.status === 'paid' ? 'green' : 'yellow'}>{row.status}</Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Revenue breakdown */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6">
          <h3 className="font-semibold text-[#0B1D3A] mb-4">Revenue by Method</h3>
          {REV.map(([m, r, pct]) => (
            <div key={m} className="mb-4">
              <div className="flex justify-between text-sm mb-1.5">
                <span className="text-[#0B1D3A] font-medium">{m}</span>
                <span className="text-slate-400">{r} ({pct}%)</span>
              </div>
              <div className="bg-slate-200 rounded-full h-2">
                <div className="bg-[#00A8E8] h-2 rounded-full" style={{width:`${pct}%`}}/>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
