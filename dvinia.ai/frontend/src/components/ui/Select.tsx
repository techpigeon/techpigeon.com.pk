'use client';
export default function Select({label,value,onChange,options,className=''}:{label?:string;value:string;onChange:(v:string)=>void;options:{value:string;label:string}[];className?:string}){
  return(
    <div className={`mb-4 ${className}`}>
      {label&&<label className="block text-sm font-semibold text-slate-700 mb-1.5">{label}</label>}
      <select value={value} onChange={e=>onChange(e.target.value)} className="w-full px-4 py-3 border-2 border-slate-200 rounded text-sm text-[#1d1d1d] bg-white outline-none focus:border-[#5cc4eb] transition-all">
        {options.map(o=><option key={o.value} value={o.value}>{o.label}</option>)}
      </select>
    </div>
  );
}
