// app/(main)/page.tsx (Simplified - Uses AuthContext for Modal)
"use client";

import React from 'react'; // No longer need useState here
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
// REMOVED: import AuthModal from '@/components/auth/AuthModal';
import { useRouter } from 'next/navigation';
import { FiSearch, FiGrid, FiCheckSquare, FiUsers } from 'react-icons/fi';
import ScrollAnimate from '@/components/ui/ScrollAnimate';

export default function HomePage() {
    // Get user, loading state, and openAuthModal function from context
    const { user, loading, openAuthModal } = useAuth();
    const router = useRouter();
    // REMOVED: const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

    const handleStartExploring = () => {
        if (loading) return;
        if (user) {
            router.push('/search'); // Navigate logged-in users
        } else {
            // --- CHANGE: Call context function to open modal ---
            openAuthModal();
        }
    };

    // No other modal handlers or states needed here

    return (
        <>
            {/* All sections remain the same */}
            {/* --- Hero Section --- */}
            <section className="text-center py-16 md:py-24 bg-gradient-to-b from-sky-50 via-white to-white"> <div className="container mx-auto px-4"> <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4 text-slate-900"> Find the Perfect School, Coaching, or College for You </h1> <p className="text-lg md:text-xl text-subtle-text mb-10 max-w-3xl mx-auto"> Search thousands of institutions, compare your options side-by-side, and apply directly – all in one place. Your educational journey starts here. </p> <button onClick={handleStartExploring} disabled={loading} className="bg-success hover:bg-green-700 text-white font-bold py-3 px-10 rounded-lg text-lg shadow-md hover:shadow-lg disabled:opacity-60 transform hover:scale-105 transition-all duration-300 ease-in-out" > {loading ? 'Loading...' : 'Start Exploring Now'} </button> </div> </section>

            {/* --- Benefit Highlights Section --- */}
             <section className="py-16 md:py-20 bg-light-bg overflow-hidden"> <div className="container mx-auto px-4"> <ScrollAnimate> <h2 className="text-3xl font-bold text-center mb-12 text-gray-800">Why Use FindGreatSchool?</h2> <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center"> <div className="p-6"> <FiSearch className="text-5xl text-brand mx-auto mb-4"/> <h3 className="text-xl font-semibold mb-2 text-gray-900">Comprehensive Search</h3> <p className="text-sm text-subtle-text">Access a vast database...</p> </div> <div className="p-6"> <FiGrid className="text-5xl text-brand mx-auto mb-4"/> <h3 className="text-xl font-semibold mb-2 text-gray-900">Easy Comparison</h3> <p className="text-sm text-subtle-text">Select multiple institutions...</p> </div> <div className="p-6"> <FiCheckSquare className="text-5xl text-brand mx-auto mb-4"/> <h3 className="text-xl font-semibold mb-2 text-gray-900">Direct Application</h3> <p className="text-sm text-subtle-text">Streamline your application process...</p> </div> </div> </ScrollAnimate> </div> </section>

            {/* --- How It Works Section --- */}
             <section className="py-16 md:py-20 bg-white overflow-hidden"> <div className="container mx-auto px-4 text-center"> <ScrollAnimate delay="delay-100"> <h2 className="text-3xl font-bold mb-12 text-gray-800">Get Started in 3 Simple Steps</h2> <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12"> <div className="p-6 border border-border-color rounded-lg shadow-sm bg-white hover:shadow-lg transition-shadow"> <div className="text-6xl mb-4 text-blue-500">1.</div> <h3 className="text-xl font-semibold mb-2 text-gray-900">Search & Filter</h3> <p className="text-sm text-subtle-text">Use our powerful filters...</p> </div> <div className="p-6 border border-border-color rounded-lg shadow-sm bg-white hover:shadow-lg transition-shadow"> <div className="text-6xl mb-4 text-green-500">2.</div> <h3 className="text-xl font-semibold mb-2 text-gray-900">Compare Details</h3> <p className="text-sm text-subtle-text">View detailed profiles...</p> </div> <div className="p-6 border border-border-color rounded-lg shadow-sm bg-white hover:shadow-lg transition-shadow"> <div className="text-6xl mb-4 text-purple-500">3.</div> <h3 className="text-xl font-semibold mb-2 text-gray-900">Apply Online</h3> <p className="text-sm text-subtle-text">Submit your application...</p> </div> </div> </ScrollAnimate> </div> </section>

            {/* --- Categories Section --- */}
            <section className="py-16 md:py-20 bg-light-bg overflow-hidden"> <div className="container mx-auto px-4 text-center"> <ScrollAnimate delay="delay-200"> <h2 className="text-3xl font-bold mb-12 text-gray-800">Explore Top Categories</h2> <div className="grid grid-cols-1 sm:grid-cols-3 gap-8"> <Link href="/search?category=school" className="block p-8 bg-white rounded-lg shadow-md hover:shadow-xl hover:scale-105 transition-all cursor-pointer"> <div className="text-5xl mb-4">🏫</div> <h3 className="text-xl font-semibold text-gray-900">Schools</h3> </Link> <Link href="/search?category=coaching" className="block p-8 bg-white rounded-lg shadow-md hover:shadow-xl hover:scale-105 transition-all cursor-pointer"> <div className="text-5xl mb-4">📚</div> <h3 className="text-xl font-semibold text-gray-900">Coaching</h3> </Link> <Link href="/search?category=college" className="block p-8 bg-white rounded-lg shadow-md hover:shadow-xl hover:scale-105 transition-all cursor-pointer"> <div className="text-5xl mb-4">🎓</div> <h3 className="text-xl font-semibold text-gray-900">Colleges</h3> </Link> </div> </ScrollAnimate> </div> </section>

            {/* --- For Institutions CTA Section --- */}
             <section className="py-16 md:py-20 bg-brand text-white overflow-hidden"> <div className="container mx-auto px-4 text-center"> <ScrollAnimate> <FiUsers className="text-6xl mx-auto mb-4 opacity-80"/> <h2 className="text-3xl font-bold mb-4">Are You an Institution?</h2> <p className="opacity-90 mb-8 max-w-xl mx-auto">Join hundreds of leading schools...</p> <Link href="/for-institutions" passHref> <button className="bg-white text-brand hover:bg-opacity-95 font-semibold py-2.5 px-8 rounded-lg text-base transition duration-300 shadow-md hover:shadow-lg transform hover:scale-105"> List Your Institution Free </button> </Link> </ScrollAnimate> </div> </section>

            {/* --- REMOVE AuthModal Rendering from here --- */}
            {/* It's now rendered in the layout */}
        </>
    );
}