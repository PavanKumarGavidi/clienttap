import { supabase } from './supabase';

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

export const storage = {
  // Get all data for a workspace
  async getData(workspaceId: string): Promise<WorkspaceData> {
    try {
      // Fetch all data in parallel
      const [
        { data: leads },
        { data: clients },
        { data: projects },
        { data: invoices },
        { data: payments },
        { data: tasks },
        { data: messages },
        { data: meetings },
        { data: documents },
        { data: notifications },
        { data: expenses },
        { data: retainers },
        { data: reviews }
      ] = await Promise.all([
        supabase.from('leads').select('*').eq('workspace_id', workspaceId).eq('deleted_at', null),
        supabase.from('clients').select('*').eq('workspace_id', workspaceId).eq('deleted_at', null),
        supabase.from('projects').select('*').eq('workspace_id', workspaceId).eq('deleted_at', null),
        supabase.from('invoices').select('*').eq('workspace_id', workspaceId),
        supabase.from('payments').select('*').eq('workspace_id', workspaceId),
        supabase.from('tasks').select('*').eq('workspace_id', workspaceId),
        supabase.from('messages').select('*').eq('workspace_id', workspaceId),
        supabase.from('meetings').select('*').eq('workspace_id', workspaceId),
        supabase.from('documents').select('*').eq('workspace_id', workspaceId),
        supabase.from('notifications').select('*').eq('workspace_id', workspaceId),
        supabase.from('expenses').select('*').eq('workspace_id', workspaceId),
        supabase.from('retainers').select('*').eq('workspace_id', workspaceId),
        supabase.from('reviews').select('*').eq('workspace_id', workspaceId)
      ]);

      return {
        leads: leads || [],
        clients: clients || [],
        projects: projects || [],
        invoices: invoices || [],
        payments: payments || [],
        tasks: tasks || [],
        messages: messages || [],
        meetings: meetings || [],
        documents: documents || [],
        notifications: notifications || [],
        expenses: expenses || [],
        retainers: retainers || [],
        reviews: reviews || []
      };
    } catch (error) {
      console.error('Error fetching workspace data:', error);
      return {
        leads: [],
        clients: [],
        projects: [],
        invoices: [],
        payments: [],
        tasks: [],
        messages: [],
        meetings: [],
        documents: [],
        notifications: [],
        expenses: [],
        retainers: [],
        reviews: []
      };
    }
  },

  // Add item to collection
  async addItem<K extends keyof WorkspaceData>(
    workspaceId: string,
    collection: K,
    item: any
  ): Promise<void> {
    const { error } = await supabase
      .from(collection)
      .insert({ ...item, workspace_id: workspaceId });
    
    if (error) {
      console.error(`Error adding ${collection}:`, error);
      throw error;
    }
  },

  // Update item in collection
  async updateItem<K extends keyof WorkspaceData>(
    workspaceId: string,
    collection: K,
    id: string,
    updates: Partial<any>
  ): Promise<void> {
    const { error } = await supabase
      .from(collection)
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', id)
      .eq('workspace_id', workspaceId);
    
    if (error) {
      console.error(`Error updating ${collection}:`, error);
      throw error;
    }
  },

  // Delete item from collection (soft delete)
  async deleteItem<K extends keyof WorkspaceData>(
    workspaceId: string,
    collection: K,
    id: string
  ): Promise<void> {
    const { error } = await supabase
      .from(collection)
      .update({ deleted_at: new Date().toISOString() })
      .eq('id', id)
      .eq('workspace_id', workspaceId);
    
    if (error) {
      console.error(`Error deleting ${collection}:`, error);
      throw error;
    }
  },

  // Generate unique ID
  genId(prefix: string): string {
    return `${prefix}_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
  },

  // Clear workspace data (for testing)
  async clearData(workspaceId: string): Promise<void> {
    const tables: (keyof WorkspaceData)[] = [
      'leads', 'clients', 'projects', 'invoices', 'payments',
      'tasks', 'messages', 'meetings', 'documents', 'notifications',
      'expenses', 'retainers', 'reviews'
    ];

    for (const table of tables) {
      await supabase
        .from(table)
        .delete()
        .eq('workspace_id', workspaceId);
    }
  }
};
