'use client';
export const dynamic = 'force-dynamic';
import { useState, useEffect } from 'react';
import { siteAdminApi } from '../../../lib/api';
import Button from '../../../components/ui/Button';

const TABS = [
  { id: 'general', label: 'General' },
  { id: 'branding', label: 'Branding' },
  { id: 'seo', label: 'SEO' },
  { id: 'social', label: 'Social' },
  { id: 'code', label: 'Custom Code' },
];

const HEADING_FONTS = ['Aleo', 'Playfair Display', 'Merriweather', 'Lora', 'Roboto Slab', 'Source Serif Pro'];
const BODY_FONTS = ['Open Sans', 'Inter', 'Roboto', 'Lato', 'Poppins', 'Nunito', 'Source Sans Pro'];

function Field({ label, hint, children }) {
  return (
    <div className="mb-5">
      <label className="block text-sm font-semibold text-slate-700 mb-1.5">{label}</label>
      {children}
      {hint && <p className="text-xs text-slate-400 mt-1">{hint}</p>}
    </div>
  );
}

function TextInput({ value, onChange, placeholder, type = 'text' }) {
  return (
    <input type={type} value={value || ''} onChange={e => onChange(e.target.value)} placeholder={placeholder}
      className="w-full px-4 py-2.5 border-2 border-slate-200 rounded text-sm text-[#1d1d1d] outline-none focus:border-[#5cc4eb] transition-colors" />
  );
}

function TextArea({ value, onChange, placeholder, rows = 3, mono }) {
  return (
    <textarea value={value || ''} onChange={e => onChange(e.target.value)} placeholder={placeholder} rows={rows}
      className={`w-full px-4 py-2.5 border-2 border-slate-200 rounded text-sm text-[#1d1d1d] outline-none focus:border-[#5cc4eb] transition-colors resize-y ${mono ? 'font-mono text-xs' : ''}`} />
  );
}

function ColorField({ label, value, onChange }) {
  return (
    <Field label={label}>
      <div className="flex items-center gap-3">
        <input type="color" value={value || '#000000'} onChange={e => onChange(e.target.value)}
          className="w-10 h-10 rounded border-2 border-slate-200 cursor-pointer p-0.5" />
        <input type="text" value={value || ''} onChange={e => onChange(e.target.value)} placeholder="#000000"
          className="flex-1 px-4 py-2.5 border-2 border-slate-200 rounded text-sm font-mono text-[#1d1d1d] outline-none focus:border-[#5cc4eb] transition-colors" />
        <div className="w-10 h-10 rounded border border-slate-200" style={{ backgroundColor: value || '#000' }} />
      </div>
    </Field>
  );
}

