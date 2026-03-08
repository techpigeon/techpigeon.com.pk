export default function StatCard({label,value,sub,icon,color='#5cc4eb'}:{label:string;value:string;sub?:string;icon:string;color?:string}){
  return(
    <div className="bg-white border border-slate-200 rounded-2xl p-5 relative overflow-hidden hover:shadow-md transition-shadow">
      <div className="absolute top-4 right-4 w-11 h-11 rounded flex items-center justify-center text-xl" style={{background:color+'18'}}>{icon}</div>
      <p className="text-xs font-medium text-slate-400 mb-2">{label}</p>
      <p className="text-3xl font-bold text-[#bba442] mb-1" style={{fontFamily:"'Aleo',serif"}}>{value}</p>
      {sub&&<p className="text-xs font-medium" style={{color}}>{sub}</p>}
    </div>
  );
}
