// app/admin/dashboard/AdminActionButtons.tsx
'use client' // This component needs interaction

import React, { useState, useTransition } from 'react';
import { approveInstitution, rejectInstitution } from '@/app/admin/dashboard/actions'; // Import both server actions

interface AdminActionButtonsProps {
  institutionId: string;
  institutionName: string; // For confirmation dialog
}

export default function AdminActionButtons({ institutionId, institutionName }: AdminActionButtonsProps) {
  // Separate pending states for each action
  const [isApprovePending, startApproveTransition] = useTransition();
  const [isRejectPending, startRejectTransition] = useTransition();
  const [error, setError] = useState<string | null>(null); // Optional: display specific errors here

  const handleApprove = () => {
    setError(null);
    startApproveTransition(async () => {
      const result = await approveInstitution(institutionId);
      if (result.error) {
        setError(`Approval failed: ${result.error}`);
        alert(`Approval failed: ${result.error}`); // Simple feedback
      }
      // List refreshes via revalidatePath on success
    });
  };

  const handleReject = () => {
    setError(null);
    // Add confirmation before deleting
    if (!window.confirm(`Are you sure you want to REJECT and DELETE "${institutionName}"? This cannot be undone.`)) {
      return;
    }

    startRejectTransition(async () => {
      const result = await rejectInstitution(institutionId);
      if (result.error) {
        setError(`Rejection failed: ${result.error}`);
        alert(`Rejection failed: ${result.error}`); // Simple feedback
      }
      // List refreshes via revalidatePath on success
    });
  };

  // Determine if any action is pending
  const isAnyPending = isApprovePending || isRejectPending;

  return (
    <div className="flex space-x-2">
      {/* Approve Button */}
      <button
        onClick={handleApprove}
        disabled={isAnyPending} // Disable if any action is pending
        className={`px-2 py-1 text-xs font-medium rounded whitespace-nowrap transition-colors ${
          isApprovePending
            ? 'bg-gray-400 text-gray-700 cursor-not-allowed'
            : 'bg-green-500 hover:bg-green-600 text-white'
        }`}
      >
        {isApprovePending ? 'Approving...' : 'Approve'}
      </button>

      {/* Reject Button */}
      <button
        onClick={handleReject}
        disabled={isAnyPending} // Disable if any action is pending
        className={`px-2 py-1 text-xs font-medium rounded whitespace-nowrap transition-colors ${
          isRejectPending
            ? 'bg-gray-400 text-gray-700 cursor-not-allowed'
            : 'bg-red-500 hover:bg-red-600 text-white'
        }`}
      >
        {isRejectPending ? 'Rejecting...' : 'Reject'}
      </button>

      {/* Optional: Display specific error for this row's actions */}
      {/* {error && <p className="text-red-500 text-xs mt-1">{error}</p>} */}
    </div>
  );
}