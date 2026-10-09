import { useState } from 'react';
import { useApp } from '../App';
import { useStore } from '../store/StoreContext';
import { clients, teamMembers } from '../data/mockData';
import { Plus, Search, LayoutGrid, List, Calendar, X } from 'lucide-react';

export default function Projects() {
  const { darkMode } = useApp();
  const store = useStore();
  const [viewMode, setViewMode] = useState<'board' | 'list'>('board');
  const [statusFilter, setStatusFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [showAddProject, setShowAddProject] = useState(false);
  const [newProject, setNewProject] = useState({
    name: '',
    clientId: 'c1',
    type: 'one-off' as 'one-off' | 'retainer',
    budget: 0,
    currency: 'INR',
    startDate: new Date().toISOString().split('T')[0],
    deadline: '',
    status: 'ongoing' as 'ongoing' | 'completed',
    progress: 0,
    received: 0,
    pending: 0,
    team: ['u_001'],
  });

  const filteredProjects = store.projects.filter((p: any) => {
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || p.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getClient = (id: string) => clients.find(c => c.id === id);
  const getMember = (id: string) => teamMembers.find(m => m.id === id);

  const totalBudget = store.projects.reduce((s: number, p: any) => s + p.budget, 0);
  const totalReceived = store.projects.reduce((s: number, p: any) => s + p.received, 0);
  const totalPending = store.projects.reduce((s: number, p: any) => s + p.pending, 0);

  const handleAddProject = async () => {
    if (!newProject.name || !newProject.deadline) {
      alert('Please enter project name and deadline');
      return;
    }
    try {
      console.log('Adding project:', newProject);
      const projectData = {
        name: newProject.name,
        client_id: newProject.clientId || '',
        type: newProject.type || 'one-off',
        budget: Number(newProject.budget) || 0,
        currency: newProject.currency || 'INR',
        start_date: newProject.startDate || new Date().toISOString().split('T')[0],
        deadline: newProject.deadline,
        status: newProject.status || 'ongoing',
        progress: newProject.progress || 0,
        received: newProject.received || 0,
        pending: newProject.pending || 0,
      };
      console.log('Project data:', projectData);
      
      await store.addProject(projectData);
      console.log('Project added successfully');
      
      await store.addNotification({
        type: 'payment',
        title: 'New project created',
        message: newProject.name,
        time: 'Just now',
        read: false,
      });
      
      setNewProject({
        name: '',
        clientId: 'c1',
        type: 'one-off',
        budget: 0,
        currency: 'INR',
        startDate: new Date().toISOString().split('T')[0],
        deadline: '',
        status: 'ongoing',
        progress: 0,
        received: 0,
        pending: 0,
        team: ['u_001'],
      });
      setShowAddProject(false);
      alert('Project created successfully!');
    } catch (error: any) {
      console.error('Error adding project:', error);
      console.error('Error details:', error.message);
      console.error('Error stack:', error.stack);
      alert(`Failed to create project: ${error.message || 'Unknown error'}. Check console for details.`);
    }
  };

  const cardClass = `rounded-xl bg-white`;
  const cardStyle = { border: '1px solid #E7E5E4' };

  return (
    <div className="p-4 lg:p-8 max-w-7xl mx-auto animate-fade-in" style={{ backgroundColor: '#FAFAF8' }}>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold">Projects</h1>
          <p className="text-sm" style={{ color: '#78716C' }}>{store.projects.length} projects · {store.projects.filter((p: any) => p.status === 'ongoing').length} active</p>
        </div>
        <button onClick={() => setShowAddProject(true)} className="bg-orange-600 hover:bg-orange-700 text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 transition">
          <Plus className="w-4 h-4" /> New Project
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className={cardClass + ' p-4'} style={cardStyle}>
          <p className="text-xs" style={{ color: '#78716C' }}>Total Budget</p>
          <p className="text-xl font-bold">₹{(totalBudget / 100000).toFixed(1)}L</p>
        </div>
        <div className={cardClass + ' p-4'} style={cardStyle}>
          <p className="text-xs" style={{ color: '#78716C' }}>Received</p>
          <p className="text-xl font-bold text-green-500">₹{(totalReceived / 100000).toFixed(1)}L</p>
        </div>
        <div className={cardClass + ' p-4'} style={cardStyle}>
          <p className="text-xs" style={{ color: '#78716C' }}>Pending</p>
          <p className="text-xl font-bold text-amber-500">₹{(totalPending / 100000).toFixed(1)}L</p>
        </div>
      </div>

      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-3 mb-6">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: '#A8A29E' }} />
          <input
            type="text"
            placeholder="Search projects..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-lg text-sm bg-white border border-[#E7E5E4] text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500/30"
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-3 py-2 rounded-lg text-sm bg-white border border-[#E7E5E4] text-gray-900"
        >
          <option value="all">All Status</option>
          <option value="ongoing">Ongoing</option>
          <option value="completed">Completed</option>
        </select>
        <div className="flex rounded-lg overflow-hidden border border-[#E7E5E4]">
          <button onClick={() => setViewMode('board')} className={`p-2 ${viewMode === 'board' ? 'bg-orange-600 text-white' : 'bg-white'}`}>
            <LayoutGrid className="w-4 h-4" />
          </button>
          <button onClick={() => setViewMode('list')} className={`p-2 ${viewMode === 'list' ? 'bg-orange-600 text-white' : 'bg-white'}`}>
            <List className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Board View */}
      {viewMode === 'board' && (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {filteredProjects.map((project) => {
            const client = getClient(project.clientId);
            return (
              <div key={project.id} className={`${cardClass} p-5 hover:shadow-md transition cursor-pointer`} style={cardStyle}>
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="font-semibold" style={{ color: '#1C1917' }}>{project.name}</h3>
                    <p className="text-sm" style={{ color: '#78716C' }}>{client?.name}</p>
                  </div>
                  <span className="text-xs px-2 py-0.5 rounded-full" style={{
                    backgroundColor: project.status === 'completed' ? '#f0fdf4' : project.status === 'ongoing' ? '#eff6ff' : '#FAFAF8',
                    color: project.status === 'completed' ? '#166534' : project.status === 'ongoing' ? '#1d4ed8' : '#78716C'
                  }}>
                    {project.status}
                  </span>
                </div>

                <div className="flex items-center gap-2 mb-3">
                  <span className="text-xs px-2 py-0.5 rounded-full" style={{ backgroundColor: '#FAFAF8', color: '#78716C' }}>
                    {project.type === 'retainer' ? '🔄 Retainer' : '📦 One-off'}
                  </span>
                </div>

                {/* Budget */}
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm" style={{ color: '#78716C' }}>
                    Budget: <span className="font-semibold" style={{ color: '#1C1917' }}>{project.currency === 'USD' ? '$' : '₹'}{project.budget.toLocaleString()}</span>
                  </span>
                </div>

                {/* Financials */}
                <div className="grid grid-cols-2 gap-2 mb-3">
                  <div className="p-2 rounded-lg" style={{ backgroundColor: '#FAFAF8' }}>
                    <p className="text-xs" style={{ color: '#78716C' }}>Received</p>
                    <p className="text-sm font-semibold" style={{ color: '#16a34a' }}>{project.currency === 'USD' ? '$' : '₹'}{project.received.toLocaleString()}</p>
                  </div>
                  <div className="p-2 rounded-lg" style={{ backgroundColor: '#FAFAF8' }}>
                    <p className="text-xs" style={{ color: '#78716C' }}>Pending</p>
                    <p className="text-sm font-semibold" style={{ color: '#d97706' }}>{project.currency === 'USD' ? '$' : '₹'}{project.pending.toLocaleString()}</p>
                  </div>
                </div>

                {/* Progress */}
                <div className="mb-3">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs" style={{ color: '#78716C' }}>Progress</span>
                    <span className="text-xs font-medium" style={{ color: '#1C1917' }}>{project.progress}%</span>
                  </div>
                  <div className="h-2 rounded-full overflow-hidden" style={{ backgroundColor: '#FAFAF8' }}>
                    <div className="h-full bg-gradient-to-r from-orange-500 to-orange-400 rounded-full transition-all" style={{ width: `${project.progress}%` }} />
                  </div>
                </div>

                {/* Team & Deadline */}
                <div className="flex items-center justify-between pt-3 border-t border-dashed border-[#E7E5E4]">
                  <div className="flex -space-x-2">
                    {project.team.slice(0, 3).map((memberId: string) => {
                      const member = getMember(memberId);
                      return (
                        <div key={memberId} className="w-7 h-7 rounded-full flex items-center justify-center text-xs border-2 border-white bg-stone-100" title={member?.name}>
                          {member?.avatar}
                        </div>
                      );
                    })}
                  </div>
                  <span className="text-xs flex items-center gap-1" style={{ color: '#78716C' }}>
                    <Calendar className="w-3 h-3" /> {project.deadline}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* List View */}
      {viewMode === 'list' && (
        <div className={cardClass + ' overflow-hidden'} style={cardStyle}>
          <table className="w-full">
            <thead>
              <tr className="border-b border-[#E7E5E4]">
                <th className="text-left p-4 text-xs font-semibold text-gray-500 uppercase">Project</th>
                <th className="text-left p-4 text-xs font-semibold text-gray-500 uppercase hidden sm:table-cell">Client</th>
                <th className="text-left p-4 text-xs font-semibold text-gray-500 uppercase">Budget</th>
                <th className="text-left p-4 text-xs font-semibold text-gray-500 uppercase hidden md:table-cell">Progress</th>
                <th className="text-left p-4 text-xs font-semibold text-gray-500 uppercase">Status</th>
              </tr>
            </thead>
            <tbody>
              {filteredProjects.map((project) => {
                const client = getClient(project.clientId);
                return (
                  <tr key={project.id} className="border-b last:border-0 border-[#E7E5E4] hover:bg-stone-50 cursor-pointer transition">
                    <td className="p-4">
                      <p className="font-medium text-sm" style={{ color: '#1C1917' }}>{project.name}</p>
                      <p className="text-xs" style={{ color: '#78716C' }}>{project.deadline}</p>
                    </td>
                    <td className="p-4 text-sm hidden sm:table-cell" style={{ color: '#78716C' }}>{client?.name}</td>
                    <td className="p-4 text-sm font-medium" style={{ color: '#1C1917' }}>{project.currency === 'USD' ? '$' : '₹'}{project.budget.toLocaleString()}</td>
                    <td className="p-4 hidden md:table-cell">
                      <div className="flex items-center gap-2">
                        <div className="w-20 h-2 rounded-full overflow-hidden" style={{ backgroundColor: '#FAFAF8' }}>
                          <div className="h-full bg-orange-500 rounded-full" style={{ width: `${project.progress}%` }} />
                        </div>
                        <span className="text-xs" style={{ color: '#1C1917' }}>{project.progress}%</span>
                      </div>
                    </td>
                    <td className="p-4">
                      <span className="text-xs px-2 py-0.5 rounded-full" style={{
                        backgroundColor: project.status === 'completed' ? '#f0fdf4' : '#eff6ff',
                        color: project.status === 'completed' ? '#166534' : '#1d4ed8'
                      }}>
                        {project.status}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Add Project Modal */}
      {showAddProject && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={() => setShowAddProject(false)}>
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6 max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Create New Project</h3>
              <button onClick={() => setShowAddProject(false)} className="p-1 hover:bg-stone-100 rounded">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Project Name *</label>
                <input
                  type="text"
                  value={newProject.name}
                  onChange={(e) => setNewProject({ ...newProject, name: e.target.value })}
                  placeholder="E-commerce Redesign"
                  className="w-full px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                  style={{ border: '1px solid #E7E5E4' }}
                  autoFocus
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Client</label>
                <select
                  value={newProject.clientId}
                  onChange={(e) => setNewProject({ ...newProject, clientId: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                  style={{ border: '1px solid #E7E5E4' }}
                >
                  {clients.map(c => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium mb-1">Budget</label>
                  <input
                    type="number"
                    value={newProject.budget}
                    onChange={(e) => setNewProject({ ...newProject, budget: Number(e.target.value) })}
                    placeholder="100000"
                    className="w-full px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                    style={{ border: '1px solid #E7E5E4' }}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Currency</label>
                  <select
                    value={newProject.currency}
                    onChange={(e) => setNewProject({ ...newProject, currency: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                    style={{ border: '1px solid #E7E5E4' }}
                  >
                    <option value="INR">INR (₹)</option>
                    <option value="USD">USD ($)</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Deadline *</label>
                <input
                  type="date"
                  value={newProject.deadline}
                  onChange={(e) => setNewProject({ ...newProject, deadline: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                  style={{ border: '1px solid #E7E5E4' }}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Type</label>
                <select
                  value={newProject.type}
                  onChange={(e) => setNewProject({ ...newProject, type: e.target.value as 'one-off' | 'retainer' })}
                  className="w-full px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                  style={{ border: '1px solid #E7E5E4' }}
                >
                  <option value="one-off">One-off</option>
                  <option value="retainer">Retainer</option>
                </select>
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button onClick={() => setShowAddProject(false)} className="flex-1 px-4 py-2 rounded-lg hover:bg-stone-50" style={{ border: '1px solid #E7E5E4' }}>
                Cancel
              </button>
              <button 
                onClick={handleAddProject} 
                disabled={!newProject.name.trim() || !newProject.deadline} 
                className="flex-1 px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Create Project
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
