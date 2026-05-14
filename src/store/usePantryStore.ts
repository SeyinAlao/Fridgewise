import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { PantryState } from '../types';


export const usePantryStore = create<PantryState>()(
  persist( // The persist middleware is used to auto save the state to localStorage and retrieve it on app load, ensuring that the user's data persists across sessions without needing a backend
    (set) => ({
      fridgeItems: [],
      mealPlan: [],
      totalWeeklyBudgetNGN: 0,
      exchangeRate: 1400, 

      addFridgeItem: (itemName) => 
        set((state) => ({
          fridgeItems: [
            ...state.fridgeItems, 
            { id: crypto.randomUUID(), name: itemName, dateAdded: Date.now() } // rather than installing heavy external libraries i decided to use the built in crypto api to generate unique ids for fridge items,
          ]  //  this is supported in modern browsers and provides a simple way to ensure uniqueness without adding extra dependencies
        })),

      removeFridgeItem: (id) =>
        set((state) => ({
          fridgeItems: state.fridgeItems.filter((item) => item.id !== id)
        })),

      addMealToPlan: (meal) =>
        set((state) => {
          const costInNGN = meal.priceInUSD * state.exchangeRate;
          return {
            mealPlan: [...state.mealPlan, meal],
            totalWeeklyBudgetNGN: state.totalWeeklyBudgetNGN + costInNGN
          };
        }),

      removeMealFromPlan: (mealId) =>
        set((state) => {
          const mealToRemove = state.mealPlan.find((m) => m.id === mealId);
          if (!mealToRemove) return state;

          const costInNGN = mealToRemove.priceInUSD * state.exchangeRate;
          return {
            mealPlan: state.mealPlan.filter((m) => m.id !== mealId),
            totalWeeklyBudgetNGN: Math.max(0, state.totalWeeklyBudgetNGN - costInNGN) //  using Math.max to ensure that the budget never goes negative, which could happen if there's a mismatch in javascript Math or exchange rates
          };
        }),

      updateExchangeRate: (newRate) => set({ exchangeRate: newRate }),

      resetStore: () => set({ fridgeItems: [], mealPlan: [], totalWeeklyBudgetNGN: 0 })
    }),
    {
      name: 'smart-pantry-storage', 
    }
  )
);