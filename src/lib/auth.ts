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
  // Sign up a new user
  async signup(
    name: string,
    email: string,
    password: string,
    workspaceName: string,
    slug: string,
    country: string = 'IN'
  ): Promise<{ success: boolean; error?: string; user?: User }> {
    try {
      console.log('🔐 Starting signup process...');
      console.log('📝 User details:', { name, email, workspaceName, slug, country });

      // Step 1: Create auth user
      console.log('👤 Step 1: Creating auth user...');
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { name, workspace_name: workspaceName, slug, country }
        }
      });

      if (authError) {
        console.error('❌ Auth creation failed:', authError);
        return { success: false, error: `Auth error: ${authError.message}` };
      }

      if (!authData.user) {
        console.error('❌ No user data returned');
        return { success: false, error: 'Failed to create user - no user data returned' };
      }

      console.log('✅ Auth user created:', authData.user.id);

      // Step 2: Create profile
      console.log('👤 Step 2: Creating profile...');
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .insert({
          user_id: authData.user.id,
          name,
          email,
          avatar: getInitials(name),
          role: 'owner'
        })
        .select()
        .single();

      if (profileError) {
        console.error('⚠️ Profile creation error:', profileError);
        // Continue anyway - we can create it later
      } else {
        console.log('✅ Profile created:', profileData?.id);
      }

      // Step 3: Create workspace
      console.log('🏢 Step 3: Creating workspace...');
      console.log('📝 Workspace details:', { 
        owner_id: authData.user.id, 
        name: workspaceName, 
        slug: slug 
      });
      
      let { data: workspace, error: workspaceError } = await supabase
        .from('workspaces')
        .insert({
          owner_id: String(authData.user.id), // Convert UUID to string
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
        console.error('❌ Workspace creation failed:', workspaceError);
        console.error('❌ Error details:', JSON.stringify(workspaceError, null, 2));
        
        // Try to create workspace with minimal fields as fallback
        console.log('🔄 Attempting fallback workspace creation...');
        const { data: fallbackWorkspace, error: fallbackError } = await supabase
          .from('workspaces')
          .insert({
            owner_id: String(authData.user.id),
            name: workspaceName || `${name}'s Agency`,
            slug: (slug || name.toLowerCase().replace(/\s+/g, '-')) + '-' + Date.now()
          })
          .select()
          .single();
        
        if (fallbackError) {
          console.error('❌ Fallback workspace creation also failed:', fallbackError);
          return { success: false, error: `Workspace error: ${workspaceError.message}` };
        }
        
        console.log('✅ Fallback workspace created:', fallbackWorkspace?.id);
        workspace = fallbackWorkspace;
      } else {
        console.log('✅ Workspace created:', workspace?.id);
      }

      // Step 4: Verify session
      console.log('🔑 Step 4: Verifying session...');
      const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
      
      if (sessionError || !sessionData.session) {
        console.error('⚠️ Session verification failed, attempting auto sign-in...');
        const { error: signInError } = await supabase.auth.signInWithPassword({
          email,
          password
        });
        
        if (signInError) {
          console.error('❌ Auto sign-in failed:', signInError);
          return { success: false, error: 'Signup succeeded but auto-login failed. Please log in manually.' };
        }
        console.log('✅ Auto sign-in successful');
      } else {
        console.log('✅ Session verified');
      }

      const user: User = {
        id: authData.user.id,
        name,
        email,
        avatar: getInitials(name),
        role: 'owner',
        created_at: new Date().toISOString()
      };

      console.log('🎉 Signup completed successfully!');
      return { success: true, user };
    } catch (error: any) {
      console.error('❌ Signup exception:', error);
      return { success: false, error: `Signup failed: ${error.message}` };
    }
  },

  // Login
  async login(email: string, password: string): Promise<{ success: boolean; error?: string; user?: User }> {
    try {
      console.log('🔐 Starting login process...');
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (error) {
        console.error('❌ Login failed:', error);
        return { success: false, error: error.message };
      }

      if (!data.user) {
        console.error('❌ No user data returned');
        return { success: false, error: 'Login failed' };
      }

      console.log('✅ User authenticated:', data.user.id);

      // Fetch profile
      console.log('👤 Fetching profile...');
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', data.user.id)
        .maybeSingle();

      if (profileError) {
        console.error('⚠️ Profile fetch error:', profileError);
      }

      const user: User = {
        id: data.user.id,
        name: profile?.name || data.user.email?.split('@')[0] || 'User',
        email: data.user.email || '',
        avatar: profile?.avatar || getInitials(profile?.name || 'User'),
        role: profile?.role || 'owner',
        created_at: data.user.created_at || new Date().toISOString()
      };

      console.log('✅ Login successful:', user.name);
      return { success: true, user };
    } catch (error: any) {
      console.error('❌ Login exception:', error);
      return { success: false, error: error.message };
    }
  },

  // Google OAuth login
  async loginWithGoogle(): Promise<{ success: boolean; error?: string }> {
    try {
      console.log('🔐 Starting Google OAuth...');
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: window.location.origin + '/#/app/dashboard'
        }
      });

      if (error) {
        console.error('❌ Google OAuth failed:', error);
        return { success: false, error: error.message };
      }

      console.log('✅ Google OAuth initiated');
      return { success: true };
    } catch (error: any) {
      console.error('❌ Google OAuth exception:', error);
      return { success: false, error: error.message };
    }
  },

  // Get current session
  async getSession() {
    const { data: { session } } = await supabase.auth.getSession();
    return session;
  },

  // Get current user
  async getCurrentUser(): Promise<User | null> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        console.log('⚠️ No user logged in');
        return null;
      }

      console.log('👤 Getting user:', user.id);

      // Fetch profile
      const { data: profile, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle();

      if (error) {
        console.error('⚠️ Profile fetch error:', error);
      }

      // If no profile exists, create one automatically
      if (!profile) {
        console.log('📝 No profile found, creating one...');
        const userName = user.user_metadata?.name || user.email?.split('@')[0] || 'User';
        
        const { data: newProfile, error: createError } = await supabase
          .from('profiles')
          .insert({
            user_id: user.id,
            name: userName,
            email: user.email,
            avatar: getInitials(userName),
            role: 'owner'
          })
          .select()
          .single();

        if (createError) {
          console.error('⚠️ Profile creation error:', createError);
        } else {
          console.log('✅ Profile created:', newProfile?.id);
        }

        return {
          id: user.id,
          name: newProfile?.name || userName,
          email: user.email || '',
          avatar: newProfile?.avatar || getInitials(userName),
          role: newProfile?.role || 'owner',
          created_at: user.created_at || new Date().toISOString()
        };
      }

      return {
        id: user.id,
        name: profile.name,
        email: profile.email || user.email || '',
        avatar: profile.avatar || getInitials(profile.name),
        role: profile.role || 'owner',
        created_at: user.created_at || new Date().toISOString()
      };
    } catch (error) {
      console.error('❌ getCurrentUser error:', error);
      return null;
    }
  },

  // Get current workspace
  async getCurrentWorkspace(): Promise<Workspace | null> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        console.log('⚠️ No user logged in');
        return null;
      }

      console.log('🏢 Getting workspace for user:', user.id);

      // Fetch workspace
      console.log('🔍 Fetching workspace for owner_id:', user.id);
      const { data: workspace, error } = await supabase
        .from('workspaces')
        .select('*')
        .eq('owner_id', String(user.id))
        .maybeSingle();
      
      console.log('📊 Workspace query result:', { workspace, error });

      if (error) {
        console.error('⚠️ Workspace fetch error:', error);
      }

      // If no workspace exists, create one automatically
      if (!workspace) {
        console.log('📝 No workspace found, creating one...');
        const userName = user.user_metadata?.name || user.email?.split('@')[0] || 'User';
        const workspaceName = user.user_metadata?.workspace_name || `${userName}'s Agency`;
        const workspaceSlug = user.user_metadata?.slug || userName.toLowerCase().replace(/\s+/g, '-') + '-' + Date.now();
        
        console.log('🏢 Creating workspace with name:', workspaceName);
        
        let { data: newWorkspace, error: createError } = await supabase
          .from('workspaces')
          .insert({
            owner_id: String(user.id),
            name: workspaceName,
            slug: workspaceSlug,
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
          
          // Try fallback with unique slug
          console.log('🔄 Attempting fallback workspace creation...');
          const fallbackSlug = workspaceSlug + '-' + Date.now();
          const { data: fallbackWorkspace, error: fallbackError } = await supabase
            .from('workspaces')
            .insert({
              owner_id: String(user.id),
              name: workspaceName,
              slug: fallbackSlug
            })
            .select()
            .single();
          
          if (fallbackError) {
            console.error('❌ Fallback workspace creation also failed:', fallbackError);
            return null;
          }
          
          newWorkspace = fallbackWorkspace;
        }

        console.log('✅ Workspace created:', newWorkspace?.id);
        console.log('✅ Workspace name:', newWorkspace?.name);
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
    console.log('🚪 Logging out...');
    await supabase.auth.signOut();
    console.log('✅ Logged out successfully');
  },

  // Check if authenticated
  async isAuthenticated(): Promise<boolean> {
    const { data: { session } } = await supabase.auth.getSession();
    return !!session;
  },

  // Update user profile
  async updateProfile(userId: string, updates: Partial<User>): Promise<void> {
    console.log('📝 Updating profile:', userId, updates);
    const { data, error } = await supabase
      .from('profiles')
      .update(updates)
      .eq('user_id', userId)
      .select();
    
    if (error) {
      console.error('❌ Profile update error:', error);
      throw error;
    }
    console.log('✅ Profile updated successfully:', data);
  },

  // Update workspace
  async updateWorkspace(workspaceId: string, updates: Partial<Workspace>): Promise<void> {
    console.log('🏢 Updating workspace:', workspaceId, updates);
    const { data, error } = await supabase
      .from('workspaces')
      .update(updates)
      .eq('id', workspaceId)
      .select();
    
    if (error) {
      console.error('❌ Workspace update error:', error);
      throw error;
    }
    console.log('✅ Workspace updated successfully:', data);
  },

  // Forgot password
  async resetPassword(email: string): Promise<{ success: boolean; error?: string }> {
    try {
      console.log('🔑 Requesting password reset for:', email);
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: window.location.origin + '/#/reset-password'
      });

      if (error) {
        console.error('❌ Password reset request failed:', error);
        return { success: false, error: error.message };
      }

      console.log('✅ Password reset email sent');
      return { success: true };
    } catch (error: any) {
      console.error('❌ Password reset exception:', error);
      return { success: false, error: error.message };
    }
  },

  // Update password
  async updatePassword(newPassword: string): Promise<{ success: boolean; error?: string }> {
    try {
      console.log('🔑 Updating password...');
      const { error } = await supabase.auth.updateUser({
        password: newPassword
      });

      if (error) {
        console.error('❌ Password update failed:', error);
        return { success: false, error: error.message };
      }

      console.log('✅ Password updated successfully');
      return { success: true };
    } catch (error: any) {
      console.error('❌ Password update exception:', error);
      return { success: false, error: error.message };
    }
  }
};
