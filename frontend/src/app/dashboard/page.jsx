'use client';
export const dynamic = 'force-dynamic';
import Link from 'next/link';
import StatCard from '../../components/ui/StatCard';
import Button from '../../components/ui/Button';
const SERVICES=[{icon:'🌐',name:'techpigeon.org',sub:'Expires Dec 2025',st:'active'},{icon:'🌐',name:'mybusiness.pk',sub:'Expires Mar 2026',st:'active'},{icon:'☁️',name:'Cloud Pro — Server 1',sub:'99.98% uptime',st:'active'},{icon:'☁️',name:'Cloud Starter',sub:'Renewal pending',st:'pending'}];
const NOTIFS=[{icon:'⚠️',bg:'#FEF3C7',t:'mybusiness.com expires in 45 days.',time:'2h ago'},{icon:'✅',bg:'#D1FAE5',t:'SSL auto-renewed for techpigeon.org',time:'Yesterday'},{icon:'🎓',bg:'#EAF6FD',t:'New module available in AWS course',time:'2 days ago'},{icon:'💳',bg:'#EAF6FD',t:'Invoice #TP-1042 — Rs.7,198 due Apr 1',time:'3 days ago'}];
export default function DashboardPage() {
  return (
    <div>
      <div className="mb-7"><h1 style={{fontFamily:"'DM Serif Display',serif"}} className="text-2xl text-[#0B1D3A]">Good morning 👋</h1><p className="text-sm text-slate-500 mt-1">Here's an overview of your TechPigeon services.</p></div>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard label="Active Domains" value="3" sub="↑ 1 added this month" icon="🌐" color="#00A8E8"/>
        <StatCard label="Hosting Plans" value="2" sub="Pro + Starter" icon="☁️" color="#00C8B4"/>
        <StatCard label="Courses Enrolled" value="4" sub="72% avg progress" icon="🎓" color="#F59E0B"/>
        <StatCard label="Next Invoice" value="Rs.7,198" sub="Due Apr 1, 2025" icon="💳" color="#F97316"/>
      </div>
      <div className="grid lg:grid-cols-3 gap-5">
        <div className="lg:col-span-2 bg-white border border-slate-200 rounded-2xl p-6">
          <div className="flex justify-between items-center mb-5">
            <h3 className="font-semibold text-[#0B1D3A]">Active Services</h3>
            <Link href="/hosting"><Button size="sm">+ Add Service</Button></Link>
          </div>
          {SERVICES.map(s=>(
            <div key={s.name} className="flex items-center justify-between py-3 border-b border-slate-100 last:border-none">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-[#EAF6FD] flex items-center justify-center">{s.icon}</div>
                <div><div className="text-sm font-medium text-[#0B1D3A]">{s.name}</div><div className="text-xs text-slate-400 mt-0.5">{s.sub}</div></div>
              </div>
              <Button size="sm" variant="outline">Manage</Button>
            </div>
          ))}
        </div>
        <div className="bg-white border border-slate-200 rounded-2xl p-6">
          <div className="flex justify-between items-center mb-5">
            <h3 className="font-semibold text-[#0B1D3A]">Notifications</h3>
          </div>
          {NOTIFS.map(n=>(
            <div key={n.t} className="flex gap-3 py-2.5 border-b border-slate-100 last:border-none">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center text-sm flex-shrink-0" style={{background:n.bg}}>{n.icon}</div>
              <div><p className="text-xs text-[#0B1D3A] leading-snug">{n.t}</p><p className="text-xs text-slate-400 mt-0.5">{n.time}</p></div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
