// Diagnostic tool to test database connection and operations
import { supabase } from './supabase';

export const diagnose = {
  // Test 1: Check if user is authenticated
  async checkAuth() {
    console.log('=== TEST 1: Authentication ===');
    const result = await supabase.auth.getUser();
    const user = result.data?.user;
    const error = result.error;
    
    if (error) {
      console.error('❌ Auth error:', error);
      return false;
    }
    if (!user) {
      console.error('❌ No user logged in');
      return false;
    }
    console.log('✅ User authenticated:', user.email);
    console.log('User ID:', user.id);
    return true;
  },

  // Test 2: Check if workspace exists
  async checkWorkspace() {
    console.log('\n=== TEST 2: Workspace ===');
    const authResult = await supabase.auth.getUser();
    const user = authResult.data?.user;
    if (!user) return false;

    const result = await supabase
      .from('workspaces')
      .select('*')
      .eq('owner_id', user.id)
      .single();

    const workspace = result.data;
    const error = result.error;

    if (error) {
      console.error('❌ Workspace error:', error);
      console.error('Error details:', error.message);
      return false;
    }
    if (!workspace) {
      console.error('❌ No workspace found');
      return false;
    }
    console.log('✅ Workspace found:', workspace.name);
    console.log('Workspace ID:', workspace.id);
    return true;
  },

  // Test 3: Try to insert a test lead
  async testLeadInsert() {
    console.log('\n=== TEST 3: Test Lead Insert ===');
    const authResult = await supabase.auth.getUser();
    const user = authResult.data?.user;
    if (!user) return false;

    const wsResult = await supabase
      .from('workspaces')
      .select('id')
      .eq('owner_id', user.id)
      .single();

    const workspace = wsResult.data;
    if (!workspace) {
      console.error('❌ No workspace found');
      return false;
    }

    const testLead = {
      id: `test_${Date.now()}`,
      workspace_id: workspace.id,
      name: 'Test Lead',
      company: 'Test Company',
      email: 'test@example.com',
      phone: '+1234567890',
      value: 10000,
      currency: 'INR',
      stage: 'new',
      source: 'website',
      assigned_to: '',
      follow_up: false,
      created_at: new Date().toISOString(),
    };

    console.log('Attempting to insert:', testLead);

    const result = await supabase
      .from('leads')
      .insert([testLead])
      .select();

    const data = result.data;
    const error = result.error;

    if (error) {
      console.error('❌ Insert error:', error);
      console.error('Error message:', error.message);
      console.error('Error code:', error.code);
      console.error('Error details:', error.details);
      console.error('Error hint:', error.hint);
      return false;
    }

    console.log('✅ Lead inserted successfully:', data);
    return true;
  },

  // Test 4: Try to read leads
  async testLeadRead() {
    console.log('\n=== TEST 4: Test Lead Read ===');
    const authResult = await supabase.auth.getUser();
    const user = authResult.data?.user;
    if (!user) return false;

    const wsResult = await supabase
      .from('workspaces')
      .select('id')
      .eq('owner_id', user.id)
      .single();

    const workspace = wsResult.data;
    if (!workspace) {
      console.error('❌ No workspace found');
      return false;
    }

    const result = await supabase
      .from('leads')
      .select('*')
      .eq('workspace_id', workspace.id);

    const data = result.data;
    const error = result.error;

    if (error) {
      console.error('❌ Read error:', error);
      console.error('Error message:', error.message);
      return false;
    }

    console.log('✅ Leads read successfully:', data?.length || 0, 'leads');
    return true;
  },

  // Test 5: Check table structure
  async checkTableStructure() {
    console.log('\n=== TEST 5: Table Structure ===');
    
    // Try to select from leads table
    const result = await supabase
      .from('leads')
      .select('*')
      .limit(1);

    const data = result.data;
    const error = result.error;

    if (error) {
      console.error('❌ Table error:', error);
      console.error('Error message:', error.message);
      console.error('This usually means the table does not exist');
      console.error('Please run fresh-database.sql in Supabase SQL Editor');
      return false;
    }

    console.log('✅ Table exists and is accessible');
    if (data && data.length > 0) {
      console.log('Table columns:', Object.keys(data[0]));
    }
    return true;
  },

  // Run all tests
  async runAllTests() {
    console.log('🔍 Starting Database Diagnostics...\n');
    
    const results = {
      auth: await this.checkAuth(),
      workspace: await this.checkWorkspace(),
      tableStructure: await this.checkTableStructure(),
      leadInsert: await this.testLeadInsert(),
      leadRead: await this.testLeadRead(),
    };

    console.log('\n=== DIAGNOSIS RESULTS ===');
    console.log('Authentication:', results.auth ? '✅' : '❌');
    console.log('Workspace:', results.workspace ? '✅' : '❌');
    console.log('Table Structure:', results.tableStructure ? '✅' : '❌');
    console.log('Lead Insert:', results.leadInsert ? '✅' : '❌');
    console.log('Lead Read:', results.leadRead ? '✅' : '❌');

    if (Object.values(results).every(r => r)) {
      console.log('\n🎉 All tests passed! Database is working correctly.');
    } else {
      console.log('\n⚠️  Some tests failed. See errors above for details.');
      if (!results.tableStructure) {
        console.log('\n💡 HINT: The table structure test failed. This usually means:');
        console.log('1. You have not run fresh-database.sql yet');
        console.log('2. Or you need to drop old tables first');
        console.log('\n📋 SOLUTION:');
        console.log('1. Go to Supabase SQL Editor');
        console.log('2. Run the DROP statements from README_FIX.md');
        console.log('3. Run fresh-database.sql');
        console.log('4. Try again');
      }
    }

    return results;
  }
};

// Make it available globally for easy testing
(window as any).diagnose = diagnose;

console.log('🔧 Diagnostic tool loaded. Run: diagnose.runAllTests() in console');
