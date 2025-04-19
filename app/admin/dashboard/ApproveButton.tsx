// app/admin/dashboard/ApproveButton.tsx
'use client' // This component needs interaction

import React, { useState, useTransition } from 'react';
import { approveInstitution } from './actions'; // Import the server action

interface ApproveButtonProps {
  institutionId: string;
}

export default function ApproveButton({ institutionId }: ApproveButtonProps) {
  // useTransition hook for pending UI state without blocking
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const handleApprove = () => {
    setError(null);
    startTransition(async () => {
      const result = await approveInstitution(institutionId);
      if (result.error) {
        setError(result.error);
        alert(`Failed to approve: ${result.error}`); // Simple alert for now
      } else {
        // Success state handled by revalidation automatically refreshing list
         console.log(`Approval action finished for ${institutionId}`);
      }
    });
  };

  return (
    <button
      onClick={handleApprove}
      disabled={isPending}
      className={`px-3 py-1 text-xs font-medium rounded ${
        isPending
          ? 'bg-gray-400 text-gray-700 cursor-not-allowed'
          : 'bg-green-500 hover:bg-green-600 text-white'
      }`}
    >
      {isPending ? 'Approving...' : 'Approve'}
    </button>
  );
}