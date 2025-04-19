// components/auth/LoginForm.tsx
"use client";
import React, { useState } from 'react';
import { createClient } from '@/lib/supabase/client';

interface LoginFormProps {
  onSuccess?: () => void; // Optional: Callback on successful login
  switchToSignup: () => void; // Function to switch to Signup view
}

export default function LoginForm({ onSuccess, switchToSignup }: LoginFormProps) {
  const supabase = createClient();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setError(error.message);
    } else {
      // Login successful - AuthContext will update user state via listener
      console.log('Login successful!');
      if (onSuccess) onSuccess(); // Call the success callback if provided
    }
    setLoading(false);
  };

  return (
    <form onSubmit={handleLogin} className="space-y-4">
      <h2 className="text-2xl font-semibold text-center">Log In</h2>
      {error && <p className="text-red-500 text-sm text-center">{error}</p>}
      <div>
        <label htmlFor="login-email" className="block text-sm font-medium text-gray-700">Email</label>
        <input
          id="login-email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          placeholder="you@example.com"
        />
      </div>
      <div>
        <label htmlFor="login-password" className="block text-sm font-medium text-gray-700">Password</label>
        <input
          id="login-password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          placeholder="••••••••"
        />
      </div>
      <button
        type="submit"
        disabled={loading}
        className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
      >
        {loading ? 'Logging in...' : 'Log In'}
      </button>
      <p className="text-sm text-center text-gray-600">
        Don't have an account?{' '}
        <button type="button" onClick={switchToSignup} className="font-medium text-blue-600 hover:text-blue-500">
          Sign up
        </button>
      </p>
    </form>
  );
}