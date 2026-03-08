import { ReactNode } from 'react';
type V='blue'|'green'|'red'|'yellow'|'gray'|'teal'|'purple';
const s:Record<V,string>={
  blue:'bg-[#e8f6fc] text-[#3ba8d4]',green:'bg-emerald-50 text-emerald-700',
  red:'bg-red-50 text-red-600',yellow:'bg-amber-50 text-amber-700',
  gray:'bg-slate-100 text-slate-500',teal:'bg-teal-50 text-teal-700',purple:'bg-purple-50 text-purple-700',
};
export default function Badge({children,variant='blue',className=''}:{children:ReactNode;variant?:V;className?:string}){
  return <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${s[variant as V]} ${className}`}>{children}</span>;
}
