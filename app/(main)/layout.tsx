// app/(main)/layout.tsx
"use client"; // Layout needs to be client component to use hooks like useAuth

import React from 'react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import CompareIndicator from '@/components/compare/CompareIndicator';
import AuthModal from '@/components/auth/AuthModal'; // <-- Import AuthModal
import { useAuth } from '@/context/AuthContext'; // <-- Import useAuth

export default function MainLayout({ children }: { children: React.ReactNode; }) {
  // Get modal state and close function from context
  const { isAuthModalOpen, closeAuthModal } = useAuth();

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow container mx-auto px-4 py-8">
        {children}
      </main>
      <CompareIndicator />
      <Footer />

      {/* Render AuthModal globally, controlled by context */}
      <AuthModal isOpen={isAuthModalOpen} onClose={closeAuthModal} />
    </div>
  );
}