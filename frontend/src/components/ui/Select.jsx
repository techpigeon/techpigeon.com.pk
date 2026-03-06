'use client';
export default function Select({label,value,onChange,options,className=''}) {
  const handleChange=typeof onChange==='function'?(e=>onChange(e.target.value)):onChange;
  return (
    <div className={`mb-4 ${className}`}>
      {label&&<label className="block text-sm font-semibold text-slate-700 mb-1.5">{label}</label>}
      <select value={value} onChange={handleChange} className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl text-sm text-[#0B1D3A] bg-white outline-none focus:border-[#00A8E8] transition-all">
        {options.map(o=><option key={o.value} value={o.value}>{o.label}</option>)}
      </select>
    </div>
  );
}
