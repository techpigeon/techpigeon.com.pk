'use client';
export const dynamic = 'force-dynamic';
import { useState } from 'react';
import Button from '../../../components/ui/Button';
import Badge from '../../../components/ui/Badge';
import Modal from '../../../components/ui/Modal';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';
import Alert from '../../../components/ui/Alert';

const USERS = [
  { id: 'u1', first_name: 'Ali', last_name: 'Khan', email: 'ali@example.com', phone: '+92 300 1234567', role: 'client', is_verified: true, is_active: true, last_login_at: '2025-01-29T14:00:00Z', created_at: '2024-03-15', domains: 3, hosting: 2, orders: 8 },
  { id: 'u2', first_name: 'Sara', last_name: 'Ahmed', email: 'sara@mail.com', phone: '+92 321 9876543', role: 'client', is_verified: true, is_active: true, last_login_at: '2025-01-28T09:30:00Z', created_at: '2024-06-20', domains: 1, hosting: 1, orders: 4 },
  { id: 'u3', first_name: 'John', last_name: 'Doe', email: 'john@pk.com', phone: '+92 333 5555555', role: 'client', is_verified: false, is_active: true, last_login_at: '2025-01-25T16:00:00Z', created_at: '2024-09-10', domains: 2, hosting: 0, orders: 2 },
  { id: 'u4', first_name: 'Fatima', last_name: 'Noor', email: 'fatima@biz.pk', phone: '+92 345 1112222', role: 'reseller', is_verified: true, is_active: true, last_login_at: '2025-01-29T08:00:00Z', created_at: '2024-01-05', domains: 15, hosting: 8, orders: 34 },
  { id: 'u5', first_name: 'Usman', last_name: 'Tariq', email: 'usman@dev.com', phone: '+92 312 7778888', role: 'support', is_verified: true, is_active: true, last_login_at: '2025-01-29T12:00:00Z', created_at: '2024-02-20', domains: 0, hosting: 0, orders: 0 },
  { id: 'u6', first_name: 'Admin', last_name: 'TechPigeon', email: 'admin@techpigeon.org', phone: '+92 300 0000000', role: 'admin', is_verified: true, is_active: true, last_login_at: '2025-01-29T15:00:00Z', created_at: '2023-12-01', domains: 0, hosting: 0, orders: 0 },
  { id: 'u7', first_name: 'Hassan', last_name: 'Raza', email: 'hassan@test.pk', phone: '+92 301 3334444', role: 'client', is_verified: true, is_active: false, last_login_at: '2024-11-15T10:00:00Z', created_at: '2024-04-12', domains: 1, hosting: 1, orders: 3 },
  { id: 'u8', first_name: 'Ayesha', last_name: 'Malik', email: 'ayesha@cloud.pk', phone: '+92 322 6667777', role: 'client', is_verified: true, is_active: true, last_login_at: '2025-01-27T11:00:00Z', created_at: '2024-08-01', domains: 2, hosting: 1, orders: 5 },
];

const ROLE_MAP = {
  client:   { variant: 'blue', label: 'Client' },
  admin:    { variant: 'red', label: 'Admin' },
  reseller: { variant: 'purple', label: 'Reseller' },
  support:  { variant: 'teal', label: 'Support' },
};

function timeAgo(dateStr) {
  if (!dateStr) return 'Never';
  const diff = Date.now() - new Date(dateStr).getTime();
  const hrs = Math.floor(diff / 3600000);
  if (hrs < 1) return 'Just now';
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  if (days < 30) return `${days}d ago`;
  return new Date(dateStr).toLocaleDateString('en-PK', { month: 'short', year: 'numeric' });
}

