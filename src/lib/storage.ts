// Data storage service - workspace-scoped, structured for Supabase swap-in
import { leads, clients, projects, invoices, payments, tasks, messages, meetings, documents, notifications, expenses, retainers, reviews } from '../data/mockData';

export interface WorkspaceData {
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
}

function getDataKey(workspaceId: string): string {
  return `clienttap_data_${workspaceId}`;
}

export const storage = {
  // Get all data for a workspace
  getData(workspaceId: string): WorkspaceData {
    const key = getDataKey(workspaceId);
    const data = localStorage.getItem(key);
    if (data) {
      return JSON.parse(data);
    }
    // Return seed data for first-time workspace
    return {
      leads: [...leads],
      clients: [...clients],
      projects: [...projects],
      invoices: [...invoices],
      payments: [...payments],
      tasks: [...tasks],
      messages: [...messages],
      meetings: [...meetings],
      documents: [...documents],
      notifications: [...notifications],
      expenses: [...expenses],
      retainers: [...retainers],
      reviews: [...reviews],
    };
  },

  // Save all data for a workspace
  saveData(workspaceId: string, data: WorkspaceData): void {
    const key = getDataKey(workspaceId);
    localStorage.setItem(key, JSON.stringify(data));
  },

  // Update a specific collection
  updateCollection<K extends keyof WorkspaceData>(
    workspaceId: string,
    collection: K,
    updater: (items: WorkspaceData[K]) => WorkspaceData[K]
  ): WorkspaceData[K] {
    const data = this.getData(workspaceId);
    data[collection] = updater(data[collection]);
    this.saveData(workspaceId, data);
    return data[collection];
  },

  // Add item to collection
  addItem<K extends keyof WorkspaceData>(
    workspaceId: string,
    collection: K,
    item: any
  ): void {
    this.updateCollection(workspaceId, collection, (items: any[]) => [...items, item]);
  },

  // Update item in collection
  updateItem<K extends keyof WorkspaceData>(
    workspaceId: string,
    collection: K,
    id: string,
    updates: Partial<any>
  ): void {
    this.updateCollection(workspaceId, collection, (items: any[]) =>
      items.map((item: any) => item.id === id ? { ...item, ...updates } : item)
    );
  },

  // Delete item from collection
  deleteItem<K extends keyof WorkspaceData>(
    workspaceId: string,
    collection: K,
    id: string
  ): void {
    this.updateCollection(workspaceId, collection, (items: any[]) =>
      items.filter((item: any) => item.id !== id)
    );
  },

  // Generate unique ID
  genId(prefix: string): string {
    return `${prefix}_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
  },

  // Clear workspace data (for testing)
  clearData(workspaceId: string): void {
    const key = getDataKey(workspaceId);
    localStorage.removeItem(key);
  },
};
