import { useApp } from '../App';
import { workspace, currentUser, projects, clients, retainers, revenueData, revenueByType, leadsBySource, meetings, payments } from '../data/mockData';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, AreaChart, Area, CartesianGrid } from 'recharts';
import { TrendingUp, Users, FolderOpen, Clock, Plus, Calendar, Bell, DollarSign } from 'lucide-react';

export default function Dashboard() {
  const { darkMode } = useApp();

  const openLeads = 7;
  const pipelineValue = 2745000;
  const wonThisMonth = 1;
  const winRate = 68;
  const newProjects = projects.filter(p => p.status === 'ongoing').length;
  const completedProjects = projects.filter(p => p.status === 'completed').length;
  const totalClients = clients.length;
  const activeRetainers = retainers.filter(r => r.status === 'active').length;
  const mrr = retainers.filter(r => r.status === 'active').reduce((sum, r) => sum + r.amount, 0);
  
  const totalRevenue = projects.reduce((sum, p) => sum + p.budget, 0);
  const totalReceived = payments.reduce((sum, p) => sum + p.amount, 0);
  const totalPending = totalRevenue - totalReceived;
  const totalExpenses = 256500;
  const moneyInAccount = totalReceived - totalExpenses;

  const upcomingMeetings = meetings.filter(m => m.status === 'upcoming').slice(0, 3);

  const cardClass = `p-5 rounded-xl border ${darkMode ? 'bg-[#1a1a1a] border-white/10' : 'bg-white border-gray-200'}`;
  const labelClass = `text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`;

  return (
    <div className="p-4 lg:p-8 max-w-7xl mx-auto animate-fade-in">
      {/* Greeting */}
      <div className="mb-8">
        <h1 className="text-2xl lg:text-3xl font-bold">Good morning, {currentUser.name.split(' ')[0]} 👋</h1>
        <p className={`mt-1 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
          {new Date().toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
        </p>
      </div>

      {/* Sales Pipeline Summary */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className={cardClass}>
          <p className={labelClass}>Open Leads</p>
          <p className="text-2xl font-bold mt-1">{openLeads}</p>
          <p className="text-xs text-green-500 mt-1 flex items-center gap-1"><TrendingUp className="w-3 h-3" /> +3 this week</p>
        </div>
        <div className={cardClass}>
          <p className={labelClass}>Pipeline Value</p>
          <p className="text-2xl font-bold mt-1">₹{(pipelineValue / 100000).toFixed(1)}L</p>
          <p className="text-xs text-green-500 mt-1 flex items-center gap-1"><TrendingUp className="w-3 h-3" /> +12%</p>
        </div>
        <div className={cardClass}>
          <p className={labelClass}>Won This Month</p>
          <p className="text-2xl font-bold mt-1">{wonThisMonth}</p>
          <p className={`text-xs mt-1 ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>GreenLeaf Organics</p>
        </div>
        <div className={cardClass}>
          <p className={labelClass}>Win Rate</p>
          <p className="text-2xl font-bold mt-1">{winRate}%</p>
          <p className="text-xs text-green-500 mt-1 flex items-center gap-1"><TrendingUp className="w-3 h-3" /> +5%</p>
        </div>
      </div>

      {/* Leads by Source */}
      <div className={`${cardClass} mb-6`}>
        <h3 className="font-semibold mb-4">Leads by Source</h3>
        <div className="space-y-3">
          {leadsBySource.map((source) => (
            <div key={source.source} className="flex items-center gap-3">
              <span className={`text-sm w-20 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>{source.source}</span>
              <div className="flex-1 h-6 bg-gray-100 dark:bg-white/5 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-orange-500 to-orange-400 rounded-full flex items-center justify-end pr-2"
                  style={{ width: `${(source.count / 12) * 100}%` }}
                >
                  <span className="text-xs text-white font-medium">{source.count}</span>
                </div>
              </div>
              <span className={`text-sm w-20 text-right ${darkMode ? 'text-gray-500' : 'text-gray-500'}`}>₹{(source.value / 100000).toFixed(1)}L</span>
            </div>
          ))}
        </div>
      </div>

      {/* This Month Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className={`${cardClass} border-l-4 border-l-orange-500`}>
          <p className={labelClass}>Revenue</p>
          <p className="text-2xl font-bold mt-1">₹{(totalRevenue / 100000).toFixed(1)}L</p>
          <p className={`text-xs mt-1 ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>{projects.length} projects</p>
        </div>
        <div className={`${cardClass} border-l-4 border-l-green-500`}>
          <p className={labelClass}>Received</p>
          <p className="text-2xl font-bold mt-1">₹{(totalReceived / 100000).toFixed(1)}L</p>
          <p className="text-xs text-green-500 mt-1">This month</p>
        </div>
        <div className={`${cardClass} border-l-4 border-l-red-500`}>
          <p className={labelClass}>Expenses</p>
          <p className="text-2xl font-bold mt-1">₹{(totalExpenses / 100000).toFixed(1)}L</p>
          <p className={`text-xs mt-1 ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>Team + tools</p>
        </div>
        <div className={`${cardClass} border-l-4 border-l-blue-500`}>
          <p className={labelClass}>In Account</p>
          <p className="text-2xl font-bold mt-1">₹{(moneyInAccount / 100000).toFixed(1)}L</p>
          <p className="text-xs text-blue-500 mt-1">Net positive</p>
        </div>
      </div>

      {/* Pipeline & Clients Counts */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
        <div className={cardClass}>
          <p className={labelClass}>New</p>
          <p className="text-xl font-bold mt-1">{projects.filter(p => p.status === 'ongoing' && p.progress < 30).length}</p>
        </div>
        <div className={cardClass}>
          <p className={labelClass}>Ongoing</p>
          <p className="text-xl font-bold mt-1">{newProjects}</p>
        </div>
        <div className={cardClass}>
          <p className={labelClass}>Completed</p>
          <p className="text-xl font-bold mt-1">{completedProjects}</p>
        </div>
        <div className={cardClass}>
          <p className={labelClass}>Total Clients</p>
          <p className="text-xl font-bold mt-1">{totalClients}</p>
        </div>
        <div className={`${cardClass} bg-gradient-to-br ${darkMode ? 'from-orange-950/30 to-orange-900/10' : 'from-orange-50 to-orange-100/50'}`}>
          <p className={labelClass}>Active Retainers</p>
          <p className="text-xl font-bold mt-1">{activeRetainers}</p>
          <p className="text-xs text-orange-600 mt-1">MRR: ₹{(mrr / 1000).toFixed(0)}K</p>
        </div>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        {/* Revenue Trend */}
        <div className={`${cardClass} lg:col-span-2`}>
          <h3 className="font-semibold mb-4">6-Month Revenue Trend</h3>
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={revenueData}>
              <defs>
                <linearGradient id="receivedGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#22c55e" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#22c55e" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="pendingGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#f59e0b" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke={darkMode ? '#333' : '#eee'} />
              <XAxis dataKey="month" tick={{ fontSize: 12, fill: darkMode ? '#888' : '#666' }} />
              <YAxis tick={{ fontSize: 12, fill: darkMode ? '#888' : '#666' }} tickFormatter={(v) => `₹${(v/100000).toFixed(0)}L`} />
              <Tooltip 
                contentStyle={{ background: darkMode ? '#1a1a1a' : '#fff', border: darkMode ? '1px solid #333' : '1px solid #eee', borderRadius: 8 }}
                formatter={(value: number) => [`₹${(value/1000).toFixed(0)}K`, '']}
              />
              <Area type="monotone" dataKey="received" stroke="#22c55e" fill="url(#receivedGrad)" strokeWidth={2} name="Received" />
              <Area type="monotone" dataKey="pending" stroke="#f59e0b" fill="url(#pendingGrad)" strokeWidth={2} name="Pending" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Revenue by Type */}
        <div className={cardClass}>
          <h3 className="font-semibold mb-4">Revenue by Type</h3>
          <ResponsiveContainer width="100%" height={160}>
            <PieChart>
              <Pie data={revenueByType} cx="50%" cy="50%" innerRadius={45} outerRadius={70} dataKey="value" paddingAngle={3}>
                {revenueByType.map((entry, index) => (
                  <Cell key={index} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip formatter={(value: number) => [`₹${(value/100000).toFixed(1)}L`, '']} />
            </PieChart>
          </ResponsiveContainer>
          <div className="flex justify-center gap-6 mt-2">
            {revenueByType.map((item) => (
              <div key={item.name} className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                <span className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>{item.name}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* All-time Overview */}
      <div className={`${cardClass} mb-6`}>
        <h3 className="font-semibold mb-4">All-Time Overview</h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          <div>
            <p className={`text-xs ${darkMode ? 'text-gray-500' : 'text-gray-500'}`}>Collected</p>
            <p className="text-lg font-bold text-green-500">{((totalReceived / totalRevenue) * 100).toFixed(0)}%</p>
          </div>
          <div>
            <p className={`text-xs ${darkMode ? 'text-gray-500' : 'text-gray-500'}`}>Total Value</p>
            <p className="text-lg font-bold">₹{(totalRevenue / 100000).toFixed(1)}L</p>
          </div>
          <div>
            <p className={`text-xs ${darkMode ? 'text-gray-500' : 'text-gray-500'}`}>Received</p>
            <p className="text-lg font-bold text-green-500">₹{(totalReceived / 100000).toFixed(1)}L</p>
          </div>
          <div>
            <p className={`text-xs ${darkMode ? 'text-gray-500' : 'text-gray-500'}`}>Pending</p>
            <p className="text-lg font-bold text-amber-500">₹{(totalPending / 100000).toFixed(1)}L</p>
          </div>
          <div>
            <p className={`text-xs ${darkMode ? 'text-gray-500' : 'text-gray-500'}`}>Expenses</p>
            <p className="text-lg font-bold text-red-500">₹{(totalExpenses / 100000).toFixed(1)}L</p>
          </div>
          <div>
            <p className={`text-xs ${darkMode ? 'text-gray-500' : 'text-gray-500'}`}>In Account</p>
            <p className="text-lg font-bold text-blue-500">₹{(moneyInAccount / 100000).toFixed(1)}L</p>
          </div>
        </div>
      </div>

      {/* Bottom Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Upcoming Reminders */}
        <div className={cardClass}>
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold">Upcoming</h3>
            <Bell className={`w-4 h-4 ${darkMode ? 'text-gray-500' : 'text-gray-400'}`} />
          </div>
          <div className="space-y-3">
            {upcomingMeetings.map((m) => (
              <div key={m.id} className={`flex items-center gap-3 p-3 rounded-lg ${darkMode ? 'bg-white/5' : 'bg-gray-50'}`}>
                <div className="w-10 h-10 bg-orange-100 dark:bg-orange-900/30 rounded-lg flex items-center justify-center">
                  <Calendar className="w-5 h-5 text-orange-600" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium truncate">{m.title}</p>
                  <p className={`text-xs ${darkMode ? 'text-gray-500' : 'text-gray-500'}`}>{m.date} at {m.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Clients */}
        <div className={cardClass}>
          <h3 className="font-semibold mb-4">Recent Clients</h3>
          <div className="space-y-3">
            {clients.slice(0, 4).map((c) => (
              <div key={c.id} className="flex items-center gap-3">
                <div className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold ${darkMode ? 'bg-white/10' : 'bg-gray-100'}`}>
                  {c.name.charAt(0)}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium truncate">{c.name}</p>
                  <p className={`text-xs ${darkMode ? 'text-gray-500' : 'text-gray-500'}`}>{c.phone}</p>
                </div>
                <span className={`text-xs ${darkMode ? 'text-gray-600' : 'text-gray-400'}`}>2h ago</span>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div className={cardClass}>
          <h3 className="font-semibold mb-4">Quick Actions</h3>
          <div className="space-y-2">
            <button className={`w-full flex items-center gap-3 p-3 rounded-lg text-sm font-medium transition ${darkMode ? 'bg-white/5 hover:bg-white/10' : 'bg-gray-50 hover:bg-gray-100'}`}>
              <Plus className="w-5 h-5 text-orange-600" /> Add new client
            </button>
            <button className={`w-full flex items-center gap-3 p-3 rounded-lg text-sm font-medium transition ${darkMode ? 'bg-white/5 hover:bg-white/10' : 'bg-gray-50 hover:bg-gray-100'}`}>
              <Calendar className="w-5 h-5 text-orange-600" /> Schedule meeting
            </button>
            <button className={`w-full flex items-center gap-3 p-3 rounded-lg text-sm font-medium transition ${darkMode ? 'bg-white/5 hover:bg-white/10' : 'bg-gray-50 hover:bg-gray-100'}`}>
              <DollarSign className="w-5 h-5 text-orange-600" /> Create invoice
            </button>
            <button className={`w-full flex items-center gap-3 p-3 rounded-lg text-sm font-medium transition ${darkMode ? 'bg-white/5 hover:bg-white/10' : 'bg-gray-50 hover:bg-gray-100'}`}>
              <Users className="w-5 h-5 text-orange-600" /> Add lead
            </button>
            <button className={`w-full flex items-center gap-3 p-3 rounded-lg text-sm font-medium transition ${darkMode ? 'bg-white/5 hover:bg-white/10' : 'bg-gray-50 hover:bg-gray-100'}`}>
              <FolderOpen className="w-5 h-5 text-orange-600" /> New project
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
