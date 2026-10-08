import { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { auth } from '../lib/auth';
import { storage } from '../lib/storage';
import { teamMembers, pipelineStages, revenueData, revenueByType, leadsBySource, plans } from '../data/mockData';

interface Store {
  // Current user & workspace
  currentUser: any;
  currentWorkspace: any;
  
  // Data
  leads: any[];
  clients: any[];
  projects: any[];
  invoices: any[];
  payments: any[];
  tasks: any[];
  messages: any[];
  meetings: any[];
  documents: any[];
  notifications: any[];
  expenses: any[];
  retainers: any[];
  reviews: any[];
  
  // Static data
  teamMembers: any[];
  pipelineStages: any[];
  revenueData: any[];
  revenueByType: any[];
  leadsBySource: any[];
  plans: any;
  
  // Lead actions
  addLead: (lead: any) => void;
  updateLead: (id: string, updates: any) => void;
  deleteLead: (id: string) => void;
  moveLeadToStage: (id: string, stage: string) => void;
  convertLeadToClient: (id: string) => void;
  
  // Client actions
  addClient: (client: any) => void;
  updateClient: (id: string, updates: any) => void;
  
  // Project actions
  addProject: (project: any) => void;
  updateProject: (id: string, updates: any) => void;
  
  // Invoice actions
  addInvoice: (invoice: any) => void;
  
  // Payment actions
  addPayment: (payment: any) => void;
  
  // Task actions
  addTask: (task: any) => void;
  updateTask: (id: string, updates: any) => void;
  
  // Message actions
  addMessage: (msg: any) => void;
  
  // Meeting actions
  addMeeting: (meeting: any) => void;
  
  // Document actions
  addDocument: (doc: any) => void;
  
  // Notification actions
  addNotification: (n: any) => void;
  markNotificationRead: (id: string) => void;
  markAllNotificationsRead: () => void;
  
  // Auth actions
  logout: () => void;
  updateProfile: (updates: any) => void;
  updateWorkspace: (updates: any) => void;
  
  // Refresh data from storage
  refresh: () => void;
}

const StoreContext = createContext<Store | null>(null);

export function StoreProvider({ children }: { children: ReactNode }) {
  const [currentUser, setCurrentUser] = useState<any>(auth.getCurrentUser());
  const [currentWorkspace, setCurrentWorkspace] = useState<any>(auth.getCurrentWorkspace());
  
  const getWorkspaceId = useCallback(() => {
    return currentWorkspace?.id || 'default';
  }, [currentWorkspace]);
  
  // Load data from storage
  const [data, setData] = useState(() => storage.getData(getWorkspaceId()));
  
  // Refresh data from storage
  const refresh = useCallback(() => {
    setData(storage.getData(getWorkspaceId()));
    setCurrentUser(auth.getCurrentUser());
    setCurrentWorkspace(auth.getCurrentWorkspace());
  }, [getWorkspaceId]);
  
  // Persist helper
  const persist = useCallback((newData: any) => {
    storage.saveData(getWorkspaceId(), newData);
    setData(newData);
  }, [getWorkspaceId]);
  
  // ID generator
  const genId = (prefix: string) => storage.genId(prefix);
  
  // Lead actions
  const addLead = (lead: any) => {
    const newLead = { ...lead, id: genId('l') };
    const newData = { ...data, leads: [...data.leads, newLead] };
    persist(newData);
  };
  
  const updateLead = (id: string, updates: any) => {
    const newData = { ...data, leads: data.leads.map((l: any) => l.id === id ? { ...l, ...updates } : l) };
    persist(newData);
  };
  
  const deleteLead = (id: string) => {
    const newData = { ...data, leads: data.leads.filter((l: any) => l.id !== id) };
    persist(newData);
  };
  
  const moveLeadToStage = (id: string, stage: string) => {
    updateLead(id, { stage });
  };
  
  const convertLeadToClient = (id: string) => {
    const lead = data.leads.find((l: any) => l.id === id);
    if (!lead) return;
    
    const newClient = {
      id: genId('c'),
      name: lead.name,
      company: lead.company,
      email: lead.email,
      phone: lead.phone,
      address: '',
      gstin: '',
      currency: lead.currency,
      currencySymbol: lead.currency === 'USD' ? '$' : '₹',
      owner: lead.assignedTo,
      portalEnabled: false,
      totalProjects: 0,
      totalInvoiced: 0,
      totalPaid: 0,
      outstanding: 0,
      since: new Date().toISOString().split('T')[0],
    };
    
    const newData = {
      ...data,
      clients: [...data.clients, newClient],
      leads: data.leads.map((l: any) => l.id === id ? { ...l, stage: 's5', wonDate: new Date().toISOString().split('T')[0] } : l),
    };
    persist(newData);
  };
  
  // Client actions
  const addClient = (client: any) => {
    const newClient = { ...client, id: genId('c') };
    const newData = { ...data, clients: [...data.clients, newClient] };
    persist(newData);
  };
  
  const updateClient = (id: string, updates: any) => {
    const newData = { ...data, clients: data.clients.map((c: any) => c.id === id ? { ...c, ...updates } : c) };
    persist(newData);
  };
  
  // Project actions
  const addProject = (project: any) => {
    const newProject = { ...project, id: genId('p') };
    const newData = { ...data, projects: [...data.projects, newProject] };
    persist(newData);
  };
  
  const updateProject = (id: string, updates: any) => {
    const newData = { ...data, projects: data.projects.map((p: any) => p.id === id ? { ...p, ...updates } : p) };
    persist(newData);
  };
  
  // Invoice actions
  const addInvoice = (invoice: any) => {
    const newInvoice = { ...invoice, id: genId('inv') };
    const newData = { ...data, invoices: [...data.invoices, newInvoice] };
    persist(newData);
  };
  
  // Payment actions
  const addPayment = (payment: any) => {
    const newPayment = { ...payment, id: genId('pay') };
    const newData = { ...data, payments: [...data.payments, newPayment] };
    persist(newData);
  };
  
  // Task actions
  const addTask = (task: any) => {
    const newTask = { ...task, id: genId('t') };
    const newData = { ...data, tasks: [...data.tasks, newTask] };
    persist(newData);
  };
  
  const updateTask = (id: string, updates: any) => {
    const newData = { ...data, tasks: data.tasks.map((t: any) => t.id === id ? { ...t, ...updates } : t) };
    persist(newData);
  };
  
  // Message actions
  const addMessage = (msg: any) => {
    const newMsg = { ...msg, id: genId('msg') };
    const newData = { ...data, messages: [...data.messages, newMsg] };
    persist(newData);
  };
  
  // Meeting actions
  const addMeeting = (meeting: any) => {
    const newMeeting = { ...meeting, id: genId('m') };
    const newData = { ...data, meetings: [...data.meetings, newMeeting] };
    persist(newData);
  };
  
  // Document actions
  const addDocument = (doc: any) => {
    const newDoc = { ...doc, id: genId('d') };
    const newData = { ...data, documents: [...data.documents, newDoc] };
    persist(newData);
  };
  
  // Notification actions
  const addNotification = (n: any) => {
    const newN = { ...n, id: genId('n'), time: n.time || 'Just now' };
    const newData = { ...data, notifications: [newN, ...data.notifications] };
    persist(newData);
  };
  
  const markNotificationRead = (id: string) => {
    const newData = { ...data, notifications: data.notifications.map((n: any) => n.id === id ? { ...n, read: true } : n) };
    persist(newData);
  };
  
  const markAllNotificationsRead = () => {
    const newData = { ...data, notifications: data.notifications.map((n: any) => ({ ...n, read: true })) };
    persist(newData);
  };
  
  // Auth actions
  const logout = () => {
    auth.logout();
    setCurrentUser(null);
    setCurrentWorkspace(null);
  };
  
  const updateProfile = (updates: any) => {
    if (!currentUser) return;
    auth.updateUser(currentUser.id, updates);
    setCurrentUser(auth.getCurrentUser());
  };
  
  const updateWorkspace = (updates: any) => {
    if (!currentWorkspace) return;
    auth.updateWorkspace(currentWorkspace.id, updates);
    setCurrentWorkspace(auth.getCurrentWorkspace());
  };
  
  const store: Store = {
    currentUser,
    currentWorkspace,
    leads: data.leads,
    clients: data.clients,
    projects: data.projects,
    invoices: data.invoices,
    payments: data.payments,
    tasks: data.tasks,
    messages: data.messages,
    meetings: data.meetings,
    documents: data.documents,
    notifications: data.notifications,
    expenses: data.expenses,
    retainers: data.retainers,
    reviews: data.reviews,
    teamMembers,
    pipelineStages,
    revenueData,
    revenueByType,
    leadsBySource,
    plans,
    addLead,
    updateLead,
    deleteLead,
    moveLeadToStage,
    convertLeadToClient,
    addClient,
    updateClient,
    addProject,
    updateProject,
    addInvoice,
    addPayment,
    addTask,
    updateTask,
    addMessage,
    addMeeting,
    addDocument,
    addNotification,
    markNotificationRead,
    markAllNotificationsRead,
    logout,
    updateProfile,
    updateWorkspace,
    refresh,
  };
  
  return (
    <StoreContext.Provider value={store}>
      {children}
    </StoreContext.Provider>
  );
}

export function useStore() {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error('useStore must be used within StoreProvider');
  return ctx;
}
