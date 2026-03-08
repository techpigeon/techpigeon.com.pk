'use client';
export const dynamic = 'force-dynamic';
import { useState, useMemo } from 'react';
import Button from '../../../components/ui/Button';
import Badge from '../../../components/ui/Badge';
import Modal from '../../../components/ui/Modal';

// ─── Types ─────────────────────────────────────────────────────────
interface PlanFeature {
  label: string;
  value: string;
}

interface HostingPlan {
  id: string;
  name: string;
  price_pkr: number;
  disk_limit_gb: number;
  bandwidth_limit_gb: number;
  features: PlanFeature[];
}

interface HostingSubscription {
  id: string;
  user_id: string;
  user_name: string;
  user_email: string;
  plan_id: string;
  status: 'active' | 'pending' | 'suspended' | 'cancelled';
  billing_cycle: 'monthly' | 'quarterly' | 'annually';
  server_ip: string;
  cpanel_username: string;
  cpanel_password: string;
  domain: string;
  disk_used_gb: number;
  bandwidth_used_gb: number;
  uptime_percent: number;
  cpu_usage: number;
  ram_used_mb: number;
  ram_total_mb: number;
  created_at: string;
  expires_at: string;
}

type BadgeVariant = 'blue' | 'green' | 'red' | 'yellow' | 'gray' | 'teal' | 'purple';

// ─── Plans ─────────────────────────────────────────────────────────
const PLANS: Record<string, HostingPlan> = {
  starter: {
    id: 'starter',
    name: 'Cloud Starter',
    price_pkr: 1399,
    disk_limit_gb: 10,
    bandwidth_limit_gb: 100,
    features: [
      { label: 'vCPU', value: '1 Core' },
      { label: 'RAM', value: '1 GB' },
      { label: 'Websites', value: '1' },
      { label: 'Free SSL', value: 'Yes' },
      { label: 'Daily Backups', value: 'No' },
      { label: 'Email Accounts', value: '5' },
    ],
  },
  pro: {
    id: 'pro',
    name: 'Cloud Pro',
    price_pkr: 3599,
    disk_limit_gb: 50,
    bandwidth_limit_gb: 500,
    features: [
      { label: 'vCPU', value: '2 Cores' },
      { label: 'RAM', value: '4 GB' },
      { label: 'Websites', value: '10' },
      { label: 'Free SSL', value: 'Yes' },
      { label: 'Daily Backups', value: 'Yes' },
      { label: 'Email Accounts', value: '25' },
    ],
  },
  business: {
    id: 'business',
    name: 'Cloud Business',
    price_pkr: 8399,
    disk_limit_gb: 150,
    bandwidth_limit_gb: 2000,
    features: [
      { label: 'vCPU', value: '4 Cores' },
      { label: 'RAM', value: '8 GB' },
      { label: 'Websites', value: 'Unlimited' },
      { label: 'Free SSL', value: 'Yes' },
      { label: 'Daily Backups', value: 'Yes' },
      { label: 'Email Accounts', value: 'Unlimited' },
    ],
  },
};

