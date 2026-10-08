import { useState } from 'react';
import { useApp } from '../App';
import { leads, pipelineStages, teamMembers } from '../data/mockData';
import { Plus, Search, Download, Upload, Phone, Mail, Building2, Clock, ArrowRight, X, Tag } from 'lucide-react';

export default function Leads() {
  const { darkMode } = useApp();
  const [selectedLead, setSelectedLead] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterSource, setFilterSource] = useState('all');

  const filteredLeads = leads.filter(l => {
    const matchesSearch = l.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          l.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          l.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesSource = filterSource === 'all' || l.source === filterSource;
    return matchesSearch && matchesSource;
  });

  const getLeadsByStage = (stageId: string) => filteredLeads.filter(l => l.stage === stageId);
  const getTeamMember = (id: string) => teamMembers.find(m => m.id === id);
  
  const openLeads = leads.filter(l => l.stage !== 's5' && l.stage !== 's6').length;
  const pipelineValue = leads.filter(l => l.stage !== 's5' && l.stage !== 's6').reduce((s, l) => s + l.value, 0);
  const wonThisMonth = leads.filter(l => l.stage === 's5').length;
  const winRate = Math.round((wonThisMonth / (wonThisMonth + leads.filter(l => l.stage === 's6').length)) * 100);

  const selectedLeadData = leads.find(l => l.id === selectedLead);

  const cardClass = `rounded-xl border ${darkMode ? 'bg-[#1a1a1a] border-white/10' : 'bg-white border-gray-200'}`;

  return (
    <div className="h-full flex flex-col animate-fade-in">
      {/* Header Stats */}
      <div className="px-4 lg:px-8 pt-6 pb-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
          <div>
            <h1 className="text-2xl font-bold">Leads Pipeline</h1>
            <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Manage your sales pipeline and convert leads to clients</p>
          </div>
          <button className="bg-orange-600 hover:bg-orange-700 text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 transition">
            <Plus className="w-4 h-4" /> Add Lead
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-4">
          <div className={`p-3 rounded-lg ${darkMode ? 'bg-white/5' : 'bg-gray-50'}`}>
            <p className={`text-xs ${darkMode ? 'text-gray-500' : 'text-gray-500'}`}>Open Leads</p>
            <p className="text-xl font-bold">{openLeads}</p>
          </div>
          <div className={`p-3 rounded-lg ${darkMode ? 'bg-white/5' : 'bg-gray-50'}`}>
            <p className={`text-xs ${darkMode ? 'text-gray-500' : 'text-gray-500'}`}>Pipeline Value</p>
            <p className="text-xl font-bold">₹{(pipelineValue / 100000).toFixed(1)}L</p>
          </div>
          <div className={`p-3 rounded-lg ${darkMode ? 'bg-white/5' : 'bg-gray-50'}`}>
            <p className={`text-xs ${darkMode ? 'text-gray-500' : 'text-gray-500'}`}>Won This Month</p>
            <p className="text-xl font-bold">{wonThisMonth}</p>
          </div>
          <div className={`p-3 rounded-lg ${darkMode ? 'bg-white/5' : 'bg-gray-50'}`}>
            <p className={`text-xs ${darkMode ? 'text-gray-500' : 'text-gray-500'}`}>Win Rate</p>
            <p className="text-xl font-bold">{winRate}%</p>
          </div>
        </div>

        {/* Toolbar */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative flex-1 min-w-[200px]">
            <Search className={`absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 ${darkMode ? 'text-gray-500' : 'text-gray-400'}`} />
            <input
              type="text"
              placeholder="Search leads..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={`w-full pl-10 pr-4 py-2 rounded-lg text-sm ${darkMode ? 'bg-white/5 border-white/10 text-white placeholder:text-gray-500' : 'bg-gray-100 border-gray-200 text-gray-900 placeholder:text-gray-400'} border focus:outline-none focus:ring-2 focus:ring-orange-500/50`}
            />
          </div>
          <select
            value={filterSource}
            onChange={(e) => setFilterSource(e.target.value)}
            className={`px-3 py-2 rounded-lg text-sm ${darkMode ? 'bg-white/5 border-white/10 text-white' : 'bg-gray-100 border-gray-200 text-gray-900'} border`}
          >
            <option value="all">All Sources</option>
            <option value="Instagram">Instagram</option>
            <option value="Website">Website</option>
            <option value="Referral">Referral</option>
            <option value="Ads">Ads</option>
            <option value="Cold Call">Cold Call</option>
          </select>
          <button className={`p-2 rounded-lg ${darkMode ? 'bg-white/5 hover:bg-white/10' : 'bg-gray-100 hover:bg-gray-200'} transition`}>
            <Upload className="w-4 h-4" />
          </button>
          <button className={`p-2 rounded-lg ${darkMode ? 'bg-white/5 hover:bg-white/10' : 'bg-gray-100 hover:bg-gray-200'} transition`}>
            <Download className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Kanban Board */}
      <div className="flex-1 overflow-x-auto px-4 lg:px-8 pb-6">
        <div className="flex gap-4 min-w-max">
          {pipelineStages.filter(s => s.id !== 's6').map((stage) => {
            const stageLeads = getLeadsByStage(stage.id);
            return (
              <div key={stage.id} className="w-72 flex-shrink-0">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: stage.color }} />
                    <h3 className="text-sm font-semibold">{stage.name}</h3>
                    <span className={`text-xs px-1.5 py-0.5 rounded-full ${darkMode ? 'bg-white/10' : 'bg-gray-100'}`}>{stageLeads.length}</span>
                  </div>
                </div>
                <div className={`space-y-2 p-2 rounded-xl min-h-[400px] ${darkMode ? 'bg-white/[0.02]' : 'bg-gray-50/50'}`}>
                  {stageLeads.map((lead) => {
                    const assignee = getTeamMember(lead.assignedTo);
                    return (
                      <div
                        key={lead.id}
                        onClick={() => setSelectedLead(lead.id)}
                        className={`p-3 rounded-lg cursor-pointer transition hover:shadow-md ${darkMode ? 'bg-[#1a1a1a] border border-white/10 hover:border-orange-500/30' : 'bg-white border border-gray-200 hover:border-orange-300'} kanban-card`}
                      >
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <p className="text-sm font-medium">{lead.name}</p>
                            <p className={`text-xs ${darkMode ? 'text-gray-500' : 'text-gray-500'} flex items-center gap-1`}>
                              <Building2 className="w-3 h-3" /> {lead.company}
                            </p>
                          </div>
                          {lead.followUp && <Clock className="w-4 h-4 text-amber-500" />}
                        </div>
                        <div className="flex items-center justify-between mt-3">
                          <span className="text-sm font-semibold text-orange-600">
                            {lead.currency === 'USD' ? `$${lead.value.toLocaleString()}` : `₹${(lead.value / 1000).toFixed(0)}K`}
                          </span>
                          <div className="flex items-center gap-2">
                            <span className={`text-xs px-2 py-0.5 rounded-full ${darkMode ? 'bg-white/10' : 'bg-gray-100'} ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                              {lead.source}
                            </span>
                            {assignee && <span className="text-sm">{assignee.avatar}</span>}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Lead Detail Drawer */}
      {selectedLeadData && (
        <div className="fixed inset-0 z-50 flex justify-end">
          <div className="absolute inset-0 bg-black/50" onClick={() => setSelectedLead(null)} />
          <div className={`relative w-full max-w-md h-full overflow-y-auto ${darkMode ? 'bg-[#1a1a1a]' : 'bg-white'} shadow-2xl animate-slide-in`}>
            <div className={`sticky top-0 z-10 flex items-center justify-between p-4 border-b ${darkMode ? 'border-white/10 bg-[#1a1a1a]' : 'border-gray-100 bg-white'}`}>
              <h2 className="text-lg font-bold">{selectedLeadData.name}</h2>
              <button onClick={() => setSelectedLead(null)} className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-white/10">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-4 space-y-6">
              {/* Details */}
              <div>
                <h3 className={`text-sm font-semibold mb-3 ${darkMode ? 'text-gray-400' : 'text-gray-500'} uppercase tracking-wide`}>Contact Details</h3>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <Mail className="w-4 h-4 text-orange-600" />
                    <span className="text-sm">{selectedLeadData.email}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Phone className="w-4 h-4 text-orange-600" />
                    <span className="text-sm">{selectedLeadData.phone}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Building2 className="w-4 h-4 text-orange-600" />
                    <span className="text-sm">{selectedLeadData.company}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Tag className="w-4 h-4 text-orange-600" />
                    <span className="text-sm">{selectedLeadData.source}</span>
                  </div>
                </div>
              </div>

              {/* Value */}
              <div className={`p-4 rounded-xl ${darkMode ? 'bg-white/5' : 'bg-orange-50'}`}>
                <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Estimated Value</p>
                <p className="text-2xl font-bold text-orange-600 mt-1">
                  {selectedLeadData.currency === 'USD' ? `$${selectedLeadData.value.toLocaleString()}` : `₹${selectedLeadData.value.toLocaleString()}`}
                </p>
              </div>

              {/* Pipeline Info */}
              <div>
                <h3 className={`text-sm font-semibold mb-3 ${darkMode ? 'text-gray-400' : 'text-gray-500'} uppercase tracking-wide`}>Pipeline</h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Stage</span>
                    <span className="text-sm font-medium">{pipelineStages.find(s => s.id === selectedLeadData.stage)?.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Assigned to</span>
                    <span className="text-sm font-medium">{getTeamMember(selectedLeadData.assignedTo)?.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Created</span>
                    <span className="text-sm font-medium">{selectedLeadData.createdAt}</span>
                  </div>
                </div>
              </div>

              {/* Activity Timeline */}
              <div>
                <h3 className={`text-sm font-semibold mb-3 ${darkMode ? 'text-gray-400' : 'text-gray-500'} uppercase tracking-wide`}>Activity</h3>
                <div className="space-y-3">
                  <div className="flex gap-3">
                    <div className="w-2 h-2 rounded-full bg-orange-500 mt-2 shrink-0" />
                    <div>
                      <p className="text-sm">Added to pipeline</p>
                      <p className={`text-xs ${darkMode ? 'text-gray-500' : 'text-gray-500'}`}>{selectedLeadData.createdAt}</p>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <div className="w-2 h-2 rounded-full bg-blue-500 mt-2 shrink-0" />
                    <div>
                      <p className="text-sm">Initial contact via {selectedLeadData.source}</p>
                      <p className={`text-xs ${darkMode ? 'text-gray-500' : 'text-gray-500'}`}>1 day after creation</p>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <div className="w-2 h-2 rounded-full bg-green-500 mt-2 shrink-0" />
                    <div>
                      <p className="text-sm">Follow-up call scheduled</p>
                      <p className={`text-xs ${darkMode ? 'text-gray-500' : 'text-gray-500'}`}>3 days ago</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="space-y-2 pt-4">
                <button className="w-full bg-orange-600 hover:bg-orange-700 text-white py-2.5 rounded-lg text-sm font-medium flex items-center justify-center gap-2 transition">
                  <ArrowRight className="w-4 h-4" /> Convert to Client
                </button>
                <button className={`w-full py-2.5 rounded-lg text-sm font-medium border transition ${darkMode ? 'border-white/10 hover:bg-white/5' : 'border-gray-200 hover:bg-gray-50'}`}>
                  Mark as Lost
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
