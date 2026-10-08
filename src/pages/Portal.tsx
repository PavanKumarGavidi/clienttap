import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../App';
import { useStore } from '../store/StoreContext';
import { reviews } from '../data/mockData';
import { Zap, FolderOpen, FileText, CreditCard, MessageSquare, Star, MessageCircle, Send, CheckCircle, Clock, Download, ArrowLeft, Bell, User, LogOut } from 'lucide-react';

export default function Portal() {
  const { darkMode, toggleDarkMode } = useApp();
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState('dashboard');
  const [messageInput, setMessageInput] = useState('');

  const store = useStore();
  
  // Simulating a logged-in client view
  const clientName = 'GreenLeaf Organics';
  const clientProjects = store.projects.filter((p: any) => p.clientId === 'c1');
  const clientInvoices = store.invoices.filter((i: any) => i.clientId === 'c1');
  const clientMessages = store.messages.filter((m: any) => m.clientId === 'c1');
  const clientDocs = store.documents.filter((d: any) => d.clientId === 'c1');
  const totalOwed = clientInvoices.filter((i: any) => i.status !== 'paid').reduce((s: number, i: any) => s + i.amount, 0);
  const workspaceName = store.currentWorkspace?.name || 'Pixel & Code Studio';

  const cardClass = `rounded-xl border bg-white`;

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: FolderOpen },
    { id: 'projects', label: 'Projects', icon: FolderOpen },
    { id: 'invoices', label: 'Invoices', icon: CreditCard },
    { id: 'documents', label: 'Documents', icon: FileText },
    { id: 'messages', label: 'Messages', icon: MessageSquare },
    { id: 'reviews', label: 'Reviews', icon: Star },
  ];

  const handleSendMessage = () => {
    if (!messageInput.trim()) return;
    store.addMessage({
      threadId: 'th1',
      clientId: 'c1',
      sender: 'c1',
      content: messageInput,
      timestamp: new Date().toISOString(),
      read: true,
    });
    setMessageInput('');
  };

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-[#0f0f0f] text-white' : 'bg-gray-50 text-gray-900'}`}>
      {/* Portal Header */}
      <header className="sticky top-0 z-50 bg-white/90 border-b border-[#E7E5E4] backdrop-blur-md">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 flex items-center justify-between h-16">
          <div className="flex items-center gap-3">
            <button onClick={() => navigate('/app')} className={`p-2 rounded-lg ${darkMode ? 'hover:bg-white/10' : 'hover:bg-gray-100'} transition`}>
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div className="flex items-center gap-2">
              <div className="w-9 h-9 bg-gradient-to-br from-orange-500 to-orange-600 rounded-lg flex items-center justify-center">
                <Zap className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-sm font-bold">{workspaceName}</p>
                <p className={`text-xs ${darkMode ? 'text-gray-500' : 'text-gray-500'}`}>Client Portal</p>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button onClick={toggleDarkMode} className={`p-2 rounded-lg ${darkMode ? 'hover:bg-white/10' : 'hover:bg-gray-100'}`}>
              {darkMode ? '☀️' : '🌙'}
            </button>
            <div className="flex items-center gap-2">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm ${darkMode ? 'bg-white/10' : 'bg-gray-100'}`}>
                <User className="w-4 h-4" />
              </div>
              <span className="text-sm font-medium hidden sm:block">{clientName}</span>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Sidebar Nav */}
          <nav className={`lg:w-56 shrink-0 ${cardClass} p-3 lg:p-4`}>
            <ul className="flex lg:flex-col gap-1 overflow-x-auto lg:overflow-x-visible">
              {navItems.map((item) => (
                <li key={item.id}>
                  <button
                    onClick={() => setActiveSection(item.id)}
                    className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm font-medium transition whitespace-nowrap ${
                      activeSection === item.id
                        ? 'bg-orange-600 text-white'
                        : darkMode ? 'text-gray-400 hover:bg-white/5 hover:text-white' : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                    }`}
                  >
                    <item.icon className="w-4 h-4" />
                    {item.label}
                  </button>
                </li>
              ))}
            </ul>
          </nav>

          {/* Main Content */}
          <div className="flex-1 min-w-0">
            {/* Dashboard */}
            {activeSection === 'dashboard' && (
              <div className="space-y-6 animate-fade-in">
                <div>
                  <h1 className="text-2xl font-bold">Welcome back, {clientName} 👋</h1>
                  <p className={`text-sm mt-1 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Here's what's happening with your projects</p>
                </div>

                {/* Quick Stats */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className={`${cardClass} p-5`}>
                    <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Active Projects</p>
                    <p className="text-2xl font-bold mt-1">{clientProjects.filter(p => p.status === 'ongoing').length}</p>
                  </div>
                  <div className={`${cardClass} p-5`}>
                    <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Amount Owed</p>
                    <p className="text-2xl font-bold mt-1 text-amber-500">${totalOwed.toLocaleString()}</p>
                  </div>
                  <div className={`${cardClass} p-5`}>
                    <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Needs Attention</p>
                    <p className="text-2xl font-bold mt-1 text-orange-500">2</p>
                  </div>
                </div>

                {/* Active Projects */}
                <div className={cardClass}>
                  <h3 className="font-semibold p-5 pb-3">Running Projects</h3>
                  <div className="divide-y divide-gray-100 dark:divide-white/5">
                    {clientProjects.filter(p => p.status === 'ongoing').map((project) => (
                      <div key={project.id} className="p-5">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-medium">{project.name}</h4>
                          <span className="text-sm text-orange-600 font-semibold">{project.progress}%</span>
                        </div>
                        <div className="h-2 rounded-full overflow-hidden mb-2" style={{ backgroundColor: '#FAFAF8' }}>
                          <div className="h-full bg-gradient-to-r from-orange-500 to-orange-400 rounded-full" style={{ width: `${project.progress}%` }} />
                        </div>
                        <div className="flex items-center justify-between">
                          <span className={`text-xs ${darkMode ? 'text-gray-500' : 'text-gray-500'}`}>Deadline: {project.deadline}</span>
                          <span className={`text-xs ${darkMode ? 'text-gray-500' : 'text-gray-500'}`}>Budget: ${project.budget.toLocaleString()}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Items Needing Attention */}
                <div className={cardClass}>
                  <h3 className="font-semibold p-5 pb-3 flex items-center gap-2">
                    <Bell className="w-4 h-4 text-orange-500" /> Needs Your Attention
                  </h3>
                  <div className="px-5 pb-5 space-y-3">
                    <div className="flex items-center gap-3 p-3 rounded-lg bg-orange-50 border border-orange-100">
                      <Clock className="w-5 h-5 text-orange-500 shrink-0" />
                      <div className="flex-1">
                        <p className="text-sm font-medium">Invoice PC-2025-007 is due</p>
                        <p className={`text-xs ${darkMode ? 'text-gray-500' : 'text-gray-500'}`}>$1,200 · Due Jan 5, 2025</p>
                      </div>
                      <button className="text-xs bg-orange-600 text-white px-3 py-1.5 rounded-lg font-medium">Pay Now</button>
                    </div>
                    <div className="flex items-center gap-3 p-3 rounded-lg bg-blue-50 border border-blue-100">
                      <CheckCircle className="w-5 h-5 text-blue-500 shrink-0" />
                      <div className="flex-1">
                        <p className="text-sm font-medium">Homepage mockup ready for approval</p>
                        <p className={`text-xs ${darkMode ? 'text-gray-500' : 'text-gray-500'}`}>E-commerce Redesign project</p>
                      </div>
                      <button className="text-xs bg-blue-600 text-white px-3 py-1.5 rounded-lg font-medium">Review</button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Projects */}
            {activeSection === 'projects' && (
              <div className="space-y-4 animate-fade-in">
                <h2 className="text-xl font-bold">Your Projects</h2>
                {clientProjects.map((project) => (
                  <div key={project.id} className={`${cardClass} p-5`}>
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h3 className="font-semibold">{project.name}</h3>
                        <p className={`text-sm ${darkMode ? 'text-gray-500' : 'text-gray-500'}`}>Started {project.startDate} · Deadline {project.deadline}</p>
                      </div>
                      <span className="text-xs px-2 py-0.5 rounded-full" style={{
                        backgroundColor: project.status === 'completed' ? '#f0fdf4' : '#eff6ff',
                        color: project.status === 'completed' ? '#166534' : '#1d4ed8'
                      }}>
                        {project.status}
                      </span>
                    </div>
                    <div className="h-2 rounded-full overflow-hidden mb-3" style={{ backgroundColor: '#FAFAF8' }}>
                      <div className="h-full bg-orange-500 rounded-full" style={{ width: `${project.progress}%` }} />
                    </div>
                    <div className="flex items-center justify-between">
                      <span className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Budget: ${project.budget.toLocaleString()}</span>
                      <button className="text-sm text-orange-600 font-medium">View Details →</button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Invoices */}
            {activeSection === 'invoices' && (
              <div className="space-y-4 animate-fade-in">
                <h2 className="text-xl font-bold">Your Invoices</h2>
                {clientInvoices.map((inv) => (
                  <div key={inv.id} className={`${cardClass} p-5`}>
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-semibold">{inv.number}</h3>
                        <p className={`text-sm ${darkMode ? 'text-gray-500' : 'text-gray-500'}`}>Issued {inv.issuedDate} · Due {inv.dueDate}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-bold">${inv.amount.toLocaleString()}</p>
                        <span className="text-xs px-2 py-0.5 rounded-full" style={{
                          backgroundColor: inv.status === 'paid' ? '#f0fdf4' : '#fffbeb',
                          color: inv.status === 'paid' ? '#166534' : '#92400e'
                        }}>
                          {inv.status === 'paid' ? 'Paid' : 'Pending'}
                        </span>
                      </div>
                    </div>
                    {inv.status !== 'paid' && (
                      <div className="mt-3 flex gap-2">
                        <button className="text-xs bg-orange-600 text-white px-3 py-1.5 rounded-lg font-medium">Pay Now</button>
                        <button className="text-xs px-3 py-1.5 rounded-lg font-medium border border-[#E7E5E4]">Download PDF</button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}

            {/* Documents */}
            {activeSection === 'documents' && (
              <div className="space-y-4 animate-fade-in">
                <h2 className="text-xl font-bold">Documents</h2>
                {clientDocs.map((doc) => (
                  <div key={doc.id} className={`${cardClass} p-5 flex items-center justify-between`}>
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${darkMode ? 'bg-orange-900/30' : 'bg-orange-100'}`}>
                        <FileText className="w-5 h-5 text-orange-600" />
                      </div>
                      <div>
                        <h3 className="font-medium text-sm">{doc.title}</h3>
                        <p className={`text-xs ${darkMode ? 'text-gray-500' : 'text-gray-500'}`}>{doc.type} · v{doc.version}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs px-2 py-0.5 rounded-full" style={{
                        backgroundColor: doc.status === 'signed' ? '#f0fdf4' : '#eff6ff',
                        color: doc.status === 'signed' ? '#166534' : '#1d4ed8'
                      }}>
                        {doc.status}
                      </span>
                      <button className={`p-2 rounded-lg ${darkMode ? 'hover:bg-white/10' : 'hover:bg-gray-100'}`}>
                        <Download className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Messages */}
            {activeSection === 'messages' && (
              <div className={`${cardClass} animate-fade-in`}>
                <div className="p-4 border-b border-[#E7E5E4]">
                  <h2 className="font-semibold">Messages with {workspaceName}</h2>
                </div>
                <div className="p-4 space-y-4 max-h-96 overflow-y-auto">
                  {clientMessages.map((msg) => {
                    const isFromAgency = msg.sender !== 'c1';
                    return (
                      <div key={msg.id} className={`flex ${isFromAgency ? 'justify-start' : 'justify-end'}`}>
                        <div className={`max-w-[75%] p-3 rounded-2xl text-sm ${
                          isFromAgency
                            ? darkMode ? 'bg-white/10 text-white' : 'bg-gray-100 text-gray-900'
                            : 'bg-orange-600 text-white'
                        }`}>
                          <p>{msg.content}</p>
                          <p className={`text-xs mt-1 ${isFromAgency ? (darkMode ? 'text-gray-500' : 'text-gray-400') : 'text-orange-200'}`}>
                            {new Date(msg.timestamp).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
                <div className="p-4 border-t border-[#E7E5E4]">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={messageInput}
                      onChange={(e) => setMessageInput(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                      placeholder="Type a message..."
                      className="flex-1 px-4 py-2.5 rounded-xl text-sm bg-stone-50 border border-[#E7E5E4] text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500/30"
                    />
                    <button onClick={handleSendMessage} className="bg-orange-600 hover:bg-orange-700 text-white p-2.5 rounded-xl transition">
                      <Send className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Reviews */}
            {activeSection === 'reviews' && (
              <div className="space-y-6 animate-fade-in">
                <h2 className="text-xl font-bold">Your Reviews</h2>
                <div className={`${cardClass} p-6`}>
                  <div className="flex items-center gap-2 mb-4">
                    <Star className="w-5 h-5 text-orange-500 fill-orange-500" />
                    <span className="font-semibold">Leave a review for a completed project</span>
                  </div>
                  <p className={`text-sm mb-4 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    Your feedback helps us improve and helps others find great agencies.
                  </p>
                  <div className="flex gap-1 mb-4">
                    {[1,2,3,4,5].map((s) => (
                      <button key={s} className="text-2xl text-gray-300 hover:text-orange-500 transition">★</button>
                    ))}
                  </div>
                  <textarea
                    placeholder="Share your experience..."
                    className="w-full p-3 rounded-xl text-sm resize-none h-24 bg-stone-50 border border-[#E7E5E4] text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500/30"
                  />
                  <button className="mt-3 bg-orange-600 hover:bg-orange-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition">
                    Submit Review
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
