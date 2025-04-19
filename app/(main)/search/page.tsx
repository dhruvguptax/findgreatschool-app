// app/(main)/search/page.tsx (Updated to open modal)
"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
// Import useAuth AND openAuthModal from context
import { useAuth } from '@/context/AuthContext';

// Reusable button style
const StepButton: React.FC<React.ButtonHTMLAttributes<HTMLButtonElement>> = ({ children, ...props }) => ( /* ... same button style ... */
    <button className="w-full text-left p-4 border rounded-lg hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition" {...props} > {children} </button>
);

export default function SearchStartPage() {
    const router = useRouter();
    // Get user, loading state, AND openAuthModal function
    const { user, loading, openAuthModal } = useAuth();

    const [step, setStep] = useState<'category' | 'detail' | 'city' | 'loading'>('category');
    const [selectedCategory, setSelectedCategory] = useState<'school' | 'coaching' | 'college' | null>(null);
    const [selectedDetail, setSelectedDetail] = useState<string>('');
    const [selectedCity, setSelectedCity] = useState<string>('');

    // Data for Selects (same as before)
    const schoolClasses = ['Nursery', 'LKG', 'UKG', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'];
    const coachingExams = ['JEE (Main/Advanced)', 'NEET', 'CUET', 'UPSC CSE', 'CAT', 'GATE', 'CLAT', 'IBPS PO/Clerk', 'SBI PO/Clerk', 'SSC CGL', 'NDA', 'CA Foundation', 'CS Foundation', 'Other'];
    const collegePrograms = ['B.Tech CSE', 'B.Tech ECE', 'B.Tech Mechanical', 'B.Tech Civil', 'B.Tech EEE', 'MBBS', 'BDS', 'B.Pharm', 'B.Sc Nursing', 'B.Com (Hons)', 'B.Com (General)', 'BBA', 'BCA', 'B.Sc Physics', 'B.Sc Chemistry', 'B.Sc Maths', 'B.Sc Biology', 'BA English', 'BA History', 'BA Political Science', 'BA Economics', 'LLB', 'B.Arch', 'Diploma Engineering', 'MBA', 'MCA', 'Other'];

    // --- Updated useEffect ---
    useEffect(() => {
        // If done loading and still no user, trigger the modal ONCE
        if (!loading && !user) {
            console.log("Search page: User not logged in, opening auth modal.");
            openAuthModal(); // Call context function to open modal
            // No redirect needed here, the modal will handle login/signup
        }
    // Only depend on user and loading state for this effect
    }, [user, loading, openAuthModal]);


    // --- Handler functions remain the same ---
    const handleCategorySelect = (category: 'school' | 'coaching' | 'college') => { setSelectedCategory(category); setStep('detail'); };
    const handleDetailSubmit = (event: React.FormEvent) => { event.preventDefault(); if (selectedDetail.trim()) { setStep('city'); } };
    const handleCitySubmit = (event: React.FormEvent) => { event.preventDefault(); if (selectedCity.trim() && selectedCategory && selectedDetail) { setStep('loading'); const queryParams = new URLSearchParams({ category: selectedCategory, detail: selectedDetail, city: selectedCity.trim(), }); router.push(`/explore?${queryParams.toString()}`); } };


     // --- Updated Render Logic ---
     if (loading) {
         return <div className="text-center py-20">Loading user state...</div>;
     }
     // If user logs in via modal, component re-renders, user exists, show step 1
     // If user closes modal without login, they stay on this page showing this message
     if (!user) {
         return (
             <div className="text-center py-20 container mx-auto px-4">
                 <p className="text-lg text-gray-700">Please sign in or sign up to start your search.</p>
                 {/* The modal should be open via the useEffect or Navbar already */}
             </div>
         );
     }
      if (step === 'loading') {
         return <div className="text-center py-20">Finding institutions...</div>;
     }

    // --- Render steps only if user is logged in ---
    return (
        <div className="container mx-auto px-4 py-8 max-w-2xl">
            <h1 className="text-2xl font-bold mb-6 text-center">Find Your Institution</h1>

            {/* Step 1: Category */}
            {step === 'category' && ( <div className="space-y-4"> <h2 className="font-semibold text-lg mb-3">1. What are you looking for?</h2> <StepButton onClick={() => handleCategorySelect('school')}> <h3 className="font-semibold">🏫 School</h3> <p className="text-sm text-gray-600">Primary, Middle, High Schools</p> </StepButton> <StepButton onClick={() => handleCategorySelect('coaching')}> <h3 className="font-semibold">📚 Coaching Institute</h3> <p className="text-sm text-gray-600">Exam Preparation</p> </StepButton> <StepButton onClick={() => handleCategorySelect('college')}> <h3 className="font-semibold">🎓 College / University</h3> <p className="text-sm text-gray-600">Degree Programs</p> </StepButton> </div> )}
            {/* Step 2: Detail */}
            {step === 'detail' && selectedCategory && ( <form onSubmit={handleDetailSubmit} className="space-y-4"> <h2 className="font-semibold text-lg mb-3">2. Specify Details</h2> <label htmlFor="detail-select" className="block text-sm font-medium text-gray-700 mb-1"> {selectedCategory === 'school' ? 'Select Class:' : selectedCategory === 'coaching' ? 'Select Exam:' : 'Select Program/Degree:'} </label> <select id="detail-select" value={selectedDetail} onChange={(e) => setSelectedDetail(e.target.value)} required className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md border"> <option value="" disabled>-- Please Select --</option> {(selectedCategory === 'school' ? schoolClasses : selectedCategory === 'coaching' ? coachingExams : collegePrograms ).map(opt => <option key={opt} value={opt}>{opt}</option>)} </select> <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded transition-colors">Next: Enter City</button> <button type="button" onClick={() => { setStep('category'); setSelectedDetail(''); }} className="w-full text-sm text-gray-600 hover:underline mt-2">Back to Category</button> </form> )}
            {/* Step 3: City */}
            {step === 'city' && selectedCategory && selectedDetail && ( <form onSubmit={handleCitySubmit} className="space-y-4"> <h2 className="font-semibold text-lg mb-3">3. Enter Your City</h2> <label htmlFor="city-input" className="block text-sm font-medium text-gray-700 mb-1">City Name</label> <input id="city-input" type="text" value={selectedCity} onChange={(e) => setSelectedCity(e.target.value)} required className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" placeholder="e.g., Delhi, Mumbai..."/> <button type="submit" className="w-full bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-4 rounded transition-colors">Find Institutions</button> <button type="button" onClick={() => { setStep('detail'); setSelectedCity(''); }} className="w-full text-sm text-gray-600 hover:underline mt-2">Back to Details</button> </form> )}
        </div>
    );
}