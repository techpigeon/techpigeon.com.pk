'use client';
export const dynamic = 'force-dynamic';
import { useState, useEffect, useCallback } from 'react';
import { siteAdminApi } from '../../../lib/api';
import Button from '../../../components/ui/Button';

const TABS = [
  { id: 'sections', label: 'Page Sections' },
  { id: 'pages', label: 'Blank Pages' },
  { id: 'nav', label: 'Navigation' },
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
      {tab === 'pages' && <PagesTab flash={flash} />}
      {tab === 'nav' && <NavTab flash={flash} />}
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
  const [showNew, setShowNew] = useState(false);
  const [newSection, setNewSection] = useState({ page: '', section_key: '', title: '', subtitle: '', content: '', data: '{}', sort_order: 0, is_visible: true, status: 'draft', is_archived: false, show_on_homepage: false });

  useEffect(() => {
    siteAdminApi.getSections().then(r => setItems(r.data.sections)).catch(() => flash('error', 'Failed to load.')).finally(() => setLoading(false));
  }, []);

  const update = (id, key, val) => setItems(p => p.map(s => s.id === id ? { ...s, [key]: val } : s));

  const save = async (item) => {
    setSavingId(item.id);
    try {
      let dataObj = item.data;
      if (typeof item._dataStr === 'string') dataObj = JSON.parse(item._dataStr);
      await siteAdminApi.updateSection(item.id, {
        title: item.title,
        subtitle: item.subtitle,
        content: item.content,
        data: dataObj,
        is_visible: item.is_visible,
        sort_order: item.sort_order,
        status: item.status,
        is_archived: item.is_archived,
        show_on_homepage: item.show_on_homepage,
      });
      flash('success', 'Section updated!');
    } catch (e) { flash('error', e.message?.includes('JSON') ? 'Invalid JSON in data field.' : 'Failed to save.'); }
    finally { setSavingId(null); }
  };

  if (loading) return <Spinner />;

  const createSection = async () => {
    if (!newSection.page || !newSection.section_key) {
      flash('error', 'Page and section key are required.');
      return;
    }
    try {
      await siteAdminApi.createSection({
        ...newSection,
        data: newSection.data ? JSON.parse(newSection.data) : {},
      });
      setShowNew(false);
      setNewSection({ page: '', section_key: '', title: '', subtitle: '', content: '', data: '{}', sort_order: 0, is_visible: true, status: 'draft', is_archived: false, show_on_homepage: false });
      const r = await siteAdminApi.getSections();
      setItems(r.data.sections);
      flash('success', 'Section created.');
    } catch {
      flash('error', 'Failed to create section. Check JSON field.');
    }
  };

  const grouped = {};
  for (const s of items) { (grouped[s.page] = grouped[s.page] || []).push(s); }

  return (
    <div>
      <div className="flex justify-end mb-4">
        <Button size="sm" onClick={() => setShowNew(!showNew)}>{showNew ? 'Cancel' : '+ Add Section'}</Button>
      </div>

      {showNew && (
        <div className="bg-white border-2 border-[#5cc4eb] rounded-xl p-5 mb-4">
          <p className="text-sm font-bold text-[#5cc4eb] mb-3">New Section</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <Input label="Page slug" value={newSection.page} onChange={v => setNewSection(p => ({ ...p, page: v.toLowerCase().trim() }))} placeholder="home / about / custom-page" />
            <Input label="Section key" value={newSection.section_key} onChange={v => setNewSection(p => ({ ...p, section_key: v.trim() }))} placeholder="hero / features / cta" />
          </div>
          <Input label="Title" value={newSection.title} onChange={v => setNewSection(p => ({ ...p, title: v }))} />
          <Input label="Subtitle" value={newSection.subtitle} onChange={v => setNewSection(p => ({ ...p, subtitle: v }))} />
          <TArea label="Content" value={newSection.content} onChange={v => setNewSection(p => ({ ...p, content: v }))} />
          <TArea label="Data (JSON)" value={newSection.data} onChange={v => setNewSection(p => ({ ...p, data: v }))} rows={4} mono />
          <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
            <Input label="Sort" type="number" value={newSection.sort_order} onChange={v => setNewSection(p => ({ ...p, sort_order: parseInt(v) || 0 }))} />
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">Status</label>
              <select value={newSection.status} onChange={e => setNewSection(p => ({ ...p, status: e.target.value }))} className="w-full px-3 py-2 border-2 border-slate-200 rounded text-sm outline-none focus:border-[#5cc4eb]">
                <option value="draft">Draft</option>
                <option value="published">Published</option>
                <option value="archived">Archived</option>
              </select>
            </div>
            <Toggle label="Visible" value={newSection.is_visible} onChange={v => setNewSection(p => ({ ...p, is_visible: v }))} />
            <Toggle label="Show on Homepage" value={newSection.show_on_homepage} onChange={v => setNewSection(p => ({ ...p, show_on_homepage: v }))} />
          </div>
          <Button size="sm" onClick={createSection}>Create Section</Button>
        </div>
      )}

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
                <Toggle label="Show on Homepage" value={!!s.show_on_homepage} onChange={v => update(s.id, 'show_on_homepage', v)} />
                <Toggle label="Archived" value={!!s.is_archived} onChange={v => update(s.id, 'is_archived', v)} />
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">Status</label>
                  <select value={s.status || 'draft'} onChange={e => update(s.id, 'status', e.target.value)} className="px-3 py-2 border-2 border-slate-200 rounded text-sm outline-none focus:border-[#5cc4eb]">
                    <option value="draft">Draft</option>
                    <option value="published">Published</option>
                    <option value="archived">Archived</option>
                  </select>
                </div>
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

/* ═══ Pages Tab (blank pages, publish/archive) ═══════════════ */
function PagesTab({ flash }) {
  const [pages, setPages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showNew, setShowNew] = useState(false);
  const [newPage, setNewPage] = useState({ slug: '', title: '', description: '', status: 'draft', show_in_homepage: false, sort_order: 0 });

  const load = useCallback(() => {
    setLoading(true);
    siteAdminApi.getPages().then(r => setPages(r.data.pages || [])).catch(() => flash('error', 'Failed to load pages.')).finally(() => setLoading(false));
  }, []);

  useEffect(() => { load(); }, [load]);

  const update = (id, key, val) => setPages(p => p.map(pg => pg.id === id ? { ...pg, [key]: val } : pg));

  const create = async () => {
    if (!newPage.slug || !newPage.title) return flash('error', 'Slug and title are required.');
    try {
      await siteAdminApi.createPage(newPage);
      setShowNew(false);
      setNewPage({ slug: '', title: '', description: '', status: 'draft', show_in_homepage: false, sort_order: 0 });
      load();
      flash('success', 'Blank page created.');
    } catch { flash('error', 'Failed to create page.'); }
  };

  const save = async (page) => {
    try {
      await siteAdminApi.updatePage(page.id, {
        slug: page.slug,
        title: page.title,
        description: page.description,
        status: page.status,
        show_in_homepage: page.show_in_homepage,
        sort_order: page.sort_order,
      });
      flash('success', 'Page updated.');
    } catch { flash('error', 'Failed to update page.'); }
  };

  const del = async (id) => {
    if (!confirm('Delete page and its sections?')) return;
    try { await siteAdminApi.deletePage(id); setPages(p => p.filter(pg => pg.id !== id)); flash('success', 'Page deleted.'); }
    catch { flash('error', 'Failed to delete page.'); }
  };

  if (loading) return <Spinner />;

  return (
    <div>
      <div className="flex justify-end mb-4">
        <Button size="sm" onClick={() => setShowNew(!showNew)}>{showNew ? 'Cancel' : '+ Add Blank Page'}</Button>
      </div>

      {showNew && (
        <div className="bg-white border-2 border-[#5cc4eb] rounded-xl p-5 mb-4">
          <p className="text-sm font-bold text-[#5cc4eb] mb-3">Create Blank Page</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <Input label="Page Slug" value={newPage.slug} onChange={v => setNewPage(p => ({ ...p, slug: v.toLowerCase().replace(/\s+/g, '-') }))} placeholder="new-page" />
            <Input label="Title" value={newPage.title} onChange={v => setNewPage(p => ({ ...p, title: v }))} placeholder="New Page Title" />
          </div>
          <TArea label="Description" value={newPage.description} onChange={v => setNewPage(p => ({ ...p, description: v }))} rows={2} />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">Status</label>
              <select value={newPage.status} onChange={e => setNewPage(p => ({ ...p, status: e.target.value }))} className="w-full px-3 py-2 border-2 border-slate-200 rounded text-sm outline-none focus:border-[#5cc4eb]">
                <option value="draft">Draft</option>
                <option value="published">Published</option>
                <option value="archived">Archived</option>
              </select>
            </div>
            <Input label="Sort Order" type="number" value={newPage.sort_order} onChange={v => setNewPage(p => ({ ...p, sort_order: parseInt(v) || 0 }))} />
            <Toggle label="Show on Homepage" value={newPage.show_in_homepage} onChange={v => setNewPage(p => ({ ...p, show_in_homepage: v }))} />
          </div>
          <Button size="sm" onClick={create}>Create Page</Button>
        </div>
      )}

      {pages.map(page => (
        <ItemCard key={page.id} id={page.id} title={`${page.title} (${page.slug})`} subtitle={`Status: ${page.status}`} onDelete={del}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <Input label="Slug" value={page.slug} onChange={v => update(page.id, 'slug', v.toLowerCase().replace(/\s+/g, '-'))} />
            <Input label="Title" value={page.title} onChange={v => update(page.id, 'title', v)} />
          </div>
          <TArea label="Description" value={page.description} onChange={v => update(page.id, 'description', v)} rows={2} />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">Status</label>
              <select value={page.status || 'draft'} onChange={e => update(page.id, 'status', e.target.value)} className="w-full px-3 py-2 border-2 border-slate-200 rounded text-sm outline-none focus:border-[#5cc4eb]">
                <option value="draft">Draft</option>
                <option value="published">Published</option>
                <option value="archived">Archived</option>
              </select>
            </div>
            <Input label="Sort Order" type="number" value={page.sort_order} onChange={v => update(page.id, 'sort_order', parseInt(v) || 0)} />
            <Toggle label="Homepage Visible" value={!!page.show_in_homepage} onChange={v => update(page.id, 'show_in_homepage', v)} />
          </div>
          <Button size="sm" onClick={() => save(page)}>Save Page</Button>
        </ItemCard>
      ))}

      {pages.length === 0 && <p className="text-center text-slate-400 py-8">No pages created yet.</p>}
    </div>
  );
}

/* ═══ Navigation Tab (main + sub links) ═══════════════════════ */
function NavTab({ flash }) {
  const [links, setLinks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showNew, setShowNew] = useState(false);
  const [newLink, setNewLink] = useState({ label: '', href: '', position: 'primary', link_type: 'main', parent_id: '', sort_order: 0, is_visible: true, is_published: true });

  const load = useCallback(() => {
    setLoading(true);
    siteAdminApi.getNav().then(r => setLinks(r.data.links || [])).catch(() => flash('error', 'Failed to load nav links.')).finally(() => setLoading(false));
  }, []);

  useEffect(() => { load(); }, [load]);

  const mains = links.filter(l => (l.link_type || 'main') === 'main');
  const children = links.filter(l => (l.link_type || 'main') === 'sub');
  const groupedChildren = mains.reduce((acc, m) => ({ ...acc, [m.id]: children.filter(c => c.parent_id === m.id) }), {});

  const update = (id, key, val) => setLinks(p => p.map(l => l.id === id ? { ...l, [key]: val } : l));

  const create = async () => {
    if (!newLink.label || !newLink.href) return flash('error', 'Label and href are required.');
    try {
      await siteAdminApi.createNav({
        ...newLink,
        parent_id: newLink.link_type === 'sub' ? (newLink.parent_id || null) : null,
      });
      setShowNew(false);
      setNewLink({ label: '', href: '', position: 'primary', link_type: 'main', parent_id: '', sort_order: 0, is_visible: true, is_published: true });
      load();
      flash('success', 'Navigation link created.');
    } catch { flash('error', 'Failed to create navigation link.'); }
  };

  const save = async (link) => {
    try {
      await siteAdminApi.updateNav(link.id, {
        label: link.label,
        href: link.href,
        position: link.position,
        link_type: link.link_type || 'main',
        parent_id: link.link_type === 'sub' ? (link.parent_id || null) : null,
        is_visible: link.is_visible,
        is_published: link.is_published,
        sort_order: link.sort_order,
      });
      flash('success', 'Navigation link updated.');
    } catch { flash('error', 'Failed to update navigation link.'); }
  };

  const del = async (id) => {
    if (!confirm('Delete this nav link?')) return;
    try { await siteAdminApi.deleteNav(id); setLinks(p => p.filter(l => l.id !== id)); flash('success', 'Nav link deleted.'); }
    catch { flash('error', 'Failed to delete nav link.'); }
  };

  if (loading) return <Spinner />;

  return (
    <div>
      <div className="flex justify-end mb-4">
        <Button size="sm" onClick={() => setShowNew(!showNew)}>{showNew ? 'Cancel' : '+ Add Nav Link'}</Button>
      </div>

      {showNew && (
        <div className="bg-white border-2 border-[#5cc4eb] rounded-xl p-5 mb-4">
          <p className="text-sm font-bold text-[#5cc4eb] mb-3">New Navigation Link</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <Input label="Label" value={newLink.label} onChange={v => setNewLink(p => ({ ...p, label: v }))} />
            <Input label="Href" value={newLink.href} onChange={v => setNewLink(p => ({ ...p, href: v }))} placeholder="/about or https://..." />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">Link Type</label>
              <select value={newLink.link_type} onChange={e => setNewLink(p => ({ ...p, link_type: e.target.value }))} className="w-full px-3 py-2 border-2 border-slate-200 rounded text-sm outline-none focus:border-[#5cc4eb]">
                <option value="main">Main Link</option>
                <option value="sub">Sub Link</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">Position</label>
              <select value={newLink.position} onChange={e => setNewLink(p => ({ ...p, position: e.target.value }))} className="w-full px-3 py-2 border-2 border-slate-200 rounded text-sm outline-none focus:border-[#5cc4eb]">
                <option value="primary">Primary</option>
                <option value="secondary">Secondary</option>
              </select>
            </div>
            {newLink.link_type === 'sub' && (
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">Parent Main Link</label>
                <select value={newLink.parent_id} onChange={e => setNewLink(p => ({ ...p, parent_id: e.target.value }))} className="w-full px-3 py-2 border-2 border-slate-200 rounded text-sm outline-none focus:border-[#5cc4eb]">
                  <option value="">Select parent</option>
                  {mains.map(m => <option key={m.id} value={m.id}>{m.label}</option>)}
                </select>
              </div>
            )}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <Input label="Sort Order" type="number" value={newLink.sort_order} onChange={v => setNewLink(p => ({ ...p, sort_order: parseInt(v) || 0 }))} />
            <Toggle label="Visible" value={newLink.is_visible} onChange={v => setNewLink(p => ({ ...p, is_visible: v }))} />
            <Toggle label="Published" value={newLink.is_published} onChange={v => setNewLink(p => ({ ...p, is_published: v }))} />
          </div>
          <Button size="sm" onClick={create}>Create Nav Link</Button>
        </div>
      )}

      {mains.map(main => (
        <ItemCard key={main.id} id={main.id} title={main.label} subtitle={`${main.href} • ${main.position}`} onDelete={del}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <Input label="Label" value={main.label} onChange={v => update(main.id, 'label', v)} />
            <Input label="Href" value={main.href} onChange={v => update(main.id, 'href', v)} />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">Position</label>
              <select value={main.position || 'primary'} onChange={e => update(main.id, 'position', e.target.value)} className="w-full px-3 py-2 border-2 border-slate-200 rounded text-sm outline-none focus:border-[#5cc4eb]">
                <option value="primary">Primary</option>
                <option value="secondary">Secondary</option>
              </select>
            </div>
            <Input label="Sort" type="number" value={main.sort_order} onChange={v => update(main.id, 'sort_order', parseInt(v) || 0)} />
            <Toggle label="Visible" value={!!main.is_visible} onChange={v => update(main.id, 'is_visible', v)} />
            <Toggle label="Published" value={main.is_published !== false} onChange={v => update(main.id, 'is_published', v)} />
          </div>

          {groupedChildren[main.id]?.length > 0 && (
            <div className="bg-slate-50 border border-slate-200 rounded p-3 mb-3">
              <p className="text-xs font-semibold text-slate-600 mb-2">Sub Links</p>
              {groupedChildren[main.id].map(sub => (
                <div key={sub.id} className="border border-slate-200 bg-white rounded p-3 mb-2">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <Input label="Label" value={sub.label} onChange={v => update(sub.id, 'label', v)} />
                    <Input label="Href" value={sub.href} onChange={v => update(sub.id, 'href', v)} />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    <Input label="Sort" type="number" value={sub.sort_order} onChange={v => update(sub.id, 'sort_order', parseInt(v) || 0)} />
                    <Toggle label="Visible" value={!!sub.is_visible} onChange={v => update(sub.id, 'is_visible', v)} />
                    <Toggle label="Published" value={sub.is_published !== false} onChange={v => update(sub.id, 'is_published', v)} />
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline" onClick={() => save(sub)}>Save Sub Link</Button>
                    <Button size="sm" variant="danger" onClick={() => del(sub.id)}>Delete</Button>
                  </div>
                </div>
              ))}
            </div>
          )}

          <Button size="sm" onClick={() => save(main)}>Save Main Link</Button>
        </ItemCard>
      ))}

      {mains.length === 0 && <p className="text-center text-slate-400 py-8">No nav links yet.</p>}
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
