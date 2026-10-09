import { useState } from 'react';
import { useApp } from '../App';
import { useStore } from '../store/StoreContext';
import { revenueData, revenueByType, leadsBySource } from '../data/mockData';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, CartesianGrid } from 'recharts';
import { TrendingUp, Users, FolderOpen, Clock, Plus, Calendar, ArrowRight, Repeat, X } from 'lucide-react';

export default function Dashboard() {
  const { darkMode } = useApp();
  const store = useStore();
  const [showAddClient, setShowAddClient] = useState(false);
  const [showScheduleMeeting, setShowScheduleMeeting] = useState(false);
  const [newClientName, setNewClientName] = useState('');
  const [newClientEmail, setNewClientEmail] = useState('');
  const [meetingTitle, setMeetingTitle] = useState('');
  const [meetingDate, setMeetingDate] = useState('');
  const [meetingTime, setMeetingTime] = useState('');

  const { leads, projects, clients, retainers, payments, meetings } = store;

  const openLeads = leads.filter(l => !['s5', 's6'].includes(l.stage)).length;
  const pipelineValue = leads.filter(l => !['s5', 's6'].includes(l.stage)).reduce((s: number, l: any) => s + l.value, 0);
  const wonThisMonth = leads.filter(l => l.stage === 's5').length;
  const winRate = 68;
  const ongoingProjects = projects.filter(p => p.status === 'ongoing').length;
  const completedProjects = projects.filter(p => p.status === 'completed').length;
  const newProjects = projects.filter(p => p.progress < 30 && p.status === 'ongoing').length;
  const activeRetainers = retainers.filter(r => r.status === 'active').length;
  const mrr = retainers.filter(r => r.status === 'active').reduce((sum: number, r: any) => sum + (r.currency === 'USD' ? r.amount * 83 : r.amount), 0);

  const totalRevenue = projects.reduce((sum: number, p: any) => sum + (p.currency === 'USD' ? p.budget * 83 : p.budget), 0);
  const totalReceived = payments.reduce((sum: number, p: any) => sum + (p.currency === 'USD' ? p.amount * 83 : p.amount), 0);
  const totalPending = totalRevenue - totalReceived;
  const totalExpenses = 256500;
  const moneyInAccount = totalReceived - totalExpenses;
  const collectedPct = totalRevenue > 0 ? Math.round((totalReceived / totalRevenue) * 100) : 0;

  const thisMonthRevenue = projects.reduce((s: number, p: any) => s + (p.currency === 'USD' ? p.budget * 83 : p.budget), 0);
  const thisMonthReceived = totalReceived;

  const upcomingMeetings = meetings.filter(m => m.status === 'upcoming').slice(0, 4);

  const handleAddClient = () => {
    if (!newClientName) return;
    store.addClient({
      name: newClientName,
      company: newClientName,
      email: newClientEmail,
      phone: '',
      address: '',
      gstin: '',
      currency: 'INR',
      currencySymbol: '₹',
      owner: 'u_001',
      portalEnabled: false,
      totalProjects: 0,
      totalInvoiced: 0,
      totalPaid: 0,
      outstanding: 0,
      since: new Date().toISOString().split('T')[0],
    });
    store.addNotification({ type: 'payment', title: 'New client added', message: `${newClientName} has been added`, time: 'Just now', read: false });
    setNewClientName('');
    setNewClientEmail('');
    setShowAddClient(false);
  };

  const handleScheduleMeeting = () => {
    if (!meetingTitle || !meetingDate) return;
    store.addMeeting({
      title: meetingTitle,
      clientId: 'c1',
      date: meetingDate,
      time: meetingTime || '10:00',
      duration: 30,
      attendees: ['u_001'],
      status: 'upcoming',
      notes: '',
    });
    store.addNotification({ type: 'meeting', title: 'Meeting scheduled', message: meetingTitle, time: 'Just now', read: false });
    setMeetingTitle('');
    setMeetingDate('');
    setMeetingTime('');
    setShowScheduleMeeting(false);
  };

  const card = "bg-white rounded-2xl p-5";
  const cardBorder = { border: '1px solid #E7E5E4' };
  const inkMuted = { color: '#78716C' };
  const inkFaint = { color: '#A8A29E' };
  const ink = { color: '#1C1917' };

  return (
    <div className="p-4 lg:p-8 pb-24 lg:pb-8 max-w-[1400px] mx-auto animate-fade-in">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-display-sm font-bold tracking-tight" style={ink}>
          Welcome back, {store.currentUser?.name.split(' ')[0] || 'there'}
        </h1>
        <p className="mt-1 text-sm" style={inkMuted}>
          Here's what's happening with your business today.
        </p>
        <p className="mt-0.5 text-xs" style={inkFaint}>
          {new Date().toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
        </p>
      </div>

      {/* Sales Pipeline Card */}
      <div className={`${card} mb-6`} style={cardBorder}>
        <div className="flex items-center justify-between mb-5">
          <h2 className="font-semibold" style={ink}>Sales Pipeline</h2>
          <button className="text-xs font-medium flex items-center gap-1 hover:text-orange-600 transition" style={{ color: '#ea580c' }}>
            View <ArrowRight className="w-3 h-3" />
          </button>
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div>
            <p className="text-xs mb-1" style={inkMuted}>Open leads</p>
            <p className="text-2xl font-bold" style={ink}>{openLeads}</p>
          </div>
          <div>
            <p className="text-xs mb-1" style={inkMuted}>Pipeline value</p>
            <p className="text-2xl font-bold" style={ink}>₹{(pipelineValue / 100000).toFixed(1)}L</p>
          </div>
          <div>
            <p className="text-xs mb-1" style={inkMuted}>Won / month</p>
            <p className="text-2xl font-bold" style={ink}>{wonThisMonth}</p>
          </div>
          <div>
            <p className="text-xs mb-1" style={inkMuted}>Win rate</p>
            <p className="text-2xl font-bold" style={ink}>{winRate}%</p>
          </div>
        </div>
        <div>
          <p className="text-xs font-medium mb-3" style={inkMuted}>Leads by source</p>
          <div className="space-y-2">
            {leadsBySource.map((source) => (
              <div key={source.source} className="flex items-center gap-3">
                <span className="text-xs w-16 shrink-0" style={inkMuted}>{source.source}</span>
                <div className="flex-1 h-5 rounded-md overflow-hidden" style={{ backgroundColor: '#FAFAF8' }}>
                  <div
                    className="h-full rounded-md flex items-center justify-end pr-2 bg-gradient-to-r from-orange-500 to-orange-400"
                    style={{ width: `${(source.count / 12) * 100}%` }}
                  >
                    <span className="text-[10px] text-white font-semibold">{source.count}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* This month */}
      <div className="mb-6">
        <h2 className="font-semibold mb-3" style={ink}>This month</h2>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className={`${card}`} style={cardBorder}>
            <p className="text-xs mb-1" style={inkMuted}>Revenue</p>
            <p className="text-xl font-bold" style={ink}>₹{(thisMonthRevenue / 100000).toFixed(1)}L</p>
            <p className="text-xs mt-1" style={inkFaint}>{projects.length} new projects · Sum of new project budgets this month</p>
          </div>
          <div className={`${card}`} style={cardBorder}>
            <p className="text-xs mb-1" style={inkMuted}>Received</p>
            <p className="text-xl font-bold" style={{ color: '#16a34a' }}>₹{(thisMonthReceived / 100000).toFixed(1)}L</p>
            <p className="text-xs mt-1" style={inkFaint}>Payments collected this month</p>
          </div>
          <div className={`${card}`} style={cardBorder}>
            <p className="text-xs mb-1" style={inkMuted}>Expenses</p>
            <p className="text-xl font-bold" style={{ color: '#dc2626' }}>₹{(totalExpenses / 100000).toFixed(1)}L</p>
            <p className="text-xs mt-1" style={inkFaint}>Team payouts and tools</p>
          </div>
          <div className={`${card}`} style={cardBorder}>
            <p className="text-xs mb-1" style={inkMuted}>Money in account</p>
            <p className="text-xl font-bold" style={{ color: '#2563eb' }}>₹{(moneyInAccount / 100000).toFixed(1)}L</p>
            <p className="text-xs mt-1" style={inkFaint}>Received minus expenses</p>
          </div>
        </div>
      </div>

      {/* Pipeline and clients */}
      <div className="mb-6">
        <h2 className="font-semibold mb-3" style={ink}>Pipeline and clients</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          <div className={`${card} !p-4`} style={cardBorder}>
            <p className="text-xs" style={inkMuted}>New</p>
            <p className="text-lg font-bold mt-0.5" style={ink}>{newProjects}</p>
          </div>
          <div className={`${card} !p-4`} style={cardBorder}>
            <p className="text-xs" style={inkMuted}>Ongoing</p>
            <p className="text-lg font-bold mt-0.5" style={ink}>{ongoingProjects}</p>
          </div>
          <div className={`${card} !p-4`} style={cardBorder}>
            <p className="text-xs" style={inkMuted}>Completed</p>
            <p className="text-lg font-bold mt-0.5" style={ink}>{completedProjects}</p>
          </div>
          <div className={`${card} !p-4`} style={cardBorder}>
            <p className="text-xs" style={inkMuted}>Total projects</p>
            <p className="text-lg font-bold mt-0.5" style={ink}>{projects.length}</p>
          </div>
          <div className={`${card} !p-4`} style={cardBorder}>
            <p className="text-xs" style={inkMuted}>Total clients</p>
            <p className="text-lg font-bold mt-0.5" style={ink}>{clients.length}</p>
          </div>
          <div className="bg-gradient-to-br from-orange-50 to-white rounded-2xl p-4" style={cardBorder}>
            <p className="text-xs" style={inkMuted}>Active retainers</p>
            <p className="text-lg font-bold mt-0.5" style={ink}>{activeRetainers}</p>
            <p className="text-xs mt-0.5 flex items-center gap-1" style={{ color: '#ea580c' }}>
              <Repeat className="w-3 h-3" /> MRR ₹{(mrr / 1000).toFixed(0)}K/mo
            </p>
          </div>
        </div>
      </div>

      {/* Charts row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
        {/* Revenue by type */}
        <div className={`${card}`} style={cardBorder}>
          <h3 className="font-semibold mb-4" style={ink}>Revenue by type</h3>
          <p className="text-xs mb-4" style={inkMuted}>Payments received to date</p>
          {/* Segmented bar */}
          <div className="h-4 rounded-full overflow-hidden flex mb-4" style={{ backgroundColor: '#FAFAF8' }}>
            <div className="h-full rounded-l-full" style={{ width: '80%', backgroundColor: '#ea580c' }} />
            <div className="h-full rounded-r-full" style={{ width: '20%', backgroundColor: '#3b82f6' }} />
          </div>
          <div className="flex justify-between">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: '#ea580c' }} />
              <div>
                <p className="text-xs" style={inkMuted}>Freelance</p>
                <p className="text-sm font-semibold" style={ink}>₹42.0L</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: '#3b82f6' }} />
              <div>
                <p className="text-xs" style={inkMuted}>Retainer</p>
                <p className="text-sm font-semibold" style={ink}>₹10.8L</p>
              </div>
            </div>
          </div>
        </div>

        {/* All-time overview */}
        <div className={`${card}`} style={cardBorder}>
          <h3 className="font-semibold mb-4" style={ink}>All-time revenue overview</h3>
          <div className="flex items-center gap-4 mb-4">
            {/* Radial progress */}
            <div className="relative w-20 h-20 shrink-0">
              <svg className="w-20 h-20 -rotate-90" viewBox="0 0 80 80">
                <circle cx="40" cy="40" r="32" fill="none" stroke="#FAFAF8" strokeWidth="8" />
                <circle cx="40" cy="40" r="32" fill="none" stroke="#ea580c" strokeWidth="8" strokeDasharray={`${collectedPct * 2.01} 201`} strokeLinecap="round" />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-lg font-bold" style={ink}>{collectedPct}%</span>
              </div>
            </div>
            <div>
              <p className="text-xs" style={inkMuted}>collected</p>
              <p className="text-sm font-medium" style={ink}>of total project value</p>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <p className="text-xs" style={inkFaint}>Total value</p>
              <p className="text-sm font-semibold" style={ink}>₹{(totalRevenue / 100000).toFixed(1)}L</p>
            </div>
            <div>
              <p className="text-xs" style={inkFaint}>Received</p>
              <p className="text-sm font-semibold" style={{ color: '#16a34a' }}>₹{(totalReceived / 100000).toFixed(1)}L</p>
            </div>
            <div>
              <p className="text-xs" style={inkFaint}>Pending</p>
              <p className="text-sm font-semibold" style={{ color: '#d97706' }}>₹{(totalPending / 100000).toFixed(1)}L</p>
            </div>
            <div>
              <p className="text-xs" style={inkFaint}>Expenses</p>
              <p className="text-sm font-semibold" style={{ color: '#dc2626' }}>₹{(totalExpenses / 100000).toFixed(1)}L</p>
            </div>
          </div>
        </div>

        {/* 6-month trend */}
        <div className={`${card}`} style={cardBorder}>
          <h3 className="font-semibold mb-4" style={ink}>6-month revenue trend</h3>
          <ResponsiveContainer width="100%" height={180}>
            <BarChart data={revenueData} barGap={2}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E7E5E4" vertical={false} />
              <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#78716C' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: '#78716C' }} axisLine={false} tickLine={false} tickFormatter={(v) => `₹${(v/100000).toFixed(0)}L`} />
              <Tooltip
                contentStyle={{ background: '#fff', border: '1px solid #E7E5E4', borderRadius: 12, fontSize: 12 }}
                formatter={(value: number) => [`₹${(value/1000).toFixed(0)}K`, '']}
              />
              <Bar dataKey="received" fill="#ea580c" radius={[4, 4, 0, 0]} name="Received" />
              <Bar dataKey="pending" fill="#fdba74" radius={[4, 4, 0, 0]} name="Pending" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Bottom row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Upcoming reminders */}
        <div className={`${card}`} style={cardBorder}>
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold" style={ink}>Upcoming reminders</h3>
            <button className="text-xs font-medium flex items-center gap-1" style={{ color: '#ea580c' }}>
              View all <ArrowRight className="w-3 h-3" />
            </button>
          </div>
          <div className="space-y-2.5">
            {upcomingMeetings.map((m) => (
              <div key={m.id} className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-stone-50 transition cursor-pointer">
                <div className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0" style={{ backgroundColor: '#FFF8F2' }}>
                  <Calendar className="w-4 h-4" style={{ color: '#ea580c' }} />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium truncate" style={ink}>{m.title}</p>
                  <p className="text-xs" style={inkFaint}>{m.date} · {m.time}</p>
                </div>
                <span className="text-xs font-medium shrink-0" style={{ color: '#ea580c' }}>in 2h</span>
              </div>
            ))}
          </div>
        </div>

        {/* Recent clients */}
        <div className={`${card}`} style={cardBorder}>
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold" style={ink}>Recent clients</h3>
            <button className="text-xs font-medium flex items-center gap-1" style={{ color: '#ea580c' }}>
              View all <ArrowRight className="w-3 h-3" />
            </button>
          </div>
          <div className="space-y-2.5">
            {clients.slice(0, 4).map((c) => (
              <div key={c.id} className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-stone-50 transition cursor-pointer">
                <div className="w-9 h-9 rounded-full flex items-center justify-center text-sm font-semibold shrink-0" style={{ backgroundColor: '#FFF8F2', color: '#c2410c' }}>
                  {c.name.charAt(0)}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium truncate" style={ink}>{c.name}</p>
                  <p className="text-xs" style={inkFaint}>{c.phone}</p>
                </div>
                <span className="text-xs" style={inkFaint}>2h ago</span>
              </div>
            ))}
          </div>
        </div>

        {/* Quick actions */}
        <div className="grid grid-cols-2 gap-3">
          <button onClick={() => setShowAddClient(true)} className="bg-white rounded-2xl p-5 flex flex-col items-start justify-between h-full hover:shadow-md transition group" style={cardBorder}>
            <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-3 group-hover:scale-110 transition" style={{ backgroundColor: '#fff7ed' }}>
              <Plus className="w-5 h-5" style={{ color: '#ea580c' }} />
            </div>
            <div className="text-left">
              <p className="text-sm font-semibold" style={ink}>Add client</p>
              <p className="text-xs mt-0.5" style={inkFaint}>New client profile</p>
            </div>
          </button>
          <button onClick={() => setShowScheduleMeeting(true)} className="bg-white rounded-2xl p-5 flex flex-col items-start justify-between h-full hover:shadow-md transition group" style={cardBorder}>
            <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-3 group-hover:scale-110 transition" style={{ backgroundColor: '#fff7ed' }}>
              <Calendar className="w-5 h-5" style={{ color: '#ea580c' }} />
            </div>
            <div className="text-left">
              <p className="text-sm font-semibold" style={ink}>Schedule meeting</p>
              <p className="text-xs mt-0.5" style={inkFaint}>Book a call</p>
            </div>
          </button>
        </div>
      </div>

      {/* Add Client Modal */}
      {showAddClient && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={() => setShowAddClient(false)}>
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Add New Client</h3>
              <button onClick={() => setShowAddClient(false)} className="p-1 hover:bg-stone-100 rounded">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Client Name *</label>
                <input
                  type="text"
                  value={newClientName}
                  onChange={(e) => setNewClientName(e.target.value)}
                  placeholder="Enter client name"
                  className="w-full px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                  style={{ border: '1px solid #E7E5E4' }}
                  autoFocus
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Email</label>
                <input
                  type="email"
                  value={newClientEmail}
                  onChange={(e) => setNewClientEmail(e.target.value)}
                  placeholder="client@example.com"
                  className="w-full px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                  style={{ border: '1px solid #E7E5E4' }}
                />
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button onClick={() => setShowAddClient(false)} className="flex-1 px-4 py-2 rounded-lg hover:bg-stone-50" style={{ border: '1px solid #E7E5E4' }}>
                Cancel
              </button>
              <button onClick={handleAddClient} disabled={!newClientName.trim()} className="flex-1 px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 disabled:opacity-50 disabled:cursor-not-allowed">
                Add Client
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Schedule Meeting Modal */}
      {showScheduleMeeting && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={() => setShowScheduleMeeting(false)}>
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Schedule Meeting</h3>
              <button onClick={() => setShowScheduleMeeting(false)} className="p-1 hover:bg-stone-100 rounded">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Meeting Title *</label>
                <input
                  type="text"
                  value={meetingTitle}
                  onChange={(e) => setMeetingTitle(e.target.value)}
                  placeholder="e.g., Project kickoff"
                  className="w-full px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                  style={{ border: '1px solid #E7E5E4' }}
                  autoFocus
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Date *</label>
                <input
                  type="date"
                  value={meetingDate}
                  onChange={(e) => setMeetingDate(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                  style={{ border: '1px solid #E7E5E4' }}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Time</label>
                <input
                  type="time"
                  value={meetingTime}
                  onChange={(e) => setMeetingTime(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                  style={{ border: '1px solid #E7E5E4' }}
                />
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button onClick={() => setShowScheduleMeeting(false)} className="flex-1 px-4 py-2 rounded-lg hover:bg-stone-50" style={{ border: '1px solid #E7E5E4' }}>
                Cancel
              </button>
              <button onClick={handleScheduleMeeting} disabled={!meetingTitle.trim() || !meetingDate} className="flex-1 px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 disabled:opacity-50 disabled:cursor-not-allowed">
                Schedule
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
