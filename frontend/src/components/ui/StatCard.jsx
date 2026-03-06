export default function StatCard({label,value,sub,icon,color='#00A8E8'}) {
  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-5 relative overflow-hidden">
      <div className="absolute top-4 right-4 w-11 h-11 rounded-xl flex items-center justify-center text-xl" style={{background:color+'18'}}>{icon}</div>
      <p className="text-xs font-medium text-slate-400 mb-2">{label}</p>
      <p className="text-3xl font-bold text-[#0B1D3A] mb-1" style={{fontFamily:"'DM Serif Display',serif"}}>{value}</p>
      {sub&&<p className="text-xs" style={{color}}>{sub}</p>}
    </div>
  );
}
