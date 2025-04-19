// app/(main)/school/[id]/ApplyButtonClient.tsx
'use client'

import React, { useState, useTransition } from 'react';
import { handleApply } from './actions'; // Import the server action

interface ApplyButtonClientProps {
  institutionId: string;
  institutionName: string; // Pass name for confirmation/messages
}

export default function ApplyButtonClient({ institutionId, institutionName }: ApplyButtonClientProps) {
  const [isPending, startTransition] = useTransition(); // Pending state for server action
  const [message, setMessage] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState<boolean | null>(null);
  const [hasApplied, setHasApplied] = useState(false); // Track if applied in this session

  const onApplySubmit = async () => {
    setMessage(null);
    setIsSuccess(null);

    // Optional: Basic confirmation
    // if (!confirm(`Are you sure you want to apply to ${institutionName}?`)) {
    //   return;
    // }

    startTransition(async () => {
      const result = await handleApply(institutionId);
      setMessage(result.message);
      setIsSuccess(result.success);
      if (result.success || result.message === 'You have already applied to this institution.') {
          setHasApplied(true); // Disable button after successful apply or if already applied
      }
    });
  };

  return (
    <div className="text-center mt-10">
      <button
        onClick={onApplySubmit}
        disabled={isPending || hasApplied} // Disable while pending or after applying
        className={`font-bold py-3 px-8 rounded-lg text-lg transition duration-300 disabled:opacity-60 ${
          hasApplied && isSuccess !== false // Keep green if successfully applied
            ? 'bg-gray-500 hover:bg-gray-500 cursor-not-allowed'
            : 'bg-green-500 hover:bg-green-600'
        } text-white`}
      >
        {isPending ? 'Submitting...' : hasApplied ? 'Applied' : 'Apply Now'}
      </button>

      {/* Display Success/Error Message */}
      {message && (
        <p className={`mt-4 text-sm ${isSuccess ? 'text-green-600' : 'text-red-600'}`}>
          {message}
        </p>
      )}
    </div>
  );
}