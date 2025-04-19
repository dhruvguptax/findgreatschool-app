// components/journey/AskCityModal.tsx
"use client";

import React, { useState } from 'react';
import Modal from '@/components/ui/Modal';

interface AskCityModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCitySubmit: (city: string) => void;
}

export default function AskCityModal({ isOpen, onClose, onCitySubmit }: AskCityModalProps) {
  const [city, setCity] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (city.trim()) {
      onCitySubmit(city.trim());
      onClose(); // Close modal
    }
  };

  // TODO: Implement GPS location later
  const handleUseLocation = () => {
     alert("GPS location feature not implemented yet.");
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Enter Your City">
      <form onSubmit={handleSubmit} className="space-y-4 mt-4">
        <label htmlFor="city-input" className="block text-sm font-medium text-gray-700">
          City Name
        </label>
        <input
          id="city-input"
          type="text"
          value={city}
          onChange={(e) => setCity(e.target.value)}
          required
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          placeholder="e.g., Delhi, Mumbai, Bangalore..."
        />

        {/* Optional: Button for GPS - implement later */}
        {/* <button
          type="button"
          onClick={handleUseLocation}
          className="w-full text-sm text-blue-600 hover:underline"
        >
          Or Use Current Location
        </button> */}

        <button
          type="submit"
          className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          Find Schools
        </button>
      </form>
    </Modal>
  );
}