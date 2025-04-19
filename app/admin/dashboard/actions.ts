// app/admin/dashboard/actions.ts
'use server' // Mark this module as Server Actions

import { cookies } from 'next/headers';
import { revalidatePath } from 'next/cache';
import { createSupabaseServerClient } from '@/lib/supabase/server'; // For user session check
import { createSupabaseServerAdminClient } from '@/lib/supabase/server-admin'; // For admin actions

// --- Approve Action ---
export async function approveInstitution(institutionId: string): Promise<{ success: boolean; error?: string }> {
  const supabaseAuth = createSupabaseServerClient();

  // 1. Verify user is Admin before proceeding
  const { data: { session } } = await supabaseAuth.auth.getSession();
  const adminUserId = process.env.ADMIN_USER_ID;

  if (!session || !adminUserId || session.user.id !== adminUserId) {
    console.error('Unauthorized attempt to approve institution.');
    return { success: false, error: 'Unauthorized' };
  }

  // 2. Perform update using Admin client
  const supabaseAdmin = createSupabaseServerAdminClient();
  console.log(`Admin (${session.user.id}) approving institution ${institutionId}`);

  const { error } = await supabaseAdmin
    .from('institutions')
    .update({ is_approved: true, updated_at: new Date().toISOString() }) // Set approved and update timestamp
    .eq('id', institutionId);

  if (error) {
    console.error('Error approving institution:', error);
    return { success: false, error: error.message };
  }

  // 3. Revalidate the dashboard path to refresh the list
  revalidatePath('/admin/dashboard');

  console.log(`Successfully approved institution ${institutionId}`);
  return { success: true };
}

// --- Reject Action ---
export async function rejectInstitution(institutionId: string): Promise<{ success: boolean; error?: string }> {
    const supabaseAuth = createSupabaseServerClient(); // For checking admin user

    // 1. Verify user is Admin
    const { data: { session } } = await supabaseAuth.auth.getSession();
    const adminUserId = process.env.ADMIN_USER_ID;

    if (!session || !adminUserId || session.user.id !== adminUserId) {
        console.error('Unauthorized attempt to reject institution.');
        return { success: false, error: 'Unauthorized' };
    }

    // 2. Perform delete using Admin client (bypasses RLS)
    const supabaseAdmin = createSupabaseServerAdminClient();
    console.log(`Admin (${session.user.id}) rejecting institution ${institutionId}`);

    // Delete the record permanently
    const { error } = await supabaseAdmin
        .from('institutions')
        .delete() // Delete operation
        .eq('id', institutionId);

    if (error) {
        console.error('Error rejecting institution:', error);
        return { success: false, error: error.message };
    }

    // 3. Revalidate the dashboard path to refresh the list
    revalidatePath('/admin/dashboard');

    console.log(`Successfully rejected (deleted) institution ${institutionId}`);
    return { success: true };
}