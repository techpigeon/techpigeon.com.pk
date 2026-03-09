'use client';
export const dynamic = 'force-dynamic';

import { useEffect, useMemo, useState } from 'react';
import Button from '../../../components/ui/Button';
import Badge from '../../../components/ui/Badge';
import Modal from '../../../components/ui/Modal';
import Alert from '../../../components/ui/Alert';
import { adminApi } from '../../../lib/api';

const ROLES = ['client', 'reseller', 'support', 'admin'];

function UserFormModal({ open, onClose, onSubmit, saving }) {
  const [form, setForm] = useState({
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
    role: 'client',
    password: '',
    is_verified: true,
    is_active: true,
  });

  const set = (k, v) => setForm((p) => ({ ...p, [k]: v }));

  useEffect(() => {
    if (!open) {
      setForm({ first_name: '', last_name: '', email: '', phone: '', role: 'client', password: '', is_verified: true, is_active: true });
    }
  }, [open]);

  return (
    <Modal open={open} onClose={onClose} title="Add User" width={560}>
      <div className="grid grid-cols-2 gap-3">
        <input placeholder="First name" value={form.first_name} onChange={(e) => set('first_name', e.target.value)} className="px-3 py-2.5 border-2 border-slate-200 rounded text-sm" />
        <input placeholder="Last name" value={form.last_name} onChange={(e) => set('last_name', e.target.value)} className="px-3 py-2.5 border-2 border-slate-200 rounded text-sm" />
      </div>
      <input placeholder="Email" value={form.email} onChange={(e) => set('email', e.target.value)} className="mt-3 w-full px-3 py-2.5 border-2 border-slate-200 rounded text-sm" />
      <input placeholder="Phone" value={form.phone} onChange={(e) => set('phone', e.target.value)} className="mt-3 w-full px-3 py-2.5 border-2 border-slate-200 rounded text-sm" />
      <input placeholder="Password (min 8 chars)" type="password" value={form.password} onChange={(e) => set('password', e.target.value)} className="mt-3 w-full px-3 py-2.5 border-2 border-slate-200 rounded text-sm" />
      <select value={form.role} onChange={(e) => set('role', e.target.value)} className="mt-3 w-full px-3 py-2.5 border-2 border-slate-200 rounded text-sm">
        {ROLES.map((r) => <option key={r} value={r}>{r}</option>)}
      </select>
      <div className="mt-3 flex gap-4 text-sm">
        <label className="flex items-center gap-2"><input type="checkbox" checked={form.is_verified} onChange={(e) => set('is_verified', e.target.checked)} /> Verified</label>
        <label className="flex items-center gap-2"><input type="checkbox" checked={form.is_active} onChange={(e) => set('is_active', e.target.checked)} /> Active</label>
      </div>
      <div className="mt-5 flex gap-3">
        <Button full loading={saving} onClick={() => onSubmit(form)}>Create User</Button>
        <Button full variant="outline" onClick={onClose}>Cancel</Button>
      </div>
    </Modal>
  );
}

function EditUserModal({ open, onClose, onSubmit, onDelete, user, saving }) {
  const [form, setForm] = useState(user || null);
  useEffect(() => setForm(user || null), [user]);
  if (!form) return null;
  const set = (k, v) => setForm((p) => ({ ...p, [k]: v }));

  return (
    <Modal open={open} onClose={onClose} title={`Edit ${form.first_name} ${form.last_name}`} width={560}>
      <div className="grid grid-cols-2 gap-3">
        <input placeholder="First name" value={form.first_name || ''} onChange={(e) => set('first_name', e.target.value)} className="px-3 py-2.5 border-2 border-slate-200 rounded text-sm" />
        <input placeholder="Last name" value={form.last_name || ''} onChange={(e) => set('last_name', e.target.value)} className="px-3 py-2.5 border-2 border-slate-200 rounded text-sm" />
      </div>
      <input placeholder="Email" value={form.email || ''} onChange={(e) => set('email', e.target.value)} className="mt-3 w-full px-3 py-2.5 border-2 border-slate-200 rounded text-sm" />
      <input placeholder="Phone" value={form.phone || ''} onChange={(e) => set('phone', e.target.value)} className="mt-3 w-full px-3 py-2.5 border-2 border-slate-200 rounded text-sm" />
      <select value={form.role || 'client'} onChange={(e) => set('role', e.target.value)} className="mt-3 w-full px-3 py-2.5 border-2 border-slate-200 rounded text-sm">
        {ROLES.map((r) => <option key={r} value={r}>{r}</option>)}
      </select>
      <div className="mt-3 flex gap-4 text-sm">
        <label className="flex items-center gap-2"><input type="checkbox" checked={!!form.is_verified} onChange={(e) => set('is_verified', e.target.checked)} /> Verified</label>
        <label className="flex items-center gap-2"><input type="checkbox" checked={!!form.is_active} onChange={(e) => set('is_active', e.target.checked)} /> Active</label>
      </div>
      <div className="mt-5 flex gap-3">
        <Button full loading={saving} onClick={() => onSubmit(form)}>Save</Button>
        <Button full variant="danger" onClick={() => onDelete(form.id)}>Delete</Button>
      </div>
    </Modal>
  );
}

