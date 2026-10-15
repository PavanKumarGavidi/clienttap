import { useState } from 'react';
import { useApp } from '../App';
import { clients, projects, teamMembers } from '../data/mockData';
import { Search, Plus, Mail, Phone, MapPin, Globe, CreditCard, Shield } from 'lucide-react';

export default function Clients() {
  const { darkMode } = useApp();
  const [selectedClient, setSelectedClient] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('overview');

  const filteredClients = clients.filter(c =>
    c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.company.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const selectedClientData = clients.find(c => c.id === selectedClient);
  const clientProjects = projects.filter(p => p.clientId === selectedClient);
  const getOwner = (id: string) => teamMembers.find(m => m.id === id);

  const tabs = [
    { id: 'overview', label: 'Overview' },
    { id: 'projects', label: 'Projects' },
    { id: 'invoices', label: 'Invoices' },
    { id: 'documents', label: 'Documents' },
    { id: 'meetings', label: 'Meetings' },
    { id: 'messages', label: 'Messages' },
  ];

  return (
    <div className="p-4 lg:p-8 max-w-7xl mx-auto animate-fade-in" style={{ backgroundColor: '#FAFAF8' }}>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight" style={{ color: '#1C1917' }}>Clients</h1>
          <p className="text-sm mt-0.5" style={{ color: '#78716C' }}>{clients.length} clients · {clients.filter(c => c.portalEnabled).length} with portal access</p>
        </div>
        <button className="btn-primary text-sm flex items-center gap-2 !py-2">
          <Plus className="w-4 h-4" /> Add Client
        </button>
      </div>

      <div className="relative mb-6">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: '#A8A29E' }} />
        <input
          type="text"
          placeholder="Search clients..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 rounded-xl text-sm bg-white border focus:outline-none focus:ring-2 focus:ring-orange-500/30"
          style={{ borderColor: '#E7E5E4', color: '#1C1917' }}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {filteredClients.map((client) => (
          <div
            key={client.id}
            onClick={() => { setSelectedClient(client.id); setActiveTab('overview'); }}
            className={`bg-white rounded-2xl border p-5 cursor-pointer transition hover:shadow-md ${selectedClient === client.id ? 'ring-2 ring-orange-500' : ''}`}
            style={{ borderColor: '#E7E5E4' }}
          >
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-xl flex items-center justify-center text-lg font-semibold" style={{ backgroundColor: '#FFF8F2', color: '#c2410c' }}>
                  {client.name.charAt(0)}
                </div>
                <div>
                  <h3 className="font-semibold" style={{ color: '#1C1917' }}>{client.name}</h3>
                  <p className="text-sm" style={{ color: '#78716C' }}>{client.company}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {client.portalEnabled && (
                  <span className="flex items-center gap-1 text-xs px-2 py-0.5 rounded-full" style={{ backgroundColor: '#f0fdf4', color: '#166534' }}>
                    <Globe className="w-3 h-3" /> Portal
                  </span>
                )}
                {client.gstin && (
                  <span className="text-xs px-2 py-0.5 rounded-full" style={{ backgroundColor: '#FAFAF8', color: '#78716C' }}>GST</span>
                )}
              </div>
            </div>

            <div className="flex flex-wrap gap-3 mb-4">
              <span className="flex items-center gap-1 text-xs" style={{ color: '#78716C' }}>
                <Mail className="w-3 h-3" /> {client.email}
              </span>
              <span className="flex items-center gap-1 text-xs" style={{ color: '#78716C' }}>
                <Phone className="w-3 h-3" /> {client.phone}
              </span>
            </div>

            <div className="grid grid-cols-3 gap-3 pt-3 border-t border-dashed" style={{ borderColor: '#E7E5E4' }}>
              <div>
                <p className="text-xs" style={{ color: '#A8A29E' }}>Projects</p>
                <p className="text-sm font-semibold" style={{ color: '#1C1917' }}>{client.totalProjects}</p>
              </div>
              <div>
                <p className="text-xs" style={{ color: '#A8A29E' }}>Paid</p>
                <p className="text-sm font-semibold" style={{ color: '#16a34a' }}>{client.currencySymbol}{(client.totalPaid / 1000).toFixed(0)}K</p>
              </div>
              <div>
                <p className="text-xs" style={{ color: '#A8A29E' }}>Outstanding</p>
                <p className="text-sm font-semibold" style={{ color: '#d97706' }}>{client.currencySymbol}{(client.outstanding / 1000).toFixed(0)}K</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Client Detail Drawer */}
      {selectedClientData && (
        <div className="fixed inset-0 z-50 flex justify-end">
          <div className="absolute inset-0 bg-black/40" onClick={() => setSelectedClient(null)} />
          <div className="relative w-full max-w-2xl h-full overflow-y-auto animate-slide-up" style={{ backgroundColor: '#FAFAF8' }}>
            <div style={{ backgroundColor: '#FAFAF8' }}>
              <div className="p-6 border-b bg-white" style={{ borderColor: '#E7E5E4' }}>
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 rounded-xl flex items-center justify-center text-xl font-semibold" style={{ backgroundColor: '#FFF8F2', color: '#c2410c' }}>
                      {selectedClientData.name.charAt(0)}
                    </div>
                    <div>
                      <h2 className="text-xl font-bold" style={{ color: '#1C1917' }}>{selectedClientData.name}</h2>
                      <p className="text-sm" style={{ color: '#78716C' }}>{selectedClientData.company}</p>
                    </div>
                  </div>
                  <button onClick={() => setSelectedClient(null)} className="p-2 rounded-lg hover:bg-stone-100">✕</button>
                </div>

                <div className="flex flex-wrap gap-4 mt-4">
                  <span className="flex items-center gap-1.5 text-sm" style={{ color: '#78716C' }}>
                    <Mail className="w-4 h-4" /> {selectedClientData.email}
                  </span>
                  <span className="flex items-center gap-1.5 text-sm" style={{ color: '#78716C' }}>
                    <Phone className="w-4 h-4" /> {selectedClientData.phone}
                  </span>
                  {selectedClientData.gstin && (
                    <span className="flex items-center gap-1.5 text-sm" style={{ color: '#78716C' }}>
                      <Shield className="w-4 h-4" /> GSTIN: {selectedClientData.gstin}
                    </span>
                  )}
                </div>

                <div className="grid grid-cols-4 gap-3 mt-4">
                  <div className="bg-white rounded-lg border p-3" style={{ borderColor: '#E7E5E4' }}>
                    <p className="text-xs" style={{ color: '#A8A29E' }}>Invoiced</p>
                    <p className="text-lg font-bold" style={{ color: '#1C1917' }}>{selectedClientData.currencySymbol}{(selectedClientData.totalInvoiced / 1000).toFixed(0)}K</p>
                  </div>
                  <div className="bg-white rounded-lg border p-3" style={{ borderColor: '#E7E5E4' }}>
                    <p className="text-xs" style={{ color: '#A8A29E' }}>Paid</p>
                    <p className="text-lg font-bold" style={{ color: '#16a34a' }}>{selectedClientData.currencySymbol}{(selectedClientData.totalPaid / 1000).toFixed(0)}K</p>
                  </div>
                  <div className="bg-white rounded-lg border p-3" style={{ borderColor: '#E7E5E4' }}>
                    <p className="text-xs" style={{ color: '#A8A29E' }}>Outstanding</p>
                    <p className="text-lg font-bold" style={{ color: '#d97706' }}>{selectedClientData.currencySymbol}{(selectedClientData.outstanding / 1000).toFixed(0)}K</p>
                  </div>
                  <div className="bg-white rounded-lg border p-3" style={{ borderColor: '#E7E5E4' }}>
                    <p className="text-xs" style={{ color: '#A8A29E' }}>Since</p>
                    <p className="text-lg font-bold" style={{ color: '#1C1917' }}>{new Date(selectedClientData.since).toLocaleDateString('en-IN', { month: 'short', year: '2-digit' })}</p>
                  </div>
                </div>
              </div>

              <div className="flex overflow-x-auto border-b bg-white px-6" style={{ borderColor: '#E7E5E4' }}>
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`px-4 py-3 text-sm font-medium border-b-2 transition whitespace-nowrap ${
                      activeTab === tab.id ? 'border-orange-600' : 'border-transparent'
                    }`}
                    style={activeTab === tab.id ? { color: '#ea580c' } : { color: '#78716C' }}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="p-6">
              {activeTab === 'overview' && (
                <div className="space-y-4">
                  <div className="bg-white rounded-2xl border p-5" style={{ borderColor: '#E7E5E4' }}>
                    <h3 className="font-semibold mb-3" style={{ color: '#1C1917' }}>Assigned Owner</h3>
                    <p className="text-sm" style={{ color: '#78716C' }}>{getOwner(selectedClientData.owner)?.name}</p>
                  </div>
                  <div className="bg-white rounded-2xl border p-5" style={{ borderColor: '#E7E5E4' }}>
                    <h3 className="font-semibold mb-3" style={{ color: '#1C1917' }}>Portal Access</h3>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm" style={{ color: '#1C1917' }}>{selectedClientData.portalEnabled ? 'Enabled' : 'Disabled'}</p>
                        <p className="text-xs" style={{ color: '#A8A29E' }}>portal.clienttap.io/pixelcode</p>
                      </div>
                      <button className={`px-3 py-1.5 rounded-lg text-xs font-medium ${selectedClientData.portalEnabled ? '' : ''}`} style={selectedClientData.portalEnabled ? { backgroundColor: '#f0fdf4', color: '#166534' } : { backgroundColor: '#FAFAF8', color: '#78716C' }}>
                        {selectedClientData.portalEnabled ? 'Manage' : 'Enable'}
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'projects' && (
                <div className="space-y-3">
                  {clientProjects.map((p) => (
                    <div key={p.id} className="bg-white rounded-2xl border p-4" style={{ borderColor: '#E7E5E4' }}>
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-medium" style={{ color: '#1C1917' }}>{p.name}</h4>
                        <span className="text-xs px-2 py-0.5 rounded-full" style={p.status === 'completed' ? { backgroundColor: '#f0fdf4', color: '#166534' } : { backgroundColor: '#eff6ff', color: '#1d4ed8' }}>
                          {p.status}
                        </span>
                      </div>
                      <div className="mt-3 h-2 rounded-full overflow-hidden" style={{ backgroundColor: '#FAFAF8' }}>
                        <div className="h-full rounded-full" style={{ width: `${p.progress}%`, backgroundColor: '#ea580c' }} />
                      </div>
                      <p className="text-xs mt-1" style={{ color: '#A8A29E' }}>{p.progress}% complete</p>
                    </div>
                  ))}
                </div>
              )}

              {['invoices', 'documents', 'meetings', 'messages'].includes(activeTab) && (
                <div className="bg-white rounded-2xl border p-8 text-center" style={{ borderColor: '#E7E5E4' }}>
                  <p className="text-sm" style={{ color: '#78716C' }}>
                    {activeTab === 'invoices' && '💳 Invoice history for this client'}
                    {activeTab === 'documents' && '📄 Contracts, proposals and quotes'}
                    {activeTab === 'meetings' && '📅 Meeting history'}
                    {activeTab === 'messages' && '💬 Message thread'}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
