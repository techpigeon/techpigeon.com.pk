'use client';
export const dynamic = 'force-dynamic';
import { useState } from 'react';
import Link from 'next/link';
import Button from '../../../../components/ui/Button';
import Badge from '../../../../components/ui/Badge';
import Modal from '../../../../components/ui/Modal';
import Alert from '../../../../components/ui/Alert';

// ─── Mock data matching hosting_subscriptions + hosting_plans schema ───
const SUBSCRIPTIONS = [
  {
    id: 'hs1',
    plan: { name: 'Pro', slug: 'pro', disk_gb: 50, bandwidth_gb: null, websites: 5, email_accounts: 25, databases: 10, ssl_free: true, cdn_included: true, ddos_protection: false, support_level: 'priority' },
    status: 'active',
    billing_cycle: 'monthly',
    domain: 'techpigeon.org',
    server_ip: '185.199.108.153',
    cpanel_username: 'techpgn',
    started_at: '2024-06-01',
    current_period_end: '2025-02-01',
    auto_renew: true,
    disk_used_gb: 18.4,
    bandwidth_used_gb: 42.7,
    uptime_percent: 99.98,
    price_monthly: 3599,
    price_annual: 2699,
  },
  {
    id: 'hs2',
    plan: { name: 'Starter', slug: 'starter', disk_gb: 10, bandwidth_gb: 100, websites: 1, email_accounts: 5, databases: 2, ssl_free: true, cdn_included: false, ddos_protection: false, support_level: 'standard' },
    status: 'active',
    billing_cycle: 'annual',
    domain: 'mybusiness.pk',
    server_ip: '185.199.109.42',
    cpanel_username: 'mybizpk',
    started_at: '2024-09-15',
    current_period_end: '2025-09-15',
    auto_renew: true,
    disk_used_gb: 3.2,
    bandwidth_used_gb: 28.5,
    uptime_percent: 99.95,
    price_monthly: 1399,
    price_annual: 1049,
  },
  {
    id: 'hs3',
    plan: { name: 'Starter', slug: 'starter', disk_gb: 10, bandwidth_gb: 100, websites: 1, email_accounts: 5, databases: 2, ssl_free: true, cdn_included: false, ddos_protection: false, support_level: 'standard' },
    status: 'suspended',
    billing_cycle: 'monthly',
    domain: 'oldsite.com',
    server_ip: '185.199.110.78',
    cpanel_username: 'oldscom',
    started_at: '2023-01-10',
    current_period_end: '2024-11-10',
    auto_renew: false,
    disk_used_gb: 7.8,
    bandwidth_used_gb: 0,
    uptime_percent: 0,
    price_monthly: 1399,
    price_annual: 1049,
  },
];

const STATUS_MAP = {
  active:    { variant: 'green',  label: 'Active',    dot: 'bg-emerald-500' },
  pending:   { variant: 'yellow', label: 'Pending',   dot: 'bg-amber-500' },
  suspended: { variant: 'red',    label: 'Suspended', dot: 'bg-red-500' },
  cancelled: { variant: 'gray',   label: 'Cancelled', dot: 'bg-slate-400' },
  expired:   { variant: 'red',    label: 'Expired',   dot: 'bg-red-500' },
};

function ProgressBar({ used, total, color = '#5cc4eb', label, unit = 'GB' }) {
  const pct = total ? Math.min((used / total) * 100, 100) : 0;
  const isUnlimited = !total;
  return (
    <div className="mb-3">
      <div className="flex justify-between text-xs mb-1.5">
        <span className="text-slate-500">{label}</span>
        <span className="font-semibold text-[#1d1d1d]">
          {used.toFixed(1)} {unit} {isUnlimited ? '(Unlimited)' : `/ ${total} ${unit}`}
        </span>
      </div>
      <div className="bg-slate-200 rounded-full h-2">
        <div
          className="h-2 rounded-full transition-all duration-500"
          style={{ width: isUnlimited ? '0%' : `${pct}%`, backgroundColor: pct > 85 ? '#EF4444' : pct > 65 ? '#F59E0B' : color }}
        />
      </div>
    </div>
  );
}

