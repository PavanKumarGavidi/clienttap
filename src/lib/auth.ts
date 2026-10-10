import { supabase } from './supabase';

export interface User {
  id: string;
  name: string;
  email: string;
  avatar: string;
  role: 'owner' | 'member';
  created_at: string;
}

export interface Workspace {
  id: string;
  owner_id: string;
  name: string;
  slug: string;
  logo: string;
  currency: string;
  currency_symbol: string;
  timezone: string;
  gstin: string;
  plan: 'free' | 'pro' | 'ultra';
  created_at: string;
}

function getInitials(name: string): string {
  return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
}

export const auth = {
  // Sign up - SIMPLIFIED AND BULLETPROOF
  async signup(
    name: string,
    email: string,
    password: string,
    workspaceName: string,
    slug: string,
    country: string = 'IN'
  ): Promise<{ success: boolean; error?: string; user?: User }> {
    try {
      console.log('🔐 Starting signup...');

      // Step 1: Create auth user
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { name, workspace_name: workspaceName, slug, country }
        }
      });

      if (authError) {
        console.error('❌ Auth error:', authError);
        return { success: false, error: authError.message };
      }

      if (!authData.user) {
        return { success: false, error: 'Failed to create user' };
      }

      console.log('✅ User created:', authData.user.id);

      // Step 2: Create profile
      const { error: profileError } = await supabase
        .from('profiles')
        .insert({
          user_id: authData.user.id,
          name,
          email,
          avatar: getInitials(name),
          role: 'owner'
        });

      if (profileError) {
        console.error('⚠️ Profile error:', profileError.message);
      }

      // Step 3: Create workspace - THIS IS CRITICAL
      const { data: workspace, error: workspaceError } = await supabase
        .from('workspaces')
        .insert({
          owner_id: authData.user.id,
          name: workspaceName || `${name}'s Agency`,
          slug: slug || name.toLowerCase().replace(/\s+/g, '-'),
          logo: getInitials(name),
          currency: country === 'IN' ? 'INR' : 'USD',
          currency_symbol: country === 'IN' ? '₹' : '$',
          timezone: country === 'IN' ? 'Asia/Kolkata' : 'UTC',
          plan: 'free'
        })
        .select()
        .single();

      if (workspaceError) {
        console.error('❌ Workspace error:', workspaceError);
        return { success: false, error: `Workspace creation failed: ${workspaceError.message}` };
      }

      console.log('✅ Workspace created:', workspace.id, workspace.name);

      // Step 4: Auto sign-in
      await supabase.auth.signInWithPassword({ email, password });

      const user: User = {
        id: authData.user.id,
        name,
        email,
        avatar: getInitials(name),
        role: 'owner',
        created_at: new Date().toISOString()
      };

      console.log('🎉 Signup complete!');
      return { success: true, user };
    } catch (error: any) {
      console.error('❌ Signup exception:', error);
      return { success: false, error: error.message };
    }
  },

  // Login
  async login(email: string, password: string): Promise<{ success: boolean; error?: string; user?: User }> {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });

      if (error) {
        return { success: false, error: error.message };
      }

      if (!data.user) {
        return { success: false, error: 'Login failed' };
      }

      // Fetch profile
      const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', data.user.id)
        .maybeSingle();

      const user: User = {
        id: data.user.id,
        name: profile?.name || data.user.email?.split('@')[0] || 'User',
        email: data.user.email || '',
        avatar: profile?.avatar || getInitials(profile?.name || 'User'),
        role: profile?.role || 'owner',
        created_at: data.user.created_at || new Date().toISOString()
      };

      return { success: true, user };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  },

  // Get current user
  async getCurrentUser(): Promise<User | null> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) return null;

      // Fetch profile
      const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle();

      // If no profile, create one
      if (!profile) {
        const userName = user.user_metadata?.name || user.email?.split('@')[0] || 'User';
        await supabase.from('profiles').insert({
          user_id: user.id,
          name: userName,
          email: user.email,
          avatar: getInitials(userName),
          role: 'owner'
        });
      }

      return {
        id: user.id,
        name: profile?.name || user.user_metadata?.name || user.email?.split('@')[0] || 'User',
        email: user.email || '',
        avatar: profile?.avatar || getInitials(profile?.name || 'User'),
        role: profile?.role || 'owner',
        created_at: user.created_at || new Date().toISOString()
      };
    } catch (error) {
      console.error('❌ getCurrentUser error:', error);
      return null;
    }
  },

  // Get current workspace - THIS IS THE KEY FUNCTION
  async getCurrentWorkspace(): Promise<Workspace | null> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        console.log('⚠️ No user logged in');
        return null;
      }

      console.log('🏢 Getting workspace for user:', user.id);

      // Fetch workspace
      const { data: workspace, error } = await supabase
        .from('workspaces')
        .select('*')
        .eq('owner_id', user.id)
        .maybeSingle();

      if (error) {
        console.error('⚠️ Workspace fetch error:', error);
      }

      // If no workspace, create one automatically
      if (!workspace) {
        console.log('📝 No workspace found, creating one...');
        const userName = user.user_metadata?.name || user.email?.split('@')[0] || 'User';
        const workspaceName = user.user_metadata?.workspace_name || `${userName}'s Agency`;
        const slug = user.user_metadata?.slug || userName.toLowerCase().replace(/\s+/g, '-') + '-' + Date.now();
        
        const { data: newWorkspace, error: createError } = await supabase
          .from('workspaces')
          .insert({
            owner_id: user.id,
            name: workspaceName,
            slug: slug,
            logo: getInitials(userName),
            currency: 'INR',
            currency_symbol: '₹',
            timezone: 'Asia/Kolkata',
            plan: 'free'
          })
          .select()
          .single();

        if (createError) {
          console.error('❌ Workspace creation error:', createError);
          return null;
        }

        console.log('✅ Workspace created:', newWorkspace.id, newWorkspace.name);
        return {
          id: newWorkspace.id,
          owner_id: newWorkspace.owner_id,
          name: newWorkspace.name,
          slug: newWorkspace.slug,
          logo: newWorkspace.logo,
          currency: newWorkspace.currency,
          currency_symbol: newWorkspace.currency_symbol,
          timezone: newWorkspace.timezone,
          gstin: newWorkspace.gstin || '',
          plan: newWorkspace.plan,
          created_at: newWorkspace.created_at
        };
      }

      console.log('✅ Workspace found:', workspace.id, workspace.name);
      return {
        id: workspace.id,
        owner_id: workspace.owner_id,
        name: workspace.name,
        slug: workspace.slug,
        logo: workspace.logo,
        currency: workspace.currency,
        currency_symbol: workspace.currency_symbol,
        timezone: workspace.timezone,
        gstin: workspace.gstin || '',
        plan: workspace.plan,
        created_at: workspace.created_at
      };
    } catch (error) {
      console.error('❌ getCurrentWorkspace error:', error);
      return null;
    }
  },

  // Logout
  async logout(): Promise<void> {
    await supabase.auth.signOut();
  },

  // Check if authenticated
  async isAuthenticated(): Promise<boolean> {
    const { data: { session } } = await supabase.auth.getSession();
    return !!session;
  },

  // Update profile
  async updateProfile(userId: string, updates: Partial<User>): Promise<void> {
    const { error } = await supabase
      .from('profiles')
      .update(updates)
      .eq('user_id', userId);
    
    if (error) throw error;
  },

  // Update workspace
  async updateWorkspace(workspaceId: string, updates: Partial<Workspace>): Promise<void> {
    const { error } = await supabase
      .from('workspaces')
      .update(updates)
      .eq('id', workspaceId);
    
    if (error) throw error;
  },

  // Reset password
  async resetPassword(email: string): Promise<{ success: boolean; error?: string }> {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: window.location.origin + '/#/reset-password'
      });

      if (error) {
        return { success: false, error: error.message };
      }

      return { success: true };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  },

  // Update password
  async updatePassword(newPassword: string): Promise<{ success: boolean; error?: string }> {
    try {
      const { error } = await supabase.auth.updateUser({
        password: newPassword
      });

      if (error) {
        return { success: false, error: error.message };
      }

      return { success: true };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  },

  // Google OAuth
  async loginWithGoogle(): Promise<{ success: boolean; error?: string }> {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: window.location.origin + '/#/app/dashboard'
        }
      });

      if (error) {
        return { success: false, error: error.message };
      }

      return { success: true };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  }
};