function EditUserModal({ user, open, onClose }) {
  const [form, setForm] = useState(user ? { ...user } : {});
  const [saving, setSaving] = useState(false);
  if (!user) return null;
  const set = (k) => (v) => setForm(p => ({ ...p, [k]: typeof v === 'object' && v?.target ? v.target.value : v }));

  return (
    <Modal open={open} onClose={onClose} title={`Edit User — ${user.first_name} ${user.last_name}`} width={520}>
      <div className="flex items-center gap-4 p-4 rounded bg-slate-50 border border-slate-200 mb-5">
        <div className="w-12 h-12 rounded-full bg-[#1d1d1d] text-white flex items-center justify-center text-lg font-bold">
          {user.first_name[0]}{user.last_name[0]}
        </div>
        <div>
          <div className="font-semibold text-[#1d1d1d]">{user.email}</div>
          <div className="text-xs text-slate-400">Member since {new Date(user.created_at).toLocaleDateString('en-PK', { year: 'numeric', month: 'long' })}</div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <Input label="First Name" value={form.first_name} onChange={set('first_name')} />
        <Input label="Last Name" value={form.last_name} onChange={set('last_name')} />
      </div>
      <Input label="Email" type="email" value={form.email} onChange={set('email')} />
      <Input label="Phone" type="tel" value={form.phone} onChange={set('phone')} />
      <Select label="Role" value={form.role} onChange={set('role')} options={[
        { value: 'client', label: 'Client' }, { value: 'reseller', label: 'Reseller' },
        { value: 'support', label: 'Support' }, { value: 'admin', label: 'Admin' },
      ]} />

      <div className="grid grid-cols-2 gap-3 mb-4">
        <div className="flex items-center gap-3 p-3 rounded border border-slate-200">
          <input type="checkbox" checked={form.is_verified} onChange={e => setForm(p => ({ ...p, is_verified: e.target.checked }))} className="w-4 h-4 accent-[#5cc4eb]" />
          <span className="text-sm text-[#1d1d1d]">Email Verified</span>
        </div>
        <div className="flex items-center gap-3 p-3 rounded border border-slate-200">
          <input type="checkbox" checked={form.is_active} onChange={e => setForm(p => ({ ...p, is_active: e.target.checked }))} className="w-4 h-4 accent-[#5cc4eb]" />
          <span className="text-sm text-[#1d1d1d]">Account Active</span>
        </div>
      </div>

      {/* User Stats */}
      <div className="grid grid-cols-3 gap-3 p-4 rounded bg-[#e8f6fc] border border-blue-100 mb-5">
        {[['Domains', user.domains], ['Hosting', user.hosting], ['Orders', user.orders]].map(([l, v]) => (
          <div key={l} className="text-center">
            <div className="text-lg font-bold text-[#1d1d1d]" style={{ fontFamily: "'Aleo',serif" }}>{v}</div>
            <div className="text-xs text-slate-400">{l}</div>
          </div>
        ))}
      </div>

      <div className="flex gap-3">
        <Button full loading={saving} onClick={() => { setSaving(true); setTimeout(() => { setSaving(false); onClose(); }, 600); }}>Save Changes</Button>
        <Button full variant="outline" onClick={onClose}>Cancel</Button>
      </div>
    </Modal>
  );
}

