'use client';
export const dynamic = 'force-dynamic';
import { useState } from 'react';
import Button from '../../../../components/ui/Button';
import Badge from '../../../../components/ui/Badge';
import Modal from '../../../../components/ui/Modal';
import Input from '../../../../components/ui/Input';
import Alert from '../../../../components/ui/Alert';

// ─── Mock data matching DB schema ─────────────────────────────────
const DOMAINS = [
  { id: 'd1', domain_name: 'techpigeon', tld: '.org', full_domain: 'techpigeon.org', status: 'active', registered_at: '2023-12-15', expires_at: '2025-12-15', auto_renew: true, whois_privacy: true, lock_status: true, nameservers: ['ns1.techpigeon.org', 'ns2.techpigeon.org'], price_pkr: 2999, renewal_pkr: 2999 },
  { id: 'd2', domain_name: 'mybusiness', tld: '.pk', full_domain: 'mybusiness.pk', status: 'active', registered_at: '2024-03-01', expires_at: '2026-03-01', auto_renew: true, whois_privacy: false, lock_status: true, nameservers: ['ns1.techpigeon.org', 'ns2.techpigeon.org'], price_pkr: 1099, renewal_pkr: 1099 },
  { id: 'd3', domain_name: 'alistore', tld: '.com.pk', full_domain: 'alistore.com.pk', status: 'expired', registered_at: '2022-06-20', expires_at: '2024-06-20', auto_renew: false, whois_privacy: true, lock_status: false, nameservers: ['ns1.techpigeon.org', 'ns2.techpigeon.org'], price_pkr: 999, renewal_pkr: 999 },
  { id: 'd4', domain_name: 'cloudpak', tld: '.com', full_domain: 'cloudpak.com', status: 'pending', registered_at: '2025-01-10', expires_at: '2026-01-10', auto_renew: true, whois_privacy: true, lock_status: false, nameservers: [], price_pkr: 3499, renewal_pkr: 3499 },
];

const STATUS_MAP = {
  active:      { variant: 'green',  label: 'Active' },
  expired:     { variant: 'red',    label: 'Expired' },
  pending:     { variant: 'yellow', label: 'Pending' },
  transferred: { variant: 'blue',   label: 'Transferred' },
  cancelled:   { variant: 'gray',   label: 'Cancelled' },
  suspended:   { variant: 'red',    label: 'Suspended' },
};

function daysUntil(dateStr) {
  const diff = new Date(dateStr) - new Date();
  return Math.ceil(diff / (1000 * 60 * 60 * 24));
}

