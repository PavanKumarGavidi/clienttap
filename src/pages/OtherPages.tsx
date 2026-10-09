import { useState } from 'react';
import { useStore } from '../store/StoreContext';
import { teamMembers, workspace } from '../data/mockData';
import {
  MessageSquare, Send, Calendar, Clock, CheckSquare, FileText,
  CreditCard, Plus, Search, Filter, Star, CheckCircle2,
  Circle, AlertCircle, Paperclip, Video, Download, Zap,
  Crown, TrendingUp, X
} from 'lucide-react';

interface Props {
  page: 'messages' | 'meetings' | 'tasks' | 'documents' | 'team' | 'billing' | 'activity';
}

export default function OtherPages({ page }: Props) {
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
  const store = useStore();
  const [selectedThread, setSelectedThread] = useState('th1');
  const [messageInput, setMessageInput] = useState('');

  const threadMessages = store.messages.filter(m => m.threadId === selectedThread);

  const handleSendMessage = () => {
    if (!messageInput.trim()) return;
    store.addMessage({
      threadId: selectedThread,
      clientId: 'c1',
      sender: 'u_001',
      content: messageInput,
      timestamp: new Date().toISOString(),
      read: true,
    });
    setMessageInput('');
  };

  const threads = [
    { id: 'th1', client: 'GreenLeaf Organics', lastMessage: 'Looks great! Just a few notes on the hero section.', time: '3:45 PM', unread: 0 },
    { id: 'th2', client: 'TechVault Solutions', lastMessage: 'We\'ll review and share feedback by EOD.', time: '10:15 AM', unread: 1 },
    { id: 'th3', client: 'CloudNine SaaS', lastMessage: 'The new dashboard designs are uploaded.', time: '11:30 AM', unread: 1 },
  ];

  return (
    <div className="h-full flex flex-col lg:flex-row animate-fade-in" style={{ backgroundColor: '#FAFAF8' }}>
      <div className="lg:w-80 shrink-0 border-r bg-white" style={{ borderColor: '#E7E5E4' }}>
        <div className="p-4 border-b" style={{ borderColor: '#E7E5E4' }}>
          <h2 className="text-lg font-bold" style={{ color: '#1C1917' }}>Messages</h2>
          <div className="relative mt-3">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: '#A8A29E' }} />
            <input type="text" placeholder="Search conversations..." className="w-full pl-10 pr-4 py-2 rounded-lg text-sm bg-stone-50 border focus:outline-none focus:ring-2 focus:ring-orange-500/30" style={{ borderColor: '#E7E5E4', color: '#1C1917' }} />
          </div>
        </div>
        <div className="overflow-y-auto">
          {threads.map((thread) => (
            <button
              key={thread.id}
              onClick={() => setSelectedThread(thread.id)}
              className={`w-full text-left p-4 border-b transition ${selectedThread === thread.id ? 'bg-orange-50' : 'hover:bg-stone-50'}`}
              style={{ borderColor: '#E7E5E4' }}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="font-medium text-sm" style={{ color: '#1C1917' }}>{thread.client}</span>
                <span className="text-xs" style={{ color: '#A8A29E' }}>{thread.time}</span>
              </div>
              <p className="text-xs truncate" style={{ color: '#78716C' }}>{thread.lastMessage}</p>
              {thread.unread > 0 && (
                <span className="mt-1 inline-block w-5 h-5 text-white text-xs rounded-full flex items-center justify-center" style={{ backgroundColor: '#ea580c' }}>{thread.unread}</span>
              )}
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 flex flex-col bg-white">
        <div className="p-4 border-b" style={{ borderColor: '#E7E5E4' }}>
          <h3 className="font-semibold" style={{ color: '#1C1917' }}>{threads.find(t => t.id === selectedThread)?.client}</h3>
        </div>
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {threadMessages.map((msg) => {
            const isMe = msg.sender === 'u_001';
            return (
              <div key={msg.id} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[70%] p-3 rounded-2xl text-sm ${isMe ? 'text-white' : ''}`} style={{ backgroundColor: isMe ? '#ea580c' : '#FAFAF8', color: isMe ? '#FFFFFF' : '#1C1917' }}>
                  <p>{msg.content}</p>
                  <p className="text-xs mt-1" style={{ color: isMe ? 'rgba(255,255,255,0.7)' : '#A8A29E' }}>
                    {new Date(msg.timestamp).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
        <div className="p-4 border-t" style={{ borderColor: '#E7E5E4' }}>
          <div className="flex gap-2">
            <button className="p-2.5 rounded-xl hover:bg-stone-50">
              <Paperclip className="w-5 h-5" style={{ color: '#78716C' }} />
            </button>
            <input
              type="text"
              value={messageInput}
              onChange={(e) => setMessageInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
              placeholder="Type a message..."
              className="flex-1 px-4 py-2.5 rounded-xl text-sm bg-stone-50 border focus:outline-none focus:ring-2 focus:ring-orange-500/30"
              style={{ borderColor: '#E7E5E4', color: '#1C1917' }}
            />
            <button onClick={handleSendMessage} className="bg-orange-600 hover:bg-orange-700 text-white p-2.5 rounded-xl transition">
              <Send className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function MeetingsPage() {
  const store = useStore();

  return (
    <div className="p-4 lg:p-8 max-w-5xl mx-auto animate-fade-in" style={{ backgroundColor: '#FAFAF8' }}>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold" style={{ color: '#1C1917' }}>Meetings</h1>
          <p className="text-sm" style={{ color: '#78716C' }}>Schedule and manage meetings with clients</p>
        </div>
        <button className="btn-primary text-sm flex items-center gap-2 !py-2">
          <Plus className="w-4 h-4" /> Schedule Meeting
        </button>
      </div>

      <div className="space-y-4">
        {store.meetings.map((meeting: any) => (
          <div key={meeting.id} className="bg-white rounded-xl border p-5" style={{ borderColor: '#E7E5E4' }}>
            <div className="flex items-start justify-between">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ backgroundColor: meeting.status === 'upcoming' ? '#eff6ff' : '#f0fdf4' }}>
                  <Calendar className="w-6 h-6" style={{ color: meeting.status === 'upcoming' ? '#2563eb' : '#16a34a' }} />
                </div>
                <div>
                  <h3 className="font-semibold" style={{ color: '#1C1917' }}>{meeting.title}</h3>
                  <div className="flex flex-wrap items-center gap-3 mt-1 text-sm" style={{ color: '#78716C' }}>
                    <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" /> {meeting.date} at {meeting.time}</span>
                    <span className="flex items-center gap-1"><Video className="w-3.5 h-3.5" /> {meeting.duration} min</span>
                  </div>
                  {meeting.notes && <p className="text-sm mt-2" style={{ color: '#78716C' }}>{meeting.notes}</p>}
                </div>
              </div>
              <span className="text-xs px-2 py-0.5 rounded-full" style={{
                backgroundColor: meeting.status === 'upcoming' ? '#eff6ff' : '#f0fdf4',
                color: meeting.status === 'upcoming' ? '#1d4ed8' : '#166534'
              }}>
                {meeting.status}
              </span>
            </div>
            <div className="flex items-center gap-2 mt-3 pt-3 border-t" style={{ borderColor: '#E7E5E4' }}>
              <span className="text-xs" style={{ color: '#78716C' }}>Attendees:</span>
              {meeting.attendees.map((id: string) => {
                const member = teamMembers.find(m => m.id === id);
                return member ? (
                  <span key={id} className="text-sm" title={member.name}>{member.avatar}</span>
                ) : null;
              })}
              <span className="ml-auto text-xs font-medium" style={{ color: '#ea580c' }}>Join Meet →</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function TasksPage() {
  const store = useStore();
  const [viewMode, setViewMode] = useState<'list' | 'board'>('list');
  const [showAddTask, setShowAddTask] = useState(false);
  const [newTask, setNewTask] = useState({ title: '', assignee: 'u_001', dueDate: '', priority: 'medium' as 'high' | 'medium' | 'low', projectId: 'p1' });

  const handleAddTask = async () => {
    if (!newTask.title.trim()) return;
    try {
      console.log('Adding task:', newTask);
      await store.addTask({
        title: newTask.title,
        assignee: newTask.assignee,
        due_date: newTask.dueDate,
        priority: newTask.priority,
        project_id: newTask.projectId,
        status: 'todo',
      });
      console.log('Task added successfully');
      await store.addNotification({
        type: 'payment',
        title: 'New task created',
        message: newTask.title,
        time: 'Just now',
        read: false,
      });
      setNewTask({ title: '', assignee: 'u_001', dueDate: '', priority: 'medium', projectId: 'p1' });
      setShowAddTask(false);
      alert('Task created successfully!');
    } catch (error) {
      console.error('Error adding task:', error);
      alert('Failed to create task. Check console for details.');
    }
  };

  const getMember = (id: string) => teamMembers.find(m => m.id === id);

  const priorityColors: Record<string, { bg: string; text: string }> = {
    high: { bg: '#fef2f2', text: '#991b1b' },
    medium: { bg: '#fffbeb', text: '#92400e' },
    low: { bg: '#f0fdf4', text: '#166534' },
  };

  const statusIcons: Record<string, any> = {
    'todo': <Circle className="w-4 h-4" style={{ color: '#A8A29E' }} />,
    'in-progress': <AlertCircle className="w-4 h-4" style={{ color: '#2563eb' }} />,
    'done': <CheckCircle2 className="w-4 h-4" style={{ color: '#16a34a' }} />,
  };

  return (
    <div className="p-4 lg:p-8 max-w-5xl mx-auto animate-fade-in" style={{ backgroundColor: '#FAFAF8' }}>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold" style={{ color: '#1C1917' }}>Tasks</h1>
          <p className="text-sm" style={{ color: '#78716C' }}>{store.tasks.length} tasks · {store.tasks.filter((t: any) => t.status === 'done').length} completed</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex rounded-lg overflow-hidden border" style={{ borderColor: '#E7E5E4' }}>
            <button onClick={() => setViewMode('list')} className="p-2" style={{ backgroundColor: viewMode === 'list' ? '#ea580c' : '#FFFFFF' }}>
              <Filter className="w-4 h-4" style={{ color: viewMode === 'list' ? '#FFFFFF' : '#78716C' }} />
            </button>
            <button onClick={() => setViewMode('board')} className="p-2" style={{ backgroundColor: viewMode === 'board' ? '#ea580c' : '#FFFFFF' }}>
              <CheckSquare className="w-4 h-4" style={{ color: viewMode === 'board' ? '#FFFFFF' : '#78716C' }} />
            </button>
          </div>
          <button onClick={() => setShowAddTask(true)} className="btn-primary text-sm flex items-center gap-2 !py-2">
            <Plus className="w-4 h-4" /> Add Task
          </button>
        </div>
      </div>

      {viewMode === 'list' && (
        <div className="bg-white rounded-xl border overflow-hidden" style={{ borderColor: '#E7E5E4' }}>
          <table className="w-full">
            <thead>
              <tr className="border-b" style={{ borderColor: '#E7E5E4' }}>
                <th className="text-left p-4 text-xs font-semibold uppercase" style={{ color: '#78716C' }}>Task</th>
                <th className="text-left p-4 text-xs font-semibold uppercase hidden sm:table-cell" style={{ color: '#78716C' }}>Assignee</th>
                <th className="text-left p-4 text-xs font-semibold uppercase hidden md:table-cell" style={{ color: '#78716C' }}>Due</th>
                <th className="text-left p-4 text-xs font-semibold uppercase" style={{ color: '#78716C' }}>Priority</th>
                <th className="text-left p-4 text-xs font-semibold uppercase" style={{ color: '#78716C' }}>Status</th>
              </tr>
            </thead>
            <tbody>
              {store.tasks.map((task: any) => {
                const member = getMember(task.assignee);
                return (
                  <tr key={task.id} className="border-b last:border-0 hover:bg-stone-50 transition" style={{ borderColor: '#E7E5E4' }}>
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        {statusIcons[task.status]}
                        <span className="text-sm font-medium" style={{ color: '#1C1917', textDecoration: task.status === 'done' ? 'line-through' : 'none', opacity: task.status === 'done' ? 0.5 : 1 }}>{task.title}</span>
                      </div>
                    </td>
                    <td className="p-4 text-sm hidden sm:table-cell" style={{ color: '#78716C' }}>
                      <span className="flex items-center gap-1.5">{member?.avatar} {member?.name.split(' ')[0]}</span>
                    </td>
                    <td className="p-4 text-sm hidden md:table-cell" style={{ color: '#78716C' }}>{task.dueDate}</td>
                    <td className="p-4">
                      <span className="text-xs px-2 py-0.5 rounded-full font-medium" style={{ backgroundColor: priorityColors[task.priority].bg, color: priorityColors[task.priority].text }}>{task.priority}</span>
                    </td>
                    <td className="p-4">
                      <button
                        onClick={() => {
                          const nextStatus = task.status === 'todo' ? 'in-progress' : task.status === 'in-progress' ? 'done' : 'todo';
                          store.updateTask(task.id, { status: nextStatus });
                        }}
                        className="text-xs font-medium capitalize"
                        style={{ color: task.status === 'done' ? '#16a34a' : task.status === 'in-progress' ? '#2563eb' : '#78716C' }}
                      >
                        {task.status.replace('-', ' ')}
                      </button>
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
            const statusTasks = store.tasks.filter((t: any) => t.status === status);
            return (
              <div key={status}>
                <h3 className="text-sm font-semibold mb-3 flex items-center gap-2 capitalize" style={{ color: '#1C1917' }}>
                  {statusIcons[status]} {status.replace('-', ' ')} ({statusTasks.length})
                </h3>
                <div className="space-y-2 p-3 rounded-xl min-h-[200px]" style={{ backgroundColor: '#FAEFE2' }}>
                  {statusTasks.map((task: any) => {
                    const member = getMember(task.assignee);
                    return (
                      <div key={task.id} className="p-3 rounded-lg bg-white border" style={{ borderColor: '#E7E5E4' }}>
                        <p className="text-sm font-medium" style={{ color: '#1C1917' }}>{task.title}</p>
                        <div className="flex items-center justify-between mt-2">
                          <span className="text-xs px-2 py-0.5 rounded-full" style={{ backgroundColor: priorityColors[task.priority].bg, color: priorityColors[task.priority].text }}>{task.priority}</span>
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

      {/* Add Task Modal */}
      {showAddTask && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={() => setShowAddTask(false)}>
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold" style={{ color: '#1C1917' }}>Create New Task</h3>
              <button onClick={() => setShowAddTask(false)} className="p-1 hover:bg-stone-100 rounded">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1" style={{ color: '#1C1917' }}>Task Title *</label>
                <input
                  type="text"
                  value={newTask.title}
                  onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                  placeholder="Design homepage mockup"
                  className="w-full px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                  style={{ border: '1px solid #E7E5E4', color: '#1C1917' }}
                  autoFocus
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1" style={{ color: '#1C1917' }}>Assignee</label>
                <select
                  value={newTask.assignee}
                  onChange={(e) => setNewTask({ ...newTask, assignee: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                  style={{ border: '1px solid #E7E5E4', color: '#1C1917' }}
                >
                  {teamMembers.map(m => (
                    <option key={m.id} value={m.id}>{m.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1" style={{ color: '#1C1917' }}>Due Date</label>
                <input
                  type="date"
                  value={newTask.dueDate}
                  onChange={(e) => setNewTask({ ...newTask, dueDate: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                  style={{ border: '1px solid #E7E5E4', color: '#1C1917' }}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1" style={{ color: '#1C1917' }}>Priority</label>
                <select
                  value={newTask.priority}
                  onChange={(e) => setNewTask({ ...newTask, priority: e.target.value as any })}
                  className="w-full px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                  style={{ border: '1px solid #E7E5E4', color: '#1C1917' }}
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </select>
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button onClick={() => setShowAddTask(false)} className="flex-1 px-4 py-2 rounded-lg hover:bg-stone-50" style={{ border: '1px solid #E7E5E4', color: '#1C1917' }}>
                Cancel
              </button>
              <button 
                onClick={handleAddTask} 
                disabled={!newTask.title.trim()} 
                className="flex-1 px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Create Task
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function DocumentsPage() {
  const store = useStore();
  const [showAddDocument, setShowAddDocument] = useState(false);
  const [newDocument, setNewDocument] = useState({
    title: '',
    type: 'contract' as 'contract' | 'proposal' | 'quotation' | 'nda',
    clientId: 'c1',
    status: 'draft' as 'draft' | 'sent' | 'signed',
    version: 1,
  });

  const handleAddDocument = () => {
    if (!newDocument.title.trim()) return;
    store.addDocument({
      ...newDocument,
      signedDate: null,
    });
    store.addNotification({
      type: 'payment',
      title: 'New document created',
      message: newDocument.title,
      time: 'Just now',
      read: false,
    });
    setNewDocument({ title: '', type: 'contract', clientId: 'c1', status: 'draft', version: 1 });
    setShowAddDocument(false);
  };

  return (
    <div className="p-4 lg:p-8 max-w-5xl mx-auto animate-fade-in" style={{ backgroundColor: '#FAFAF8' }}>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold" style={{ color: '#1C1917' }}>Documents</h1>
          <p className="text-sm" style={{ color: '#78716C' }}>Contracts, proposals, quotes and templates</p>
        </div>
        <div className="flex gap-2">
          <button className="px-4 py-2 rounded-lg text-sm font-medium border transition hover:bg-stone-50" style={{ borderColor: '#E7E5E4', color: '#1C1917' }}>
            🤖 AI Generate
          </button>
          <button onClick={() => setShowAddDocument(true)} className="btn-primary text-sm flex items-center gap-2 !py-2">
            <Plus className="w-4 h-4" /> New Document
          </button>
        </div>
      </div>

      <div className="bg-white rounded-xl border p-4 mb-6" style={{ borderColor: '#E7E5E4' }}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Zap className="w-5 h-5" style={{ color: '#ea580c' }} />
            <div>
              <p className="text-sm font-medium" style={{ color: '#1C1917' }}>AI Quotes & Contracts</p>
              <p className="text-xs" style={{ color: '#78716C' }}>18 of 25 remaining this month</p>
            </div>
          </div>
          <div className="w-32 h-2 rounded-full overflow-hidden" style={{ backgroundColor: '#FAFAF8' }}>
            <div className="h-full rounded-full" style={{ width: '28%', backgroundColor: '#ea580c' }} />
          </div>
        </div>
      </div>

      <h3 className="font-semibold mb-3" style={{ color: '#1C1917' }}>Templates</h3>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
        {['Contract', 'Proposal', 'NDA', 'Quotation'].map((type) => (
          <button key={type} onClick={() => { setNewDocument({ ...newDocument, type: type.toLowerCase() as any }); setShowAddDocument(true); }} className="bg-white rounded-xl border p-4 text-center hover:shadow-md transition" style={{ borderColor: '#E7E5E4' }}>
            <FileText className="w-8 h-8 mx-auto mb-2" style={{ color: '#A8A29E' }} />
            <p className="text-sm font-medium" style={{ color: '#1C1917' }}>{type}</p>
          </button>
        ))}
      </div>

      <h3 className="font-semibold mb-3" style={{ color: '#1C1917' }}>Recent Documents</h3>
      <div className="space-y-3">
        {store.documents.map((doc: any) => (
          <div key={doc.id} className="bg-white rounded-xl border p-4 flex items-center justify-between" style={{ borderColor: '#E7E5E4' }}>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ backgroundColor: '#FFF8F2' }}>
                <FileText className="w-5 h-5" style={{ color: '#ea580c' }} />
              </div>
              <div>
                <h4 className="font-medium text-sm" style={{ color: '#1C1917' }}>{doc.title}</h4>
                <p className="text-xs" style={{ color: '#78716C' }}>{doc.type} · v{doc.version} {doc.signedDate && `· Signed ${doc.signedDate}`}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs px-2 py-0.5 rounded-full" style={{
                backgroundColor: doc.status === 'signed' ? '#f0fdf4' : doc.status === 'sent' ? '#eff6ff' : '#fffbeb',
                color: doc.status === 'signed' ? '#166534' : doc.status === 'sent' ? '#1d4ed8' : '#92400e'
              }}>
                {doc.status}
              </span>
              <button className="p-1.5 rounded-lg hover:bg-stone-50 transition">
                <Download className="w-4 h-4" style={{ color: '#78716C' }} />
              </button>
            </div>
          </div>
        ))}
      </div>

      {showAddDocument && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={() => setShowAddDocument(false)}>
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold" style={{ color: '#1C1917' }}>Create New Document</h3>
              <button onClick={() => setShowAddDocument(false)} className="p-1 hover:bg-stone-100 rounded">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1" style={{ color: '#1C1917' }}>Document Title *</label>
                <input
                  type="text"
                  value={newDocument.title}
                  onChange={(e) => setNewDocument({ ...newDocument, title: e.target.value })}
                  placeholder="Service Agreement"
                  className="w-full px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                  style={{ border: '1px solid #E7E5E4', color: '#1C1917' }}
                  autoFocus
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1" style={{ color: '#1C1917' }}>Document Type</label>
                <select
                  value={newDocument.type}
                  onChange={(e) => setNewDocument({ ...newDocument, type: e.target.value as any })}
                  className="w-full px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                  style={{ border: '1px solid #E7E5E4', color: '#1C1917' }}
                >
                  <option value="contract">Contract</option>
                  <option value="proposal">Proposal</option>
                  <option value="quotation">Quotation</option>
                  <option value="nda">NDA</option>
                </select>
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button onClick={() => setShowAddDocument(false)} className="flex-1 px-4 py-2 rounded-lg hover:bg-stone-50" style={{ border: '1px solid #E7E5E4', color: '#1C1917' }}>
                Cancel
              </button>
              <button 
                onClick={handleAddDocument} 
                disabled={!newDocument.title.trim()} 
                className="flex-1 px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Create Document
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function TeamPage() {
  return (
    <div className="p-4 lg:p-8 max-w-5xl mx-auto animate-fade-in" style={{ backgroundColor: '#FAFAF8' }}>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold" style={{ color: '#1C1917' }}>Team</h1>
          <p className="text-sm" style={{ color: '#78716C' }}>{teamMembers.length} of 5 seats used</p>
        </div>
        <button className="btn-primary text-sm flex items-center gap-2 !py-2">
          <Plus className="w-4 h-4" /> Invite Member
        </button>
      </div>

      <div className="space-y-3">
        {teamMembers.map((member) => (
          <div key={member.id} className="bg-white rounded-xl border p-5 flex items-center justify-between" style={{ borderColor: '#E7E5E4' }}>
            <div className="flex items-center gap-4">
              <span className="text-3xl">{member.avatar}</span>
              <div>
                <h3 className="font-semibold" style={{ color: '#1C1917' }}>{member.name}</h3>
                <p className="text-sm" style={{ color: '#78716C' }}>{member.title}</p>
                <p className="text-xs" style={{ color: '#A8A29E' }}>{member.email}</p>
              </div>
            </div>
            <span className="text-xs px-2 py-0.5 rounded-full" style={{
              backgroundColor: member.role === 'owner' ? '#fff7ed' : '#FAFAF8',
              color: member.role === 'owner' ? '#c2410c' : '#78716C'
            }}>
              {member.role}
            </span>
          </div>
        ))}
      </div>

      <div className="mt-8">
        <h2 className="text-lg font-bold mb-4" style={{ color: '#1C1917' }}>Payroll</h2>
        <div className="bg-white rounded-xl border p-5" style={{ borderColor: '#E7E5E4' }}>
          <div className="flex items-center gap-3 mb-4">
            <Crown className="w-5 h-5" style={{ color: '#ea580c' }} />
            <div>
              <p className="font-medium text-sm" style={{ color: '#1C1917' }}>Team payroll & payslips</p>
              <p className="text-xs" style={{ color: '#78716C' }}>Available on Ultra plan</p>
            </div>
            <button className="ml-auto text-xs bg-orange-600 text-white px-3 py-1.5 rounded-lg font-medium">Upgrade</button>
          </div>
        </div>
      </div>
    </div>
  );
}

function BillingPage() {
  return (
    <div className="p-4 lg:p-8 max-w-5xl mx-auto animate-fade-in" style={{ backgroundColor: '#FAFAF8' }}>
      <h1 className="text-2xl font-bold mb-6" style={{ color: '#1C1917' }}>Billing</h1>

      <div className="bg-white rounded-xl border p-6 mb-6" style={{ borderColor: '#E7E5E4' }}>
        <div className="flex items-center justify-between mb-4">
          <div>
            <p className="text-sm" style={{ color: '#78716C' }}>Current Plan</p>
            <h2 className="text-2xl font-bold" style={{ color: '#1C1917' }}>Pro</h2>
          </div>
          <div className="text-right">
            <p className="text-2xl font-bold" style={{ color: '#1C1917' }}>₹199<span className="text-sm font-normal">/mo</span></p>
            <p className="text-xs" style={{ color: '#78716C' }}>or $19/mo in USD</p>
          </div>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4">
          {[
            { label: 'Clients', value: '6 / 20', pct: 30 },
            { label: 'Projects', value: '8 / 40', pct: 20 },
            { label: 'Team', value: '5 / 5', pct: 100 },
            { label: 'AI Quota', value: '7 / 25', pct: 28 },
          ].map((item, i) => (
            <div key={i} className="p-3 rounded-lg" style={{ backgroundColor: '#FAFAF8' }}>
              <p className="text-xs" style={{ color: '#78716C' }}>{item.label}</p>
              <p className="text-sm font-semibold" style={{ color: '#1C1917' }}>{item.value}</p>
              <div className="h-1.5 rounded-full mt-1 overflow-hidden" style={{ backgroundColor: '#E7E5E4' }}>
                <div className="h-full rounded-full" style={{ width: `${item.pct}%`, backgroundColor: item.pct === 100 ? '#d97706' : '#ea580c' }} />
              </div>
            </div>
          ))}
        </div>
        <div className="flex gap-2">
          <button className="btn-primary text-sm">Upgrade to Ultra</button>
          <button className="px-4 py-2 rounded-lg text-sm font-medium border transition hover:bg-stone-50" style={{ borderColor: '#E7E5E4', color: '#1C1917' }}>Change Plan</button>
        </div>
      </div>

      <div className="bg-white rounded-xl border p-6 mb-6" style={{ borderColor: '#E7E5E4' }}>
        <h3 className="font-semibold mb-4" style={{ color: '#1C1917' }}>Payment Method</h3>
        <div className="flex items-center justify-between p-4 rounded-lg" style={{ backgroundColor: '#FAFAF8' }}>
          <div className="flex items-center gap-3">
            <CreditCard className="w-5 h-5" style={{ color: '#ea580c' }} />
            <div>
              <p className="text-sm font-medium" style={{ color: '#1C1917' }}>Razorpay (INR)</p>
              <p className="text-xs" style={{ color: '#78716C' }}>Next billing: Feb 1, 2025</p>
            </div>
          </div>
          <button className="text-sm font-medium" style={{ color: '#ea580c' }}>Manage</button>
        </div>
      </div>

      <div className="bg-white rounded-xl border p-6" style={{ borderColor: '#E7E5E4' }}>
        <h3 className="font-semibold mb-4" style={{ color: '#1C1917' }}>Billing History</h3>
        <div className="space-y-3">
          {[
            { date: 'Jan 1, 2025', amount: '₹199' },
            { date: 'Dec 1, 2024', amount: '₹199' },
            { date: 'Nov 1, 2024', amount: '₹199' },
          ].map((bill, i) => (
            <div key={i} className="flex items-center justify-between py-3 border-b last:border-0" style={{ borderColor: '#E7E5E4' }}>
              <div>
                <p className="text-sm font-medium" style={{ color: '#1C1917' }}>{bill.date}</p>
                <p className="text-xs" style={{ color: '#78716C' }}>Pro plan - Monthly</p>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-sm font-semibold" style={{ color: '#1C1917' }}>{bill.amount}</span>
                <span className="text-xs px-2 py-0.5 rounded-full" style={{ backgroundColor: '#f0fdf4', color: '#166534' }}>Paid</span>
                <button className="p-1.5 rounded hover:bg-stone-50">
                  <Download className="w-4 h-4" style={{ color: '#78716C' }} />
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
  const store = useStore();

  const activities = [
    { id: 1, user: 'Arjun Mehta', action: 'created invoice', target: 'PC-2025-007', time: '2 hours ago', icon: CreditCard, color: '#2563eb' },
    { id: 2, user: 'Priya Sharma', action: 'uploaded files to', target: 'E-commerce Redesign', time: '3 hours ago', icon: FileText, color: '#7c3aed' },
    { id: 3, user: 'Arjun Mehta', action: 'moved lead', target: 'Meera Joshi → Qualified', time: '5 hours ago', icon: TrendingUp, color: '#ea580c' },
    { id: 4, user: 'System', action: 'payment received from', target: 'TechVault Solutions (₹45,000)', time: '6 hours ago', icon: CheckCircle2, color: '#16a34a' },
    { id: 5, user: 'Rahul Kumar', action: 'scheduled meeting', target: 'CloudNine Design Review', time: '8 hours ago', icon: Calendar, color: '#2563eb' },
  ];

  return (
    <div className="p-4 lg:p-8 max-w-4xl mx-auto animate-fade-in" style={{ backgroundColor: '#FAFAF8' }}>
      <h1 className="text-2xl font-bold mb-6" style={{ color: '#1C1917' }}>Activity</h1>
      <div className="bg-white rounded-xl border" style={{ borderColor: '#E7E5E4' }}>
        <div className="divide-y" style={{ borderColor: '#E7E5E4' }}>
          {activities.map((activity) => (
            <div key={activity.id} className="flex items-start gap-4 p-4">
              <div className="w-9 h-9 rounded-full flex items-center justify-center shrink-0" style={{ backgroundColor: '#FAFAF8' }}>
                <activity.icon className="w-4 h-4" style={{ color: activity.color }} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm" style={{ color: '#1C1917' }}>
                  <span className="font-medium">{activity.user}</span>{' '}
                  <span style={{ color: '#78716C' }}>{activity.action}</span>{' '}
                  <span className="font-medium">{activity.target}</span>
                </p>
                <p className="text-xs mt-0.5" style={{ color: '#A8A29E' }}>{activity.time}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
