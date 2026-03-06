import { ReactNode } from 'react';
type T='info'|'success'|'error'|'warning';
const s:Record<T,string>={
  info:'bg-[#EAF6FD] border-blue-200 text-[#0077B6]',
  success:'bg-emerald-50 border-emerald-200 text-emerald-800',
  error:'bg-red-50 border-red-200 text-red-800',
  warning:'bg-amber-50 border-amber-200 text-amber-800',
};
export default function Alert({type='info',children}:{type?:T;children:ReactNode}){
  return <div className={`flex items-start gap-2 p-3 rounded-xl border text-sm mb-4 ${s[type as T]}`}><div>{children}</div></div>;
}
