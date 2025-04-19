// components/layout/Navbar.tsx (Cleaned)
"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { FiMenu, FiX } from 'react-icons/fi';

export default function Navbar() {
  const { user, signOut, loading, openAuthModal } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = async () => {
    // Removed console logs from here
    try {
      await signOut();
      setIsMobileMenuOpen(false);
    } catch (error) {
      console.error("Error calling signOut in handleLogout:", error);
    }
  };

  const closeMobileMenu = () => setIsMobileMenuOpen(false);
  const linkFontWeight = "font-semibold";
  const linkClasses = `text-white transition-colors text-sm ${linkFontWeight}`;
  const mobileLinkClasses = `block py-1 text-white transition-colors ${linkFontWeight}`;

  return (
    <nav className="bg-brand text-white shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-4">
         <div className="flex justify-between items-center py-3">
            {/* Brand/Logo */}
            <Link href="/" className="font-bold text-2xl text-white transition-opacity" onClick={closeMobileMenu}> FindGreatSchool </Link>

            {/* Desktop Navigation & Auth Links */}
            <div className="hidden md:flex items-center space-x-4 lg:space-x-6">
                <Link href="/" className={linkClasses}>Home</Link>
                <Link href="/search" className={linkClasses}>Explore</Link>
                <Link href="/for-institutions" className={linkClasses}>For Institutions</Link>
                <Link href="/about" className={linkClasses}>About</Link>
                <Link href="/contact" className={linkClasses}>Contact</Link>
               {/* Desktop Auth Section */}
               <div className="flex items-center space-x-3 pl-4 border-l border-sky-400/50">
                   {loading ? ( <span className="text-sm font-medium animate-pulse">...</span> )
                    : user ? ( /* Logged In Desktop */
                     <>
                       <Link href="/dashboard" className={linkClasses}>Dashboard</Link>
                       <span className="text-sm opacity-75 hidden lg:inline">|</span>
                       <span className="text-sm hidden lg:inline opacity-90" title={user.email}>{user.email?.split('@')[0]}</span>
                       <button onClick={handleLogout} className="bg-danger hover:bg-red-700 text-white text-xs font-semibold py-1.5 px-3 rounded-md transition-colors shadow"> Logout </button>
                     </>
                   ) : ( /* Logged Out Desktop */
                     <>
                       <button onClick={openAuthModal} className={linkClasses}>Login</button>
                       <button onClick={openAuthModal} className="bg-white text-brand hover:bg-opacity-90 text-xs font-semibold py-1.5 px-3 rounded-md transition-colors shadow"> Sign Up </button>
                     </>
                   )}
               </div>
            </div>

            {/* Mobile Menu Button */}
            <div className="md:hidden flex items-center"> <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} aria-label="Toggle mobile menu" className="text-white focus:outline-none focus:text-white transition-colors"> {isMobileMenuOpen ? <FiX size={24} /> : <FiMenu size={24} />} </button> </div>
         </div>
      </div>

       {/* Mobile Menu Dropdown */}
       <div className={`absolute top-full left-0 w-full bg-brand-dark shadow-lg md:hidden transition-all duration-300 ease-in-out overflow-hidden ${isMobileMenuOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}>
            <div className="flex flex-col px-4 pt-2 pb-4 space-y-3 text-white">
                <Link href="/" className={mobileLinkClasses} onClick={closeMobileMenu}>Home</Link>
                <Link href="/search" className={mobileLinkClasses} onClick={closeMobileMenu}>Explore Schools</Link>
                <Link href="/for-institutions" className={mobileLinkClasses} onClick={closeMobileMenu}>For Institutions</Link>
                <Link href="/about" className={mobileLinkClasses} onClick={closeMobileMenu}>About</Link>
                <Link href="/contact" className={mobileLinkClasses} onClick={closeMobileMenu}>Contact</Link>
                <hr className="border-sky-500/50 my-2"/>
               <div className="flex flex-col space-y-3 items-start">
                   {loading ? ( <span className="text-sm font-medium animate-pulse py-1">Loading...</span> )
                    : user ? ( /* Logged In Mobile */
                     <>
                       <Link href="/dashboard" className={mobileLinkClasses} onClick={closeMobileMenu}>Dashboard</Link>
                       <span className="text-sm py-1" title={user.email}>{user.email}</span>
                       <button onClick={handleLogout} className="w-full text-left py-1 text-red-300 hover:text-red-100 transition-colors font-medium"> Logout </button>
                     </>
                   ) : ( /* Logged Out Mobile */
                     <>
                       <button onClick={() => { openAuthModal(); closeMobileMenu(); }} className={`${mobileLinkClasses} w-full text-left`}>Login</button>
                       <button onClick={() => { openAuthModal(); closeMobileMenu(); }} className={`${mobileLinkClasses} w-full text-left`}>Sign Up</button>
                     </>
                   )}
               </div>
            </div>
       </div>
    </nav>
  );
}