// app/(main)/contact/page.tsx
"use client"; // Needed for hooks like useState, useRef, useEffect and form hooks

import React, { useEffect, useRef, useState } from 'react';
// Import hooks for Server Action state handling
import { useFormState, useFormStatus } from 'react-dom';
// Import the server action from the file you created
import { saveContactMessage } from './actions';

// Submit button component aware of pending state
function SubmitButton() {
  // useFormStatus must be used inside the <form>
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending} // Disable button when form is submitting
      aria-disabled={pending} // Accessibility
      className="mt-2 w-full inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-brand hover:bg-brand-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-dark disabled:opacity-60"
    >
      {pending ? 'Sending...' : 'Send Message'}
    </button>
  );
}

// Main Contact Page Component
export default function ContactPage() {
  // Initial state for the form action result
  const initialState = { message: '', success: false, timestamp: Date.now() }; // Added timestamp to ensure state always updates
  // useFormState hook to manage state updates from the server action
  // Pass the 'saveContactMessage' action function
  const [state, formAction] = useFormState(saveContactMessage, initialState);

  // Ref for the form to reset it after successful submission
  const formRef = useRef<HTMLFormElement>(null);
  // State to manage showing the success/error message briefly
  const [displayMessage, setDisplayMessage] = useState<string | null>(null);

  // Effect to reset the form if submission was successful
  // Also handles displaying the message from the action state
  useEffect(() => {
    if (state.message) { // Check if there's a new message from the action
        setDisplayMessage(state.message); // Show the message
        if (state.success) {
            formRef.current?.reset(); // Reset form fields on success
             // Optional: Clear message after a delay
             const timer = setTimeout(() => setDisplayMessage(null), 5000); // Clear after 5s
             return () => clearTimeout(timer);
        }
    }
  }, [state]); // Depend on the state returned by useFormState


  return (
    <div className="container mx-auto px-4 py-8 md:py-12">
      <h1 className="text-3xl md:text-4xl font-bold text-center mb-8 text-gray-800">
        Contact Us
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 max-w-4xl mx-auto">

        {/* --- Contact Information Section (Updated Info) --- */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-border-color space-y-4">
           <h2 className="text-xl font-semibold text-brand-dark mb-3">Get in Touch</h2>
           <p className="text-subtle-text text-sm leading-relaxed">
             Have questions about finding a school, listing your institution, or using our platform? We're here to help!
           </p>
           <div className="space-y-3 pt-2">
             <div>
               <h3 className="font-medium text-base-text text-sm">Email Us:</h3>
               {/* Use provided email */}
               <a href="mailto:dg@findgreatschool.com" className="text-link-color hover:text-brand-dark hover:underline text-sm">
                 dg@findgreatschool.com
               </a>
             </div>
             <div>
               <h3 className="font-medium text-base-text text-sm">Phone:</h3>
               {/* Use provided phone */}
               <p className="text-subtle-text text-sm">+91 6396290814</p>
             </div>
              {/* Address removed as requested */}
           </div>
        </div>

        {/* --- Contact Form Section (Functional) --- */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-border-color">
           <h2 className="text-xl font-semibold text-brand-dark mb-4">Send Us a Message</h2>
           {/* Form now uses the server action */}
           <form ref={formRef} action={formAction} className="space-y-4">
             <div>
               <label htmlFor="name" className="block text-sm font-medium text-base-text mb-1">Your Name</label>
               <input type="text" id="name" name="name" required className="block w-full px-3 py-2 border border-border-color rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-sm"/>
             </div>
             <div>
               <label htmlFor="email" className="block text-sm font-medium text-base-text mb-1">Your Email</label>
               <input type="email" id="email" name="email" required className="block w-full px-3 py-2 border border-border-color rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-sm"/>
             </div>
              <div>
               <label htmlFor="subject" className="block text-sm font-medium text-base-text mb-1">Subject</label>
               <input type="text" id="subject" name="subject" required className="block w-full px-3 py-2 border border-border-color rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-sm"/>
             </div>
             <div>
               <label htmlFor="message" className="block text-sm font-medium text-base-text mb-1">Message</label>
               <textarea id="message" name="message" rows={4} required className="block w-full px-3 py-2 border border-border-color rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-sm"/>
             </div>
             <div>
               {/* Use the SubmitButton component */}
               <SubmitButton />
             </div>
             {/* Display success/error messages returned from the server action state */}
             <div aria-live="polite" className="mt-2 text-sm h-4"> {/* Reserve space for message */}
                {displayMessage && (
                    <p className={`${state.success ? 'text-green-600' : 'text-red-600'}`}>
                       {displayMessage}
                    </p>
                  )}
             </div>
           </form>
        </div>

      </div>
    </div>
  );
}