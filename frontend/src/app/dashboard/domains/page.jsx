'use client';
export const dynamic = 'force-dynamic';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import Alert from '@/components/ui/Alert';
import { domainsApi } from '@/lib/api';

const STATUS_MAP = {
  active: { variant: 'green', label: 'Active' },
  pending: { variant: 'yellow', label: 'Pending Approval' },
  expired: { variant: 'red', label: 'Expired' },
  transferred: { variant: 'blue', label: 'Transferred' },
  cancelled: { variant: 'gray', label: 'Cancelled' },
  suspended: { variant: 'red', label: 'Suspended' },
};

export default function DomainsPage() {
  const [domains, setDomains] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState('');
  const [filter, setFilter] = useState('all');

  const load = async () => {
    setLoading(true);
    setErr('');
    try {
      const { data } = await domainsApi.list();
      setDomains(data.domains || []);
    } catch (e) {
      setErr(e.response?.data?.error || 'Failed to load domains.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const filtered = useMemo(() => filter === 'all' ? domains : domains.filter(d => d.status === filter), [domains, filter]);

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 style={{ fontFamily: "'Aleo',serif" }} className="text-2xl text-[#bba442]">My Domains</h1>
          <p className="text-sm text-slate-500 mt-1">Pending approvals become active after admin payment verification.</p>
        </div>
        <Link href="/domains"><Button size="sm">+ Register New Domain</Button></Link>
      </div>

      {err && <Alert type="error">{err}</Alert>}

      <div className="flex gap-2 mb-5 flex-wrap">
        {['all', 'active', 'pending', 'expired'].map(f => (
          <button key={f} onClick={() => setFilter(f)} className={`px-4 py-1.5 rounded-full border text-xs font-semibold cursor-pointer transition-all capitalize ${filter === f ? 'bg-[#e8f6fc] border-[#5cc4eb] text-[#5cc4eb]' : 'bg-white border-slate-200 text-slate-500 hover:border-slate-300'}`}>
            {f === 'all' ? `All (${domains.length})` : `${f} (${domains.filter(d => d.status === f).length})`}
          </button>
        ))}
        <Button size="sm" variant="outline" onClick={load}>Refresh</Button>
      </div>

      <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-slate-50">
              <tr>
                {['Domain', 'Status', 'Registered', 'Expires', 'Price', 'Auto Renew'].map(h => (
                  <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-slate-400 uppercase border-b border-slate-200">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loading && <tr><td colSpan={6} className="px-4 py-8 text-center text-slate-400">Loading domains...</td></tr>}
              {!loading && filtered.length === 0 && <tr><td colSpan={6} className="px-4 py-8 text-center text-slate-400">No domains found.</td></tr>}
              {!loading && filtered.map(d => {
                const st = STATUS_MAP[d.status] || STATUS_MAP.pending;
                return (
                  <tr key={d.id} className="border-b border-slate-100">
                    <td className="px-4 py-3.5 font-semibold text-[#1d1d1d]">{d.full_domain || `${d.domain_name}${d.tld}`}</td>
                    <td className="px-4 py-3.5"><Badge variant={st.variant}>{st.label}</Badge></td>
                    <td className="px-4 py-3.5 text-slate-500 text-xs">{d.registered_at ? new Date(d.registered_at).toLocaleDateString('en-PK') : '-'}</td>
                    <td className="px-4 py-3.5 text-slate-500 text-xs">{d.expires_at ? new Date(d.expires_at).toLocaleDateString('en-PK') : '-'}</td>
                    <td className="px-4 py-3.5 font-semibold">Rs.{Number(d.price_pkr || 0).toLocaleString('en-PK')}</td>
                    <td className="px-4 py-3.5 text-xs font-semibold text-slate-600">{d.auto_renew ? 'On' : 'Off'}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