// ─── Mock Subscriptions ────────────────────────────────────────────
const SUBSCRIPTIONS: HostingSubscription[] = [
  {
    id: 'hs1',
    user_id: 'u1',
    user_name: 'Ali Khan',
    user_email: 'ali@example.com',
    plan_id: 'pro',
    status: 'active',
    billing_cycle: 'monthly',
    server_ip: '185.212.70.14',
    cpanel_username: 'alikhn_tp',
    cpanel_password: 'xK9#mQ2$vL7p',
    domain: 'alikhan.pk',
    disk_used_gb: 18.4,
    bandwidth_used_gb: 142.5,
    uptime_percent: 99.97,
    cpu_usage: 34,
    ram_used_mb: 1820,
    ram_total_mb: 4096,
    created_at: '2024-03-20T10:00:00Z',
    expires_at: '2025-02-20T10:00:00Z',
  },
  {
    id: 'hs2',
    user_id: 'u2',
    user_name: 'Sara Ahmed',
    user_email: 'sara@mail.com',
    plan_id: 'business',
    status: 'active',
    billing_cycle: 'annually',
    server_ip: '185.212.70.22',
    cpanel_username: 'sarahmd_tp',
    cpanel_password: 'bT4&nR8!hJ1w',
    domain: 'sarabiz.com',
    disk_used_gb: 87.2,
    bandwidth_used_gb: 890.3,
    uptime_percent: 99.99,
    cpu_usage: 62,
    ram_used_mb: 5200,
    ram_total_mb: 8192,
    created_at: '2024-01-10T08:00:00Z',
    expires_at: '2026-01-10T08:00:00Z',
  },
  {
    id: 'hs3',
    user_id: 'u3',
    user_name: 'John Doe',
    user_email: 'john@pk.com',
    plan_id: 'starter',
    status: 'pending',
    billing_cycle: 'monthly',
    server_ip: '185.212.70.14',
    cpanel_username: 'johndoe_tp',
    cpanel_password: 'pQ7*dL3@fK9s',
    domain: 'cloudpak.com',
    disk_used_gb: 0.1,
    bandwidth_used_gb: 0.3,
    uptime_percent: 0,
    cpu_usage: 0,
    ram_used_mb: 0,
    ram_total_mb: 1024,
    created_at: '2025-01-28T16:00:00Z',
    expires_at: '2025-02-28T16:00:00Z',
  },
  {
    id: 'hs4',
    user_id: 'u4',
    user_name: 'Fatima Noor',
    user_email: 'fatima@biz.pk',
    plan_id: 'business',
    status: 'active',
    billing_cycle: 'quarterly',
    server_ip: '185.212.70.31',
    cpanel_username: 'fatimnr_tp',
    cpanel_password: 'wH6%cX1^mN4j',
    domain: 'fatimabiz.pk',
    disk_used_gb: 132.8,
    bandwidth_used_gb: 1640.7,
    uptime_percent: 99.95,
    cpu_usage: 91,
    ram_used_mb: 7100,
    ram_total_mb: 8192,
    created_at: '2024-01-15T12:00:00Z',
    expires_at: '2025-04-15T12:00:00Z',
  },
  {
    id: 'hs5',
    user_id: 'u7',
    user_name: 'Hassan Raza',
    user_email: 'hassan@test.pk',
    plan_id: 'starter',
    status: 'suspended',
    billing_cycle: 'monthly',
    server_ip: '185.212.70.14',
    cpanel_username: 'hassrza_tp',
    cpanel_password: 'gF2@kV8#tR5e',
    domain: 'hassanraza.pk',
    disk_used_gb: 8.9,
    bandwidth_used_gb: 67.2,
    uptime_percent: 94.50,
    cpu_usage: 12,
    ram_used_mb: 310,
    ram_total_mb: 1024,
    created_at: '2024-04-18T09:00:00Z',
    expires_at: '2025-01-18T09:00:00Z',
  },
  {
    id: 'hs6',
    user_id: 'u8',
    user_name: 'Ayesha Malik',
    user_email: 'ayesha@cloud.pk',
    plan_id: 'pro',
    status: 'active',
    billing_cycle: 'annually',
    server_ip: '185.212.70.22',
    cpanel_username: 'ayshmlk_tp',
    cpanel_password: 'zN3$jW9!bQ6u',
    domain: 'ayeshacloud.pk',
    disk_used_gb: 43.6,
    bandwidth_used_gb: 388.1,
    uptime_percent: 99.98,
    cpu_usage: 55,
    ram_used_mb: 2900,
    ram_total_mb: 4096,
    created_at: '2024-08-05T11:00:00Z',
    expires_at: '2025-08-05T11:00:00Z',
  },
  {
    id: 'hs7',
    user_id: 'u1',
    user_name: 'Ali Khan',
    user_email: 'ali@example.com',
    plan_id: 'starter',
    status: 'cancelled',
    billing_cycle: 'monthly',
    server_ip: '185.212.70.14',
    cpanel_username: 'alikhn2_tp',
    cpanel_password: 'rM5&yT2*qJ8a',
    domain: 'mybusiness.pk',
    disk_used_gb: 4.2,
    bandwidth_used_gb: 22.8,
    uptime_percent: 99.80,
    cpu_usage: 0,
    ram_used_mb: 0,
    ram_total_mb: 1024,
    created_at: '2024-06-01T14:00:00Z',
    expires_at: '2024-12-01T14:00:00Z',
  },
  {
    id: 'hs8',
    user_id: 'u4',
    user_name: 'Fatima Noor',
    user_email: 'fatima@biz.pk',
    plan_id: 'pro',
    status: 'active',
    billing_cycle: 'monthly',
    server_ip: '185.212.70.31',
    cpanel_username: 'fatimnr2_tp',
    cpanel_password: 'uS7#eL4^dI9c',
    domain: 'fatimashop.com',
    disk_used_gb: 29.5,
    bandwidth_used_gb: 201.4,
    uptime_percent: 99.92,
    cpu_usage: 88,
    ram_used_mb: 3400,
    ram_total_mb: 4096,
    created_at: '2024-05-20T10:00:00Z',
    expires_at: '2025-02-20T10:00:00Z',
  },
];