function ServerDetailModal({ sub, open, onClose }) {
  if (!sub) return null;
  const st = STATUS_MAP[sub.status] || STATUS_MAP.pending;

  return (
    <Modal open={open} onClose={onClose} title={`Server Details — ${sub.domain}`} width={560}>
      {/* Status Header */}
      <div className="flex items-center justify-between p-4 rounded-xl bg-slate-50 border border-slate-200 mb-5">
        <div className="flex items-center gap-3">
          <div className={`w-3 h-3 rounded-full ${st.dot} animate-pulse`} />
          <div>
            <div className="font-semibold text-[#1d1d1d]">{sub.plan.name} Plan</div>
            <div className="text-xs text-slate-400">{sub.billing_cycle === 'annual' ? 'Annual' : 'Monthly'} billing</div>
          </div>
        </div>
        <Badge variant={st.variant}>{st.label}</Badge>
      </div>

      {sub.status === 'suspended' && (
        <Alert type="error">This hosting account is suspended. Please clear any outstanding payments to reactivate.</Alert>
      )}

      {/* Server Info */}
      <div className="grid grid-cols-2 gap-3 mb-5">
        {[
          ['Server IP', sub.server_ip],
          ['cPanel User', sub.cpanel_username],
          ['Domain', sub.domain],
          ['Uptime', sub.uptime_percent + '%'],
          ['Started', new Date(sub.started_at).toLocaleDateString('en-PK', { year: 'numeric', month: 'short', day: 'numeric' })],
          ['Renews', new Date(sub.current_period_end).toLocaleDateString('en-PK', { year: 'numeric', month: 'short', day: 'numeric' })],
        ].map(([k, v]) => (
          <div key={k} className="bg-slate-50 rounded-xl p-3 border border-slate-100">
            <div className="text-xs text-slate-400 mb-0.5">{k}</div>
            <div className="text-sm font-semibold text-[#1d1d1d] font-mono">{v}</div>
          </div>
        ))}
      </div>

      {/* Resource Usage */}
      <div className="border border-slate-200 rounded-xl p-4 mb-5">
        <h4 className="text-sm font-semibold text-[#1d1d1d] mb-3">Resource Usage</h4>
        <ProgressBar used={sub.disk_used_gb} total={sub.plan.disk_gb} label="Disk Space" color="#5cc4eb" />
        <ProgressBar used={sub.bandwidth_used_gb} total={sub.plan.bandwidth_gb} label="Bandwidth" color="#00C8B4" />
      </div>

      {/* Plan Features */}
      <div className="border border-slate-200 rounded-xl p-4 mb-5">
        <h4 className="text-sm font-semibold text-[#1d1d1d] mb-3">Plan Features</h4>
        <div className="grid grid-cols-2 gap-2">
          {[
            [`${sub.plan.websites || '∞'} Website${sub.plan.websites !== 1 ? 's' : ''}`, true],
            [`${sub.plan.email_accounts || '∞'} Email Accounts`, true],
            [`${sub.plan.databases || '∞'} Databases`, true],
            ['Free SSL', sub.plan.ssl_free],
            ['CDN Included', sub.plan.cdn_included],
            ['DDoS Protection', sub.plan.ddos_protection],
          ].map(([label, enabled]) => (
            <div key={label} className="flex items-center gap-2 text-sm">
              <span className={enabled ? 'text-emerald-500' : 'text-slate-300'}>{enabled ? '✓' : '✗'}</span>
              <span className={enabled ? 'text-slate-700' : 'text-slate-400'}>{label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Pricing */}
      <div className="flex items-center justify-between p-4 rounded-xl bg-[#e8f6fc] border border-blue-100 mb-5">
        <div>
          <div className="text-sm font-semibold text-[#1d1d1d]">Current Plan</div>
          <div className="text-xs text-slate-500">{sub.plan.name} — {sub.billing_cycle}</div>
        </div>
        <div style={{ fontFamily: "'Aleo',serif" }} className="text-2xl text-[#bba442]">
          Rs.{(sub.billing_cycle === 'annual' ? sub.price_annual : sub.price_monthly).toLocaleString()}
          <span className="text-xs text-slate-400 font-sans">/mo</span>
        </div>
      </div>

      <div className="flex gap-3">
        <Button full variant="outline">Open cPanel</Button>
        <Button full>Upgrade Plan</Button>
      </div>
    </Modal>
  );
}

export default function HostingPage() {
  const [detailModal, setDetailModal] = useState(null);

  const active = SUBSCRIPTIONS.filter(s => s.status === 'active');
  const totalDisk = SUBSCRIPTIONS.reduce((a, s) => a + s.disk_used_gb, 0);

  return (
    <div>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 style={{ fontFamily: "'Aleo',serif" }} className="text-2xl text-[#bba442]">Hosting</h1>
          <p className="text-sm text-slate-500 mt-1">{SUBSCRIPTIONS.length} hosting subscriptions</p>
        </div>
        <Link href="/hosting"><Button size="sm">+ New Hosting Plan</Button></Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {[
          { label: 'Active Plans', value: String(active.length), icon: '☁️', color: '#5cc4eb' },
          { label: 'Avg Uptime', value: (active.reduce((a, s) => a + s.uptime_percent, 0) / (active.length || 1)).toFixed(2) + '%', icon: '▲', color: '#10B981' },
          { label: 'Total Disk Used', value: totalDisk.toFixed(1) + ' GB', icon: '💾', color: '#F59E0B' },
          { label: 'Next Renewal', value: 'Feb 1, 2025', icon: '📅', color: '#8B5CF6' },
        ].map(s => (
          <div key={s.label} className="bg-white border border-slate-200 rounded-2xl p-5 relative overflow-hidden hover:shadow-md transition-shadow">
            <div className="absolute top-4 right-4 w-11 h-11 rounded-xl flex items-center justify-center text-xl" style={{ background: s.color + '18' }}>{s.icon}</div>
            <p className="text-xs font-medium text-slate-400 mb-2">{s.label}</p>
            <p className="text-2xl font-bold text-[#bba442]" style={{ fontFamily: "'Aleo',serif" }}>{s.value}</p>
          </div>
        ))}
      </div>

      {/* Server Cards */}
      <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-5">
        {SUBSCRIPTIONS.map(sub => {
          const st = STATUS_MAP[sub.status] || STATUS_MAP.pending;
          const diskPct = sub.plan.disk_gb ? ((sub.disk_used_gb / sub.plan.disk_gb) * 100).toFixed(0) : 0;
          const bwPct = sub.plan.bandwidth_gb ? ((sub.bandwidth_used_gb / sub.plan.bandwidth_gb) * 100).toFixed(0) : 0;

          return (
            <div key={sub.id} className="bg-white border border-slate-200 rounded-2xl overflow-hidden hover:shadow-lg transition-all">
              {/* Card Header */}
              <div className={`px-5 py-4 flex items-center justify-between ${sub.status === 'active' ? 'bg-gradient-to-r from-[#0B1D3A] to-[#1E3A5F]' : 'bg-slate-100'}`}>
                <div className="flex items-center gap-3">
                  <div className={`w-2.5 h-2.5 rounded-full ${st.dot} ${sub.status === 'active' ? 'animate-pulse' : ''}`} />
                  <div>
                    <div className={`font-semibold text-sm ${sub.status === 'active' ? 'text-white' : 'text-[#1d1d1d]'}`}>{sub.plan.name} Plan</div>
                    <div className={`text-xs ${sub.status === 'active' ? 'text-white/50' : 'text-slate-400'}`}>{sub.domain}</div>
                  </div>
                </div>
                <Badge variant={st.variant}>{st.label}</Badge>
              </div>

              {/* Card Body */}
              <div className="p-5">
                {/* Server Info Row */}
                <div className="grid grid-cols-2 gap-3 mb-4">
                  <div className="bg-slate-50 rounded-lg p-2.5">
                    <div className="text-xs text-slate-400">Server IP</div>
                     <div className="text-xs font-semibold text-[#1d1d1d] font-mono">{sub.server_ip}</div>
                  </div>
                  <div className="bg-slate-50 rounded-lg p-2.5">
                    <div className="text-xs text-slate-400">Uptime</div>
                    <div className={`text-xs font-semibold ${sub.uptime_percent >= 99.9 ? 'text-emerald-600' : sub.uptime_percent > 0 ? 'text-amber-600' : 'text-slate-400'}`}>{sub.uptime_percent}%</div>
                  </div>
                </div>

                {/* Usage Bars */}
                <ProgressBar used={sub.disk_used_gb} total={sub.plan.disk_gb} label="Disk" color="#5cc4eb" />
                <ProgressBar used={sub.bandwidth_used_gb} total={sub.plan.bandwidth_gb} label="Bandwidth" color="#00C8B4" />

                {/* Feature Pills */}
                <div className="flex flex-wrap gap-1.5 mb-4">
                  {sub.plan.ssl_free && <span className="text-xs bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded-full font-medium">SSL</span>}
                  {sub.plan.cdn_included && <span className="text-xs bg-blue-50 text-blue-700 px-2 py-0.5 rounded-full font-medium">CDN</span>}
                  {sub.plan.ddos_protection && <span className="text-xs bg-purple-50 text-purple-700 px-2 py-0.5 rounded-full font-medium">DDoS</span>}
                  <span className="text-xs bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full font-medium">{sub.plan.websites || '∞'} site{sub.plan.websites !== 1 ? 's' : ''}</span>
                  <span className="text-xs bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full font-medium">{sub.plan.email_accounts || '∞'} emails</span>
                </div>

                {/* Pricing + Renewal */}
                <div className="flex items-center justify-between pt-3 border-t border-slate-100">
                  <div>
                    <div style={{ fontFamily: "'Aleo',serif" }} className="text-xl text-[#bba442]">
                      Rs.{(sub.billing_cycle === 'annual' ? sub.price_annual : sub.price_monthly).toLocaleString()}
                      <span className="text-xs text-slate-400 font-sans">/mo</span>
                    </div>
                    <div className="text-xs text-slate-400">
                      Renews {new Date(sub.current_period_end).toLocaleDateString('en-PK', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </div>
                  </div>
                  <Button size="sm" onClick={() => setDetailModal(sub)}>Manage</Button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <ServerDetailModal sub={detailModal} open={!!detailModal} onClose={() => setDetailModal(null)} />
    </div>
  );
}
