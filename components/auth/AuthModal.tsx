// components/auth/AuthModal.tsx
"use client";

import React, { useState, useEffect } from 'react';
import Modal from '@/components/ui/Modal';
import { createClient } from '@/lib/supabase/client';
// Assuming the 'Module not found' is now fixed and you want to use the Auth UI again:
import { Auth } from '@supabase/auth-ui-react';
import { ThemeSupa } from '@supabase/auth-ui-shared';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AuthModal({ isOpen, onClose }: AuthModalProps) {
  const supabase = createClient();
  const [view, setView] = useState<'sign_in' | 'sign_up' | 'forgot_password'>('sign_in');
  const [resetEmail, setResetEmail] = useState('');
  const [resetMessage, setResetMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);
  const [isResetLoading, setIsResetLoading] = useState(false);

  // Get Site URL from environment variable, provide fallback for safety
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
  const redirectUrl = `${siteUrl}/auth/callback`; // Used for Auth component
  const passwordResetRedirectUrl = `${siteUrl}/update-password`; // Used for password reset

  useEffect(() => {
    if (!isOpen) {
       setTimeout(() => { setView('sign_in'); setResetMessage(null); setResetEmail(''); }, 300);
    }
  }, [isOpen]);

  const handlePasswordReset = async (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      setIsResetLoading(true);
      setResetMessage(null);
      console.log('Requesting password reset for:', resetEmail, 'Redirect URL:', passwordResetRedirectUrl);
      const { error } = await supabase.auth.resetPasswordForEmail(resetEmail, {
          redirectTo: passwordResetRedirectUrl, // Use specific redirect URL for reset
      });
      if (error) {
          setResetMessage({ text: `Error: ${error.message}`, type: 'error' });
      } else {
          setResetMessage({ text: 'Password reset instructions sent to your email.', type: 'success' });
      }
      setIsResetLoading(false);
  };

  const modalTitle = view === 'sign_in' ? 'Login or Sign Up' :
                     view === 'sign_up' ? 'Create Your Account' :
                     'Reset Your Password';

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={modalTitle}>
      {view === 'sign_in' || view === 'sign_up' ? (
          <>
            {/* Auth UI Component */}
            <Auth
                supabaseClient={supabase}
                appearance={{ theme: ThemeSupa }}
                providers={[]}
                theme="light"
                view={view}
                showLinks={false} // Handle links manually below
                // --- UPDATED redirectTo using environment variable ---
                redirectTo={redirectUrl}
                // --- End Update ---
            />
            {/* View Switching Links */}
            {view === 'sign_in' && (
                 <div className="text-center text-sm mt-4 space-y-1">
                    <button onClick={() => setView('forgot_password')} className="text-blue-600 hover:underline cursor-pointer"> Forgot your password? </button>
                    <p> Don't have an account?{' '} <button onClick={() => setView('sign_up')} className="font-medium text-blue-600 hover:underline cursor-pointer"> Sign Up </button> </p>
                 </div>
             )}
             {view === 'sign_up' && (
                 <div className="text-center text-sm mt-4"> Already have an account?{' '} <button onClick={() => setView('sign_in')} className="font-medium text-blue-600 hover:underline cursor-pointer"> Sign In </button> </div>
             )}
           </>
        ) : (
           // Forgot Password Form
           <form onSubmit={handlePasswordReset} className="space-y-4">
              {/* ... forgot password form JSX (email input, submit button, back button) ... */}
               <p className="text-sm text-gray-600">Enter your account email, and we'll send instructions to reset your password.</p> <div> <label htmlFor="reset-email" className="block text-sm font-medium text-gray-700">Email</label> <input id="reset-email" type="email" value={resetEmail} onChange={(e) => setResetEmail(e.target.value)} required placeholder="you@example.com" className="mt-1 block w-full px-3 py-2 border border-border-color rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-sm"/> </div> {resetMessage && ( <p className={`text-sm ${resetMessage.type === 'success' ? 'text-green-600' : 'text-red-600'}`}> {resetMessage.text} </p> )} <button type="submit" disabled={isResetLoading} className="w-full inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-brand hover:bg-brand-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-dark disabled:opacity-60"> {isResetLoading ? 'Sending...' : 'Send Reset Instructions'} </button> <button type="button" onClick={() => setView('sign_in')} className="w-full text-sm text-gray-600 hover:underline mt-2"> Back to Login </button>
           </form>
        )}
    </Modal>
  );
}