import { useState } from 'react';
import { useApp } from '../App';
import { projects, clients, teamMembers } from '../data/mockData';
import { Plus, Search, LayoutGrid, List, Calendar } from 'lucide-react';

export default function Projects() {
  const { darkMode } = useApp();
  const [viewMode, setViewMode] = useState<'board' | 'list'>('board');
  const [statusFilter, setStatusFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredProjects = projects.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || p.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getClient = (id: string) => clients.find(c => c.id === id);
  const getMember = (id: string) => teamMembers.find(m => m.id === id);

  const totalBudget = projects.reduce((s, p) => s + p.budget, 0);
  const totalReceived = projects.reduce((s, p) => s + p.received, 0);
  const totalPending = projects.reduce((s, p) => s + p.pending, 0);

  const cardClass = `rounded-xl border ${darkMode ? 'bg-[#1a1a1a] border-white/10' : 'bg-white border-gray-200'}`;

  return (
    <div className="p-4 lg:p-8 max-w-7xl mx-auto animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold">Projects</h1>
          <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>{projects.length} projects · {projects.filter(p => p.status === 'ongoing').length} active</p>
        </div>
        <button className="bg-orange-600 hover:bg-orange-700 text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 transition">
          <Plus className="w-4 h-4" /> New Project
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className={cardClass + ' p-4'}>
          <p className={`text-xs ${darkMode ? 'text-gray-500' : 'text-gray-500'}`}>Total Budget</p>
          <p className="text-xl font-bold">₹{(totalBudget / 100000).toFixed(1)}L</p>
        </div>
        <div className={cardClass + ' p-4'}>
          <p className={`text-xs ${darkMode ? 'text-gray-500' : 'text-gray-500'}`}>Received</p>
          <p className="text-xl font-bold text-green-500">₹{(totalReceived / 100000).toFixed(1)}L</p>
        </div>
        <div className={cardClass + ' p-4'}>
          <p className={`text-xs ${darkMode ? 'text-gray-500' : 'text-gray-500'}`}>Pending</p>
          <p className="text-xl font-bold text-amber-500">₹{(totalPending / 100000).toFixed(1)}L</p>
        </div>
      </div>

      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-3 mb-6">
        <div className="relative flex-1 min-w-[200px]">
          <Search className={`absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 ${darkMode ? 'text-gray-500' : 'text-gray-400'}`} />
          <input
            type="text"
            placeholder="Search projects..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className={`w-full pl-10 pr-4 py-2 rounded-lg text-sm ${darkMode ? 'bg-white/5 border-white/10 text-white placeholder:text-gray-500' : 'bg-white border-gray-200 text-gray-900 placeholder:text-gray-400'} border focus:outline-none focus:ring-2 focus:ring-orange-500/50`}
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className={`px-3 py-2 rounded-lg text-sm ${darkMode ? 'bg-white/5 border-white/10 text-white' : 'bg-white border-gray-200 text-gray-900'} border`}
        >
          <option value="all">All Status</option>
          <option value="ongoing">Ongoing</option>
          <option value="completed">Completed</option>
        </select>
        <div className={`flex rounded-lg overflow-hidden border ${darkMode ? 'border-white/10' : 'border-gray-200'}`}>
          <button onClick={() => setViewMode('board')} className={`p-2 ${viewMode === 'board' ? 'bg-orange-600 text-white' : darkMode ? 'bg-white/5' : 'bg-white'}`}>
            <LayoutGrid className="w-4 h-4" />
          </button>
          <button onClick={() => setViewMode('list')} className={`p-2 ${viewMode === 'list' ? 'bg-orange-600 text-white' : darkMode ? 'bg-white/5' : 'bg-white'}`}>
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
              <div key={project.id} className={`${cardClass} p-5 hover:shadow-md transition cursor-pointer`}>
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="font-semibold">{project.name}</h3>
                    <p className={`text-sm ${darkMode ? 'text-gray-500' : 'text-gray-500'}`}>{client?.name}</p>
                  </div>
                  <span className={`text-xs px-2 py-0.5 rounded-full ${
                    project.status === 'completed' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' :
                    project.status === 'ongoing' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400' :
                    'bg-gray-100 text-gray-700 dark:bg-white/10 dark:text-gray-400'
                  }`}>
                    {project.status}
                  </span>
                </div>

                <div className="flex items-center gap-2 mb-3">
                  <span className={`text-xs px-2 py-0.5 rounded-full ${darkMode ? 'bg-white/10 text-gray-400' : 'bg-gray-100 text-gray-600'}`}>
                    {project.type === 'retainer' ? '🔄 Retainer' : '📦 One-off'}
                  </span>
                </div>

                {/* Budget */}
                <div className="flex items-center justify-between mb-3">
                  <span className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    Budget: <span className="font-semibold">{project.currency === 'USD' ? '$' : '₹'}{project.budget.toLocaleString()}</span>
                  </span>
                </div>

                {/* Financials */}
                <div className="grid grid-cols-2 gap-2 mb-3">
                  <div className={`p-2 rounded-lg ${darkMode ? 'bg-white/5' : 'bg-gray-50'}`}>
                    <p className={`text-xs ${darkMode ? 'text-gray-500' : 'text-gray-500'}`}>Received</p>
                    <p className="text-sm font-semibold text-green-500">{project.currency === 'USD' ? '$' : '₹'}{project.received.toLocaleString()}</p>
                  </div>
                  <div className={`p-2 rounded-lg ${darkMode ? 'bg-white/5' : 'bg-gray-50'}`}>
                    <p className={`text-xs ${darkMode ? 'text-gray-500' : 'text-gray-500'}`}>Pending</p>
                    <p className="text-sm font-semibold text-amber-500">{project.currency === 'USD' ? '$' : '₹'}{project.pending.toLocaleString()}</p>
                  </div>
                </div>

                {/* Progress */}
                <div className="mb-3">
                  <div className="flex items-center justify-between mb-1">
                    <span className={`text-xs ${darkMode ? 'text-gray-500' : 'text-gray-500'}`}>Progress</span>
                    <span className="text-xs font-medium">{project.progress}%</span>
                  </div>
                  <div className="h-2 bg-gray-100 dark:bg-white/10 rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-orange-500 to-orange-400 rounded-full transition-all" style={{ width: `${project.progress}%` }} />
                  </div>
                </div>

                {/* Team & Deadline */}
                <div className="flex items-center justify-between pt-3 border-t border-dashed border-gray-200 dark:border-white/10">
                  <div className="flex -space-x-2">
                    {project.team.slice(0, 3).map((memberId) => {
                      const member = getMember(memberId);
                      return (
                        <div key={memberId} className={`w-7 h-7 rounded-full flex items-center justify-center text-xs border-2 ${darkMode ? 'border-[#1a1a1a] bg-white/10' : 'border-white bg-gray-100'}`} title={member?.name}>
                          {member?.avatar}
                        </div>
                      );
                    })}
                  </div>
                  <span className={`text-xs flex items-center gap-1 ${darkMode ? 'text-gray-500' : 'text-gray-500'}`}>
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
        <div className={cardClass + ' overflow-hidden'}>
          <table className="w-full">
            <thead>
              <tr className={`border-b ${darkMode ? 'border-white/10' : 'border-gray-100'}`}>
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
                  <tr key={project.id} className={`border-b last:border-0 ${darkMode ? 'border-white/5 hover:bg-white/5' : 'border-gray-50 hover:bg-gray-50'} cursor-pointer transition`}>
                    <td className="p-4">
                      <p className="font-medium text-sm">{project.name}</p>
                      <p className={`text-xs ${darkMode ? 'text-gray-500' : 'text-gray-500'}`}>{project.deadline}</p>
                    </td>
                    <td className={`p-4 text-sm hidden sm:table-cell ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>{client?.name}</td>
                    <td className="p-4 text-sm font-medium">{project.currency === 'USD' ? '$' : '₹'}{project.budget.toLocaleString()}</td>
                    <td className="p-4 hidden md:table-cell">
                      <div className="flex items-center gap-2">
                        <div className="w-20 h-2 bg-gray-100 dark:bg-white/10 rounded-full overflow-hidden">
                          <div className="h-full bg-orange-500 rounded-full" style={{ width: `${project.progress}%` }} />
                        </div>
                        <span className="text-xs">{project.progress}%</span>
                      </div>
                    </td>
                    <td className="p-4">
                      <span className={`text-xs px-2 py-0.5 rounded-full ${
                        project.status === 'completed' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' :
                        'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'
                      }`}>
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
    </div>
  );
}
