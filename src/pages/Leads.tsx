import { useState } from 'react';
import { useStore } from '../store/StoreContext';
import { pipelineStages, teamMembers } from '../data/mockData';
import { DndContext, DragEndEvent, useDraggable, useDroppable } from '@dnd-kit/core';
import { Plus, Search, Download, Upload, Phone, Mail, Building2, Clock, ArrowRight, X, Tag, Filter } from 'lucide-react';

function DraggableLead({ lead, onClick }: { lead: any; onClick: () => void }) {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: lead.id,
  });
  const style = transform ? {
    transform: `translate(${transform.x}px, ${transform.y}px)`,
  } : undefined;

  const assignee = teamMembers.find(m => m.id === lead.assignedTo);

  return (
    <div
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      onClick={onClick}
      className="p-3 rounded-xl bg-white border cursor-pointer transition hover:shadow-md kanban-card"
      style={{ borderColor: '#E7E5E4', ...style }}
    >
      <div className="flex items-start justify-between mb-2">
        <div>
          <p className="text-sm font-medium" style={{ color: '#1C1917' }}>{lead.name}</p>
          <p className="text-xs flex items-center gap-1" style={{ color: '#78716C' }}>
            <Building2 className="w-3 h-3" /> {lead.company}
          </p>
        </div>
        {lead.followUp && <Clock className="w-4 h-4" style={{ color: '#d97706' }} />}
      </div>
      <div className="flex items-center justify-between mt-3">
        <span className="text-sm font-semibold" style={{ color: '#ea580c' }}>
          {lead.currency === 'USD' ? `$${lead.value.toLocaleString()}` : `₹${(lead.value / 1000).toFixed(0)}K`}
        </span>
        <div className="flex items-center gap-2">
          <span className="text-xs px-2 py-0.5 rounded-full" style={{ backgroundColor: '#FAFAF8', color: '#78716C' }}>
            {lead.source}
          </span>
          {assignee && <span className="text-sm">{assignee.avatar}</span>}
        </div>
      </div>
    </div>
  );
}

function DroppableColumn({ id, children }: { id: string; children: React.ReactNode }) {
  const { setNodeRef, isOver } = useDroppable({ id });
  
  return (
    <div
      ref={setNodeRef}
      className={`space-y-2 p-2 rounded-xl min-h-[400px] transition-colors ${isOver ? 'bg-orange-50' : ''}`}
      style={{ backgroundColor: isOver ? '#fff7ed' : '#FAEFE2' }}
    >
      {children}
    </div>
  );
}

