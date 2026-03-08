'use client';
import { ButtonHTMLAttributes, ReactNode } from 'react';
type Var = 'primary'|'outline'|'navy'|'ghost'|'white'|'danger'|'success'|'teal'|'gold';
type Sz  = 'sm'|'md'|'lg';
const V:Record<Var,string> = {
  primary:'bg-[#5cc4eb] hover:bg-[#3ba8d4] text-white shadow-lg shadow-[#5cc4eb]/20 hover:-translate-y-0.5',
  outline:'border-2 border-[#5cc4eb] text-[#5cc4eb] hover:bg-[#e8f6fc] bg-transparent',
  navy:'bg-[#0B1D3A] hover:bg-[#1E3A5F] text-white shadow-md',
  ghost:'bg-transparent hover:bg-slate-100 text-slate-500',
  white:'bg-white hover:bg-[#e8f6fc] text-[#5cc4eb] shadow-md',
  danger:'bg-[#F73730] hover:bg-red-600 text-white shadow-md',
  success:'bg-[#41D33E] hover:bg-emerald-600 text-white shadow-md',
  teal:'bg-[#00C8B4] hover:bg-teal-600 text-white shadow-md',
  gold:'bg-[#bba442] hover:bg-[#9a8735] text-white shadow-md',
};
const S:Record<Sz,string> = { sm:'px-4 py-2 text-xs', md:'px-5 py-2.5 text-sm', lg:'px-7 py-3.5 text-base' };
interface P extends ButtonHTMLAttributes<HTMLButtonElement> { variant?:Var; size?:Sz; full?:boolean; loading?:boolean; children:ReactNode; }
export default function Button({variant='primary',size='md',full=false,loading,className='',children,...props}:P){
  return(
    <button className={`inline-flex items-center justify-center gap-2 font-semibold rounded border-none cursor-pointer transition-all duration-200 ${V[variant]} ${S[size]} ${full?'w-full':''} ${loading||props.disabled?'opacity-60 cursor-not-allowed':''} ${className}`}
      disabled={loading||props.disabled} {...props}>
      {loading?<><span className="animate-spin w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full inline-block"/>{children}</>:children}
    </button>
  );
}