// ─── Status styling map ────────────────────────────────────────────
const STATUS_MAP: Record<HostingSubscription['status'], { variant: BadgeVariant; label: string }> = {
  active: { variant: 'green', label: 'Active' },
  pending: { variant: 'yellow', label: 'Pending' },
  suspended: { variant: 'red', label: 'Suspended' },
  cancelled: { variant: 'gray', label: 'Cancelled' },
};

const BILLING_LABELS: Record<string, string> = {
  monthly: 'Monthly',
  quarterly: 'Quarterly',
  annually: 'Annually',
};

// ─── Helpers ───────────────────────────────────────────────────────
function pct(used: number, total: number): number {
  if (total === 0) return 0;
  return Math.min(100, Math.round((used / total) * 100));
}

function barColor(percent: number): string {
  if (percent >= 85) return '#F73730';
  if (percent >= 65) return '#F8D313';
  return '#41D33E';
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('en-PK', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

// ─── Resource Usage Bar ────────────────────────────────────────────
function UsageBar({
  label,
  used,
  total,
  unit,
}: {
  label: string;
  used: number;
  total: number;
  unit: string;
}) {
  const percent = pct(used, total);
  return (
    <div className="mb-3">
      <div className="flex justify-between text-sm mb-1.5">
        <span className="font-medium text-[#1d1d1d]">{label}</span>
        <span className="text-slate-400">
          {used.toLocaleString()} / {total.toLocaleString()} {unit} ({percent}%)
        </span>
      </div>
      <div className="bg-slate-200 rounded-full h-2.5">
        <div
          className="h-2.5 rounded-full transition-all duration-500"
          style={{ width: `${percent}%`, background: barColor(percent) }}
        />
      </div>
    </div>
  );
}

// ─── Manage Modal ──────────────────────────────────────────────────
function ManageModal({
  sub,
  open,
  onClose,
}: {
  sub: HostingSubscription | null;
  open: boolean;
  onClose: () => void;
}) {
  const [showCreds, setShowCreds] = useState(false);
  const [toggling, setToggling] = useState(false);

  if (!sub) return null;

  const plan = PLANS[sub.plan_id];
  const st = STATUS_MAP[sub.status] || STATUS_MAP.pending;
  const diskPct = pct(sub.disk_used_gb, plan.disk_limit_gb);
  const bwPct = pct(sub.bandwidth_used_gb, plan.bandwidth_limit_gb);
  const ramPct = pct(sub.ram_used_mb, sub.ram_total_mb);
  const isSuspendable = sub.status === 'active';
  const isActivatable = sub.status === 'suspended';

  return (
    <Modal
      open={open}
      onClose={() => {
        setShowCreds(false);
        onClose();
      }}
      title={`Manage — ${sub.domain}`}
      width={620}
    >
      {/* Header summary */}
      <div className="flex items-center justify-between p-4 rounded bg-slate-50 border border-slate-200 mb-5">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span
              style={{ fontFamily: "'Aleo',serif" }}
              className="text-xl text-[#bba442]"
            >
              {sub.domain}
            </span>
            <Badge variant={st.variant}>{st.label}</Badge>
          </div>
          <p className="text-xs text-slate-400">
            {sub.user_name} &middot; {sub.user_email}
          </p>
        </div>
        <div className="text-right">
          <div
            style={{ fontFamily: "'Aleo',serif" }}
            className="text-xl text-[#bba442]"
          >
            Rs.{plan.price_pkr.toLocaleString()}
          </div>
          <span className="text-xs text-slate-400">
            /{BILLING_LABELS[sub.billing_cycle]}
          </span>
        </div>
      </div>

      {/* Server Details Grid */}
      <div className="grid grid-cols-2 gap-3 mb-5">
        {[
          { label: 'Plan', value: plan.name },
          { label: 'Server IP', value: sub.server_ip },
          { label: 'Billing Cycle', value: BILLING_LABELS[sub.billing_cycle] },
          { label: 'Uptime', value: `${sub.uptime_percent}%` },
          { label: 'Created', value: formatDate(sub.created_at) },
          { label: 'Expires', value: formatDate(sub.expires_at) },
        ].map((d) => (
          <div
            key={d.label}
            className="bg-slate-50 rounded p-3 border border-slate-100"
          >
            <div className="text-xs text-slate-400">{d.label}</div>
            <div className="text-sm font-semibold text-[#1d1d1d]">
              {d.value}
            </div>
          </div>
        ))}
      </div>

      {/* Resource Usage */}
      <div className="bg-white border border-slate-200 rounded-2xl p-5 mb-5">
        <h4 className="text-sm font-semibold text-[#1d1d1d] mb-4">
          Resource Usage
        </h4>
        <UsageBar
          label="Disk"
          used={sub.disk_used_gb}
          total={plan.disk_limit_gb}
          unit="GB"
        />
        <UsageBar
          label="Bandwidth"
          used={sub.bandwidth_used_gb}
          total={plan.bandwidth_limit_gb}
          unit="GB"
        />
        <UsageBar
          label="RAM"
          used={sub.ram_used_mb}
          total={sub.ram_total_mb}
          unit="MB"
        />
        {/* CPU bar */}
        <div>
          <div className="flex justify-between text-sm mb-1.5">
            <span className="font-medium text-[#1d1d1d]">CPU</span>
            <span className="text-slate-400">{sub.cpu_usage}%</span>
          </div>
          <div className="bg-slate-200 rounded-full h-2.5">
            <div
              className="h-2.5 rounded-full transition-all duration-500"
              style={{
                width: `${sub.cpu_usage}%`,
                background: barColor(sub.cpu_usage),
              }}
            />
          </div>
        </div>
      </div>

      {/* Plan Features */}
      <div className="bg-[#e8f6fc] border border-blue-100 rounded-2xl p-5 mb-5">
        <h4 className="text-sm font-semibold text-[#1d1d1d] mb-3">
          Plan Features — {plan.name}
        </h4>
        <div className="grid grid-cols-2 gap-2">
          {plan.features.map((f) => (
            <div key={f.label} className="flex justify-between text-sm">
              <span className="text-slate-500">{f.label}</span>
              <span className="font-semibold text-[#1d1d1d]">{f.value}</span>
            </div>
          ))}
        </div>
      </div>

      {/* cPanel Credentials */}
      <div className="border border-slate-200 rounded-2xl p-5 mb-5">
        <div className="flex items-center justify-between mb-3">
          <h4 className="text-sm font-semibold text-[#1d1d1d]">
            cPanel Credentials
          </h4>
          <button
            onClick={() => setShowCreds(!showCreds)}
            className="text-xs font-semibold text-[#5cc4eb] hover:underline cursor-pointer"
          >
            {showCreds ? 'Hide' : 'Show'} Credentials
          </button>
        </div>
        {showCreds ? (
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-slate-50 rounded p-3 border border-slate-100">
              <div className="text-xs text-slate-400">Username</div>
              <div className="text-sm font-mono font-semibold text-[#1d1d1d]">
                {sub.cpanel_username}
              </div>
            </div>
            <div className="bg-slate-50 rounded p-3 border border-slate-100">
              <div className="text-xs text-slate-400">Password</div>
              <div className="text-sm font-mono font-semibold text-[#1d1d1d]">
                {sub.cpanel_password}
              </div>
            </div>
            <div className="col-span-2 bg-slate-50 rounded p-3 border border-slate-100">
              <div className="text-xs text-slate-400">cPanel URL</div>
              <div className="text-sm font-mono font-semibold text-[#5cc4eb]">
                https://{sub.server_ip}:2083
              </div>
            </div>
          </div>
        ) : (
          <p className="text-xs text-slate-400">
            Credentials are hidden for security. Click &quot;Show Credentials&quot; to
            reveal.
          </p>
        )}
      </div>

      {/* Actions */}
      <div className="flex gap-3">
        {isSuspendable && (
          <Button
            full
            variant="outline"
            loading={toggling}
            onClick={() => {
              setToggling(true);
              setTimeout(() => setToggling(false), 600);
            }}
          >
            Suspend Account
          </Button>
        )}
        {isActivatable && (
          <Button
            full
            loading={toggling}
            onClick={() => {
              setToggling(true);
              setTimeout(() => setToggling(false), 600);
            }}
          >
            Activate Account
          </Button>
        )}
        <Button
          full
          variant="ghost"
          onClick={() => {
            setShowCreds(false);
            onClose();
          }}
        >
          Close
        </Button>
      </div>
    </Modal>
  );
}

// ─── Main Page ─────────────────────────────────────────────────────
export default function HostingPage() {
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<string>('all');
  const [manageModal, setManageModal] = useState<HostingSubscription | null>(
    null,
  );

  // ── Computed ───────────────────────────────────────────────
  const filtered = useMemo(() => {
    let list = SUBSCRIPTIONS;
    if (filter !== 'all') list = list.filter((s) => s.status === filter);
    if (search) {
      const q = search.toLowerCase();
      list = list.filter(
        (s) =>
          s.user_name.toLowerCase().includes(q) ||
          s.user_email.toLowerCase().includes(q) ||
          s.domain.toLowerCase().includes(q) ||
          s.server_ip.includes(q) ||
          s.cpanel_username.toLowerCase().includes(q),
      );
    }
    return list;
  }, [search, filter]);

  const totalSubs = SUBSCRIPTIONS.length;
  const activeSubs = SUBSCRIPTIONS.filter((s) => s.status === 'active').length;
  const suspendedSubs = SUBSCRIPTIONS.filter(
    (s) => s.status === 'suspended',
  ).length;
  const avgUptime =
    SUBSCRIPTIONS.filter((s) => s.status === 'active').reduce(
      (a, s) => a + s.uptime_percent,
      0,
    ) / (activeSubs || 1);

  // ── Server health alerts ───────────────────────────────────
  const healthAlerts = SUBSCRIPTIONS.filter(
    (s) =>
      s.status === 'active' &&
      (s.cpu_usage > 90 ||
        pct(s.disk_used_gb, PLANS[s.plan_id].disk_limit_gb) > 85),
  );

  const TABS = [
    { key: 'all', label: `All (${totalSubs})` },
    { key: 'active', label: 'Active' },
    { key: 'pending', label: 'Pending' },
    { key: 'suspended', label: 'Suspended' },
    { key: 'cancelled', label: 'Cancelled' },
  ];

  return (
    <div>
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <span className="bg-[#5cc4eb] text-white text-xs font-bold px-2.5 py-1 rounded-full">
          ADMIN
        </span>
        <h1
          style={{ fontFamily: "'Aleo',serif" }}
          className="text-2xl text-[#bba442]"
        >
          Hosting
        </h1>
      </div>

      {/* Server Health Alerts */}
      {healthAlerts.length > 0 && (
        <div className="mb-6 space-y-2">
          {healthAlerts.map((s) => {
            const diskPercent = pct(
              s.disk_used_gb,
              PLANS[s.plan_id].disk_limit_gb,
            );
            const alerts: string[] = [];
            if (s.cpu_usage > 90) alerts.push(`CPU at ${s.cpu_usage}%`);
            if (diskPercent > 85)
              alerts.push(`Disk at ${diskPercent}%`);
            return (
              <div
                key={s.id + '-alert'}
                className="flex items-center gap-3 px-4 py-3 rounded border border-red-200 bg-red-50"
              >
                <span className="text-sm">&#9888;</span>
                <div className="flex-1 text-sm text-[#1d1d1d]">
                  <span className="font-semibold">{s.domain}</span>{' '}
                  <span className="text-slate-500">({s.server_ip})</span> —{' '}
                  {alerts.join(', ')}
                </div>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setManageModal(s)}
                >
                  Investigate
                </Button>
              </div>
            );
          })}
        </div>
      )}

      {/* Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {[
          {
            label: 'Total Subscriptions',
            value: String(totalSubs),
            icon: '☁️',
            color: '#5cc4eb',
          },
          {
            label: 'Active',
            value: String(activeSubs),
            icon: '✓',
            color: '#41D33E',
          },
          {
            label: 'Suspended',
            value: String(suspendedSubs),
            icon: '⛔',
            color: '#F73730',
          },
          {
            label: 'Avg Uptime',
            value: `${avgUptime.toFixed(2)}%`,
            icon: '📈',
            color: '#bba442',
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
            <p className="text-xs font-medium text-slate-400 mb-2">
              {s.label}
            </p>
            <p
              className="text-2xl font-bold text-[#bba442]"
              style={{ fontFamily: "'Aleo',serif" }}
            >
              {s.value}
            </p>
          </div>
        ))}
      </div>

      {/* Search + Tabs */}
      <div className="flex flex-col sm:flex-row gap-3 mb-5">
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by user, domain, IP, username..."
          className="flex-1 px-4 py-2.5 border-2 border-slate-200 rounded text-sm text-[#1d1d1d] bg-white outline-none focus:border-[#5cc4eb] transition-all"
        />
        <div className="flex gap-2 flex-wrap">
          {TABS.map((t) => (
            <button
              key={t.key}
              onClick={() => setFilter(t.key)}
              className={`px-4 py-1.5 rounded-full border text-xs font-semibold cursor-pointer transition-all capitalize ${
                filter === t.key
                  ? 'bg-[#e8f6fc] border-[#5cc4eb] text-[#5cc4eb]'
                  : 'bg-white border-slate-200 text-slate-500 hover:border-slate-300'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      {/* Hosting Table */}
      <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-sm">
            <thead className="bg-slate-50">
              <tr>
                {[
                  'User',
                  'Plan',
                  'Domain',
                  'Server IP',
                  'Status',
                  'Disk Used',
                  'Bandwidth',
                  'Uptime',
                  'Billing',
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
                    colSpan={10}
                    className="px-4 py-8 text-center text-slate-400"
                  >
                    No hosting subscriptions found.
                  </td>
                </tr>
              )}
              {filtered.map((s) => {
                const plan = PLANS[s.plan_id];
                const st = STATUS_MAP[s.status] || STATUS_MAP.pending;
                const diskPercent = pct(s.disk_used_gb, plan.disk_limit_gb);
                const bwPercent = pct(
                  s.bandwidth_used_gb,
                  plan.bandwidth_limit_gb,
                );
                return (
                  <tr
                    key={s.id}
                    className="border-b border-slate-100 last:border-none hover:bg-slate-50/50 transition-colors"
                  >
                    {/* User */}
                    <td className="px-4 py-3.5">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-[#1d1d1d] text-white flex items-center justify-center text-xs font-bold flex-shrink-0">
                          {s.user_name
                            .split(' ')
                            .map((n) => n[0])
                            .join('')}
                        </div>
                        <div>
                          <div className="font-semibold text-[#1d1d1d]">
                            {s.user_name}
                          </div>
                          <div className="text-xs text-slate-400">
                            {s.user_email}
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Plan */}
                    <td className="px-4 py-3.5">
                      <span className="font-semibold text-[#1d1d1d]">
                        {plan.name}
                      </span>
                      <div className="text-xs text-slate-400">
                        Rs.{plan.price_pkr.toLocaleString()}/mo
                      </div>
                    </td>

                    {/* Domain */}
                    <td className="px-4 py-3.5">
                      <span className="font-medium text-[#5cc4eb]">
                        {s.domain}
                      </span>
                    </td>

                    {/* Server IP */}
                    <td className="px-4 py-3.5">
                      <span className="font-mono text-xs text-slate-500">
                        {s.server_ip}
                      </span>
                    </td>

                    {/* Status */}
                    <td className="px-4 py-3.5">
                      <Badge variant={st.variant}>{st.label}</Badge>
                    </td>

                    {/* Disk Used (inline progress bar) */}
                    <td className="px-4 py-3.5">
                      <div className="min-w-[120px]">
                        <div className="flex justify-between text-xs mb-1">
                          <span className="text-[#1d1d1d] font-medium">
                            {s.disk_used_gb} GB
                          </span>
                          <span className="text-slate-400">
                            / {plan.disk_limit_gb} GB
                          </span>
                        </div>
                        <div className="bg-slate-200 rounded-full h-1.5">
                          <div
                            className="h-1.5 rounded-full transition-all duration-500"
                            style={{
                              width: `${diskPercent}%`,
                              background: barColor(diskPercent),
                            }}
                          />
                        </div>
                      </div>
                    </td>

                    {/* Bandwidth */}
                    <td className="px-4 py-3.5">
                      <div className="min-w-[120px]">
                        <div className="flex justify-between text-xs mb-1">
                          <span className="text-[#1d1d1d] font-medium">
                            {s.bandwidth_used_gb} GB
                          </span>
                          <span className="text-slate-400">
                            / {plan.bandwidth_limit_gb} GB
                          </span>
                        </div>
                        <div className="bg-slate-200 rounded-full h-1.5">
                          <div
                            className="h-1.5 rounded-full transition-all duration-500"
                            style={{
                              width: `${bwPercent}%`,
                              background: barColor(bwPercent),
                            }}
                          />
                        </div>
                      </div>
                    </td>

                    {/* Uptime */}
                    <td className="px-4 py-3.5">
                      <span
                        className={`text-sm font-semibold ${
                          s.uptime_percent >= 99.9
                            ? 'text-emerald-600'
                            : s.uptime_percent >= 99.0
                              ? 'text-amber-600'
                              : 'text-red-500'
                        }`}
                      >
                        {s.uptime_percent > 0
                          ? `${s.uptime_percent}%`
                          : '—'}
                      </span>
                    </td>

                    {/* Billing Cycle */}
                    <td className="px-4 py-3.5">
                      <span className="text-xs font-semibold text-slate-500 bg-slate-100 px-2.5 py-1 rounded-full">
                        {BILLING_LABELS[s.billing_cycle]}
                      </span>
                    </td>

                    {/* Actions */}
                    <td className="px-4 py-3.5">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setManageModal(s)}
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

      {/* Manage Modal */}
      <ManageModal
        sub={manageModal}
        open={!!manageModal}
        onClose={() => setManageModal(null)}
      />
    </div>
  );
}
