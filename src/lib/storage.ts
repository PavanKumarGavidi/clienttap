import { supabase } from './supabase';

// Helper function to convert snake_case to camelCase
function snakeToCamel(str: string): string {
  return str.replace(/_([a-z])/g, (g) => g[1].toUpperCase());
}

// Helper function to convert object keys from snake_case to camelCase
function convertKeysToCamel(obj: any): any {
  if (Array.isArray(obj)) {
    return obj.map(convertKeysToCamel);
  } else if (obj !== null && typeof obj === 'object') {
    return Object.keys(obj).reduce((acc, key) => {
      const camelKey = snakeToCamel(key);
      acc[camelKey] = convertKeysToCamel(obj[key]);
      return acc;
    }, {} as any);
  }
  return obj;
}

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

      // Convert snake_case to camelCase for all data
      return {
        leads: convertKeysToCamel(leads || []),
        clients: convertKeysToCamel(clients || []),
        projects: convertKeysToCamel(projects || []),
        invoices: convertKeysToCamel(invoices || []),
        payments: convertKeysToCamel(payments || []),
        tasks: convertKeysToCamel(tasks || []),
        messages: convertKeysToCamel(messages || []),
        meetings: convertKeysToCamel(meetings || []),
        documents: convertKeysToCamel(documents || []),
        notifications: convertKeysToCamel(notifications || []),
        expenses: convertKeysToCamel(expenses || []),
        retainers: convertKeysToCamel(retainers || []),
        reviews: convertKeysToCamel(reviews || [])
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
  ): Promise<any> {
    console.log(`[Storage] Adding ${collection} to workspace ${workspaceId}`);
    console.log('[Storage] Item data:', item);
    
    // Remove id field - let database generate UUID
    const { id, ...itemWithoutId } = item;
    
    // Ensure all required fields are present
    const dataToInsert = {
      ...itemWithoutId,
      workspace_id: workspaceId,
    };
    
    console.log('[Storage] Inserting data (without id):', dataToInsert);
    
    const { data, error } = await supabase
      .from(collection)
      .insert([dataToInsert])
      .select();
    
    if (error) {
      console.error(`[Storage] Error adding ${collection}:`, error);
      console.error('[Storage] Error details:', error.message);
      console.error('[Storage] Error code:', error.code);
      throw new Error(`Failed to add ${collection}: ${error.message}`);
    }
    
    console.log(`[Storage] ${collection} added successfully:`, data);
    return data;
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
