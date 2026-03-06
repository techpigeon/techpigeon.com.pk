import StatCard from '@/components/ui/StatCard';
import Badge from '@/components/ui/Badge';
import Table from '@/components/ui/Table';
export default function AdminPage() {
  const orders=[
    {no:'TP-1050',user:'ali@example.com',  total:'Rs.8,399', status:'paid'},
    {no:'TP-1049',user:'sara@mail.com',    total:'Rs.3,599', status:'pending'},
    {no:'TP-1048',user:'john@pk.com',      total:'Rs.14,999',status:'paid'},
  ];
  return (
    <div>
      <div className="flex items-center gap-2 mb-6">
        <span className="bg-[#00A8E8] text-white text-xs font-bold px-2.5 py-1 rounded-full">ADMIN</span>
        <h1 className="text-2xl text-[#0B1D3A]" style={{fontFamily:"'DM Serif Display',serif"}}>Dashboard Overview</h1>
      </div>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard label="Total Clients"   value="12,483" sub="↑ 234 this month" icon="👥" color="#00A8E8"/>
        <StatCard label="Revenue (MTD)"   value="Rs.4.2M" sub="↑ 18%"          icon="💰" color="#10B981"/>
        <StatCard label="Active Domains"  value="48,291" sub="↑ 1,204 new"     icon="🌐" color="#00C8B4"/>
        <StatCard label="Open Tickets"    value="17"     sub="3 urgent"         icon="🎫" color="#F97316"/>
      </div>
      <div className="bg-white border border-slate-200 rounded-2xl p-6">
        <h3 className="font-semibold text-[#0B1D3A] mb-4">Recent Orders</h3>
        <Table
          cols={[
            {key:'no',    label:'Order #'},
            {key:'user',  label:'User'},
            {key:'total', label:'Amount'},
            {key:'status',label:'Status',render:v=><Badge variant={v==='paid'?'green':'yellow'}>{v}</Badge>},
          ]}
          rows={orders}
        />
      </div>
    </div>
  );
}
