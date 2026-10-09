import { useState, useEffect } from 'react';
import { useApp } from '../App';
import { useStore } from '../store/StoreContext';
import { pipelineStages } from '../data/mockData';
import { Save, Upload, Globe, Shield, CreditCard, Bell, Palette, Database, AlertTriangle, Users, FileText, Key } from 'lucide-react';

export default function Settings() {
  const { darkMode } = useApp();
  const store = useStore();
  const [activeSection, setActiveSection] = useState('profile');
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  
  const currentUser = store.currentUser;
  const currentWorkspace = store.currentWorkspace;
  
  // Profile state - initialize once
  const [profileName, setProfileName] = useState(currentUser?.name || '');
  const [profileEmail, setProfileEmail] = useState(currentUser?.email || '');
  const [profilePhone, setProfilePhone] = useState('');
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  
  // Workspace state - initialize once
  const [workspaceName, setWorkspaceName] = useState(currentWorkspace?.name || '');
  const [workspaceSlug, setWorkspaceSlug] = useState(currentWorkspace?.slug || '');
  const [workspaceCurrency, setWorkspaceCurrency] = useState(currentWorkspace?.currency || 'INR');
  const [workspaceTimezone, setTimezone] = useState(currentWorkspace?.timezone || 'Asia/Kolkata');
  
  // Only sync on initial load, not on every change
  useEffect(() => {
    if (currentUser && !profileName) {
      setProfileName(currentUser.name || '');
      setProfileEmail(currentUser.email || '');
    }
    if (currentWorkspace && !workspaceName) {
      setWorkspaceName(currentWorkspace.name || '');
      setWorkspaceSlug(currentWorkspace.slug || '');
      setWorkspaceCurrency(currentWorkspace.currency || 'INR');
      setTimezone(currentWorkspace.timezone || 'Asia/Kolkata');
    }
  }, []);
  
  const handleAvatarUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        alert('File size must be less than 2MB');
        return;
      }
      
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };
  
  const handleSaveProfile = async () => {
    setSaving(true);
    setSaveSuccess(false);
    try {
      console.log('Saving profile:', { profileName, profileEmail, avatarPreview });
      await store.updateProfile({
        name: profileName,
        email: profileEmail,
        avatar: avatarPreview || currentUser?.avatar
      });
      console.log('Profile saved successfully');
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (error) {
      console.error('Error saving profile:', error);
      alert('Failed to save profile. Check console for details.');
    } finally {
      setSaving(false);
    }
  };
  
  const handleSaveWorkspace = async () => {
    setSaving(true);
    setSaveSuccess(false);
    try {
      console.log('Saving workspace:', { workspaceName, workspaceSlug, workspaceCurrency, workspaceTimezone });
      await store.updateWorkspace({
        name: workspaceName,
        slug: workspaceSlug,
        currency: workspaceCurrency,
        timezone: workspaceTimezone
      });
      console.log('Workspace saved successfully');
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (error) {
      console.error('Error saving workspace:', error);
      alert('Failed to save workspace. Check console for details.');
    } finally {
      setSaving(false);
    }
  };

  const cardClass = `rounded-xl bg-white`;
  const cardStyle = { border: '1px solid #E7E5E4' };
  const inputClass = `w-full px-4 py-2.5 rounded-lg text-sm bg-white border focus:outline-none focus:ring-2 focus:ring-orange-500/30`;
  const labelClass = `block text-sm font-medium mb-1.5`;

  const sections = [
    { id: 'profile', label: 'Profile', icon: Users },
    { id: 'workspace', label: 'Workspace', icon: Globe },
    { id: 'tax', label: 'Tax & GST', icon: Shield },
    { id: 'invoices', label: 'Invoice Settings', icon: FileText },
    { id: 'pipeline', label: 'Pipeline Stages', icon: FileText },
    { id: 'integrations', label: 'Integrations', icon: Key },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'branding', label: 'Portal Branding', icon: Palette },
    { id: 'export', label: 'Data Export', icon: Database },
    { id: 'danger', label: 'Danger Zone', icon: AlertTriangle },
  ];

  return (
    <div className="p-4 lg:p-8 max-w-7xl mx-auto animate-fade-in">
      <h1 className="text-2xl font-bold mb-6">Settings</h1>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Sidebar */}
        <nav className={`lg:w-56 shrink-0 ${cardClass} p-3`} style={cardStyle}>
          <ul className="flex lg:flex-col gap-1 overflow-x-auto">
            {sections.map((section) => (
              <li key={section.id}>
                <button
                  onClick={() => setActiveSection(section.id)}
                  className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm font-medium transition whitespace-nowrap ${
                    activeSection === section.id
                      ? 'bg-orange-600 text-white'
                      : darkMode ? 'text-gray-400 hover:bg-white/5' : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  <section.icon className="w-4 h-4" />
                  {section.label}
                </button>
              </li>
            ))}
          </ul>
        </nav>

        {/* Content */}
        <div className="flex-1 min-w-0">
          {activeSection === 'profile' && (
            <div className={`${cardClass} p-6 space-y-6`} style={cardStyle}>
              <h2 className="text-lg font-semibold">Profile Settings</h2>
              
              {saveSuccess && (
                <div className="p-3 rounded-lg bg-green-50 border border-green-200 text-green-700 text-sm">
                  ✓ Profile saved successfully!
                </div>
              )}
              
              <div className="flex items-center gap-4">
                <div className={`w-16 h-16 rounded-xl flex items-center justify-center text-3xl overflow-hidden ${darkMode ? 'bg-white/10' : 'bg-gray-100'}`}>
                  {avatarPreview ? (
                    <img src={avatarPreview} alt="Avatar" className="w-full h-full object-cover" />
                  ) : (
                    currentUser?.avatar || '👤'
                  )}
                </div>
                <div>
                  <label className="text-sm text-orange-600 font-medium cursor-pointer hover:text-orange-700">
                    <input
                      type="file"
                      accept="image/jpeg,image/png"
                      onChange={handleAvatarUpload}
                      className="hidden"
                    />
                    Change avatar
                  </label>
                  <p className={`text-xs ${darkMode ? 'text-gray-500' : 'text-gray-500'} mt-1`}>JPG, PNG. Max 2MB.</p>
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className={labelClass}>Full Name</label>
                  <input 
                    type="text" 
                    value={profileName}
                    onChange={(e) => setProfileName(e.target.value)}
                    className={inputClass} 
                  />
                </div>
                <div>
                  <label className={labelClass}>Email</label>
                  <input 
                    type="email" 
                    value={profileEmail}
                    onChange={(e) => setProfileEmail(e.target.value)}
                    className={inputClass} 
                  />
                </div>
                <div>
                  <label className={labelClass}>Phone</label>
                  <input 
                    type="tel" 
                    value={profilePhone}
                    onChange={(e) => setProfilePhone(e.target.value)}
                    placeholder="+91 98765 43210"
                    className={inputClass} 
                  />
                </div>
                <div>
                  <label className={labelClass}>Role</label>
                  <input type="text" value="Owner" className={inputClass} disabled />
                </div>
              </div>
              <button 
                onClick={handleSaveProfile}
                disabled={saving}
                className="bg-orange-600 hover:bg-orange-700 disabled:bg-orange-400 text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 transition"
              >
                <Save className="w-4 h-4" /> {saving ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          )}

          {activeSection === 'workspace' && (
            <div className={`${cardClass} p-6 space-y-6`} style={cardStyle}>
              <h2 className="text-lg font-semibold">Workspace Settings</h2>
              
              {saveSuccess && (
                <div className="p-3 rounded-lg bg-green-50 border border-green-200 text-green-700 text-sm">
                  ✓ Workspace saved successfully!
                </div>
              )}
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className={labelClass}>Workspace Name</label>
                  <input 
                    type="text" 
                    value={workspaceName}
                    onChange={(e) => setWorkspaceName(e.target.value)}
                    className={inputClass} 
                  />
                </div>
                <div>
                  <label className={labelClass}>Agency Slug</label>
                  <div className="flex">
                    <span className="px-3 py-2.5 rounded-l-lg text-sm bg-stone-50 border border-[#E7E5E4] text-gray-500">
                      portal.clienttap.io/
                    </span>
                    <input 
                      type="text" 
                      value={workspaceSlug}
                      onChange={(e) => setWorkspaceSlug(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ''))}
                      className={`${inputClass} rounded-l-none`} 
                    />
                  </div>
                </div>
                <div>
                  <label className={labelClass}>Base Currency</label>
                  <select 
                    value={workspaceCurrency}
                    onChange={(e) => setWorkspaceCurrency(e.target.value)}
                    className={inputClass}
                  >
                    <option value="INR">INR (₹) - Indian Rupee</option>
                    <option value="USD">USD ($) - US Dollar</option>
                    <option value="GBP">GBP (£) - British Pound</option>
                    <option value="EUR">EUR (€) - Euro</option>
                  </select>
                </div>
                <div>
                  <label className={labelClass}>Timezone</label>
                  <select 
                    value={workspaceTimezone}
                    onChange={(e) => setTimezone(e.target.value)}
                    className={inputClass}
                  >
                    <option value="Asia/Kolkata">Asia/Kolkata (IST)</option>
                    <option value="America/New_York">America/New_York (EST)</option>
                    <option value="Europe/London">Europe/London (GMT)</option>
                  </select>
                </div>
                <div>
                  <label className={labelClass}>Financial Year Start</label>
                  <select className={inputClass}>
                    <option>April (India)</option>
                    <option>January</option>
                    <option>July</option>
                  </select>
                </div>
                <div>
                  <label className={labelClass}>Logo</label>
                  <div className="flex items-center gap-3 p-3 rounded-lg border border-[#E7E5E4]">
                    <span className="text-2xl">{currentWorkspace?.logo || '🏢'}</span>
                    <button className="text-sm text-orange-600 font-medium">Upload logo</button>
                  </div>
                </div>
              </div>
              <button 
                onClick={handleSaveWorkspace}
                disabled={saving}
                className="bg-orange-600 hover:bg-orange-700 disabled:bg-orange-400 text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 transition"
              >
                <Save className="w-4 h-4" /> {saving ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          )}

          {activeSection === 'tax' && (
            <div className={`${cardClass} p-6 space-y-6`} style={cardStyle}>
              <h2 className="text-lg font-semibold">Tax & GST Settings</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className={labelClass}>GSTIN</label>
                  <input type="text" defaultValue={currentWorkspace?.gstin || ''} className={inputClass} />
                </div>
                <div>
                  <label className={labelClass}>Business State</label>
                  <select className={inputClass}>
                    <option>Karnataka (29)</option>
                    <option>Maharashtra (27)</option>
                    <option>Delhi (07)</option>
                    <option>Tamil Nadu (33)</option>
                  </select>
                </div>
                <div>
                  <label className={labelClass}>Default Tax Rate (%)</label>
                  <input type="number" defaultValue={18} className={inputClass} />
                </div>
                <div>
                  <label className={labelClass}>Default SAC/HSN Code</label>
                  <input type="text" defaultValue="998314" className={inputClass} />
                </div>
              </div>
              <div className={`p-4 rounded-lg ${darkMode ? 'bg-white/5' : 'bg-blue-50'}`}>
                <p className={`text-sm ${darkMode ? 'text-gray-300' : 'text-blue-800'}`}>
                  💡 Intra-state invoices will auto-split CGST + SGST. Inter-state invoices will use IGST.
                </p>
              </div>
              <button className="bg-orange-600 hover:bg-orange-700 text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 transition">
                <Save className="w-4 h-4" /> Save Changes
              </button>
            </div>
          )}

          {activeSection === 'invoices' && (
            <div className={`${cardClass} p-6 space-y-6`} style={cardStyle}>
              <h2 className="text-lg font-semibold">Invoice Settings</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className={labelClass}>Invoice Prefix</label>
                  <input type="text" defaultValue="PC" className={inputClass} />
                </div>
                <div>
                  <label className={labelClass}>Next Number</label>
                  <input type="number" defaultValue={8} className={inputClass} />
                </div>
                <div>
                  <label className={labelClass}>Default Payment Terms</label>
                  <select className={inputClass}>
                    <option>Due on receipt</option>
                    <option>Net 15</option>
                    <option>Net 30</option>
                    <option>Net 45</option>
                  </select>
                </div>
                <div>
                  <label className={labelClass}>Bank / UPI Details</label>
                  <textarea defaultValue="HDFC Bank\nA/C: 1234567890\nIFSC: HDFC0001234\nUPI: pixelcode@hdfc" className={`${inputClass} h-24 resize-none`} />
                </div>
              </div>
              <button className="bg-orange-600 hover:bg-orange-700 text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 transition">
                <Save className="w-4 h-4" /> Save Changes
              </button>
            </div>
          )}

          {activeSection === 'pipeline' && (
            <div className={`${cardClass} p-6 space-y-6`} style={cardStyle}>
              <h2 className="text-lg font-semibold">Pipeline Stages</h2>
              <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Customize your lead pipeline stages. Drag to reorder.</p>
              <div className="space-y-2">
                {pipelineStages.map((stage) => (
                  <div key={stage.id} className={`flex items-center gap-3 p-3 rounded-lg ${darkMode ? 'bg-white/5' : 'bg-gray-50'}`}>
                    <div className="w-4 h-4 rounded-full" style={{ backgroundColor: stage.color }} />
                    <input type="text" defaultValue={stage.name} className={`flex-1 bg-transparent text-sm font-medium ${darkMode ? 'text-white' : 'text-gray-900'} focus:outline-none`} />
                    <span className={`text-xs ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>Order: {stage.order + 1}</span>
                  </div>
                ))}
              </div>
              <button className={`text-sm text-orange-600 font-medium`}>+ Add Stage</button>
            </div>
          )}

          {activeSection === 'integrations' && (
            <div className={`${cardClass} p-6 space-y-6`} style={cardStyle}>
              <h2 className="text-lg font-semibold">Integrations</h2>
              <div className="space-y-3">
                {[
                  { name: 'Google Calendar', desc: 'Two-way sync for meetings', connected: true },
                  { name: 'Google Meet', desc: 'Auto-generate meeting links', connected: true },
                  { name: 'Meta Lead Ads', desc: 'Import leads from Facebook/Instagram ads', connected: false, plan: 'Ultra' },
                  { name: 'Google Ads', desc: 'Import leads from Google Ads forms', connected: false, plan: 'Ultra' },
                  { name: 'Webhooks', desc: 'Send events to your custom endpoints', connected: false, plan: 'Ultra' },
                ].map((integration) => (
                  <div key={integration.name} className={`flex items-center justify-between p-4 rounded-lg ${darkMode ? 'bg-white/5' : 'bg-gray-50'}`}>
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="font-medium text-sm">{integration.name}</h4>
                        {integration.plan && <span className="text-xs px-2 py-0.5 rounded-full" style={{ backgroundColor: '#fff7ed', color: '#c2410c' }}>{integration.plan}</span>}
                      </div>
                      <p className={`text-xs ${darkMode ? 'text-gray-500' : 'text-gray-500'}`}>{integration.desc}</p>
                    </div>
                    <button className="text-xs px-3 py-1.5 rounded-lg font-medium" style={{
                      backgroundColor: integration.connected ? '#f0fdf4' : '#ea580c',
                      color: integration.connected ? '#166534' : '#FFFFFF'
                    }}>
                      {integration.connected ? 'Connected ✓' : 'Connect'}
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeSection === 'notifications' && (
            <div className={`${cardClass} p-6 space-y-6`} style={cardStyle}>
              <h2 className="text-lg font-semibold">Notification Preferences</h2>
              <div className="space-y-4">
                {[
                  { label: 'New messages', inApp: true, email: true },
                  { label: 'Payment received', inApp: true, email: true },
                  { label: 'Invoice overdue', inApp: true, email: true },
                  { label: 'Lead follow-up reminders', inApp: true, email: false },
                  { label: 'Meeting reminders', inApp: true, email: true },
                  { label: 'Document signed', inApp: true, email: true },
                  { label: 'Review received', inApp: true, email: false },
                  { label: 'Subscription & billing', inApp: true, email: true },
                ].map((pref) => (
                  <div key={pref.label} className="flex items-center justify-between">
                    <span className="text-sm">{pref.label}</span>
                    <div className="flex items-center gap-4">
                      <label className="flex items-center gap-2">
                        <input type="checkbox" defaultChecked={pref.inApp} className="rounded text-orange-600" />
                        <span className={`text-xs ${darkMode ? 'text-gray-500' : 'text-gray-500'}`}>In-app</span>
                      </label>
                      <label className="flex items-center gap-2">
                        <input type="checkbox" defaultChecked={pref.email} className="rounded text-orange-600" />
                        <span className={`text-xs ${darkMode ? 'text-gray-500' : 'text-gray-500'}`}>Email</span>
                      </label>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeSection === 'branding' && (
            <div className={`${cardClass} p-6 space-y-6`} style={cardStyle}>
              <h2 className="text-lg font-semibold">Portal Branding</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className={labelClass}>Portal Logo</label>
                  <div className="flex items-center gap-3 p-4 rounded-lg border border-[#E7E5E4]">
                    <span className="text-3xl">{currentWorkspace?.logo || '🏢'}</span>
                    <button className="text-sm text-orange-600 font-medium">Upload logo</button>
                  </div>
                </div>
                <div>
                  <label className={labelClass}>Brand Color</label>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-orange-600" />
                    <input type="text" defaultValue="#ea580c" className={inputClass} />
                  </div>
                </div>
                <div>
                  <label className={labelClass}>Custom Domain</label>
                  <input type="text" placeholder="clients.youragency.com" className={inputClass} />
                  <p className={`text-xs mt-1 ${darkMode ? 'text-gray-500' : 'text-gray-500'}`}>Ultra plan required</p>
                </div>
                <div>
                  <label className={labelClass}>White-Label</label>
                  <div className="flex items-center gap-3 p-3 rounded-lg border border-[#E7E5E4]">
                    <input type="checkbox" className="rounded text-orange-600" />
                    <span className="text-sm">Hide "Powered by Clienttap"</span>
                  </div>
                  <p className={`text-xs mt-1 ${darkMode ? 'text-gray-500' : 'text-gray-500'}`}>Ultra plan required</p>
                </div>
              </div>
            </div>
          )}

          {activeSection === 'export' && (
            <div className={`${cardClass} p-6 space-y-6`} style={cardStyle}>
              <h2 className="text-lg font-semibold">Data Export</h2>
              <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Export all your data anytime. No lock-in, ever.</p>
              <div className="space-y-3">
                <button className={`w-full flex items-center justify-between p-4 rounded-lg ${darkMode ? 'bg-white/5 hover:bg-white/10' : 'bg-gray-50 hover:bg-gray-100'} transition`}>
                  <div>
                    <p className="font-medium text-sm">Export as CSV</p>
                    <p className={`text-xs ${darkMode ? 'text-gray-500' : 'text-gray-500'}`}>Clients, leads, invoices, payments</p>
                  </div>
                  <span className="text-orange-600">Download →</span>
                </button>
                <button className={`w-full flex items-center justify-between p-4 rounded-lg ${darkMode ? 'bg-white/5 hover:bg-white/10' : 'bg-gray-50 hover:bg-gray-100'} transition`}>
                  <div>
                    <p className="font-medium text-sm">Export as JSON</p>
                    <p className={`text-xs ${darkMode ? 'text-gray-500' : 'text-gray-500'}`}>Full data export with all fields</p>
                  </div>
                  <span className="text-orange-600">Download →</span>
                </button>
                <button className={`w-full flex items-center justify-between p-4 rounded-lg ${darkMode ? 'bg-white/5 hover:bg-white/10' : 'bg-gray-50 hover:bg-gray-100'} transition`}>
                  <div>
                    <p className="font-medium text-sm">Export Files (ZIP)</p>
                    <p className={`text-xs ${darkMode ? 'text-gray-500' : 'text-gray-500'}`}>All uploaded files and documents</p>
                  </div>
                  <span className="text-orange-600">Download →</span>
                </button>
              </div>
            </div>
          )}

          {activeSection === 'danger' && (
            <div className={`${cardClass} p-6 space-y-6`} style={{ ...cardStyle, borderColor: 'rgba(239,68,68,0.3)' }}>
              <h2 className="text-lg font-semibold text-red-500">Danger Zone</h2>
              <div className="p-4 rounded-lg border border-red-100 bg-red-50">
                <h4 className="font-medium text-sm text-red-600">Delete Account</h4>
                <p className={`text-xs mt-1 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Permanently delete your workspace and all associated data. This cannot be undone.</p>
                <button className="mt-3 text-xs bg-red-600 text-white px-3 py-1.5 rounded-lg font-medium">Delete Workspace</button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
