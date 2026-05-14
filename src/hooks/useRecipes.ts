import { useQuery } from '@tanstack/react-query';
import { searchRecipes } from '../lib/api';

export const useClearFridge = (ingredients: string[]) => {
  return useQuery({
    queryKey: ['recipes', ingredients], // If I add an apple to the fridge, the queryKey changes, and React Query knows it's time to fetch fresh data

    queryFn: async () => {
      if (!ingredients || ingredients.length === 0) return { results: [] };
      const data = await searchRecipes(ingredients);
      
      return data;
    },
    
    enabled: ingredients.length > 0,
    staleTime: 1000 * 60 * 10, 
  });
};

// what this hook for in summary is mainly Wait!
// I fetched this exact same list of ingredients 2 minutes ago. Here is the saved data instantly.