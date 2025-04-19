// app/update-password/page.tsx
'use client';

import React, { useState, useEffect, useRef } from 'react';
// Removed useSearchParams import
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { useForm, SubmitHandler } from 'react-hook-form';
import Link from 'next/link';

type Inputs = {
    password: string;
    confirmPassword: string;
};

export default function UpdatePasswordPage() {
    const supabase = createClient();
    const router = useRouter();
    // REMOVED: const searchParams = useSearchParams();
    const [message, setMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [isAuthenticatedForReset, setIsAuthenticatedForReset] = useState(false);

    const { register, handleSubmit, watch, formState: { errors }, reset } = useForm<Inputs>();
    const newPassword = watch('password');

    // Check if the user landed here from a valid reset link
    useEffect(() => {
        const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
            if (event === "PASSWORD_RECOVERY") {
                console.log("Password recovery event detected, ready to update.");
                setIsAuthenticatedForReset(true);
            }
        });

         // Check initial state too
         supabase.auth.getSession().then(({ data: { session }}) => {
             if (session) {
                 // If a session exists immediately, assume it's from the recovery link
                 // NOTE: Supabase might improve the explicitness of this state later
                 console.log("Session found on page load, assuming recovery state.");
                 setIsAuthenticatedForReset(true);
             } else if (!isAuthenticatedForReset) { // Only show error if recovery event didn't fire yet
                setMessage({ text: 'Waiting for recovery session or link may be invalid/expired.', type: 'error' });
             }
         });


        return () => {
            authListener?.subscription.unsubscribe();
        };
    // Rerun only once on mount for this check
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [supabase]);

    const onSubmit: SubmitHandler<Inputs> = async (data) => {
        if (!isAuthenticatedForReset) {
            setMessage({ text: 'Cannot update password. Invalid state or expired link.', type: 'error' });
            return;
        }
        if (data.password !== data.confirmPassword) {
            // This validation is also handled by react-hook-form now
            // setMessage({ text: 'Passwords do not match.', type: 'error' });
            return; // react-hook-form prevents submission if validation fails
        }

        setIsLoading(true);
        setMessage(null);

        const { error } = await supabase.auth.updateUser({
            password: data.password,
        });

        if (error) {
            console.error("Password Update Error:", error);
            setMessage({ text: `Error updating password: ${error.message}`, type: 'error' });
        } else {
            console.log("Password updated successfully");
            setMessage({ text: 'Password updated successfully! Redirecting to login...', type: 'success' });
            reset();
            setTimeout(() => router.push('/login'), 3000); // Redirect after 3s
        }
        setIsLoading(false);
    };


    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-lg shadow-md">
                <div>
                    <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
                        Set New Password
                    </h2>
                </div>

                {/* Show form only when ready */}
                {isAuthenticatedForReset ? (
                    <form className="mt-8 space-y-6" onSubmit={handleSubmit(onSubmit)}>
                        <input type="hidden" name="remember" defaultValue="true" />
                        <div className="rounded-md shadow-sm -space-y-px">
                            <div>
                                <label htmlFor="password-input" className="sr-only">New Password</label>
                                <input
                                    id="password-input"
                                    type="password"
                                    autoComplete="new-password"
                                    required
                                    {...register("password", { required: "Password is required", minLength: { value: 6, message: "Password must be at least 6 characters" } })}
                                    className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                                    placeholder="New Password"
                                />
                            </div>
                            <div>
                                <label htmlFor="confirm-password-input" className="sr-only">Confirm New Password</label>
                                <input
                                    id="confirm-password-input"
                                    type="password"
                                    autoComplete="new-password"
                                    required
                                     {...register("confirmPassword", { required: "Please confirm password", validate: value => value === newPassword || "Passwords do not match" })}
                                    className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                                    placeholder="Confirm New Password"
                                />
                            </div>
                        </div>

                        {errors.password && <p className="text-xs text-red-600">{errors.password.message}</p>}
                        {errors.confirmPassword && <p className="text-xs text-red-600">{errors.confirmPassword.message}</p>}

                        {/* Display message from submission state */}
                        {message && ( <p className={`mt-2 text-sm ${message.type === 'success' ? 'text-green-600' : 'text-red-600'}`}> {message.text} </p> )}

                        {/* Hide button on success, show login link */}
                        {message?.type === 'success' ? (
                             <div className="text-center mt-4"> <Link href="/login" className="font-medium text-indigo-600 hover:text-indigo-500"> Go to Login </Link> </div>
                        ) : (
                            <div>
                                <button type="submit" disabled={isLoading} className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50">
                                    {isLoading ? 'Setting Password...' : 'Set New Password'}
                                </button>
                            </div>
                        )}
                    </form>
                 ) : (
                    // Show loading or invalid link message
                     <div className="text-center mt-8">
                         <p className={`text-sm ${message?.type === 'error' ? 'text-red-600' : 'text-gray-600'}`}>
                           {message?.text || 'Verifying reset link...'}
                         </p>
                     </div>
                 )}
            </div>
        </div>
    );
}