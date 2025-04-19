// app/(main)/for-institutions/page.tsx
"use client"; // Still needed for hooks and showing form client-side

import React, { useState } from 'react';
import Link from 'next/link'; // Import Link if needed elsewhere
import { useAuth } from '@/context/AuthContext';
import AuthModal from '@/components/auth/AuthModal';
import InstitutionRegistrationForm from '@/components/institution/RegistrationForm';

// Import Icons
import { FiUsers, FiEye, FiTarget, FiEdit, FiCheckCircle, FiTrendingUp, FiCheckSquare } from 'react-icons/fi';

export default function ForInstitutionsPage() {
  const { user, loading } = useAuth();
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showRegistrationForm, setShowRegistrationForm] = useState(false);

  const handleRegisterClick = () => {
    if (loading) return;

    if (user) {
      // User is logged in, show the registration form
      setShowRegistrationForm(true);
    } else {
      // User not logged in, show the auth modal
      setShowAuthModal(true);
    }
  };

  // --- JSX Structure ---
  return (
    <div className="container mx-auto px-4 py-8">

      {/* --- Conditional Rendering: Show Landing Content OR Registration Form --- */}

      {/* Section 1: Show Landing Content if form isn't active */}
      {!showRegistrationForm && (
        <>
          {/* Hero Section for Institutions */}
          <section className="text-center py-12 md:py-16 bg-gradient-to-r from-purple-50 via-indigo-50 to-blue-50 rounded-lg shadow-sm border border-border-color mb-12">
             <div className="max-w-3xl mx-auto px-4">
                  <FiUsers className="text-6xl text-indigo-500 mx-auto mb-4" />
                  <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 text-slate-900">
                     Connect with Your Future Students
                  </h1>
                  <p className="text-lg md:text-xl text-subtle-text mb-8">
                     List your School, Coaching Institute, or College on FindGreatSchool.com and reach thousands of students actively searching for education options in India.
                  </p>
                  <button
                    onClick={handleRegisterClick}
                    disabled={loading}
                    className="bg-brand hover:bg-brand-dark text-white font-bold py-3 px-10 rounded-lg text-lg transition duration-300 shadow-md hover:shadow-lg disabled:opacity-60 transform hover:scale-105"
                  >
                    {loading ? 'Loading...' : 'Register Your Institution Now'}
                  </button>
                  {!user && !loading && <p className="text-xs mt-3 text-gray-500">(Login or Signup required to register)</p>}
             </div>
          </section>

          {/* Benefits Section */}
          <section className="py-12 md:py-16">
               <h2 className="text-3xl font-bold text-center mb-10 text-gray-800">Why List With Us?</h2>
               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
                    {/* Benefit 1: Reach */}
                    <div className="bg-white p-6 rounded-lg border border-border-color shadow-sm text-center hover:shadow-md transition-shadow">
                        <FiEye className="text-4xl text-green-500 mx-auto mb-3" />
                        <h3 className="text-lg font-semibold mb-2 text-gray-900">Increased Visibility</h3>
                        <p className="text-sm text-subtle-text">Gain exposure to a large, targeted audience of students and parents actively searching for educational institutions online.</p>
                    </div>
                     {/* Benefit 2: Targeted Leads */}
                    <div className="bg-white p-6 rounded-lg border border-border-color shadow-sm text-center hover:shadow-md transition-shadow">
                        <FiTarget className="text-4xl text-red-500 mx-auto mb-3" />
                        <h3 className="text-lg font-semibold mb-2 text-gray-900">Quality Leads</h3>
                        <p className="text-sm text-subtle-text">Connect with genuinely interested students looking for the specific courses, classes, or levels you offer in their desired location.</p>
                    </div>
                     {/* Benefit 3: Easy Listing */}
                    <div className="bg-white p-6 rounded-lg border border-border-color shadow-sm text-center hover:shadow-md transition-shadow">
                        <FiEdit className="text-4xl text-blue-500 mx-auto mb-3" />
                        <h3 className="text-lg font-semibold mb-2 text-gray-900">Showcase Your Best</h3>
                        <p className="text-sm text-subtle-text">Create a detailed profile showcasing your facilities, faculty, fees, unique features, photos, and more.</p>
                    </div>
                     {/* Benefit 4: Applications */}
                     <div className="bg-white p-6 rounded-lg border border-border-color shadow-sm text-center hover:shadow-md transition-shadow">
                        <FiCheckSquare className="text-4xl text-purple-500 mx-auto mb-3" />
                        <h3 className="text-lg font-semibold mb-2 text-gray-900">Receive Applications</h3>
                        <p className="text-sm text-subtle-text">Allow students to apply directly through our platform, simplifying the admission process (view applications on your dashboard).</p>
                    </div>
                     {/* Benefit 5: Cost-Effective */}
                    <div className="bg-white p-6 rounded-lg border border-border-color shadow-sm text-center hover:shadow-md transition-shadow">
                        <FiTrendingUp className="text-4xl text-yellow-500 mx-auto mb-3" />
                        <h3 className="text-lg font-semibold mb-2 text-gray-900">Cost-Effective Marketing</h3>
                        <p className="text-sm text-subtle-text">A highly focused and affordable way to reach your target audience compared to broad traditional advertising channels.</p>
                    </div>
                     {/* Benefit 6: Simple Setup */}
                     <div className="bg-white p-6 rounded-lg border border-border-color shadow-sm text-center hover:shadow-md transition-shadow">
                         <FiCheckCircle className="text-4xl text-teal-500 mx-auto mb-3" />
                         <h3 className="text-lg font-semibold mb-2 text-gray-900">Simple Setup</h3>
                         <p className="text-sm text-subtle-text">Our easy-to-use registration form lets you get your institution listed quickly and efficiently.</p>
                     </div>
               </div>
          </section>

          {/* How to Start Section */}
          <section className="py-12 md:py-16 bg-light-bg rounded-lg">
             <div className="container mx-auto px-4 text-center">
                 <h2 className="text-3xl font-bold mb-10 text-gray-800">Get Started in Minutes</h2>
                 <div className="flex flex-col md:flex-row justify-center items-center gap-4 md:gap-8 text-gray-700">
                     <div className="flex items-center">
                        <span className="text-2xl font-bold text-brand mr-2">1.</span>
                        <span>Register Account</span>
                     </div>
                     <span className="hidden md:block text-gray-400">&rarr;</span>
                     <div className="flex items-center">
                        <span className="text-2xl font-bold text-brand mr-2">2.</span>
                         <span>Submit Details</span>
                     </div>
                      <span className="hidden md:block text-gray-400">&rarr;</span>
                     <div className="flex items-center">
                         <span className="text-2xl font-bold text-brand mr-2">3.</span>
                         <span>Get Approved</span>
                     </div>
                      <span className="hidden md:block text-gray-400">&rarr;</span>
                      <div className="flex items-center">
                         <span className="text-2xl font-bold text-brand mr-2">4.</span>
                         <span>Connect!</span>
                     </div>
                 </div>
                  {/* Repeat CTA Button */}
                  <div className="mt-10">
                       <button
                         onClick={handleRegisterClick}
                         disabled={loading}
                         className="bg-brand hover:bg-brand-dark text-white font-bold py-3 px-10 rounded-lg text-lg transition duration-300 shadow-md hover:shadow-lg disabled:opacity-60 transform hover:scale-105"
                       >
                         {loading ? 'Loading...' : 'Register Now'}
                       </button>
                  </div>
             </div>
          </section>
        </>
      )}

      {/* Section 2: Show Auth Modal if needed */}
      <AuthModal isOpen={showAuthModal} onClose={() => setShowAuthModal(false)} />

      {/* Section 3: Show Registration Form if logged in and button clicked */}
      {showRegistrationForm && user && (
         <div className="mt-10 pt-10 border-t border-border-color"> {/* Added separator */}
           <h2 className="text-2xl font-semibold mb-6 text-center text-gray-800">Institution Registration Form</h2>
           <div className="max-w-4xl mx-auto bg-white p-6 md:p-8 rounded-lg shadow-md border border-border-color">
               <InstitutionRegistrationForm userId={user.id} />
           </div>
         </div>
      )}
       {showRegistrationForm && !user && !loading && (
            // This state shouldn't normally be reachable due to handleRegisterClick logic, but as fallback:
            <p className="text-danger text-center mt-4">Please log in to access the registration form.</p>
       )}
    </div>
  );
}