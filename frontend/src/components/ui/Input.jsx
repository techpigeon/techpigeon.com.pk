'use client';
export default function Input({label,error,hint,icon,id,className='',onChange,...props}) {
  const uid=id||label?.toLowerCase().replace(/\s+/g,'-');
  const handleChange = typeof onChange==='function'?(e=>onChange(e.target.value)):onChange;
  return (
    <div className="mb-4">
      {label&&<label htmlFor={uid} className="block text-sm font-semibold text-slate-700 mb-1.5">{label}</label>}
      <div className="relative">
        {icon&&<span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400">{icon}</span>}
        <input id={uid} onChange={handleChange}
          className={`w-full px-4 py-3 border-2 rounded-xl text-sm text-[#0B1D3A] bg-white outline-none transition-all focus:border-[#00A8E8] focus:ring-4 focus:ring-[#00A8E8]/10 ${error?'border-red-400 bg-red-50':'border-slate-200 hover:border-slate-300'} ${icon?'pl-10':''} ${className}`}
          {...props}/>
      </div>
      {hint&&!error&&<p className="text-xs text-slate-400 mt-1">{hint}</p>}
      {error&&<p className="text-xs text-red-500 mt-1">⚠ {error}</p>}
    </div>
  );
}
