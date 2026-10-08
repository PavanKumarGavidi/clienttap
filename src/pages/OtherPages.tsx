import { useState } from 'react';
import { useApp } from '../App';
import { messages, meetings, tasks, documents, teamMembers, workspace } from '../data/mockData';
import {
  MessageSquare, Send, Calendar, Clock, CheckSquare, FileText,
  CreditCard, Plus, Search, Filter, Star, CheckCircle2,
  Circle, AlertCircle, Paperclip, Video, Download, Zap,
  Crown, TrendingUp
} from 'lucide-react';

interface Props {
  page: 'messages' | 'meetings' | 'tasks' | 'documents' | 'team' | 'billing' | 'activity';
}

export default function OtherPages({ page }: Props) {
  const { darkMode } = useApp();
  const cardClass = `rounded-xl border bg-white`;

  switch (page) {
    case 'messages': return <MessagesPage />;
    case 'meetings': return <MeetingsPage />;
    case 'tasks': return <TasksPage />;
    case 'documents': return <DocumentsPage />;
    case 'team': return <TeamPage />;
    case 'billing': return <BillingPage />;
    case 'activity': return <ActivityPage />;
    default: return null;
  }
}

function MessagesPage() {
  const { darkMode } = useApp();
  const [selectedThread, setSelectedThread] = useState('th1');
  const [messageInput, setMessageInput] = useState('');
  const cardClass = `rounded-xl border ${darkMode ? 'bg-[#1a1a1a] border-white/10' : 'bg-white border-gray-200'}`;

  const threads = [
    { id: 'th1', client: 'GreenLeaf Organics', lastMessage: 'Looks great! Just a few notes on the hero section.', time: '3:45 PM', unread: 0 },
    { id: 'th2', client: 'TechVault Solutions', lastMessage: 'We\'ll review and share feedback by EOD.', time: '10:15 AM', unread: 1 },
    { id: 'th3', client: 'CloudNine SaaS', lastMessage: 'The new dashboard designs are uploaded.', time: '11:30 AM', unread: 1 },
    { id: 'th4', client: 'Saffron Kitchen', lastMessage: 'Can we move the menu section up?', time: 'Yesterday', unread: 0 },
    { id: 'th5', client: 'FitLife Gym', lastMessage: 'The portal access is working perfectly!', time: '2 days ago', unread: 0 },
  ];

  const threadMessages = messages.filter(m => m.threadId === selectedThread);

  return (
    <div className="h-full flex flex-col lg:flex-row animate-fade-in">
      {/* Thread List */}
      <div className={`lg:w-80 shrink-0 border-r ${darkMode ? 'border-white/10' : 'border-gray-200'}`}>
        <div className={`p-4 border-b ${darkMode ? 'border-white/10' : 'border-gray-100'}`}>
          <h2 className="text-lg font-bold">Messages</h2>
          <div className="relative mt-3">
            <Search className={`absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 ${darkMode ? 'text-gray-500' : 'text-gray-400'}`} />
            <input type="text" placeholder="Search conversations..." className={`w-full pl-10 pr-4 py-2 rounded-lg text-sm ${darkMode ? 'bg-white/5 border-white/10 text-white placeholder:text-gray-500' : 'bg-gray-100 border-gray-200 text-gray-900 placeholder:text-gray-400'} border focus:outline-none`} />
          </div>
        </div>
        <div className="overflow-y-auto">
          {threads.map((thread) => (
            <button
              key={thread.id}
              onClick={() => setSelectedThread(thread.id)}
              className={`w-full text-left p-4 border-b transition ${darkMode ? 'border-white/5' : 'border-gray-50'} ${
                selectedThread === thread.id
                  ? darkMode ? 'bg-white/5' : 'bg-orange-50'
                  : darkMode ? 'hover:bg-white/5' : 'hover:bg-gray-50'
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="font-medium text-sm">{thread.client}</span>
                <span className={`text-xs ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>{thread.time}</span>
              </div>
              <p className={`text-xs truncate ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>{thread.lastMessage}</p>
              {thread.unread > 0 && (
                <span className="mt-1 inline-block w-5 h-5 bg-orange-600 text-white text-xs rounded-full flex items-center justify-center">{thread.unread}</span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 flex flex-col">
        <div className={`p-4 border-b ${darkMode ? 'border-white/10' : 'border-gray-100'}`}>
          <h3 className="font-semibold">{threads.find(t => t.id === selectedThread)?.client}</h3>
        </div>
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {threadMessages.map((msg) => {
            const isMe = msg.sender !== threads.find(t => t.id === selectedThread)?.client.toLowerCase().split(' ')[0];
            return (
              <div key={msg.id} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[70%] p-3 rounded-2xl text-sm ${
                  isMe ? 'bg-orange-600 text-white' : darkMode ? 'bg-white/10' : 'bg-gray-100'
                }`}>
                  <p>{msg.content}</p>
                  <p className={`text-xs mt-1 ${isMe ? 'text-orange-200' : darkMode ? 'text-gray-500' : 'text-gray-400'}`}>
                    {new Date(msg.timestamp).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
        <div className={`p-4 border-t ${darkMode ? 'border-white/10' : 'border-gray-100'}`}>
          <div className="flex gap-2">
            <button className={`p-2.5 rounded-xl ${darkMode ? 'hover:bg-white/10' : 'hover:bg-gray-100'}`}>
              <Paperclip className="w-5 h-5" />
            </button>
            <input
              type="text"
              value={messageInput}
              onChange={(e) => setMessageInput(e.target.value)}
              placeholder="Type a message..."
              className={`flex-1 px-4 py-2.5 rounded-xl text-sm ${darkMode ? 'bg-white/5 border-white/10 text-white placeholder:text-gray-500' : 'bg-gray-100 border-gray-200 text-gray-900 placeholder:text-gray-400'} border focus:outline-none focus:ring-2 focus:ring-orange-500/50`}
            />
            <button className="bg-orange-600 hover:bg-orange-700 text-white p-2.5 rounded-xl transition">
              <Send className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function MeetingsPage() {
  const { darkMode } = useApp();
  const cardClass = `rounded-xl border ${darkMode ? 'bg-[#1a1a1a] border-white/10' : 'bg-white border-gray-200'}`;

  return (
    <div className="p-4 lg:p-8 max-w-5xl mx-auto animate-fade-in">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">Meetings</h1>
          <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Schedule and manage meetings with clients</p>
        </div>
        <button className="bg-orange-600 hover:bg-orange-700 text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 transition">
          <Plus className="w-4 h-4" /> Schedule Meeting
        </button>
      </div>

      <div className="space-y-4">
        {meetings.map((meeting) => (
          <div key={meeting.id} className={`${cardClass} p-5`}>
            <div className="flex items-start justify-between">
              <div className="flex items-start gap-4">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                  meeting.status === 'upcoming' ? 'bg-blue-100 dark:bg-blue-900/30' : 'bg-green-100 dark:bg-green-900/30'
                }`}>
                  <Calendar className={`w-6 h-6 ${meeting.status === 'upcoming' ? 'text-blue-600' : 'text-green-600'}`} />
                </div>
                <div>
                  <h3 className="font-semibold">{meeting.title}</h3>
                  <div className={`flex flex-wrap items-center gap-3 mt-1 text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                    <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" /> {meeting.date} at {meeting.time}</span>
                    <span className="flex items-center gap-1"><Video className="w-3.5 h-3.5" /> {meeting.duration} min</span>
                  </div>
                  {meeting.notes && <p className={`text-sm mt-2 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>{meeting.notes}</p>}
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className={`text-xs px-2 py-0.5 rounded-full ${
                  meeting.status === 'upcoming' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400' : 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                }`}>
                  {meeting.status}
                </span>
              </div>
            </div>
            <div className={`flex items-center gap-2 mt-3 pt-3 border-t ${darkMode ? 'border-white/5' : 'border-gray-100'}`}>
              <span className={`text-xs ${darkMode ? 'text-gray-500' : 'text-gray-500'}`}>Attendees:</span>
              {meeting.attendees.map((id) => {
                const member = teamMembers.find(m => m.id === id);
                return member ? (
                  <span key={id} className="text-sm" title={member.name}>{member.avatar}</span>
                ) : null;
              })}
              <span className="ml-auto text-xs text-orange-600 cursor-pointer">Join Meet →</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function TasksPage() {
  const { darkMode } = useApp();
  const [viewMode, setViewMode] = useState<'list' | 'board'>('list');
  const cardClass = `rounded-xl border ${darkMode ? 'bg-[#1a1a1a] border-white/10' : 'bg-white border-gray-200'}`;

  const getMember = (id: string) => teamMembers.find(m => m.id === id);

  const priorityColors: Record<string, string> = {
    high: 'text-red-500 bg-red-100 dark:bg-red-900/30',
    medium: 'text-amber-500 bg-amber-100 dark:bg-amber-900/30',
    low: 'text-green-500 bg-green-100 dark:bg-green-900/30',
  };

  const statusIcons: Record<string, any> = {
    'todo': <Circle className="w-4 h-4 text-gray-400" />,
    'in-progress': <AlertCircle className="w-4 h-4 text-blue-500" />,
    'done': <CheckCircle2 className="w-4 h-4 text-green-500" />,
  };

  return (
    <div className="p-4 lg:p-8 max-w-5xl mx-auto animate-fade-in">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">Tasks</h1>
          <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>{tasks.length} tasks · {tasks.filter(t => t.status === 'done').length} completed</p>
        </div>
        <div className="flex items-center gap-2">
          <div className={`flex rounded-lg overflow-hidden border ${darkMode ? 'border-white/10' : 'border-gray-200'}`}>
            <button onClick={() => setViewMode('list')} className={`p-2 ${viewMode === 'list' ? 'bg-orange-600 text-white' : ''}`}>
              <Filter className="w-4 h-4" />
            </button>
            <button onClick={() => setViewMode('board')} className={`p-2 ${viewMode === 'board' ? 'bg-orange-600 text-white' : ''}`}>
              <CheckSquare className="w-4 h-4" />
            </button>
          </div>
          <button className="bg-orange-600 hover:bg-orange-700 text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 transition">
            <Plus className="w-4 h-4" /> Add Task
          </button>
        </div>
      </div>

      {viewMode === 'list' && (
        <div className={cardClass + ' overflow-hidden'}>
          <table className="w-full">
            <thead>
              <tr className={`border-b ${darkMode ? 'border-white/10' : 'border-gray-100'}`}>
                <th className="text-left p-4 text-xs font-semibold text-gray-500 uppercase">Task</th>
                <th className="text-left p-4 text-xs font-semibold text-gray-500 uppercase hidden sm:table-cell">Assignee</th>
                <th className="text-left p-4 text-xs font-semibold text-gray-500 uppercase hidden md:table-cell">Due</th>
                <th className="text-left p-4 text-xs font-semibold text-gray-500 uppercase">Priority</th>
                <th className="text-left p-4 text-xs font-semibold text-gray-500 uppercase">Status</th>
              </tr>
            </thead>
            <tbody>
              {tasks.map((task) => {
                const member = getMember(task.assignee);
                return (
                  <tr key={task.id} className={`border-b last:border-0 ${darkMode ? 'border-white/5 hover:bg-white/5' : 'border-gray-50 hover:bg-gray-50'} transition`}>
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        {statusIcons[task.status]}
                        <span className={`text-sm font-medium ${task.status === 'done' ? 'line-through opacity-50' : ''}`}>{task.title}</span>
                      </div>
                    </td>
                    <td className={`p-4 text-sm hidden sm:table-cell ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                      <span className="flex items-center gap-1.5">{member?.avatar} {member?.name.split(' ')[0]}</span>
                    </td>
                    <td className={`p-4 text-sm hidden md:table-cell ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>{task.dueDate}</td>
                    <td className="p-4">
                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${priorityColors[task.priority]}`}>{task.priority}</span>
                    </td>
                    <td className="p-4">
                      <span className={`text-xs ${task.status === 'done' ? 'text-green-500' : task.status === 'in-progress' ? 'text-blue-500' : darkMode ? 'text-gray-500' : 'text-gray-400'}`}>
                        {task.status.replace('-', ' ')}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {viewMode === 'board' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {(['todo', 'in-progress', 'done'] as const).map((status) => {
            const statusTasks = tasks.filter(t => t.status === status);
            return (
              <div key={status}>
                <h3 className="text-sm font-semibold mb-3 flex items-center gap-2 capitalize">
                  {statusIcons[status]} {status.replace('-', ' ')} ({statusTasks.length})
                </h3>
                <div className={`space-y-2 p-3 rounded-xl min-h-[200px] ${darkMode ? 'bg-white/[0.02]' : 'bg-gray-50/50'}`}>
                  {statusTasks.map((task) => {
                    const member = getMember(task.assignee);
                    return (
                      <div key={task.id} className={`p-3 rounded-lg ${darkMode ? 'bg-[#1a1a1a] border border-white/10' : 'bg-white border border-gray-200'}`}>
                        <p className="text-sm font-medium">{task.title}</p>
                        <div className="flex items-center justify-between mt-2">
                          <span className={`text-xs px-2 py-0.5 rounded-full ${priorityColors[task.priority]}`}>{task.priority}</span>
                          <span className="text-sm">{member?.avatar}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

function DocumentsPage() {
  const { darkMode } = useApp();
  const cardClass = `rounded-xl border ${darkMode ? 'bg-[#1a1a1a] border-white/10' : 'bg-white border-gray-200'}`;

  return (
    <div className="p-4 lg:p-8 max-w-5xl mx-auto animate-fade-in">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">Documents</h1>
          <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Contracts, proposals, quotes and templates</p>
        </div>
        <div className="flex gap-2">
          <button className={`px-4 py-2 rounded-lg text-sm font-medium border transition ${darkMode ? 'border-white/10 hover:bg-white/5' : 'border-gray-200 hover:bg-gray-50'}`}>
            🤖 AI Generate
          </button>
          <button className="bg-orange-600 hover:bg-orange-700 text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 transition">
            <Plus className="w-4 h-4" /> New Document
          </button>
        </div>
      </div>

      {/* AI Quota */}
      <div className={`${cardClass} p-4 mb-6 bg-gradient-to-r ${darkMode ? 'from-orange-950/30 to-transparent' : 'from-orange-50 to-transparent'}`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Zap className="w-5 h-5 text-orange-600" />
            <div>
              <p className="text-sm font-medium">AI Quotes & Contracts</p>
              <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>18 of 25 remaining this month</p>
            </div>
          </div>
          <div className="w-32 h-2 bg-gray-200 dark:bg-white/10 rounded-full overflow-hidden">
            <div className="h-full bg-orange-500 rounded-full" style={{ width: '28%' }} />
          </div>
        </div>
      </div>

      {/* Templates */}
      <h3 className="font-semibold mb-3">Templates</h3>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
        {['Contract', 'Proposal', 'NDA', 'Quotation'].map((type) => (
          <button key={type} className={`${cardClass} p-4 text-center hover:shadow-md transition`}>
            <FileText className={`w-8 h-8 mx-auto mb-2 ${darkMode ? 'text-gray-500' : 'text-gray-400'}`} />
            <p className="text-sm font-medium">{type}</p>
          </button>
        ))}
      </div>

      {/* Documents List */}
      <h3 className="font-semibold mb-3">Recent Documents</h3>
      <div className="space-y-3">
        {documents.map((doc) => (
          <div key={doc.id} className={`${cardClass} p-4 flex items-center justify-between`}>
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${darkMode ? 'bg-orange-900/30' : 'bg-orange-100'}`}>
                <FileText className="w-5 h-5 text-orange-600" />
              </div>
              <div>
                <h4 className="font-medium text-sm">{doc.title}</h4>
                <p className={`text-xs ${darkMode ? 'text-gray-500' : 'text-gray-500'}`}>{doc.type} · v{doc.version} {doc.signedDate && `· Signed ${doc.signedDate}`}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className={`text-xs px-2 py-0.5 rounded-full ${
                doc.status === 'signed' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' :
                doc.status === 'sent' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400' :
                'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400'
              }`}>
                {doc.status}
              </span>
              <button className={`p-1.5 rounded-lg ${darkMode ? 'hover:bg-white/10' : 'hover:bg-gray-100'}`}>
                <Download className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function TeamPage() {
  const { darkMode } = useApp();
  const cardClass = `rounded-xl border ${darkMode ? 'bg-[#1a1a1a] border-white/10' : 'bg-white border-gray-200'}`;

  return (
    <div className="p-4 lg:p-8 max-w-5xl mx-auto animate-fade-in">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">Team</h1>
          <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>{teamMembers.length} of 5 seats used</p>
        </div>
        <button className="bg-orange-600 hover:bg-orange-700 text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 transition">
          <Plus className="w-4 h-4" /> Invite Member
        </button>
      </div>

      <div className="space-y-3">
        {teamMembers.map((member) => (
          <div key={member.id} className={`${cardClass} p-5 flex items-center justify-between`}>
            <div className="flex items-center gap-4">
              <span className="text-3xl">{member.avatar}</span>
              <div>
                <h3 className="font-semibold">{member.name}</h3>
                <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>{member.title}</p>
                <p className={`text-xs ${darkMode ? 'text-gray-500' : 'text-gray-500'}`}>{member.email}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <span className={`text-xs px-2 py-0.5 rounded-full ${member.role === 'owner' ? 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400' : 'bg-gray-100 text-gray-700 dark:bg-white/10 dark:text-gray-400'}`}>
                {member.role}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Payroll Section */}
      <div className="mt-8">
        <h2 className="text-lg font-bold mb-4">Payroll</h2>
        <div className={`${cardClass} p-5`}>
          <div className="flex items-center gap-3 mb-4">
            <Crown className="w-5 h-5 text-orange-600" />
            <div>
              <p className="font-medium text-sm">Team payroll & payslips</p>
              <p className={`text-xs ${darkMode ? 'text-gray-500' : 'text-gray-500'}`}>Available on Ultra plan</p>
            </div>
            <button className="ml-auto text-xs bg-orange-600 text-white px-3 py-1.5 rounded-lg font-medium">Upgrade</button>
          </div>
        </div>
      </div>
    </div>
  );
}

function BillingPage() {
  const { darkMode } = useApp();
  const cardClass = `rounded-xl border ${darkMode ? 'bg-[#1a1a1a] border-white/10' : 'bg-white border-gray-200'}`;

  return (
    <div className="p-4 lg:p-8 max-w-5xl mx-auto animate-fade-in">
      <h1 className="text-2xl font-bold mb-6">Billing</h1>

      {/* Current Plan */}
      <div className={`${cardClass} p-6 mb-6`}>
        <div className="flex items-center justify-between mb-4">
          <div>
            <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Current Plan</p>
            <h2 className="text-2xl font-bold">Pro</h2>
          </div>
          <div className="text-right">
            <p className="text-2xl font-bold">₹199<span className="text-sm font-normal">/mo</span></p>
            <p className={`text-xs ${darkMode ? 'text-gray-500' : 'text-gray-500'}`}>or $19/mo in USD</p>
          </div>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4">
          <div className={`p-3 rounded-lg ${darkMode ? 'bg-white/5' : 'bg-gray-50'}`}>
            <p className={`text-xs ${darkMode ? 'text-gray-500' : 'text-gray-500'}`}>Clients</p>
            <p className="text-sm font-semibold">6 / 20</p>
            <div className="h-1.5 bg-gray-200 dark:bg-white/10 rounded-full mt-1 overflow-hidden">
              <div className="h-full bg-orange-500 rounded-full" style={{ width: '30%' }} />
            </div>
          </div>
          <div className={`p-3 rounded-lg ${darkMode ? 'bg-white/5' : 'bg-gray-50'}`}>
            <p className={`text-xs ${darkMode ? 'text-gray-500' : 'text-gray-500'}`}>Projects</p>
            <p className="text-sm font-semibold">8 / 40</p>
            <div className="h-1.5 bg-gray-200 dark:bg-white/10 rounded-full mt-1 overflow-hidden">
              <div className="h-full bg-orange-500 rounded-full" style={{ width: '20%' }} />
            </div>
          </div>
          <div className={`p-3 rounded-lg ${darkMode ? 'bg-white/5' : 'bg-gray-50'}`}>
            <p className={`text-xs ${darkMode ? 'text-gray-500' : 'text-gray-500'}`}>Team</p>
            <p className="text-sm font-semibold">5 / 5</p>
            <div className="h-1.5 bg-gray-200 dark:bg-white/10 rounded-full mt-1 overflow-hidden">
              <div className="h-full bg-amber-500 rounded-full" style={{ width: '100%' }} />
            </div>
          </div>
          <div className={`p-3 rounded-lg ${darkMode ? 'bg-white/5' : 'bg-gray-50'}`}>
            <p className={`text-xs ${darkMode ? 'text-gray-500' : 'text-gray-500'}`}>AI Quota</p>
            <p className="text-sm font-semibold">7 / 25</p>
            <div className="h-1.5 bg-gray-200 dark:bg-white/10 rounded-full mt-1 overflow-hidden">
              <div className="h-full bg-orange-500 rounded-full" style={{ width: '28%' }} />
            </div>
          </div>
        </div>
        <div className="flex gap-2">
          <button className="bg-orange-600 hover:bg-orange-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition">Upgrade to Ultra</button>
          <button className={`px-4 py-2 rounded-lg text-sm font-medium border transition ${darkMode ? 'border-white/10 hover:bg-white/5' : 'border-gray-200 hover:bg-gray-50'}`}>Change Plan</button>
        </div>
      </div>

      {/* Payment Method */}
      <div className={`${cardClass} p-6 mb-6`}>
        <h3 className="font-semibold mb-4">Payment Method</h3>
        <div className={`flex items-center justify-between p-4 rounded-lg ${darkMode ? 'bg-white/5' : 'bg-gray-50'}`}>
          <div className="flex items-center gap-3">
            <CreditCard className="w-5 h-5 text-orange-600" />
            <div>
              <p className="text-sm font-medium">Razorpay (INR)</p>
              <p className={`text-xs ${darkMode ? 'text-gray-500' : 'text-gray-500'}`}>Next billing: Feb 1, 2025</p>
            </div>
          </div>
          <button className="text-sm text-orange-600 font-medium">Manage</button>
        </div>
      </div>

      {/* Invoice History */}
      <div className={cardClass + ' p-6'}>
        <h3 className="font-semibold mb-4">Billing History</h3>
        <div className="space-y-3">
          {[
            { date: 'Jan 1, 2025', amount: '₹199', status: 'Paid' },
            { date: 'Dec 1, 2024', amount: '₹199', status: 'Paid' },
            { date: 'Nov 1, 2024', amount: '₹199', status: 'Paid' },
            { date: 'Oct 1, 2024', amount: '₹199', status: 'Paid' },
          ].map((bill, i) => (
            <div key={i} className={`flex items-center justify-between py-3 border-b last:border-0 ${darkMode ? 'border-white/5' : 'border-gray-100'}`}>
              <div>
                <p className="text-sm font-medium">{bill.date}</p>
                <p className={`text-xs ${darkMode ? 'text-gray-500' : 'text-gray-500'}`}>Pro plan - Monthly</p>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-sm font-semibold">{bill.amount}</span>
                <span className="text-xs text-green-600 bg-green-100 dark:bg-green-900/30 dark:text-green-400 px-2 py-0.5 rounded-full">{bill.status}</span>
                <button className={`p-1.5 rounded ${darkMode ? 'hover:bg-white/10' : 'hover:bg-gray-100'}`}>
                  <Download className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function ActivityPage() {
  const { darkMode } = useApp();
  const cardClass = `rounded-xl border ${darkMode ? 'bg-[#1a1a1a] border-white/10' : 'bg-white border-gray-200'}`;

  const activities = [
    { id: 1, user: 'Arjun Mehta', action: 'created invoice', target: 'PC-2025-007', time: '2 hours ago', icon: CreditCard, color: 'text-blue-500' },
    { id: 2, user: 'Priya Sharma', action: 'uploaded files to', target: 'E-commerce Redesign', time: '3 hours ago', icon: FileText, color: 'text-purple-500' },
    { id: 3, user: 'Arjun Mehta', action: 'moved lead', target: 'Meera Joshi → Qualified', time: '5 hours ago', icon: TrendingUp, color: 'text-orange-500' },
    { id: 4, user: 'System', action: 'payment received from', target: 'TechVault Solutions (₹45,000)', time: '6 hours ago', icon: CheckCircle2, color: 'text-green-500' },
    { id: 5, user: 'Rahul Kumar', action: 'scheduled meeting', target: 'CloudNine Design Review', time: '8 hours ago', icon: Calendar, color: 'text-blue-500' },
    { id: 6, user: 'Sneha Patel', action: 'completed task', target: 'Dashboard components', time: '1 day ago', icon: CheckSquare, color: 'text-green-500' },
    { id: 7, user: 'Arjun Mehta', action: 'sent document for signature', target: 'FitLife Portal Agreement', time: '1 day ago', icon: FileText, color: 'text-orange-500' },
    { id: 8, user: 'System', action: 'review received from', target: 'Sarah Miller (4 stars)', time: '2 days ago', icon: Star, color: 'text-amber-500' },
  ];

  return (
    <div className="p-4 lg:p-8 max-w-4xl mx-auto animate-fade-in">
      <h1 className="text-2xl font-bold mb-6">Activity</h1>
      <div className={cardClass}>
        <div className="divide-y divide-gray-100 dark:divide-white/5">
          {activities.map((activity) => (
            <div key={activity.id} className="flex items-start gap-4 p-4">
              <div className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 ${darkMode ? 'bg-white/5' : 'bg-gray-100'}`}>
                <activity.icon className={`w-4 h-4 ${activity.color}`} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm">
                  <span className="font-medium">{activity.user}</span>{' '}
                  <span className={darkMode ? 'text-gray-400' : 'text-gray-600'}>{activity.action}</span>{' '}
                  <span className="font-medium">{activity.target}</span>
                </p>
                <p className={`text-xs mt-0.5 ${darkMode ? 'text-gray-500' : 'text-gray-500'}`}>{activity.time}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
