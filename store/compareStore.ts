// store/compareStore.ts
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware'; // To save compare list across sessions (optional)

interface CompareState {
  items: string[]; // Array of institution IDs
  maxItems: number;
  addCompareItem: (id: string) => void;
  removeCompareItem: (id: string) => void;
  isComparing: (id: string) => boolean;
  clearCompare: () => void;
}

// Define the store using Zustand
export const useCompareStore = create<CompareState>()(
  // Optional: Use persist middleware to save state in localStorage
  persist(
    (set, get) => ({
      items: [], // Initial state: empty array
      maxItems: 5, // Limit comparison to e.g., 5 items

      // Action to add an item ID
      addCompareItem: (id) => {
        // Only add if not already present and below max limit
        if (get().items.length < get().maxItems && !get().items.includes(id)) {
          set((state) => ({ items: [...state.items, id] }));
        } else if (get().items.length >= get().maxItems) {
            alert(`You can only compare up to ${get().maxItems} institutions at a time.`);
        }
      },

      // Action to remove an item ID
      removeCompareItem: (id) => {
        set((state) => ({ items: state.items.filter((itemId) => itemId !== id) }));
      },

      // Helper function to check if an ID is already in the list
      isComparing: (id) => {
        return get().items.includes(id);
      },

      // Action to clear the comparison list
      clearCompare: () => {
        set({ items: [] });
      },
    }),
    {
      name: 'compare-storage', // Name for localStorage key
      storage: createJSONStorage(() => localStorage), // Use localStorage
      // Optionally limit what gets persisted:
      // partialize: (state) => ({ items: state.items }),
    }
  )
);