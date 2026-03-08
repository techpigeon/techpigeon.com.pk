'use client';
export const dynamic = 'force-dynamic';
import { useState, useEffect, useCallback } from 'react';
import { siteAdminApi } from '../../../lib/api';
import Button from '../../../components/ui/Button';

const TABS = [
  { id: 'sections', label: 'Page Sections' },
  { id: 'services', label: 'Services' },
  { id: 'ventures', label: 'Ventures' },
  { id: 'partners', label: 'Partners' },
  { id: 'tlds', label: 'TLD Prices' },
];

function Alert({ type, children }) {
  const cls = type === 'success' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-red-50 text-red-700 border-red-200';
  return <div className={`mb-4 px-4 py-3 rounded text-sm font-medium border ${cls}`}>{children}</div>;
}

function Spinner() {
  return <div className="flex justify-center py-12"><div className="animate-spin w-8 h-8 border-3 border-[#5cc4eb] border-t-transparent rounded-full" /></div>;
}

/* ─── Expandable Card ─────────────────────────────── */
function ItemCard({ title, subtitle, defaultOpen, children, onDelete, id }) {
  const [open, setOpen] = useState(defaultOpen || false);
  return (
    <div className="bg-white border border-slate-200 rounded-xl mb-3 overflow-hidden">
      <div className="flex items-center justify-between px-5 py-3 cursor-pointer hover:bg-slate-50 transition-colors" onClick={() => setOpen(!open)}>
        <div>
          <p className="text-sm font-semibold text-[#1d1d1d]">{title}</p>
          {subtitle && <p className="text-xs text-slate-400">{subtitle}</p>}
        </div>
        <div className="flex items-center gap-2">
          {onDelete && (
            <button onClick={e => { e.stopPropagation(); if(confirm('Delete this item?')) onDelete(id); }}
              className="text-xs text-red-400 hover:text-red-600 px-2 py-1 bg-transparent border-none cursor-pointer">Delete</button>
          )}
          <svg className={`w-4 h-4 text-slate-400 transition-transform ${open ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
        </div>
      </div>
      {open && <div className="px-5 pb-5 border-t border-slate-100 pt-4">{children}</div>}
    </div>
  );
}

function Input({ label, value, onChange, placeholder, type = 'text', mono }) {
  return (
    <div className="mb-3">
      <label className="block text-xs font-semibold text-slate-600 mb-1">{label}</label>
      <input type={type} value={value || ''} onChange={e => onChange(e.target.value)} placeholder={placeholder}
        className={`w-full px-3 py-2 border-2 border-slate-200 rounded text-sm outline-none focus:border-[#5cc4eb] transition-colors ${mono ? 'font-mono' : ''}`} />
    </div>
  );
}

function TArea({ label, value, onChange, rows = 3, mono }) {
  return (
    <div className="mb-3">
      <label className="block text-xs font-semibold text-slate-600 mb-1">{label}</label>
      <textarea value={value || ''} onChange={e => onChange(e.target.value)} rows={rows}
        className={`w-full px-3 py-2 border-2 border-slate-200 rounded text-sm outline-none focus:border-[#5cc4eb] transition-colors resize-y ${mono ? 'font-mono text-xs' : ''}`} />
    </div>
  );
}

function Toggle({ label, value, onChange }) {
  return (
    <div className="flex items-center gap-2 mb-3">
      <button onClick={() => onChange(!value)}
        className={`relative w-10 h-5 rounded-full transition-colors border-none cursor-pointer ${value ? 'bg-emerald-500' : 'bg-slate-300'}`}>
        <span className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform ${value ? 'left-5' : 'left-0.5'}`} />
      </button>
      <span className="text-xs font-medium text-slate-600">{label}</span>
    </div>
  );
}

/* ═════════════════════════════════════════════════════════════ */
export default function ContentPage() {
  const [tab, setTab] = useState('sections');
  const [msg, setMsg] = useState(null);

  const flash = (type, text) => { setMsg({ type, text }); setTimeout(() => setMsg(null), 4000); };

  return (
    <div>
      <div className="mb-6">
        <h1 style={{ fontFamily: "'Aleo',serif" }} className="text-2xl text-[#bba442]">Content Management</h1>
        <p className="text-sm text-slate-500 mt-1">Edit page sections, services, ventures, partners, and TLD prices. Changes appear on the website in real time.</p>
      </div>
      {msg && <Alert type={msg.type}>{msg.text}</Alert>}

      <div className="flex gap-1 mb-6 bg-slate-100 rounded-lg p-1 w-fit flex-wrap">
        {TABS.map(t => (
          <button key={t.id} onClick={() => setTab(t.id)}
            className={`px-4 py-2 text-sm font-semibold rounded-md border-none cursor-pointer transition-all ${tab === t.id ? 'bg-white text-[#5cc4eb] shadow-sm' : 'bg-transparent text-slate-500 hover:text-[#1d1d1d]'}`}>
            {t.label}
          </button>
        ))}
      </div>

      {tab === 'sections' && <SectionsTab flash={flash} />}
      {tab === 'services' && <CrudTab entity="services" nameKey="title" flash={flash} fields={['title','description','icon','href']} />}
      {tab === 'ventures' && <CrudTab entity="ventures" nameKey="name" flash={flash} fields={['name','tagline','description','category']} />}
      {tab === 'partners' && <CrudTab entity="partners" nameKey="name" flash={flash} fields={['name','logo_url','website','description']} />}
      {tab === 'tlds' && <TldsTab flash={flash} />}
    </div>
  );
}

/* ═══ Sections Tab ═══════════════════════════════════════════ */
function SectionsTab({ flash }) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [savingId, setSavingId] = useState(null);

  useEffect(() => {
    siteAdminApi.getSections().then(r => setItems(r.data.sections)).catch(() => flash('error', 'Failed to load.')).finally(() => setLoading(false));
  }, []);

  const update = (id, key, val) => setItems(p => p.map(s => s.id === id ? { ...s, [key]: val } : s));

  const save = async (item) => {
    setSavingId(item.id);
    try {
      let dataObj = item.data;
      if (typeof item._dataStr === 'string') dataObj = JSON.parse(item._dataStr);
      await siteAdminApi.updateSection(item.id, { title: item.title, subtitle: item.subtitle, content: item.content, data: dataObj, is_visible: item.is_visible, sort_order: item.sort_order });
      flash('success', 'Section updated!');
    } catch (e) { flash('error', e.message?.includes('JSON') ? 'Invalid JSON in data field.' : 'Failed to save.'); }
    finally { setSavingId(null); }
  };

  if (loading) return <Spinner />;

  const grouped = {};
  for (const s of items) { (grouped[s.page] = grouped[s.page] || []).push(s); }

  return (
    <div>
      {Object.entries(grouped).map(([page, sections]) => (
        <div key={page} className="mb-6">
          <h3 className="text-sm font-bold text-[#5cc4eb] uppercase tracking-wider mb-3">{page} Page</h3>
          {sections.map(s => (
            <ItemCard key={s.id} title={`${s.section_key}`} subtitle={s.title ? s.title.slice(0, 60) + '...' : 'No title'}>
              <Input label="Title" value={s.title} onChange={v => update(s.id, 'title', v)} />
              <Input label="Subtitle" value={s.subtitle} onChange={v => update(s.id, 'subtitle', v)} />
              <TArea label="Content" value={s.content} onChange={v => update(s.id, 'content', v)} />
              <TArea label="Data (JSON)" value={s._dataStr !== undefined ? s._dataStr : JSON.stringify(s.data, null, 2)} onChange={v => update(s.id, '_dataStr', v)} rows={5} mono />
              <div className="flex items-center gap-4">
                <Toggle label="Visible" value={s.is_visible} onChange={v => update(s.id, 'is_visible', v)} />
                <Input label="Sort" value={s.sort_order} onChange={v => update(s.id, 'sort_order', parseInt(v) || 0)} type="number" />
              </div>
              <Button size="sm" onClick={() => save(s)} loading={savingId === s.id}>Save Section</Button>
            </ItemCard>
          ))}
        </div>
      ))}
    </div>
  );
}

/* ═══ Generic CRUD Tab (Services, Ventures, Partners) ═══════ */
function CrudTab({ entity, nameKey, flash, fields }) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [savingId, setSavingId] = useState(null);
  const [showNew, setShowNew] = useState(false);
  const [newItem, setNewItem] = useState({});

  const apiMap = {
    services: { get: siteAdminApi.getServices, create: siteAdminApi.createService, update: siteAdminApi.updateService, del: siteAdminApi.deleteService },
    ventures: { get: siteAdminApi.getVentures, create: siteAdminApi.createVenture, update: siteAdminApi.updateVenture, del: siteAdminApi.deleteVenture },
    partners: { get: siteAdminApi.getPartners, create: siteAdminApi.createPartner, update: siteAdminApi.updatePartner, del: siteAdminApi.deletePartner },
  };
  const api = apiMap[entity];

  const load = useCallback(() => {
    setLoading(true);
    api.get().then(r => setItems(r.data[entity])).catch(() => flash('error', 'Failed to load.')).finally(() => setLoading(false));
  }, [entity]);

  useEffect(() => { load(); }, [load]);

  const update = (id, key, val) => setItems(p => p.map(s => s.id === id ? { ...s, [key]: val } : s));

  const save = async (item) => {
    setSavingId(item.id);
    try {
      const payload = {};
      for (const f of [...fields, 'is_visible', 'sort_order']) payload[f] = item[f];
      await api.update(item.id, payload);
      flash('success', 'Saved!');
    } catch { flash('error', 'Failed to save.'); }
    finally { setSavingId(null); }
  };

  const del = async (id) => {
    try { await api.del(id); setItems(p => p.filter(s => s.id !== id)); flash('success', 'Deleted.'); }
    catch { flash('error', 'Failed to delete.'); }
  };

  const create = async () => {
    try {
      await api.create({ ...newItem, sort_order: items.length + 1 });
      setShowNew(false); setNewItem({});
      load();
      flash('success', 'Created!');
    } catch { flash('error', 'Failed to create.'); }
  };

  if (loading) return <Spinner />;

  return (
    <div>
      <div className="flex justify-end mb-4">
        <Button size="sm" onClick={() => setShowNew(!showNew)}>{showNew ? 'Cancel' : `+ Add ${entity.slice(0, -1)}`}</Button>
      </div>

      {showNew && (
        <div className="bg-white border-2 border-[#5cc4eb] rounded-xl p-5 mb-4">
          <p className="text-sm font-bold text-[#5cc4eb] mb-3">New {entity.slice(0, -1)}</p>
          {fields.map(f => <Input key={f} label={f.replace(/_/g, ' ')} value={newItem[f] || ''} onChange={v => setNewItem(p => ({ ...p, [f]: v }))} />)}
          <Button size="sm" onClick={create}>Create</Button>
        </div>
      )}

      {items.map(item => (
        <ItemCard key={item.id} id={item.id} title={item[nameKey] || 'Untitled'} subtitle={`Sort: ${item.sort_order}`} onDelete={del}>
          {fields.map(f => (
            f === 'description' ? <TArea key={f} label={f.replace(/_/g, ' ')} value={item[f]} onChange={v => update(item.id, f, v)} />
              : <Input key={f} label={f.replace(/_/g, ' ')} value={item[f]} onChange={v => update(item.id, f, v)} />
          ))}
          <div className="flex items-center gap-4">
            <Toggle label="Visible" value={item.is_visible} onChange={v => update(item.id, 'is_visible', v)} />
            <Input label="Sort Order" value={item.sort_order} onChange={v => update(item.id, 'sort_order', parseInt(v) || 0)} type="number" />
          </div>
          <Button size="sm" onClick={() => save(item)} loading={savingId === item.id}>Save</Button>
        </ItemCard>
      ))}
      {items.length === 0 && <p className="text-center text-slate-400 py-8">No {entity} yet. Add one above.</p>}
    </div>
  );
}

/* ═══ TLDs Tab ═══════════════════════════════════════════════ */
function TldsTab({ flash }) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [savingId, setSavingId] = useState(null);
  const [showNew, setShowNew] = useState(false);
  const [newItem, setNewItem] = useState({ ext: '', price_pkr: '' });

  const load = () => {
    setLoading(true);
    siteAdminApi.getTlds().then(r => setItems(r.data.tlds)).catch(() => flash('error', 'Failed.')).finally(() => setLoading(false));
  };
  useEffect(() => { load(); }, []);

  const update = (id, key, val) => setItems(p => p.map(t => t.id === id ? { ...t, [key]: val } : t));

  const save = async (item) => {
    setSavingId(item.id);
    try {
      await siteAdminApi.updateTld(item.id, { ext: item.ext, price_pkr: parseFloat(item.price_pkr), is_visible: item.is_visible, sort_order: item.sort_order });
      flash('success', 'TLD updated!');
    } catch { flash('error', 'Failed.'); }
    finally { setSavingId(null); }
  };

  const del = async (id) => {
    if (!confirm('Delete this TLD?')) return;
    try { await siteAdminApi.deleteTld(id); setItems(p => p.filter(t => t.id !== id)); flash('success', 'Deleted.'); }
    catch { flash('error', 'Failed.'); }
  };

  const create = async () => {
    if (!newItem.ext || !newItem.price_pkr) { flash('error', 'Extension and price required.'); return; }
    try {
      await siteAdminApi.createTld({ ext: newItem.ext, price_pkr: parseFloat(newItem.price_pkr), sort_order: items.length + 1 });
      setShowNew(false); setNewItem({ ext: '', price_pkr: '' }); load();
      flash('success', 'TLD created!');
    } catch { flash('error', 'Failed.'); }
  };

  if (loading) return <Spinner />;

  return (
    <div>
      <div className="flex justify-end mb-4">
        <Button size="sm" onClick={() => setShowNew(!showNew)}>{showNew ? 'Cancel' : '+ Add TLD'}</Button>
      </div>

      {showNew && (
        <div className="bg-white border-2 border-[#5cc4eb] rounded-xl p-5 mb-4 flex gap-4 items-end flex-wrap">
          <Input label="Extension" value={newItem.ext} onChange={v => setNewItem(p => ({ ...p, ext: v }))} placeholder=".example" />
          <Input label="Price (PKR)" value={newItem.price_pkr} onChange={v => setNewItem(p => ({ ...p, price_pkr: v }))} type="number" />
          <Button size="sm" onClick={create}>Add</Button>
        </div>
      )}

      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
        <table className="w-full text-sm">
          <thead><tr className="bg-slate-50 text-left">
            <th className="px-4 py-3 font-semibold text-slate-600">Extension</th>
            <th className="px-4 py-3 font-semibold text-slate-600">Price (PKR)</th>
            <th className="px-4 py-3 font-semibold text-slate-600">Visible</th>
            <th className="px-4 py-3 font-semibold text-slate-600">Sort</th>
            <th className="px-4 py-3 font-semibold text-slate-600">Actions</th>
          </tr></thead>
          <tbody>
            {items.map(t => (
              <tr key={t.id} className="border-t border-slate-100 hover:bg-slate-50">
                <td className="px-4 py-2">
                  <input value={t.ext} onChange={e => update(t.id, 'ext', e.target.value)} className="w-20 px-2 py-1 border border-slate-200 rounded text-sm outline-none focus:border-[#5cc4eb]" />
                </td>
                <td className="px-4 py-2">
                  <input type="number" value={t.price_pkr} onChange={e => update(t.id, 'price_pkr', e.target.value)} className="w-24 px-2 py-1 border border-slate-200 rounded text-sm outline-none focus:border-[#5cc4eb]" />
                </td>
                <td className="px-4 py-2">
                  <Toggle value={t.is_visible} onChange={v => update(t.id, 'is_visible', v)} />
                </td>
                <td className="px-4 py-2">
                  <input type="number" value={t.sort_order} onChange={e => update(t.id, 'sort_order', parseInt(e.target.value) || 0)} className="w-16 px-2 py-1 border border-slate-200 rounded text-sm outline-none focus:border-[#5cc4eb]" />
                </td>
                <td className="px-4 py-2 flex gap-2">
                  <button onClick={() => save(t)} className="text-xs font-semibold text-[#5cc4eb] hover:underline bg-transparent border-none cursor-pointer">
                    {savingId === t.id ? '...' : 'Save'}
                  </button>
                  <button onClick={() => del(t.id)} className="text-xs font-semibold text-red-400 hover:underline bg-transparent border-none cursor-pointer">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {items.length === 0 && <p className="text-center text-slate-400 py-8">No TLDs yet.</p>}
      </div>
    </div>
  );
}
