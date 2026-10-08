import { useState } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { useApp } from '../App';
import { workspace, currentUser, notifications } from '../data/mockData';
import {
  LayoutDashboard, Users, UserCircle, FolderKanban, CreditCard,
  MessageSquare, Calendar, CheckSquare, FileText, UserCog,
  Receipt, Activity, Settings, Bell, Moon, Sun, Menu, X,
  Zap, LogOut, ChevronRight, Search
} from 'lucide-react';

const navItems = [
  { path: '/app/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { path: '/app/leads', label: 'Leads', icon: Users },
  { path: '/app/clients', label: 'Clients', icon: UserCircle },
  { path: '/app/projects', label: 'Projects', icon: FolderKanban },
  { path: '/app/invoices', label: 'Payments', icon: CreditCard },
  { path: '/app/messages', label: 'Messages', icon: MessageSquare },
  { path: '/app/meetings', label: 'Meetings', icon: Calendar },
  { path: '/app/tasks', label: 'Tasks', icon: CheckSquare },
  { path: '/app/documents', label: 'Documents', icon: FileText },
  { path: '/app/team', label: 'Team', icon: UserCog },
  { path: '/app/billing', label: 'Billing', icon: Receipt },
  { path: '/app/activity', label: 'Activity', icon: Activity },
  { path: '/app/settings', label: 'Settings', icon: Settings },
];

export default function AppLayout() {
  const { darkMode, toggleDarkMode, setCurrentView } = useApp();
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <div className={`min-h-screen flex ${darkMode ? 'bg-[#0f0f0f] text-white' : 'bg-gray-50 text-gray-900'}`}>
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-40 bg-black/50 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Sidebar */}
      <aside className={`fixed lg:static inset-y-0 left-0 z-50 w-64 flex flex-col ${darkMode ? 'bg-[#1a1a1a] border-white/10' : 'bg-white border-gray-200'} border-r transition-transform lg:translate-x-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        {/* Logo */}
        <div className={`flex items-center justify-between h-16 px-4 border-b ${darkMode ? 'border-white/10' : 'border-gray-100'}`}>
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate('/')}>
            <div className="w-8 h-8 bg-gradient-to-br from-orange-500 to-orange-600 rounded-lg flex items-center justify-center">
              <Zap className="w-5 h-5 text-white" />
            </div>
            <span className="text-lg font-bold">Client<span className="text-orange-600">tap</span></span>
          </div>
          <button onClick={() => setSidebarOpen(false)} className="lg:hidden p-1">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Workspace */}
        <div className={`px-4 py-3 border-b ${darkMode ? 'border-white/10' : 'border-gray-100'}`}>
          <div className="flex items-center gap-2">
            <span className="text-2xl">{workspace.logo}</span>
            <div className="min-w-0">
              <p className="text-sm font-semibold truncate">{workspace.name}</p>
              <p className={`text-xs ${darkMode ? 'text-gray-500' : 'text-gray-500'}`}>Pro plan</p>
            </div>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 overflow-y-auto py-4 px-3">
          <ul className="space-y-1">
            {navItems.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <li key={item.path}>
                  <button
                    onClick={() => { navigate(item.path); setSidebarOpen(false); }}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition ${
                      isActive
                        ? 'bg-orange-600 text-white shadow-sm'
                        : darkMode
                          ? 'text-gray-400 hover:text-white hover:bg-white/5'
                          : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                    }`}
                  >
                    <item.icon className="w-5 h-5 shrink-0" />
                    <span>{item.label}</span>
                    {item.label === 'Messages' && (
                      <span className="ml-auto bg-orange-500 text-white text-xs px-1.5 py-0.5 rounded-full">2</span>
                    )}
                  </button>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* User */}
        <div className={`p-4 border-t ${darkMode ? 'border-white/10' : 'border-gray-100'}`}>
          <div className="flex items-center gap-3">
            <span className="text-2xl">{currentUser.avatar}</span>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-medium truncate">{currentUser.name}</p>
              <p className={`text-xs truncate ${darkMode ? 'text-gray-500' : 'text-gray-500'}`}>{currentUser.email}</p>
            </div>
            <button onClick={() => navigate('/')} className={`p-1.5 rounded-lg ${darkMode ? 'hover:bg-white/10' : 'hover:bg-gray-100'} transition`}>
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Bar */}
        <header className={`sticky top-0 z-30 h-16 flex items-center justify-between px-4 lg:px-6 border-b ${darkMode ? 'bg-[#0f0f0f]/90 border-white/10' : 'bg-white/90 border-gray-200'} backdrop-blur-md`}>
          <div className="flex items-center gap-3">
            <button onClick={() => setSidebarOpen(true)} className="lg:hidden p-2">
              <Menu className="w-5 h-5" />
            </button>
            
            {/* Search */}
            <div className="relative hidden sm:block">
              <Search className={`absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 ${darkMode ? 'text-gray-500' : 'text-gray-400'}`} />
              <input
                type="text"
                placeholder="Search clients, projects, invoices..."
                className={`pl-10 pr-4 py-2 rounded-lg text-sm w-64 lg:w-80 ${darkMode ? 'bg-white/5 border-white/10 text-white placeholder:text-gray-500' : 'bg-gray-100 border-gray-200 text-gray-900 placeholder:text-gray-400'} border focus:outline-none focus:ring-2 focus:ring-orange-500/50 transition`}
              />
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button onClick={() => navigate('/portal')} className={`hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm ${darkMode ? 'text-gray-400 hover:bg-white/5' : 'text-gray-600 hover:bg-gray-100'} transition`}>
              <ChevronRight className="w-4 h-4" /> Portal
            </button>
            
            {/* Notifications */}
            <div className="relative">
              <button onClick={() => setNotifOpen(!notifOpen)} className={`relative p-2 rounded-lg ${darkMode ? 'hover:bg-white/10' : 'hover:bg-gray-100'} transition`}>
                <Bell className="w-5 h-5" />
                {unreadCount > 0 && (
                  <span className="absolute top-1 right-1 w-4 h-4 bg-orange-600 text-white text-[10px] font-bold rounded-full flex items-center justify-center">{unreadCount}</span>
                )}
              </button>
              {notifOpen && (
                <div className={`absolute right-0 top-12 w-80 rounded-xl border shadow-xl ${darkMode ? 'bg-[#1a1a1a] border-white/10' : 'bg-white border-gray-200'} z-50`}>
                  <div className={`p-4 border-b ${darkMode ? 'border-white/10' : 'border-gray-100'}`}>
                    <h3 className="font-semibold text-sm">Notifications</h3>
                  </div>
                  <div className="max-h-80 overflow-y-auto">
                    {notifications.map((n) => (
                      <div key={n.id} className={`px-4 py-3 border-b last:border-0 ${darkMode ? 'border-white/5' : 'border-gray-50'} ${!n.read ? (darkMode ? 'bg-orange-950/20' : 'bg-orange-50/50') : ''}`}>
                        <p className="text-sm font-medium">{n.title}</p>
                        <p className={`text-xs ${darkMode ? 'text-gray-500' : 'text-gray-500'}`}>{n.message}</p>
                        <p className={`text-xs mt-1 ${darkMode ? 'text-gray-600' : 'text-gray-400'}`}>{n.time}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <button onClick={toggleDarkMode} className={`p-2 rounded-lg ${darkMode ? 'hover:bg-white/10' : 'hover:bg-gray-100'} transition`}>
              {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
