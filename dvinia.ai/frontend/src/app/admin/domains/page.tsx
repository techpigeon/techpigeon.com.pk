'use client';
export const dynamic = 'force-dynamic';
import { useState } from 'react';
import Button from '../../../components/ui/Button';
import Badge from '../../../components/ui/Badge';
import Modal from '../../../components/ui/Modal';

/* ─── Types ─────────────────────────────────────────────────────── */
interface DomainRecord {
  id: string;
  domain_name: string;
  tld: string;
  full_domain: string;
  owner_email: string;
  owner_name: string;
  status: 'active' | 'expired' | 'pending' | 'suspended';
  registered_at: string;
  expires_at: string;
  auto_renew: boolean;
  whois_privacy: boolean;
  domain_lock: boolean;
  price_pkr: number;
  nameservers: string[];
}

/* ─── Mock data (matches DB schema: domains table) ──────────────── */
const DOMAINS: DomainRecord[] = [
  {
    id: 'd1',
    domain_name: 'techpigeon',
    tld: '.org',
    full_domain: 'techpigeon.org',
    owner_email: 'admin@techpigeon.org',
    owner_name: 'Admin TechPigeon',
    status: 'active',
    registered_at: '2023-12-01T00:00:00Z',
    expires_at: '2026-12-01T00:00:00Z',
    auto_renew: true,
    whois_privacy: true,
    domain_lock: true,
    price_pkr: 2999,
    nameservers: ['ns1.techpigeon.org', 'ns2.techpigeon.org'],
  },
  {
    id: 'd2',
    domain_name: 'mybusiness',
    tld: '.pk',
    full_domain: 'mybusiness.pk',
    owner_email: 'ali@example.com',
    owner_name: 'Ali Khan',
    status: 'active',
    registered_at: '2024-03-20T00:00:00Z',
    expires_at: '2026-03-20T00:00:00Z',
    auto_renew: true,
    whois_privacy: false,
    domain_lock: true,
    price_pkr: 1099,
    nameservers: ['ns1.techpigeon.org', 'ns2.techpigeon.org'],
  },
  {
    id: 'd3',
    domain_name: 'cloudpak',
    tld: '.com',
    full_domain: 'cloudpak.com',
    owner_email: 'ali@example.com',
    owner_name: 'Ali Khan',
    status: 'pending',
    registered_at: '2025-01-28T00:00:00Z',
    expires_at: '2026-01-28T00:00:00Z',
    auto_renew: false,
    whois_privacy: false,
    domain_lock: false,
    price_pkr: 3499,
    nameservers: ['ns1.techpigeon.org', 'ns2.techpigeon.org'],
  },
  {
    id: 'd4',
    domain_name: 'fatimabiz',
    tld: '.com',
    full_domain: 'fatimabiz.com',
    owner_email: 'fatima@biz.pk',
    owner_name: 'Fatima Noor',
    status: 'active',
    registered_at: '2024-01-10T00:00:00Z',
    expires_at: '2026-05-01T00:00:00Z',
    auto_renew: true,
    whois_privacy: true,
    domain_lock: true,
    price_pkr: 3499,
    nameservers: ['ns1.techpigeon.org', 'ns2.techpigeon.org'],
  },
  {
    id: 'd5',
    domain_name: 'shopkarachi',
    tld: '.pk',
    full_domain: 'shopkarachi.pk',
    owner_email: 'fatima@biz.pk',
    owner_name: 'Fatima Noor',
    status: 'active',
    registered_at: '2024-06-15T00:00:00Z',
    expires_at: '2026-04-15T00:00:00Z',
    auto_renew: true,
    whois_privacy: false,
    domain_lock: false,
    price_pkr: 1099,
    nameservers: ['ns1.techpigeon.org', 'ns2.techpigeon.org'],
  },
  {
    id: 'd6',
    domain_name: 'devhouse',
    tld: '.com.pk',
    full_domain: 'devhouse.com.pk',
    owner_email: 'john@pk.com',
    owner_name: 'John Doe',
    status: 'expired',
    registered_at: '2023-08-10T00:00:00Z',
    expires_at: '2025-08-10T00:00:00Z',
    auto_renew: false,
    whois_privacy: false,
    domain_lock: false,
    price_pkr: 1599,
    nameservers: ['ns1.techpigeon.org', 'ns2.techpigeon.org'],
  },
  {
    id: 'd7',
    domain_name: 'ayeshacloud',
    tld: '.com',
    full_domain: 'ayeshacloud.com',
    owner_email: 'ayesha@cloud.pk',
    owner_name: 'Ayesha Malik',
    status: 'active',
    registered_at: '2024-08-01T00:00:00Z',
    expires_at: '2026-04-01T00:00:00Z',
    auto_renew: true,
    whois_privacy: true,
    domain_lock: true,
    price_pkr: 3499,
    nameservers: ['ns1.techpigeon.org', 'ns2.techpigeon.org'],
  },
  {
    id: 'd8',
    domain_name: 'hassandev',
    tld: '.pk',
    full_domain: 'hassandev.pk',
    owner_email: 'hassan@test.pk',
    owner_name: 'Hassan Raza',
    status: 'suspended',
    registered_at: '2024-04-12T00:00:00Z',
    expires_at: '2025-04-12T00:00:00Z',
    auto_renew: false,
    whois_privacy: false,
    domain_lock: true,
    price_pkr: 1099,
    nameservers: ['ns1.techpigeon.org', 'ns2.techpigeon.org'],
  },
  {
    id: 'd9',
    domain_name: 'saraportfolio',
    tld: '.com',
    full_domain: 'saraportfolio.com',
    owner_email: 'sara@mail.com',
    owner_name: 'Sara Ahmed',
    status: 'active',
    registered_at: '2024-06-20T00:00:00Z',
    expires_at: '2026-04-20T00:00:00Z',
    auto_renew: false,
    whois_privacy: true,
    domain_lock: false,
    price_pkr: 3499,
    nameservers: ['ns1.techpigeon.org', 'ns2.techpigeon.org'],
  },
  {
    id: 'd10',
    domain_name: 'pakmart',
    tld: '.com.pk',
    full_domain: 'pakmart.com.pk',
    owner_email: 'fatima@biz.pk',
    owner_name: 'Fatima Noor',
    status: 'active',
    registered_at: '2024-09-01T00:00:00Z',
    expires_at: '2025-09-01T00:00:00Z',
    auto_renew: true,
    whois_privacy: true,
    domain_lock: true,
    price_pkr: 1599,
    nameservers: ['ns1.techpigeon.org', 'ns2.techpigeon.org'],
  },
];

