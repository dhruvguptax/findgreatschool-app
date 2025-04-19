// components/auth/SignupForm.tsx
"use client";
import React, { useState } from 'react';
import { createClient } from '@/lib/supabase/client';

interface SignupFormProps {
  onSuccess?: () => void; // Optional: Callback on successful signup
  switchToLogin: () => void; // Function to switch to Login view
}

export default function SignupForm({ onSuccess, switchToLogin }: SignupFormProps) {
  const supabase = createClient();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setMessage(null);
    setLoading(true);

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      // You can add options for email confirmation, redirect, etc.
      // options: {
      //   emailRedirectTo: `${window.location.origin}/auth/callback`, // Example redirect
      // }
    });

    if (error) {
      setError(error.message);
    } else if (data.user && data.user.identities?.length === 0) {
       // This condition might indicate email confirmation is needed but user exists
       setMessage("User already exists or confirmation email sent previously.");
    } else if (data.session) {
       // If session exists immediately (email confirmation might be off)
       console.log('Signup successful & logged in!');
       setMessage("Signup successful! You are now logged in.");
       if (onSuccess) onSuccess();
    } else {
      // If email confirmation is required
      setMessage('Signup successful! Please check your email to confirm your account.');
      // Optionally clear form or call onSuccess even if confirmation is needed
      // if (onSuccess) onSuccess();
    }
    setLoading(false);
  };

  return (
    <form onSubmit={handleSignup} className="space-y-4">
      <h2 className="text-2xl font-semibold text-center">Sign Up</h2>
      {error && <p className="text-red-500 text-sm text-center">{error}</p>}
      {message && <p className="text-green-600 text-sm text-center">{message}</p>}
      <div>
        <label htmlFor="signup-email" className="block text-sm font-medium text-gray-700">Email</label>
        <input
          id="signup-email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          placeholder="you@example.com"
        />
      </div>
      <div>
        <label htmlFor="signup-password" className="block text-sm font-medium text-gray-700">Password</label>
        <input
          id="signup-password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          minLength={6} // Supabase default minimum password length
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          placeholder="Create a password (min. 6 characters)"
        />
      </div>
      <button
        type="submit"
        disabled={loading}
        className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50"
      >
        {loading ? 'Signing up...' : 'Sign Up'}
      </button>
      <p className="text-sm text-center text-gray-600">
        Already have an account?{' '}
        <button type="button" onClick={switchToLogin} className="font-medium text-blue-600 hover:text-blue-500">
          Log in
        </button>
      </p>
    </form>
  );
}