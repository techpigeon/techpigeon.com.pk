'use client';
export default function Table({cols,rows,onRowClick,emptyText='No records found.'}) {
  return (
    <div className="overflow-x-auto rounded-xl border border-slate-200">
      <table className="w-full border-collapse text-sm">
        <thead className="bg-slate-50">
          <tr>{cols.map(c=><th key={c.key+c.label} className="px-4 py-3 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider border-b border-slate-200 whitespace-nowrap">{c.label}</th>)}</tr>
        </thead>
        <tbody>
          {rows.length===0&&<tr><td colSpan={cols.length} className="px-4 py-8 text-center text-slate-400">{emptyText}</td></tr>}
          {rows.map((row,i)=>(
            <tr key={i} onClick={()=>onRowClick?.(row)} className={`border-b border-slate-100 last:border-none transition-colors ${onRowClick?'cursor-pointer hover:bg-slate-50':''}`}>
              {cols.map((c,j)=><td key={j} className="px-4 py-3.5 text-slate-700 align-middle">{c.render?c.render(row[c.key],row):row[c.key]}</td>)}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