export default function SettingsPage() {
  const [tab, setTab] = useState('general');
  const [settings, setSettings] = useState({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState(null);

  useEffect(() => {
    siteAdminApi.getSettings().then(({ data }) => {
      const flat = {};
      for (const s of data.settings) flat[s.key] = s.value;
      setSettings(flat);
    }).catch(() => setMsg({ type: 'error', text: 'Failed to load settings.' }))
      .finally(() => setLoading(false));
  }, []);

  const set = (key, val) => setSettings(p => ({ ...p, [key]: val }));

  const save = async (keys) => {
    setSaving(true); setMsg(null);
    try {
      const obj = {};
      for (const k of keys) obj[k] = settings[k];
      await siteAdminApi.bulkUpdateSettings(obj);
      setMsg({ type: 'success', text: 'Settings saved successfully!' });
    } catch { setMsg({ type: 'error', text: 'Failed to save settings.' }); }
    finally { setSaving(false); }
    setTimeout(() => setMsg(null), 4000);
  };

  if (loading) return (
    <div className="flex items-center justify-center py-20">
      <div className="animate-spin w-8 h-8 border-3 border-[#5cc4eb] border-t-transparent rounded-full" />
    </div>
  );

  return (
    <div>
      <div className="mb-6">
        <h1 style={{ fontFamily: "'Aleo',serif" }} className="text-2xl text-[#bba442]">Website Settings</h1>
        <p className="text-sm text-slate-500 mt-1">Manage your website configuration, branding, SEO, and custom code.</p>
      </div>

      {msg && (
        <div className={`mb-4 px-4 py-3 rounded text-sm font-medium ${msg.type === 'success' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-red-50 text-red-700 border border-red-200'}`}>
          {msg.text}
        </div>
      )}

      {/* Tabs */}
      <div className="flex gap-1 mb-6 bg-slate-100 rounded-lg p-1 w-fit">
        {TABS.map(t => (
          <button key={t.id} onClick={() => setTab(t.id)}
            className={`px-4 py-2 text-sm font-semibold rounded-md border-none cursor-pointer transition-all ${tab === t.id ? 'bg-white text-[#5cc4eb] shadow-sm' : 'bg-transparent text-slate-500 hover:text-[#1d1d1d]'}`}>
            {t.label}
          </button>
        ))}
      </div>

      <div className="bg-white border border-slate-200 rounded-2xl p-6">
        {/* ── General ── */}
        {tab === 'general' && (
          <>
            <Field label="Site Name"><TextInput value={settings.site_name} onChange={v => set('site_name', v)} /></Field>
            <Field label="Full Company Name"><TextInput value={settings.site_full_name} onChange={v => set('site_full_name', v)} /></Field>
            <Field label="Tagline"><TextInput value={settings.site_tagline} onChange={v => set('site_tagline', v)} /></Field>
            <Field label="Description"><TextArea value={settings.site_description} onChange={v => set('site_description', v)} rows={4} /></Field>
            <Field label="Address"><TextInput value={settings.site_address} onChange={v => set('site_address', v)} /></Field>
            <Field label="Phone"><TextInput value={settings.site_phone} onChange={v => set('site_phone', v)} /></Field>
            <Field label="Email"><TextInput value={settings.site_email} onChange={v => set('site_email', v)} type="email" /></Field>
            <Field label="Copyright Text"><TextInput value={settings.site_copyright} onChange={v => set('site_copyright', v)} /></Field>
            <Field label="Legal Text"><TextInput value={settings.site_legal} onChange={v => set('site_legal', v)} /></Field>
            <Button onClick={() => save(['site_name','site_full_name','site_tagline','site_description','site_address','site_phone','site_email','site_copyright','site_legal'])} loading={saving}>Save General Settings</Button>
          </>
        )}

        {/* ── Branding ── */}
        {tab === 'branding' && (
          <>
            <Field label="Logo URL" hint="Enter a URL to your logo image">
              <TextInput value={settings.logo_url} onChange={v => set('logo_url', v)} placeholder="https://..." />
              {settings.logo_url && <img src={settings.logo_url} alt="Logo preview" className="mt-2 h-12 object-contain bg-slate-50 rounded p-2 border border-slate-200" />}
            </Field>
            <Field label="Favicon URL">
              <TextInput value={settings.favicon_url} onChange={v => set('favicon_url', v)} placeholder="https://..." />
              {settings.favicon_url && <img src={settings.favicon_url} alt="Favicon preview" className="mt-2 h-8 w-8 object-contain bg-slate-50 rounded p-1 border border-slate-200" />}
            </Field>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <ColorField label="Primary Color" value={settings.primary_color} onChange={v => set('primary_color', v)} />
              <ColorField label="Secondary / Gold Color" value={settings.secondary_color} onChange={v => set('secondary_color', v)} />
              <ColorField label="Navy / Dark Color" value={settings.navy_color} onChange={v => set('navy_color', v)} />
              <ColorField label="Text Color" value={settings.text_color} onChange={v => set('text_color', v)} />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              <Field label="Heading Font">
                <select value={settings.heading_font || 'Aleo'} onChange={e => set('heading_font', e.target.value)}
                  className="w-full px-4 py-2.5 border-2 border-slate-200 rounded text-sm outline-none focus:border-[#5cc4eb] cursor-pointer">
                  {HEADING_FONTS.map(f => <option key={f} value={f}>{f}</option>)}
                </select>
              </Field>
              <Field label="Body Font">
                <select value={settings.body_font || 'Open Sans'} onChange={e => set('body_font', e.target.value)}
                  className="w-full px-4 py-2.5 border-2 border-slate-200 rounded text-sm outline-none focus:border-[#5cc4eb] cursor-pointer">
                  {BODY_FONTS.map(f => <option key={f} value={f}>{f}</option>)}
                </select>
              </Field>
            </div>
            <div className="mt-4 p-4 bg-slate-50 rounded-lg border border-slate-200">
              <p className="text-xs font-semibold text-slate-500 mb-2">Preview</p>
              <h3 style={{ fontFamily: `'${settings.heading_font || 'Aleo'}', serif`, color: settings.secondary_color || '#bba442' }} className="text-xl mb-1">Heading Preview</h3>
              <p style={{ fontFamily: `'${settings.body_font || 'Open Sans'}', sans-serif`, color: settings.text_color || '#1d1d1d' }} className="text-sm">Body text preview with your selected font and colors.</p>
            </div>
            <div className="mt-5">
              <Button onClick={() => save(['logo_url','favicon_url','primary_color','secondary_color','navy_color','text_color','heading_font','body_font'])} loading={saving}>Save Branding</Button>
            </div>
          </>
        )}

        {/* ── SEO ── */}
        {tab === 'seo' && (
          <>
            <Field label="Meta Title" hint="Shown in browser tab and search results"><TextInput value={settings.meta_title} onChange={v => set('meta_title', v)} /></Field>
            <Field label="Meta Description" hint="Shown in search engine results (150-160 chars recommended)"><TextArea value={settings.meta_description} onChange={v => set('meta_description', v)} rows={3} /></Field>
            <Field label="Meta Keywords" hint="Comma-separated keywords"><TextInput value={settings.meta_keywords} onChange={v => set('meta_keywords', v)} /></Field>
            <Button onClick={() => save(['meta_title','meta_description','meta_keywords'])} loading={saving}>Save SEO Settings</Button>
          </>
        )}

        {/* ── Social ── */}
        {tab === 'social' && (
          <>
            <Field label="Facebook URL"><TextInput value={settings.social_facebook} onChange={v => set('social_facebook', v)} placeholder="https://facebook.com/..." /></Field>
            <Field label="LinkedIn URL"><TextInput value={settings.social_linkedin} onChange={v => set('social_linkedin', v)} placeholder="https://linkedin.com/company/..." /></Field>
            <Field label="Twitter / X URL"><TextInput value={settings.social_twitter} onChange={v => set('social_twitter', v)} placeholder="https://twitter.com/..." /></Field>
            <Button onClick={() => save(['social_facebook','social_linkedin','social_twitter'])} loading={saving}>Save Social Links</Button>
          </>
        )}

        {/* ── Custom Code ── */}
        {tab === 'code' && (
          <>
            <div className="mb-4 p-3 bg-amber-50 border border-amber-200 rounded text-xs text-amber-700">
              Custom code is injected directly into the HTML. Use this for third-party verification tags, analytics, chat widgets, etc. Be careful with the code you add here.
            </div>
            <Field label="Custom Head Code" hint="Injected inside <head>. Use for meta tags, verification codes, stylesheets.">
              <TextArea value={settings.custom_head_code} onChange={v => set('custom_head_code', v)} rows={6} mono placeholder={'<!-- Google Search Console verification -->\n<meta name="google-site-verification" content="..." />'} />
            </Field>
            <Field label="Custom Body Code" hint="Injected before </body>. Use for chat widgets, tracking scripts.">
              <TextArea value={settings.custom_body_code} onChange={v => set('custom_body_code', v)} rows={6} mono placeholder={'<!-- Intercom / Tawk.to / Crisp chat widget -->\n<script>...</script>'} />
            </Field>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Field label="Google Analytics ID" hint="e.g. G-XXXXXXXXXX"><TextInput value={settings.google_analytics_id} onChange={v => set('google_analytics_id', v)} placeholder="G-XXXXXXXXXX" /></Field>
              <Field label="Google Tag Manager ID" hint="e.g. GTM-XXXXXXX"><TextInput value={settings.google_tag_manager_id} onChange={v => set('google_tag_manager_id', v)} placeholder="GTM-XXXXXXX" /></Field>
              <Field label="Facebook Pixel ID"><TextInput value={settings.facebook_pixel_id} onChange={v => set('facebook_pixel_id', v)} placeholder="123456789" /></Field>
            </div>
            <Button onClick={() => save(['custom_head_code','custom_body_code','google_analytics_id','google_tag_manager_id','facebook_pixel_id'])} loading={saving}>Save Custom Code</Button>
          </>
        )}
      </div>
    </div>
  );
}
