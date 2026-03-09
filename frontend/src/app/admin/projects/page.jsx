'use client';
export const dynamic = 'force-dynamic';

import { useEffect, useMemo, useState } from 'react';
import Button from '../../../components/ui/Button';
import Alert from '../../../components/ui/Alert';
import { adminApi } from '../../../lib/api';

const STATUSES = ['planning', 'active', 'on_hold', 'completed', 'cancelled'];

export default function AdminProjectsPage() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('all');
  const [msg, setMsg] = useState('');
  const [err, setErr] = useState('');
  const [showNew, setShowNew] = useState(false);
  const [newProject, setNewProject] = useState({
    project_id: '',
    project_name: '',
    project_start_date: '',
    project_close_date: '',
    project_status: 'active',
    project_url: '',
    is_published: true,
    is_archived: false,
    show_on_homepage: false,
  });

  const load = async () => {
    setLoading(true);
    setErr('');
    try {
      const { data } = await adminApi.projects({ q: search || undefined, status: status === 'all' ? undefined : status });
      setProjects(data.projects || []);
    } catch (e) {
      setErr(e.response?.data?.error || 'Failed to load projects.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, [status]);

  const filtered = useMemo(() => {
    if (!search.trim()) return projects;
    const q = search.toLowerCase();
    return projects.filter(p => `${p.project_id} ${p.project_name}`.toLowerCase().includes(q));
  }, [projects, search]);

  const createProject = async () => {
    if (!newProject.project_id || !newProject.project_name) {
      setErr('ProjectID and Project Name are required.');
      return;
    }
    setSaving(true);
    setErr('');
    try {
      await adminApi.createProject(newProject);
      setMsg('Project created.');
      setShowNew(false);
      setNewProject({
        project_id: '', project_name: '', project_start_date: '', project_close_date: '', project_status: 'active', project_url: '', is_published: true, is_archived: false, show_on_homepage: false,
      });
      await load();
    } catch (e) {
      setErr(e.response?.data?.error || 'Failed to create project.');
    } finally {
      setSaving(false);
    }
  };

  const updateProject = async (project) => {
    setSaving(true);
    setErr('');
    try {
      await adminApi.updateProject(project.id, {
        project_id: project.project_id,
        project_name: project.project_name,
        project_start_date: project.project_start_date,
        project_close_date: project.project_close_date,
        project_status: project.project_status,
        project_url: project.project_url,
        is_published: project.is_published,
        is_archived: project.is_archived,
        show_on_homepage: project.show_on_homepage,
      });
      setMsg('Project updated.');
      await load();
    } catch (e) {
      setErr(e.response?.data?.error || 'Failed to update project.');
    } finally {
      setSaving(false);
    }
  };

  const deleteProject = async (id) => {
    if (!confirm('Delete this project?')) return;
    setSaving(true);
    setErr('');
    try {
      await adminApi.deleteProject(id);
      setMsg('Project deleted.');
      await load();
    } catch (e) {
      setErr(e.response?.data?.error || 'Failed to delete project.');
    } finally {
      setSaving(false);
    }
  };

  const updateLocal = (id, key, value) => setProjects(p => p.map(x => x.id === id ? { ...x, [key]: value } : x));

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 style={{ fontFamily: "'Aleo',serif" }} className="text-2xl text-[#bba442]">Projects</h1>
        <Button size="sm" onClick={() => setShowNew(v => !v)}>{showNew ? 'Cancel' : '+ Add Project'}</Button>
      </div>

      {err && <Alert type="error">{err}</Alert>}
      {msg && <Alert type="success">{msg}</Alert>}

      <div className="flex gap-3 mb-4">
        <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search by ProjectID / Name" className="flex-1 px-3 py-2.5 border-2 border-slate-200 rounded text-sm" />
        <select value={status} onChange={(e) => setStatus(e.target.value)} className="px-3 py-2.5 border-2 border-slate-200 rounded text-sm">
          <option value="all">All status</option>
          {STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
        </select>
        <Button size="sm" variant="outline" onClick={load}>Refresh</Button>
      </div>

      {showNew && (
        <div className="bg-white border-2 border-[#5cc4eb] rounded-xl p-4 mb-4">
          <p className="text-sm font-bold text-[#5cc4eb] mb-3">Add New Project</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <input placeholder="ProjectID" value={newProject.project_id} onChange={(e) => setNewProject(p => ({ ...p, project_id: e.target.value }))} className="px-3 py-2 border-2 border-slate-200 rounded text-sm" />
            <input placeholder="Project Name" value={newProject.project_name} onChange={(e) => setNewProject(p => ({ ...p, project_name: e.target.value }))} className="px-3 py-2 border-2 border-slate-200 rounded text-sm" />
            <input type="date" value={newProject.project_start_date || ''} onChange={(e) => setNewProject(p => ({ ...p, project_start_date: e.target.value }))} className="px-3 py-2 border-2 border-slate-200 rounded text-sm" />
            <input type="date" value={newProject.project_close_date || ''} onChange={(e) => setNewProject(p => ({ ...p, project_close_date: e.target.value }))} className="px-3 py-2 border-2 border-slate-200 rounded text-sm" />
            <select value={newProject.project_status} onChange={(e) => setNewProject(p => ({ ...p, project_status: e.target.value }))} className="px-3 py-2 border-2 border-slate-200 rounded text-sm">
              {STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
            <input placeholder="Project URL" value={newProject.project_url} onChange={(e) => setNewProject(p => ({ ...p, project_url: e.target.value }))} className="px-3 py-2 border-2 border-slate-200 rounded text-sm" />
          </div>
          <div className="flex gap-4 mt-3 text-sm">
            <label className="flex items-center gap-2"><input type="checkbox" checked={newProject.is_published} onChange={(e) => setNewProject(p => ({ ...p, is_published: e.target.checked }))} /> Published</label>
            <label className="flex items-center gap-2"><input type="checkbox" checked={newProject.show_on_homepage} onChange={(e) => setNewProject(p => ({ ...p, show_on_homepage: e.target.checked }))} /> Show on homepage</label>
          </div>
          <div className="mt-3"><Button size="sm" loading={saving} onClick={createProject}>Create Project</Button></div>
        </div>
      )}

      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-slate-50">
            <tr>
              {['ProjectID', 'Project Name', 'Start', 'Close', 'Status', 'URL', 'Actions'].map(h => (
                <th key={h} className="px-3 py-2 text-left text-xs font-semibold text-slate-500 uppercase border-b border-slate-200">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {loading && <tr><td colSpan={7} className="px-3 py-8 text-center text-slate-400">Loading projects...</td></tr>}
            {!loading && filtered.length === 0 && <tr><td colSpan={7} className="px-3 py-8 text-center text-slate-400">No projects found.</td></tr>}
            {!loading && filtered.map(p => (
              <tr key={p.id} className="border-b border-slate-100">
                <td className="px-3 py-2"><input value={p.project_id || ''} onChange={(e) => updateLocal(p.id, 'project_id', e.target.value)} className="w-28 px-2 py-1 border border-slate-200 rounded" /></td>
                <td className="px-3 py-2"><input value={p.project_name || ''} onChange={(e) => updateLocal(p.id, 'project_name', e.target.value)} className="w-full px-2 py-1 border border-slate-200 rounded" /></td>
                <td className="px-3 py-2"><input type="date" value={p.project_start_date ? String(p.project_start_date).slice(0,10) : ''} onChange={(e) => updateLocal(p.id, 'project_start_date', e.target.value)} className="px-2 py-1 border border-slate-200 rounded" /></td>
                <td className="px-3 py-2"><input type="date" value={p.project_close_date ? String(p.project_close_date).slice(0,10) : ''} onChange={(e) => updateLocal(p.id, 'project_close_date', e.target.value)} className="px-2 py-1 border border-slate-200 rounded" /></td>
                <td className="px-3 py-2">
                  <select value={p.project_status || 'active'} onChange={(e) => updateLocal(p.id, 'project_status', e.target.value)} className="px-2 py-1 border border-slate-200 rounded">
                    {STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </td>
                <td className="px-3 py-2"><input value={p.project_url || ''} onChange={(e) => updateLocal(p.id, 'project_url', e.target.value)} className="w-full px-2 py-1 border border-slate-200 rounded" /></td>
                <td className="px-3 py-2">
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline" onClick={() => updateProject(p)} loading={saving}>Save</Button>
                    <Button size="sm" variant="danger" onClick={() => deleteProject(p.id)} loading={saving}>Delete</Button>
                  </div>
                  <div className="flex gap-3 mt-2 text-xs">
                    <label className="flex items-center gap-1"><input type="checkbox" checked={!!p.is_published} onChange={(e) => updateLocal(p.id, 'is_published', e.target.checked)} /> Published</label>
                    <label className="flex items-center gap-1"><input type="checkbox" checked={!!p.show_on_homepage} onChange={(e) => updateLocal(p.id, 'show_on_homepage', e.target.checked)} /> Homepage</label>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
