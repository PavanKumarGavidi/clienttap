import { useState } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { useApp } from '../App';
import { useStore } from '../store/StoreContext';
import { teamMembers } from '../data/mockData';
import {
  LayoutDashboard, Users, UserCircle, FolderKanban, CreditCard,
  MessageSquare, Calendar, CheckSquare, FileText, UserCog,
  Receipt, Activity, Settings, Bell, Moon, Sun, Menu, X,
  Zap, LogOut, ChevronRight, Search, Repeat, ArrowUpRight
} from 'lucide-react';

const sidebarItems = [
  { path: '/app/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { path: '/app/leads', label: 'Leads', icon: Users },
  { path: '/app/clients', label: 'Clients', icon: UserCircle },
  { path: '/app/projects', label: 'Projects', icon: FolderKanban },
  { path: '/app/retainers', label: 'Retainers', icon: Repeat },
  { path: '/app/payments', label: 'Payments', icon: CreditCard },
  { path: '/app/messages', label: 'Messages', icon: MessageSquare },
  { path: '/app/meetings', label: 'Meetings', icon: Calendar },
  { path: '/app/tasks', label: 'Tasks', icon: CheckSquare },
  { path: '/app/documents', label: 'Documents', icon: FileText },
  { path: '/app/team', label: 'Team', icon: UserCog },
  { path: '/app/billing', label: 'Billing', icon: Receipt },
];

const bottomItems = [
  { path: '/app/activity', label: 'Activity', icon: Activity },
  { path: '/app/settings', label: 'Settings', icon: Settings },
];

export default function AppLayout() {
  const { darkMode, toggleDarkMode } = useApp();
  const store = useStore();
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);

  const { notifications, markNotificationRead, markAllNotificationsRead, currentUser, currentWorkspace, logout } = store;
  const unreadCount = notifications.filter((n: any) => !n.read).length;
  
  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen flex" style={{ backgroundColor: '#FAFAF8' }}>
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-40 bg-black/40 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Sidebar - Always fixed/sticky */}
      <aside className={`fixed inset-y-0 left-0 z-50 w-64 flex flex-col bg-white border-r transition-transform ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`} style={{ borderColor: '#E7E5E4' }}>
        {/* Logo + Workspace */}
        <div className="flex items-center justify-between h-16 px-4 border-b" style={{ borderColor: '#E7E5E4' }}>
          <div className="flex items-center gap-2.5 cursor-pointer" onClick={() => navigate('/')}>
            <div className="w-8 h-8 bg-gradient-to-br from-orange-500 to-orange-600 rounded-lg flex items-center justify-center shadow-sm">
              <Zap className="w-5 h-5 text-white" strokeWidth={2.5} />
            </div>
            <div>
              <span className="text-lg font-bold tracking-tight" style={{ color: '#1C1917' }}>Client<span style={{ color: '#ea580c' }}>Tap</span></span>
            </div>
          </div>
          <button onClick={() => setSidebarOpen(false)} className="lg:hidden p-1 rounded-lg hover:bg-gray-100">
            <X className="w-5 h-5" style={{ color: '#78716C' }} />
          </button>
        </div>

        {/* Workspace info */}
        <div className="px-4 py-3 border-b" style={{ borderColor: '#E7E5E4' }}>
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-lg flex items-center justify-center text-lg overflow-hidden" style={{ backgroundColor: '#FFF8F2' }}>
              {currentWorkspace?.logo && currentWorkspace.logo.startsWith('data:image') ? (
                <img src={currentWorkspace.logo} alt="Workspace Logo" className="w-full h-full object-cover" />
              ) : (
                <span>{currentWorkspace?.logo || '🏢'}</span>
              )}
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-semibold truncate" style={{ color: '#1C1917' }}>{currentWorkspace?.name || 'My Workspace'}</p>
              <p className="text-xs" style={{ color: '#78716C' }}>{currentWorkspace?.plan ? currentWorkspace.plan.charAt(0).toUpperCase() + currentWorkspace.plan.slice(1) : 'Free'} plan</p>
            </div>
          </div>
        </div>

        {/* Main nav */}
        <nav className="flex-1 overflow-y-auto py-3 px-3">
          <ul className="space-y-0.5">
            {sidebarItems.map((item) => {
              const isActive = location.pathname === item.path || (item.path === '/app/payments' && location.pathname === '/app/invoices');
              return (
                <li key={item.path}>
                  <button
                    onClick={() => { navigate(item.path); setSidebarOpen(false); }}
                    className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-[13px] font-medium transition-all ${
                      isActive
                        ? 'bg-orange-50 text-orange-700'
                        : 'text-stone-600 hover:bg-stone-50 hover:text-stone-900'
                    }`}
                    style={isActive ? { backgroundColor: '#fff7ed', color: '#c2410c' } : {}}
                  >
                    <item.icon className="w-[18px] h-[18px] shrink-0" strokeWidth={isActive ? 2.2 : 1.8} />
                    <span>{item.label}</span>
                    {item.label === 'Messages' && (
                      <span className="ml-auto bg-orange-600 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">2</span>
                    )}
                  </button>
                </li>
              );
            })}
          </ul>

          <div className="my-3 border-t" style={{ borderColor: '#E7E5E4' }} />

          <ul className="space-y-0.5">
            {bottomItems.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <li key={item.path}>
                  <button
                    onClick={() => { navigate(item.path); setSidebarOpen(false); }}
                    className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-[13px] font-medium transition-all ${
                      isActive
                        ? 'bg-orange-50 text-orange-700'
                        : 'text-stone-600 hover:bg-stone-50 hover:text-stone-900'
                    }`}
                    style={isActive ? { backgroundColor: '#fff7ed', color: '#c2410c' } : {}}
                  >
                    <item.icon className="w-[18px] h-[18px] shrink-0" strokeWidth={isActive ? 2.2 : 1.8} />
                    <span>{item.label}</span>
                  </button>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* User */}
        <div className="p-3 border-t" style={{ borderColor: '#E7E5E4' }}>
          <div className="flex items-center gap-2.5 px-2 py-1.5">
            <div className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold" style={{ backgroundColor: '#FFF8F2', color: '#c2410c' }}>
              {currentUser?.avatar || currentUser?.name?.charAt(0) || '👤'}
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-medium truncate" style={{ color: '#1C1917' }}>{currentUser?.name || 'User'}</p>
              <p className="text-xs truncate" style={{ color: '#78716C' }}>{currentUser?.role || 'owner'}</p>
            </div>
            <button onClick={handleLogout} className="p-1.5 rounded-lg hover:bg-stone-100 transition" title="Sign out">
              <LogOut className="w-4 h-4" style={{ color: '#78716C' }} />
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0 lg:ml-64">
        {/* Top Bar */}
        <header className="sticky top-0 z-30 h-16 flex items-center justify-between px-4 lg:px-8 border-b bg-white/80 backdrop-blur-md" style={{ borderColor: '#E7E5E4' }}>
          <div className="flex items-center gap-3 flex-1">
            <button onClick={() => setSidebarOpen(true)} className="lg:hidden p-2 rounded-lg hover:bg-stone-100">
              <Menu className="w-5 h-5" style={{ color: '#78716C' }} />
            </button>
            
            {/* Global search */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: '#A8A29E' }} />
              <input
                type="text"
                placeholder="Search clients, leads, projects, invoices..."
                className="w-full pl-10 pr-4 py-2 rounded-lg text-sm bg-stone-50 border focus:outline-none focus:ring-2 focus:ring-orange-500/30 focus:bg-white transition"
                style={{ borderColor: '#E7E5E4', color: '#1C1917' }}
              />
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            <button onClick={() => navigate('/portal')} className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition hover:bg-stone-50" style={{ color: '#78716C' }}>
              Client portal <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
            
            {/* Notifications */}
            <div className="relative">
              <button onClick={() => setNotifOpen(!notifOpen)} className="relative p-2 rounded-lg hover:bg-stone-100 transition">
                <Bell className="w-5 h-5" style={{ color: '#78716C' }} />
                {unreadCount > 0 && (
                  <span className="absolute top-1 right-1 w-4 h-4 bg-orange-600 text-white text-[10px] font-bold rounded-full flex items-center justify-center">{unreadCount}</span>
                )}
              </button>
              {notifOpen && (
                <div className="absolute right-0 top-12 w-80 rounded-2xl border bg-white overflow-hidden" style={{ borderColor: '#E7E5E4', boxShadow: '0 10px 40px -8px rgba(28,25,23,0.12)' }}>
                  <div className="p-4 border-b" style={{ borderColor: '#E7E5E4' }}>
                    <h3 className="font-semibold text-sm" style={{ color: '#1C1917' }}>Notifications</h3>
                  </div>
                  <div className="p-3 border-b flex items-center justify-between" style={{ borderColor: '#E7E5E4' }}>
                    <span className="text-xs font-medium" style={{ color: '#78716C' }}>{unreadCount} unread</span>
                    {unreadCount > 0 && (
                      <button onClick={markAllNotificationsRead} className="text-xs font-medium hover:underline" style={{ color: '#ea580c' }}>
                        Mark all as read
                      </button>
                    )}
                  </div>
                  <div className="max-h-80 overflow-y-auto">
                    {notifications.map((n) => (
                      <div 
                        key={n.id} 
                        onClick={() => markNotificationRead(n.id)}
                        className={`px-4 py-3 border-b last:border-0 cursor-pointer transition hover:bg-stone-50 ${!n.read ? 'bg-orange-50/50' : ''}`} 
                        style={{ borderColor: '#E7E5E4' }}
                      >
                        <p className="text-sm font-medium" style={{ color: '#1C1917' }}>{n.title}</p>
                        <p className="text-xs" style={{ color: '#78716C' }}>{n.message}</p>
                        <p className="text-xs mt-1" style={{ color: '#A8A29E' }}>{n.time}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <button onClick={toggleDarkMode} className="p-2 rounded-lg hover:bg-stone-100 transition">
              {darkMode ? <Sun className="w-5 h-5" style={{ color: '#78716C' }} /> : <Moon className="w-5 h-5" style={{ color: '#78716C' }} />}
            </button>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto">
          <Outlet />
        </main>
      </div>

      {/* Mobile bottom nav */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white border-t flex items-center justify-around py-2 px-2 mobile-bottom-nav" style={{ borderColor: '#E7E5E4' }}>
        {[
          { path: '/app/dashboard', icon: LayoutDashboard, label: 'Home' },
          { path: '/app/leads', icon: Users, label: 'Leads' },
          { path: '/app/projects', icon: FolderKanban, label: 'Projects' },
          { path: '/app/messages', icon: MessageSquare, label: 'Messages' },
          { path: '/app/settings', icon: Settings, label: 'More' },
        ].map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              className="flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-lg"
            >
              <item.icon className="w-5 h-5" strokeWidth={isActive ? 2.2 : 1.8} style={{ color: isActive ? '#ea580c' : '#78716C' }} />
              <span className="text-[10px] font-medium" style={{ color: isActive ? '#ea580c' : '#78716C' }}>{item.label}</span>
            </button>
          );
        })}
      </nav>
    </div>
  );
}