function ToggleSwitch({ enabled, onToggle, label }) {
  return (
    <div className="flex items-center justify-between py-2">
      <span className="text-sm text-slate-600">{label}</span>
      <button
        onClick={onToggle}
        className={`relative w-11 h-6 rounded-full transition-colors duration-200 border-none cursor-pointer ${enabled ? 'bg-[#5cc4eb]' : 'bg-slate-300'}`}
      >
        <span className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform duration-200 ${enabled ? 'translate-x-5' : ''}`} />
      </button>
    </div>
  );
}

function DNSModal({ domain, open, onClose }) {
  const [records, setRecords] = useState([
    { type: 'A', name: '@', value: '185.199.108.153', ttl: 3600 },
    { type: 'CNAME', name: 'www', value: domain?.full_domain || '', ttl: 3600 },
    { type: 'MX', name: '@', value: 'mail.' + (domain?.full_domain || ''), ttl: 3600 },
    { type: 'TXT', name: '@', value: 'v=spf1 include:_spf.google.com ~all', ttl: 3600 },
  ]);

  if (!domain) return null;

  return (
    <Modal open={open} onClose={onClose} title={`DNS Records — ${domain.full_domain}`} width={680}>
      <div className="space-y-3 mb-6">
        <div className="bg-slate-50 rounded border border-slate-200 overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-200">
                {['Type', 'Name', 'Value', 'TTL'].map(h => (
                  <th key={h} className="px-4 py-2.5 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {records.map((r, i) => (
                <tr key={i} className="border-b border-slate-100 last:border-none bg-white">
                  <td className="px-4 py-3"><Badge variant="blue">{r.type}</Badge></td>
                  <td className="px-4 py-3 text-slate-700 font-mono text-xs">{r.name}</td>
                  <td className="px-4 py-3 text-slate-700 font-mono text-xs max-w-[200px] truncate">{r.value}</td>
                  <td className="px-4 py-3 text-slate-400 text-xs">{r.ttl}s</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="border-t border-slate-100 pt-4">
        <h4 className="text-sm font-semibold text-[#bba442] mb-3">Add DNS Record</h4>
        <div className="grid grid-cols-4 gap-3">
          <div>
            <label className="block text-xs font-semibold text-slate-500 mb-1">Type</label>
            <select className="w-full px-3 py-2 border-2 border-slate-200 rounded text-sm bg-white outline-none focus:border-[#5cc4eb]">
              {['A', 'AAAA', 'CNAME', 'MX', 'TXT', 'NS', 'SRV'].map(t => <option key={t}>{t}</option>)}
            </select>
          </div>
          <Input label="Name" placeholder="@" className="!mb-0" />
          <Input label="Value" placeholder="IP or hostname" className="!mb-0" />
          <div className="flex items-end">
            <Button size="sm" full>Add Record</Button>
          </div>
        </div>
      </div>

      <div className="border-t border-slate-100 pt-4 mt-4">
        <h4 className="text-sm font-semibold text-[#bba442] mb-3">Nameservers</h4>
        <div className="grid grid-cols-2 gap-3">
          {(domain.nameservers?.length ? domain.nameservers : ['ns1.techpigeon.org', 'ns2.techpigeon.org']).map((ns, i) => (
            <div key={i} className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded px-4 py-2.5">
              <span className="text-xs font-bold text-slate-400">NS{i + 1}</span>
              <span className="text-sm text-[#1d1d1d] font-mono">{ns}</span>
            </div>
          ))}
        </div>
      </div>
    </Modal>
  );
}

function ManageModal({ domain, open, onClose }) {
  const [autoRenew, setAutoRenew] = useState(domain?.auto_renew ?? true);
  const [whoisPrivacy, setWhoisPrivacy] = useState(domain?.whois_privacy ?? true);
  const [lockStatus, setLockStatus] = useState(domain?.lock_status ?? true);

  if (!domain) return null;

  const days = daysUntil(domain.expires_at);
  const st = STATUS_MAP[domain.status] || STATUS_MAP.pending;

  return (
    <Modal open={open} onClose={onClose} title={`Manage — ${domain.full_domain}`} width={520}>
      {/* Status & Expiry */}
      <div className="flex items-center gap-3 mb-5 p-4 rounded-xl bg-slate-50 border border-slate-200">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <span style={{ fontFamily: "'Aleo',serif" }} className="text-xl text-[#bba442]">{domain.full_domain}</span>
            <Badge variant={st.variant}>{st.label}</Badge>
          </div>
          <p className="text-xs text-slate-400">
            Registered {new Date(domain.registered_at).toLocaleDateString('en-PK', { year: 'numeric', month: 'short', day: 'numeric' })}
          </p>
        </div>
        <div className="text-right">
          <div className="text-sm font-semibold text-[#1d1d1d]">{days > 0 ? `${days} days left` : 'Expired'}</div>
          <div className="text-xs text-slate-400">Expires {new Date(domain.expires_at).toLocaleDateString('en-PK', { year: 'numeric', month: 'short', day: 'numeric' })}</div>
        </div>
      </div>

      {domain.status === 'expired' && (
        <Alert type="error">This domain has expired. Renew it to avoid losing ownership.</Alert>
      )}
      {days > 0 && days <= 60 && domain.status === 'active' && (
        <Alert type="warning">This domain expires in {days} days. Consider enabling auto-renew.</Alert>
      )}

      {/* Toggles */}
      <div className="border border-slate-200 rounded-xl p-4 mb-5 divide-y divide-slate-100">
        <ToggleSwitch label="Auto Renew" enabled={autoRenew} onToggle={() => setAutoRenew(!autoRenew)} />
        <ToggleSwitch label="WHOIS Privacy" enabled={whoisPrivacy} onToggle={() => setWhoisPrivacy(!whoisPrivacy)} />
        <ToggleSwitch label="Domain Lock (Transfer Protection)" enabled={lockStatus} onToggle={() => setLockStatus(!lockStatus)} />
      </div>

      {/* Renewal Pricing */}
      <div className="flex items-center justify-between p-4 rounded-xl bg-[#e8f6fc] border border-blue-100 mb-5">
        <div>
          <div className="text-sm font-semibold text-[#1d1d1d]">Renewal Price</div>
          <div className="text-xs text-slate-500">Billed annually</div>
        </div>
        <div style={{ fontFamily: "'Aleo',serif" }} className="text-2xl text-[#bba442]">
          Rs.{(domain.renewal_pkr || domain.price_pkr).toLocaleString()}<span className="text-xs text-slate-400 font-sans">/yr</span>
        </div>
      </div>

      <div className="flex gap-3">
        <Button full variant="primary">Renew Now</Button>
        <Button full variant="outline" onClick={onClose}>Cancel</Button>
      </div>
    </Modal>
  );
}

export default function DomainsPage() {
  const [filter, setFilter] = useState('all');
  const [dnsModal, setDnsModal] = useState(null);
  const [manageModal, setManageModal] = useState(null);

  const filtered = filter === 'all' ? DOMAINS : DOMAINS.filter(d => d.status === filter);

  return (
    <div>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 style={{ fontFamily: "'Aleo',serif" }} className="text-2xl text-[#bba442]">My Domains</h1>
          <p className="text-sm text-slate-500 mt-1">{DOMAINS.length} domains registered</p>
        </div>
        <Button size="sm">+ Register New Domain</Button>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {[
          { label: 'Total Domains', value: String(DOMAINS.length), icon: '🌐', color: '#5cc4eb' },
          { label: 'Active', value: String(DOMAINS.filter(d => d.status === 'active').length), icon: '✓', color: '#10B981' },
          { label: 'Expiring Soon', value: String(DOMAINS.filter(d => { const days = daysUntil(d.expires_at); return days > 0 && days <= 60; }).length), icon: '⏳', color: '#F59E0B' },
          { label: 'Expired', value: String(DOMAINS.filter(d => d.status === 'expired').length), icon: '✗', color: '#EF4444' },
        ].map(s => (
          <div key={s.label} className="bg-white border border-slate-200 rounded-2xl p-5 relative overflow-hidden hover:shadow-md transition-shadow">
            <div className="absolute top-4 right-4 w-11 h-11 rounded flex items-center justify-center text-xl" style={{ background: s.color + '18' }}>{s.icon}</div>
            <p className="text-xs font-medium text-slate-400 mb-2">{s.label}</p>
            <p className="text-3xl font-bold text-[#bba442]" style={{ fontFamily: "'Aleo',serif" }}>{s.value}</p>
          </div>
        ))}
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2 mb-5 flex-wrap">
        {['all', 'active', 'expired', 'pending'].map(f => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-1.5 rounded-full border text-xs font-semibold cursor-pointer transition-all capitalize ${filter === f ? 'bg-[#e8f6fc] border-[#5cc4eb] text-[#5cc4eb]' : 'bg-white border-slate-200 text-slate-500 hover:border-slate-300'}`}
          >
            {f === 'all' ? `All (${DOMAINS.length})` : `${f} (${DOMAINS.filter(d => d.status === f).length})`}
          </button>
        ))}
      </div>

      {/* Domains Table */}
      <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-sm">
            <thead className="bg-slate-50">
              <tr>
                {['Domain', 'Status', 'Expires', 'Auto-Renew', 'WHOIS', 'Price', 'Actions'].map(h => (
                  <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider border-b border-slate-200 whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 && (
                <tr><td colSpan={7} className="px-4 py-8 text-center text-slate-400">No domains found.</td></tr>
              )}
              {filtered.map(d => {
                const days = daysUntil(d.expires_at);
                const st = STATUS_MAP[d.status] || STATUS_MAP.pending;
                return (
                  <tr key={d.id} className="border-b border-slate-100 last:border-none hover:bg-slate-50/50 transition-colors">
                    <td className="px-4 py-3.5">
                      <div className="font-semibold text-[#1d1d1d]">{d.full_domain}</div>
                      <div className="text-xs text-slate-400 mt-0.5">Registered {new Date(d.registered_at).toLocaleDateString('en-PK', { month: 'short', year: 'numeric' })}</div>
                    </td>
                    <td className="px-4 py-3.5"><Badge variant={st.variant}>{st.label}</Badge></td>
                    <td className="px-4 py-3.5">
                      <div className="text-sm text-[#1d1d1d]">{new Date(d.expires_at).toLocaleDateString('en-PK', { year: 'numeric', month: 'short', day: 'numeric' })}</div>
                      <div className={`text-xs mt-0.5 ${days <= 0 ? 'text-red-500 font-semibold' : days <= 60 ? 'text-amber-600' : 'text-slate-400'}`}>
                        {days <= 0 ? 'Expired' : `${days} days left`}
                      </div>
                    </td>
                    <td className="px-4 py-3.5">
                      <span className={`inline-flex items-center gap-1 text-xs font-semibold ${d.auto_renew ? 'text-emerald-600' : 'text-slate-400'}`}>
                        <span className={`w-2 h-2 rounded-full ${d.auto_renew ? 'bg-emerald-500' : 'bg-slate-300'}`} />
                        {d.auto_renew ? 'On' : 'Off'}
                      </span>
                    </td>
                    <td className="px-4 py-3.5">
                      <span className={`inline-flex items-center gap-1 text-xs font-semibold ${d.whois_privacy ? 'text-emerald-600' : 'text-slate-400'}`}>
                        {d.whois_privacy ? '🔒 Protected' : '🔓 Public'}
                      </span>
                    </td>
                    <td className="px-4 py-3.5">
                      <div style={{ fontFamily: "'Aleo',serif" }} className="text-base text-[#bba442]">Rs.{d.price_pkr.toLocaleString()}</div>
                      <div className="text-xs text-slate-400">/year</div>
                    </td>
                    <td className="px-4 py-3.5">
                      <div className="flex items-center gap-2">
                        <Button size="sm" variant="outline" onClick={() => setDnsModal(d)}>DNS</Button>
                        <Button size="sm" onClick={() => setManageModal(d)}>Manage</Button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modals */}
      <DNSModal domain={dnsModal} open={!!dnsModal} onClose={() => setDnsModal(null)} />
      <ManageModal domain={manageModal} open={!!manageModal} onClose={() => setManageModal(null)} />
    </div>
  );
}