export default function UsersPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState('');
  const [ok, setOk] = useState('');
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [addOpen, setAddOpen] = useState(false);
  const [editUser, setEditUser] = useState(null);

  const load = async () => {
    setLoading(true);
    setErr('');
    try {
      const { data } = await adminApi.users({ limit: 200 });
      setUsers(data.users || []);
    } catch (e) {
      setErr(e.response?.data?.error || 'Failed to load users.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const filtered = useMemo(() => {
    let list = users;
    if (roleFilter !== 'all') list = list.filter((u) => u.role === roleFilter);
    if (search) {
      const q = search.toLowerCase();
      list = list.filter((u) => `${u.first_name} ${u.last_name} ${u.email}`.toLowerCase().includes(q));
    }
    return list;
  }, [users, roleFilter, search]);

  const createUser = async (payload) => {
    setSaving(true);
    setErr('');
    try {
      await adminApi.createUser(payload);
      setAddOpen(false);
      setOk('User created.');
      await load();
    } catch (e) {
      setErr(e.response?.data?.error || 'Failed to create user.');
    } finally {
      setSaving(false);
    }
  };

  const updateUser = async (payload) => {
    setSaving(true);
    setErr('');
    try {
      await adminApi.updateUser(payload.id, {
        role: payload.role,
        is_active: payload.is_active,
        is_verified: payload.is_verified,
      });
      setEditUser(null);
      setOk('User updated.');
      await load();
    } catch (e) {
      setErr(e.response?.data?.error || 'Failed to update user.');
    } finally {
      setSaving(false);
    }
  };

  const deleteUser = async (id) => {
    if (!confirm('Delete this user?')) return;
    setSaving(true);
    try {
      await adminApi.deleteUser(id);
      setEditUser(null);
      setOk('User deleted.');
      await load();
    } catch (e) {
      setErr(e.response?.data?.error || 'Failed to delete user.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <span className="bg-[#5cc4eb] text-white text-xs font-bold px-2.5 py-1 rounded-full">ADMIN</span>
          <h1 style={{ fontFamily: "'Aleo',serif" }} className="text-2xl text-[#bba442]">User Management</h1>
        </div>
        <Button size="sm" onClick={() => setAddOpen(true)}>+ Add User</Button>
      </div>

      {err && <Alert type="error">{err}</Alert>}
      {ok && <Alert type="success">{ok}</Alert>}

      <div className="flex gap-3 mb-5">
        <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search by name/email" className="flex-1 px-4 py-2.5 border-2 border-slate-200 rounded text-sm" />
        <select value={roleFilter} onChange={(e) => setRoleFilter(e.target.value)} className="px-4 py-2.5 border-2 border-slate-200 rounded text-sm">
          <option value="all">All roles</option>
          {ROLES.map((r) => <option key={r} value={r}>{r}</option>)}
        </select>
      </div>

      <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-slate-50">
            <tr>
              {['Name', 'Email', 'Role', 'Status', 'Verified', 'Last Login', 'Actions'].map((h) => (
                <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-slate-400 uppercase border-b border-slate-200">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {loading && <tr><td colSpan={7} className="px-4 py-8 text-center text-slate-400">Loading users...</td></tr>}
            {!loading && filtered.length === 0 && <tr><td colSpan={7} className="px-4 py-8 text-center text-slate-400">No users found.</td></tr>}
            {!loading && filtered.map((u) => (
              <tr key={u.id} className="border-b border-slate-100">
                <td className="px-4 py-3.5 font-semibold text-[#1d1d1d]">{u.first_name} {u.last_name}</td>
                <td className="px-4 py-3.5 text-slate-500">{u.email}</td>
                <td className="px-4 py-3.5"><Badge variant={u.role === 'admin' ? 'red' : u.role === 'support' ? 'teal' : u.role === 'reseller' ? 'purple' : 'blue'}>{u.role}</Badge></td>
                <td className="px-4 py-3.5 text-xs font-semibold">{u.is_active ? 'Active' : 'Inactive'}</td>
                <td className="px-4 py-3.5 text-xs font-semibold">{u.is_verified ? 'Yes' : 'No'}</td>
                <td className="px-4 py-3.5 text-xs text-slate-400">{u.last_login_at ? new Date(u.last_login_at).toLocaleString('en-PK') : 'Never'}</td>
                <td className="px-4 py-3.5"><Button size="sm" variant="outline" onClick={() => setEditUser(u)}>Edit</Button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <UserFormModal open={addOpen} onClose={() => setAddOpen(false)} onSubmit={createUser} saving={saving} />
      <EditUserModal open={!!editUser} user={editUser} onClose={() => setEditUser(null)} onSubmit={updateUser} onDelete={deleteUser} saving={saving} />
    </div>
  );
}
