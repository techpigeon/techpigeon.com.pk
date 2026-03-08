'use client';
import { ReactNode, useEffect } from 'react';
export default function Modal({open,onClose,title,children,width=520}:{open:boolean;onClose:()=>void;title:string;children:ReactNode;width?:number}){
  useEffect(()=>{document.body.style.overflow=open?'hidden':'';return()=>{document.body.style.overflow='';};},[open]);
  if(!open)return null;
  return(
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50"
      onClick={e=>{if(e.target===e.currentTarget)onClose();}}>
      <div className="bg-white rounded-2xl shadow-2xl overflow-y-auto w-full" style={{maxWidth:width,maxHeight:'90vh'}}>
        <div className="flex items-center justify-between px-6 pt-6 pb-4 border-b border-slate-100 sticky top-0 bg-white z-10">
          <h3 className="text-xl font-bold text-[#bba442]" style={{fontFamily:"'Aleo',serif"}}>{title}</h3>
          <button onClick={onClose} className="w-8 h-8 rounded-lg bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-sm text-slate-500 border-none cursor-pointer">✕</button>
        </div>
        <div className="p-6">{children}</div>
      </div>
    </div>
  );
}
