'use client';
import {useState} from 'react';
import Modal from '../ui/Modal';
import Button from '../ui/Button';
import Input from '../ui/Input';
import Alert from '../ui/Alert';
const METHODS=[{id:'jazzcash',name:'JazzCash',icon:'💳',desc:'Pay via JazzCash mobile wallet'},{id:'easypaisa',name:'EasyPaisa',icon:'📱',desc:'Pay via EasyPaisa wallet'},{id:'stripe',name:'Credit / Debit Card',icon:'💳',desc:'Visa, Mastercard via Stripe'},{id:'bank',name:'Bank Transfer',icon:'🏦',desc:'Direct bank transfer · 1–2 days'},{id:'sadapay',name:'SadaPay',icon:'💚',desc:'Pay with SadaPay digital account'}];
export default function PaymentModal({open,onClose,order,onSuccess}) {
  const [method,setMethod]=useState('jazzcash');const [mobile,setMobile]=useState('');const [txnRef,setTxnRef]=useState('');const [processing,setProcessing]=useState(false);const [done,setDone]=useState(false);
  const pay=()=>{setProcessing(true);setTimeout(()=>{setProcessing(false);setDone(true);setTimeout(()=>{setDone(false);onSuccess?.();onClose();},2200);},2000);};
  return (
    <Modal open={open} onClose={onClose} title="Complete Payment" width={520}>
      {done?(
        <div className="text-center py-10"><div className="text-5xl mb-4">✅</div><h3 style={{fontFamily:"'Aleo',serif"}} className="text-2xl text-[#bba442] mb-2">Payment Successful!</h3><p className="text-slate-500">Your order is confirmed. Services activating shortly...</p></div>
      ):(
        <>
          <div className="bg-[#e8f6fc] border border-[#5cc4eb]/20 rounded px-4 py-3 mb-5 flex justify-between items-center">
            <div><div className="text-xs text-slate-500">Order Total</div>{order?.no&&<div className="text-xs text-slate-400">Ref: {order.no}</div>}</div>
            <div style={{fontFamily:"'Aleo',serif"}} className="text-2xl text-[#bba442]">Rs.{(order?.total||0).toLocaleString()}</div>
          </div>
          <p className="text-sm font-semibold text-slate-700 mb-3">Select Payment Method</p>
          <div className="flex flex-col gap-2.5 mb-5">
            {METHODS.map(m=>(
              <div key={m.id} onClick={()=>setMethod(m.id)} className={`flex items-center gap-3.5 p-3.5 rounded border-2 cursor-pointer transition-all ${method===m.id?'border-[#5cc4eb] bg-[#e8f6fc]':'border-slate-200 bg-white hover:border-slate-300'}`}>
                <span className="text-2xl">{m.icon}</span>
                <div className="flex-1"><div className="font-semibold text-sm text-[#1d1d1d]">{m.name}</div><div className="text-xs text-slate-400">{m.desc}</div></div>
                <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${method===m.id?'border-[#5cc4eb] bg-[#5cc4eb]':'border-slate-300 bg-white'}`}>
                  {method===m.id&&<div className="w-2 h-2 rounded-full bg-white"/>}
                </div>
              </div>
            ))}
          </div>
          {(method==='jazzcash'||method==='easypaisa')&&<Input label="Mobile Number" value={mobile} onChange={setMobile} placeholder="+92 300 0000000" icon="📱"/>}
          {method==='bank'&&<><Alert type="info"><div className="font-semibold mb-1">Bank Details:</div>TechPigeon (TSN Pakistan) · HBL<br/>Account: 0123456789 · IBAN: PK00HABB0000000123456789</Alert><Input label="Transaction Reference" value={txnRef} onChange={setTxnRef} placeholder="Your bank transaction ID"/></>}
          {method==='stripe'&&<Alert type="info">You will be redirected to Stripe's secure checkout.</Alert>}
          <Button full size="lg" loading={processing} onClick={pay}>{processing?'Processing...':`Pay Rs.${(order?.total||0).toLocaleString()} →`}</Button>
        </>
      )}
    </Modal>
  );
}
