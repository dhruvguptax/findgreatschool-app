// context/AuthContext.tsx (Cleaned)
"use client";

import React, { createContext, useState, useEffect, useContext, ReactNode } from 'react';
import { createClient } from '@/lib/supabase/client';
import type { User, Session } from '@supabase/supabase-js';

interface AuthContextType {
    user: User | null;
    session: Session | null;
    loading: boolean;
    signOut: () => Promise<void>;
    isAuthModalOpen: boolean;
    openAuthModal: () => void;
    closeAuthModal: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const supabase = createClient();
    const [user, setUser] = useState<User | null>(null);
    const [session, setSession] = useState<Session | null>(null);
    const [loading, setLoading] = useState(true);
    const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

    useEffect(() => {
        setLoading(true);
        supabase.auth.getSession().then(({ data: { session } }) => {
            setSession(session);
            setUser(session?.user ?? null);
            // console.log("Auth state changed: INITIAL_SESSION", session); // Keep if useful
            setLoading(false);
        }).catch((error) => {
             console.error("Error getting initial session:", error);
             setLoading(false);
        });

        const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
             // Simplified log
             console.log("Auth state changed:", event);
             setSession(session);
             setUser(session?.user ?? null);
             setLoading(false);
             if (event === 'SIGNED_IN') {
                setIsAuthModalOpen(false);
             }
             if (event === 'SIGNED_OUT') {
                setIsAuthModalOpen(false); // Close modal on sign out too
             }
        });

        return () => {
            authListener?.subscription.unsubscribe();
        };
    }, [supabase.auth]);


    const signOut = async () => {
        // Removed console logs from here
        setLoading(true);
        const { error } = await supabase.auth.signOut();
        if (error) {
            console.error("Error signing out:", error); // Keep error log
        }
         // No need to setLoading(false) here, listener handles it
    };

    const openAuthModal = () => setIsAuthModalOpen(true);
    const closeAuthModal = () => setIsAuthModalOpen(false);

    const value = { user, session, loading, signOut, isAuthModalOpen, openAuthModal, closeAuthModal };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextType => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};