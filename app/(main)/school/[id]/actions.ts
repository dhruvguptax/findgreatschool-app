// app/(main)/school/[id]/actions.ts
'use server'

import { cookies } from 'next/headers';
import { createSupabaseServerClient } from '@/lib/supabase/server';
import { createSupabaseServerAdminClient } from '@/lib/supabase/server-admin'; // Use admin for check if needed

interface ApplyActionResult {
  success: boolean;
  message: string;
}

export async function handleApply(institutionId: string): Promise<ApplyActionResult> {
  const supabase = createSupabaseServerClient(); // Gets user session

  // 1. Check if user is logged in
  const { data: { user }, error: sessionError } = await supabase.auth.getUser();

  if (sessionError || !user) {
    console.error('Apply Error: User not authenticated');
    return { success: false, message: 'You must be logged in to apply.' };
  }

  const studentId = user.id;
  console.log(`User ${studentId} attempting to apply to institution ${institutionId}`);

  // Use admin client to bypass RLS for checking existing application if needed,
  // or ensure student SELECT RLS policy is active before this check.
  // Let's use user client assuming SELECT RLS allows reading own applications.
  try {
    // 2. Check if user already applied (optional but good UX)
    const { data: existingApplication, error: checkError } = await supabase
      .from('applications')
      .select('id')
      .eq('student_id', studentId)
      .eq('institution_id', institutionId)
      .maybeSingle(); // Check if one already exists

    if (checkError) {
        console.error('Apply Error: Failed checking existing application', checkError);
        // Don't necessarily block submission, maybe just log
    }

    if (existingApplication) {
      console.log('Apply Info: User already applied');
      return { success: false, message: 'You have already applied to this institution.' };
    }

    // 3. Insert new application record (using user client - relies on INSERT RLS)
    const { error: insertError } = await supabase
      .from('applications')
      .insert({
        student_id: studentId,
        institution_id: institutionId,
        status: 'submitted' // Initial status
      });

    if (insertError) {
      console.error('Apply Error: Failed inserting application', insertError);
      // Check for specific errors, e.g., foreign key violation if institutionId is bad
      if (insertError.code === '23503') { // Foreign key violation
          return { success: false, message: 'Application failed: Invalid institution.'}
      }
      return { success: false, message: `Application failed: ${insertError.message}` };
    }

    // 4. Success
    console.log('Application submitted successfully');
    // TODO Optional: Send email notification here (later step)
    return { success: true, message: 'Application Submitted Successfully!' };

  } catch (error: any) {
     console.error('Apply Error: Unexpected error', error);
     return { success: false, message: 'An unexpected error occurred. Please try again.' };
  }
}