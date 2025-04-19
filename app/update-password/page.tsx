// app/update-password/page.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
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
    const searchParams = useSearchParams();
    const [message, setMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [isAuthenticatedForReset, setIsAuthenticatedForReset] = useState(false);

    const { register, handleSubmit, watch, formState: { errors }, reset } = useForm<Inputs>();
    const newPassword = watch('password');

    // Check if the user landed here from a valid reset link
    // Supabase typically sets a session after email link clicked,
    // or handles recovery via onAuthStateChange event TYPE 'PASSWORD_RECOVERY'
    useEffect(() => {
        // Listen for the PASSWORD_RECOVERY event which indicates readiness to update
        const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
            if (event === "PASSWORD_RECOVERY") {
                console.log("Password recovery event detected, ready to update.");
                setIsAuthenticatedForReset(true);
            } else if (!session) {
                 // If session becomes null unexpectedly, maybe redirect
                 // console.log("Session lost during password update process.");
            }
        });

         // Check initial state too - sometimes session exists immediately after link click
         supabase.auth.getSession().then(({ data: { session }}) => {
             // A valid session after clicking link indicates readiness.
             // Note: Supabase might not always expose the 'PASSWORD_RECOVERY' state explicitly here,
             // relying on the presence of *any* session triggered by the recovery link.
             if (session) {
                 console.log("Session found on page load, assuming recovery state.");
                 setIsAuthenticatedForReset(true);
             } else {
                // If no session, the link might be invalid or expired
                setMessage({ text: 'Invalid or expired password reset link.', type: 'error' });
             }
         });


        return () => {
            authListener?.subscription.unsubscribe();
        };
    }, [supabase]);

    const onSubmit: SubmitHandler<Inputs> = async (data) => {
        if (!isAuthenticatedForReset) {
            setMessage({ text: 'Cannot update password. Invalid state.', type: 'error' });
            return;
        }
        if (data.password !== data.confirmPassword) {
            setMessage({ text: 'Passwords do not match.', type: 'error' });
            return;
        }

        setIsLoading(true);
        setMessage(null);

        // Update user password
        const { error } = await supabase.auth.updateUser({
            password: data.password,
        });

        if (error) {
            console.error("Password Update Error:", error);
            setMessage({ text: `Error updating password: ${error.message}`, type: 'error' });
        } else {
            console.log("Password updated successfully");
            setMessage({ text: 'Password updated successfully! You can now log in.', type: 'success' });
            reset(); // Clear form
            // Optionally redirect after a delay
            setTimeout(() => router.push('/login'), 3000);
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

                {/* Display message if not authenticated via link */}
                {!isAuthenticatedForReset && message && message.type === 'error' && (
                    <p className="text-center text-sm text-red-600">{message.text}</p>
                )}

                {/* Only show form if authenticated for reset */}
                {isAuthenticatedForReset && (
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

                        {message && (
                            <p className={`text-sm ${message.type === 'success' ? 'text-green-600' : 'text-red-600'}`}>
                                {message.text}
                            </p>
                        )}

                         {/* Show success message & login link */}
                        {message?.type === 'success' ? (
                             <div className="text-center">
                                <Link href="/login" className="font-medium text-indigo-600 hover:text-indigo-500">
                                    Go to Login
                                </Link>
                            </div>
                        ) : (
                            <div>
                                <button
                                    type="submit"
                                    disabled={isLoading}
                                    className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
                                >
                                    {isLoading ? 'Setting Password...' : 'Set New Password'}
                                </button>
                            </div>
                        )}
                    </form>
                 )} {/* End of conditional form rendering */}
            </div>
        </div>
    );
}