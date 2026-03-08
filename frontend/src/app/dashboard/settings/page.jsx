'use client';
export const dynamic = 'force-dynamic';
import { useState } from 'react';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Alert from '@/components/ui/Alert';

// ─── Mock user data matching users schema ─────────────────────────
const INITIAL_USER = {
  first_name: 'Ali',
  last_name: 'Khan',
  email: 'ali@techpigeon.org',
  phone: '+92 300 1234567',
  role: 'client',
  avatar_url: null,
  is_verified: true,
  created_at: '2024-03-15',
};

function ToggleSwitch({ enabled, onToggle, label, description }) {
  return (
    <div className="flex items-center justify-between py-3">
      <div>
        <div className="text-sm font-medium text-[#1d1d1d]">{label}</div>
        {description && <div className="text-xs text-slate-400 mt-0.5">{description}</div>}
      </div>
      <button
        onClick={onToggle}
        className={`relative w-11 h-6 rounded-full transition-colors duration-200 border-none cursor-pointer flex-shrink-0 ${enabled ? 'bg-[#5cc4eb]' : 'bg-slate-300'}`}
      >
        <span className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform duration-200 ${enabled ? 'translate-x-5' : ''}`} />
      </button>
    </div>
  );
}

export default function SettingsPage() {
  const [tab, setTab] = useState('profile');
  const [user, setUser] = useState(INITIAL_USER);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  // Password form
  const [passwords, setPasswords] = useState({ current: '', new_pass: '', confirm: '' });
  const [passErrors, setPassErrors] = useState({});
  const [passChanging, setPassChanging] = useState(false);
  const [passChanged, setPassChanged] = useState(false);

  // Notification preferences
  const [prefs, setPrefs] = useState({
    email_billing: true,
    email_domains: true,
    email_hosting: true,
    email_tickets: true,
    email_training: true,
    email_promotions: false,
    email_security: true,
    browser_push: false,
  });

  // 2FA
  const [twoFA, setTwoFA] = useState(false);

  const setField = (k) => (v) => setUser(p => ({ ...p, [k]: typeof v === 'object' && v?.target ? v.target.value : v }));
  const setPass = (k) => (v) => setPasswords(p => ({ ...p, [k]: typeof v === 'object' && v?.target ? v.target.value : v }));

  const saveProfile = () => {
    setSaving(true);
    setTimeout(() => { setSaving(false); setSaved(true); setTimeout(() => setSaved(false), 3000); }, 800);
  };

  const changePassword = () => {
    const errs = {};
    if (!passwords.current) errs.current = 'Required';
    if (passwords.new_pass.length < 8) errs.new_pass = 'Min 8 characters';
    if (passwords.new_pass !== passwords.confirm) errs.confirm = 'Passwords do not match';
    setPassErrors(errs);
    if (Object.keys(errs).length) return;

    setPassChanging(true);
    setTimeout(() => {
      setPassChanging(false);
      setPassChanged(true);
      setPasswords({ current: '', new_pass: '', confirm: '' });
      setTimeout(() => setPassChanged(false), 3000);
    }, 800);
  };

  const TABS = [
    { id: 'profile', label: 'Profile', icon: '👤' },
    { id: 'password', label: 'Password', icon: '🔑' },
    { id: 'notifications', label: 'Notifications', icon: '🔔' },
    { id: 'security', label: 'Security', icon: '🛡️' },
  ];

  return (
    <div>
      {/* Header */}
      <div className="mb-6">
        <h1 style={{ fontFamily: "'Aleo',serif" }} className="text-2xl text-[#bba442]">Settings</h1>
        <p className="text-sm text-slate-500 mt-1">Manage your account, security, and preferences</p>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Sidebar Tabs */}
        <div className="lg:w-56 flex-shrink-0">
          <div className="bg-white border border-slate-200 rounded-2xl p-2 lg:sticky lg:top-24">
            {TABS.map(t => (
              <button
                key={t.id}
                onClick={() => setTab(t.id)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded text-sm font-medium transition-all border-none cursor-pointer text-left ${tab === t.id ? 'bg-[#e8f6fc] text-[#5cc4eb]' : 'bg-transparent text-slate-500 hover:bg-slate-100 hover:text-[#1d1d1d]'}`}
              >
                <span>{t.icon}</span>{t.label}
              </button>
            ))}
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 min-w-0">
          {/* ═══════ PROFILE TAB ═══════ */}
          {tab === 'profile' && (
            <div className="bg-white border border-slate-200 rounded-2xl p-6">
              <h3 className="font-semibold text-lg text-[#1d1d1d] mb-1">Profile Information</h3>
              <p className="text-sm text-slate-400 mb-6">Update your personal details</p>

              {saved && <Alert type="success">Profile updated successfully!</Alert>}

              {/* Avatar Section */}
              <div className="flex items-center gap-5 mb-6 p-4 rounded bg-slate-50 border border-slate-200">
                <div className="w-16 h-16 rounded-full bg-[#1d1d1d] flex items-center justify-center text-white text-xl font-bold flex-shrink-0">
                  {user.first_name[0]}{user.last_name[0]}
                </div>
                <div>
                  <div className="font-semibold text-[#1d1d1d]">{user.first_name} {user.last_name}</div>
                  <div className="text-xs text-slate-400 mb-2">{user.email}</div>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline">Upload Photo</Button>
                    <Button size="sm" variant="ghost">Remove</Button>
                  </div>
                </div>
              </div>

              {/* Form */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4">
                <Input label="First Name" value={user.first_name} onChange={setField('first_name')} placeholder="Ali" />
                <Input label="Last Name" value={user.last_name} onChange={setField('last_name')} placeholder="Khan" />
              </div>
              <Input label="Email Address" type="email" value={user.email} onChange={setField('email')} placeholder="ali@example.com" hint={user.is_verified ? '✓ Email verified' : 'Email not verified — check your inbox'} />
              <Input label="Phone Number" type="tel" value={user.phone} onChange={setField('phone')} placeholder="+92 300 0000000" />

              {/* Account Info (read-only) */}
              <div className="grid grid-cols-2 gap-3 mt-4 p-4 rounded bg-slate-50 border border-slate-100">
                <div>
                  <div className="text-xs text-slate-400 mb-0.5">Account Type</div>
                  <div className="text-sm font-semibold text-[#1d1d1d] capitalize">{user.role}</div>
                </div>
                <div>
                  <div className="text-xs text-slate-400 mb-0.5">Member Since</div>
                  <div className="text-sm font-semibold text-[#1d1d1d]">{new Date(user.created_at).toLocaleDateString('en-PK', { year: 'numeric', month: 'long' })}</div>
                </div>
              </div>

              <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-slate-100">
                <Button variant="outline" onClick={() => setUser(INITIAL_USER)}>Reset</Button>
                <Button loading={saving} onClick={saveProfile}>Save Changes</Button>
              </div>
            </div>
          )}

          {/* ═══════ PASSWORD TAB ═══════ */}
          {tab === 'password' && (
            <div className="bg-white border border-slate-200 rounded-2xl p-6">
              <h3 className="font-semibold text-lg text-[#1d1d1d] mb-1">Change Password</h3>
              <p className="text-sm text-slate-400 mb-6">Keep your account secure by updating your password regularly</p>

              {passChanged && <Alert type="success">Password changed successfully!</Alert>}

              <div className="max-w-md">
                <Input label="Current Password" type="password" value={passwords.current} onChange={setPass('current')} placeholder="Enter current password" error={passErrors.current} />
                <Input label="New Password" type="password" value={passwords.new_pass} onChange={setPass('new_pass')} placeholder="Min. 8 characters" error={passErrors.new_pass} hint="Use a mix of letters, numbers, and symbols" />
                <Input label="Confirm New Password" type="password" value={passwords.confirm} onChange={setPass('confirm')} placeholder="Repeat new password" error={passErrors.confirm} />

                <div className="flex gap-3 mt-4">
                  <Button loading={passChanging} onClick={changePassword}>Update Password</Button>
                  <Button variant="ghost" onClick={() => { setPasswords({ current: '', new_pass: '', confirm: '' }); setPassErrors({}); }}>Cancel</Button>
                </div>
              </div>

              {/* Password Strength Tips */}
              <div className="mt-8 p-4 rounded bg-[#e8f6fc] border border-blue-100">
                <h4 className="text-sm font-semibold text-[#1d1d1d] mb-2">Password Tips</h4>
                <ul className="space-y-1.5">
                  {[
                    'Use at least 8 characters',
                    'Include uppercase and lowercase letters',
                    'Include at least one number',
                    'Include at least one special character (!@#$%)',
                    'Avoid common words or personal information',
                  ].map(tip => (
                    <li key={tip} className="flex items-center gap-2 text-xs text-slate-600">
                      <span className="text-[#5cc4eb] font-bold">*</span>{tip}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}

          {/* ═══════ NOTIFICATIONS TAB ═══════ */}
          {tab === 'notifications' && (
            <div className="bg-white border border-slate-200 rounded-2xl p-6">
              <h3 className="font-semibold text-lg text-[#1d1d1d] mb-1">Notification Preferences</h3>
              <p className="text-sm text-slate-400 mb-6">Choose how and when you want to be notified</p>

              {/* Email Notifications */}
              <div className="mb-6">
                <h4 className="text-sm font-semibold text-[#1d1d1d] mb-1">Email Notifications</h4>
                <p className="text-xs text-slate-400 mb-3">Control which emails you receive</p>
                <div className="border border-slate-200 rounded p-4 divide-y divide-slate-100">
                  <ToggleSwitch label="Billing & Invoices" description="Payment confirmations, invoice reminders" enabled={prefs.email_billing} onToggle={() => setPrefs(p => ({ ...p, email_billing: !p.email_billing }))} />
                  <ToggleSwitch label="Domain Alerts" description="Expiry warnings, transfer updates, DNS changes" enabled={prefs.email_domains} onToggle={() => setPrefs(p => ({ ...p, email_domains: !p.email_domains }))} />
                  <ToggleSwitch label="Hosting Alerts" description="Server status, maintenance, resource warnings" enabled={prefs.email_hosting} onToggle={() => setPrefs(p => ({ ...p, email_hosting: !p.email_hosting }))} />
                  <ToggleSwitch label="Support Tickets" description="Ticket replies and status updates" enabled={prefs.email_tickets} onToggle={() => setPrefs(p => ({ ...p, email_tickets: !p.email_tickets }))} />
                  <ToggleSwitch label="Training Updates" description="New modules, course completions, certificates" enabled={prefs.email_training} onToggle={() => setPrefs(p => ({ ...p, email_training: !p.email_training }))} />
                  <ToggleSwitch label="Promotions & Offers" description="Special discounts, new features, newsletter" enabled={prefs.email_promotions} onToggle={() => setPrefs(p => ({ ...p, email_promotions: !p.email_promotions }))} />
                  <ToggleSwitch label="Security Alerts" description="Login attempts, password changes, 2FA events" enabled={prefs.email_security} onToggle={() => setPrefs(p => ({ ...p, email_security: !p.email_security }))} />
                </div>
              </div>

              {/* Browser Notifications */}
              <div className="mb-6">
                <h4 className="text-sm font-semibold text-[#1d1d1d] mb-1">Browser Notifications</h4>
                <p className="text-xs text-slate-400 mb-3">Receive real-time browser push notifications</p>
                <div className="border border-slate-200 rounded p-4">
                  <ToggleSwitch label="Push Notifications" description="Get instant alerts in your browser" enabled={prefs.browser_push} onToggle={() => setPrefs(p => ({ ...p, browser_push: !p.browser_push }))} />
                </div>
              </div>

              <div className="flex justify-end">
                <Button onClick={() => {}}>Save Preferences</Button>
              </div>
            </div>
          )}

          {/* ═══════ SECURITY TAB ═══════ */}
          {tab === 'security' && (
            <div className="space-y-5">
              {/* 2FA */}
              <div className="bg-white border border-slate-200 rounded-2xl p-6">
                <h3 className="font-semibold text-lg text-[#1d1d1d] mb-1">Two-Factor Authentication</h3>
                <p className="text-sm text-slate-400 mb-4">Add an extra layer of security to your account</p>

                <div className={`flex items-center justify-between p-4 rounded border ${twoFA ? 'bg-emerald-50 border-emerald-200' : 'bg-amber-50 border-amber-200'}`}>
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded flex items-center justify-center text-lg ${twoFA ? 'bg-emerald-100' : 'bg-amber-100'}`}>
                      {twoFA ? '🔒' : '⚠️'}
                    </div>
                    <div>
                      <div className={`text-sm font-semibold ${twoFA ? 'text-emerald-800' : 'text-amber-800'}`}>
                        {twoFA ? '2FA is Enabled' : '2FA is Not Enabled'}
                      </div>
                      <div className={`text-xs ${twoFA ? 'text-emerald-600' : 'text-amber-600'}`}>
                        {twoFA ? 'Your account is protected with authenticator app' : 'We recommend enabling 2FA for maximum security'}
                      </div>
                    </div>
                  </div>
                  <Button size="sm" variant={twoFA ? 'outline' : 'primary'} onClick={() => setTwoFA(!twoFA)}>
                    {twoFA ? 'Disable' : 'Enable 2FA'}
                  </Button>
                </div>
              </div>

              {/* Active Sessions */}
              <div className="bg-white border border-slate-200 rounded-2xl p-6">
                <h3 className="font-semibold text-lg text-[#1d1d1d] mb-1">Active Sessions</h3>
                <p className="text-sm text-slate-400 mb-4">Manage devices where you're currently logged in</p>

                <div className="space-y-3">
                  {[
                    { device: 'Chrome on Windows', location: 'Rawalpindi, PK', ip: '203.215.xx.xx', current: true, lastActive: 'Now' },
                    { device: 'Safari on iPhone', location: 'Rawalpindi, PK', ip: '203.215.xx.xx', current: false, lastActive: '2h ago' },
                    { device: 'Firefox on MacOS', location: 'Islamabad, PK', ip: '115.186.xx.xx', current: false, lastActive: '3d ago' },
                  ].map((s, i) => (
                    <div key={i} className={`flex items-center justify-between p-4 rounded border ${s.current ? 'border-[#5cc4eb] bg-[#e8f6fc]' : 'border-slate-200'}`}>
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded flex items-center justify-center text-lg ${s.current ? 'bg-[#5cc4eb]/10' : 'bg-slate-100'}`}>
                          {s.device.includes('Chrome') ? '🌐' : s.device.includes('Safari') ? '📱' : '🦊'}
                        </div>
                        <div>
                          <div className="text-sm font-medium text-[#1d1d1d]">
                            {s.device}
                            {s.current && <span className="ml-2 text-xs bg-[#5cc4eb] text-white px-2 py-0.5 rounded-full font-bold">Current</span>}
                          </div>
                          <div className="text-xs text-slate-400">{s.location} &middot; {s.ip} &middot; {s.lastActive}</div>
                        </div>
                      </div>
                      {!s.current && (
                        <Button size="sm" variant="ghost" className="text-red-500 hover:bg-red-50">Revoke</Button>
                      )}
                    </div>
                  ))}
                </div>

                <div className="mt-4 pt-4 border-t border-slate-100">
                  <Button variant="danger" size="sm">Sign Out All Other Devices</Button>
                </div>
              </div>

              {/* Danger Zone */}
              <div className="bg-white border border-red-200 rounded-2xl p-6">
                <h3 className="font-semibold text-lg text-red-600 mb-1">Danger Zone</h3>
                <p className="text-sm text-slate-400 mb-4">Irreversible actions</p>

                <div className="flex items-center justify-between p-4 rounded bg-red-50 border border-red-200">
                  <div>
                    <div className="text-sm font-semibold text-red-800">Delete Account</div>
                    <div className="text-xs text-red-600">Permanently delete your account and all associated data. This cannot be undone.</div>
                  </div>
                  <Button size="sm" variant="danger">Delete Account</Button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