/* ─── Helpers ───────────────────────────────────────────────────── */
const STATUS_MAP: Record<string, { variant: string; label: string }> = {
  active:    { variant: 'green',  label: 'Active' },
  expired:   { variant: 'red',    label: 'Expired' },
  pending:   { variant: 'yellow', label: 'Pending' },
  suspended: { variant: 'gray',   label: 'Suspended' },
};

function daysUntil(dateStr: string): number {
  const diff = new Date(dateStr).getTime() - Date.now();
  return Math.ceil(diff / (1000 * 60 * 60 * 24));
}

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('en-PK', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

function isExpiringSoon(domain: DomainRecord): boolean {
  if (domain.status !== 'active') return false;
  const days = daysUntil(domain.expires_at);
  return days > 0 && days <= 60;
}

/* ─── Manage Domain Modal ───────────────────────────────────────── */
function ManageDomainModal({
  domain,
  open,
  onClose,
}: {
  domain: DomainRecord | null;
  open: boolean;
  onClose: () => void;
}) {
  const [status, setStatus] = useState<string>('');
  const [whois, setWhois] = useState(false);
  const [lock, setLock] = useState(false);
  const [saving, setSaving] = useState(false);
  const [renewing, setRenewing] = useState(false);

  // Sync local state when a new domain opens
  const [prevId, setPrevId] = useState<string | null>(null);
  if (domain && domain.id !== prevId) {
    setPrevId(domain.id);
    setStatus(domain.status);
    setWhois(domain.whois_privacy);
    setLock(domain.domain_lock);
  }

  if (!domain) return null;

  const days = daysUntil(domain.expires_at);
  const expiringSoon = domain.status === 'active' && days > 0 && days <= 60;
  const isExpired = days <= 0;

  return (
    <Modal open={open} onClose={onClose} title={`Manage Domain — ${domain.full_domain}`} width={580}>
      {/* Domain header card */}
      <div className="flex items-center justify-between p-4 rounded bg-slate-50 border border-slate-200 mb-5">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span
              style={{ fontFamily: "'Aleo',serif" }}
              className="text-xl text-[#bba442]"
            >
              {domain.full_domain}
            </span>
            <Badge variant={(STATUS_MAP[domain.status] || STATUS_MAP.active).variant}>
              {(STATUS_MAP[domain.status] || STATUS_MAP.active).label}
            </Badge>
          </div>
          <p className="text-xs text-slate-400">
            {domain.owner_name} &middot; {domain.owner_email}
          </p>
        </div>
        <div
          style={{ fontFamily: "'Aleo',serif" }}
          className="text-2xl text-[#bba442]"
        >
          Rs.{domain.price_pkr.toLocaleString()}
          <span className="text-xs text-slate-400 font-normal ml-1">/yr</span>
        </div>
      </div>

      {/* Domain details grid */}
      <div className="grid grid-cols-2 gap-3 mb-5">
        <div className="bg-slate-50 rounded p-3 border border-slate-100">
          <div className="text-xs text-slate-400">Registered</div>
          <div className="text-sm font-semibold text-[#1d1d1d]">{formatDate(domain.registered_at)}</div>
        </div>
        <div
          className={`rounded p-3 border ${
            expiringSoon
              ? 'bg-amber-50 border-amber-300'
              : isExpired
              ? 'bg-red-50 border-red-300'
              : 'bg-slate-50 border-slate-100'
          }`}
        >
          <div className="text-xs text-slate-400">Expires</div>
          <div className="text-sm font-semibold text-[#1d1d1d]">
            {formatDate(domain.expires_at)}
            {days > 0 ? (
              <span
                className={`ml-2 text-xs font-medium ${
                  expiringSoon ? 'text-amber-600' : 'text-slate-400'
                }`}
              >
                ({days}d left)
              </span>
            ) : (
              <span className="ml-2 text-xs font-medium text-red-600">
                (Expired {Math.abs(days)}d ago)
              </span>
            )}
          </div>
        </div>
        <div className="bg-slate-50 rounded p-3 border border-slate-100">
          <div className="text-xs text-slate-400">TLD</div>
          <div className="text-sm font-semibold text-[#1d1d1d]">{domain.tld}</div>
        </div>
        <div className="bg-slate-50 rounded p-3 border border-slate-100">
          <div className="text-xs text-slate-400">Auto-Renew</div>
          <div className="text-sm font-semibold text-[#1d1d1d]">
            {domain.auto_renew ? (
              <span className="text-emerald-600">Enabled</span>
            ) : (
              <span className="text-red-500">Disabled</span>
            )}
          </div>
        </div>
      </div>

      {/* Nameservers */}
      <div className="bg-[#e8f6fc] border border-blue-100 rounded p-4 mb-5">
        <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Nameservers</div>
        <div className="flex flex-col gap-1">
          {domain.nameservers.map((ns, i) => (
            <code key={i} className="text-xs text-[#1d1d1d] bg-white px-2 py-1 rounded border border-blue-100">
              {ns}
            </code>
          ))}
        </div>
      </div>

      {/* Owner info */}
      <div className="flex items-center gap-3 p-3 rounded bg-slate-50 border border-slate-200 mb-5">
        <div className="w-10 h-10 rounded-full bg-[#1d1d1d] text-white flex items-center justify-center text-sm font-bold flex-shrink-0">
          {domain.owner_name
            .split(' ')
            .map((w) => w[0])
            .join('')
            .slice(0, 2)}
        </div>
        <div>
          <div className="text-sm font-semibold text-[#1d1d1d]">{domain.owner_name}</div>
          <div className="text-xs text-slate-400">{domain.owner_email}</div>
        </div>
      </div>

      {/* Status change */}
      <div className="mb-5">
        <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">
          Change Status
        </label>
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="w-full px-3 py-2.5 border-2 border-slate-200 rounded text-sm text-[#1d1d1d] bg-white outline-none focus:border-[#5cc4eb] transition-all cursor-pointer"
        >
          <option value="active">Active</option>
          <option value="expired">Expired</option>
          <option value="pending">Pending</option>
          <option value="suspended">Suspended</option>
        </select>
      </div>

      {/* WHOIS toggle + Lock toggle */}
      <div className="grid grid-cols-2 gap-3 mb-5">
        <div className="flex items-center gap-3 p-3 rounded border border-slate-200">
          <input
            type="checkbox"
            checked={whois}
            onChange={(e) => setWhois(e.target.checked)}
            className="w-4 h-4 accent-[#5cc4eb]"
          />
          <div>
            <span className="text-sm text-[#1d1d1d]">WHOIS Privacy</span>
            <p className="text-[10px] text-slate-400">Hide owner info from public lookup</p>
          </div>
        </div>
        <div className="flex items-center gap-3 p-3 rounded border border-slate-200">
          <input
            type="checkbox"
            checked={lock}
            onChange={(e) => setLock(e.target.checked)}
            className="w-4 h-4 accent-[#5cc4eb]"
          />
          <div>
            <span className="text-sm text-[#1d1d1d]">Domain Lock</span>
            <p className="text-[10px] text-slate-400">Prevent unauthorized transfers</p>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-3">
        <Button
          full
          loading={saving}
          onClick={() => {
            setSaving(true);
            setTimeout(() => {
              setSaving(false);
              onClose();
            }, 600);
          }}
        >
          Save Changes
        </Button>
        <Button
          full
          variant="outline"
          loading={renewing}
          onClick={() => {
            setRenewing(true);
            setTimeout(() => {
              setRenewing(false);
            }, 800);
          }}
        >
          Renew (+1 Year)
        </Button>
        <Button full variant="ghost" onClick={onClose}>
          Cancel
        </Button>
      </div>
    </Modal>
  );
}

/* ─── Main Page ─────────────────────────────────────────────────── */
export default function DomainsPage() {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [manageModal, setManageModal] = useState<DomainRecord | null>(null);

  /* Computed stats */
  const totalDomains = DOMAINS.length;
  const activeDomains = DOMAINS.filter((d) => d.status === 'active').length;
  const expiringDomains = DOMAINS.filter((d) => isExpiringSoon(d)).length;
  const expiredDomains = DOMAINS.filter((d) => d.status === 'expired').length;

  /* Filtering */
  let filtered = DOMAINS;
  if (statusFilter !== 'all') {
    filtered = filtered.filter((d) => d.status === statusFilter);
  }
  if (search) {
    filtered = filtered.filter((d) =>
      `${d.full_domain} ${d.owner_email} ${d.owner_name}`
        .toLowerCase()
        .includes(search.toLowerCase())
    );
  }

  return (
    <div>
      {/* Admin Header */}
      <div className="flex items-center gap-3 mb-6">
        <span className="bg-[#5cc4eb] text-white text-xs font-bold px-2.5 py-1 rounded-full">
          ADMIN
        </span>
        <h1
          style={{ fontFamily: "'Aleo',serif" }}
          className="text-2xl text-[#bba442]"
        >
          Domains
        </h1>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {[
          {
            label: 'Total Domains',
            value: String(totalDomains),
            icon: '\uD83C\uDF10',
            color: '#5cc4eb',
          },
          {
            label: 'Active',
            value: String(activeDomains),
            icon: '\u2713',
            color: '#41D33E',
          },
          {
            label: 'Expiring (60d)',
            value: String(expiringDomains),
            icon: '\u23F3',
            color: '#F8D313',
          },
          {
            label: 'Expired',
            value: String(expiredDomains),
            icon: '\u2717',
            color: '#F73730',
          },
        ].map((s) => (
          <div
            key={s.label}
            className="bg-white border border-slate-200 rounded-2xl p-5 relative overflow-hidden hover:shadow-md transition-shadow"
          >
            <div
              className="absolute top-4 right-4 w-11 h-11 rounded flex items-center justify-center text-xl"
              style={{ background: s.color + '18' }}
            >
              {s.icon}
            </div>
            <p className="text-xs font-medium text-slate-400 mb-2">{s.label}</p>
            <p
              className="text-2xl font-bold text-[#bba442]"
              style={{ fontFamily: "'Aleo',serif" }}
            >
              {s.value}
            </p>
          </div>
        ))}
      </div>

      {/* Search & Status Filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-5">
        <div className="flex-1">
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by domain, owner email, or name..."
            className="w-full px-4 py-2.5 border-2 border-slate-200 rounded text-sm text-[#1d1d1d] bg-white outline-none focus:border-[#5cc4eb] transition-all"
          />
        </div>
        <div className="flex gap-2 flex-wrap">
          {['all', 'active', 'expired', 'pending', 'suspended'].map((s) => (
            <button
              key={s}
              onClick={() => setStatusFilter(s)}
              className={`px-4 py-1.5 rounded-full border text-xs font-semibold cursor-pointer transition-all capitalize ${
                statusFilter === s
                  ? 'bg-[#e8f6fc] border-[#5cc4eb] text-[#5cc4eb]'
                  : 'bg-white border-slate-200 text-slate-500 hover:border-slate-300'
              }`}
            >
              {s === 'all' ? `All (${totalDomains})` : s}
            </button>
          ))}
        </div>
      </div>

      {/* Domains Table */}
      <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-sm">
            <thead className="bg-slate-50">
              <tr>
                {[
                  'Domain',
                  'Owner',
                  'Status',
                  'Registered',
                  'Expires',
                  'Auto-Renew',
                  'Price/yr',
                  'Actions',
                ].map((h) => (
                  <th
                    key={h}
                    className="px-4 py-3 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider border-b border-slate-200 whitespace-nowrap"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 && (
                <tr>
                  <td
                    colSpan={8}
                    className="px-4 py-8 text-center text-slate-400"
                  >
                    No domains found.
                  </td>
                </tr>
              )}
              {filtered.map((d) => {
                const st = STATUS_MAP[d.status] || STATUS_MAP.active;
                const days = daysUntil(d.expires_at);
                const expiring = isExpiringSoon(d);

                return (
                  <tr
                    key={d.id}
                    className={`border-b border-slate-100 last:border-none hover:bg-slate-50/50 transition-colors ${
                      expiring ? 'border-l-4 !border-l-amber-400 bg-amber-50/30' : ''
                    }`}
                  >
                    {/* Domain */}
                    <td className="px-4 py-3.5">
                      <div className="flex items-center gap-2">
                        <span className="text-sm bg-slate-100 text-slate-500 w-8 h-8 flex items-center justify-center rounded flex-shrink-0">
                          {'\uD83C\uDF10'}
                        </span>
                        <div>
                          <div className="font-semibold text-[#1d1d1d]">
                            {d.full_domain}
                          </div>
                          <div className="text-[10px] text-slate-400">{d.tld}</div>
                        </div>
                      </div>
                    </td>

                    {/* Owner */}
                    <td className="px-4 py-3.5">
                      <div className="text-sm text-[#1d1d1d]">{d.owner_name}</div>
                      <div className="text-xs text-slate-400">{d.owner_email}</div>
                    </td>

                    {/* Status */}
                    <td className="px-4 py-3.5">
                      <Badge variant={st.variant}>{st.label}</Badge>
                    </td>

                    {/* Registered */}
                    <td className="px-4 py-3.5 text-xs text-slate-500">
                      {formatDate(d.registered_at)}
                    </td>

                    {/* Expires + countdown */}
                    <td className="px-4 py-3.5">
                      <div className="text-xs text-slate-500">
                        {formatDate(d.expires_at)}
                      </div>
                      {days > 0 ? (
                        <span
                          className={`text-[10px] font-semibold ${
                            expiring ? 'text-amber-600' : 'text-slate-400'
                          }`}
                        >
                          {days}d remaining
                        </span>
                      ) : (
                        <span className="text-[10px] font-semibold text-red-600">
                          Expired {Math.abs(days)}d ago
                        </span>
                      )}
                    </td>

                    {/* Auto-renew */}
                    <td className="px-4 py-3.5 text-center">
                      {d.auto_renew ? (
                        <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-600">
                          <span className="w-2 h-2 rounded-full bg-emerald-500" />
                          On
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-xs font-semibold text-slate-400">
                          <span className="w-2 h-2 rounded-full bg-slate-300" />
                          Off
                        </span>
                      )}
                    </td>

                    {/* Price */}
                    <td className="px-4 py-3.5 font-semibold text-[#1d1d1d] whitespace-nowrap">
                      Rs.{d.price_pkr.toLocaleString()}
                    </td>

                    {/* Actions */}
                    <td className="px-4 py-3.5">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setManageModal(d)}
                      >
                        Manage
                      </Button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Manage Domain Modal */}
      <ManageDomainModal
        domain={manageModal}
        open={!!manageModal}
        onClose={() => setManageModal(null)}
      />
    </div>
  );
}
