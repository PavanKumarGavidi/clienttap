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
    c.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const selectedClientData = clients.find(c => c.id === selectedClient);
  const clientProjects = projects.filter(p => p.clientId === selectedClient);
  const getOwner = (id: string) => teamMembers.find(m => m.id === id);

  const cardClass = `rounded-xl border ${darkMode ? 'bg-[#1a1a1a] border-white/10' : 'bg-white border-gray-200'}`;

  const tabs = [
    { id: 'overview', label: 'Overview' },
    { id: 'projects', label: 'Projects' },
    { id: 'invoices', label: 'Invoices' },
    { id: 'documents', label: 'Documents' },
    { id: 'meetings', label: 'Meetings' },
    { id: 'messages', label: 'Messages' },
  ];

  return (
    <div className="p-4 lg:p-8 max-w-7xl mx-auto animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold">Clients</h1>
          <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>{clients.length} clients · {clients.filter(c => c.portalEnabled).length} with portal access</p>
        </div>
        <button className="bg-orange-600 hover:bg-orange-700 text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 transition">
          <Plus className="w-4 h-4" /> Add Client
        </button>
      </div>

      {/* Search */}
      <div className="relative mb-6">
        <Search className={`absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 ${darkMode ? 'text-gray-500' : 'text-gray-400'}`} />
        <input
          type="text"
          placeholder="Search clients..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className={`w-full pl-10 pr-4 py-2.5 rounded-xl text-sm ${darkMode ? 'bg-white/5 border-white/10 text-white placeholder:text-gray-500' : 'bg-white border-gray-200 text-gray-900 placeholder:text-gray-400'} border focus:outline-none focus:ring-2 focus:ring-orange-500/50`}
        />
      </div>

      {/* Client List */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {filteredClients.map((client) => (
          <div
            key={client.id}
            onClick={() => { setSelectedClient(client.id); setActiveTab('overview'); }}
            className={`${cardClass} p-5 cursor-pointer transition hover:shadow-md ${selectedClient === client.id ? 'ring-2 ring-orange-500' : ''}`}
          >
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-3">
                <div className={`w-11 h-11 rounded-xl flex items-center justify-center text-lg font-bold ${darkMode ? 'bg-orange-900/30 text-orange-400' : 'bg-orange-100 text-orange-700'}`}>
                  {client.name.charAt(0)}
                </div>
                <div>
                  <h3 className="font-semibold">{client.name}</h3>
                  <p className={`text-sm ${darkMode ? 'text-gray-500' : 'text-gray-500'}`}>{client.company}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {client.portalEnabled && (
                  <span className="flex items-center gap-1 text-xs text-green-600 bg-green-100 dark:bg-green-900/30 dark:text-green-400 px-2 py-0.5 rounded-full">
                    <Globe className="w-3 h-3" /> Portal
                  </span>
                )}
                {client.gstin && (
                  <span className={`text-xs px-2 py-0.5 rounded-full ${darkMode ? 'bg-white/10 text-gray-400' : 'bg-gray-100 text-gray-600'}`}>GST</span>
                )}
              </div>
            </div>

            <div className="flex flex-wrap gap-3 mb-4">
              <span className={`flex items-center gap-1 text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                <Mail className="w-3 h-3" /> {client.email}
              </span>
              <span className={`flex items-center gap-1 text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                <Phone className="w-3 h-3" /> {client.phone}
              </span>
            </div>

            <div className="grid grid-cols-3 gap-3 pt-3 border-t border-dashed border-gray-200 dark:border-white/10">
              <div>
                <p className={`text-xs ${darkMode ? 'text-gray-500' : 'text-gray-500'}`}>Projects</p>
                <p className="text-sm font-semibold">{client.totalProjects}</p>
              </div>
              <div>
                <p className={`text-xs ${darkMode ? 'text-gray-500' : 'text-gray-500'}`}>Paid</p>
                <p className="text-sm font-semibold text-green-500">{client.currencySymbol}{(client.totalPaid / 1000).toFixed(0)}K</p>
              </div>
              <div>
                <p className={`text-xs ${darkMode ? 'text-gray-500' : 'text-gray-500'}`}>Outstanding</p>
                <p className="text-sm font-semibold text-amber-500">{client.currencySymbol}{(client.outstanding / 1000).toFixed(0)}K</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Client Detail Panel */}
      {selectedClientData && (
        <div className="fixed inset-0 z-50 flex justify-end">
          <div className="absolute inset-0 bg-black/50" onClick={() => setSelectedClient(null)} />
          <div className={`relative w-full max-w-2xl h-full overflow-y-auto ${darkMode ? 'bg-[#0f0f0f]' : 'bg-gray-50'} shadow-2xl animate-slide-in`}>
            {/* Header */}
            <div className={`sticky top-0 z-10 ${darkMode ? 'bg-[#0f0f0f]' : 'bg-gray-50'}`}>
              <div className={`p-6 border-b ${darkMode ? 'border-white/10' : 'border-gray-200'}`}>
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-4">
                    <div className={`w-14 h-14 rounded-xl flex items-center justify-center text-xl font-bold ${darkMode ? 'bg-orange-900/30 text-orange-400' : 'bg-orange-100 text-orange-700'}`}>
                      {selectedClientData.name.charAt(0)}
                    </div>
                    <div>
                      <h2 className="text-xl font-bold">{selectedClientData.name}</h2>
                      <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>{selectedClientData.company}</p>
                    </div>
                  </div>
                  <button onClick={() => setSelectedClient(null)} className={`p-2 rounded-lg ${darkMode ? 'hover:bg-white/10' : 'hover:bg-gray-200'}`}>✕</button>
                </div>

                {/* Contact info */}
                <div className="flex flex-wrap gap-4 mt-4">
                  <span className={`flex items-center gap-1.5 text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    <Mail className="w-4 h-4" /> {selectedClientData.email}
                  </span>
                  <span className={`flex items-center gap-1.5 text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    <Phone className="w-4 h-4" /> {selectedClientData.phone}
                  </span>
                  <span className={`flex items-center gap-1.5 text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    <MapPin className="w-4 h-4" /> {selectedClientData.address}
                  </span>
                  {selectedClientData.gstin && (
                    <span className={`flex items-center gap-1.5 text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                      <Shield className="w-4 h-4" /> GSTIN: {selectedClientData.gstin}
                    </span>
                  )}
                </div>

                {/* Lifetime Summary */}
                <div className="grid grid-cols-4 gap-3 mt-4">
                  <div className={`p-3 rounded-lg ${darkMode ? 'bg-white/5' : 'bg-white'}`}>
                    <p className={`text-xs ${darkMode ? 'text-gray-500' : 'text-gray-500'}`}>Invoiced</p>
                    <p className="text-lg font-bold">{selectedClientData.currencySymbol}{(selectedClientData.totalInvoiced / 1000).toFixed(0)}K</p>
                  </div>
                  <div className={`p-3 rounded-lg ${darkMode ? 'bg-white/5' : 'bg-white'}`}>
                    <p className={`text-xs ${darkMode ? 'text-gray-500' : 'text-gray-500'}`}>Paid</p>
                    <p className="text-lg font-bold text-green-500">{selectedClientData.currencySymbol}{(selectedClientData.totalPaid / 1000).toFixed(0)}K</p>
                  </div>
                  <div className={`p-3 rounded-lg ${darkMode ? 'bg-white/5' : 'bg-white'}`}>
                    <p className={`text-xs ${darkMode ? 'text-gray-500' : 'text-gray-500'}`}>Outstanding</p>
                    <p className="text-lg font-bold text-amber-500">{selectedClientData.currencySymbol}{(selectedClientData.outstanding / 1000).toFixed(0)}K</p>
                  </div>
                  <div className={`p-3 rounded-lg ${darkMode ? 'bg-white/5' : 'bg-white'}`}>
                    <p className={`text-xs ${darkMode ? 'text-gray-500' : 'text-gray-500'}`}>Since</p>
                    <p className="text-lg font-bold">{new Date(selectedClientData.since).toLocaleDateString('en-IN', { month: 'short', year: '2-digit' })}</p>
                  </div>
                </div>
              </div>

              {/* Tabs */}
              <div className={`flex overflow-x-auto border-b ${darkMode ? 'border-white/10' : 'border-gray-200'} px-6`}>
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`px-4 py-3 text-sm font-medium border-b-2 transition whitespace-nowrap ${
                      activeTab === tab.id
                        ? 'border-orange-600 text-orange-600'
                        : `border-transparent ${darkMode ? 'text-gray-400 hover:text-white' : 'text-gray-500 hover:text-gray-900'}`
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Tab Content */}
            <div className="p-6">
              {activeTab === 'overview' && (
                <div className="space-y-4">
                  <div className={cardClass}>
                    <h3 className="font-semibold mb-3">Assigned Owner</h3>
                    <p className="text-sm">{getOwner(selectedClientData.owner)?.name}</p>
                  </div>
                  <div className={cardClass}>
                    <h3 className="font-semibold mb-3">Portal Access</h3>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm">{selectedClientData.portalEnabled ? 'Enabled' : 'Disabled'}</p>
                        <p className={`text-xs ${darkMode ? 'text-gray-500' : 'text-gray-500'}`}>portal.clienttap.io/pixelcode</p>
                      </div>
                      <button className={`px-3 py-1.5 rounded-lg text-xs font-medium ${selectedClientData.portalEnabled ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' : 'bg-gray-100 text-gray-600 dark:bg-white/10 dark:text-gray-400'}`}>
                        {selectedClientData.portalEnabled ? 'Manage' : 'Enable'}
                      </button>
                    </div>
                  </div>
                  <div className={cardClass}>
                    <h3 className="font-semibold mb-3">Notes</h3>
                    <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                      Long-term client since {new Date(selectedClientData.since).getFullYear()}. Prefers email communication. GST-registered business.
                    </p>
                  </div>
                </div>
              )}

              {activeTab === 'projects' && (
                <div className="space-y-3">
                  {clientProjects.map((p) => (
                    <div key={p.id} className={`${cardClass} p-4`}>
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-medium">{p.name}</h4>
                        <span className={`text-xs px-2 py-0.5 rounded-full ${p.status === 'completed' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' : p.status === 'ongoing' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400' : 'bg-gray-100 text-gray-700 dark:bg-white/10 dark:text-gray-400'}`}>
                          {p.status}
                        </span>
                      </div>
                      <div className="flex items-center gap-4">
                        <span className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Budget: {p.currency === 'USD' ? '$' : '₹'}{p.budget.toLocaleString()}</span>
                        <span className="text-sm text-green-500">Received: {p.currency === 'USD' ? '$' : '₹'}{p.received.toLocaleString()}</span>
                      </div>
                      <div className="mt-3 h-2 bg-gray-100 dark:bg-white/10 rounded-full overflow-hidden">
                        <div className="h-full bg-orange-500 rounded-full" style={{ width: `${p.progress}%` }} />
                      </div>
                      <p className={`text-xs mt-1 ${darkMode ? 'text-gray-500' : 'text-gray-500'}`}>{p.progress}% complete</p>
                    </div>
                  ))}
                </div>
              )}

              {activeTab === 'invoices' && (
                <div className={`${cardClass} p-8 text-center`}>
                  <CreditCard className={`w-12 h-12 mx-auto mb-3 ${darkMode ? 'text-gray-600' : 'text-gray-300'}`} />
                  <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Invoice history for this client</p>
                  <p className="text-sm font-medium mt-1">Total invoiced: {selectedClientData.currencySymbol}{selectedClientData.totalInvoiced.toLocaleString()}</p>
                </div>
              )}

              {(activeTab === 'documents' || activeTab === 'meetings' || activeTab === 'messages') && (
                <div className={`${cardClass} p-8 text-center`}>
                  <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                    {activeTab === 'documents' && '📄 Contracts, proposals and quotes for this client'}
                    {activeTab === 'meetings' && '📅 Meeting history with this client'}
                    {activeTab === 'messages' && '💬 Message thread with this client'}
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