export default function Leads() {
  const store = useStore();
  const [selectedLead, setSelectedLead] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterSource, setFilterSource] = useState('all');
  const [showAddLead, setShowAddLead] = useState(false);
  const [newLead, setNewLead] = useState({
    name: '',
    company: '',
    email: '',
    phone: '',
    value: 0,
    currency: 'INR',
    source: 'Website',
    assignedTo: 'u_001',
  });

  const filteredLeads = store.leads.filter(l => {
    const matchesSearch = l.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         l.company.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesSource = filterSource === 'all' || l.source === filterSource;
    return matchesSearch && matchesSource;
  });

  const getLeadsByStage = (stageId: string) => filteredLeads.filter(l => l.stage === stageId);
  
  const openLeads = store.leads.filter(l => !['s5', 's6'].includes(l.stage)).length;
  const pipelineValue = store.leads.filter(l => !['s5', 's6'].includes(l.stage)).reduce((s: number, l: any) => s + l.value, 0);
  const wonThisMonth = store.leads.filter(l => l.stage === 's5').length;
  const winRate = Math.round((wonThisMonth / (wonThisMonth + store.leads.filter(l => l.stage === 's6').length || 1)) * 100);

  const selectedLeadData = store.leads.find(l => l.id === selectedLead);

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      store.moveLeadToStage(active.id as string, over.id as string);
    }
  };

  const handleAddLead = async () => {
    if (!newLead.name || !newLead.company) {
      alert('Please enter both name and company');
      return;
    }
    try {
      console.log('Adding lead:', newLead);
      const leadData = {
        name: newLead.name,
        company: newLead.company,
        email: newLead.email || '',
        phone: newLead.phone || '',
        value: newLead.value || 0,
        currency: newLead.currency || 'INR',
        stage: 's1',
        source: newLead.source || 'Website',
        assigned_to: newLead.assignedTo || 'u_001',
        follow_up: false,
        created_at: new Date().toISOString().split('T')[0],
      };
      console.log('Lead data:', leadData);
      
      await store.addLead(leadData);
      console.log('Lead added successfully');
      
      await store.addNotification({
        type: 'payment',
        title: 'New lead added',
        message: `${newLead.name} from ${newLead.company}`,
        time: 'Just now',
        read: false,
      });
      
      setNewLead({ name: '', company: '', email: '', phone: '', value: 0, currency: 'INR', source: 'Website', assignedTo: 'u_001' });
      setShowAddLead(false);
      alert('Lead added successfully!');
    } catch (error: any) {
      console.error('Error adding lead:', error);
      console.error('Error details:', error.message);
      console.error('Error stack:', error.stack);
      alert(`Failed to add lead: ${error.message || 'Unknown error'}. Check console for details.`);
    }
  };

  const handleConvertToClient = (leadId: string) => {
    store.convertLeadToClient(leadId);
    store.addNotification({
      type: 'payment',
      title: 'Lead converted to client',
      message: 'New client created successfully',
      time: 'Just now',
      read: false,
    });
    setSelectedLead(null);
  };

  return (
    <div className="h-full flex flex-col animate-fade-in" style={{ backgroundColor: '#FAFAF8' }}>
      {/* Header */}
      <div className="px-4 lg:px-8 pt-6 pb-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight" style={{ color: '#1C1917' }}>Leads Pipeline</h1>
            <p className="text-sm mt-0.5" style={{ color: '#78716C' }}>Manage your sales pipeline and convert leads to clients</p>
          </div>
          <button onClick={() => setShowAddLead(true)} className="btn-primary text-sm flex items-center gap-2 !py-2">
            <Plus className="w-4 h-4" /> Add Lead
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-4">
          {[
            { label: 'Open leads', value: openLeads },
            { label: 'Pipeline value', value: `₹${(pipelineValue / 100000).toFixed(1)}L` },
            { label: 'Won this month', value: wonThisMonth },
            { label: 'Win rate', value: `${winRate}%` },
          ].map((stat, i) => (
            <div key={i} className="bg-white rounded-xl border p-3" style={{ borderColor: '#E7E5E4' }}>
              <p className="text-xs" style={{ color: '#78716C' }}>{stat.label}</p>
              <p className="text-xl font-bold" style={{ color: '#1C1917' }}>{stat.value}</p>
            </div>
          ))}
        </div>

        {/* Toolbar */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: '#A8A29E' }} />
            <input
              type="text"
              placeholder="Search leads..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-lg text-sm bg-white border focus:outline-none focus:ring-2 focus:ring-orange-500/30"
              style={{ borderColor: '#E7E5E4', color: '#1C1917' }}
            />
          </div>
          <select
            value={filterSource}
            onChange={(e) => setFilterSource(e.target.value)}
            className="px-3 py-2 rounded-lg text-sm bg-white border"
            style={{ borderColor: '#E7E5E4', color: '#1C1917' }}
          >
            <option value="all">All Sources</option>
            <option value="Instagram">Instagram</option>
            <option value="Website">Website</option>
            <option value="Referral">Referral</option>
            <option value="Ads">Ads</option>
            <option value="Cold Call">Cold Call</option>
          </select>
        </div>
      </div>

      {/* Kanban Board */}
      <DndContext onDragEnd={handleDragEnd}>
        <div className="flex-1 overflow-x-auto px-4 lg:px-8 pb-6">
          <div className="flex gap-4 min-w-max">
            {pipelineStages.filter(s => s.id !== 's6').map((stage) => {
              const stageLeads = getLeadsByStage(stage.id);
              return (
                <div key={stage.id} className="w-72 flex-shrink-0">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full" style={{ backgroundColor: stage.color }} />
                      <h3 className="text-sm font-semibold" style={{ color: '#1C1917' }}>{stage.name}</h3>
                      <span className="text-xs px-1.5 py-0.5 rounded-full" style={{ backgroundColor: '#FAFAF8', color: '#78716C' }}>{stageLeads.length}</span>
                    </div>
                  </div>
                  <DroppableColumn id={stage.id}>
                    {stageLeads.map((lead) => (
                      <DraggableLead
                        key={lead.id}
                        lead={lead}
                        onClick={() => setSelectedLead(lead.id)}
                      />
                    ))}
                  </DroppableColumn>
                </div>
              );
            })}
          </div>
        </div>
      </DndContext>

      {/* Lead Detail Drawer */}
      {selectedLeadData && (
        <div className="fixed inset-0 z-50 flex justify-end">
          <div className="absolute inset-0 bg-black/40" onClick={() => setSelectedLead(null)} />
          <div className="relative w-full max-w-md h-full overflow-y-auto bg-white shadow-2xl animate-slide-up">
            <div className="sticky top-0 z-10 flex items-center justify-between p-4 border-b bg-white" style={{ borderColor: '#E7E5E4' }}>
              <h2 className="text-lg font-bold" style={{ color: '#1C1917' }}>{selectedLeadData.name}</h2>
              <button onClick={() => setSelectedLead(null)} className="p-2 rounded-lg hover:bg-stone-100">
                <X className="w-5 h-5" style={{ color: '#78716C' }} />
              </button>
            </div>
            <div className="p-4 space-y-6">
              <div>
                <h3 className="text-xs font-semibold uppercase tracking-wider mb-3" style={{ color: '#78716C' }}>Contact Details</h3>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <Mail className="w-4 h-4" style={{ color: '#ea580c' }} />
                    <span className="text-sm" style={{ color: '#1C1917' }}>{selectedLeadData.email}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Phone className="w-4 h-4" style={{ color: '#ea580c' }} />
                    <span className="text-sm" style={{ color: '#1C1917' }}>{selectedLeadData.phone}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Building2 className="w-4 h-4" style={{ color: '#ea580c' }} />
                    <span className="text-sm" style={{ color: '#1C1917' }}>{selectedLeadData.company}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Tag className="w-4 h-4" style={{ color: '#ea580c' }} />
                    <span className="text-sm" style={{ color: '#1C1917' }}>{selectedLeadData.source}</span>
                  </div>
                </div>
              </div>

              <div className="p-4 rounded-xl" style={{ backgroundColor: '#fff7ed' }}>
                <p className="text-sm" style={{ color: '#78716C' }}>Estimated Value</p>
                <p className="text-2xl font-bold mt-1" style={{ color: '#ea580c' }}>
                  {selectedLeadData.currency === 'USD' ? `$${selectedLeadData.value.toLocaleString()}` : `₹${selectedLeadData.value.toLocaleString()}`}
                </p>
              </div>

              <div>
                <h3 className="text-xs font-semibold uppercase tracking-wider mb-3" style={{ color: '#78716C' }}>Pipeline</h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm" style={{ color: '#78716C' }}>Stage</span>
                    <span className="text-sm font-medium" style={{ color: '#1C1917' }}>{pipelineStages.find(s => s.id === selectedLeadData.stage)?.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm" style={{ color: '#78716C' }}>Assigned to</span>
                    <span className="text-sm font-medium" style={{ color: '#1C1917' }}>{teamMembers.find(m => m.id === selectedLeadData.assignedTo)?.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm" style={{ color: '#78716C' }}>Created</span>
                    <span className="text-sm font-medium" style={{ color: '#1C1917' }}>{selectedLeadData.createdAt}</span>
                  </div>
                </div>
              </div>

              <div className="space-y-2 pt-4">
                <button 
                  onClick={() => handleConvertToClient(selectedLeadData.id)}
                  className="w-full btn-primary text-sm flex items-center justify-center gap-2"
                >
                  <ArrowRight className="w-4 h-4" /> Convert to Client
                </button>
                <button 
                  onClick={() => {
                    store.updateLead(selectedLeadData.id, { stage: 's6' });
                    setSelectedLead(null);
                  }}
                  className="w-full py-2.5 rounded-xl text-sm font-medium border transition hover:bg-stone-50" 
                  style={{ borderColor: '#E7E5E4', color: '#1C1917' }}
                >
                  Mark as Lost
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add Lead Modal */}
      {showAddLead && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={() => setShowAddLead(false)}>
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6 max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Add New Lead</h3>
              <button onClick={() => setShowAddLead(false)} className="p-1 hover:bg-stone-100 rounded">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Contact Name *</label>
                <input
                  type="text"
                  value={newLead.name}
                  onChange={(e) => setNewLead({ ...newLead, name: e.target.value })}
                  placeholder="John Doe"
                  className="w-full px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                  style={{ border: '1px solid #E7E5E4' }}
                  autoFocus
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Company *</label>
                <input
                  type="text"
                  value={newLead.company}
                  onChange={(e) => setNewLead({ ...newLead, company: e.target.value })}
                  placeholder="Acme Corp"
                  className="w-full px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                  style={{ border: '1px solid #E7E5E4' }}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Email</label>
                <input
                  type="email"
                  value={newLead.email}
                  onChange={(e) => setNewLead({ ...newLead, email: e.target.value })}
                  placeholder="john@acme.com"
                  className="w-full px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                  style={{ border: '1px solid #E7E5E4' }}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Phone</label>
                <input
                  type="tel"
                  value={newLead.phone}
                  onChange={(e) => setNewLead({ ...newLead, phone: e.target.value })}
                  placeholder="+1 234 567 8900"
                  className="w-full px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                  style={{ border: '1px solid #E7E5E4' }}
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium mb-1">Value</label>
                  <input
                    type="number"
                    value={newLead.value}
                    onChange={(e) => setNewLead({ ...newLead, value: Number(e.target.value) })}
                    placeholder="100000"
                    className="w-full px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                    style={{ border: '1px solid #E7E5E4' }}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Currency</label>
                  <select
                    value={newLead.currency}
                    onChange={(e) => setNewLead({ ...newLead, currency: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                    style={{ border: '1px solid #E7E5E4' }}
                  >
                    <option value="INR">INR (₹)</option>
                    <option value="USD">USD ($)</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Source</label>
                <select
                  value={newLead.source}
                  onChange={(e) => setNewLead({ ...newLead, source: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                  style={{ border: '1px solid #E7E5E4' }}
                >
                  <option value="Website">Website</option>
                  <option value="Instagram">Instagram</option>
                  <option value="Referral">Referral</option>
                  <option value="Ads">Ads</option>
                  <option value="Cold Call">Cold Call</option>
                </select>
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button onClick={() => setShowAddLead(false)} className="flex-1 px-4 py-2 rounded-lg hover:bg-stone-50" style={{ border: '1px solid #E7E5E4' }}>
                Cancel
              </button>
              <button 
                onClick={handleAddLead} 
                disabled={!newLead.name.trim() || !newLead.company.trim()} 
                className="flex-1 px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Add Lead
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