export default function UsersPage() {
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [editModal, setEditModal] = useState(null);

  let filtered = USERS;
  if (search) filtered = filtered.filter(u => `${u.first_name} ${u.last_name} ${u.email}`.toLowerCase().includes(search.toLowerCase()));
  if (roleFilter !== 'all') filtered = filtered.filter(u => u.role === roleFilter);

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <span className="bg-[#5cc4eb] text-white text-xs font-bold px-2.5 py-1 rounded-full">ADMIN</span>
        <h1 style={{ fontFamily: "'Aleo',serif" }} className="text-2xl text-[#bba442]">User Management</h1>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {[
          { label: 'Total Users', value: String(USERS.length), icon: '👥', color: '#5cc4eb' },
          { label: 'Active', value: String(USERS.filter(u => u.is_active).length), icon: '✓', color: '#41D33E' },
          { label: 'Inactive', value: String(USERS.filter(u => !u.is_active).length), icon: '✗', color: '#F73730' },
          { label: 'Resellers', value: String(USERS.filter(u => u.role === 'reseller').length), icon: '🏪', color: '#bba442' },
        ].map(s => (
          <div key={s.label} className="bg-white border border-slate-200 rounded-2xl p-5 relative overflow-hidden hover:shadow-md transition-shadow">
            <div className="absolute top-4 right-4 w-11 h-11 rounded flex items-center justify-center text-xl" style={{ background: s.color + '18' }}>{s.icon}</div>
            <p className="text-xs font-medium text-slate-400 mb-2">{s.label}</p>
            <p className="text-2xl font-bold text-[#bba442]" style={{ fontFamily: "'Aleo',serif" }}>{s.value}</p>
          </div>
        ))}
      </div>

      {/* Search & Filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-5">
        <div className="flex-1">
          <input
            value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Search by name or email..."
            className="w-full px-4 py-2.5 border-2 border-slate-200 rounded text-sm text-[#1d1d1d] bg-white outline-none focus:border-[#5cc4eb] transition-all"
          />
        </div>
        <div className="flex gap-2 flex-wrap">
          {['all', 'client', 'reseller', 'support', 'admin'].map(r => (
            <button key={r} onClick={() => setRoleFilter(r)} className={`px-4 py-1.5 rounded-full border text-xs font-semibold cursor-pointer transition-all capitalize ${roleFilter === r ? 'bg-[#e8f6fc] border-[#5cc4eb] text-[#5cc4eb]' : 'bg-white border-slate-200 text-slate-500 hover:border-slate-300'}`}>
              {r === 'all' ? `All (${USERS.length})` : r}
            </button>
          ))}
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-sm">
            <thead className="bg-slate-50">
              <tr>
                {['User', 'Role', 'Status', 'Verified', 'Services', 'Last Login', 'Actions'].map(h => (
                  <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider border-b border-slate-200 whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 && (
                <tr><td colSpan={7} className="px-4 py-8 text-center text-slate-400">No users found.</td></tr>
              )}
              {filtered.map(u => {
                const role = ROLE_MAP[u.role] || ROLE_MAP.client;
                return (
                  <tr key={u.id} className="border-b border-slate-100 last:border-none hover:bg-slate-50/50 transition-colors">
                    <td className="px-4 py-3.5">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-[#1d1d1d] text-white flex items-center justify-center text-xs font-bold flex-shrink-0">
                          {u.first_name[0]}{u.last_name[0]}
                        </div>
                        <div>
                          <div className="font-semibold text-[#1d1d1d]">{u.first_name} {u.last_name}</div>
                          <div className="text-xs text-slate-400">{u.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3.5"><Badge variant={role.variant}>{role.label}</Badge></td>
                    <td className="px-4 py-3.5">
                      <span className={`inline-flex items-center gap-1.5 text-xs font-semibold ${u.is_active ? 'text-emerald-600' : 'text-red-500'}`}>
                        <span className={`w-2 h-2 rounded-full ${u.is_active ? 'bg-emerald-500' : 'bg-red-500'}`} />
                        {u.is_active ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="px-4 py-3.5">
                      <span className={`text-xs font-semibold ${u.is_verified ? 'text-emerald-600' : 'text-amber-600'}`}>
                        {u.is_verified ? '✓ Verified' : '✗ Unverified'}
                      </span>
                    </td>
                    <td className="px-4 py-3.5">
                      <div className="flex gap-2 text-xs">
                        {u.domains > 0 && <span className="bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full">{u.domains} domains</span>}
                        {u.hosting > 0 && <span className="bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full">{u.hosting} hosting</span>}
                      </div>
                    </td>
                    <td className="px-4 py-3.5 text-xs text-slate-400">{timeAgo(u.last_login_at)}</td>
                    <td className="px-4 py-3.5">
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline" onClick={() => setEditModal(u)}>Edit</Button>
                        <Button size="sm" variant={u.is_active ? 'ghost' : 'success'}>
                          {u.is_active ? 'Disable' : 'Enable'}
                        </Button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      <EditUserModal user={editModal} open={!!editModal} onClose={() => setEditModal(null)} />
    </div>
  );
}
