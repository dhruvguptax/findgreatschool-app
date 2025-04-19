// app/(main)/contact/actions.ts
'use server';

import { createClient } from '@supabase/supabase-js'; // Can use standard client for public insert

// Define expected return state for useFormState
interface SaveContactActionResult {
  success: boolean;
  message: string;
}

// Renamed function to reflect action
export async function saveContactMessage(
    prevState: any,
    formData: FormData
): Promise<SaveContactActionResult> {

    // Use Anon key is sufficient if RLS allows public insert
    const supabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );

    // Extract form data
    const name = formData.get('name') as string | null;
    const email = formData.get('email') as string | null;
    const subject = formData.get('subject') as string | null;
    const message = formData.get('message') as string | null;

    // Basic validation
    if (!name || !email || !subject || !message) {
        return { success: false, message: 'Please fill out all fields.' };
    }

    console.log(`Saving contact message: From=<span class="math-inline">\{email\}, Subject\=</span>{subject}`);

    try {
        // Insert data into the new table
        const { error } = await supabase
            .from('contact_submissions')
            .insert({
                name: name,
                email: email,
                subject: subject,
                message: message,
                // is_read defaults to false
            });

        if (error) {
            console.error('Supabase Insert Error:', error);
            // Don't expose detailed DB errors to the client
            return { success: false, message: 'Failed to submit message due to a server error.' };
        }

        // Success
        console.log('Contact message saved successfully');
        return { success: true, message: 'Message received! Thank you.' };

    } catch (error: any) {
        console.error('Error saving contact message:', error);
        return { success: false, message: 'An unexpected error occurred.' };
    }
}