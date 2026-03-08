import { ReactNode } from 'react';
type T='info'|'success'|'error'|'warning';
const s:Record<T,string>={
  info:'bg-[#e8f6fc] border-blue-200 text-[#3ba8d4]',
  success:'bg-emerald-50 border-emerald-200 text-emerald-800',
  error:'bg-red-50 border-red-200 text-red-800',
  warning:'bg-amber-50 border-amber-200 text-amber-800',
};
export default function Alert({type='info',children}:{type?:T;children:ReactNode}){
  return <div className={`flex items-start gap-2 p-3 rounded border text-sm mb-4 ${s[type as T]}`}><div>{children}</div></div>;
}
