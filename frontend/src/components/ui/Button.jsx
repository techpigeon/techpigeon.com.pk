'use client';
const base='inline-flex items-center justify-center gap-2 font-semibold rounded-xl border-none cursor-pointer transition-all duration-200';
const sizes={sm:'px-4 py-2 text-xs',md:'px-5 py-2.5 text-sm',lg:'px-7 py-3.5 text-base'};
const variants={
  primary:'bg-[#00A8E8] hover:bg-[#0077B6] text-white shadow-lg hover:shadow-xl hover:-translate-y-0.5',
  outline:'border-2 border-[#00A8E8] text-[#00A8E8] hover:bg-[#EAF6FD] bg-transparent',
  navy:'bg-[#0B1D3A] hover:bg-[#1E3A5F] text-white shadow-md',
  ghost:'bg-transparent hover:bg-slate-100 text-slate-500',
  white:'bg-white hover:bg-[#EAF6FD] text-[#00A8E8] shadow-md',
  danger:'bg-red-500 hover:bg-red-600 text-white',
  success:'bg-emerald-500 hover:bg-emerald-600 text-white',
  teal:'bg-[#00C8B4] hover:bg-teal-600 text-white',
};
export default function Button({variant='primary',size='md',full=false,loading,className='',children,...props}) {
  return (
    <button className={`${base} ${sizes[size]} ${variants[variant]} ${full?'w-full':''} ${loading||props.disabled?'opacity-60 cursor-not-allowed':''} ${className}`}
      disabled={loading||props.disabled} {...props}>
      {loading?<><span className="animate-spin w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full inline-block"/>{children}</>:children}
    </button>
  );
}
