import StatCard from '@/components/ui/StatCard';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import Link from 'next/link';
export default function DashboardPage() {
  const services=[
    {icon:'🌐',name:'techpigeon.org',sub:'Expires Dec 2026',active:true},
    {icon:'🌐',name:'mybusiness.pk',sub:'Expires Mar 2026',active:true},
    {icon:'☁️',name:'Cloud Pro — Server 1',sub:'99.98% uptime',active:true},
    {icon:'☁️',name:'Cloud Starter',sub:'Renewal pending',active:false},
  ];
  const notifs=[
    {icon:'⚠️',bg:'#FEF3C7',t:'mybusiness.com expires in 45 days',time:'2h ago'},
    {icon:'✅',bg:'#D1FAE5',t:'SSL auto-renewed for techpigeon.org',time:'Yesterday'},
    {icon:'🎓',bg:'#EAF6FD',t:'New module added: Kubernetes Security',time:'2 days ago'},
  ];
  return (
    <div>
      <div className="mb-7">
        <h1 className="text-2xl text-[#0B1D3A]" style={{fontFamily:"'DM Serif Display',serif"}}>Good morning, Ali 👋</h1>
        <p className="text-sm text-slate-500 mt-1">Here's an overview of your TechPigeon services.</p>
      </div>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard label="Active Domains"   value="3"        sub="↑ 1 this month"  icon="🌐" color="#00A8E8"/>
        <StatCard label="Hosting Plans"    value="2"        sub="Pro + Starter"   icon="☁️"  color="#00C8B4"/>
        <StatCard label="Courses Enrolled" value="4"        sub="72% avg progress"icon="🎓" color="#F59E0B"/>
        <StatCard label="Next Invoice"     value="Rs.7,198" sub="Due Apr 1"       icon="💳" color="#F97316"/>
      </div>
      <div className="grid lg:grid-cols-3 gap-5">
        <div className="lg:col-span-2 bg-white border border-slate-200 rounded-2xl p-6">
          <div className="flex justify-between items-center mb-5">
            <h3 className="font-semibold text-[#0B1D3A]">Active Services</h3>
            <Link href="/hosting"><Button size="sm">+ Add Service</Button></Link>
          </div>
          {services.map(s=>(
            <div key={s.name} className="flex items-center justify-between py-3 border-b border-slate-100 last:border-none">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-[#EAF6FD] flex items-center justify-center">{s.icon}</div>
                <div>
                  <div className="text-sm font-medium text-[#0B1D3A]">{s.name}</div>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <span className={`w-1.5 h-1.5 rounded-full inline-block ${s.active?'bg-emerald-500':'bg-amber-400'}`}/>
                    <span className="text-xs text-slate-400">{s.sub}</span>
                  </div>
                </div>
              </div>
              <Button size="sm" variant="outline">Manage</Button>
            </div>
          ))}
        </div>
        <div className="bg-white border border-slate-200 rounded-2xl p-6">
          <div className="flex justify-between items-center mb-5">
            <h3 className="font-semibold text-[#0B1D3A]">Notifications</h3>
            <Link href="/dashboard/notifications"><Button size="sm" variant="ghost">All</Button></Link>
          </div>
          {notifs.map(n=>(
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
